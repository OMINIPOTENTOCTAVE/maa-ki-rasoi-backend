const express = require("express");
const router = express.Router();
const menuController = require("./menu.controller");
const authMiddleware = require("../../middleware/auth");

// Public
router.get("/", menuController.getMenuItems);

// Protected
router.post("/", authMiddleware, menuController.createMenuItem);
router.put("/:id", authMiddleware, menuController.updateMenuItem);
router.patch("/:id/toggle", authMiddleware, menuController.toggleAvailability);
router.delete("/:id", authMiddleware, menuController.deleteMenuItem);

module.exports = router;
