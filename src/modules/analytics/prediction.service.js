const Sentry = require('@sentry/node');
const prisma = require('../../prisma');
const timeUtils = require('../../utils/timeUtils');
const { subDays, getDay } = require('date-fns');

/**
 * AI Forecasting Service — Weekday Seasonal Average Model
 * 
 * Algorithm:
 * 1. Fetch last 4 same-weekday order counts, grouped by deliveryZoneId (clusterId)
 * 2. Calculate mean predicted meals per cluster
 * 3. Apply subscriber adjustment: currentActiveSubs / avgActiveSubs
 * 4. Confidence = max(60, min(95, 100 - (std_dev / mean * 100)))
 * 
 * Safeguards:
 * - Fallback to last-week same-day average on error
 * - Confidence clamped to [60, 95]
 * - Upserts to prevent duplicate predictions
 */

/**
 * Generate forecasted predictions for a target date and store them.
 * @param {Date} targetDate - The date to predict for (IST start-of-day)
 */
async function generatePredictions(targetDate) {
    try {
        console.log(`[FORECAST] Generating predictions for ${targetDate.toISOString().split('T')[0]}`);

        const predictions = await calculateForecast(targetDate);

        // Upsert predictions (safeguard #1 — @@unique prevents duplicates)
        for (const pred of predictions) {
            await prisma.productionPrediction.upsert({
                where: {
                    date_clusterId: {
                        date: targetDate,
                        clusterId: pred.clusterId
                    }
                },
                update: {
                    predictedMeals: pred.predictedMeals,
                    confidence: pred.confidence
                },
                create: {
                    date: targetDate,
                    clusterId: pred.clusterId,
                    predictedMeals: pred.predictedMeals,
                    confidence: pred.confidence
                }
            });
        }

        console.log(`[FORECAST] SUCCESS: Saved ${predictions.length} cluster predictions.`);
        return predictions;
    } catch (error) {
        console.error('[FORECAST] Primary forecast failed, attempting fallback:', error.message);
        Sentry.captureException(error);

        // Safeguard #3 — Fallback to last-week same-day average
        try {
            const fallback = await getLastWeekSameDayAverage(targetDate);

            for (const pred of fallback) {
                await prisma.productionPrediction.upsert({
                    where: {
                        date_clusterId: {
                            date: targetDate,
                            clusterId: pred.clusterId
                        }
                    },
                    update: {
                        predictedMeals: pred.predictedMeals,
                        confidence: pred.confidence
                    },
                    create: {
                        date: targetDate,
                        clusterId: pred.clusterId,
                        predictedMeals: pred.predictedMeals,
                        confidence: pred.confidence
                    }
                });
            }

            console.log(`[FORECAST] FALLBACK: Saved ${fallback.length} predictions from last-week same-day.`);
            return fallback;
        } catch (fallbackError) {
            console.error('[FORECAST] CRITICAL: Fallback also failed:', fallbackError.message);
            Sentry.captureException(fallbackError);
            return [];
        }
    }
}

/**
 * Core forecasting algorithm — Weekday Seasonal Average with subscriber adjustment.
 * @param {Date} targetDate
 * @returns {Array<{clusterId, predictedMeals, confidence}>}
 */
