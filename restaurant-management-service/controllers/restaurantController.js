/*
// controllers/restaurantController.js
const Restaurant = require("../models/restaurantModel");
const axios = require("axios");
const multer = require("multer");
const { restaurantStorage } = require("../utils/cloudinaryConfig");
const upload = multer({ storage: restaurantStorage });
const fetch = require("node-fetch"); // Use node-fetch if not using native fetch in Node.js

const registerRestaurant = async (req, res) => {
    try {
        const { name, email, phone, password, address, cuisineType } = req.body;

        // Check if the restaurant already exists
        const existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant) {
            return res.status(400).json({ message: "Restaurant already exists" });
        }

        // Save restaurant in the local DB
        const role = "restaurant";
        const image = req.file?.path || "";

        const newRestaurant = new Restaurant({
            name,
            email,
            phone,
            password,
            address,
            cuisineType,
            role,
            image
        });

        await newRestaurant.save();

        // Register with the auth service
        const authRes = await fetch('https://auth-service-2-4xm3.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });

        const authData = await authRes.json();

        if (authRes.status === 201) {
            return res.status(201).json({ message: "Restaurant registered successfully, awaiting admin approval" });
        } else if (authRes.status === 409) {
            // If the email is already registered in auth, rollback local DB save
            await Restaurant.deleteOne({ email });
            return res.status(409).json({ message: "Auth registration failed - Email already registered", error: authData.message });
        } else {
            return res.status(500).json({ message: "Restaurant saved, but auth registration failed", error: authData.message });
        }

    } catch (error) {
        return res.status(500).json({ message: "Error registering restaurant", error: error.message });
    }
};

const loginRestaurant = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Send email & password to auth-service for login
        const authResponse = await axios.post("http://auth-service.com:5002/api/auth/login", { email, password });
        

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


const setRestaurantAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['open', 'closed'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const restaurant = await Restaurant.findByIdAndUpdate(id, { status }, { new: true });
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        res.json({ message: `Restaurant marked as ${status}`, restaurant });
    } catch (error) {
        res.status(500).json({ message: "Error updating availability", error: error.message });
    }
};

const viewOrders = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const response = await axios.get(`http://order-service:5002/api/orders/restaurant/${restaurantId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const response = await axios.patch(`http://order-service:5002/api/orders/${orderId}/status`, { status });
        res.json({ message: "Order status updated", data: response.data });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};

const getMyProfile = async (req, res) => {
    try {
        console.log("User object:", req.user); // Debug log
 
        const email = req.user?.email; // Optional chaining for safety
 
        if (!email) {
            return res.status(400).json({ message: "Email not found in user object" });
        }
 
        const restaurant = await Restaurant.findOne({ email }).select("-password");
 
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
 
        res.status(200).json(restaurant);
    } catch (error) {
        console.error("Error in getMyProfile:", error); // Log the error in the console
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().select("-password"); // Exclude password
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurants", error: error.message });
    }
};


module.exports = {
    registerRestaurant,
    loginRestaurant,
    setRestaurantAvailability,
    viewOrders,
    updateOrderStatus,
    getMyProfile,
    uploadRestaurantImage: upload.single("image"),
    getAllRestaurants, 
};
*/

// controllers/restaurantController.js
const Restaurant = require("../models/restaurantModel");
const axios = require("axios");
const multer = require("multer");
const { restaurantStorage } = require("../utils/cloudinaryConfig");
const upload = multer({ storage: restaurantStorage });
const fetch = require("node-fetch"); // Use node-fetch if not using native fetch in Node.js


const getCoordinatesFromAddress = async (address) => {
    const apiKey = 'AIzaSyBoJXxxWOMKdexaiud8ImxzzkaHtEIYtds'; // Replace with your Google Maps API key
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(geocodeUrl);
        if (response.data.status === 'OK') {
            const lat = response.data.results[0].geometry.location.lat;
            const lng = response.data.results[0].geometry.location.lng;
            return { lat, lng };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        throw new Error(`Geocoding error: ${error.message}`);
    }
};

