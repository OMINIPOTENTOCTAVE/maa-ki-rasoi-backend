const express = require("express");
const router = express.Router();
const menuController = require("./menu.controller");
const { authenticateAdmin } = require("../../middleware/auth");
const { auditLog } = require("../../middleware/audit");

// Public
router.get("/", menuController.getMenuItems);

// Protected (Admin Menu Items)
router.post("/", authenticateAdmin, auditLog("MenuItem"), menuController.createMenuItem);
router.put("/:id", authenticateAdmin, auditLog("MenuItem"), menuController.updateMenuItem);
router.patch("/:id/toggle", authenticateAdmin, auditLog("MenuItem"), menuController.toggleAvailability);
router.delete("/:id", authenticateAdmin, auditLog("MenuItem"), menuController.deleteMenuItem);

// V4.0 Protected (Daily Menu logic)
router.get("/daily", authenticateAdmin, menuController.getDailyMenus);
router.post("/daily", authenticateAdmin, auditLog("DailyMenu"), menuController.createDraftMenu);
router.get("/daily/unpublished", authenticateAdmin, menuController.getUnpublishedDates);
router.patch("/daily/:id", authenticateAdmin, auditLog("DailyMenu"), menuController.updateDailyMenu);
router.patch("/daily/:id/publish", authenticateAdmin, auditLog("DailyMenu"), menuController.publishMenu);

module.exports = router;
