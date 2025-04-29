/*import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Slider from "react-slick"; 

const CustomerHome = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/restaurant/getAll");
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants", error);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === "" || restaurant.cuisineType === selectedCuisine;
    const matchesStatus = !filterOpen || restaurant.status === "open";
    return matchesSearch && matchesCuisine && matchesStatus;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCuisine("");
    setFilterOpen(false);
  };

  const cuisineOptions = [...new Set(restaurants.map((r) => r.cuisineType))];

  // Settings for the promotions carousel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden p-4 md:p-6 flex flex-col justify-between">
      
      <div className="absolute top-0 left-0 w-44 h-44 bg-orange-200 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-300 rounded-full opacity-40 z-0" />
      <div className="absolute top-1/2 left-full w-40 h-40 bg-orange-400 rounded-full opacity-20 -translate-y-1/2 -translate-x-full z-0" />

     
      <header className="w-full bg-black text-white py-4 px-6 rounded-xl mb-8 shadow-lg z-10 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-500">🍴 FoodieExpress</h1>
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
      
    
      <div className="w-full mb-8">
        <Slider {...carouselSettings}>
          <div>
            <img
              src="/images/promotion1.jpg"
              alt="Promotion 1"
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="text-lg text-orange-500 font-semibold">Exclusive 20% Off on Your First Order</p>
            </div>
          </div>
          <div>
            <img
              src="/images/promotion2.jpg"
              alt="Promotion 2"
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="text-lg text-orange-500 font-semibold">Free Delivery on Orders Over $50</p>
            </div>
          </div>
          <div>
            <img
              src="/images/promotion3.jpg"
              alt="Promotion 3"
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="text-lg text-orange-500 font-semibold">Buy 1 Get 1 Free on Selected Meals</p>
            </div>
          </div>
        </Slider>
      </div>
      
      
          <div className="relative z-10 mb-4">
             <h2 className="text-3xl font-bold text-orange-700">Explore Our Restaurants</h2>
          </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 relative z-10">
        
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search for a restaurant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
          />
          <FaSearch className="absolute top-3 left-3 text-orange-500" />
        </div>

        <select
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
          className="w-full md:w-1/4 p-3 border border-orange-400 text-gray-700 rounded-lg"
        >
          <option value="">All Cuisines</option>
          {cuisineOptions.map((cuisine, idx) => (
            <option key={idx} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>

        
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className={`w-full md:w-auto px-6 py-2 rounded-lg font-medium text-white ${
            filterOpen ? "bg-green-600" : "bg-gray-600"
          }`}
        >
          {filterOpen ? "Showing Open" : "Show Only Open"}
        </button>

    
        <button
          onClick={resetFilters}
          className="w-full md:w-auto px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Reset Filters
        </button>
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {filteredRestaurants.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">No restaurants found</p>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="flex flex-col bg-white border border-orange-200 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="p-3">
                <div className="w-full h-48 overflow-hidden rounded-lg shadow">
                  <img
                     src={restaurant.image || "/images/default-restaurant.jpg"}
                     alt={restaurant.name}
                     className="w-full h-full object-cover rounded-md"
                  />
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-grow">
                <h3 className="text-xl font-semibold text-orange-800">{restaurant.name}</h3>
                <p className="text-sm text-gray-600">{restaurant.cuisineType}</p>
                <p className="text-sm text-gray-600">{restaurant.address}</p>
                <p
                  className={`text-sm font-medium ${
                    restaurant.status === "open" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {restaurant.status === "open" ? "🟢 Open Now" : "🔴 Closed"}
                </p>
                <Link
                  to={`/restaurant/${restaurant._id}`}
                  className="mt-4 inline-block px-6 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 transform hover:scale-105 text-center"
                >
                  View Menu 🍽️
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      
      <div className="mt-16 relative z-10">
        <h2 className="text-2xl font-bold text-black mb-4">Popular Dishes</h2>
        <div className="text-gray-500">Coming soon...</div>
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

export default CustomerHome;
*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Slider from "react-slick"; 

const CustomerHome = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("https://restaurant-management-service.onrender.com/api/restaurant/getAll");
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants", error);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === "" || restaurant.cuisineType === selectedCuisine;
    const matchesStatus = !filterOpen || restaurant.status === "open";
    return matchesSearch && matchesCuisine && matchesStatus;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCuisine("");
    setFilterOpen(false);
  };

  const cuisineOptions = [...new Set(restaurants.map((r) => r.cuisineType))];

  // Settings for the promotions carousel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden p-4 md:p-6 flex flex-col justify-between">
      {/* 🔶 Background Decorations */}
      <div className="absolute top-0 left-0 w-44 h-44 bg-orange-200 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-300 rounded-full opacity-40 z-0" />
      <div className="absolute top-1/2 left-full w-40 h-40 bg-orange-400 rounded-full opacity-20 -translate-y-1/2 -translate-x-full z-0" />

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
            <Link to="/customer-profile" className="hover:text-orange-400">
              Profile
            </Link>
          </nav>
        </div>
      </header>
      
      {/* 🛍️ Promotions Carousel */}
      <div className="w-full mb-8">
        <Slider {...carouselSettings}>
          <div>
            <img
              src="/images/promotion1.jpg"
              alt="Promotion 1"
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="text-lg text-orange-500 font-semibold">Exclusive 20% Off on Your First Order</p>
            </div>
          </div>
          <div>
            <img
              src="/images/promotion2.jpg"
              alt="Promotion 2"
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="text-lg text-orange-500 font-semibold">Free Delivery on Orders Over $50</p>
            </div>
          </div>
          <div>
            <img
              src="/images/promotion3.jpg"
              alt="Promotion 3"
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="text-lg text-orange-500 font-semibold">Buy 1 Get 1 Free on Selected Meals</p>
            </div>
          </div>
        </Slider>
      </div>
      
      {/* 🧭 Section Title: Explore Our Restaurants */}
          <div className="relative z-10 mb-4">
             <h2 className="text-3xl font-bold text-orange-700">Explore Our Restaurants</h2>
          </div>
      {/* 🔍 Filters Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 relative z-10">
        {/* Search */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search for a restaurant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
          />
          <FaSearch className="absolute top-3 left-3 text-orange-500" />
        </div>

        {/* Cuisine Dropdown */}
        <select
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
          className="w-full md:w-1/4 p-3 border border-orange-400 text-gray-700 rounded-lg"
        >
          <option value="">All Cuisines</option>
          {cuisineOptions.map((cuisine, idx) => (
            <option key={idx} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>

        {/* Filter Open Toggle */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className={`w-full md:w-auto px-6 py-2 rounded-lg font-medium text-white ${
            filterOpen ? "bg-green-600" : "bg-gray-600"
          }`}
        >
          {filterOpen ? "Showing Open" : "Show Only Open"}
        </button>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="w-full md:w-auto px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Reset Filters
        </button>
      </div>

      {/* 🍽️ Restaurant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {filteredRestaurants.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">No restaurants found</p>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="flex flex-col bg-white border border-orange-200 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="p-3">
                <div className="w-full h-48 overflow-hidden rounded-lg shadow">
                  <img
                     src={restaurant.image || "/images/default-restaurant.jpg"}
                     alt={restaurant.name}
                     className="w-full h-full object-cover rounded-md"
                  />
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-grow">
                <h3 className="text-xl font-semibold text-orange-800">{restaurant.name}</h3>
                <p className="text-sm text-gray-600">{restaurant.cuisineType}</p>
                <p className="text-sm text-gray-600">{restaurant.address}</p>
                <p
                  className={`text-sm font-medium ${
                    restaurant.status === "open" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {restaurant.status === "open" ? "🟢 Open Now" : "🔴 Closed"}
                </p>
                <Link
                  to={`/restaurant/${restaurant._id}`}
                  className="mt-4 inline-block px-6 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 transform hover:scale-105 text-center"
                >
                  View Menu 🍽️
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🍕 Popular Dishes (Future Feature) */}
      <div className="mt-16 relative z-10">
        <h2 className="text-2xl font-bold text-black mb-4">Popular Dishes</h2>
        <div className="text-gray-500">Coming soon...</div>
      </div>

      {/* 🔻 Footer */}
      <footer className="mt-20 bg-black text-white rounded-xl shadow-lg px-6 py-8 z-10 relative">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
    {/* Brand Section */}
    <div className="text-center md:text-left">
      <h2 className="text-2xl font-semibold text-orange-400">🍴 BiteSpeed</h2>
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
    <p className="text-lg">© 2025 BiteSpeed. All rights reserved.</p>
    <p className="mt-2 text-sm">Made with 🍲 by the BiteSpeed Dev Team</p>
  </div>
</footer>


    </div>
  );
};

export default CustomerHome;
