const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const OwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  shopName: { type: String, required: true },
  shopAddress: { type: String, required: true },

  // ⭐️ NEW: Fields from your frontend Profile form
  openingTime: { type: String, default: '09:00' },
  closingTime: { type: String, default: '22:00' },
  shopLogo: {
    public_id: String,
    url: String,
  },
  
  role: { type: String, default: 'owner' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String,
  },
});

// ⭐️ FIX: Add the password hashing function back in (as you provided)
OwnerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ⭐️ FIX: Add the password matching function back in (as you provided)
OwnerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Owner', OwnerSchema);