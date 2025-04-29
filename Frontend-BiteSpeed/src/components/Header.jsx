import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ isScrolled }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`fixed w-full transition-all duration-300 z-50 p-5 ${isScrolled ? 'bg-black py-2 shadow-md' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-orange-500">
            Bite<span className="text-white">Speed</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <a href="/" className="text-white hover:text-orange-500 transition">Home</a>
          <a href="#services" className="text-white hover:text-orange-500 transition">Services</a>
          <a href="#restaurants" className="text-white hover:text-orange-500 transition">Restaurants</a>
          <a href="#how-it-works" className="text-white hover:text-orange-500 transition">How It Works</a>
          <a href="#testimonials" className="text-white hover:text-orange-500 transition">Testimonials</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/customer-register" className="hidden md:block bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full transition">Sign In</Link>
          
          {/* Order Now button with dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-full transition flex items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Order Now <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link 
                  to="/customer-login" 
                  className="block px-4 py-2 text-gray-800 hover:bg-orange-100 hover:text-orange-500 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Customer Login
                </Link>
                <Link 
                  to="/login-driver" 
                  className="block px-4 py-2 text-gray-800 hover:bg-orange-100 hover:text-orange-500 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Driver Login
                </Link>
                <Link 
                  to="/login-restaurant" 
                  className="block px-4 py-2 text-gray-800 hover:bg-orange-100 hover:text-orange-500 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Restaurant Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
