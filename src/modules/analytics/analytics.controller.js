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
        const [ordersToday, openComplaints, activeZones, subscriptionRevenueToday] = await Promise.all([
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
            }),
            // 6: Actual Cash In (Subscription Revenue Paid Today)
            prisma.payment.aggregate({
                where: { status: 'SUCCESS', createdAt: { gte: startOfDayIST } },
                _sum: { amount: true }
            })
        ]);

        const totalOrders = ordersToday.length;
        const mealsToCook = ordersToday.filter(o => ['Pending', 'Preparing'].includes(o.status)).length;

        // Revenue from one-time orders (delivered)
        const orderRevenue = ordersToday
            .filter(o => o.status === 'Delivered')
            .reduce((sum, o) => sum + o.totalAmount, 0);

        // Total Cash In (One-time orders + Subscriptions)
        const totalCashToday = orderRevenue + ((subscriptionRevenueToday._sum.amount || 0) / 100);

        const zones = activeZones.map(z => z.deliveryZoneId).filter(Boolean);

        res.json({
            success: true,
            data: {
                todayOrders: totalOrders,
                mealsToCook,
                revenueToday: totalCashToday,
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
        const startOfMonthIST = new Date(startOfDayIST.getFullYear(), startOfDayIST.getMonth(), 1);

        const startOfWeekIST = new Date(startOfDayIST);
        startOfWeekIST.setDate(startOfDayIST.getDate() - 7);

        const [
            activeSubscribers,
            cancelledThisWeek,
            recentDeliveries,
            complaintsThisWeek,
            totalActiveRevenue,
            ordersToday,
            pendingCount,
            subRevTodayAgg,
            subRevMonthAgg,
            failedPaymentsLast24h
        ] = await Promise.all([
            prisma.subscription.count({ where: { status: 'Active' } }),
            prisma.subscription.count({
                where: { status: 'Cancelled', cancelledAt: { gte: startOfWeekIST } }
            }),
            prisma.order.findMany({
                where: { status: 'Delivered', deliveredAt: { not: null } },
                take: 100,
                orderBy: { deliveredAt: 'desc' },
                include: { dailyMenu: true }
            }),
            prisma.complaint.count({ where: { createdAt: { gte: startOfWeekIST } } }),
            prisma.subscription.aggregate({
                where: { status: 'Active' },
                _sum: { totalPrice: true }
            }),
            prisma.order.findMany({
                where: { deliveredAt: { gte: startOfDayIST }, status: 'Delivered' }
            }),
            prisma.order.count({
                where: { dailyMenu: { date: startOfDayIST }, status: { in: ['Pending', 'Preparing', 'OutForDelivery'] } }
            }),
            // New Payment Aggregates
            prisma.payment.aggregate({
                where: { status: 'SUCCESS', createdAt: { gte: startOfDayIST } },
                _sum: { amount: true }
            }),
            prisma.payment.aggregate({
                where: { status: 'SUCCESS', createdAt: { gte: startOfMonthIST } },
                _sum: { amount: true }
            }),
            prisma.payment.count({
                where: { status: 'FAILED', createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
            })
        ]);

        const churnRate = activeSubscribers + cancelledThisWeek > 0
            ? (cancelledThisWeek / (activeSubscribers + cancelledThisWeek)) * 100
            : 0;

        let onTimeCount = 0;
        recentDeliveries.forEach(d => {
            const deliveryTime = timeUtils.toIST(d.deliveredAt);
            const hours = deliveryTime.getHours();
            const minutes = deliveryTime.getMinutes();
            const totalMinutes = hours * 60 + minutes;
            if (d.mealSlot === 'LUNCH') {
                if (totalMinutes <= 810 + 15) onTimeCount++;
            } else if (d.mealSlot === 'DINNER') {
                if (totalMinutes <= 1230 + 15) onTimeCount++;
            }
        });

        const onTimeRate = recentDeliveries.length > 0 ? (onTimeCount / recentDeliveries.length) * 100 : 100;
        const complaintRate = recentDeliveries.length > 0 ? (complaintsThisWeek / recentDeliveries.length) * 100 : 0;
        const arpu = activeSubscribers > 0 ? (totalActiveRevenue._sum.totalPrice || 0) / activeSubscribers : 0;

        const orderRevenueToday = ordersToday.reduce((acc, o) => acc + o.totalAmount, 0);
        const subRevToday = (subRevTodayAgg._sum.amount || 0) / 100;
        const subRevMonth = (subRevMonthAgg._sum.amount || 0) / 100;

        res.json({
            success: true,
            data: {
                activeSubscribers,
                churnRate: churnRate.toFixed(2) + '%',
                onTimeRate: onTimeRate.toFixed(1) + '%',
                complaintRate: complaintRate.toFixed(1) + '%',
                arpu: Math.round(arpu),
                revenueToday: orderRevenueToday + subRevToday, // Combined revenue
                subscriptionRevenueToday: subRevToday,
                subscriptionRevenueMonth: subRevMonth,
                failedPaymentsLast24h,
                complaintsThisWeek,
                pendingOrdersToday: pendingCount,
                criticalAlert: (complaintRate > 5 || onTimeRate < 90)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getKPIs, getLaunchConsole };
