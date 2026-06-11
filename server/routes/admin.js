const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getVoters, approveVoter,
  rejectVoter, getAuditLogs, createAdmin, unlockAccount,
} = require('../controllers/adminController');
const { auth, adminOnly, superAdminOnly } = require('../middleware/auth');

router.get('/dashboard', auth, adminOnly, getDashboardStats);
router.get('/voters', auth, adminOnly, getVoters);
router.patch('/voters/:id/approve', auth, adminOnly, approveVoter);
router.delete('/voters/:id/reject', auth, adminOnly, rejectVoter);
router.get('/audit-logs', auth, adminOnly, getAuditLogs);
router.post('/create-admin', auth, superAdminOnly, createAdmin);
router.post('/users/:id/unlock', auth, superAdminOnly, unlockAccount);

module.exports = router;
