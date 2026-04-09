const { Hotel, Room, Bed } = require('../database/index.js');

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({});
    res.json(hotels);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }
    res.json(hotel);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = async (req, res, next) => {
  try {
    const { name, location, description, images } = req.body;

    const hotel = new Hotel({
      name,
      location,
      description,
      images,
    });

    const createdHotel = await hotel.save();
    res.status(201).json(createdHotel);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = async (req, res, next) => {
  try {
    const { name, location, description, images } = req.body;

    const hotel = await Hotel.findById(req.params.id);

    if (hotel) {
      hotel.name = name || hotel.name;
      hotel.location = location || hotel.location;
      hotel.description = description || hotel.description;
      if (images) {
        hotel.images = images;
      }
      const updatedHotel = await hotel.save();
      res.json(updatedHotel);
    } else {
      res.status(404);
      throw new Error('Hotel not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (hotel) {
      // Also delete all rooms and beds associated with this hotel
      const rooms = await Room.find({ hotelId: hotel._id });
      for (const room of rooms) {
        await Bed.deleteMany({ roomId: room._id });
      }
      await Room.deleteMany({ hotelId: hotel._id });
      
      await hotel.deleteOne();
      res.json({ message: 'Hotel removed' });
    } else {
      res.status(404);
      throw new Error('Hotel not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
