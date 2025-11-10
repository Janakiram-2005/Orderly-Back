const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../../middleware/auth.js'); 

// Import ALL the functions from your controller
const {
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
  getAllFeedbacks
} = require('./admin.controller.js');

// All admin routes are protected by default
router.use(protect, isAdmin);

// --- DASHBOARD ---
// GET /api/admin/dashboard-data
router.get('/dashboard-data', getDashboardData);

// --- OWNER MANAGEMENT ---
// GET /api/admin/owners
router.get('/owners', getAllOwners);
// GET /api/admin/owners/:id
router.get('/owners/:id', getOwnerById);
// PUT /api/admin/owners/:id/approve
router.put('/owners/:id/approve', approveOwner);
// PUT /api/admin/owners/:id/reject
router.put('/owners/:id/reject', rejectOwner);
// PUT /api/admin/owners/:id/toggle-status
router.put('/owners/:id/toggle-status', toggleOwnerStatus);
// DELETE /api/admin/owners/:id
router.delete('/owners/:id', deleteOwner);

// --- CUSTOMER MANAGEMENT ---
// GET /api/admin/customers
router.get('/customers', getAllCustomers);
// GET /api/admin/customers/:id/details
router.get('/customers/:id/details', getCustomerDetails);
// ... Add routes for toggling/deleting customers ...

// --- COMPLAINTS ---
// GET /api/admin/complaints
router.get('/complaints', getAllComplaints);
// POST /api/admin/complaints/:id/reply
router.post('/complaints/:id/reply', replyToComplaint);

// --- PROMOTIONS ---
// GET /api/admin/promotions
router.get('/promotions', getAllPromotions);
// POST /api/admin/promotions
router.post('/promotions', createPromotion);
// DELETE /api/admin/promotions/:id
router.delete('/promotions/:id', deletePromotion);

// --- FEEDBACKS ---
// GET /api/admin/feedbacks
router.get('/feedbacks', getAllFeedbacks);

module.exports = router;