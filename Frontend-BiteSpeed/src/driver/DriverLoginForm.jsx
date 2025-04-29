import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import driverman from '../assets/courier-driver.jpg';

const DriverLoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [message, setMessage] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const navigate = useNavigate();
  
  // Animation effect when component mounts
  useEffect(() => {
    setFormVisible(true);
  }, []);
  
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
        localStorage.setItem('token', result.token);
        localStorage.setItem('userEmail', formData.email); // Store email for profile fetching
        setMessage("Login successful!");
        navigate('/dashboard'); // Change to your driver dashboard route
      } else {
        setMessage(result.message || "Oops! Login failed. Try again?");
      }
    } catch (err) {
      setMessage("Hmm, can't reach our servers right now. Try again soon!");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Full-page background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${driverman})`,
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Content container */}
      <div className={`container mx-auto px-4 py-8 z-10 transition-opacity duration-1000 ${formVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Hero text */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Ready to Deliver Smiles?</h1>
            <div className="flex justify-center gap-4 mt-2">
              <span className="text-3xl">🚗</span>
              <span className="text-3xl">🛵</span>
              <span className="text-3xl">🚚</span>
              <span className="text-3xl">📍</span>
            </div>
          </div>
          
          {/* Login form */}
          <div className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-t-4 border-orange-500 max-w-md mx-auto transform hover:scale-102 transition-transform duration-300">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl mb-6 text-center">
              <h2 className="text-2xl font-bold">Driver Login 🚚</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <div className="absolute left-3 top-3 text-orange-500">✉️</div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 pl-10 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring focus:ring-orange-200 transition group-hover:border-orange-300"
                />
              </div>
              
              <div className="relative group">
                <div className="absolute left-3 top-3 text-orange-500">🔒</div>
                <input
                  type="password"
                  name="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 pl-10 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring focus:ring-orange-200 transition group-hover:border-orange-300"
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full p-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition duration-200 font-bold text-lg shadow-md transform hover:-translate-y-1"
              >
                Log In & Start Delivering! 🚀
              </button>
            </form>
            
            {message && (
              <div className="text-center mt-4 p-3 rounded-lg bg-orange-100 text-orange-700 animate-pulse">
                {message}
              </div>
            )}
            
            <p className="text-center mt-6 text-gray-700">
              New driver? {' '}
              <Link to="/register-driver" className="text-orange-500 hover:text-orange-600 font-bold hover:underline">
                Join our team!
              </Link>
            </p>
            
            <div className="mt-6 bg-orange-50 rounded-lg p-4">
              <p className="text-center text-orange-800 font-medium">
                Join our fleet of drivers and earn on your own schedule!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating icons */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 text-white text-opacity-70">
        <span className="text-4xl animate-bounce">🛵</span>
        <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>📦</span>
        <span className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>📱</span>
      </div>
    </div>
  );
};

export default DriverLoginForm;