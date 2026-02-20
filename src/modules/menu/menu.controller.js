const prisma = require("../../config/prisma");

async function listAvailableMenu(req, res, next) {
  try {
    const { category } = req.query;
    const where = {
      isAvailable: true,
      ...(category ? { category } : {})
    };

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: [{ category: "asc" }, { createdAt: "desc" }]
    });

    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
}

async function listAdminMenu(req, res, next) {
  try {
    const items = await prisma.menuItem.findMany({ orderBy: { createdAt: "desc" } });
    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
}

async function createMenuItem(req, res, next) {
  try {
    const item = await prisma.menuItem.create({ data: req.body });
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function updateMenuItem(req, res, next) {
  try {
    const item = await prisma.menuItem.update({
      where: { id: req.params.id },
      data: req.body
    });

    return res.json({ success: true, data: item });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }
    return next(error);
  }
}

module.exports = {
  listAvailableMenu,
  listAdminMenu,
  createMenuItem,
  updateMenuItem
};
