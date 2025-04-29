/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import food1 from '../assets/food1.jpg'; // You can use your food image here
import Header from '../components/Header';

const CustomerRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    password: ''
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
      const res = await fetch('https://customer-service-lqm4.onrender.com/api/customers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await res.json();
      
      if (res.ok) {
        setMessage("Registration successful!");
        setFormData({
          name: '', phone: '', address: '', email: '', password: ''
        });
      } else {
        setMessage(result.message || "Registration failed.");
      }
    } catch (err) {
      setMessage("Connection error. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen relative">
      {/* Full-page background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${food1})`,
          filter: 'brightness(0.3)'
        }}
      />
      
      {/* Header at the top */}
      <div className="relative z-20">
        <Header isScrolled={true} />
      </div>
      
      {/* Main container */}
      <div className="container mx-auto px-4 py-10 relative z-10 pt-24">
        <div className="max-w-3xl mx-auto bg-white bg-opacity-95 rounded-lg shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className="bg-orange-500 py-4 px-6">
            <h1 className="text-2xl font-bold text-white">JOIN THE BiteSpeed CREW!</h1>
            <p className="text-orange-100">Where every bite delivers delight</p>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Left info column */}
            <div className="w-full md:w-1/3 bg-gray-900 p-6 text-white">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-orange-400 mb-2">Why Join?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Exclusive deals</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Birthday surprises</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Fast ordering</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Earn points</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-2">Already a member?</h3>
                  <Link to="/customer-login" className="block text-center py-2 px-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium">
                    LOG IN HERE
                  </Link>
                </div>

                <Link to="/register-driver" className="block text-center py-2 px-4 bg-orange-400 hover:bg-orange-500 rounded-lg font-medium text-black">
                Register as a Driver
                </Link>
                <Link to="/register-restaurant" className="block text-center py-2 px-4 bg-orange-400 hover:bg-orange-500 rounded-lg font-medium text-black">
                Register as a Restaurant
                </Link>
              </div>
            </div>
            
            {/* Right form column */}
            <div className="w-full md:w-2/3 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Create Your Account</h2>
              
              {message && (
                <div className="mb-4 p-3 rounded-lg bg-orange-100 border-l-4 border-orange-500">
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    id="name"
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    id="phone"
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                  <input 
                    id="address"
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    id="email"
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    id="password"
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600"
                  >
                    REGISTER
                  </button>
                </div>
              </form>
              
              <p className="text-center text-gray-600 mt-4 text-sm">
                By joining, you agree to our 
                <a href="#" className="text-orange-500 hover:underline"> Terms </a> 
                &amp; 
                <a href="#" className="text-orange-500 hover:underline"> Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegisterForm;