/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import food1 from '../assets/food1.jpg';
import Navbar from '../components/Navbar';

const CustomerProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageVisible, setPageVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();
  
  // Animation effect when component mounts
  useEffect(() => {
    setPageVisible(true);
    fetchProfileData();
  }, []);
  
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to login first');
        navigate('/login');
        return;
      }
      
      const response = await fetch('https://customer-service-lqm4.onrender.com/api/customers/profile', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        setProfileData(data);
        // Initialize form data with current profile data
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || ''
        });
      } else {
        setError(data.message || 'Failed to fetch profile');
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    } catch (err) {
      setError('Could not connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdateSuccess(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to current profile data
    setFormData({
      name: profileData.name || '',
      phone: profileData.phone || '',
      address: profileData.address || ''
    });
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to login first');
        navigate('/login');
        return;
      }
      
      const response = await fetch('https://customer-service-lqm4.onrender.com/api/customers/profile', {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setProfileData(data.customer);
        setIsEditing(false);
        setUpdateSuccess(true);
        // Hide success message after 3 seconds
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        setError(data.message || 'Failed to update profile');
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    } catch (err) {
      setError('Could not connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  //
  return (
    <div className="min-h-screen w-full relative">
      {/* Full-page background image with overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${food1})`,
          filter: 'brightness(0.4)'
        }}
      />
      
      <div className="relative z-10">
        <Navbar />
        
        <div className="min-h-screen flex items-center justify-center py-8">
          {/* Content container */}
          <div className={`container mx-auto px-4 py-8 transition-opacity duration-1000 ${pageVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-4xl mx-auto">
              {/* Hero text */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Your Food Journey Profile</h1>
                <div className="flex justify-center gap-4 mt-2">
                  <span className="text-3xl">🍕</span>
                  <span className="text-3xl">🍔</span>
                  <span className="text-3xl">🌮</span>
                  <span className="text-3xl">🍜</span>
                </div>
              </div>
              
              {/* Profile card */}
              <div className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-t-4 border-orange-500 max-w-lg mx-auto transform hover:scale-102 transition-transform duration-300">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl mb-6 text-center">
                  <h2 className="text-2xl font-bold">My Profile</h2>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                ) : profileData ? (
                  <div className="space-y-6">
                    <div className="flex justify-center mb-6">
                      <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center text-3xl border-2 border-orange-300">
                        👤
                      </div>
                    </div>
                    
                    {updateSuccess && (
                      <div className="text-center p-4 bg-green-100 text-green-700 rounded-lg mb-4">
                        Profile updated successfully! 🎉
                      </div>
                    )}
                    
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-orange-500 mr-3">👤</span>
                            <div className="w-full">
                              <p className="text-sm text-orange-600 font-medium">Name</p>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter your name"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-orange-500 mr-3">✉️</span>
                            <div className="w-full">
                              <p className="text-sm text-orange-600 font-medium">Email</p>
                              <p className="text-lg font-bold text-gray-800">{profileData.email}</p>
                              <p className="text-xs text-gray-500">Email cannot be changed</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-orange-500 mr-3">📞</span>
                            <div className="w-full">
                              <p className="text-sm text-orange-600 font-medium">Phone</p>
                              <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter your phone number"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-orange-500 mr-3">🏠</span>
                            <div className="w-full">
                              <p className="text-sm text-orange-600 font-medium">Address</p>
                              <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter your address"
                                rows="2"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                          <button 
                            onClick={handleUpdateProfile}
                            className="flex-1 p-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition duration-200 font-bold text-lg shadow-md"
                          >
                            Save Changes 💾
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition duration-200 font-bold text-lg shadow-md"
                          >
                            Cancel ❌
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <span className="text-orange-500 mr-3">👤</span>
                              <div>
                                <p className="text-sm text-orange-600 font-medium">Name</p>
                                <p className="text-lg font-bold text-gray-800">{profileData.name}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <span className="text-orange-500 mr-3">✉️</span>
                              <div>
                                <p className="text-sm text-orange-600 font-medium">Email</p>
                                <p className="text-lg font-bold text-gray-800">{profileData.email}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <span className="text-orange-500 mr-3">📞</span>
                              <div>
                                <p className="text-sm text-orange-600 font-medium">Phone</p>
                                <p className="text-lg font-bold text-gray-800">{profileData.phone}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <span className="text-orange-500 mr-3">🏠</span>
                              <div>
                                <p className="text-sm text-orange-600 font-medium">Address</p>
                                <p className="text-lg font-bold text-gray-800">{profileData.address}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                          <button 
                            onClick={handleEditClick}
                            className="flex-1 p-3 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition duration-200 font-bold text-lg shadow-md text-center"
                          >
                            Edit Profile ✏️
                          </button>
                          <button 
                            onClick={handleLogout}
                            className="flex-1 p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition duration-200 font-bold text-lg shadow-md"
                          >
                            Logout 🚪
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    No profile data available
                  </div>
                )}
                
                <div className="mt-6 bg-orange-50 rounded-lg p-4">
                  <p className="text-center text-orange-800 font-medium">
                    Enjoy personalized recommendations and special offers based on your taste preferences! 🌟
                  </p>
                </div>
              </div>
              
            </div>
          </div>
          
          {/* Floating food icons */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 text-white text-opacity-70">
            <span className="text-4xl animate-bounce">🥗</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🍣</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🍰</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;