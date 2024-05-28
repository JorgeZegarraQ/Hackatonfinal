const Purchase = require('../models/purchases.model');

exports.getOrders = async (req, res) => {
  const userId = req.body.user;

  try {
    const purchases = await Purchase.find({ user: userId })/* .populate('items.product'); */
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchases', error: error.message });
  }
};