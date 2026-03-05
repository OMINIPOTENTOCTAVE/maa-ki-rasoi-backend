const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const { authenticateAdmin } = require('../../middleware/auth');

// Protected (Admin only)
router.get('/kpis', authenticateAdmin, analyticsController.getKPIs);

module.exports = router;
