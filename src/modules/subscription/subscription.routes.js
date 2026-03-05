const express = require('express');
const router = express.Router();
const subscriptionController = require('./subscription.controller');
const { authMiddleware, isAdmin } = require('../../middleware/auth');

// Customer routes
router.post('/', authMiddleware, subscriptionController.createSubscription);
router.get('/mine', authMiddleware, subscriptionController.getMySubscription);
router.patch('/:id/pause', authMiddleware, subscriptionController.pauseSubscription);
router.patch('/:id/resume', authMiddleware, subscriptionController.resumeSubscription);
router.patch('/:id/cancel', authMiddleware, subscriptionController.cancelSubscription);

// Admin protected routes
router.get('/', authMiddleware, isAdmin, subscriptionController.getSubscriptions);
router.patch('/:id/status', authMiddleware, subscriptionController.toggleSubscriptionStatus);
router.patch('/deliveries/:deliveryId', authMiddleware, subscriptionController.updateDeliveryStatus);
router.get('/production/today', authMiddleware, isAdmin, subscriptionController.getDailyProduction);
router.get('/manifest', authMiddleware, isAdmin, subscriptionController.getDispatchManifest);

module.exports = router;
