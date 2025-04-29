require("dotenv").config(); // Load .env variables
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const driverRoutes = require("./routes/driverRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use driver routes
app.use("/api/drivers", driverRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Driver Service running on port ${PORT}`);
});
