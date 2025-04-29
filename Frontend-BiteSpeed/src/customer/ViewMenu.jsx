/*
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const ViewMenu = () => {
  const { id: restaurantId } = useParams();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/menu/${restaurantId}`);
      setMenuItems(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load menu items.");
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(menuItems.map(item => item.category))];

  const filteredItems = menuItems
    .filter(item => selectedCategory === "All" || item.category === selectedCategory)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-white relative overflow-hidden p-4 md:p-6 flex flex-col justify-between">
    
      <div className="absolute top-0 left-0 w-44 h-44 bg-orange-200 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-300 rounded-full opacity-40 z-0" />
      <div className="absolute top-1/2 left-full w-40 h-40 bg-orange-400 rounded-full opacity-20 -translate-y-1/2 -translate-x-full z-0" />

      
      <header className="w-full bg-black text-white py-4 px-6 rounded-xl mb-8 shadow-lg z-10 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-500">🍴 FoodieExpress</h1>
          <nav className="space-x-4 hidden sm:block">
            <Link to="/customer-home" className="hover:text-orange-400">Home</Link>
            <Link to="/orders" className="hover:text-orange-400">My Orders</Link>
            <Link to="/profile" className="hover:text-orange-400">Profile</Link>
          </nav>
        </div>
      </header>


      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-orange-700">Explore Our Best Menu</h2>
          <button
            className="md:hidden text-sm text-orange-600 underline"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        
        <div className={`mb-8 transition-all duration-300 ${showFilters ? "block" : "hidden"} md:block`}>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm border font-medium transition ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-orange-500 border-orange-300 hover:bg-orange-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search menu items..."
              className="border border-orange-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-orange-300 rounded-lg px-4 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="default">Sort By</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-lg text-orange-500">Loading menu items...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-medium">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-500">No menu items found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-2xl p-4 border border-orange-100 hover:shadow-xl transition flex flex-col"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                )}
                <div className="flex justify-between gap-4 items-start">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-orange-800">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">{item.description}</p>
                    <p className={`text-sm font-semibold mt-1 ${item.isAvailable ? "text-green-600" : "text-red-500"}`}>
                    {item.isAvailable ? "🟢 Available" : "🔴 Not Available"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                       <span className="font-semibold text-orange-600">Category:</span> {item.category}
                    </p>
                </div>

                  <div className="text-right whitespace-nowrap">
                    <p className="text-lg font-bold text-orange-800">Rs. {item.price}</p>
                    <button
                      onClick={() => navigate("/basket")}
                      className="mt-3 px-4 py-1.5 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
                    >
                      Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     
      <footer className="mt-20 bg-black text-white rounded-xl shadow-lg px-6 py-8 z-10 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-orange-400">🍴 FoodieExpress</h2>
            <p className="text-sm mt-2 text-gray-300">Delivering deliciousness to your door since 2025.</p>
          </div>
          <div className="flex space-x-6 text-lg">
            <Link to="/customer-home" className="hover:text-orange-400">Home</Link>
            <Link to="/orders" className="hover:text-orange-400">My Orders</Link>
            <Link to="/profile" className="hover:text-orange-400">Profile</Link>
            <Link to="/about" className="hover:text-orange-400">About Us</Link>
            <Link to="/contact" className="hover:text-orange-400">Contact</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-lg text-gray-400">
          <p className="text-lg">© 2025 FoodieExpress. All rights reserved.</p>
          <p className="mt-2 text-sm">Made with 🍲 by the FoodieExpress Dev Team</p>
        </div>
      </footer>
    </div>
  );
};

export default ViewMenu;
*/


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const ViewMenu = () => {
  const { id: restaurantId } = useParams();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get(`https://restaurant-management-service.onrender.com/api/menu/${restaurantId}`);
      setMenuItems(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load menu items.");
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(menuItems.map(item => item.category))];

  const filteredItems = menuItems
    .filter(item => selectedCategory === "All" || item.category === selectedCategory)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-white relative overflow-hidden p-4 md:p-6 flex flex-col justify-between">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-44 h-44 bg-orange-200 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-300 rounded-full opacity-40 z-0" />
      <div className="absolute top-1/2 left-full w-40 h-40 bg-orange-400 rounded-full opacity-20 -translate-y-1/2 -translate-x-full z-0" />

      {/* Header */}
      <header className="w-full bg-black text-white py-4 px-6 rounded-xl mb-8 shadow-lg z-10 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-500">🍴 BiteSpeed</h1>
          <nav className="space-x-4 hidden sm:block">
            <Link to="/customer-home" className="hover:text-orange-400">Home</Link>
            <Link to="/orders" className="hover:text-orange-400">My Orders</Link>
            <Link to="/profile" className="hover:text-orange-400">Profile</Link>
          </nav>
        </div>
      </header>

      {/* Menu Section */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-orange-700">Explore Our Best Menu</h2>
          <button
            className="md:hidden text-sm text-orange-600 underline"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Filters */}
        <div className={`mb-8 transition-all duration-300 ${showFilters ? "block" : "hidden"} md:block`}>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm border font-medium transition ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-orange-500 border-orange-300 hover:bg-orange-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search menu items..."
              className="border border-orange-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-orange-300 rounded-lg px-4 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="default">Sort By</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Menu Display */}
        {loading ? (
          <div className="text-center text-lg text-orange-500">Loading menu items...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-medium">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-500">No menu items found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-2xl p-4 border border-orange-100 hover:shadow-xl transition flex flex-col"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                )}
              <div className="flex justify-between gap-4 items-start">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-orange-800">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">{item.description}</p>
                    <p className={`text-sm font-semibold mt-1 ${item.isAvailable ? "text-green-600" : "text-red-500"}`}>
                    {item.isAvailable ? "🟢 Available" : "🔴 Not Available"}
                    </p>
                      <p className="text-sm text-gray-500 mt-1">
                       <span className="font-semibold text-orange-600">Category:</span> {item.category}
                    </p>
                </div>

                  <div className="text-right whitespace-nowrap">
                    <p className="text-lg font-bold text-orange-800">Rs. {item.price}</p>
                    <button
                      onClick={() => navigate("/basket", { state: { item, restaurantId: item.restaurantId } })}
                      className="mt-3 px-4 py-1.5 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
                    >
                      Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 bg-black text-white rounded-xl shadow-lg px-6 py-8 z-10 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-orange-400">🍴 BiteSpeed</h2>
            <p className="text-sm mt-2 text-gray-300">Delivering deliciousness to your door since 2025.</p>
          </div>
          <div className="flex space-x-6 text-lg">
            <Link to="/customer-home" className="hover:text-orange-400">Home</Link>
            <Link to="/orders" className="hover:text-orange-400">My Orders</Link>
            <Link to="/profile" className="hover:text-orange-400">Profile</Link>
            <Link to="/about" className="hover:text-orange-400">About Us</Link>
            <Link to="/contact" className="hover:text-orange-400">Contact</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-lg text-gray-400">
          <p className="text-lg">© 2025 BiteSpeed. All rights reserved.</p>
          <p className="mt-2 text-sm">Made with 🍲 by the BiteSpeed Dev Team</p>
        </div>
      </footer>
    </div>
  );
};

export default ViewMenu;
