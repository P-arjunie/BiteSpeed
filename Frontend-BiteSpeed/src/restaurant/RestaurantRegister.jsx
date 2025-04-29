/*
import React, { useState } from 'react';

const RestaurantRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    image: null,
    cuisineType: '',
  });

  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('address', formData.address);
      data.append('phone', formData.phone);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('cuisineType', formData.cuisineType);
      data.append('image', formData.image);

      const res = await fetch('http://localhost:5000/api/restaurant/register', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("Restaurant registered successfully.");
        setFormData({
          name: '', address: '', phone: '', email: '', password: '', image: null, cuisineType: ''
        });
        setImagePreview(null);
      } else {
        setMessage(result.message || "Restaurant registration failed.");
      }
    } catch (err) {
      setMessage("Error connecting to backend.");
    }
  };

  return (
    <div className="flex min-h-screen">
      
      <div className="w-1/2 bg-white"></div>

     
      <div className="w-1/2 flex justify-center items-center bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Restaurant Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <input name="name" placeholder="Restaurant Name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border rounded-md" />

            <select name="cuisineType" value={formData.cuisineType} onChange={handleChange} required className="w-full p-3 border rounded-md">
              <option value="">Select Cuisine Type</option>
              <option value="Sri Lankan">Sri Lankan</option>
              <option value="Indian">Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Italian">Italian</option>
              <option value="Thai">Thai</option>
              <option value="Cafe, Coffee, Snacks">Cafe, Coffee, Snacks</option>
            </select>

            <input type="file" name="image" accept="image/*" onChange={handleChange} required className="w-full p-3 border rounded-md" />

           
            {imagePreview && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mt-2">Image Preview:</p>
                <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-contain mt-2 border rounded" />
              </div>
            )}

            <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">Register</button>
          </form>

          {message && <p className="text-center bg-gray-100 mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegisterForm;
*/


/*
import React, { useState } from 'react';

const RestaurantRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    image: null,
    cuisineType: '',
  });

  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('address', formData.address);
      data.append('phone', formData.phone);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('cuisineType', formData.cuisineType);
      data.append('image', formData.image);

      const res = await fetch('https://restaurant-management-service.onrender.com/api/restaurant/register', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("Restaurant registered successfully.");
        setFormData({
          name: '', address: '', phone: '', email: '', password: '', image: null, cuisineType: ''
        });
        setImagePreview(null);
      } else {
        setMessage(result.message || "Restaurant registration failed.");
      }
    } catch (err) {
      setMessage("Error connecting to backend.");
    }
  };

  return (
    <div className="flex min-h-screen">
      
      <div className="w-1/2 bg-white"></div>

      
      <div className="w-1/2 flex justify-center items-center bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Restaurant Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <input name="name" placeholder="Restaurant Name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border rounded-md" />

            <select name="cuisineType" value={formData.cuisineType} onChange={handleChange} required className="w-full p-3 border rounded-md">
              <option value="">Select Cuisine Type</option>
              <option value="Sri Lankan">Sri Lankan</option>
              <option value="Indian">Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Italian">Italian</option>
              <option value="Thai">Thai</option>
              <option value="Cafe, Coffee, Snacks">Cafe, Coffee, Snacks</option>
            </select>

            <input type="file" name="image" accept="image/*" onChange={handleChange} required className="w-full p-3 border rounded-md" />

            
            {imagePreview && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mt-2">Image Preview:</p>
                <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-contain mt-2 border rounded" />
              </div>
            )}

            <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">Register</button>
          </form>

          {message && <p className="text-center bg-gray-100 mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegisterForm;
*/


//after ui change
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import food1 from '../assets/food1.jpg'; 

const RestaurantRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    image: null,
    cuisineType: '',
  });

  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('address', formData.address);
      data.append('phone', formData.phone);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('cuisineType', formData.cuisineType);
      data.append('image', formData.image);

      const res = await fetch('https://restaurant-management-service.onrender.com/api/restaurant/register', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("Restaurant registered successfully.");
        setFormData({
          name: '', address: '', phone: '', email: '', password: '', image: null, cuisineType: ''
        });
        setImagePreview(null);
      } else {
        setMessage(result.message || "Restaurant registration failed.");
      }
    } catch (err) {
      setMessage("Error connecting to backend.");
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
            <h1 className="text-2xl font-bold text-white">PARTNER WITH BiteSpeed!</h1>
            <p className="text-orange-100">Grow your business with our platform</p>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Left info column */}
            <div className="w-full md:w-1/3 bg-gray-900 p-6 text-white">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-orange-400 mb-2">Why Partner?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Reach more customers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Increase revenue</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Simple order management</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Marketing tools</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-2">Already a partner?</h3>
                  <Link to="/login-restaurant" className="block text-center py-2 px-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium">
                    LOG IN HERE
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Right form column */}
            <div className="w-full md:w-2/3 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Register Your Restaurant</h2>
              
              {message && (
                <div className="mb-4 p-3 rounded-lg bg-orange-100 border-l-4 border-orange-500">
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
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
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Address</label>
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
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
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
                
                <div>
                  <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                  <select 
                    id="cuisineType"
                    name="cuisineType" 
                    value={formData.cuisineType} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Select Cuisine Type</option>
                    <option value="Sri Lankan">Sri Lankan</option>
                    <option value="Indian">Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Italian">Italian</option>
                    <option value="Thai">Thai</option>
                    <option value="Cafe, Coffee, Snacks">Cafe, Coffee, Snacks</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Image</label>
                  <input 
                    id="image"
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    onChange={handleChange} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                    <div className="border border-gray-300 rounded-lg p-2">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-contain" />
                    </div>
                  </div>
                )}
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600"
                  >
                    REGISTER RESTAURANT
                  </button>
                </div>
              </form>
              
              <p className="text-center text-gray-600 mt-4 text-sm">
                By registering, you agree to our 
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

export default RestaurantRegisterForm;