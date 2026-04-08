const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getMyBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, staff } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, staff, getBookings)
  .post(createBooking);

router.route('/mybookings').get(protect, getMyBookings);

router.route('/:id/status').put(protect, staff, updateBookingStatus);

module.exports = router;
