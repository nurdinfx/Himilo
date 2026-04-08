const path = require('path');
const { Room, Hotel, Bed } = require(path.join(__dirname, '../../database/index.js'));

// @desc    Get all rooms (can filter by hotelId)
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res, next) => {
  try {
    const hotelId = req.query.hotelId;
    const filter = hotelId ? { hotelId } : {};
    const rooms = await Room.find(filter).populate('hotelId', 'name');
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room with beds
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotelId', 'name');
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }
    const beds = await Bed.find({ roomId: room._id });
    res.json({ ...room.toObject(), beds });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res, next) => {
  try {
    const { hotelId, type, price, capacity, image } = req.body;

    const hotelObj = await Hotel.findById(hotelId);
    if (!hotelObj) {
      res.status(404);
      throw new Error('Hotel not found');
    }

    const room = new Room({
      hotelId,
      type,
      price,
      capacity,
      image,
    });

    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res, next) => {
  try {
    const { type, price, capacity, image } = req.body;

    const room = await Room.findById(req.params.id);

    if (room) {
      room.type = type || room.type;
      room.price = price !== undefined ? price : room.price;
      room.capacity = capacity !== undefined ? capacity : room.capacity;
      if (image !== undefined) room.image = image;

      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404);
      throw new Error('Room not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      // delete all associated beds
      await Bed.deleteMany({ roomId: room._id });
      await room.deleteOne();
      res.json({ message: 'Room and its beds removed' });
    } else {
      res.status(404);
      throw new Error('Room not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
