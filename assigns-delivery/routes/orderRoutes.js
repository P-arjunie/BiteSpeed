const express = require("express");
const { getOutForDelivery } = require("../controllers/GetNearbyOrders");

const router = express.Router();

// Route to get accepted orders
router.post("/get-nearby-orders", getOutForDelivery);

module.exports = router;
