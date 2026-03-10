const express = require('express');
const router = express.Router();
const { getTodayMenu, getTestimonials, getFAQs, getPlans } = require('./content.controller');

router.get('/menu/today', getTodayMenu);
router.get('/plans', getPlans);
router.get('/testimonials', getTestimonials);
router.get('/faqs', getFAQs);

module.exports = router;
