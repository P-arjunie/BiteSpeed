const express = require("express");
const {
    addMenuItem,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem,
    uploadMenuImage
} = require("../controllers/menuController");

const router = express.Router();

// POST: Add menu item with image
router.post("/", uploadMenuImage, addMenuItem);

// GET: Get all menu items for a restaurant
router.get("/:restaurantId", getMenuItems);

// PUT: Update a menu item with optional image
router.put("/:id", uploadMenuImage, updateMenuItem);

// DELETE: Delete a menu item
router.delete("/:id", deleteMenuItem);

module.exports = router;

