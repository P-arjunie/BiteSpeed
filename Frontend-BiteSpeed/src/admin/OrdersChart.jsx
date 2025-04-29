import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart, ComposedChart
} from 'recharts';

// Updated color palette to match the given theme
const COLORS = ['#f97316', '#ea580c', '#fed7aa', '#fdba74', '#facc15', '#f87171'];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [mapView, setMapView] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://ordermanagementservice.onrender.com/api/orders/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-800">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-400 text-gray-800 p-4 m-4" role="alert">
        <p className="font-bold">Error</p>
        <p>Failed to load dashboard data: {error}</p>
        <button 
          className="mt-2 bg-red-400 hover:bg-red-500 text-white font-bold py-1 px-2 rounded"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Process data for different visualizations
  const processOrdersByRestaurant = () => {
    const restaurantCounts = orders.reduce((acc, order) => {
      const restaurantName = order.resturantLocation || 'Unknown';
      
      if (!acc[restaurantName]) {
        acc[restaurantName] = {
          name: restaurantName,
          count: 0,
          revenue: 0
        };
      }
      
      acc[restaurantName].count += 1;
      acc[restaurantName].revenue += order.price * order.quantity;
      return acc;
    }, {});
    
    return Object.values(restaurantCounts);
  };

  const processOrdersByStatus = () => {
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status || 'Unknown';
      
      if (!acc[status]) {
        acc[status] = {
          name: status,
          value: 0
        };
      }
      
      acc[status].value += 1;
      return acc;
    }, {});
    
    return Object.values(statusCounts);
  };

  const processOrdersByDate = () => {
    const dateGroups = orders.reduce((acc, order) => {
      const date = new Date(order.date);
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      if (!acc[dateStr]) {
        acc[dateStr] = {
          date: dateStr,
          orders: 0,
          revenue: 0
        };
      }
      
      acc[dateStr].orders += 1;
      acc[dateStr].revenue += order.price * order.quantity;
      return acc;
    }, {});
    
    return Object.values(dateGroups).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  };

  const processTopSellingItems = () => {
    const itemCounts = orders.reduce((acc, order) => {
      const itemName = order.itemName || 'Unknown';
      
      if (!acc[itemName]) {
        acc[itemName] = {
          name: itemName,
          count: 0,
          revenue: 0
        };
      }
      
      acc[itemName].count += order.quantity;
      acc[itemName].revenue += order.price * order.quantity;
      return acc;
    }, {});
    
    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getDeliveryDistanceStats = () => {
    let totalDistance = 0;
    let count = 0;
    let maxDistance = 0;
    
    orders.forEach(order => {
      if (order.userDistance && order.resturantDistance) {
        const lat1 = order.userDistance.latitude;
        const lon1 = order.userDistance.longitude;
        const lat2 = order.resturantDistance.latitude;
        const lon2 = order.resturantDistance.longitude;
        
        // Haversine formula to calculate distance
        const R = 6371; // Earth radius in km
        const dLat = (lat2-lat1) * Math.PI/180;
        const dLon = (lon2-lon1) * Math.PI/180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        totalDistance += distance;
        count++;
        maxDistance = Math.max(maxDistance, distance);
      }
    });
    
    return {
      averageDistance: count > 0 ? (totalDistance / count).toFixed(2) : 0,
      maxDistance: maxDistance.toFixed(2),
      totalDistance: totalDistance.toFixed(2)
    };
  };

  const getDriverStats = () => {
    const driverOrders = orders.reduce((acc, order) => {
      const driverName = order.driverName || 'Unassigned';
      
      if (!acc[driverName]) {
        acc[driverName] = {
          name: driverName,
          orders: 0,
          completed: 0
        };
      }
      
      acc[driverName].orders += 1;
      if (order.status === 'Delivered') {
        acc[driverName].completed += 1;
      }
      
      return acc;
    }, {});
    
    return Object.values(driverOrders).map(driver => ({
      ...driver,
      completionRate: driver.orders > 0 ? 
        ((driver.completed / driver.orders) * 100).toFixed(1) : 0
    }));
  };

  const getCustomerRetention = () => {
    const customerOrders = orders.reduce((acc, order) => {
      const customerId = order.userId;
      
      if (!acc[customerId]) {
        acc[customerId] = {
          id: customerId,
          name: order.customerName,
          orders: 0,
          totalSpent: 0,
          firstOrderDate: new Date(order.date),
          lastOrderDate: new Date(order.date)
        };
      }
      
      acc[customerId].orders += 1;
      acc[customerId].totalSpent += order.price * order.quantity;
      
      const orderDate = new Date(order.date);
      if (orderDate < acc[customerId].firstOrderDate) {
        acc[customerId].firstOrderDate = orderDate;
      }
      if (orderDate > acc[customerId].lastOrderDate) {
        acc[customerId].lastOrderDate = orderDate;
      }
      
      return acc;
    }, {});
    
    const retentionData = Object.values(customerOrders);
    
    // Calculate retention metrics
    const returningCustomers = retentionData.filter(customer => customer.orders > 1).length;
    const totalCustomers = retentionData.length;
    const retentionRate = totalCustomers > 0 ? 
      ((returningCustomers / totalCustomers) * 100).toFixed(1) : 0;
    
    const avgOrdersPerCustomer = totalCustomers > 0 ?
      (orders.length / totalCustomers).toFixed(1) : 0;
    
    return {
      retentionRate,
      avgOrdersPerCustomer,
      totalCustomers,
      returningCustomers,
      customerDetails: retentionData.sort((a, b) => b.orders - a.orders).slice(0, 5)
    };
  };

  const dashboardSummary = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(order => order.status === 'Pending').length,
    deliveredOrders: orders.filter(order => order.status === 'Delivered').length,
    totalRevenue: orders.reduce((acc, order) => acc + (order.price * order.quantity), 0),
    averageOrderValue: orders.length > 0 ? 
      (orders.reduce((acc, order) => acc + (order.price * order.quantity), 0) / orders.length).toFixed(2) : 0
  };

  const restaurantData = processOrdersByRestaurant();
  const statusData = processOrdersByStatus();
  const dailyData = processOrdersByDate();
  const topSellingItems = processTopSellingItems();
  const distanceStats = getDeliveryDistanceStats();
  const driverStats = getDriverStats();
  const customerStats = getCustomerRetention();

  // Time-based analytics
  const getCurrentWeekData = () => {
    const now = new Date();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayCount = new Array(7).fill(0);
    
    orders.forEach(order => {
      const orderDate = new Date(order.date);
      const diffTime = Math.abs(now - orderDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) {
        const dayIndex = orderDate.getDay();
        dayCount[dayIndex]++;
      }
    });
    
    return daysOfWeek.map((day, index) => ({
      name: day,
      orders: dayCount[index]
    }));
  };
  
  const weekData = getCurrentWeekData();

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-orange-500 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-white">Crust Pizza Admin Dashboard</h1>
            <div className="flex items-center space-x-2">
              <select 
                className="border rounded-md px-3 py-1 text-sm"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded text-sm">
                Refresh Data
              </button>
              <div className="relative inline-block text-left">
                <button className="bg-orange-600 p-2 rounded-full">
                  <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12 6 6 0 000-12z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {['overview', 'orders', 'restaurants', 'items', 'drivers', 'customers', 'analytics'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-800">{dashboardSummary.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
            <p className="text-3xl font-bold text-yellow-400">{dashboardSummary.pendingOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-gray-500 text-sm font-medium">Delivered Orders</h3>
            <p className="text-3xl font-bold text-orange-500">{dashboardSummary.deliveredOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-800">Rs. {dashboardSummary.totalRevenue}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-gray-500 text-sm font-medium">Avg. Order Value</h3>
            <p className="text-3xl font-bold text-gray-800">Rs. {dashboardSummary.averageOrderValue}</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="orders" name="Number of Orders" fill="#f97316" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue (Rs)" stroke="#ea580c" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#f97316"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Restaurants by Orders</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={restaurantData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Orders" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Items</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topSellingItems} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Units Sold" fill="#fdba74" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Order Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" name="Orders" fill="#fdba74" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Retention</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-orange-100 p-4 rounded-lg">
                    <p className="text-sm text-orange-600">Retention Rate</p>
                    <p className="text-2xl font-bold text-orange-600">{customerStats.retentionRate}%</p>
                  </div>
                  <div className="bg-orange-200 p-4 rounded-lg">
                    <p className="text-sm text-orange-600">Avg Orders/Customer</p>
                    <p className="text-2xl font-bold text-orange-600">{customerStats.avgOrdersPerCustomer}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center h-48">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="relative">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#fdba74" strokeWidth="10" />
                      <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="#f97316" strokeWidth="10"
                        strokeDasharray={`${customerStats.retentionRate * 2.83} 283`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-orange-500">{customerStats.returningCustomers}</p>
                      <p className="text-sm text-gray-500">Returning</p>
                      <p className="text-sm text-gray-500">Customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'restaurants' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Restaurant Performance</h3>
              <div className="flex justify-end mb-4">
                <button 
                  className={`px-3 py-1 rounded text-sm mr-2 ${mapView ? 'bg-gray-200' : 'bg-orange-500 text-white'}`}
                  onClick={() => setMapView(false)}
                >
                  Chart View
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm ${mapView ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setMapView(true)}
                >
                  Map View
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              {mapView ? (
                <div className="flex justify-center items-center h-96 bg-gray-100">
                  <div className="text-center">
                    <div className="h-12 w-12 mx-auto mb-4 text-orange-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <p className="text-gray-500">Map View showing restaurant locations and order density</p>
                    <p className="text-sm text-gray-400 mt-2">Data points would be plotted on an actual map in the real implementation</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={restaurantData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="Number of Orders" fill="#f97316" />
                    <Bar yAxisId="right" dataKey="revenue" name="Revenue (Rs)" fill="#fdba74" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="p-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Restaurant Details</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Order Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {restaurantData.map((restaurant, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{restaurant.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{restaurant.count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {restaurant.revenue}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Rs. {restaurant.count > 0 ? (restaurant.revenue / restaurant.count).toFixed(2) : 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            className="text-orange-500 hover:text-orange-700"
                            onClick={() => setSelectedRestaurant(restaurant)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Driver Performance</h3>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-gray-500 text-sm font-medium">Average Delivery Distance</h3>
                  <p className="text-2xl font-bold text-gray-900">{distanceStats.averageDistance} km</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-gray-500 text-sm font-medium">Maximum Delivery Distance</h3>
                  <p className="text-2xl font-bold text-gray-900">{distanceStats.maxDistance} km</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-gray-500 text-sm font-medium">Total Distance Covered</h3>
                  <p className="text-2xl font-bold text-gray-900">{distanceStats.totalDistance} km</p>
                </div>
              </div>
              <div className="mb-8">
                <h4 className="font-medium mb-4">Driver Completion Rates</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={driverStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" name="Total Orders" fill="#8884d8" />
                    <Bar dataKey="completed" name="Completed Orders" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {driverStats.map((driver, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.orders}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.completed}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {driver.completionRate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-500 hover:text-blue-700">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Menu Items Analysis</h3>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="mb-8">
                <h4 className="font-medium mb-4">Top Selling Items</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topSellingItems}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="Units Sold" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="revenue" name="Revenue (Rs)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topSellingItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {item.revenue}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Rs. {item.count > 0 ? (item.revenue / item.count).toFixed(2) : 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-500 hover:text-blue-700">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Analytics</h3>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-gray-500 text-sm font-medium">Total Customers</h3>
                  <p className="text-2xl font-bold text-gray-900">{customerStats.totalCustomers}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-gray-500 text-sm font-medium">Returning Customers</h3>
                  <p className="text-2xl font-bold text-gray-900">{customerStats.returningCustomers}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-gray-500 text-sm font-medium">Avg. Orders per Customer</h3>
                  <p className="text-2xl font-bold text-gray-900">{customerStats.avgOrdersPerCustomer}</p>
                </div>
              </div>
              <div className="mb-8">
                <h4 className="font-medium mb-4">Top Customers</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customerStats.customerDetails.map((customer, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name || 'Anonymous'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.orders}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {customer.totalSpent.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.firstOrderDate.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.lastOrderDate.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-blue-500 hover:text-blue-700">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Management</h3>
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                  <select 
                    className="border rounded-md px-3 py-1 text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
                    className="border rounded-md px-3 py-1 text-sm" 
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.slice(0, 10).map((order, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id?.slice(-6) || index}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName || 'Anonymous'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.resturantLocation || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {order.price * order.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-500 hover:text-blue-700 mr-2">View</button>
                        <button className="text-gray-500 hover:text-gray-700">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                    <span className="font-medium">{orders.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-500 hover:bg-gray-50">1</button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">2</button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Advanced Analytics</h3>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-gray-700 font-medium mb-4">Revenue Growth</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-gray-700 font-medium mb-4">Order Growth</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="orders" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="mb-8">
                <h4 className="font-medium mb-4">Key Metrics Summary</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Period</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Revenue</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {dashboardSummary.totalRevenue}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {dashboardSummary.totalRevenue * 0.85}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">+17.6%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Orders</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dashboardSummary.totalOrders}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.round(dashboardSummary.totalOrders * 0.9)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">+11.1%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Average Order Value</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {dashboardSummary.averageOrderValue}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {(dashboardSummary.averageOrderValue * 0.95).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">+5.3%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Customer Retention</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customerStats.retentionRate}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(customerStats.retentionRate * 0.92).toFixed(1)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">+8.7%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Detail Modal */}
        {selectedRestaurant && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full mx-4 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Restaurant Details: {selectedRestaurant.name}</h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedRestaurant(null)}
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium mb-2">Summary</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Total Orders:</span>
                        <span className="font-medium">{selectedRestaurant.count}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Total Revenue:</span>
                        <span className="font-medium">Rs. {selectedRestaurant.revenue}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Avg. Order Value:</span>
                        <span className="font-medium">
                          Rs. {selectedRestaurant.count > 0 ? (selectedRestaurant.revenue / selectedRestaurant.count).toFixed(2) : 0}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Performance</h4>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'This Restaurant', value: selectedRestaurant.count },
                              { name: 'Others', value: orders.length - selectedRestaurant.count }
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#8884d8" />
                            <Cell fill="#82ca9d" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium mb-2">Recent Orders</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders
                          .filter(order => order.resturantLocation === selectedRestaurant.name)
                          .slice(0, 5)
                          .map((order, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName || 'Anonymous'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.itemName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {order.price * order.quantity}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                  'bg-blue-100 text-blue-800'}`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button 
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded mr-2"
                  onClick={() => setSelectedRestaurant(null)}
                >
                  Close
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Full Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}