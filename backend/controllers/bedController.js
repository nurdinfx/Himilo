const path = require('path');
const { Bed, Room } = require('../database/index.js');

// @desc    Get all beds (can filter by roomId)
// @route   GET /api/beds
// @access  Public
const getBeds = async (req, res, next) => {
  try {
    const roomId = req.query.roomId;
    const filter = roomId ? { roomId } : {};
    const beds = await Bed.find(filter).populate('roomId');
    res.json(beds);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a bed in a room
// @route   POST /api/beds
// @access  Private/Admin
const createBed = async (req, res, next) => {
  try {
    const { roomId, status } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    const bed = new Bed({
      roomId,
      status: status || 'available',
    });

    const createdBed = await bed.save();
    res.status(201).json(createdBed);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a bed
// @route   PUT /api/beds/:id
// @access  Private/Admin
const updateBed = async (req, res, next) => {
  try {
    const { status } = req.body;

    const bed = await Bed.findById(req.params.id);

    if (bed) {
      bed.status = status || bed.status;
      const updatedBed = await bed.save();
      res.json(updatedBed);
    } else {
      res.status(404);
      throw new Error('Bed not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a bed
// @route   DELETE /api/beds/:id
// @access  Private/Admin
const deleteBed = async (req, res, next) => {
  try {
    const bed = await Bed.findById(req.params.id);

    if (bed) {
      await bed.deleteOne();
      res.json({ message: 'Bed removed' });
    } else {
      res.status(404);
      throw new Error('Bed not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBeds,
  createBed,
  updateBed,
  deleteBed,
};
