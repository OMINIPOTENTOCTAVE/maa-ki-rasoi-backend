const prisma = require('../../prisma');

// GET /users/profile — Get logged-in customer's profile
const getProfile = async (req, res) => {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, phone: true, email: true, address: true, createdAt: true }
        });
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        res.json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /users/profile — Update name and address
const updateProfile = async (req, res) => {
    try {
        const { name, address, phone } = req.body;
        const updated = await prisma.customer.update({
            where: { id: req.user.id },
            data: {
                ...(name && { name }),
                ...(address && { address }),
                ...(phone && { phone }),
            },
            select: { id: true, name: true, phone: true, email: true, address: true }
        });
        res.json({ success: true, data: updated, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getProfile, updateProfile };
