import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const BasketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item , restaurantId } = location.state || {};
  
  const [quantity, setQuantity] = useState(1);

  if (!item) {
    return <div>No item found</div>;
  }

  const handleQuantityChange = (type) => {
    setQuantity(prev =>
      type === 'inc' ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const total = item.price * quantity;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({
      id: item._id,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
      restaurantId,
    });
    localStorage.setItem('cart', JSON.stringify(cart));

    // Navigate to Cart Page
    navigate('/cart', { state: { cartItems: cart , restaurantId} });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 🧭 Header */}
      <header className="w-full bg-black text-white py-4 px-6 rounded-xl mb-8 shadow-lg z-10 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-500">🍴 BiteSpeed</h1>
          <nav className="space-x-4 hidden sm:block">
            <Link to="/customer-home" className="text-orange-400 font-semibold underline">
              Home
            </Link>
            <Link to="/orders" className="hover:text-orange-400">
              My Orders
            </Link>
            <Link to="/profile" className="hover:text-orange-400">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-orange-700">🛒 Your Basket</h2>

        {/* Flex Layout */}
        <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-xl shadow-md">
          {/* Left Side - Image */}
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-full md:w-72 h-60 object-cover rounded-xl shadow-sm"
            />
          )}

          {/* Right Side - Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-orange-800">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-orange-600">Available:</span> {item.isAvailable ? 'Yes' : 'No'}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-orange-600">Category:</span> {item.category}
              </p>
              <p className="text-lg font-bold text-orange-700">
                Rs. {item.price}
              </p>
                {/* Restaurant ID Display */}
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-orange-600">Restaurant ID:</span> {restaurantId}
          </p>
            </div>

            {/* Quantity and Total */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange('dec')}
                  className="px-3 py-1 bg-gray-200 rounded-full"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('inc')}
                  className="px-3 py-1 bg-gray-200 rounded-full"
                >
                  +
                </button>
              </div>

              <div className="text-right font-bold text-lg text-orange-700">
                Total: Rs. {total.toFixed(2)}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-2 mt-6 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-black text-white rounded-xl shadow-lg px-6 py-8 z-10 relative mx-7.5 mb-7.5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-orange-400">🍴 FoodieExpress</h2>
            <p className="text-sm mt-2 text-gray-300">Delivering deliciousness to your door since 2025.</p>
          </div>
      
          {/* Navigation Section */}
          <div className="flex space-x-6 text-lg">
            <Link to="/customer-home" className="hover:text-orange-400">Home</Link>
            <Link to="/orders" className="hover:text-orange-400">My Orders</Link>
            <Link to="/profile" className="hover:text-orange-400">Profile</Link>
            <Link to="/about" className="hover:text-orange-400">About Us</Link>
            <Link to="/contact" className="hover:text-orange-400">Contact</Link>
          </div>
        </div>

        {/* Footer Text Section */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-lg text-gray-400">
          <p className="text-lg">© 2025 FoodieExpress. All rights reserved.</p>
          <p className="mt-2 text-sm">Made with 🍲 by the FoodieExpress Dev Team</p>
        </div>
      </footer>
    </div>
  );
};

export default BasketPage;
