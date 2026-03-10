const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const predictionController = require('./prediction.controller');
const { authenticateAdmin } = require('../../middleware/auth');

// Protected (Admin only)
router.get('/kpis', authenticateAdmin, analyticsController.getKPIs);
router.get('/forecast/tomorrow', authenticateAdmin, predictionController.getTomorrowForecast);
router.get('/launch-console', authenticateAdmin, analyticsController.getLaunchConsole);

module.exports = router;
