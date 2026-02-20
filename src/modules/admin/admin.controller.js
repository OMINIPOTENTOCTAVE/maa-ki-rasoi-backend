const prisma = require("../../config/prisma");

async function listOrders(req, res, next) {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: { menuItem: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ success: true, data: orders });
  } catch (error) {
    return next(error);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    });

    return res.json({ success: true, data: order });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return next(error);
  }
}

async function todayRevenue(req, res, next) {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const result = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: { in: ["Confirmed", "Preparing", "Delivered"] },
        createdAt: { gte: start, lte: end }
      }
    });

    return res.json({
      success: true,
      data: { totalRevenueToday: Number(result._sum.totalAmount || 0) }
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listOrders, updateOrderStatus, todayRevenue };
