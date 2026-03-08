const prisma = require('../../prisma');
const timeUtils = require('../../utils/timeUtils');

/**
 * Validates and calculates a new subscription
 */
async function createSubscription(customerId, data) {
    const { planType, mealSlot = "LUNCH", startDate, paymentMethod = "COD", deliveryZoneId = "ZONE_1" } = data;

    let totalTiffins = 0;
    if (planType === 'Weekly') totalTiffins = 6;
    else if (planType === 'Monthly') totalTiffins = 26;
    else throw new Error("Invalid planType. Must be Weekly or Monthly.");

    const start = timeUtils.startOfISTDay(new Date(startDate));
    if (isNaN(start.getTime())) throw new Error("Invalid start date");

    // UNBREAKABLE RULE 7: NEVER allow two ACTIVE subscriptions for same userId + mealSlot
    const existingActive = await prisma.subscription.findFirst({
        where: { customerId, mealSlot, status: 'Active' }
    });
    if (existingActive) throw new Error(`You already have an active ${mealSlot} subscription.`);

    const totalPrice = totalTiffins * 100; // Flat ₹100 per tiffin per PRD rule
    const endDate = await timeUtils.calculateEndDate(start, totalTiffins);

    return await prisma.subscription.create({
        data: {
            customerId,
            planType,
            mealSlot,
            dietaryPreference: 'VEG', // Strictly pure veg
            startDate: start,
            endDate,
            totalTiffins,
            tiffinsRemaining: totalTiffins,
            tiffinsDelivered: 0,
            totalPrice,
            paymentMethod,
            paymentStatus: 'Pending',
            securityDepositAmt: paymentMethod === 'COD' ? 500 : 0,
            securityDepositPaid: false,
            deliveryZoneId,
            status: 'Payment Pending'
        }
    });
}

/**
 * Pauses a subscription
 */
async function pauseSubscription(id, customerId) {
    const sub = await prisma.subscription.findUnique({ where: { id } });

    if (!sub || (customerId && sub.customerId !== customerId)) {
        throw new Error("Subscription not found");
    }
    if (sub.paused || sub.status !== 'Active') {
        throw new Error("Subscription cannot be paused in its current state.");
    }
    if (sub.tiffinsRemaining <= 0) {
        throw new Error("No tiffins remaining to pause.");
    }

    const effectiveDate = timeUtils.getEffectiveDate();

    return await prisma.subscription.update({
        where: { id },
        data: {
            paused: true,
            pausedAt: timeUtils.getISTTimestamp(),
            pauseEffectiveFrom: effectiveDate
        }
    });
}

/**
 * Resumes a subscription
 */
async function resumeSubscription(id, customerId) {
    const sub = await prisma.subscription.findUnique({ where: { id } });

    if (!sub || (customerId && sub.customerId !== customerId)) {
        throw new Error("Subscription not found");
    }
    if (!sub.paused) {
        throw new Error("Subscription is already active.");
    }

    const effectiveDate = timeUtils.getEffectiveDate();
    let daysToAdd = 0;

    // Calculate how many delivery days were lost during the pause window
    if (sub.pauseEffectiveFrom && effectiveDate > sub.pauseEffectiveFrom) {
        daysToAdd = await timeUtils.countDeliveryDays(sub.pauseEffectiveFrom, timeUtils.addDays(effectiveDate, -1));
    }

    const newEndDate = await timeUtils.addDeliveryDays(sub.endDate, daysToAdd);

    return await prisma.subscription.update({
        where: { id },
        data: {
            paused: false,
            pausedTotalDays: sub.pausedTotalDays + daysToAdd,
            pauseEffectiveFrom: null,
            pausedAt: null,
            endDate: newEndDate
        }
    });
}

/**
 * Cancels a subscription and calculates prorated refund
 */
async function cancelSubscription(id, reason, cancelledBy) {
    const sub = await prisma.subscription.findUnique({ where: { id } });
    if (!sub || sub.status !== 'Active') throw new Error("Subscription not valid for cancellation.");

    const remainingValue = sub.tiffinsRemaining * 100;

    return await prisma.subscription.update({
        where: { id },
        data: {
            status: 'Cancelled',
            cancelledAt: timeUtils.getISTTimestamp(),
            cancelledBy,
            cancellationReason: reason
            // refund processing is handled by Payment module separately via webhooks or admin dashboard
        }
    });
}

/**
 * Get customer's active subscription
 */
async function getCustomerSubscriptions(customerId) {
    return await prisma.subscription.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' }
    });
}

module.exports = {
    createSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    getCustomerSubscriptions
};
