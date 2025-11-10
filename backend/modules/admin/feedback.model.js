const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  // You can add a 'type' field (e.g., 'app' or 'order')
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);