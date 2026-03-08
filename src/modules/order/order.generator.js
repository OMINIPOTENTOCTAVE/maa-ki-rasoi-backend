const cron = require('node-cron');
const prisma = require('../../prisma');
const timeUtils = require('../../utils/timeUtils');

/**
 * Automates the generation of physical routing Orders based on 
 * Active subscriptions and the V4 precise PAUSE logic.
 * Executed via Cron at 10:30 PM IST daily.
 */
async function generateOrdersForNextDelivery() {
    const now = timeUtils.getISTTimestamp();
    const targetDate = await timeUtils.getNextDeliveryDate(timeUtils.startOfISTDay(now));

    console.log(`\n[ORDER-CRON] Initializing generation for target date: ${targetDate.toISOString().split('T')[0]}`);

    // 1. Validate a menu was published
    const dailyMenu = await prisma.dailyMenu.findUnique({
        where: { date: targetDate },
        include: { item1: true }
    });

    if (!dailyMenu || dailyMenu.status !== 'PUBLISHED' || !dailyMenu.item1) {
        console.error(`[ORDER-CRON] FATAL: No PUBLISHED menu found for ${targetDate.toISOString()}. Skipping. Admin action required.`);
        return;
    }

    // 2. Fetch practically active subscriptions mapping the physical V4 rules
    const activeSubs = await prisma.subscription.findMany({
        where: {
            status: 'Active',
            tiffinsRemaining: { gt: 0 },
            endDate: { gte: targetDate }
        },
        include: { customer: true }
    });

    // 3. Filter out paused records using exact effective dates
    const validSubs = activeSubs.filter(sub => {
        if (sub.paused && sub.pauseEffectiveFrom && sub.pauseEffectiveFrom <= targetDate) {
            return false; // Dropped: User paused prior to the cutoff window
        }
        return true;
    });

    console.log(`[ORDER-CRON] Identified ${validSubs.length} active valid subscriptions for dispatch.`);

    let createdCount = 0;

    // 4. Generate the dispatch records (Idempotent)
    for (const sub of validSubs) {
        const existingOrder = await prisma.order.findFirst({
            where: {
                subscriptionId: sub.id,
                dailyMenuId: dailyMenu.id
            }
        });

        if (existingOrder) continue;

        await prisma.order.create({
            data: {
                customerName: sub.customer.name || 'Customer',
                customerPhone: sub.customer.phone || '',
                address: sub.customer.address || '',
                totalAmount: 100, // Fixed 100 INR Rule 2
                status: 'Pending', // Spawns directly onto the Kitchen Display
                customerId: sub.customerId,
                subscriptionId: sub.id,
                dailyMenuId: dailyMenu.id,
                paymentMethod: sub.paymentMethod,
                paymentStatus: sub.paymentStatus,
                deliveryZoneId: sub.deliveryZoneId,
                mealSlot: sub.mealSlot,
                deliveryType: 'SUBSCRIPTION'
            }
        });
        createdCount++;
    }

    console.log(`[ORDER-CRON] SUCCESS: Provisioned ${createdCount} new orders. Physical dispatch readiness achieved.\n`);
}

function initOrderCron() {
    // 10:30 PM rigidly tied to IST mapping PRD Rule 10
    cron.schedule('30 22 * * *', async () => {
        try {
            await generateOrdersForNextDelivery();
        } catch (error) {
            console.error('[ORDER-CRON] CRITICAL CRASH:', error);
        }
    }, {
        timezone: "Asia/Kolkata"
    });
    console.log('[ORDER-CRON] Job registered. Spawning active orders natively at 10:30 PM IST daily.');
}

module.exports = { initOrderCron, generateOrdersForNextDelivery };
