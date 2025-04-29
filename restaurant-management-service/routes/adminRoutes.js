// routes/adminRoutes.js
const express = require("express");
const { verifyRestaurant } = require("../controllers/adminController");
const router = express.Router();

router.put("/verify/:id", verifyRestaurant); // Verify restaurant by admin

module.exports = router;


