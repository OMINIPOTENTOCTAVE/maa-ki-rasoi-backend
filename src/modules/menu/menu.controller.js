const prisma = require("../../prisma");

const getMenuItems = async (req, res) => {
    try {
        const filters = {};
        if (req.query.category) {
            filters.category = req.query.category;
        }
        // Customers usually only see available items, but admin might want all.
        // We can assume if no auth, only show available.
        // For MVP, just return all where available=true if not admin, but let's just return all
        // and let frontend filter, or accept a query param.
        if (req.query.available === 'true') {
            filters.isAvailable = true;
        }

        const items = await prisma.menuItem.findMany({ where: filters, orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, isAvailable } = req.body;
        const item = await prisma.menuItem.create({
            data: { name, description, price: parseFloat(price), category, isAvailable }
        });
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, isAvailable } = req.body;
        const item = await prisma.menuItem.update({
            where: { id },
            data: { name, description, price: parseFloat(price), category, isAvailable }
        });
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.menuItem.findUnique({ where: { id } });
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        const updated = await prisma.menuItem.update({
            where: { id },
            data: { isAvailable: !item.isAvailable }
        });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getMenuItems, createMenuItem, updateMenuItem, toggleAvailability };
