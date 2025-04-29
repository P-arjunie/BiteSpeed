import React, { useEffect, useState } from 'react';

const OrderSummaryPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://ordermanagementservice.onrender.com/api/orders/')
      .then(res => res.json())
      .then(data => {
        setOrder(data[0]); // Fetch the first order
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch order data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6 text-center">Loading order summary...</div>;
  if (!order) return <div className="p-6 text-center text-red-500">No order data found.</div>;

  const { resturantId, resturantDistance, driverName, driverLocation, itemName, quantity, price } = order;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-4">📦 Order Summary</h1>

      <div className="mb-4">
        <p><strong>Restaurant ID:</strong> {resturantId}</p>
        <p><strong>Restaurant Distance:</strong> {resturantDistance?.latitude}, {resturantDistance?.longitude}</p>
      </div>

      <div className="mb-4">
        <p><strong>Driver Name:</strong> {driverName}</p>
        <p><strong>Driver Location:</strong> {driverLocation}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Item Ordered:</h2>
        <div className="space-y-2">
          <div className="flex justify-between border-b pb-2">
            <span>{itemName}</span>
            <span>Qty: {quantity}</span>
            <span>${price ? price.toFixed(2) : '0.00'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
