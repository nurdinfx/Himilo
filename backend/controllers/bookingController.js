const path = require('path');
const { Booking, Room, Bed, CustomerInfo } = require('../database/index.js');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const {
      hotelId,
      roomId,
      bedId,
      checkInDate,
      checkOutDate,
      customerInfo,
    } = req.body;

    if (!hotelId || !checkInDate || !checkOutDate || !customerInfo) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    // Check availability logic could be expanded here
    // For now we assume the frontend sent a valid available room/bed

    const booking = new Booking({
      userId: req.user ? req.user._id : undefined,
      hotelId,
      roomId,
      bedId,
      checkInDate,
      checkOutDate,
      status: 'confirmed', // immediately confirm for demo
    });

    const createdBooking = await booking.save();

    const info = new CustomerInfo({
      fullName: customerInfo.fullName,
      phoneNumber: customerInfo.phoneNumber,
      email: customerInfo.email,
      bookingId: createdBooking._id,
    });

    await info.save();

    // Mark bed as booked if bedId provided
    if (bedId) {
       const bed = await Bed.findById(bedId);
       if (bed) {
           bed.status = 'booked';
           await bed.save();
       }
    }

    res.status(201).json(createdBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin/Staff)
// @route   GET /api/bookings
// @access  Private/Staff
const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'name email')
      .populate('hotelId', 'name')
      .populate('roomId', 'type price')
      .populate('bedId', 'status');
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('hotelId', 'name')
      .populate('roomId', 'type')
      .populate('bedId', 'status');
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Staff
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = status;
      const updatedBooking = await booking.save();
      
      // If cancelled or checked-out, free up the bed
      if (status === 'cancelled' || status === 'checked-out') {
          if (booking.bedId) {
             const bed = await Bed.findById(booking.bedId);
             if (bed) {
                 bed.status = 'available';
                 await bed.save();
             }
          }
      }

      res.json(updatedBooking);
    } else {
      res.status(404);
      throw new Error('Booking not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getMyBookings,
  updateBookingStatus,
};
