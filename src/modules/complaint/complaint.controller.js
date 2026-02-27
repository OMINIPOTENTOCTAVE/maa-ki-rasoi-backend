const prisma = require("../../prisma");

const fileComplaint = async (req, res) => {
    try {
        const { category, description, orderId, subscriptionId } = req.body;
        const customerId = req.user.id;

        const complaint = await prisma.complaint.create({
            data: {
                customerId,
                category,
                description,
                orderId: orderId || null,
                subscriptionId: subscriptionId || null,
                status: 'Open'
            }
        });

        res.json({ success: true, data: complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getComplaints = async (req, res) => {
    try {
        const filters = {};
        if (req.user.role === 'customer') {
            filters.customerId = req.user.id;
        }

        const complaints = await prisma.complaint.findMany({
            where: filters,
            include: {
                customer: true,
                order: true,
                subscription: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const resolveComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await prisma.complaint.update({
            where: { id },
            data: {
                status: 'Resolved',
                resolvedAt: new Date()
            }
        });
        res.json({ success: true, data: complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { fileComplaint, getComplaints, resolveComplaint };
