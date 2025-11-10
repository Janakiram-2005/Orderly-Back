const express = require('express');
const router = express.Router();
const { protect, isApprovedOwner } = require('../../middleware/auth.js');
const upload = require('../../config/cloudinary.js'); 

// Debug middleware
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});
const {
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
  getProfile,
  updateProfile,
  bindBankAccount,
  getIncome,
} = require('./owner.controller.js');

router.use(protect, isApprovedOwner);

// ⭐️ MODIFIED: Added upload middleware for 'photo' field
router.post('/manage/menu', upload.single('photo'), addMenuItem);

// ⭐️ MODIFIED: Added upload middleware for 'photo' field
router.put('/manage/menu/:itemId', upload.single('photo'), updateMenuItem);

router.delete('/manage/menu/:itemId', deleteMenuItem);
router.get('/manage/inventory', getInventory);
router.get('/orders/present', getPresentOrders);
router.get('/orders/upcoming', getUpcomingOrders);
router.put('/orders/update/:orderId', updateOrder);
router.get('/complaints/upcoming', getUpcomingComplaints);
router.get('/complaints/my', getMyComplaints);
router.post('/complaints/my', fileComplaintToAdmin);
router.post('/complaints/reply/:complaintId', replyToComplaint);
router.get('/notifications', getNotifications);
router.get('/profile', getProfile);

// ⭐️ MODIFIED: Added upload middleware for 'shopLogo' field
router.put('/profile', upload.single('shopLogo'), updateProfile);

router.put('/profile/withdraw', bindBankAccount);
router.get('/profile/income', getIncome);

module.exports = router;