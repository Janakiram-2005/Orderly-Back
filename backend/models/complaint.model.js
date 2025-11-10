// models/complaint.model.js
const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'fromModel' },
  fromModel: { type: String, required: true, enum: ['Customer', 'Owner'] }, // Changed 'User' to 'Customer'
  
  toUser: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'toModel' },
  toModel: { type: String, required: true, enum: ['Admin', 'Owner'] },
  
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  replies: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, refPath: 'replies.userModel' },
      userModel: { type: String, enum: ['Customer', 'Owner', 'Admin'] },
      message: String,
      date: { type: Date, default: Date.now },
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Complaint', ComplaintSchema);