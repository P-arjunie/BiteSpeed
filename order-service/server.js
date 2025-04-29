require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Correct CORS setup
app.use(cors({
    origin: '*', // <-- Allow any origin (localhost + frontend)
    credentials: false, // <-- Only needed if you are sending cookies / authorization headers (JWT with cookies)
}));

app.use(express.json());

connectDB();

app.use("/api/orders", require("./routes/orderRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));
