const express = require('express');
const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  deleteCustomerAccount,
  getAllCustomers,
} = require('../controllers/customerController');

const router = express.Router();

// Public routes
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// Protected routes (requires token)
router.get("/profile", getCustomerProfile);
router.put("/profile", updateCustomerProfile);
router.delete("/profile", deleteCustomerAccount);

// Admin route 
router.get("/all", getAllCustomers);

module.exports = router;
