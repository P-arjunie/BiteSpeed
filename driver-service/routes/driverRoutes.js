const express = require("express");
const { registerDriver , loginDriver,getMyProfile,addVehicle,getMyVehicles } = require("../controllers/driverController");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();


//Register a new driver
router.post("/register", registerDriver);

// Driver login 
router.post("/login", loginDriver);



router.get("/profile/me", verifyToken, getMyProfile);

router.post('/vehicle/add', verifyToken, addVehicle);

router.get('/vehicle/my-vehicles', verifyToken, getMyVehicles);

module.exports = router;