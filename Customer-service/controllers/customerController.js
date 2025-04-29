const Customer = require("../models/Customer");
const axios = require("axios");

// Register customer
exports.registerCustomer = async (req, res) => {
    try {
        const { name, email, phone, address, password } = req.body;

        // Check if existing customer
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Customer already exists" });
        }

        // Save to Customer DB
        const newCustomer = new Customer({ name, email, phone, address });
        await newCustomer.save();

        // Send password to Auth Service
        await axios.post(`${process.env.AUTH_SERVICE_URL}/api/auth/register`, {
            email,
            password,
            role: 'customer'
        });

        res.status(201).json({ message: "Customer registered successfully" });
    } catch (err) {
        console.error("Full error: ", err);
        res.status(500).json({ message: "Registration failed", error: err.message || "Unknown error" });
    }
};

// Customer login
exports.loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        const authResponse = await axios.post(`${process.env.AUTH_SERVICE_URL}/api/auth/login`, {
            email,
            password,
        });

        res.status(200).json({
            message: "Login successful",
            token: authResponse.data.token,
        });
    } catch (err) {
        console.error("Login error:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({
            message: "Login failed",
            error: err.response?.data || err.message,
        });
    }
};

// Get customer profile
exports.getCustomerProfile = async (req, res) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

        const verifyResponse = await axios.get(
            `${process.env.AUTH_SERVICE_URL}/api/auth/verify-token`,
            { headers: { Authorization: token } }
        );

        const email = verifyResponse.data.email;
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(customer);
    } catch (err) {
        console.error('Error fetching customer profile:', err.message);
        res.status(500).json({
            message: 'Failed to fetch customer profile',
            error: err.message,
        });
    }
};

// Update customer profile
exports.updateCustomerProfile = async (req, res) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

        const verifyResponse = await axios.get(
            `${process.env.AUTH_SERVICE_URL}/api/auth/verify-token`,
            { headers: { Authorization: token } }
        );

        const email = verifyResponse.data.email;
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const { name, phone, address } = req.body;
        if (name) customer.name = name;
        if (phone) customer.phone = phone;
        if (address) customer.address = address;

        await customer.save();

        res.status(200).json({
            message: 'Customer profile updated successfully',
            customer,
        });

    } catch (err) {
        console.error('Error updating customer profile:', err.message);
        res.status(500).json({
            message: 'Failed to update profile',
            error: err.message,
        });
    }
};

// Delete customer account
exports.deleteCustomerAccount = async (req, res) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

        const verifyResponse = await axios.get(
            `${process.env.AUTH_SERVICE_URL}/api/auth/verify-token`,
            { headers: { Authorization: token } }
        );

        const email = verifyResponse.data.email;
        const customer = await Customer.findOneAndDelete({ email });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Optional: Inform Auth service to delete credentials too (depends on your auth microservice)
        await axios.delete(`${process.env.AUTH_SERVICE_URL}/api/auth/delete`, {
            headers: { Authorization: token }
        });

        res.status(200).json({ message: 'Customer account deleted successfully' });
    } catch (err) {
        console.error('Error deleting customer account:', err.message);
        res.status(500).json({
            message: 'Failed to delete account',
            error: err.message,
        });
    }
};

// Get all customers (Admin purpose)
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().select('-__v'); // Remove __v field for cleaner response
        res.status(200).json(customers);
    } catch (err) {
        console.error('Error fetching customers:', err.message);
        res.status(500).json({
            message: 'Failed to fetch customers',
            error: err.message,
        });
    }
};
