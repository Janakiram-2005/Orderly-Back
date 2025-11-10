// models/menuItem.model.js
const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  photo: {
    public_id: String, // From Cloudinary
    url: String,       // From Cloudinary
  },
  
  hasStock: { type: Boolean, default: false }, 
  totalStock: { type: Number, default: 0 },
  currentStock: { type: Number, default: 0 },
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);