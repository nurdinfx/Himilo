const express = require('express');
const router = express.Router();
const { getCustomers } = require('../controllers/customerController');
const { protect, staff } = require('../middleware/authMiddleware');

router.route('/').get(protect, staff, getCustomers);

module.exports = router;
