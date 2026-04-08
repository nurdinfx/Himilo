const express = require('express');
const router = express.Router();
const {
  getBeds,
  createBed,
  updateBed,
  deleteBed,
} = require('../controllers/bedController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBeds)
  .post(protect, admin, createBed);

router.route('/:id')
  .put(protect, admin, updateBed)
  .delete(protect, admin, deleteBed);

module.exports = router;
