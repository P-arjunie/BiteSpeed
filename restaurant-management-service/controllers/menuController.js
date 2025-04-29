const MenuItem = require("../models/menuItemModel");
const multer = require("multer");
const { restaurantStorage } = require("../utils/cloudinaryConfig"); // You can rename it to general 'imageStorage' if needed
const upload = multer({ storage: restaurantStorage });

// Add Menu Item with Cloudinary Image Upload
const addMenuItem = async (req, res) => {
    try {
        const { restaurantId, name, description, price, category } = req.body;
        const image = req.file?.path || "";

        const menuItem = new MenuItem({
            restaurantId,
            name,
            description,
            price,
            category, // 🆕 Include category
            image
        });

        await menuItem.save();
        res.status(201).json({ message: "Menu item added successfully", menuItem });
    } catch (error) {
        res.status(500).json({ message: "Error adding menu item", error: error.message });
    }
};


// Get Menu Items by Restaurant
const getMenuItems = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const items = await MenuItem.find({ restaurantId });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching menu items", error: error.message });
    }
};

// Update Menu Item with optional new image
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, isAvailable, category } = req.body;

        const updatedFields = {
            ...(name && { name }),
            ...(description && { description }),
            ...(price && { price }),
            ...(isAvailable !== undefined && { isAvailable }),
            ...(category && { category }) // 🆕 Add category if provided
        };

        if (req.file?.path) {
            updatedFields.image = req.file.path;
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(id, updatedFields, { new: true });
        res.json({ message: "Menu item updated", updatedItem });
    } catch (error) {
        res.status(500).json({ message: "Error updating menu item", error: error.message });
    }
};

// Delete Menu Item
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        await MenuItem.findByIdAndDelete(id);
        res.json({ message: "Menu item deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting menu item", error: error.message });
    }
};

module.exports = {
    addMenuItem,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem,
    uploadMenuImage: upload.single("image") // 👈 export upload for route usage
};