async function calculateForecast(targetDate) {
    const targetDayOfWeek = getDay(targetDate); // 0=Sun, 1=Mon, ...

    // Find the last 4 same-weekday dates (e.g., last 4 Tuesdays)
    const sameWeekdayDates = [];
    let checkDate = subDays(targetDate, 7);
    for (let i = 0; i < 4; i++) {
        sameWeekdayDates.push(timeUtils.startOfISTDay(checkDate));
        checkDate = subDays(checkDate, 7);
    }

    // Fetch orders for those dates, grouped by deliveryZoneId
    const historicalOrders = await prisma.order.findMany({
        where: {
            dailyMenu: {
                date: { in: sameWeekdayDates }
            }
        },
        select: {
            deliveryZoneId: true,
            dailyMenu: { select: { date: true } }
        }
    });

    // Group by cluster (deliveryZoneId) and date
    const clusterDateMap = {};
    for (const order of historicalOrders) {
        const cluster = order.deliveryZoneId || 'UNKNOWN';
        const dateKey = order.dailyMenu?.date?.toISOString().split('T')[0] || 'unknown';

        if (!clusterDateMap[cluster]) clusterDateMap[cluster] = {};
        if (!clusterDateMap[cluster][dateKey]) clusterDateMap[cluster][dateKey] = 0;
        clusterDateMap[cluster][dateKey]++;
    }

    // Get current active subscriber count for adjustment
    const currentActiveSubs = await prisma.subscription.count({
        where: { status: 'Active', tiffinsRemaining: { gt: 0 } }
    });

    // Calculate average active subs during the historical window
    const windowStart = sameWeekdayDates[sameWeekdayDates.length - 1]; // oldest
    const windowEnd = sameWeekdayDates[0]; // most recent
    const historicalSubs = await prisma.subscription.count({
        where: {
            status: { in: ['Active', 'Cancelled'] },
            createdAt: { lte: windowEnd },
            OR: [
                { cancelledAt: null },
                { cancelledAt: { gte: windowStart } }
            ]
        }
    });
    const avgHistoricalSubs = historicalSubs > 0 ? historicalSubs : 1;

    // Subscriber adjustment ratio
    const subAdjustment = currentActiveSubs > 0
        ? currentActiveSubs / avgHistoricalSubs
        : 1;

    // Build predictions per cluster
    const predictions = [];

    for (const [clusterId, dateMap] of Object.entries(clusterDateMap)) {
        const counts = Object.values(dateMap);
        const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
        const stdDev = Math.sqrt(
            counts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / counts.length
        );

        // Predicted meals with subscriber adjustment
        const predictedMeals = Math.round(mean * subAdjustment);

        // Safeguard #5 — Confidence clamped to [60, 95]
        const rawConfidence = mean > 0 ? 100 - (stdDev / mean * 100) : 60;
        const confidence = Math.max(60, Math.min(95, rawConfidence));

        predictions.push({
            clusterId,
            predictedMeals: Math.max(1, predictedMeals), // At least 1
            confidence: Math.round(confidence * 10) / 10  // 1 decimal
        });
    }

    // If no historical data, generate a single prediction from current subs
    if (predictions.length === 0 && currentActiveSubs > 0) {
        predictions.push({
            clusterId: 'ZONE_1',
            predictedMeals: currentActiveSubs,
            confidence: 60 // Minimum confidence — no historical data
        });
    }

    return predictions;
}

/**
 * Safeguard #3 — Fallback: Last week same-day average.
 * @param {Date} targetDate
 * @returns {Array<{clusterId, predictedMeals, confidence}>}
 */
async function getLastWeekSameDayAverage(targetDate) {
    const lastWeekDate = subDays(targetDate, 7);
    const lastWeekStart = timeUtils.startOfISTDay(lastWeekDate);

    const orders = await prisma.order.findMany({
        where: {
            dailyMenu: {
                date: lastWeekStart
            }
        },
        select: { deliveryZoneId: true }
    });

    // Group by cluster
    const clusterCounts = {};
    for (const order of orders) {
        const cluster = order.deliveryZoneId || 'UNKNOWN';
        clusterCounts[cluster] = (clusterCounts[cluster] || 0) + 1;
    }

    return Object.entries(clusterCounts).map(([clusterId, count]) => ({
        clusterId,
        predictedMeals: count,
        confidence: 60 // Low confidence for fallback
    }));
}

/**
 * Retrieve cached predictions for a given date.
 * Safeguard #4 — Dashboard reads from cache, never recalculates.
 * @param {Date} date
 */
async function getCachedPredictions(date) {
    return prisma.productionPrediction.findMany({
        where: { date },
        orderBy: { clusterId: 'asc' }
    });
}

module.exports = {
    generatePredictions,
    getCachedPredictions
};
