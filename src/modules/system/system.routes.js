const express = require('express');
const router = express.Router();
const systemController = require('./system.controller');
const { authenticateAdmin } = require('../../middleware/auth');
const { auditLog } = require('../../middleware/audit');

const notificationController = require('./notification.controller');

// Settings management (Step 4 feature flags access)
router.get('/settings', authenticateAdmin, systemController.getSettings);
router.patch('/settings', authenticateAdmin, auditLog("AppSetting"), systemController.updateSetting);

// Holiday Management (Step 14)
router.get('/holidays', authenticateAdmin, systemController.getHolidays);
router.post('/holidays', authenticateAdmin, auditLog("Holiday"), systemController.createHoliday);
router.delete('/holidays/:id', authenticateAdmin, auditLog("Holiday"), systemController.deleteHoliday);

// Notifications
router.get('/notifications', authenticateAdmin, notificationController.getHistory);
router.post('/notifications/send', authenticateAdmin, auditLog("Notification"), notificationController.sendNotification);

module.exports = router;
