const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");
const { authMiddleware, authenticateAdmin } = require("../../middleware/auth");
const { auditLog } = require("../../middleware/audit");

// Protected
router.post("/", authMiddleware, orderController.placeOrder);

// Protected (Admin)
router.get("/", authenticateAdmin, orderController.getOrders);
router.patch("/:id/status", authenticateAdmin, auditLog("Order"), orderController.changeStatus);
router.patch("/:id/assign", authenticateAdmin, auditLog("OrderAssign"), orderController.assignDeliveryPartner);
router.get("/stats", authenticateAdmin, orderController.getDashboardStats);

// Cloud Scheduler Webhook (Auth via Secret Header in Controller)
router.post("/cron/generate-orders", orderController.executeNightlyCronWebhook);

module.exports = router;
