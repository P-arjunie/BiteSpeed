require ('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());

//routes
const customerRoutes = require('./routes/customerRoutes');

app.use(express.json());

//test route
app.get('/', (req, res) => {
    res.send('Customer service is running');
});

//routes
app.use('/api/customers', customerRoutes);

app.listen(PORT, () => {
    console.log(`Customer service running on port ${PORT}`)
})
