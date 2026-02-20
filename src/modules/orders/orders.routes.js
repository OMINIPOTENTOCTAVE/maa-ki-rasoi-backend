const express = require("express");
const { placeOrder } = require("./orders.controller");
const { validate } = require("../../middleware/validate.middleware");
const { orderSchema } = require("./orders.validation");

const router = express.Router();

router.post("/", validate(orderSchema), placeOrder);

module.exports = router;
