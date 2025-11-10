// middleware/auth.js
const jwt = require('jsonwebtoken');
const Customer = require('../modules/customer/customer.model.js');
const Owner = require('../modules/owner/owner.model.js');
const Admin = require('../modules/admin/admin.model.js');

// Helper to generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by role
      switch (decoded.role) {
        case 'customer':
          req.user = await Customer.findById(decoded.id).select('-password');
          break;
        case 'owner':
          req.user = await Owner.findById(decoded.id).select('-password');
          break;
        case 'admin':
          req.user = await Admin.findById(decoded.id).select('-password');
          break;
        default:
          return res.status(401).json({ message: 'Not authorized, invalid role' });
      }

      if (!req.user) {
         return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-specific middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const isOwner = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an owner' });
  }
};

const isApprovedOwner = (req, res, next) => {
  if (req.user && req.user.role === 'owner' && req.user.status === 'approved') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized: Owner not approved' });
  }
};

const isCustomer = (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a customer' });
  }
};

module.exports = {
  generateToken,
  protect,
  isAdmin,
  isOwner,
  isApprovedOwner,
  isCustomer,
};