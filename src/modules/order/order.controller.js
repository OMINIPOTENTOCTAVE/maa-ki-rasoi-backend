const prisma = require("../../prisma");

const placeOrder = async (req, res) => {
    try {
        const { customerName, customerPhone, customerId, address, items, paymentMethod } = req.body;

        if (!customerName || !customerPhone || !address || !items || !items.length) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const menuItem = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
            if (!menuItem) {
                return res.status(400).json({ success: false, message: `Item ${item.menuItemId} not found` });
            }
            totalAmount += menuItem.price * item.quantity;
            orderItemsData.push({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: menuItem.price
            });
        }

        const order = await prisma.order.create({
            data: {
                customerName,
                customerPhone,
                customerId: customerId || null,
                address,
                paymentMethod: paymentMethod || 'COD',
                totalAmount,
                status: "Pending",
                items: {
                    create: orderItemsData
                }
            },
            include: { items: true }
        });

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const filters = {};
        if (req.query.status) {
            filters.status = req.query.status;
        }

        if (req.user && req.user.role === 'customer') {
            // Customer can only see their own orders
            filters.OR = [
                { customerId: req.user.id },
                { customerPhone: req.user.phone }
            ];
        }
        const orders = await prisma.order.findMany({
            where: filters,
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: { menuItem: true }
                }
            }
        });
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const ordersToday = await prisma.order.findMany({
            where: {
                createdAt: { gte: today }
            }
        });

        const revenueToday = ordersToday.filter(o => o.status === "Delivered").reduce((acc, obj) => acc + obj.totalAmount, 0);
        const pendingCount = ordersToday.filter(o => o.status === "Pending").length;

        res.json({ success: true, data: { revenueToday, totalOrdersToday: ordersToday.length, pendingCount } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { placeOrder, getOrders, changeStatus, getDashboardStats };
