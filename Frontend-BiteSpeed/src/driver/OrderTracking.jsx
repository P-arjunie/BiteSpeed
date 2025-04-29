import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from '@react-google-maps/api';
import axios from 'axios';
import { doc, setDoc, getFirestore,updateDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const containerStyle = {
  width: '100%',
  height: '60vh',
};

const OrderTracking = () => {
  const { state } = useLocation();
  const {
    order,
    driverLocation: initialDriverLocation,
    restaurantLocation,
    coustomerLocation,
  } = state || {};

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBoJXxxWOMKdexaiud8ImxzzkaHtEIYtds', // Your Google API key
  });

  const [driverLocation, setDriverLocation] = useState(initialDriverLocation);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [pickedUp, setPickedUp] = useState(false);
  const [delivered, setDelivered] = useState(false);
  
  // Initialize Firestore
  const db = getFirestore(getApp());

  const restaurantLatLng = restaurantLocation && {
    lat: parseFloat(restaurantLocation.latitude),
    lng: parseFloat(restaurantLocation.longitude),
  };

  const customerLatLng = coustomerLocation && {
    lat: parseFloat(coustomerLocation.latitude),
    lng: parseFloat(coustomerLocation.longitude),
  };

  const updateRoute = (from, to) => {
    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: from,
        destination: to,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          const route = result.routes[0].legs[0];
          setDistance(route.distance.text);
          setDuration(route.duration.text);
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  };

  useEffect(() => {
    if (isLoaded && driverLocation && restaurantLatLng && !pickedUp) {
      updateRoute(driverLocation, restaurantLatLng);
    }

    if (isLoaded && pickedUp && !delivered && driverLocation && customerLatLng) {
      updateRoute(driverLocation, customerLatLng);
    }
  }, [isLoaded, driverLocation, restaurantLatLng, customerLatLng, pickedUp, delivered]);

  // Update driver location in Firestore
  const updateDriverLocationInFirestore = async (location) => {
    try {
      if (!order || !order._id) return;
      
      // Only update the location field in Firestore
      await setDoc(doc(db, 'assignedOrders', order._id), {
        driverLocation: {
          latitude: location.lat,
          longitude: location.lng,
        },
      }, { merge: true }); // Using merge to only update the location field
      
      console.log('Driver location updated in Firestore');
    } catch (error) {
      console.error('Error updating driver location in Firestore:', error);
    }
  };

  // Real-Time Location Tracking with Firestore updates
  useEffect(() => {
    if (isLoaded && !delivered) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setDriverLocation(newLocation);
          
          // Update only location in Firestore
          //updateDriverLocationInFirestore(newLocation);

          if (!pickedUp && restaurantLatLng) {
            updateRoute(newLocation, restaurantLatLng);
          } else if (pickedUp && customerLatLng) {
            updateRoute(newLocation, customerLatLng);
          }
        },
        (error) => console.error('Error getting location:', error),
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [isLoaded, pickedUp, delivered, restaurantLatLng, customerLatLng]);

  const handlePickupClick = async () => {
    try {
      setIsUpdating(true);
      setUpdateMessage('');

      await updateDoc(doc(db, 'OrderStatues', order._id), {
        status: 'PickUp'
      });

      await axios.patch(
        `https://ordermanagementservice.onrender.com/api/orders/${order._id}/update-status`,
        { status: 'PickUp' }
      );

      setDriverLocation(restaurantLatLng);
      setPickedUp(true);
      setUpdateMessage('Order picked up. Routing to customer.');
    } catch (error) {
      console.error('Failed to update status:', error);
      setUpdateMessage('Failed to update order status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeliveredClick = async () => {
    try {
      setIsUpdating(true);
      setUpdateMessage('');

      await updateDoc(doc(db, 'OrderStatues', order._id), {
        status: 'Delivered'
      });

      await axios.patch(
        `https://ordermanagementservice.onrender.com/api/orders/${order._id}/update-status`,
        { status: 'Delivered' }
      );

      setDelivered(true);
      setUpdateMessage('Order successfully delivered!');
    } catch (error) {
      console.error('Failed to update status:', error);
      setUpdateMessage('Failed to update order status.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order || !driverLocation || (!restaurantLatLng && !pickedUp)) {
    return <p className="text-center mt-8 text-orange-500">No tracking data available.</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center">Order Tracking</h2>
        <p className="text-white text-center text-sm opacity-80 mt-1">
          {delivered ? 'Order delivered' : pickedUp ? 'Delivering to customer' : 'Heading to restaurant'}
        </p>
      </div>

      {isLoaded && !delivered && (
        <div className="p-4">
          <div className="rounded-xl overflow-hidden shadow-lg border-2 border-orange-300 mb-4">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={driverLocation}
              zoom={14}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              <Marker 
                position={driverLocation} 
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
              {!pickedUp && restaurantLatLng && (
                <Marker 
                  position={restaurantLatLng} 
                  label={{
                    text: "R",
                    color: "white"
                  }}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                />
              )}
              {customerLatLng && (
                <Marker 
                  position={customerLatLng}
                  label={{
                    text: "C",
                    color: "white"
                  }}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                />
              )}
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{ 
                    suppressMarkers: true,
                    polylineOptions: {
                      strokeColor: pickedUp ? "#3b82f6" : "#f97316",
                      strokeWeight: 5
                    }
                  }}
                />
              )}
            </GoogleMap>
            <div className="bg-white p-3 flex items-center justify-between">
              <div className="flex items-center text-orange-600">
                <span className="text-xl mr-2">📍</span>
                <span className="text-sm">Distance: {distance || 'Calculating...'}</span>
              </div>
              <div className="flex items-center text-orange-600">
                <span className="text-xl mr-2">⏱️</span>
                <span className="text-sm">ETA: {duration || 'Calculating...'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {delivered && (
        <div className="p-4">
          <div className="rounded-xl overflow-hidden shadow-lg border-2 border-green-300 mb-4 bg-green-50 p-8 text-center">
            <div className="mb-4">
              <span className="text-5xl">✅</span>
            </div>
            <h3 className="text-xl font-bold text-green-700">
              Order Successfully Delivered!
            </h3>
            <p className="text-green-600 mt-2">
              Thank you for completing this delivery.
            </p>
          </div>
        </div>
      )}

      <div className="px-4 pb-6">
        <div className="p-4 bg-white shadow-lg rounded-xl border border-orange-200">
          <h3 className="text-xl font-bold text-orange-600 mb-4 border-b border-orange-100 pb-2">
            Order Summary
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs font-medium text-orange-600">ORDER ID</p>
              <p className="text-sm font-medium mt-1 truncate">{order._id}</p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs font-medium text-orange-600">CUSTOMER</p>
              <p className="text-sm font-medium mt-1">{order.customerName}</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs font-medium text-orange-600">CUSTOMER NUMBER</p>
              <p className="text-sm font-medium mt-1">{order.phone}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs font-medium text-orange-600">PRICE</p>
              <p className="text-sm font-medium mt-1">{order.price}</p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs font-medium text-orange-600">PICKUP</p>
              <p className="text-sm font-medium mt-1 flex items-center">
                <span className="text-lg mr-1">🍽️</span>
                {order.resturantLocation}
              </p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs font-medium text-orange-600">DELIVERY</p>
              <p className="text-sm font-medium mt-1 flex items-center">
                <span className="text-lg mr-1">📍</span>
                {order.userLocation}
              </p>
            </div>
          </div>

          {!pickedUp && !delivered && (
            <div className="mt-6 flex flex-col items-center">
              <button
                onClick={handlePickupClick}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md w-full sm:w-auto transition-colors flex items-center justify-center"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="mr-2">🛵</span>
                    Confirm Pickup
                  </span>
                )}
              </button>
            </div>
          )}
          
          {pickedUp && !delivered && (
            <div className="mt-6 flex flex-col items-center">
              <button
                onClick={handleDeliveredClick}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md w-full sm:w-auto transition-colors flex items-center justify-center"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="mr-2">📦</span>
                    Confirm Delivery
                  </span>
                )}
              </button>
            </div>
          )}
          
          {delivered && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-600 font-medium flex items-center justify-center">
                <span className="text-xl mr-2">🎉</span>
                Order successfully delivered! Status updated to "Delivered".
              </p>
            </div>
          )}
          
          {updateMessage && !delivered && (
            <p className="mt-3 text-sm text-green-600 text-center bg-green-50 px-4 py-2 rounded-full">
              {updateMessage}
            </p>
          )}
        </div>
      </div>
      
      {/* Fixed Action Button */}
      <div className="fixed bottom-4 right-4">
        <button 
          onClick={() => window.location.reload()}
          className="bg-orange-500 text-white h-14 w-14 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
        >
          <span className="text-2xl">🔄</span>
        </button>
      </div>
    </div>
  );
};

export default OrderTracking;