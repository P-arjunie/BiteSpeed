const axios = require("axios");

// Controller function to get accepted orders
const getOutForDelivery = async (req, res) => {
  try {
    // Get all orders
    const { data: orders } = await axios.get("https://ordermanagementservice.onrender.com/api/orders");

    // Filter only accepted orders
    const Prepared = orders.filter(order => order.status === "Prepared");

    if (Prepared.length === 0) {
      return res.json({ message: "Out for Delivery" });
    }

    // Send filtered orders to frontend
    res.json({ orders: Prepared });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getOutForDelivery,
};
