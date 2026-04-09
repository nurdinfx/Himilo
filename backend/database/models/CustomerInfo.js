const mongoose = require('mongoose');

const customerInfoSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
}, { timestamps: true });

module.exports = mongoose.model('CustomerInfo', customerInfoSchema);
