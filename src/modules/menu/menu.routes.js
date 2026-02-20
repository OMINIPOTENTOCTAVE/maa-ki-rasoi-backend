const express = require("express");
const {
  listAvailableMenu,
  listAdminMenu,
  createMenuItem,
  updateMenuItem
} = require("./menu.controller");
const { validate } = require("../../middleware/validate.middleware");
const { menuItemSchema, menuItemUpdateSchema } = require("./menu.validation");
const { requireAdminAuth } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/", listAvailableMenu);

router.get("/admin", requireAdminAuth, listAdminMenu);
router.post("/admin", requireAdminAuth, validate(menuItemSchema), createMenuItem);
router.patch("/admin/:id", requireAdminAuth, validate(menuItemUpdateSchema), updateMenuItem);

module.exports = router;
