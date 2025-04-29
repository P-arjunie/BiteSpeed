import React, { useEffect, useState } from 'react';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('https://ordermanagementservice.onrender.com/api/orders/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setOrders(data))
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Orders List</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">Customer Name</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">User Location</th>
            <th className="py-2 px-4 border-b">User Distance (Lat,Lng)</th>
            <th className="py-2 px-4 border-b">Restaurant ID</th>
            <th className="py-2 px-4 border-b">Restaurant Location</th>
            <th className="py-2 px-4 border-b">Restaurant Distance (Lat,Lng)</th>
            <th className="py-2 px-4 border-b">Meal ID</th>
            <th className="py-2 px-4 border-b">Item Name</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Price (Rs.)</th>
            <th className="py-2 px-4 border-b">Driver Name</th>
            <th className="py-2 px-4 border-b">Driver Location</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td className="py-2 px-4 border-b">{order._id}</td>
              <td className="py-2 px-4 border-b">{order.customerName}</td>
              <td className="py-2 px-4 border-b">{order.phone}</td>
              <td className="py-2 px-4 border-b">{order.address}</td>
              <td className="py-2 px-4 border-b">{order.userLocation}</td>
              <td className="py-2 px-4 border-b">
                {order.userDistance ? `${order.userDistance.latitude}, ${order.userDistance.longitude}` : 'N/A'}
              </td>
              <td className="py-2 px-4 border-b">{order.resturantId}</td>
              <td className="py-2 px-4 border-b">{order.resturantLocation}</td>
              <td className="py-2 px-4 border-b">
                {order.resturantDistance ? `${order.resturantDistance.latitude}, ${order.resturantDistance.longitude}` : 'N/A'}
              </td>
              <td className="py-2 px-4 border-b">{order.mealId}</td>
              <td className="py-2 px-4 border-b">{order.itemName}</td>
              <td className="py-2 px-4 border-b">{order.quantity}</td>
              <td className="py-2 px-4 border-b">Rs. {order.price}</td>
              <td className="py-2 px-4 border-b">{order.driverName}</td>
              <td className="py-2 px-4 border-b">{order.driverLocation}</td>
              <td className="py-2 px-4 border-b">{order.status}</td>
              <td className="py-2 px-4 border-b">{new Date(order.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
