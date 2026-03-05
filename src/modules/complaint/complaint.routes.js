const express = require('express');
const router = express.Router();
const complaintController = require('./complaint.controller');
const { authMiddleware, authenticateAdmin } = require('../../middleware/auth');
const { auditLog } = require('../../middleware/audit');

// Customer and Admin can see complaints
router.get('/', authMiddleware, complaintController.getComplaints);

// Customer only
router.post('/', authMiddleware, complaintController.fileComplaint);

// Admin only (Rule 2.4 Resolution)
router.patch('/:id/resolve', authenticateAdmin, auditLog("Complaint"), complaintController.resolveComplaint);

module.exports = router;
