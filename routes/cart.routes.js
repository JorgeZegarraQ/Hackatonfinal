const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/add', protect, cartController.addToCart);
router.post('/remove', protect, cartController.removeFromCart);
router.post('/applycoupon', protect, cartController.applyCoupon);

module.exports = router;