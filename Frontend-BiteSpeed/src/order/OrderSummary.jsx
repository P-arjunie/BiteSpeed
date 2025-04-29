import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // <-- useLocation hook for accessing location state
import axios from 'axios';

const OrderSummary = () => {
  const location = useLocation(); // Access location state
  const { restaurantId } = location.state || {}; // Extract restaurantId from state

  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    if (restaurantId) { // Check if restaurantId exists
      const fetchRestaurantDetails = async () => {
        try {
          const response = await axios.get(`https://restaurant-management-service.onrender.com/api/restaurant/${restaurantId}`);
          if (response.status === 200) {
            setRestaurant(response.data);
          }
        } catch (error) {
          console.error("Error fetching restaurant details:", error);
        }
      };

      fetchRestaurantDetails();
    }
  }, [restaurantId]); // Fetch restaurant details when restaurantId changes

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const promotionDiscount = subtotal * 0.4;
  const deliveryFee = 99;
  const serviceFee = 70;
  const total = subtotal - promotionDiscount + deliveryFee + serviceFee;

  const handlePlaceOrder = async () => {
    try {
      for (const item of cartItems) {
        const orderData = {
          userId: "", // Fill user details
          userLocation: "",
          customerName: " ",
          phone: "",
          address: "",
          email: "",
          resturantId: restaurantId,
          resturantLocation: restaurant ? restaurant.location : restaurant.address,
          resturantDistance: restaurant ? restaurant.distance : { latitude: 0, longitude: 0 },
          mealId: item.id,
          itemName: item.name,
          quantity: item.quantity,
          price: item.price,
          totalPrice: total,
          driverId: "",
          driverLocation: "",
          driverName: "",
          status: "Pending"
        };
  
        const response = await axios.post("https://ordermanagementservice.onrender.com/api/orders/", orderData);
  
        if (response.status === 200 || response.status === 201) {
          console.log("Order placed successfully for:", item.name);
        }
      }
  
      alert("All orders placed successfully!");
      setTimeout(() => {
        navigate('/payment', { state: { cartItems: cartItems } });
      }, 100);
  
    } catch (error) {
      console.error("There was an error placing the order:", error);
      alert("Error placing order. Please try again.");
    }
  };
  
  


  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-sm">
        
      <div className="w-full bg-white py-2 px-4 shadow-sm">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <img
              src={restaurant ? restaurant.image : "/path-to-placeholder-image.jpg"}
              alt="Restaurant Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h1 className="text-base font-bold text-gray-800">{restaurant ? restaurant.name : "Loading..."}</h1>
              <p className="text-xs text-gray-500">{restaurant ? restaurant.address : "Loading address..."}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 mx-3 bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-bold mb-3 text-gray-700">Cart ({cartItems.length})</h2>

        <div className="flex flex-col gap-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-700">
              <div>{item.name} × {item.quantity}</div>
              <div className="text-green-700 font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 mx-3 bg-white p-4 rounded-xl shadow-sm mb-10">
        <h2 className="text-lg font-bold text-gray-700 mb-3">Order Total</h2>

        <div className="flex justify-between text-gray-600 text-sm mb-1">
          <span>Subtotal</span>
          <span>LKR {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-red-600 font-semibold mb-1">
          <span>Promotion</span>
          <span>-LKR {promotionDiscount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm mb-1">
          <span>Delivery Fee</span>
          <span>LKR {deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm mb-3">
          <span>Service Fee</span>
          <span>LKR {serviceFee.toFixed(2)}</span>
        </div>

        <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
          <span>Total</span>
          <span>LKR {total.toFixed(2)}</span>
        </div>
      </div>

      {/* Display restaurantId below total */}
      <div className="mt-2 mx-3 bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-sm text-gray-600">Restaurant ID: {restaurantId}</h3>
      </div>

      <div className="mt-4 mx-3">
        <button
          className="w-full bg-black text-white py-3 rounded-lg text-base font-semibold hover:bg-gray-800 transition"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>

      
    </div>
  );
};

export default OrderSummary;
