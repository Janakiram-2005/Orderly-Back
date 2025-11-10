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
// Use a whitelist and dynamic origin check so the response echoes the exact origin
const whitelist = [
  'https://orderly-bjp0.onrender.com', // Deployed frontend
  'http://localhost:5173', // Local dev for testing
];

app.use(cors({
  origin: function (origin, callback) {
    // `origin` will be undefined for same-origin requests (e.g. server-to-server, curl)
    if (!origin) return callback(null, true);

    if (whitelist.indexOf(origin) !== -1) {
      // allow this origin
      return callback(null, true);
    } else {
      // disallow other origins
      return callback(new Error('CORS policy: This origin is not allowed: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Optionally handle preflight requests explicitly
app.options('*', cors());

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
