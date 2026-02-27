const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");
const { authMiddleware, isAdmin } = require("../../middleware/auth");

// Protected
router.post("/", authMiddleware, orderController.placeOrder);

// Protected (Admin)
router.get("/", authMiddleware, isAdmin, orderController.getOrders);
router.patch("/:id/status", authMiddleware, isAdmin, orderController.changeStatus);
router.get("/stats", authMiddleware, isAdmin, orderController.getDashboardStats);

module.exports = router;
