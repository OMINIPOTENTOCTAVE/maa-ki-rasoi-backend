const prisma = require("../../prisma");

// Helper to add days to a date
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const createSubscription = async (req, res) => {
    try {
        const { customerId, customerPhone, customerName, address, planType, mealType, dietaryPreference, startDate } = req.body;

        if (!planType || !mealType || !dietaryPreference || !startDate) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // 1. Find or create the customer
        let customer;
        if (customerId) {
            customer = await prisma.customer.findUnique({ where: { id: customerId } });
        }

        if (!customer && customerPhone) {
            customer = await prisma.customer.findUnique({ where: { phone: customerPhone } });
            if (!customer) {
                customer = await prisma.customer.create({
                    data: { phone: customerPhone, name: customerName, address: address }
                });
            }
        }

        if (!customer) {
            return res.status(400).json({ success: false, message: "Customer identification required" });
        }

        // 2. Calculate subscription duration & pricing
        let durationDays = planType === 'Weekly' ? 5 : (planType === 'MonthlyFull' ? 30 : 22);

        // MVP Pricing Logic (Matches PRD approximations)
        let perMealPrice = 120; // Base price
        if (planType === 'Monthly') perMealPrice = 110;
        if (planType === 'MonthlyFull') perMealPrice = 100;

        let mealsPerDay = mealType === 'Both' ? 2 : 1;
        let comboDiscount = mealType === 'Both' ? 0.85 : 1; // 15% off for both meals

        const totalPrice = (durationDays * mealsPerDay * perMealPrice) * comboDiscount;
        const start = new Date(startDate);
        const end = addDays(start, durationDays);

        // 3. Create Subscription Record
        const subscription = await prisma.subscription.create({
            data: {
                customerId: customer.id,
                planType,
                mealType,
                dietaryPreference,
                startDate: start,
                endDate: end,
                totalPrice,
                status: "Active"
            }
        });

        // 4. Generate Daily Execution Records (SubscriptionDeliveries) for Operations
        const deliveryRecords = [];
        let createdDays = 0;
        let dayOffset = 0;

        // Loop until we have scheduled operations for the required number of days
        while (createdDays < durationDays) {
            const deliveryDate = addDays(start, dayOffset);
            const dayOfWeek = deliveryDate.getDay();
            dayOffset++;

            // Skip weekends if it's a 5-day or 22-day plan
            if ((planType === 'Weekly' || planType === 'Monthly') && (dayOfWeek === 0 || dayOfWeek === 6)) {
                continue;
            }

            if (mealType === 'Lunch' || mealType === 'Both') {
                deliveryRecords.push({ subscriptionId: subscription.id, deliveryDate, mealType: 'Lunch' });
            }
            if (mealType === 'Dinner' || mealType === 'Both') {
                deliveryRecords.push({ subscriptionId: subscription.id, deliveryDate, mealType: 'Dinner' });
            }

            createdDays++;
        }

        await prisma.subscriptionDelivery.createMany({ data: deliveryRecords });

        res.json({ success: true, subscription, message: "Subscription activated!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSubscriptions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const query = {
            include: {
                customer: true,
                deliveries: {
                    where: {
                        deliveryDate: { gte: new Date() }
                    },
                    orderBy: { deliveryDate: 'asc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        };

        // If it's a customer, only fetch their subscriptions
        if (req.user && req.user.role === 'customer') {
            query.where = { customerId: req.user.id };
        }

        const [subscriptions, totalCount] = await Promise.all([
            prisma.subscription.findMany(query),
            prisma.subscription.count({ where: query.where })
        ]);

        res.json({
            success: true,
            data: subscriptions,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleSubscriptionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Active', 'Paused', 'Cancelled'

        const updated = await prisma.subscription.update({
            where: { id },
            data: { status }
        });

        // Fix: Proper IST boundary using UTC+5:30 offset (no toLocaleString)
        // This ensures pause/cancel takes effect for today's remaining + all future deliveries
        if (status === 'Paused' || status === 'Cancelled') {
            const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // +5:30 in ms
            const nowUTC = Date.now();
            const nowIST = new Date(nowUTC + IST_OFFSET_MS);

            // Start of current IST day in UTC — any pending delivery from today onward gets cancelled
            const startOfTodayIST = new Date(Date.UTC(
                nowIST.getUTCFullYear(),
                nowIST.getUTCMonth(),
                nowIST.getUTCDate()
            ));
            // Convert back to UTC by subtracting IST offset
            const effectiveDate = new Date(startOfTodayIST.getTime() - IST_OFFSET_MS);

            await prisma.subscriptionDelivery.updateMany({
                where: {
                    subscriptionId: id,
                    deliveryDate: { gte: effectiveDate },
                    status: 'Pending'
                },
                data: { status }
            });
        }

        // If reactivated, restore paused deliveries from today onward
        if (status === 'Active') {
            const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
            const nowUTC = Date.now();
            const nowIST = new Date(nowUTC + IST_OFFSET_MS);

            const startOfTodayIST = new Date(Date.UTC(
                nowIST.getUTCFullYear(),
                nowIST.getUTCMonth(),
                nowIST.getUTCDate()
            ));
            const effectiveDate = new Date(startOfTodayIST.getTime() - IST_OFFSET_MS);

            await prisma.subscriptionDelivery.updateMany({
                where: {
                    subscriptionId: id,
                    deliveryDate: { gte: effectiveDate },
                    status: 'Paused'
                },
                data: { status: 'Pending' }
            });
        }

        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDailyProduction = async (req, res) => {
    try {
        // Find all pending deliveries for TODAY
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const deliveries = await prisma.subscriptionDelivery.findMany({
            where: {
                deliveryDate: {
                    gte: today,
                    lt: tomorrow
                },
                status: 'Pending'
            },
            include: {
                subscription: {
                    include: { customer: true }
                }
            }
        });

        // Aggregate counts for the Kitchen Dashboard
        const stats = {
            lunchSummary: { veg: 0, total: 0 },
            dinnerSummary: { veg: 0, total: 0 }
        };

        deliveries.forEach(d => {
            if (d.mealType === 'Lunch') {
                stats.lunchSummary.total++;
                stats.lunchSummary.veg++;
            } else {
                stats.dinnerSummary.total++;
                stats.dinnerSummary.veg++;
            }
        });

        res.json({ success: true, data: deliveries, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { createSubscription, getSubscriptions, toggleSubscriptionStatus, getDailyProduction };
