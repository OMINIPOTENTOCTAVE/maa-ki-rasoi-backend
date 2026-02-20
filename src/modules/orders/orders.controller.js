const prisma = require("../../config/prisma");

async function placeOrder(req, res, next) {
  try {
    const { customerName, customerPhone, address, items } = req.body;

    const menuItemIds = items.map((item) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, isAvailable: true }
    });

    if (menuItems.length !== menuItemIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some items are unavailable. Please refresh your cart."
      });
    }

    const itemMap = new Map(menuItems.map((item) => [item.id, item]));

    const orderItemsData = items.map((item) => {
      const menuItem = itemMap.get(item.menuItemId);
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price
      };
    });

    const totalAmount = orderItemsData.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        address,
        totalAmount,
        orderItems: {
          create: orderItemsData
        }
      },
      include: {
        orderItems: { include: { menuItem: true } }
      }
    });

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    return next(error);
  }
}

module.exports = { placeOrder };
