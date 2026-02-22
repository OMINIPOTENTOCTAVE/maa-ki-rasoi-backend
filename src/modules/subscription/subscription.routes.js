const express = require('express');
const router = express.Router();
const subscriptionController = require('./subscription.controller');
const authMiddleware = require('../../middleware/auth');

// Public route to buy a subscription
router.post('/', subscriptionController.createSubscription);

// Admin protected routes
router.get('/', authMiddleware, subscriptionController.getSubscriptions);
router.patch('/:id/status', authMiddleware, subscriptionController.toggleSubscriptionStatus);
router.get('/production/today', authMiddleware, subscriptionController.getDailyProduction);

module.exports = router;
