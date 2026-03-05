const express = require("express");
const router = express.Router();
const menuController = require("./menu.controller");
const { authMiddleware } = require("../../middleware/auth");

// Public
router.get("/", menuController.getMenuItems);

// Protected (Admin Menu Items)
router.post("/", authMiddleware, menuController.createMenuItem);
router.put("/:id", authMiddleware, menuController.updateMenuItem);
router.patch("/:id/toggle", authMiddleware, menuController.toggleAvailability);
router.delete("/:id", authMiddleware, menuController.deleteMenuItem);

// V4.0 Protected (Daily Menu logic)
router.get("/daily", authMiddleware, menuController.getDailyMenus);
router.post("/daily", authMiddleware, menuController.createDraftMenu);
router.get("/daily/unpublished", authMiddleware, menuController.getUnpublishedDates);
router.patch("/daily/:id", authMiddleware, menuController.updateDailyMenu);
router.patch("/daily/:id/publish", authMiddleware, menuController.publishMenu);

module.exports = router;
