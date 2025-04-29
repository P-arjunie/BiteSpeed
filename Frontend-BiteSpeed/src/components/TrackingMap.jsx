import React, { useEffect, useState, useRef } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: window.innerWidth <= 768 ? '300px' : '500px',
};

const defaultCenter = { lat: 6.9271, lng: 79.8612 };

const TrackingMap = () => {
  const [destination, setDestination] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const watchIdRef = useRef(null);

  const updateDirections = (userLocation) => {
    if (!destination) return;

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: userLocation,
        destination: destination,
        travelMode: 'DRIVING',
      },
      (res, status) => {
        if (status === 'OK' && res) {
          setDirectionsResponse(res);
          const leg = res.routes[0].legs[0];
          setDistance(leg.distance.text);
          setDuration(leg.duration.text);
          setMapCenter(userLocation);
        } else {
          console.error('Failed to get updated directions:', status);
        }
      }
    );
  };

  const handleStartTrip = async () => {
    if (!destination) {
      alert('Please enter a destination');
      return;
    }

    // Check if permission is granted (optional enhancement)
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        if (result.state === 'denied') {
          alert('Location access is denied. Please enable location permissions.');
          return;
        }
      } catch (err) {
        console.warn('Permissions API not fully supported.', err);
      }
    }

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(userLocation);
          updateDirections(userLocation);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              alert('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              alert('The request to get user location timed out.');
              break;
            default:
              alert('An error occurred while retrieving the location.');
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 20000, // allow 20s for better accuracy
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full sm:w-2/3 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={handleStartTrip}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Start Trip
        </button>
      </div>

      {distance && duration && (
        <div className="mb-4 text-sm text-gray-700">
          <span className="font-semibold">Distance:</span> {distance} &nbsp;|&nbsp;
          <span className="font-semibold">Duration:</span> {duration}
        </div>
      )}

      <div className="rounded-lg overflow-hidden shadow">
        <LoadScript googleMapsApiKey="AIzaSyBoJXxxWOMKdexaiud8ImxzzkaHtEIYtds">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={15}
          >
            {currentLocation && <Marker position={currentLocation} label="You" />}
            {directionsResponse && (
              <DirectionsRenderer options={{ directions: directionsResponse }} />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default TrackingMap;
