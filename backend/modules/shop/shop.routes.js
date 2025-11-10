// modules/shop/shop.routes.js
const express = require('express');
const router = express.Router();
const { protect, isOwner } = require('../../middleware/auth.js');
const { updateShopLocation, getNearbyShops } = require('./shop.controller.js');

// @route   POST /api/shop/location
// @desc    Update a shop's location
// @access  Private (Owner)
router.post('/location', protect, isOwner, updateShopLocation);

// @route   GET /api/shop/nearby
// @desc    Get shops nearest to the user (e.g., for customer app)
// @access  Public
router.get('/nearby', getNearbyShops);

module.exports = router;