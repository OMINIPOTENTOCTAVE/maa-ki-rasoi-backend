const prisma = require("../../prisma");
const subscriptionService = require("./subscription.service");
const timeUtils = require("../../utils/timeUtils");

const createSubscription = async (req, res) => {
    try {
        const { customerId, customerPhone, customerName, address, planType, mealSlot, startDate, paymentMethod, deliveryZoneId } = req.body;

        if (!planType || !startDate) {
            return res.status(400).json({ success: false, message: "Missing required fields: planType, startDate" });
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
            await prisma.customer.update({
                where: { id: customer.id },
                data: { address }
            });
        }

        // 2. Delegate to the service
        const subscription = await subscriptionService.createSubscription(customer.id, {
            planType,
            mealSlot,
            startDate,
            paymentMethod,
            deliveryZoneId
        });

        res.json({ success: true, subscription, message: "Subscription activated!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMySubscription = async (req, res) => {
    try {
        const customerId = req.user.id;
        const subscriptions = await subscriptionService.getCustomerSubscriptions(customerId);
        res.json({ success: true, data: subscriptions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const pauseSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const customerId = req.user.role === 'admin' ? null : req.user.id; // Admin can pause any

        const updated = await subscriptionService.pauseSubscription(id, customerId);
        res.json({ success: true, message: "Subscription paused successfully", data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const resumeSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const customerId = req.user.role === 'admin' ? null : req.user.id;

        const updated = await subscriptionService.resumeSubscription(id, customerId);
        res.json({ success: true, message: "Subscription resumed successfully", data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const cancelSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const cancelledBy = req.user.role; // customer or admin

        const updated = await subscriptionService.cancelSubscription(id, reason, cancelledBy);
        res.json({ success: true, message: "Subscription cancelled successfully", data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- Admin Endpoints ---

const getSubscriptions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const [subscriptions, totalCount] = await Promise.all([
            prisma.subscription.findMany({
                include: { customer: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.subscription.count()
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
        const sub = await prisma.subscription.findUnique({ where: { id } });
        if (!sub) return res.status(404).json({ success: false, message: "Not found" });

        const updated = await prisma.subscription.update({
            where: { id },
            data: { status: sub.status === 'Active' ? 'Inactive' : 'Active' }
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Production & Dispatch uses Orders now (V4)
const getDailyProduction = async (req, res) => {
    try {
        const dateParam = req.query.date ? new Date(req.query.date) : timeUtils.getISTTimestamp();
        const targetDate = timeUtils.startOfISTDay(dateParam);

        const orders = await prisma.order.findMany({
            where: {
                dailyMenu: { date: targetDate }
            },
            include: {
                dailyMenu: { include: { item1: true, item2: true } }
            }
        });

        // Calculate aggregates based on orders
        let totalOrders = orders.length;
        // In real app we might sum specific item quantities if people could customize, 
        // but for V4.0 it's 1 standard tiffin = 4 containers.

        res.json({
            success: true,
            date: targetDate.toISOString(),
            metrics: {
                totalTiffinsToPrepare: totalOrders,
                totalGravy: `${totalOrders} bowls`,
                totalPaneer: `${totalOrders} bowls`,
                totalRice: `${totalOrders} portions`,
                totalRoti: `${totalOrders * 4} pieces`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDispatchManifest = async (req, res) => {
    try {
        const dateParam = req.query.date ? new Date(req.query.date) : timeUtils.getISTTimestamp();
        const targetDate = timeUtils.startOfISTDay(dateParam);

        const orders = await prisma.order.findMany({
            where: {
                dailyMenu: { date: targetDate }
            },
            include: {
                customer: true,
                deliveryPartner: true
            },
            orderBy: { deliveryZoneId: 'asc' }
        });

        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateDeliveryStatus = async (req, res) => {
    try {
        const { deliveryId } = req.params; // This is now an Order ID
        const { status } = req.body;

        const validStatuses = ['Pending', 'Preparing', 'OutForDelivery', 'Delivered', 'Failed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const order = await prisma.order.update({
            where: { id: deliveryId },
            data: {
                status,
                ...(status === 'Delivered' && { deliveredAt: timeUtils.getISTTimestamp() }),
                ...(status === 'OutForDelivery' && { dispatchedAt: timeUtils.getISTTimestamp() }),
                ...(status === 'Preparing' && { preparingAt: timeUtils.getISTTimestamp() })
            }
        });

        // If delivered and linked to a subscription, we must accurately decrement remaining tiffins
        if (status === 'Delivered' && order.subscriptionId) {
            await prisma.subscription.update({
                where: { id: order.subscriptionId },
                data: {
                    tiffinsDelivered: { increment: 1 },
                    tiffinsRemaining: { decrement: 1 }
                }
            });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createSubscription,
    getMySubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    getSubscriptions,
    toggleSubscriptionStatus,
    getDailyProduction,
    getDispatchManifest,
    updateDeliveryStatus
};
