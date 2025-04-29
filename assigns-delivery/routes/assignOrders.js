// routes/assignOrders.js
const express = require("express");
const router = express.Router();
const { assignOrder } = require("../controllers/AssignOrders");

// Route to assign an order to a driver
router.post("/assign-order", assignOrder);

module.exports = router;
