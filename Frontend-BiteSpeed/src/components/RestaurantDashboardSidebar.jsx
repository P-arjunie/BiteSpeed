/*import React from 'react';
import {
  FaTachometerAlt,
  FaUtensils,
  FaClipboardList,
  FaToggleOn,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';

const RestaurantDashboardSidebar = ({ onLogout }) => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
     
      <div className="text-2xl font-bold mb-10 text-center">Restaurant Panel</div>

    
      <nav className="flex flex-col gap-6 flex-1">
        <a href="/restaurant/dashboard" className="flex items-center gap-3 hover:text-yellow-400">
          <FaTachometerAlt />
          Dashboard
        </a>
        <a href="/restaurant/menu" className="flex items-center gap-3 hover:text-yellow-400">
          <FaUtensils />
          Menu Management
        </a>
        <a href="/restaurant/orders" className="flex items-center gap-3 hover:text-yellow-400">
          <FaClipboardList />
          Orders
        </a>
        <a href="/restaurant/availability" className="flex items-center gap-3 hover:text-yellow-400">
          <FaToggleOn />
          Availability
        </a>
        <a href="/restaurant/profile" className="flex items-center gap-3 hover:text-yellow-400">
          <FaUser />
          Profile
        </a>
      </nav>

      <button
          onClick={() => {
              console.log("Restaurant logout clicked"); // For debug
              onLogout();
          }}
          className="mt-auto flex items-center gap-3 text-red-400 hover:text-red-600"
      >
          <FaSignOutAlt />
                Logout
      </button>

    </div>
  );
};

export default RestaurantDashboardSidebar;
*/

/*
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUtensils,
  FaClipboardList,
  FaToggleOn,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';

const RestaurantDashboardSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('restaurantToken');
    navigate('/login-restaurant');
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
      <div className="text-2xl font-bold mb-10 text-center">Restaurant Panel</div>

      <nav className="flex flex-col gap-6 flex-1">
        <a href="/restaurant/dashboard" className="flex items-center gap-3 hover:text-yellow-400">
          <FaTachometerAlt /> Dashboard
        </a>
        <a href="/restaurant/menu" className="flex items-center gap-3 hover:text-yellow-400">
          <FaUtensils /> Menu Management
        </a>
        <a href="/restaurant/orders" className="flex items-center gap-3 hover:text-yellow-400">
          <FaClipboardList /> Orders
        </a>
        
        <a href="/restaurant/profile" className="flex items-center gap-3 hover:text-yellow-400">
          <FaUser /> Profile
        </a>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 text-red-400 hover:text-red-600"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default RestaurantDashboardSidebar;
*/


//after ui change
import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUtensils,
  FaClipboardList,
  FaUser,
  FaSignOutAlt,
  FaChartLine,
  FaBell
} from 'react-icons/fa';

const RestaurantDashboardSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('restaurantToken');
    navigate('/login-restaurant');
  };

  // Active link style
  const activeStyle = "bg-orange-600 text-white rounded-lg";
  // Base link style
  const linkStyle = "flex items-center gap-3 py-3 px-4 font-medium transition-colors duration-200 rounded-lg";
  
  return (
    <div className="h-screen w-72 bg-gray-900 text-gray-200 flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-orange-600 to-orange-400">
        <h1 className="text-2xl font-bold text-white">BiteSpeed</h1>
        <p className="text-orange-100 text-sm">Restaurant Partner Portal</p>
      </div>

      
      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2 p-4 flex-1">
        <NavLink 
          to="/restaurant/dashboard" 
          className={({ isActive }) => 
            `${linkStyle} ${isActive ? activeStyle : "hover:bg-gray-800"}`
          }
        >
          <FaTachometerAlt className="text-orange-500" /> 
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/restaurant/menu" 
          className={({ isActive }) => 
            `${linkStyle} ${isActive ? activeStyle : "hover:bg-gray-800"}`
          }
        >
          <FaUtensils className="text-orange-500" /> 
          <span>Menu Management</span>
        </NavLink>
        
        <NavLink 
          to="/restaurant/orders" 
          className={({ isActive }) => 
            `${linkStyle} ${isActive ? activeStyle : "hover:bg-gray-800"}`
          }
        >
          <FaClipboardList className="text-orange-500" /> 
          <span>Orders</span>
        </NavLink>
        
        
        <NavLink 
          to="/restaurant/profile" 
          className={({ isActive }) => 
            `${linkStyle} ${isActive ? activeStyle : "hover:bg-gray-800"}`
          }
        >
          <FaUser className="text-orange-500" /> 
          <span>Profile</span>
        </NavLink>
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-gray-200"
        >
          <FaSignOutAlt className="text-orange-500" /> 
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default RestaurantDashboardSidebar;