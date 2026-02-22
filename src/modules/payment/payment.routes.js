const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');

// Create a new Razorpay order
router.post('/create-order', paymentController.createOrder);

// Verify payment signature after checkout
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
