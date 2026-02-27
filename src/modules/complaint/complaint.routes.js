const express = require('express');
const router = express.Router();
const complaintController = require('./complaint.controller');
const { authMiddleware, isAdmin } = require('../../middleware/auth');

// Customer and Admin can see complaints
router.get('/', authMiddleware, complaintController.getComplaints);

// Customer only
router.post('/', authMiddleware, complaintController.fileComplaint);

// Admin only (Rule 2.4 Resolution)
router.patch('/:id/resolve', authMiddleware, isAdmin, complaintController.resolveComplaint);

module.exports = router;
