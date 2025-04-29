const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: String,
    userLocation: String,
    userDistance: {
      latitude: Number,
      longitude: Number
  },
    customerName: String,
    phone: String,
    address: String,
    email: String,
    resturantId: String,
    resturantLocation: String,
    resturantDistance: {
      latitude: Number,
      longitude: Number
  },
    mealId: String,
    itemName: String,
    date: {
        type: Date,
        default: Date.now,
      },
    quantity: Number,
    price: Number,
    totalPrice: Number,
    driverId: String,
    driverLocation: String,
    driverName: String,
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Out for Delivery', 'Delivered','Droped','PickUp','Assigned','Prepared'],
        default: 'Pending'
      }
});

module.exports = mongoose.model("Order", orderSchema);
