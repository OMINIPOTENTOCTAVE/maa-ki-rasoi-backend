const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middleware/auth");
const deliveryController = require("./delivery.controller");

router.post("/auth", deliveryController.login);
router.get("/tasks", authMiddleware, deliveryController.getTasks);
router.post("/tasks/status", authMiddleware, deliveryController.updateStatus);

// Admin Routes
router.get("/partners", authMiddleware, deliveryController.getPartners);
router.post("/partners", authMiddleware, deliveryController.createPartner);
router.post("/assign", authMiddleware, deliveryController.assignTask);

module.exports = router;