const registerRestaurant = async (req, res) => {
    try {
        const { name, email, phone, password, address, cuisineType } = req.body;

        // Check if the restaurant already exists
        const existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant) {
            return res.status(400).json({ message: "Restaurant already exists" });
        }

        // Get coordinates (latitude, longitude) from the address
        const { lat, lng } = await getCoordinatesFromAddress(address);

        // Save restaurant in the local DB
        const role = "restaurant";
        const image = req.file?.path || "";

        const newRestaurant = new Restaurant({
            name,
            email,
            phone,
            password,
            address,
            cuisineType,
            role,
            image,
            latitude: lat,
            longitude: lng,
        });

        await newRestaurant.save();

        // Register with the auth service
        const authRes = await fetch('https://auth-service-2-4xm3.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });

        const authData = await authRes.json();

        if (authRes.status === 201) {
            return res.status(201).json({ message: "Restaurant registered successfully, awaiting admin approval" });
        } else if (authRes.status === 409) {
            // If the email is already registered in auth, rollback local DB save
            await Restaurant.deleteOne({ email });
            return res.status(409).json({ message: "Auth registration failed - Email already registered", error: authData.message });
        } else {
            return res.status(500).json({ message: "Restaurant saved, but auth registration failed", error: authData.message });
        }

    } catch (error) {
        return res.status(500).json({ message: "Error registering restaurant", error: error.message });
    }
};

const loginRestaurant = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Send email & password to auth-service for login
        const authResponse = await axios.post("http://auth-service.com:5002/api/auth/login", { email, password });
        

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


const setRestaurantAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['open', 'closed'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const restaurant = await Restaurant.findByIdAndUpdate(id, { status }, { new: true });
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        res.json({ message: `Restaurant marked as ${status}`, restaurant });
    } catch (error) {
        res.status(500).json({ message: "Error updating availability", error: error.message });
    }
};


/*
const viewOrders = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Fetch all orders from the Order Service
        const response = await axios.get("https://ordermanagementservice.onrender.com/api/orders");
        console.log("All orders from Order Service:", response.data);

        // Filter orders by restaurantId and status "Pending", then map to only include needed fields
        const filteredOrders = response.data
            .filter(order => {
                if (order.resturantId && restaurantId) {
                    const matchesRestaurantId = order.resturantId.toLowerCase() === restaurantId.toLowerCase();
                    const isPendingStatus = order.status && order.status.toLowerCase() === 'pending';
                    return matchesRestaurantId && isPendingStatus;
                }
                return false;
            })
            .map(order => ({
                orderId: order._id,
                customerName: order.customerName,
                itemName: order.itemName,
                quantity: order.quantity,
                price: order.price,
                address: order.address,
                phone: order.phone,
                status: order.status,
                date: order.date
            }));

        res.status(200).json(filteredOrders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};
*/

/*const viewOrders = async (req, res) => {
    try {
        const restaurantEmail = req.user?.email;

        if (!restaurantEmail) {
            return res.status(400).json({ message: "Restaurant email not found in token" });
        }

        // Get the restaurant document to access the _id
        const restaurant = await Restaurant.findOne({ email: restaurantEmail });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const restaurantId = restaurant._id.toString(); // Convert ObjectId to string

        // Fetch all orders from the Order Service
        const response = await axios.get("https://ordermanagementservice.onrender.com/api/orders");

        const filteredOrders = response.data
            .filter(order => {
                return (
                    order.resturantId &&
                    order.resturantId.toLowerCase() === restaurantId.toLowerCase() &&
                    order.status?.toLowerCase() === "pending" &&
                    order.rejected !== true // Don't show rejected orders
                    //order.status?.toLowerCase() === "pending"
                    
                );
            })
            .map(order => ({
                orderId: order._id,
                customerName: order.customerName,
                itemName: order.itemName,
                quantity: order.quantity,
                price: order.price,
                address: order.address,
                phone: order.phone,
                status: order.status,
                date: order.date,
            }));

        res.status(200).json(filteredOrders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};
*/

