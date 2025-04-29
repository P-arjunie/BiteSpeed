const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// get orders by id



exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// assign the driver

exports.assignDriver = async (req, res) => {
    const { id } = req.params;
    const { driverId, driverLocation , driverName } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { driverId, driverLocation,driverName, status: "Out for Delivery" },
            { new: true }
        );
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// update the order status

exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Valid statuses
    const validStatuses = ['Pending', 'Accepted', 'Out for Delivery', 'Delivered','Droped','PickUp','Assigned','Prepared'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// update the resturant details

exports.updateRestaurantDetails = async (req, res) => {
    const { id } = req.params;
    const { resturantId, resturantLocation } = req.body;

    if (!resturantId || !resturantLocation) {
        return res.status(400).json({ error: "Both resturantId and resturantLocation are required" });
    }

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { resturantId, resturantLocation },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// update the user details

exports.updateUserDetails = async (req, res) => {
    const { id } = req.params;
    const { userId, userLocation, customerName, phone, address , email} = req.body;

    if (!userId || !userLocation || !customerName || !phone || !address || !email) {
        return res.status(400).json({ error: "All user details are required" });
    }

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { userId, userLocation, customerName, phone, address,email },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// update the meal details

exports.updateMealDetails = async (req, res) => {
    const { id } = req.params;
    const { mealId, itemName, quantity, price, totalPrice } = req.body;

    if (!mealId || !itemName || !quantity || !price || !totalPrice) {
        return res.status(400).json({ error: "All meal details are required" });
    }

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { mealId, itemName, quantity, price,totalPrice },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get to the accepted orders 

// Get orders by status
exports.getOrdersByStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const orders = await Order.find({ status });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

