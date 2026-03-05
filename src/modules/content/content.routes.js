const express = require('express');
const router = express.Router();
const { getMenu, getTestimonials, getFAQs } = require('./content.controller');

router.get('/menu', getMenu);
router.get('/testimonials', getTestimonials);
router.get('/faqs', getFAQs);

module.exports = router;
