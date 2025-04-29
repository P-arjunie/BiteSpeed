import React from 'react';
import { FaTachometerAlt, FaBoxOpen, FaUser, FaSignOutAlt, FaSearch, FaCar, FaBars, FaTimes, FaMapMarkedAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const DriverDashboardSidebar = ({ onLogout, isSidebarOpen, toggleSidebar, closeSidebar }) => {
  const location = useLocation();
  
  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation items
  const navItems = [
    { path: '/dashboard', icon: <FaTachometerAlt size={20} />, label: 'Dashboard' },
    { path: '/orders', icon: <FaBoxOpen size={20} />, label: 'My Orders' },
    { path: '/dashboard/findOrders', icon: <FaSearch size={20} />, label: 'Find Orders' },
    
    { path: '/dashboard/addVehicle', icon: <FaCar size={20} />, label: 'My Vehicles' },
    { path: '/dashboard/profile', icon: <FaUser size={20} />, label: 'Profile' }
  ];

  return (
    <div className="flex">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Logo and close button (mobile) */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="text-2xl font-bold text-white">
            Driver<span className="text-orange-400">Panel</span>
          </div>
          <button onClick={closeSidebar} className="md:hidden text-gray-400 hover:text-white">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Driver info */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-700">
          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
            DR
          </div>
          <div>
            <div className="font-medium">Driver Name</div>
            <div className="text-sm text-gray-400">Online</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 gap-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={closeSidebar}
            >
              <span className={isActive(item.path) ? 'text-white' : 'text-orange-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive(item.path) && (
                <div className="ml-auto h-2 w-2 rounded-full bg-white"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              closeSidebar();
              onLogout();
            }}
            className="w-full py-3 flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <FaSignOutAlt size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Topbar */}
      <div className="fixed top-0 left-0 right-0 md:hidden flex items-center justify-between bg-gray-800 text-white p-4 shadow-md z-40">
        <div className="text-xl font-bold">
          Driver<span className="text-orange-400">Panel</span>
        </div>
        <button onClick={toggleSidebar} className="text-white p-2 rounded-full hover:bg-gray-700">
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>
    </div>
  );
};

export default DriverDashboardSidebar;