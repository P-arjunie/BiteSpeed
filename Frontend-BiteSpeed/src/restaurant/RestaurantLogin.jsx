/*import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RestaurantLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://auth-service-2-4xm3.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok && result.token) {
        console.log("Token:", result.token);
        localStorage.setItem('restaurantToken', result.token);
        setMessage("Login successful!");
        navigate('/restaurant/dashboard');
      } else {
        setMessage(result.message || "Login failed.");
      }
    } catch (err) {
      setMessage("Error connecting to backend.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
    
      <div className="w-1/2 bg-white"></div>

      
      <div className="w-1/2 flex justify-center items-center bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Restaurant Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md"
            />
            <button type="submit" className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700">
              Login
            </button>
          </form>
          {message && <p className="text-center text-red-500 mt-4">{message}</p>}

          <p className="text-center mt-4 text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/register-restaurant" className="text-green-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLogin;
*/


//after ui change
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import food1 from '../assets/food1.jpg'; // You can use your food image here

const RestaurantLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://auth-service-2-4xm3.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok && result.token) {
        console.log("Token:", result.token);
        localStorage.setItem('restaurantToken', result.token);
        setMessage("Login successful!");
        navigate('/restaurant/dashboard');
      } else {
        setMessage(result.message || "Login failed.");
      }
    } catch (err) {
      setMessage("Error connecting to backend.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Simplified background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${food1})`,
          filter: 'brightness(0.3)'
        }}
      />
      
      {/* Main container */}
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="max-w-3xl mx-auto bg-white bg-opacity-95 rounded-lg shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className="bg-orange-500 py-4 px-6">
            <h1 className="text-2xl font-bold text-white">RESTAURANT PARTNER LOGIN</h1>
            <p className="text-orange-100">Access your BiteSpeed restaurant dashboard</p>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Left info column */}
            <div className="w-full md:w-1/3 bg-gray-900 p-6 text-white">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-orange-400 mb-2">Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Manage orders</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Update menu</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>View analytics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Process payments</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-2">New restaurant?</h3>
                  <Link to="/register-restaurant" className="block text-center py-2 px-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium">
                    REGISTER HERE
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Right form column */}
            <div className="w-full md:w-2/3 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Login to Your Dashboard</h2>
              
              {message && (
                <div className="mb-4 p-3 rounded-lg bg-orange-100 border-l-4 border-orange-500">
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
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
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="text-orange-500 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600"
                  >
                    LOGIN
                  </button>
                </div>
              </form>
              
              <p className="text-center text-gray-600 mt-4 text-sm">
                Having trouble? Contact 
                <a href="#" className="text-orange-500 hover:underline"> Partner Support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLogin;