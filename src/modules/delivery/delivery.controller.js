const prisma = require("../../prisma");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ success: false, message: "Phone number is required." });
        }

        let partner = await prisma.deliveryPartner.findUnique({
            where: { phone }
        });

        if (!partner) {
            partner = await prisma.deliveryPartner.create({
                data: {
                    name: `Partner ${phone.slice(-4)}`,
                    phone
                }
            });
        }

        const token = jwt.sign(
            { id: partner.id, role: "delivery" },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "7d" }
        );

        res.status(200).json({ success: true, token, partner });
    } catch (error) {
        next(error);
    }
};

const timeUtils = require("../../utils/timeUtils");

exports.getTasks = async (req, res, next) => {
    try {
        const todayIST = timeUtils.startOfISTDay(timeUtils.getISTTimestamp());

        const tasks = await prisma.order.findMany({
            where: {
                deliveryPartnerId: req.user.id,
                dailyMenu: { date: todayIST }, // Fetch orders targeting today's specific V4 menu
                status: {
                    in: ["Pending", "Preparing", "OutForDelivery", "Delivered", "Failed"]
                }
            },
            include: {
                customer: true,
                dailyMenu: { include: { item1: true, item2: true } }
            },
            orderBy: { deliveryZoneId: 'asc' }
        });

        res.status(200).json({ success: true, tasks });
    } catch (error) {
        next(error);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { taskId, status } = req.body; // type param is deprecated in V4

        const order = await prisma.order.findUnique({ where: { id: taskId } });
        if (!order) return res.status(404).json({ success: false, message: "Task not found" });

        const result = await prisma.order.update({
            where: { id: taskId },
            data: {
                status,
                ...(status === 'Delivered' && { deliveredAt: timeUtils.getISTTimestamp() }),
                ...(status === 'OutForDelivery' && { dispatchedAt: timeUtils.getISTTimestamp() }),
                ...(status === 'Preparing' && { preparingAt: timeUtils.getISTTimestamp() })
            }
        });

        // V4 Business Logic: Accurately decrement tiffins via physical verification event
        if (status === 'Delivered' && order.subscriptionId && order.status !== 'Delivered') { // Prevent double count
            await prisma.subscription.update({
                where: { id: order.subscriptionId },
                data: {
                    tiffinsDelivered: { increment: 1 },
                    tiffinsRemaining: { decrement: 1 }
                }
            });
        }

        return res.status(200).json({ success: true, result });
    } catch (error) {
        next(error);
    }
};

exports.createPartner = async (req, res, next) => {
    try {
        const { name, phone, vehicleDetails } = req.body;
        const newPartner = await prisma.deliveryPartner.create({
            data: { name, phone, vehicleDetails }
        });
        res.status(201).json({ success: true, partner: newPartner });
    } catch (error) {
        next(error);
    }
};

exports.getPartners = async (req, res, next) => {
    try {
        const partners = await prisma.deliveryPartner.findMany();
        res.status(200).json({ success: true, partners });
    } catch (error) {
        next(error);
    }
};

exports.assignTask = async (req, res, next) => {
    try {
        const { partnerId, taskId } = req.body; // type param is deprecated in V4

        const partner = await prisma.deliveryPartner.findUnique({ where: { id: partnerId } });
        if (!partner || partner.status !== 'Active') {
            return res.status(400).json({ success: false, message: "Cannot assign task. Delivery partner is inactive or not found." });
        }

        const result = await prisma.order.update({
            where: { id: taskId },
            data: { deliveryPartnerId: partnerId }
        });
        return res.status(200).json({ success: true, result });
    } catch (error) {
        next(error);
    }
};
