const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/checkout.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/pay', protect, paymentController.processPayment);

module.exports = router;