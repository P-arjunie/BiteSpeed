/*
// routes/restaurantRoutes.js
const express = require("express");
const router = express.Router();
const {
    registerRestaurant,
    loginRestaurant,
    setRestaurantAvailability,
    viewOrders,
    updateOrderStatus,
    getMyProfile,
    getAllRestaurants,
    uploadRestaurantImage
} = require("../controllers/restaurantController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/register", uploadRestaurantImage, registerRestaurant);
router.post("/login", loginRestaurant);
router.patch("/:id/status", setRestaurantAvailability);
router.get("/:restaurantId/orders", viewOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

router.get("/profile/me", verifyToken, getMyProfile);
router.get("/getAll", getAllRestaurants);


module.exports = router;
*/


// routes/restaurantRoutes.js
const express = require("express");
const router = express.Router();
const {
    registerRestaurant,
    loginRestaurant,
    setRestaurantAvailability,
    viewOrders,
    updateOrderStatus,
    getMyProfile,
    getRestaurantLocation,
    getAllRestaurants,
    getOneRestaurant,
    updateRestaurant,
    uploadRestaurantImage
} = require("../controllers/restaurantController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/register", uploadRestaurantImage, registerRestaurant);
router.post("/login", loginRestaurant);
router.patch("/:id/status", setRestaurantAvailability);
//router.get("/orders/:restaurantId", viewOrders);
router.get("/orders/me", verifyToken, viewOrders);

//router.patch("/orders/:orderId/status", updateOrderStatus);
router.patch("/orders/:orderId/status", verifyToken, updateOrderStatus);


router.get("/profile/me", verifyToken, getMyProfile);
router.get("/getAll", getAllRestaurants);
router.get("/:restaurantId/location", getRestaurantLocation); // Add this route
// Update restaurant details (new route for updating restaurant information)
router.patch("/:id", verifyToken, updateRestaurant);

//get one restaurant
router.get('/:id', getOneRestaurant);


module.exports = router;