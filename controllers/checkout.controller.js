const axios = require('axios');
const Cart = require('../models/cart.model');
const Purchase = require('../models/purchases.model'); 
const Product = require('../models/product.model');

const culqiSecretKey = process.env.CULQI_SECRET_KEY;

exports.processPayment = async (req, res) => {  
  const token = req.body.token;
  const amount = req.body.amount;
  const userId = req.body.user;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // const response = await axios.post('https://api.culqi.com/v2/charges', {
    //   amount: cart.finalPrice,//amount,
    //   currency_code: 'USD',
    //   email: req.user.email,
    //   source_id: token
    // }, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${culqiSecretKey}`
    //   }
    // });
    
    // if (response.data.object === 'charge') {
      const order = new Purchase({
        user: userId,
        items: cart.items,
        totalPrice: cart.totalPrice,
        discount: cart.discount,
        finalPrice: cart.finalPrice,
        paymentStatus: 'paid',
        // chargeId: response.data.id
      });

      await order.save();

      // Clear the cart
      cart.items = [];
      cart.totalPrice = 0;
      cart.discount = 0;
      cart.finalPrice = 0;
      cart.couponUsed = '';
      await cart.save();

      res.status(200).json(order);
    // } else {
    //   res.status(400).json({ message: 'Payment failed', error: response.data });
    // }
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};