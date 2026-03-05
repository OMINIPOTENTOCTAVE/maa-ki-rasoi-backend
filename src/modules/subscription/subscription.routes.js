const express = require('express');
const router = express.Router();
const subscriptionController = require('./subscription.controller');
const { authMiddleware, authenticateAdmin } = require('../../middleware/auth');
const { auditLog } = require('../../middleware/audit');

// Customer routes
router.post('/', authMiddleware, subscriptionController.createSubscription);
router.get('/mine', authMiddleware, subscriptionController.getMySubscription);
router.patch('/:id/pause', authMiddleware, subscriptionController.pauseSubscription);
router.patch('/:id/resume', authMiddleware, subscriptionController.resumeSubscription);
router.patch('/:id/cancel', authMiddleware, subscriptionController.cancelSubscription);

// Admin protected routes
router.get('/', authenticateAdmin, subscriptionController.getSubscriptions);
router.patch('/:id/status', authenticateAdmin, auditLog("Subscription"), subscriptionController.toggleSubscriptionStatus);
router.patch('/deliveries/:deliveryId', authenticateAdmin, auditLog("Order"), subscriptionController.updateDeliveryStatus);
router.get('/production/today', authenticateAdmin, subscriptionController.getDailyProduction);
router.get('/manifest', authenticateAdmin, subscriptionController.getDispatchManifest);

module.exports = router;
