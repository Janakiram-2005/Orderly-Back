const mongoose = require('mongoose');

// This model can store platform-wide settings
const SettingsSchema = new mongoose.Schema({
  settingName: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  // e.g., { settingName: 'deliveryFee', value: 50 }
  // e.g., { settingName: 'serviceTax', value: 0.05 }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);