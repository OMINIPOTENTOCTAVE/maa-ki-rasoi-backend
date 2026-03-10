const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const paymentController = require('./payment.controller');
const { authMiddleware, authenticateAdmin } = require('../../middleware/auth');

// Accepts both customer and admin tokens
const authAny = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.customer_token || req.cookies?.admin_token ||
        (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) return res.status(401).json({ success: false, message: "Authentication required" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!['customer', 'admin'].includes(decoded.role)) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

// Create a new Razorpay order
router.post('/create-order', authMiddleware, paymentController.createOrder);

// Verify payment signature after checkout
router.post('/verify', authMiddleware, paymentController.verifyPayment);

// Fetch payment history (both admin and customer)
router.get('/history', authAny, paymentController.getPaymentHistory);

// Razorpay Asynchronous Webhook Receiver
router.post('/webhook', paymentController.handleRazorpayWebhook);

module.exports = router;

