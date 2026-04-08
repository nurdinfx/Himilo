const path = require('path');
const { CustomerInfo } = require(path.join(__dirname, '../../database/index.js'));

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Staff
const getCustomers = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { email: { $regex: req.query.keyword, $options: 'i' } },
            { phoneNumber: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const customers = await CustomerInfo.find({ ...keyword }).populate('bookingId');
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCustomers };
