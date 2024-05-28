const mongoose = require('mongoose');

const purchasesItemSchema = new mongoose.Schema({
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true  },
  quantity: {type: Number, required: true},
  price: { type: Number, required: true}
});

const purchasesSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  },
  items: [purchasesItemSchema],
  totalPrice: {type: Number, required: true},
  discount: {type: Number, default: 0},
  finalPrice: {type: Number, required: true  },
  paymentStatus: {type: String, required: true, default: 'pending'},
  chargeId: {type: String, required: false}
}, { timestamps: true });

const Purchase = mongoose.model('Purchase', purchasesSchema);

module.exports = Purchase;