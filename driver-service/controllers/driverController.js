const Driver = require("../models/driverModel");
const Vehicle = require("../models/vehicleModel");
const axios = require("axios");
const fetch = require("node-fetch"); // Add this if you're not using native fetch in Node.js

const registerDriver = async (req, res) => {
    try {
        const { name, nic, address, age, gender, email, phone, password, licenseNumber } = req.body;

        // Check if driver already exists
        const existingDriver = await Driver.findOne({ $or: [{ email }, { nic }] });
        if (existingDriver) {
            return res.status(400).json({ message: "Driver already exists" });
        }

        // Save driver in the local DB
        const newDriver = new Driver({ 
            name, 
            nic, 
            address, 
            age, 
            gender, 
            email, 
            phone, 
            password, 
            licenseNumber // Added license number to the driver
        });
        await newDriver.save();

        // Register with the auth service
        const role = "driver";
        const authRes = await fetch('https://auth-service-2-4xm3.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });

        const authData = await authRes.json();

        if (authRes.status === 201) {
            return res.status(201).json({ message: "Driver registered successfully" });
        } else if (authRes.status === 409) {
            // If the email is already registered in auth, rollback local DB save
            await Driver.deleteOne({ email });
            return res.status(409).json({ message: "Auth registration failed - Email already registered", error: authData.message });
        } else {
            return res.status(500).json({ message: "Driver saved, but auth registration failed", error: authData.message });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error registering driver", error: error.message });
    }
};




const loginDriver = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Send email & password to auth-service for login
        const authResponse = await axios.post("http://auth-service:5002/api/auth/login", { email, password });

        if (authResponse.status === 200) {
            const token = authResponse.data.token;
            res.json({ message: "Login successful", token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

const getMyProfile = async (req, res) => {
    try {
        console.log("User object:", req.user); // Debug log

        const email = req.user?.email; // Optional chaining for safety

        if (!email) {
            return res.status(400).json({ message: "Email not found in user object" });
        }

        const driver = await Driver.findOne({ email }).select("-password");

        if (!driver) return res.status(404).json({ message: "Driver not found" });

        res.status(200).json(driver);
    } catch (error) {
        console.error("Error in getMyProfile:", error); // Log the error in the console
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

const addVehicle = async (req, res) => {
    try {
      const { number, model, color, year } = req.body;
      const driverEmail = req.user?.email;
  
      if (!driverEmail) {
        return res.status(401).json({ message: "Unauthorized: Email not found in token" });
      }
  
      // Check if vehicle with same number already exists for this user
      const existingVehicle = await Vehicle.findOne({ number, driverEmail });
      if (existingVehicle) {
        return res.status(400).json({ message: "Vehicle already exists for this driver" });
      }
  
      const newVehicle = new Vehicle({ number, model, color, year, driverEmail });
      await newVehicle.save();
  
      res.status(201).json({ message: "Vehicle added successfully" });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      res.status(500).json({ message: "Server error while adding vehicle", error: error.message });
    }
  };

  const getMyVehicles = async (req, res) => {
    try {
        const driverEmail = req.user?.email;

        if (!driverEmail) {
            return res.status(401).json({ message: "Unauthorized: Email not found in token" });
        }

        const vehicles = await Vehicle.find({ driverEmail });

        res.status(200).json(vehicles);
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ message: "Error fetching vehicles", error: error.message });
    }
};





module.exports = { registerDriver, loginDriver, getMyProfile,addVehicle ,getMyVehicles };
