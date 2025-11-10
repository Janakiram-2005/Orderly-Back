const cloudinary = require('cloudinary').v2;
const MenuItem = require('../../models/menuItem.model.js');
const Order = require('../../models/order.model.js');
const Complaint = require('../../models/complaint.model.js');
const Notification = require('../../models/notification.model.js');
const Owner = require('./owner.model.js');
const Admin = require('../admin/admin.model.js');

const addMenuItem = async (req, res) => {
  // Console logs to debug in your backend terminal
  console.log('--- addMenuItem ---');
  console.log('Body:', req.body);
  console.log('File:', req.file);
  console.log('User:', req.user);
  
  try {
    // 1. Get the full owner object from the ID in the token
    const owner = await Owner.findById(req.user._id);
    if (!owner || !owner.shop) {
      console.log('Error: Owner or shop not found for user ID:', req.user._id);
      return res.status(400).json({ message: 'Owner or shop not found' });
    }

    // 2. Parse form data with validation
    const { name, description } = req.body;
    const price = parseFloat(req.body.price);
    const hasStock = req.body.hasStock === 'true'; // Convert string "true" to boolean
    const totalStock = parseInt(req.body.totalStock, 10) || 0;

    // 3. Validate required fields
    if (!name || !description || isNaN(price) || price < 0) {
      console.log('Error: Validation failed', { name, description, price });
      return res.status(400).json({ message: 'Invalid or missing required fields' });
    }

    // 4. Prepare item data
    const newItemData = {
      shop: owner.shop,
      name,
      description,
      price,
      hasStock,
      totalStock,
      currentStock: totalStock
    };

    // 5. Handle photo upload if present
    if (req.file) {
      console.log('File detected, adding to newItemData');
      newItemData.photo = {
        public_id: req.file.filename, // <-- FIX: Use .filename
        url: req.file.path        // <-- FIX: Use .path
      };
    } else {
      console.log('No file detected.');
    }

    // 6. Create and save the new item
    console.log('Attempting to save new item:', newItemData);
    const newItem = new MenuItem(newItemData);
    const savedItem = await newItem.save();
    
    console.log('Item saved successfully!');
    res.status(201).json(savedItem);

  } catch (error) {
    // This will print the full crash error to your backend terminal
    console.error("--- CRASH IN addMenuItem ---");
    console.error(error);
    console.error("----------------------------");
    res.status(500).json({ message: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user._id);
    const item = await MenuItem.findById(req.params.itemId);

    if (!item || !owner || !owner.shop || item.shop.toString() !== owner.shop.toString()) {
      return res.status(404).json({ message: 'Menu item not found or unauthorized' });
    }

    const { name, description, price, hasStock, totalStock, currentStock } = req.body;

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = parseFloat(price);
    if (hasStock !== undefined) item.hasStock = (hasStock === 'true');
    if (totalStock !== undefined) item.totalStock = parseInt(totalStock, 10);
    if (currentStock !== undefined) item.currentStock = parseInt(currentStock, 10);

    if (req.file) {
      if (item.photo && item.photo.public_id) {
        await cloudinary.uploader.destroy(item.photo.public_id);
      }
      
      item.photo = {
        public_id: req.file.filename, // <-- FIX: Use .filename
        url: req.file.path        // <-- FIX: Use .path
      };
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user._id);
    const item = await MenuItem.findById(req.params.itemId);

    if (!item || !owner || !owner.shop || item.shop.toString() !== owner.shop.toString()) {
      return res.status(404).json({ message: 'Menu item not found or unauthorized' });
    }

    if (item.photo && item.photo.public_id) {
      await cloudinary.uploader.destroy(item.photo.public_id);
    }

    await item.deleteOne();
    res.json({ message: 'Menu item removed' });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: error.message });
  }
};

const getInventory = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user._id);
    if (!owner || !owner.shop) {
       return res.status(404).json({ message: "Owner or shop not found." });
    }
    const menu = await MenuItem.find({ shop: owner.shop });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPresentOrders = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user._id);
    if (!owner || !owner.shop) {
       return res.status(404).json({ message: "Owner or shop not found." });
    }
    const orders = await Order.find({
      shop: owner.shop,
      status: { $in: ['accepted', 'ongoing'] },
    }).populate('customer', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUpcomingOrders = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user._id);
    if (!owner || !owner.shop) {
       return res.status(404).json({ message: "Owner or shop not found." });
    }
    const orders = await Order.find({
      shop: owner.shop,
      status: 'pending',
    }).populate('customer', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  const { status } = req.body;
  try {
    const owner = await Owner.findById(req.user._id);
    const order = await Order.findById(req.params.orderId);

    if (!order || !owner || !owner.shop || order.shop.toString() !== owner.shop.toString()) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }
    order.status = status;
    await order.save();
    
    await Notification.create({
      recipient: order.customer,
      recipientModel: 'Customer',
      message: `Your order #${order._id.toString().substr(-6)} has been updated to: ${status}`
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUpcomingComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      toUser: req.user._id,
      toModel: 'Owner',
    }).populate('fromUser', 'email');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      fromUser: req.user._id,
      fromModel: 'Owner',
    });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fileComplaintToAdmin = async (req, res) => {
  const admin = await Admin.findOne();
  if (!admin) return res.status(400).json({ message: 'No admin found' });

  const { subject, message } = req.body;
  try {
    const complaint = new Complaint({
      fromUser: req.user._id,
      fromModel: 'Owner',
      toUser: admin._id,
      toModel: 'Admin',
      subject,
      message,
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const replyToComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);
    if (!complaint || complaint.toUser.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    complaint.replies.push({
      user: req.user._id,
      userModel: 'Owner',
      message: req.body.message,
    });
    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id
    }).sort({ date: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user._id).select('+password');
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    const { name, shopName, email, phone, openingTime, closingTime } = req.body;
    if (name) owner.name = name;
    if (shopName) owner.shopName = shopName;
    if (email) owner.email = email;
    if (phone) owner.phone = phone;
    if (openingTime) owner.openingTime = openingTime;
    if (closingTime) owner.closingTime = closingTime;

    // ⭐️ FIX: Handle file upload
    if (req.file) {
      if (owner.shopLogo && owner.shopLogo.public_id) {
        await cloudinary.uploader.destroy(owner.shopLogo.public_id);
      }
      owner.shopLogo = {
        public_id: req.file.filename, // <-- FIX: Use .filename
        url: req.file.path        // <-- FIX: Use .path
      };
    }
    
    const updatedOwner = await owner.save();
    
    const ownerData = updatedOwner.toObject();
    delete ownerData.password;

    res.json(ownerData);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user._id).select('-password');
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    res.json(owner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bindBankAccount = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user._id);
    if (!owner) {
       return res.status(404).json({ message: "Owner not found." });
    }
    owner.bankDetails = req.body;
    await owner.save();
    res.json(owner.bankDetails);
  } catch (error)
 {
    res.status(500).json({ message: error.message });
  }
};

const getIncome = async (req, res) => {
  res.json({ message: 'Income data for charts (placeholder)' });
};

module.exports = {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getInventory,
  getPresentOrders,
  getUpcomingOrders,
  updateOrder,
  getUpcomingComplaints,
  getMyComplaints,
  fileComplaintToAdmin,
  replyToComplaint,
  getNotifications,
  updateProfile,
  bindBankAccount,
  getProfile,
  getIncome,
};