const express = require("express");
const { requireAdminAuth } = require("../../middleware/auth.middleware");
const { listOrders, updateOrderStatus, todayRevenue } = require("./admin.controller");
const { validate } = require("../../middleware/validate.middleware");
const { updateOrderStatusSchema } = require("./admin.validation");

const router = express.Router();

router.use(requireAdminAuth);

router.get("/orders", listOrders);
router.patch("/orders/:id/status", validate(updateOrderStatusSchema), updateOrderStatus);
router.get("/revenue/today", todayRevenue);

module.exports = router;
