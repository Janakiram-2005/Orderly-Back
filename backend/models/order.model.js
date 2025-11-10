// models/order.model.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // Changed 'User' to 'Customer'
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    },
  ],
  totalPrice: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ongoing', 'delivered', 'rejected'],
    default: 'pending',
  },
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);