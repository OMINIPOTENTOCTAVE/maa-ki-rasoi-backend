const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const { authMiddleware, isAdmin } = require('../../middleware/auth');

// Protected (Admin only)
router.get('/kpis', authMiddleware, isAdmin, analyticsController.getKPIs);

module.exports = router;
