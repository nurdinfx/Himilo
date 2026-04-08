const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB, User, Hotel, Room, Bed, Booking, CustomerInfo } = require(path.join(__dirname, '../database/index.js'));
const bcrypt = require('bcryptjs');

dotenv.config();

const importData = async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/himilo-hotel');

    await Booking.deleteMany();
    await CustomerInfo.deleteMany();
    await Bed.deleteMany();
    await Room.deleteMany();
    await Hotel.deleteMany();
    await User.deleteMany();

    const createdUsers = [];
    for (const u of [
      { name: 'Admin User', email: 'admin@himilo.com', password: 'password123', role: 'admin' },
      { name: 'Staff User', email: 'staff@himilo.com', password: 'password123', role: 'staff' },
      { name: 'Customer User', email: 'customer@himilo.com', password: 'password123', role: 'customer' }
    ]) {
      const user = new User(u);
      await user.save();
      createdUsers.push(user);
    }
    const adminUser = createdUsers[0]._id;

    const sampleHotels = [
      {
        name: 'Himilo Hotel',
        location: 'Downtown City Center',
        description: 'Experience luxury and comfort in the heart of the city.',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
      }
    ];

    const hotels = await Hotel.insertMany(sampleHotels);

    const himiloGrand = hotels[0]._id;

    const sampleRooms = [
      {
        hotelId: himiloGrand,
        type: 'single',
        price: 150,
        capacity: 1,
      },
      {
        hotelId: himiloGrand,
        type: 'double',
        price: 250,
        capacity: 2,
      },
      {
        hotelId: himiloGrand,
        type: 'suite',
        price: 500,
        capacity: 4,
      },
      {
        hotelId: himiloGrand,
        type: 'shared',
        price: 50,
        capacity: 4,
      }
    ];

    const rooms = await Room.insertMany(sampleRooms);

    // Add beds to the shared room (rooms[3])
    const sharedRoom = rooms[3]._id;
    const sampleBeds = [
      { roomId: sharedRoom, status: 'available' },
      { roomId: sharedRoom, status: 'available' },
      { roomId: sharedRoom, status: 'available' },
      { roomId: sharedRoom, status: 'booked' },
    ];

    await Bed.insertMany(sampleBeds);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
    try {
      await connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/himilo-hotel');
  
      await Booking.deleteMany();
      await CustomerInfo.deleteMany();
      await Bed.deleteMany();
      await Room.deleteMany();
      await Hotel.deleteMany();
      await User.deleteMany();
  
      console.log('Data Destroyed!');
      process.exit();
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  };

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
