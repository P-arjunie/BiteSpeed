
import React, { useEffect, useState } from "react";
import Sidebar from "../components/RestaurantDashboardSidebar";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import food1 from '../assets/food1.jpg';

dayjs.extend(utc);
dayjs.extend(timezone);

const RestaurantDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const [totalOrdersToday, setTotalOrdersToday] = useState(0);
  const [totalRevenueToday, setTotalRevenueToday] = useState(0);
  const [totalMenuItems, setTotalMenuItems] = useState(0); // Initially 0

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const res = await fetch("https://localhost:30082/api/restaurant/profile/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const res = await axios.get("https://localhost:30082/api/restaurant/orders/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const orders = res.data;

        const today = dayjs().format("YYYY-MM-DD");

        const todayOrders = orders.filter((order) => {
          if (!order.date) return false;
          const orderDate = dayjs.utc(order.date).local().format("YYYY-MM-DD");
          return orderDate === today;
        });

        setTotalOrdersToday(todayOrders.length);

        const revenue = todayOrders.reduce((sum, order) => {
          const price = parseFloat(order.price) || 0;
          const quantity = parseInt(order.quantity, 10) || 0;
          return sum + price * quantity;
        }, 0);

        setTotalRevenueToday(revenue);
      } catch (err) {
        console.error("Failed to fetch today's orders:", err);
        setError("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        // Wait until profile is fetched
        if (!profile?._id) return;

        const res = await axios.get(`https://localhost:30082/api/menu/${profile._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const menuItems = res.data;
        setTotalMenuItems(menuItems.length);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
        setError("Failed to fetch menu items");
      }
    };

    fetchMenuItems();
  }, [profile]); // Depend on profile

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 relative">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
          style={{ backgroundImage: `url(${food1})` }}
        />
        
        {/* Content with relative positioning to appear above the background */}
        <div className="relative z-10 p-10">
          <div className="bg-white bg-opacity-90 rounded-xl shadow-md p-8 max-w-5xl mx-auto backdrop-blur-sm">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Restaurant Dashboard</h1>

            {error ? (
              <p className="text-red-500">{error}</p>
            ) : !profile ? (
              <p className="text-gray-600">Loading profile...</p>
            ) : (
              <>
                <p className="text-gray-600 mb-8 text-lg">
                  Hello, <span className="font-semibold text-gray-800">{profile.name}</span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-100 p-6 rounded-2xl shadow flex items-center gap-4">
                    <span className="text-3xl">🧾</span>
                    <div>
                      <p className="text-xl font-bold text-blue-900">{totalOrdersToday}</p>
                      <p className="text-sm text-blue-800">Orders Today</p>
                    </div>
                  </div>

                  <div className="bg-green-100 p-6 rounded-2xl shadow flex items-center gap-4">
                    <span className="text-3xl">💰</span>
                    <div>
                      <p className="text-xl font-bold text-green-900">
                        LKR {totalRevenueToday.toLocaleString()}
                      </p>
                      <p className="text-sm text-green-800">Revenue Today</p>
                    </div>
                  </div>

                  <div className="bg-yellow-100 p-6 rounded-2xl shadow flex items-center gap-4">
                    <span className="text-3xl">🍴</span>
                    <div>
                      <p className="text-xl font-bold text-yellow-900">{totalMenuItems}</p>
                      <p className="text-sm text-yellow-800">Total Menu Items</p>
                    </div>
                  </div>

                  <div className="bg-red-100 p-6 rounded-2xl shadow flex items-center gap-4">
                    <span className="text-3xl">⏲️</span>
                    <div>
                      <p
                        className={`text-xl font-bold capitalize ${
                          profile.status === "open" ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {profile.status}
                      </p>
                      <p className="text-sm text-red-800">Current Availability</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;