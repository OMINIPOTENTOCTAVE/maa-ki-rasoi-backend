const prisma = require("../../prisma");

const timeUtils = require("../../utils/timeUtils");

/**
 * GET /analytics/launch-console
 * Founder Launch Console — 5 critical numbers for daily operations.
 */
const getLaunchConsole = async (req, res) => {
    try {
        const nowIST = timeUtils.getISTTimestamp();
        const startOfDayIST = timeUtils.startOfISTDay(nowIST);

        // Run all queries in parallel for speed
        const [ordersToday, openComplaints, activeZones] = await Promise.all([
            // 1 & 2 & 3: Orders, meals to cook, revenue
            prisma.order.findMany({
                where: { createdAt: { gte: startOfDayIST } },
                select: { status: true, totalAmount: true, deliveryZoneId: true }
            }),
            // 4: Open complaints
            prisma.complaint.count({
                where: { status: 'Open' }
            }),
            // 5: Active delivery zones
            prisma.order.findMany({
                where: {
                    createdAt: { gte: startOfDayIST },
                    status: { in: ['Pending', 'Preparing', 'OutForDelivery', 'Delivered'] }
                },
                select: { deliveryZoneId: true },
                distinct: ['deliveryZoneId']
            })
        ]);

        const totalOrders = ordersToday.length;
        const mealsToCook = ordersToday.filter(o => ['Pending', 'Preparing'].includes(o.status)).length;
        const revenue = ordersToday
            .filter(o => o.status === 'Delivered')
            .reduce((sum, o) => sum + o.totalAmount, 0);
        const zones = activeZones.map(z => z.deliveryZoneId).filter(Boolean);

        res.json({
            success: true,
            data: {
                todayOrders: totalOrders,
                mealsToCook,
                revenueToday: revenue,
                openComplaints,
                activeZones: zones.length,
                zoneList: zones
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getKPIs = async (req, res) => {
    try {
        const nowIST = timeUtils.getISTTimestamp();
        const startOfDayIST = timeUtils.startOfISTDay(nowIST);

        const startOfWeekIST = new Date(startOfDayIST);
        startOfWeekIST.setDate(startOfDayIST.getDate() - 7);

        // 1. Active Subscribers
        const activeSubscribers = await prisma.subscription.count({
            where: { status: 'Active' }
        });

        // 2. Weekly Churn %
        const cancelledThisWeek = await prisma.subscription.count({
            where: {
                status: 'Cancelled',
                cancelledAt: { gte: startOfWeekIST }
            }
        });

        const churnRate = activeSubscribers + cancelledThisWeek > 0
            ? (cancelledThisWeek / (activeSubscribers + cancelledThisWeek)) * 100
            : 0;

        // 3. On-Time Delivery % (Rule 2)
        // V4: All physical deliveries are governed by Order
        const recentDeliveries = await prisma.order.findMany({
            where: {
                status: 'Delivered',
                deliveredAt: { not: null }
            },
            take: 100,
            orderBy: { deliveredAt: 'desc' },
            include: { dailyMenu: true }
        });

        let onTimeCount = 0;
        recentDeliveries.forEach(d => {
            const deliveryTime = timeUtils.toIST(d.deliveredAt);
            const hours = deliveryTime.getHours();
            const minutes = deliveryTime.getMinutes();
            const totalMinutes = hours * 60 + minutes;

            // V4 uses mealSlot instead of mealType
            if (d.mealSlot === 'LUNCH') {
                // Lunch sacred time: Cutoff is strictly 1:30 PM (810 mins). Rule 2.3 logic with 15m grace = 825
                if (totalMinutes <= 810 + 15) onTimeCount++;
            } else if (d.mealSlot === 'DINNER') {
                // Dinner sacred time: 8:30 PM = 1230 mins + 15m grace = 1245
                if (totalMinutes <= 1230 + 15) onTimeCount++;
            }
        });

        const onTimeRate = recentDeliveries.length > 0
            ? (onTimeCount / recentDeliveries.length) * 100
            : 100;

        // 4. Complaint Rate (Last 7 Days)
        const complaintsThisWeek = await prisma.complaint.count({
            where: { createdAt: { gte: startOfWeekIST } }
        });

        const totalTouchpoints = recentDeliveries.length; // Approximate from sample
        const complaintRate = totalTouchpoints > 0
            ? (complaintsThisWeek / totalTouchpoints) * 100
            : 0;

        // 5. Avg Revenue Per User (ARPU) 
        const totalActiveRevenue = await prisma.subscription.aggregate({
            where: { status: 'Active' },
            _sum: { totalPrice: true }
        });
        const arpu = activeSubscribers > 0
            ? (totalActiveRevenue._sum.totalPrice || 0) / activeSubscribers
            : 0;

        // 6. Revenue Today (Direct Orders AND Delivered Subscription Orders)
        // Note: Subscription value is deferred until delivery per SOP. 
        // Here we sum totalAmount attached to delivered Orders today.
        const ordersToday = await prisma.order.findMany({
            where: {
                deliveredAt: { gte: startOfDayIST },
                status: 'Delivered'
            }
        });
        const revenueToday = ordersToday.reduce((acc, o) => acc + o.totalAmount, 0);

        // 7. Missing Tiffins Queue 
        const pendingCount = await prisma.order.count({
            where: {
                dailyMenu: { date: startOfDayIST },
                status: { in: ['Pending', 'Preparing', 'OutForDelivery'] }
            }
        });

        res.json({
            success: true,
            data: {
                activeSubscribers,
                churnRate: churnRate.toFixed(2) + '%',
                onTimeRate: onTimeRate.toFixed(1) + '%',
                complaintRate: complaintRate.toFixed(1) + '%',
                arpu: Math.round(arpu),
                revenueToday,
                complaintsThisWeek,
                pendingOrdersToday: pendingCount,
                criticalAlert: (complaintRate > 5 || onTimeRate < 90) // Rule 10: Pause expansion signal
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getKPIs, getLaunchConsole };
