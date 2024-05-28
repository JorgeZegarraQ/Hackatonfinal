const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.get('/allproducts', productsController.getAllProducts);
router.get('/filterproducts', productsController.filterProducts);
router.post('/createproduct', protect, admin, productsController.createProduct);
router.post('/deleteproduct', protect, admin, productsController.deleteProduct);
router.post('/updateproduct', protect, admin, productsController.updateProduct);

module.exports = router;