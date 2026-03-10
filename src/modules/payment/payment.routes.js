const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { authMiddleware, authenticateAdmin } = require('../../middleware/auth');

// Create a new Razorpay order
router.post('/create-order', authMiddleware, paymentController.createOrder);

// Verify payment signature after checkout
router.post('/verify', authMiddleware, paymentController.verifyPayment);

// Fetch user's payment history
router.get('/history', authMiddleware, paymentController.getPaymentHistory);

// Razorpay Asynchronous Webhook Receiver
router.post('/webhook', paymentController.handleRazorpayWebhook);

module.exports = router;
