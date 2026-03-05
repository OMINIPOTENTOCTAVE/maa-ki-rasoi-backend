const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('./users.controller');
const { authMiddleware } = require('../../middleware/auth');

router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, updateProfile);

module.exports = router;
