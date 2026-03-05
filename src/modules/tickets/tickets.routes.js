const express = require('express');
const router = express.Router();
const { createTicket, getMyTickets, getAllTickets, updateTicketStatus } = require('./tickets.controller');
const { authMiddleware, isAdmin } = require('../../middleware/auth');

// Customer routes
router.post('/', authMiddleware, createTicket);
router.get('/mine', authMiddleware, getMyTickets);

// Admin routes
router.get('/', authMiddleware, isAdmin, getAllTickets);
router.patch('/:id', authMiddleware, isAdmin, updateTicketStatus);

module.exports = router;
