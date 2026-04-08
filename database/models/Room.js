const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  type: {
    type: String,
    enum: ['single', 'double', 'suite', 'shared'],
    required: true,
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
