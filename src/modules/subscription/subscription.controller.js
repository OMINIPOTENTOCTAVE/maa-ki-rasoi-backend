const prisma = require("../../prisma");

// Helper to add days to a date
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const createSubscription = async (req, res) => {
    try {
        const { customerId, customerPhone, customerName, address, planType, mealType, dietaryPreference = 'Veg', startDate, paymentMethod } = req.body;

        if (!planType || !mealType || !startDate) {
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

        // Update address if provided
        if (address) {
            customer = await prisma.customer.update({
                where: { id: customer.id },
                data: { address }
            });
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
                status: paymentMethod === 'COD' ? "Active" : "Pending", // Pending until paid for ONLINE
                paymentMethod,
                paymentStatus: "Pending"
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
                        status: 'Pending'
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

        const [subscriptionsRaw, totalCount] = await Promise.all([
            prisma.subscription.findMany(query),
            prisma.subscription.count({ where: query.where })
        ]);

        // Enrich with mealsRemaining count
        const subscriptions = await Promise.all(subscriptionsRaw.map(async (s) => {
            const pendingCount = await prisma.subscriptionDelivery.count({
                where: {
                    subscriptionId: s.id,
                    status: 'Pending'
                }
            });
            return { ...s, mealsRemaining: pendingCount };
        }));

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

        // 10 PM IST Cutoff Logic (SOP Section 4)
        // If before 10 PM IST, change starts from Tomorrow.
        // If after 10 PM IST, change starts from Day-after-Tomorrow.
        const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
        const nowUTC = Date.now();
        const nowIST = new Date(nowUTC + IST_OFFSET_MS);

        const hourIST = nowIST.getUTCHours();
        let daysToSkip = 1; // Default: start from tomorrow
        if (hourIST >= 22) { // 10 PM or later
            daysToSkip = 2; // Start from day after tomorrow
        }

        const startOfEffectiveDayIST = new Date(Date.UTC(
            nowIST.getUTCFullYear(),
            nowIST.getUTCMonth(),
            nowIST.getUTCDate() + daysToSkip
        ));
        const effectiveDate = new Date(startOfEffectiveDayIST.getTime() - IST_OFFSET_MS);

        if (status === 'Paused' || status === 'Cancelled') {
            await prisma.subscriptionDelivery.updateMany({
                where: {
                    subscriptionId: id,
                    deliveryDate: { gte: effectiveDate },
                    status: 'Pending'
                },
                data: { status }
            });
        }

        if (status === 'Active') {
            await prisma.subscriptionDelivery.updateMany({
                where: {
                    subscriptionId: id,
                    deliveryDate: { gte: effectiveDate },
                    status: 'Paused'
                },
                data: { status: 'Pending' }
            });
        }

        res.json({
            success: true,
            data: updated,
            message: `Status updated to ${status}. Changes effective from ${startOfEffectiveDayIST.toISOString().split('T')[0]}`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateDeliveryStatus = async (req, res) => {
    try {
        const { deliveryId } = req.params;
        const { status, rating, feedback } = req.body;

        const data = { status };
        const now = new Date();

        if (status === 'Confirmed') data.confirmedAt = now;
        if (status === 'Preparing') data.preparingAt = now;
        if (status === 'Out for Delivery') data.dispatchedAt = now;
        if (status === 'Delivered') data.deliveredAt = now;

        if (rating !== undefined) data.rating = rating;
        if (feedback !== undefined) data.feedback = feedback;

        const updated = await prisma.subscriptionDelivery.update({
            where: { id: deliveryId },
            data
        });

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
                status: 'Pending',
                subscription: {
                    status: 'Active'
                }
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

const getDispatchManifest = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date();

        // If no date provided, default to Tomorrow (as per SOP prep)
        if (!date) {
            targetDate.setDate(targetDate.getDate() + 1);
        }
        targetDate.setHours(0, 0, 0, 0);

        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const deliveries = await prisma.subscriptionDelivery.findMany({
            where: {
                deliveryDate: {
                    gte: targetDate,
                    lt: nextDay
                },
                status: 'Pending',
                subscription: {
                    status: 'Active'
                }
            },
            include: {
                subscription: {
                    include: { customer: true }
                }
            }
        });

        // SOP Section 9: Clustering & Manifest Preparation
        // Grouping by Address (Basic Clustering)
        const manifest = deliveries.reduce((acc, d) => {
            const addr = d.subscription.customer.address || "Unknown Address";
            if (!acc[addr]) acc[addr] = [];
            acc[addr].push({
                deliveryId: d.id,
                customerName: d.subscription.customer.name,
                customerPhone: d.subscription.customer.phone,
                mealType: d.mealType,
                planType: d.subscription.planType
            });
            return acc;
        }, {});

        res.json({
            success: true,
            date: targetDate.toISOString().split('T')[0],
            totalDeliveries: deliveries.length,
            manifest
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createSubscription, getSubscriptions, toggleSubscriptionStatus, getDailyProduction, updateDeliveryStatus, getDispatchManifest };
