const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, required: true },
  discountType: { type: String, enum: ['percent', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', default: null }, // null = global
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Promotion', PromotionSchema);