const viewOrders = async (req, res) => {
    try {
      const restaurantEmail = req.user?.email;
  
      if (!restaurantEmail) {
        return res.status(400).json({ message: "Restaurant email not found in token" });
      }
  
      const restaurant = await Restaurant.findOne({ email: restaurantEmail });
  
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      const restaurantId = restaurant._id.toString();
  
      const response = await axios.get("https://ordermanagementservice.onrender.com/api/orders");
  
      const filteredOrders = response.data
        .filter(order => {
          return (
            order.resturantId &&
            order.resturantId.toLowerCase() === restaurantId.toLowerCase() &&
            order.rejected !== true // Still avoid rejected manually flagged ones
          );
        })
        .map(order => ({
          orderId: order._id,
          customerName: order.customerName,
          itemName: order.itemName,
          quantity: order.quantity,
          price: order.price,
          address: order.address,
          phone: order.phone,
          status: order.status,
          date: order.date,
        }));
  
      res.status(200).json(filteredOrders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
  };
  
  /*
  const updateOrderStatus = async (req, res) => {
    try {
        const restaurantEmail = req.user?.email;

        if (!restaurantEmail) {
            return res.status(400).json({
                message: "Restaurant email not found in token"
            });
        }

        // Optional: confirm that the restaurant exists
        const restaurant = await Restaurant.findOne({ email: restaurantEmail });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const { orderId } = req.params;
        const { status } = req.body;

        // Valid statuses according to the Order Service
        const validStatuses = ["Pending", "Accepted", "Out for Delivery", "Delivered"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Must be one of: Pending, Accepted, Out for Delivery, Delivered."
            });
        }

        // Send PATCH request to Order Service
        const response = await axios.patch(
            `https://ordermanagementservice.onrender.com/api/orders/${orderId}/update-status`,
            { status }
        );

        res.status(200).json({
            message: "Order status successfully updated",
            updatedOrder: response.data
        });
    } catch (error) {
        console.error("Error updating order status:", error.message);
        if (error.response) {
            console.error("Order Service Error Response:", error.response.data);
        }
        res.status(500).json({
            message: "Error updating order status",
            error: error.message
        });
    }
};
*/

//after add prepared status
const updateOrderStatus = async (req, res) => {
    try {
      const restaurantEmail = req.user?.email;
  
      if (!restaurantEmail) {
        return res.status(400).json({
          message: "Restaurant email not found in token",
        });
      }
  
      // Optional: confirm that the restaurant exists
      const restaurant = await Restaurant.findOne({ email: restaurantEmail });
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      const { orderId } = req.params;
      const { status } = req.body;
  
      // Valid statuses according to the Order Service
      const validStatuses = ["Pending", "Accepted", "Prepared", "Out for Delivery", "Delivered"];
  
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Must be one of: Pending, Accepted, Prepared, Out for Delivery, Delivered.",
        });
      }
  
      // Send PATCH request to Order Service
      const response = await axios.patch(
        `https://ordermanagementservice.onrender.com/api/orders/${orderId}/update-status`,
        { status }
      );
  
      res.status(200).json({
        message: "Order status successfully updated",
        updatedOrder: response.data,
      });
    } catch (error) {
      console.error("Error updating order status:", error.message);
      if (error.response) {
        console.error("Order Service Error Response:", error.response.data);
      }
      res.status(500).json({
        message: "Error updating order status",
        error: error.message,
      });
    }
  };


/*
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Valid statuses according to the Order Service
        const validStatuses = ["Pending", "Accepted", "Out for Delivery", "Delivered"];

        // Validate status
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be one of: Pending, Accepted, Out for Delivery, Delivered." });
        }

        // Send PATCH request to Order Service with correct route
        const response = await axios.patch(
            `https://ordermanagementservice.onrender.com/api/orders/${orderId}/update-status`,
            { status }
        );

        // Return updated order data
        res.status(200).json({
            message: "Order status successfully updated",
            updatedOrder: response.data
        });
    } catch (error) {
        console.error("Update order error:", error.message);
        if (error.response) {
            console.error("Order Service Error Response:", error.response.data);
        }
        res.status(500).json({
            message: "Error updating order status",
            error: error.message
        });
    }
};
*/

