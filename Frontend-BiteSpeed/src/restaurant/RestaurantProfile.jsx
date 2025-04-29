/*
import React, { useEffect, useState } from "react";
import RestaurantDashboardSidebar from "../components/RestaurantDashboardSidebar";
import { Mail, Phone, MapPin, Utensils } from "lucide-react";

const RestaurantProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/restaurant/profile/me", {
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

  const toggleStatus = async () => {
    if (!profile?._id) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem("restaurantToken");
      const newStatus = profile.status === "open" ? "closed" : "open";

      const res = await fetch(`http://localhost:5000/api/restaurant/${profile._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfile((prev) => ({ ...prev, status: newStatus }));
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      alert("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex">
      <RestaurantDashboardSidebar />
      <div className="flex-1 bg-gray-100 min-h-screen py-12 px-6 sm:px-12">
        {error ? (
          <p className="text-red-500 text-center text-lg">{error}</p>
        ) : !profile ? (
          <p className="text-center text-gray-600 text-xl">Loading profile...</p>
        ) : (
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative">
              <div className="h-56 sm:h-64 bg-gradient-to-r from-green-400 via-teal-500 to-emerald-600" />
              <div className="absolute -bottom-28 left-1/2 transform -translate-x-1/2">
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-56 h-56 sm:w-64 sm:h-64 rounded-full object-cover border-4 border-white shadow-xl"
                />
              </div>
            </div>

            <div className="mt-32 text-center px-8 pb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">{profile.name}</h2>
              <div className="text-xl text-gray-600 mb-6 capitalize">
                Status:{" "}
                <span className={`font-semibold ${profile.status === "open" ? "text-green-600" : "text-red-500"}`}>
                  {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-8 mb-6 text-lg text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail size={22} />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={22} />
                  <span>{profile.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-8 text-lg text-gray-700 mb-8">
                <div className="flex items-center gap-2">
                  <MapPin size={22} />
                  <span>{profile.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils size={22} />
                  <span>{profile.cuisineType}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <span className="text-lg font-medium">Toggle Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={profile.status === "open"}
                    onChange={toggleStatus}
                    disabled={updating}
                  />
                  <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantProfile;
*/

/*
import React, { useEffect, useState } from "react";
import RestaurantDashboardSidebar from "../components/RestaurantDashboardSidebar";
import { Mail, Phone, MapPin, Utensils } from "lucide-react";

const RestaurantProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const res = await fetch("https://restaurant-management-service.onrender.com/api/restaurant/profile/me", {
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

  const toggleStatus = async () => {
    if (!profile?._id) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem("restaurantToken");
      const newStatus = profile.status === "open" ? "closed" : "open";

      const res = await fetch(`https://restaurant-management-service.onrender.com/api/restaurant/${profile._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfile((prev) => ({ ...prev, status: newStatus }));
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      alert("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex">
      <RestaurantDashboardSidebar />
      <div className="flex-1 bg-gray-100 min-h-screen py-12 px-6 sm:px-12">
        {error ? (
          <p className="text-red-500 text-center text-lg">{error}</p>
        ) : !profile ? (
          <p className="text-center text-gray-600 text-xl">Loading profile...</p>
        ) : (
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative">
              <div className="h-56 sm:h-64 bg-gradient-to-r from-green-400 via-teal-500 to-emerald-600" />
              <div className="absolute -bottom-28 left-1/2 transform -translate-x-1/2">
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-56 h-56 sm:w-64 sm:h-64 rounded-full object-cover border-4 border-white shadow-xl"
                />
              </div>
            </div>

            <div className="mt-32 text-center px-8 pb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">{profile.name}</h2>
              <div className="text-xl text-gray-600 mb-6 capitalize">
                Status:{" "}
                <span className={`font-semibold ${profile.status === "open" ? "text-green-600" : "text-red-500"}`}>
                  {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-8 mb-6 text-lg text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail size={22} />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={22} />
                  <span>{profile.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-8 text-lg text-gray-700 mb-8">
                <div className="flex items-center gap-2">
                  <MapPin size={22} />
                  <span>{profile.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils size={22} />
                  <span>{profile.cuisineType}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <span className="text-lg font-medium">Toggle Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={profile.status === "open"}
                    onChange={toggleStatus}
                    disabled={updating}
                  />
                  <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantProfile;
*/

//after ui changes
import React, { useEffect, useState } from "react";
import RestaurantDashboardSidebar from "../components/RestaurantDashboardSidebar";
import { Mail, Phone, MapPin, Utensils } from "lucide-react";
import food1 from "../assets/food1.jpg"; // Importing the background image

const RestaurantProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const res = await fetch(
          "https://restaurant-management-service.onrender.com/api/restaurant/profile/me",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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

  const toggleStatus = async () => {
    if (!profile?._id) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem("restaurantToken");
      const newStatus = profile.status === "open" ? "closed" : "open";

      const res = await fetch(
        `https://restaurant-management-service.onrender.com/api/restaurant/${profile._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setProfile((prev) => ({ ...prev, status: newStatus }));
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      alert("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className="flex relative min-h-screen"
      style={{
        backgroundImage: `url(${food1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Main Content */}
      <div className="flex flex-1 relative z-10">
        <RestaurantDashboardSidebar />
        <div className="flex-1 min-h-screen py-12 px-6 sm:px-12">
          {error ? (
            <p className="text-red-500 text-center text-lg">{error}</p>
          ) : !profile ? (
            <p className="text-center text-gray-200 text-xl">Loading profile...</p>
          ) : (
            <div className="max-w-5xl mx-auto bg-white bg-opacity-90 rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative">
                {/* Changed gradient colors to orange shades */}
                <div className="h-56 sm:h-64 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
                <div className="absolute -bottom-28 left-1/2 transform -translate-x-1/2">
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="w-56 h-56 sm:w-64 sm:h-64 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                </div>
              </div>

              <div className="mt-32 text-center px-8 pb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-3">
                  {profile.name}
                </h2>
                <div className="text-xl text-gray-600 mb-6 capitalize">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      profile.status === "open" ? "text-orange-500" : "text-red-500"
                    }`}
                  >
                    {profile.status.charAt(0).toUpperCase() +
                      profile.status.slice(1)}
                  </span>
                </div>

                <div className="flex flex-wrap justify-center gap-8 mb-6 text-lg text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail size={22} />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={22} />
                    <span>{profile.phone}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-lg text-gray-700 mb-8">
                  <div className="flex items-center gap-2">
                    <MapPin size={22} />
                    <span>{profile.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Utensils size={22} />
                    <span>{profile.cuisineType}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg font-medium">Toggle Status</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={profile.status === "open"}
                      onChange={toggleStatus}
                      disabled={updating}
                    />
                    <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;
