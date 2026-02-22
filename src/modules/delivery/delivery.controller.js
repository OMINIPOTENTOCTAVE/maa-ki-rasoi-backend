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

exports.getTasks = async (req, res, next) => {
    try {
        // Today range
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const subscriptions = await prisma.subscriptionDelivery.findMany({
            where: {
                deliveryPartnerId: req.user.id,
                deliveryDate: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                subscription: {
                    include: { customer: true }
                }
            }
        });

        const instantOrders = await prisma.order.findMany({
            where: {
                deliveryPartnerId: req.user.id,
                status: {
                    in: ["Preparing", "Confirmed"]
                }
            },
            include: {
                customer: true,
                items: true
            }
        });

        res.status(200).json({ success: true, tasks: { subscriptions, instantOrders } });
    } catch (error) {
        next(error);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { taskId, type, status } = req.body;

        if (type === "subscription") {
            const result = await prisma.subscriptionDelivery.update({
                where: { id: taskId },
                data: { status }
            });
            return res.status(200).json({ success: true, result });
        } else if (type === "instant") {
            const result = await prisma.order.update({
                where: { id: taskId },
                data: { status }
            });
            return res.status(200).json({ success: true, result });
        } else {
            return res.status(400).json({ success: false, message: "Invalid type." });
        }
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
        const { partnerId, taskId, type } = req.body;
        if (type === "subscription") {
            const result = await prisma.subscriptionDelivery.update({
                where: { id: taskId },
                data: { deliveryPartnerId: partnerId }
            });
            return res.status(200).json({ success: true, result });
        } else if (type === "instant") {
            const result = await prisma.order.update({
                where: { id: taskId },
                data: { deliveryPartnerId: partnerId }
            });
            return res.status(200).json({ success: true, result });
        }
        res.status(400).json({ success: false, message: "Invalid type" });
    } catch (error) {
        next(error);
    }
};
