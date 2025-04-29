import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DriverDashboardSidebar from '../components/DashboardSideBar';

const DriverDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  // Close sidebar when window resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint in Tailwind
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <DriverDashboardSidebar 
        onLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-0">
        {/* Content padding for mobile navbar */}
        <div className="pt-16 md:pt-0 px-4 md:px-8 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;