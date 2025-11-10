// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db.js');

// --- Import Routes ---
const authRoutes = require('./modules/auth/auth.routes.js'); 
const adminRoutes = require('./modules/admin/admin.routes.js');
const customerRoutes = require('./modules/customer/customer.routes.js');
const ownerRoutes = require('./modules/owner/owner.routes.js');
const shopRoutes = require('./modules/shop/shop.routes.js');

// --- Connect to MongoDB ---
connectDB();

const app = express();

// Increase the timeout limit to 2 minutes
app.use((req, res, next) => {
  req.setTimeout(120000); // 2 minutes
  res.setTimeout(120000); // 2 minutes
  next();
});

// CORS configuration with proper options
app.use(cors({
  origin: 'https://orderly-bjp0.onrender.com', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- Environment Config ---
const PORT = 5000; // Force port 5000 for development

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/shop', shopRoutes);

// Health Check
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Fallback 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// --- Start Server ---
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`)); // ⭐️ And used here
