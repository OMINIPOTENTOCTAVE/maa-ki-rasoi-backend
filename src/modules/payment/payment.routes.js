const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { authMiddleware, authenticateAdmin } = require('../../middleware/auth');
const { auditLog } = require('../../middleware/audit');

// Create a new Razorpay order
router.post('/create-order', authMiddleware, paymentController.createOrder);

// Verify payment signature after checkout
router.post('/verify', authMiddleware, paymentController.verifyPayment);

// Admin Action: Process Refund via Razorpay Gateway
router.post('/admin/refund', authenticateAdmin, auditLog("PaymentRefund"), paymentController.processRefund);

module.exports = router;
