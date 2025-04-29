/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

const DriverRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    address: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    password: '',
    licenseNumber: '' // New field for license number
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://driver-service-3k84.onrender.com/api/drivers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("Welcome to the Driver Squad! You're all set to start delivering.");
        setFormData({
          name: '', nic: '', address: '', age: '', gender: '', email: '', phone: '', password: '', licenseNumber: ''
        });
      } else {
        setMessage(result.message || "Something went wrong. Try again!");
      }
    } catch (err) {
      setMessage("Server's out for a spin. Try again soon!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-orange-200 opacity-40"></div>
      <div className="absolute top-1/4 -right-10 w-32 h-32 rounded-full bg-orange-300 opacity-30"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-orange-400 opacity-20"></div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-orange-500 py-6 px-8 relative">
            <div className="absolute top-0 right-0 w-full h-full">
              <div className="absolute -top-6 right-10 w-16 h-16 bg-yellow-400 rounded-full opacity-20"></div>
              <div className="absolute top-10 right-20 w-10 h-10 bg-red-400 rounded-full opacity-20"></div>
            </div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="bg-black p-2 rounded-full">
                <img src="/api/placeholder/50/50" alt="Driver Logo" className="rounded-full" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">JOIN OUR DRIVER TEAM!</h1>
                <p className="text-orange-100">Deliver smiles, one ride at a time!</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Info Column */}
            <div className="w-full md:w-2/5 bg-black p-8 text-white relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-16 h-16 border-4 border-orange-500 rounded-full"></div>
                <div className="absolute bottom-40 right-10 w-20 h-20 border-4 border-orange-500 rounded-full"></div>
                <div className="absolute bottom-20 left-20 w-12 h-12 border-4 border-orange-500 rounded-full"></div>
              </div>

              <div className="relative z-10 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-orange-400 mb-2">Why Drive With Us?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">🚗</span>
                      <span>Flexible schedules that fit your life</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">💰</span>
                      <span>Earn with every trip</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">🛠️</span>
                      <span>Support when you need it</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">🔥</span>
                      <span>Be part of a growing team</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-2">Already a driver?</h3>
                  <a href="/login-driver" className="block text-center py-2 px-4 bg-orange-500 hover:bg-orange-600 rounded-md font-medium transition-colors">
                    LOG IN HERE
                  </a>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="w-full md:w-3/5 p-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Become a Delivery Hero!</h2>

              {message && (
                <div className="mb-6 p-4 rounded-lg bg-orange-100 border-l-4 border-orange-500 text-center">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your full name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">🧑</div>
                    <input
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">🪪</div>
                    <input
                      id="nic"
                      name="nic"
                      placeholder="Enter NIC"
                      value={formData.nic}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">🏠</div>
                    <input
                      id="address"
                      name="address"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">🎂</div>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <div className="relative">
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full pl-3 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">📞</div>
                    <input
                      id="phone"
                      name="phone"
                      placeholder="Your phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">📝</div>
                    <input
                      id="licenseNumber"
                      name="licenseNumber"
                      placeholder="Enter your license number"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">📧</div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">🔒</div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </div>
                </div>

                

                <div>
                  <button type="submit" className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors">
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRegisterForm;
