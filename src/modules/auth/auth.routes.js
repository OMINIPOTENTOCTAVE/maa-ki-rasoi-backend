const express = require("express");
const { adminLogin } = require("./auth.controller");
const { adminLoginSchema } = require("./auth.validation");
const { validate } = require("../../middleware/validate.middleware");

const router = express.Router();

router.post("/login", validate(adminLoginSchema), adminLogin);

module.exports = router;
