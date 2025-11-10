// models/cart.model.js
const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      quantity: { type: Number, required: true, min: 1, default: 1 },
      name: String, // Store name and price for convenience
      price: Number,
    },
  ],
  totalPrice: { type: Number, default: 0 },
});

module.exports = mongoose.model('Cart', CartSchema);