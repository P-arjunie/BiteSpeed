import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // You'll need to ensure this is properly configured

const CustomerOrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const googleMapsApiKey = 'AIzaSyBoJXxxWOMKdexaiud8ImxzzkaHtEIYtds'; // Your Google Maps API key

  // Load Google Maps script dynamically
  useEffect(() => {
    if (!window.google && !document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else if (window.google) {
      setMapLoaded(true);
    }
  }, []);

  // Function to fetch initial order details from API
  const fetchOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }
    
    setLoading(true);
    try {
      // Fetch order details from API
      const response = await axios.get(`https://ordermanagementservice.onrender.com/api/orders/${orderId}`);
      
      // Set initial order data without status (will come from Firebase)
      const orderData = response.data;
      setOrder(orderData);
      setError('');

      // Start listening to Firebase for status updates
      listenToOrderStatus(orderId);
      
      // If order might be out for delivery, also listen for driver location
      listenToDriverLocation(orderId);
    } catch (err) {
      console.error(err);
      setError('Order not found. Please check the ID.');
      setOrder(null);
      setOrderStatus(null);
    } finally {
      setLoading(false);
    }
  };

  // Set up Firebase listener for order status
  const listenToOrderStatus = (orderIdValue) => {
    // Set up listener for real-time order status updates from Firebase
    return onSnapshot(
      doc(db, 'OrderStatues', orderIdValue),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const statusData = docSnapshot.data();
          console.log("Firebase status update:", statusData.status);
          setOrderStatus(statusData.status);
        } else {
          console.log("No status document found in Firebase");
        }
      },
      (error) => {
        console.error("Error listening to order status:", error);
      }
    );
  };

  // Set up Firebase listener for driver location
  const listenToDriverLocation = (orderIdValue) => {
    return onSnapshot(
      doc(db, 'assignedOrders', orderIdValue),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const assignedOrderData = docSnapshot.data();
          setDriverLocation(assignedOrderData.driverLocation);
        }
      },
      (error) => {
        console.error("Error listening to driver location:", error);
      }
    );
  };

  // Set up Firebase listeners when orderId changes
  useEffect(() => {
    let orderStatusUnsubscribe = null;
    let driverLocationUnsubscribe = null;
    
    if (orderId && order) {
      // If we have an orderId and order data, set up the listeners
      orderStatusUnsubscribe = listenToOrderStatus(orderId);
      driverLocationUnsubscribe = listenToDriverLocation(orderId);
    }
    
    // Clean up function to remove the listeners when component unmounts or orderId changes
    return () => {
      if (orderStatusUnsubscribe) {
        orderStatusUnsubscribe();
      }
      if (driverLocationUnsubscribe) {
        driverLocationUnsubscribe();
      }
    };
  }, [orderId, order]);

  // Get the current status - prioritize Firebase status if available
  const getCurrentStatus = () => {
    return orderStatus || (order ? order.status : null);
  };

  // Initialize map when both order and driver location are available and map is loaded
  useEffect(() => {
    const status = getCurrentStatus();
    
    if (mapLoaded && order && driverLocation && status === 'PickUp' && order.userDistance && mapRef) {
      // Create map if not already created
      if (!map) {
        const userLocation = {
          lat: parseFloat(order.userDistance.latitude) || 0,
          lng: parseFloat(order.userDistance.longitude) || 0
        };
        
        const driverLoc = {
          lat: parseFloat(driverLocation.latitude) || 0,
          lng: parseFloat(driverLocation.longitude) || 0
        };

        // Calculate center point between user and driver locations
        const centerLat = (userLocation.lat + driverLoc.lat) / 2;
        const centerLng = (userLocation.lng + driverLoc.lng) / 2;
        
        const newMap = new window.google.maps.Map(mapRef, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 13,
          styles: [
            {
              "featureType": "all",
              "elementType": "geometry",
              "stylers": [{ "color": "#ffffff" }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{ "color": "#e9e9e9" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{ "color": "#f5f5f5" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#dadada" }]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [{ "color": "#f0f0f0" }]
            },
            {
              "featureType": "transit",
              "elementType": "geometry",
              "stylers": [{ "color": "#f2f2f2" }]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#ffffff" }]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#757575" }]
            }
          ]
        });
        
        // Add user marker
        new window.google.maps.Marker({
          position: userLocation,
          map: newMap,
          title: "Your Location",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }
        });
        
        // Add driver marker
        const driverMarker = new window.google.maps.Marker({
          position: driverLoc,
          map: newMap,
          title: "Driver Location",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          }
        });
        
        // Update driver marker position when driver location changes
        const driverLocationUnsubscribe = onSnapshot(
          doc(db, 'assignedOrders', orderId),
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              const assignedOrderData = docSnapshot.data();
              if (assignedOrderData.driverLocation) {
                const newDriverLoc = {
                  lat: parseFloat(assignedOrderData.driverLocation.latitude) || 0,
                  lng: parseFloat(assignedOrderData.driverLocation.longitude) || 0
                };
                driverMarker.setPosition(newDriverLoc);
              }
            }
          }
        );
        
        // Draw route between driver and user
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: newMap,
          suppressMarkers: true, // Don't show default markers
          polylineOptions: {
            strokeColor: '#FF8C00',
            strokeWeight: 5
          }
        });
        
        directionsService.route({
          origin: driverLoc,
          destination: userLocation,
          travelMode: window.google.maps.TravelMode.DRIVING
        }, (response, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(response);
          } else {
            console.error(`Directions request failed due to ${status}`);
          }
        });
        
        setMap(newMap);
        
        // Clean up function
        return () => {
          driverLocationUnsubscribe();
        };
      }
    }
  }, [mapLoaded, order, driverLocation, mapRef, orderId, orderStatus]);

  const getStep = (status) => {
    switch (status) {
      case 'Waiting for Accepted':
        return 0;
      case 'Accepted':
        return 1;
      case 'PickUp':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const statusSteps = ['Waiting for Accepted', 'Preparing Order', 'Out for Delivery', 'Delivered'];
  
  // Get current status for display purposes
  const status = getCurrentStatus();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
        <div className="bg-orange-600 py-6 px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">Track Your Order</h1>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
            <div className="flex-grow">
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-300 mb-2">Order ID</label>
              <input
                id="orderId"
                type="text"
                placeholder="Enter your order ID number"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="border border-gray-600 p-4 w-full rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm bg-gray-700 text-white"
              />
            </div>
            <button
              onClick={fetchOrder}
              disabled={loading}
              className="bg-orange-600 text-white text-lg py-4 px-8 rounded-lg hover:bg-orange-700 transition duration-200 shadow-md flex items-center justify-center disabled:opacity-70"
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-8 rounded-md">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {order && (
            <div className="space-y-8">
              {/* Firebase Status Display (debug)
              {orderStatus && (
                <div className="bg-orange-900 border-l-4 border-orange-500 p-4 mb-0 rounded-md">
                  <p className="text-orange-200">Real-time status: {orderStatus}</p>
                </div>
              )} */}
            
              {/* Progress Step Bar */}
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold text-gray-200 mb-6">Order Status</h2>
                <div className="relative">
                  {/* Progress Bar Background */}
                  <div className="h-2 bg-gray-700 rounded-full"></div>
                  
                  {/* Progress Bar Fill */}
                  <div 
                    className="absolute top-0 left-0 h-2 bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${(getStep(status) / 3) * 100}%` }}
                  ></div>
                  
                  {/* Step Markers */}
                  <div className="flex justify-between mt-2">
                    {statusSteps.map((stepName, index) => (
                      <div key={index} className="relative flex flex-col items-center mt-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                          index <= getStep(status) 
                            ? 'bg-orange-500 border-orange-500' 
                            : 'bg-gray-800 border-gray-600'
                        }`}>
                          {index <= getStep(status) && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <span className={`text-xs font-medium mt-2 text-center max-w-24 ${
                          index <= getStep(status) ? 'text-orange-400' : 'text-gray-400'
                        }`}>
                          {stepName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Section - Only shown when order is Out for Delivery */}
              {status === 'PickUp' && (
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-200 mb-4">Live Delivery Tracking</h2>
                  <div 
                    ref={setMapRef}
                    className="w-full h-64 md:h-96 rounded-lg overflow-hidden"
                  >
                    {!mapLoaded && (
                      <div className="flex items-center justify-center h-full bg-gray-800">
                        <p className="text-gray-400">Loading map...</p>
                      </div>
                    )}
                  </div>
                  
                  {driverLocation && order.userDistance && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-400">Your Location</h3>
                        <p className="text-white">{order.userDistance.address}</p>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-400">Driver Information</h3>
                        <p className="text-white">{order.driverName || 'Driver'}</p>
                        <p className="text-white">{order.vehicleNumber || 'Vehicle'}</p>
                        <p className="text-white">{order.contactNumber || 'Contact'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Order Details */}
              <div className="grid md:grid-cols-1 gap-8">
                

                <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-200 mb-4">Order Details</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Item</span>
                      <span className="font-medium text-white">{order.itemName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Quantity</span>
                      <span className="font-medium text-white">{order.quantity}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Price</span>
                      <span className="font-medium text-white">LKR {order.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Estimated Delivery */}
              <div className="bg-orange-900 bg-opacity-40 p-6 rounded-xl border border-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-orange-300">Estimated Delivery</h3>
                    <p className="text-orange-200">
                      {status === 'Delivered' 
                        ? 'Your order has been delivered!' 
                        : 'Your order is on its way!'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-orange-300">
                      {status === 'Delivered' ? 'Delivered' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Delivery Timeline */}
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Order Timeline</h2>
                <div className="space-y-6">
                  {statusSteps.map((stepName, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index <= getStep(status) 
                            ? 'bg-orange-500' 
                            : 'bg-gray-700'
                        }`}>
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className={`font-medium ${
                          index <= getStep(status) ? 'text-orange-400' : 'text-gray-400'
                        }`}>
                          {stepName}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {index === 0 && 'We received your order and are processing it.'}
                          {index === 1 && 'Our team is preparing your items for delivery.'}
                          {index === 2 && 'Your order is on the way to your location.'}
                          {index === 3 && 'Your order has been delivered successfully.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderTracking;