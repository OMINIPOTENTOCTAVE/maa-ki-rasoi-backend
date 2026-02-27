const prisma = require("../../prisma");

const getKPIs = async (req, res) => {
    try {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        startOfWeek.setHours(0, 0, 0, 0);

        // 1. Active Subscribers
        const activeSubscribers = await prisma.subscription.count({
            where: { status: 'Active' }
        });

        // 2. Weekly Churn %
        // Simplified: (No. of cancellations in last 7 days) / (Total active at start of week, approx as current + cancelled)
        const cancelledThisWeek = await prisma.subscription.count({
            where: {
                status: 'Cancelled',
                cancelledAt: { gte: startOfWeek }
            }
        });

        const churnRate = activeSubscribers + cancelledThisWeek > 0
            ? (cancelledThisWeek / (activeSubscribers + cancelledThisWeek)) * 100
            : 0;

        // 3. On-Time Delivery % (Rule 2)
        // Standard window: Before 1:30 PM (for Lunch) or 8:30 PM (for Dinner)
        // For simplicity, let's track the last 100 deliveries
        const recentDeliveries = await prisma.subscriptionDelivery.findMany({
            where: {
                status: 'Delivered',
                deliveredAt: { not: null }
            },
            take: 100,
            orderBy: { deliveredAt: 'desc' }
        });

        let onTimeCount = 0;
        recentDeliveries.forEach(d => {
            const deliveryTime = new Date(d.deliveredAt);
            const hours = deliveryTime.getHours();
            const minutes = deliveryTime.getMinutes();
            const totalMinutes = hours * 60 + minutes;

            if (d.mealType === 'Lunch') {
                // Lunch sacred time: 1:30 PM = 13*60 + 30 = 810 mins
                if (totalMinutes <= 810 + 15) onTimeCount++; // 15 mins grace (Rule 2.3)
            } else if (d.mealType === 'Dinner') {
                // Dinner sacred time: 8:30 PM = 20*60 + 30 = 1230 mins
                if (totalMinutes <= 1230 + 15) onTimeCount++;
            }
        });

        const onTimeRate = recentDeliveries.length > 0
            ? (onTimeCount / recentDeliveries.length) * 100
            : 100;

        // 4. Complaint Rate (Last 7 Days)
        const complaintsThisWeek = await prisma.complaint.count({
            where: { createdAt: { gte: startOfWeek } }
        });

        const totalTouchpoints = recentDeliveries.length; // Approximate
        const complaintRate = totalTouchpoints > 0
            ? (complaintsThisWeek / totalTouchpoints) * 100
            : 0;

        // 5. Avg Revenue Per User (ARPU) - SOP Section 24
        const totalActiveRevenue = await prisma.subscription.aggregate({
            where: { status: 'Active' },
            _sum: { totalPrice: true }
        });
        const arpu = activeSubscribers > 0
            ? (totalActiveRevenue._sum.totalPrice || 0) / activeSubscribers
            : 0;

        // 6. Revenue Today (Direct Orders)
        const ordersToday = await prisma.order.findMany({
            where: { createdAt: { gte: startOfDay }, status: 'Delivered' }
        });
        const revenueToday = ordersToday.reduce((acc, o) => acc + o.totalAmount, 0);

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
                criticalAlert: (complaintRate > 5 || onTimeRate < 90) // Rule 10: Pause expansion signal
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getKPIs };
