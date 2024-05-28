const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchases.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, purchaseController.getOrders);

module.exports = router;