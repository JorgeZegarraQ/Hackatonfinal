const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  upc: { type: String, unique: true },
}, { timestamps: false });

const Product = mongoose.model('product', productSchema);

module.exports = Product;