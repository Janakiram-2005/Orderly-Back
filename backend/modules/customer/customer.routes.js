// modules/customer/customer.routes.js
const express = require('express');
const router = express.Router();
const { protect, isCustomer } = require('../../middleware/auth.js');

// ⭐️ FIX: Import the two missing functions
const {
  getShops,
  getShopDetails,
  getCart,
  updateCart,
  deleteCartItem,
  proceedToPayment,
  getPresentOrders,
  getPreviousOrders,
  createAdminComplaint,
  createRestaurantComplaint,
  getMyComplaints, // ⭐️ ADDED
  getNotifications,
  getProfile, // ⭐️ ADDED
  updateProfile,
} = require('./customer.controller.js');

// All routes here are protected and require a customer role
router.use(protect, isCustomer);

// Shop & Menu
router.get('/shops', getShops);
router.get('/shops/:shopId', getShopDetails);

// Cart
router.get('/cart', getCart);
router.post('/cart', updateCart);
router.delete('/cart/:itemId', deleteCartItem);

// Order
router.post('/payment', proceedToPayment);
router.get('/orders/present', getPresentOrders);
router.get('/orders/previous', getPreviousOrders);

// Complaints
router.post('/complaints/admin', createAdminComplaint);
router.post('/complaints/restaurant/:shopId', createRestaurantComplaint);
router.get('/complaints/my', getMyComplaints); // ⭐️ ADDED ROUTE

// Notifications
router.get('/notifications', getNotifications);

// Profile
router.get('/profile', getProfile); // ⭐️ ADDED ROUTE
router.put('/profile', updateProfile);

module.exports = router;