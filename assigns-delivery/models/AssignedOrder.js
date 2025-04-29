// models/AssignedOrder.js
const mongoose = require("mongoose");

const assignedOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  driverName: { type: String, required: true },
  driverId: { type: String, required: true },
  driverLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  vehicleNumber: { type: String, required: true },
  contactNumber: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("AssignedOrder", assignedOrderSchema);
