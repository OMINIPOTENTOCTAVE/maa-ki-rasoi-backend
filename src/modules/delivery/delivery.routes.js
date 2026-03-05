const express = require("express");
const router = express.Router();
const { authMiddleware, authenticateAdmin } = require("../../middleware/auth");
const { auditLog } = require("../../middleware/audit");
const deliveryController = require("./delivery.controller");

router.post("/auth", deliveryController.login);
router.get("/tasks", authMiddleware, deliveryController.getTasks);
router.post("/tasks/status", authMiddleware, deliveryController.updateStatus);

// Admin Routes
router.get("/partners", authenticateAdmin, deliveryController.getPartners);
router.post("/partners", authenticateAdmin, auditLog("DeliveryPartner"), deliveryController.createPartner);
router.post("/assign", authenticateAdmin, auditLog("Assignment"), deliveryController.assignTask);

module.exports = router;
