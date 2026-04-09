const Booking = require('../database/models/Booking');
const User = require('../database/models/User');
const Room = require('../database/models/Room');
const Bed = require('../database/models/Bed');
const CustomerInfo = require('../database/models/CustomerInfo');

const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Customers
    const totalCustomers = await CustomerInfo.countDocuments();

    // 2. Active Bookings
    const activeBookings = await Booking.countDocuments({ status: { $in: ['pending', 'confirmed', 'checked-in'] } });

    // 3. Recent Bookings (Last 5)
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('hotelId', 'name')
      .populate('roomId', 'type price')
      .populate('userId', 'name')
      .populate('customerInfo');

    // 4. Calculate Total Revenue & Occupancy
    // For revenue, sum up the price of the rooms for confirmed/completed bookings
    const allBookings = await Booking.find({ status: { $in: ['confirmed', 'checked-in', 'completed'] } }).populate('roomId', 'price');
    let totalRevenue = 0;
    allBookings.forEach(b => {
      if (b.roomId && b.roomId.price) {
        totalRevenue += b.roomId.price; // This is simplified (ignores stay duration), but works for dashboard metrics
      }
    });

    // Occupancy (booked beds / total beds)
    const totalBeds = await Bed.countDocuments();
    const bookedBeds = await Bed.countDocuments({ status: 'booked' });
    const occupancyRate = totalBeds > 0 ? ((bookedBeds / totalBeds) * 100).toFixed(1) : 0;

    res.json({
      totalRevenue,
      activeBookings,
      totalCustomers,
      occupancyRate,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
