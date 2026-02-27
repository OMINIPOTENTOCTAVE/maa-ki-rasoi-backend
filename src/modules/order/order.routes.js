const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");
const authMiddleware = require("../../middleware/auth");

// Protected
router.post("/", authMiddleware, orderController.placeOrder);

// Protected (Admin)
router.get("/", authMiddleware, orderController.getOrders);
router.patch("/:id/status", authMiddleware, orderController.changeStatus);
router.get("/stats", authMiddleware, orderController.getDashboardStats);

module.exports = router;
