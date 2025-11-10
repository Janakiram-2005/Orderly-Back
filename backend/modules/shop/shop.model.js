// modules/shop/shop.model.js
const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner', // ⭐️ FIX: Changed from 'User' to 'Owner'
  },
  
  // ⭐️ FIX: Added these required fields
  shopName: { 
    type: String, 
    required: true 
  },
  shopAddress: { 
    type: String, 
    required: true 
  },
  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
});

shopSchema.index({ location: '2dsphere' });

// Use this to prevent "OverwriteModelError"
module.exports = mongoose.models.Shop || mongoose.model('Shop', shopSchema);