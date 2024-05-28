const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Coupon = require('../models/coupon.model');


exports.addToCart = async (req, res) => {
  const productId = req.body.product;
  const quantity = req.body.quantity;
  const userId = req.body.user;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].price = product.price;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cart.finalPrice = cart.totalPrice - cart.discount;

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

exports.removeFromCart = async (req, res) => {
    const productId = req.body.product;
    const quantity = req.body.quantity;
    const userId = req.body.user;
  
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const item = cart.items[itemIndex];
      const removeQuantity = Math.min(quantity, item.quantity);
  
      item.quantity -= removeQuantity;
      if (item.quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
  
      cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      cart.finalPrice = cart.totalPrice - cart.discount;
  
      await cart.save();
    
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error removing from cart', error });
    }
};

exports.applyCoupon = async (req, res) => {
    const code = req.body.code;
    const userId = req.body.user;
  
    try {
      console.log('Searching for coupon:', code);
      const coupon = await Coupon.findOne({ code });
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      const currentDate = new Date();
      if (coupon.expirationDate < currentDate) {
        return res.status(400).json({ message: 'Coupon has expired' });
      }
  
      console.log('Coupon found:', coupon);
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      console.log('Cart found:', cart);
      cart.discount = coupon.discount;
      cart.finalPrice = cart.totalPrice - cart.discount;
      cart.couponUsed = coupon.code;
  
      await cart.save();
      await Coupon.deleteOne({ code: coupon.code });
  
      res.status(200).json(cart);
    } catch (error) {
      console.error('Error applying coupon:', error);
      res.status(500).json({ message: 'Error applying coupon', error: error.message });
    }
  };