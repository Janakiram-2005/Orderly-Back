// Import all the models you need to manage
const Owner = require('../owner/owner.model.js');
const Customer = require('../customer/customer.model.js');
const Shop = require('../shop/shop.model.js');
const Order = require('../../models/order.model.js');
const Complaint = require('../../models/complaint.model.js');

// ⭐️ --- START OF FIX --- ⭐️
// These paths were wrong. They are in the current folder (./)
const Promotion = require('./promotion.model.js');
const Feedback = require('./feedback.model.js');
// ⭐️ --- END OF FIX --- ⭐️

const Admin = require('./admin.model.js');

// --- ⭐️ NEW DASHBOARD FUNCTION ⭐️ ---
// This one function gets all data for the main dashboard page
const getDashboardData = async (req, res) => {
  try {
    // 1. Stats
    const totalOrders = await Order.countDocuments();
    const pendingRestaurants = await Owner.countDocuments({ status: 'pending' });
    const newCustomers = await Customer.countDocuments({ createdAt: { $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) } });
    
    // Calculate Total Revenue
    const revenueData = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // 2. Recent Transactions (last 5 completed orders)
    const recentTransactions = await Order.find()
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // 3. Growth Chart (Mock data, as this query is complex)
    const growthData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'New Users',
        data: [12, 19, 3, 5, 2, 3], // Replace with real aggregation
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        fill: true,
        tension: 0.4,
      }],
    };

    // 4. Payments Chart
    const paymentStatusData = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const paymentData = {
      labels: paymentStatusData.map(d => d._id),
      datasets: [{
        label: 'Payments Status',
        data: paymentStatusData.map(d => d.count),
        backgroundColor: ['#198754', '#ffc107', '#dc3545'],
        hoverOffset: 4,
      }],
    };

    // 5. Send all data in one response
    res.json({
      stats: {
        totalRevenue,
        totalOrders,
        newCustomers,
        pendingRestaurants,
        revenueChange: '+5.2%', // Placeholder
        ordersChange: '+2.1%', // Placeholder
        customersChange: '+10%', // Placeholder
      },
      charts: {
        growthData,
        paymentData,
      },
      recentTransactions,
    });

  } catch (err) {
    console.error("Dashboard data error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- OWNER MANAGEMENT ---
const getAllOwners = async (req, res) => {
  try {
    // Find all owners, regardless of status, for the verification page
    const owners = await Owner.find().sort({ createdAt: -1 });
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    res.json(owner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    
    // Also approve their shop
    await Shop.findOneAndUpdate({ owner: owner._id }, { status: 'approved' });

    res.json({ message: 'Owner approved successfully', owner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rejectOwner = async (req, res) => {
  try {
    const { reason } = req.body;
    const owner = await Owner.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason },
      { new: true }
    );
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    res.json({ message: 'Owner rejected', owner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleOwnerStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'blocked'
    const owner = await Owner.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );
    res.json(owner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteOwner = async (req, res) => {
  try {
    await Owner.findByIdAndDelete(req.params.id);
    await Shop.findOneAndDelete({ owner: req.params.id });
    res.json({ message: 'Owner and their shop deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- CUSTOMER MANAGEMENT ---
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCustomerDetails = async (req, res) => {
   try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    const orders = await Order.find({ customer: req.params.id })
      .populate('shop', 'shopName')
      .sort({ createdAt: -1 })
      .limit(10);
      
    // Combine data
    res.json({ ...customer.toObject(), orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ... Add toggleCustomerStatus and deleteCustomer functions similar to owner ...

// --- COMPLAINTS ---
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'email') // 'user' field holds ID of user/owner
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const replyToComplaint = async (req, res) => {
  try {
    const { replyText } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', reply: replyText, repliedAt: new Date() },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- PROMOTIONS ---
const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find()
      .populate('shop', 'shopName') // 'shop' field holds ID
      .sort({ createdAt: -1 });
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPromotion = async (req, res) => {
  try {
    const newPromo = new Promotion(req.body); // { code, description, shop, ... }
    const savedPromo = await newPromo.save();
    res.status(201).json(savedPromo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletePromotion = async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Promotion deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- FEEDBACKS ---
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'email')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- PROFILE ---
// ... Add updateAdminProfile and changeAdminPassword functions ...

module.exports = {
  getDashboardData,
  getAllOwners,
  getOwnerById,
  approveOwner,
  rejectOwner,
  toggleOwnerStatus,
  deleteOwner,
  getAllCustomers,
  getCustomerDetails,
  getAllComplaints,
  replyToComplaint,
  getAllPromotions,
  createPromotion,
  deletePromotion,
  getAllFeedbacks,
  // ... export other functions
};