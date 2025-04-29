const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const orderRoutes = require("./routes/orderRoutes");
const assignOrderRoutes = require("./routes/assignOrders"); // ✅ Import your new route

dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use("/api/orders", orderRoutes);         // Example: GET /api/orders
app.use("/api/assign", assignOrderRoutes);   // Example: POST /api/assign/assign-order

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
