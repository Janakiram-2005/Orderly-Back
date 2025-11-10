// modules/auth/auth.routes.js
const express = require('express');
const router = express.Router();
const {
  registerOwner,
  loginOwner,
  registerCustomer,
  loginCustomer,
  loginAdmin,
  registerAdmin,
} = require('./auth.controller.js');

// Owner Auth
// POST /api/auth/owner/register
router.post('/owner/register', registerOwner);
// POST /api/auth/owner/login
router.post('/owner/login', loginOwner);

// Customer Auth
// POST /api/auth/customer/register
router.post('/customer/register', registerCustomer);
// POST /api/auth/customer/login
router.post('/customer/login', loginCustomer);

// Admin Auth
// POST /api/auth/admin/login
router.post('/admin/login', loginAdmin);
router.post('/admin/register', registerAdmin);

module.exports = router;