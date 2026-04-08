const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analyticsController');
const { protect, adminAuth } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
