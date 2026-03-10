const express = require("express");
const router = express.Router();
const notificationController = require("./notification.controller");
const systemController = require("./system.controller");
const { authenticateAdmin } = require("../../middleware/auth");

// App Settings
router.get("/settings", authenticateAdmin, systemController.getSettings);
router.put("/settings", authenticateAdmin, systemController.updateSetting);

// Notification history
router.get("/notifications", authenticateAdmin, notificationController.getHistory);

// Send notification
router.post("/notifications/send", authenticateAdmin, notificationController.sendNotification);

module.exports = router;
