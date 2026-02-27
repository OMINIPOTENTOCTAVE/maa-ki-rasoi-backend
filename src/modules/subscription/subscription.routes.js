const express = require('express');
const router = express.Router();
const subscriptionController = require('./subscription.controller');
const { authMiddleware, isAdmin } = require('../../middleware/auth');

// Protected route to buy a subscription
router.post('/', authMiddleware, subscriptionController.createSubscription);

// Admin protected routes
router.get('/', authMiddleware, isAdmin, subscriptionController.getSubscriptions);
router.patch('/:id/status', authMiddleware, subscriptionController.toggleSubscriptionStatus);
router.patch('/deliveries/:deliveryId', authMiddleware, subscriptionController.updateDeliveryStatus);
router.get('/production/today', authMiddleware, isAdmin, subscriptionController.getDailyProduction);
router.get('/manifest', authMiddleware, isAdmin, subscriptionController.getDispatchManifest);

module.exports = router;
