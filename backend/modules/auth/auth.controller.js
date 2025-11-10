// modules/auth/auth.controller.js
const Owner = require('../owner/owner.model.js');
const Customer = require('../customer/customer.model.js');
const Admin = require('../admin/admin.model.js');
const Shop = require('../shop/shop.model.js');
const { generateToken } = require('../../middleware/auth.js');

// --- OWNER AUTH ---
const registerOwner = async (req, res) => {
  const { name, email, password, phone, shopName, shopAddress } = req.body;

  try {
    const ownerExists = await Owner.findOne({ email });

    if (ownerExists) {
      return res.status(400).json({ message: 'Owner already exists' });
    }

    const owner = await Owner.create({
      name,
      email,
      password,
      phone,
      shopName,
      shopAddress,
      status: 'pending',
    });

    if (owner) {
      const shop = await Shop.create({
        owner: owner._id,
        name: shopName,
        shopName: shopName,
        shopAddress: shopAddress,
      });

      owner.shop = shop._id;
      await owner.save();

      res.status(201).json({
        message: 'Owner registered. Waiting for admin approval.',
      });
    } else {
      res.status(400).json({ message: 'Invalid owner data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const loginOwner = async (req, res) => {
  const { email, password } = req.body;
  try {
    const owner = await Owner.findOne({ email }).select('+password');
    if (owner && (await owner.matchPassword(password))) {
      if (owner.status !== 'approved') {
        return res.status(401).json({ message: 'Account not yet approved by admin' });
      }
      res.json({
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        role: 'owner',
        shop: owner.shop,
        token: generateToken(owner._id, 'owner'),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- CUSTOMER AUTH ---
const registerCustomer = async (req, res) => {
  const { name, email, phone, password, address } = req.body;
  try {
    const customerExists = await Customer.findOne({ email });
    if (customerExists) {
      return res.status(400).json({ message: 'Customer already exists' });
    }
    const customer = await Customer.create({ name, email, phone, password, address });
    if (customer) {
      res.status(201).json({
        _id: customer._id,
        email: customer.email,
        role: customer.role,
        token: generateToken(customer._id, 'customer'),
      });
    } else {
      res.status(400).json({ message: 'Invalid customer data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const loginCustomer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ email }).select('+password');
    if (customer && (await customer.matchPassword(password))) {
      res.json({
        _id: customer._id,
        email: customer.email,
        role: customer.role,
        token: generateToken(customer._id, 'customer'),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// --- ADMIN AUTH ---

// ⭐️ 1. ADD THIS NEW FUNCTION ⭐️
const registerAdmin = async (req, res) => {
  const { name, email, password, securityKey } = req.body;

  // Get the secret key from your .env file
  const ADMIN_SECRET = process.env.ADMIN_SECURITY_KEY;

  // Check if the provided key is valid
  if (!securityKey || securityKey !== ADMIN_SECRET) {
    return res.status(401).json({ message: 'Invalid or missing security key' });
  }

  try {
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Create the new admin
    const admin = await Admin.create({
      name,
      email,
      password,
      // 'role' will be set by the 'Admin' model's default
    });

    if (admin) {
      res.status(201).json({
        message: 'Admin registration successful. You can now log in.',
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email }).select('+password');
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id, 'admin'),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};


// ⭐️ 2. EXPORT THE NEW FUNCTION ⭐️
module.exports = {
  registerOwner,
  loginOwner,
  registerCustomer,
  loginCustomer,
  loginAdmin,
  registerAdmin, // <-- Added here
};