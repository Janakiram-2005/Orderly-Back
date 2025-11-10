// modules/customer/customer.controller.js
const Shop = require('../shop/shop.model.js');
const MenuItem = require('../../models/menuItem.model.js');
const Cart = require('../../models/cart.model.js');
const Order = require('../../models/order.model.js');
const Complaint = require('../../models/complaint.model.js');
const Notification = require('../../models/notification.model.js');
const Admin = require('../admin/admin.model.js');
const Customer = require('./customer.model.js'); // This variable holds the 'User' model
const Settings = require('../admin/settings.model.js');

const getShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('owner', 'shopName shopAddress');
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShopDetails = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    
    const menu = await MenuItem.find({ shop: req.params.shopId });
    res.json({ shop, menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id }).populate('items.menuItem');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCart = async (req, res) => {
  const { menuItemId, quantity, shopId } = req.body;
  try {
    const item = await MenuItem.findById(menuItemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    let cart = await Cart.findOne({ customer: req.user._id });

    if (!cart) {
      cart = new Cart({ customer: req.user._id, shop: shopId, items: [] });
    }
    
    if (cart.shop && cart.shop.toString() !== shopId) {
      return res.status(400).json({ 
        message: 'You can only order from one shop at a time. Clear your cart first.' 
      });
    }

    cart.shop = shopId;
    const itemIndex = cart.items.findIndex(i => i.menuItem.toString() === menuItemId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ menuItem: menuItemId, quantity, name: item.name, price: item.price });
    }
    
    cart.totalPrice = cart.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCartItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ customer: req.user._id });
        cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
        
        cart.totalPrice = cart.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
        
        if (cart.items.length === 0) {
            cart.shop = null;
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const proceedToPayment = async (req, res) => {
  try {
    // ⭐️ FIX: Use req.body instead of cart model
    const { items, totalPrice, deliveryAddress, shop } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    const settings = await Settings.findOne() || { commissionRate: 0.01 };
    const commission = totalPrice * settings.commissionRate;
    const finalPrice = totalPrice + commission;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (menuItem.hasStock) {
        if (menuItem.currentStock < item.quantity) {
          return res.status(400).json({ message: `Not enough stock for ${menuItem.name}` });
        }
        menuItem.currentStock -= item.quantity;
        await menuItem.save();
      }
    }

    const order = new Order({
      customer: req.user._id,
      shop: shop,
      items: items,
      totalPrice: finalPrice,
      deliveryAddress: deliveryAddress,
    });
    await order.save();
    
    // Clear the cart after order is placed
    await Cart.findOneAndDelete({ customer: req.user._id });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPresentOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 
            customer: req.user._id,
            status: { $in: ['pending', 'accepted', 'ongoing'] }
        }).sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPreviousOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 
            customer: req.user._id,
            status: { $in: ['delivered', 'rejected'] }
        }).sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createAdminComplaint = async (req, res) => {
    const admin = await Admin.findOne();
    if (!admin) return res.status(400).json({ message: 'No admin found' });

    const { subject, message } = req.body;
    try {
        const complaint = new Complaint({
            fromUser: req.user._id, 
            fromModel: 'User', // ⭐️ FIX: Use 'User' to match your Complaint model
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

const createRestaurantComplaint = async (req, res) => {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    const { subject, message } = req.body;
    try {
        const complaint = new Complaint({
            fromUser: req.user._id, 
            fromModel: 'User', // ⭐️ FIX: Use 'User' to match your Complaint model
            toUser: shop.owner, 
            toModel: 'Owner',
            subject, 
            message,
        });
        await complaint.save();
        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ⭐️ NEW: Get all complaints filed by this customer
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      fromUser: req.user._id,
      fromModel: 'User' // ⭐️ FIX: Use 'User' to match your Complaint model
    }).sort({ date: -1 });
    res.json(complaints);
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

// ⭐️ NEW: Get the logged-in customer's profile
const getProfile = async (req, res) => {
  try {
    // req.user is populated by 'protect' middleware, but we find by ID
    // again to ensure we get all fields (since 'protect' might omit some)
    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
    try {
        // 'Customer' variable holds the 'User' model, this is correct.
        const user = await Customer.findByIdAndUpdate(req.user._id, req.body, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ⭐️ FIX: Make sure ALL functions are exported
module.exports = {
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
};