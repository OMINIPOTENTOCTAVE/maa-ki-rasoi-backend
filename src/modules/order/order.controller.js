const prisma = require("../../prisma");

const placeOrder = async (req, res) => {
    try {
        const { customerName, customerPhone, customerId, address, dailyMenuId, quantity = 1, paymentMethod, deliveryZoneId = "ZONE_1", mealSlot = "LUNCH" } = req.body;

        if (!customerName || !customerPhone || !address || !dailyMenuId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // 1. Verify Daily Menu
        const dailyMenu = await prisma.dailyMenu.findUnique({ where: { id: dailyMenuId } });
        if (!dailyMenu || dailyMenu.status !== 'PUBLISHED') {
            return res.status(400).json({ success: false, message: "Selected menu is not available for ordering." });
        }

        // 2. Identify or update customer
        let customer = await prisma.customer.findUnique({ where: { phone: customerPhone } });
        if (!customer) {
            customer = await prisma.customer.create({ data: { phone: customerPhone, name: customerName, address } });
        } else if (address) {
            customer = await prisma.customer.update({
                where: { id: customer.id },
                data: { address, name: customerName }
            });
        }

        const isOnline = paymentMethod === 'ONLINE';
        const totalAmount = quantity * 100; // V4 Rule: Flat 100 INR

        // 3. Spawns physically actionable order
        const order = await prisma.order.create({
            data: {
                customerName,
                customerPhone,
                customerId: customer.id,
                address,
                dailyMenuId,
                paymentMethod: paymentMethod || 'COD',
                paymentStatus: 'Pending',
                totalAmount,
                status: isOnline ? "Payment Pending" : "Pending", // Pending pushes to kitchen display instantly
                deliveryType: 'IN_HOUSE',
                deliveryZoneId,
                mealSlot,
                // We fake an OrderItem so legacy queries don't break if they count items, 
                // but strictly we map via dailyMenuId now.
                items: {
                    create: [{
                        menuItemId: dailyMenu.item1Id, // Represents the core menu proxy
                        quantity,
                        price: 100
                    }]
                }
            }
        });

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

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

        const [orders, totalCount] = await Promise.all([
            prisma.order.findMany({
                where: filters,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    items: {
                        include: { menuItem: true }
                    }
                }
            }),
            prisma.order.count({ where: filters })
        ]);

        res.json({
            success: true,
            data: orders,
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

const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const data = { status };
        const now = new Date();

        // SOP: Placed -> Confirmed -> Preparing -> Dispatched (Out for Delivery) -> Delivered
        if (status === 'Confirmed') data.confirmedAt = now;
        if (status === 'Preparing') data.preparingAt = now;
        if (status === 'Out for Delivery') data.dispatchedAt = now;
        if (status === 'Delivered') data.deliveredAt = now;

        const order = await prisma.order.update({
            where: { id },
            data
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
