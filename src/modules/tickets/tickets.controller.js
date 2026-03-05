const prisma = require('../../prisma');

// POST /tickets — Create a support ticket
const createTicket = async (req, res) => {
    try {
        const { subject, category, description } = req.body;
        if (!subject || !category || !description) {
            return res.status(400).json({ success: false, message: 'subject, category, and description are required' });
        }
        const ticket = await prisma.complaint.create({
            data: {
                customerId: req.user.id,
                category,
                description: `[${subject}] ${description}`,
                status: 'Open'
            }
        });
        res.status(201).json({ success: true, data: ticket, message: 'Ticket created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /tickets — Get all tickets for the logged-in customer
const getMyTickets = async (req, res) => {
    try {
        const tickets = await prisma.complaint.findMany({
            where: { customerId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /tickets/all — Admin: get all tickets
const getAllTickets = async (req, res) => {
    try {
        const tickets = await prisma.complaint.findMany({
            include: { customer: { select: { name: true, phone: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /tickets/:id — Admin: update ticket status
const updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const allowed = ['Open', 'In Progress', 'Resolved', 'Closed'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
        }
        const updated = await prisma.complaint.update({
            where: { id },
            data: { status, ...(status === 'Resolved' ? { resolvedAt: new Date() } : {}) }
        });
        res.json({ success: true, data: updated, message: `Ticket marked as ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createTicket, getMyTickets, getAllTickets, updateTicketStatus };
