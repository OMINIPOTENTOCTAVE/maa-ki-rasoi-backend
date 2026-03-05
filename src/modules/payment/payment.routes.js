const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { authMiddleware, isAdmin } = require('../../middleware/auth');

// Create a new Razorpay order
router.post('/create-order', authMiddleware, paymentController.createOrder);

// Verify payment signature after checkout
router.post('/verify', authMiddleware, paymentController.verifyPayment);

// Admin Action: Process Refund via Razorpay Gateway
router.post('/admin/refund', authMiddleware, isAdmin, paymentController.processRefund);

module.exports = router;