/*
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Map custom restaurant statuses to valid order service statuses
        const statusMapping = {
            "preparing": "Accepted",   // Restaurant preparing -> Order Accepted
            "prepared": "Out for Delivery", // Restaurant prepared -> Order Out for Delivery
            "rejected": "Pending"     // Restaurant rejected -> Order Pending (re-queued)
        };

        // Check if the status from the restaurant is valid
        if (!statusMapping[status]) {
            return res.status(400).json({
                message: "Invalid restaurant status. Must be one of: preparing, prepared, rejected."
            });
        }

        // Get the corresponding status for the Order Service
        const mappedStatus = statusMapping[status];

        // Send PATCH request to Order Service to update the status
        const response = await axios.patch(
            `https://ordermanagementservice.onrender.com/api/orders/${orderId}/update-status`,
            { status: mappedStatus }
        );

        // Return the updated order data
        res.status(200).json({
            message: "Order status successfully updated",
            updatedOrder: response.data
        });
    } catch (error) {
        console.error("Error updating order status:", error.message);
        if (error.response) {
            console.error("Order Service Error:", error.response.data);
        }
        res.status(500).json({
            message: "Error updating order status",
            error: error.message
        });
    }
};
*/

/*
const updateOrderStatus = async (req, res) => {
    try {
        const restaurantEmail = req.user?.email;

        if (!restaurantEmail) {
            return res.status(400).json({
                message: "Restaurant email not found in token"
            });
        }

        // Optional: confirm that the restaurant exists
        const restaurant = await Restaurant.findOne({ email: restaurantEmail });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const { orderId } = req.params;
        const { status } = req.body;

        // Map custom restaurant statuses to valid order service statuses
        const statusMapping = {
            "preparing": "Accepted",
            "prepared": "Out for Delivery",
            "rejected": "Pending"
        };

        if (!statusMapping[status]) {
            return res.status(400).json({
                message: "Invalid restaurant status. Must be one of: preparing, prepared, rejected."
            });
        }

        const mappedStatus = statusMapping[status];

        const response = await axios.patch(
            `https://ordermanagementservice.onrender.com/api/orders/${orderId}/update-status`,
            { status: mappedStatus }
        );

        res.status(200).json({
            message: "Order status successfully updated",
            updatedOrder: response.data
        });
    } catch (error) {
        console.error("Error updating order status:", error.message);
        if (error.response) {
            console.error("Order Service Error:", error.response.data);
        }
        res.status(500).json({
            message: "Error updating order status",
            error: error.message
        });
    }
};
*/


const getMyProfile = async (req, res) => {
    try {
        console.log("User object:", req.user); // Debug log
 
        const email = req.user?.email; // Optional chaining for safety
 
        if (!email) {
            return res.status(400).json({ message: "Email not found in user object" });
        }
 
        const restaurant = await Restaurant.findOne({ email }).select("-password");
 
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
 
        res.status(200).json(restaurant);
    } catch (error) {
        console.error("Error in getMyProfile:", error); // Log the error in the console
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().select("-password"); // Exclude password
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurants", error: error.message });
    }
};

const getRestaurantLocation = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Find the restaurant by its ID
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Return the restaurant's location (latitude and longitude)
        res.json({ latitude: restaurant.latitude, longitude: restaurant.longitude });
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurant location", error: error.message });
    }
};

const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params; // Restaurant ID from URL
        const { name, email, phone, password, address, cuisineType } = req.body;

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // If the address has been updated, get new coordinates (latitude, longitude)
        let updatedRestaurantData = { name, email, phone, password, cuisineType };

        if (address) {
            const { lat, lng } = await getCoordinatesFromAddress(address);
            updatedRestaurantData.address = address;
            updatedRestaurantData.latitude = lat;
            updatedRestaurantData.longitude = lng;
        }

        // Update the restaurant with new data
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updatedRestaurantData, { new: true });

        res.json({ message: "Restaurant updated successfully", data: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ message: "Error updating restaurant", error: error.message });
    }
};

//get one restaurant
const getOneRestaurant = async (req, res) => {
    try {
        const { id } = req.params; // assuming you pass the restaurant ID in the URL
        
        const restaurant = await Restaurant.findById(id);
        
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        return res.status(200).json(restaurant);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving restaurant", error: error.message });
    }
};


module.exports = {
    registerRestaurant,
    loginRestaurant,
    setRestaurantAvailability,
    viewOrders,
    updateOrderStatus,
    getMyProfile,
    uploadRestaurantImage: upload.single("image"),
    getAllRestaurants,
    getOneRestaurant,
    getRestaurantLocation,
    updateRestaurant
};
