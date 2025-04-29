import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DriverProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState(null);
  const [vehicleError, setVehicleError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://driver-service-3k84.onrender.com/api/drivers/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchVehicle = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://driver-service-3k84.onrender.com/api/drivers/vehicle/my-vehicles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const data = await res.json();
        if (res.ok && data.length > 0) {
          setVehicle(data[0]); // Get only the first vehicle
        } else {
          setVehicleError(data.message || "No vehicles found");
        }
      } catch (err) {
        setVehicleError("Error fetching vehicle");
      }
    };

    fetchProfile();
    fetchVehicle();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Driver Profile</h1>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto p-4 bg-red-100 text-red-600 rounded-xl shadow text-center">
            <p>{error}</p>
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-500 p-6 mb-6">
              <div className="flex justify-center mb-6">
                <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center text-3xl border-2 border-orange-300 shadow-md">
                  👤
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-orange-500 mr-3">👤</span>
                    <div>
                      <p className="text-xs text-orange-600 font-medium">NAME</p>
                      <p className="text-lg font-bold text-gray-800">{profile.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-orange-500 mr-3">✉️</span>
                    <div>
                      <p className="text-xs text-orange-600 font-medium">EMAIL</p>
                      <p className="text-lg font-bold text-gray-800">{profile.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-orange-500 mr-3">🪪</span>
                    <div>
                      <p className="text-xs text-orange-600 font-medium">NIC</p>
                      <p className="text-lg font-bold text-gray-800">{profile.nic}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-orange-500 mr-3">🏠</span>
                    <div>
                      <p className="text-xs text-orange-600 font-medium">ADDRESS</p>
                      <p className="text-lg font-bold text-gray-800">{profile.address}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-orange-500 mr-3">📅</span>
                      <div>
                        <p className="text-xs text-orange-600 font-medium">AGE</p>
                        <p className="text-lg font-bold text-gray-800">{profile.age}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-orange-500 mr-3">{profile.gender === 'Male' ? '👨' : '👩'}</span>
                      <div>
                        <p className="text-xs text-orange-600 font-medium">GENDER</p>
                        <p className="text-lg font-bold text-gray-800">{profile.gender}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link 
                  to="/edit-profile" 
                  className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200 font-medium text-center block shadow-md"
                >
                  Edit Profile ✏️
                </Link>
              </div>
            </div>

            {/* Vehicle Info */}
            {vehicle && (
              <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-500 p-6 mb-6">
                <h3 className="text-xl font-bold text-orange-600 mb-4 border-b border-orange-100 pb-2">
                  Vehicle Information
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-orange-500 mr-3">🚚</span>
                      <div>
                        <p className="text-xs text-orange-600 font-medium">VEHICLE NUMBER</p>
                        <p className="text-lg font-bold text-gray-800">{vehicle.number}</p>
                      </div>
                    </div>
                  </div>
                  
                  {vehicle.model && (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-orange-500 mr-3">🔧</span>
                        <div>
                          <p className="text-xs text-orange-600 font-medium">MODEL</p>
                          <p className="text-lg font-bold text-gray-800">{vehicle.model}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link 
                to="/find-orders" 
                className="p-4 bg-white shadow-md rounded-xl hover:shadow-lg transition flex flex-col items-center justify-center"
              >
                <span className="text-3xl mb-2">🔍</span>
                <span className="text-orange-600 font-medium">Find Orders</span>
              </Link>
              <Link 
                to="/earnings" 
                className="p-4 bg-white shadow-md rounded-xl hover:shadow-lg transition flex flex-col items-center justify-center"
              >
                <span className="text-3xl mb-2">💰</span>
                <span className="text-orange-600 font-medium">Earnings</span>
              </Link>
              <Link 
                to="/completed-orders" 
                className="p-4 bg-white shadow-md rounded-xl hover:shadow-lg transition flex flex-col items-center justify-center"
              >
                <span className="text-3xl mb-2">✅</span>
                <span className="text-orange-600 font-medium">Completed Orders</span>
              </Link>
              <Link 
                to="/settings" 
                className="p-4 bg-white shadow-md rounded-xl hover:shadow-lg transition flex flex-col items-center justify-center"
              >
                <span className="text-3xl mb-2">⚙️</span>
                <span className="text-orange-600 font-medium">Settings</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Action Button */}
      <div className="fixed bottom-4 right-4">
        <button 
          onClick={() => window.location.reload()}
          className="bg-orange-500 text-white h-14 w-14 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
        >
          <span className="text-2xl">🔄</span>
        </button>
      </div>
    </div>
  );
};

export default DriverProfile;