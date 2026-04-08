const mongoose = require('mongoose');
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');
const Bed = require('./models/Bed');
const Booking = require('./models/Booking');
const CustomerInfo = require('./models/CustomerInfo');

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  User,
  Hotel,
  Room,
  Bed,
  Booking,
  CustomerInfo,
};
