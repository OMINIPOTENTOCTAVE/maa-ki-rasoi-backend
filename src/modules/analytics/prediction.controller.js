const predictionService = require('./prediction.service');
const timeUtils = require('../../utils/timeUtils');

/**
 * GET /analytics/forecast/tomorrow
 * Safeguard #2 — Protected by authenticateAdmin middleware in routes.
 * Safeguard #4 — Reads cached predictions, never recalculates.
 */
const getTomorrowForecast = async (req, res) => {
    try {
        const nowIST = timeUtils.getISTTimestamp();
        const tomorrow = timeUtils.startOfISTDay(
            new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate() + 1)
        );

        const predictions = await predictionService.getCachedPredictions(tomorrow);

        const totalMeals = predictions.reduce((sum, p) => sum + p.predictedMeals, 0);
        const avgConfidence = predictions.length > 0
            ? Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length * 10) / 10
            : 0;

        res.json({
            success: true,
            data: {
                date: tomorrow.toISOString().split('T')[0],
                totalPredictedMeals: totalMeals,
                averageConfidence: avgConfidence,
                clusters: predictions.map(p => ({
                    clusterId: p.clusterId,
                    predictedMeals: p.predictedMeals,
                    confidence: p.confidence
                })),
                generatedAt: predictions.length > 0 ? predictions[0].createdAt : null,
                hasPrediction: predictions.length > 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getTomorrowForecast };
