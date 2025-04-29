// controllers/adminController.js
const Restaurant = require("../models/restaurantModel");

const verifyRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, { isVerified: true });
        res.json({ message: "Restaurant verified successfully", restaurant });
    } catch (error) {
        res.status(500).json({ message: "Error verifying restaurant", error });
    }
};


module.exports = { verifyRestaurant };
