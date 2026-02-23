const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

router.post("/login", authController.login);
router.post("/setup", authController.createAdmin);

// Customer auth
router.post("/otp/request", authController.requestOTP);
router.post("/otp/verify", authController.verifyOTP);
router.post("/otp/logout", authController.logout);

module.exports = router;
