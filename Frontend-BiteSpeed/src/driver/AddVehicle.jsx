import React, { useState, useEffect } from 'react';

const AddVehicle = () => {
  const [vehicleData, setVehicleData] = useState({
    number: '',
    model: '',
    color: '',
    year: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const res = await fetch('https://driver-service-3k84.onrender.com/api/drivers/vehicle/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehicleData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Vehicle added successfully!');
        setVehicleData({ number: '', model: '', color: '', year: '' });
        fetchVehicles();
        setShowForm(false);
      } else {
        setError(data.message || 'Failed to add vehicle.');
      }
    } catch (err) {
      setError('Error adding vehicle.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch('https://driver-service-3k84.onrender.com/api/drivers/vehicle/my-vehicles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setVehicles(data);
      } else {
        setError(data.message || 'Failed to fetch vehicles.');
      }
    } catch (err) {
      setError('Error fetching vehicles.');
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center">My Vehicles</h2>
        <p className="text-white text-center text-sm opacity-80 mt-1">
          Manage your delivery vehicles
        </p>
      </div>

      <div className="max-w-2xl mx-auto mt-4 px-4">
        {success && (
          <div className="p-4 mb-4 rounded-xl overflow-hidden shadow-lg border-2 border-green-300 bg-green-50 text-center">
            <div className="mb-2">
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 mb-4 rounded-xl overflow-hidden shadow-lg border-2 border-red-300 bg-red-50 text-center">
            <div className="mb-2">
              <span className="text-3xl">❌</span>
            </div>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Vehicle List */}
        <div className="p-4 bg-white shadow-lg rounded-xl border border-orange-200 mb-4">
          <h3 className="text-xl font-bold text-orange-600 mb-4 border-b border-orange-100 pb-2">
            Your Vehicles
          </h3>
          
          {vehicles.length > 0 ? (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div key={vehicle._id} className="bg-orange-50 rounded-lg p-4 border border-orange-100 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                    <div>
                      <p className="text-xs font-medium text-orange-600">VEHICLE NUMBER</p>
                      <p className="text-sm font-medium mt-1">{vehicle.number}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-orange-600">MODEL</p>
                      <p className="text-sm font-medium mt-1">{vehicle.model}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-orange-600">COLOR</p>
                      <p className="text-sm font-medium mt-1">{vehicle.color}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-orange-600">YEAR</p>
                      <p className="text-sm font-medium mt-1">{vehicle.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-3">🚲</div>
              <p>No vehicles found. Add your first vehicle to start delivering.</p>
            </div>
          )}
        </div>

        {/* Add Vehicle Form */}
        {!showForm ? (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center mx-auto"
            >
              <span className="mr-2">➕</span>
              Add New Vehicle
            </button>
          </div>
        ) : (
          <div className="p-4 bg-white shadow-lg rounded-xl border border-orange-200">
            <h3 className="text-xl font-bold text-orange-600 mb-4 border-b border-orange-100 pb-2">
              Add New Vehicle
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-3">
                <label className="text-xs font-medium text-orange-600 block mb-1">VEHICLE NUMBER</label>
                <input
                  type="text"
                  name="number"
                  value={vehicleData.number}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  placeholder="e.g., KA-01-AB-1234"
                />
              </div>
              
              <div className="bg-orange-50 rounded-lg p-3">
                <label className="text-xs font-medium text-orange-600 block mb-1">MODEL</label>
                <input
                  type="text"
                  name="model"
                  value={vehicleData.model}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  placeholder="e.g., Honda Activa"
                />
              </div>
              
              <div className="bg-orange-50 rounded-lg p-3">
                <label className="text-xs font-medium text-orange-600 block mb-1">COLOR</label>
                <input
                  type="text"
                  name="color"
                  value={vehicleData.color}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  placeholder="e.g., Black"
                />
              </div>
              
              <div className="bg-orange-50 rounded-lg p-3">
                <label className="text-xs font-medium text-orange-600 block mb-1">YEAR</label>
                <input
                  type="number"
                  name="year"
                  value={vehicleData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  placeholder="e.g., 2022"
                  min="1990"
                  max={new Date().getFullYear()}
                />
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="mr-2">✅</span>
                      Save Vehicle
                    </span>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">❌</span>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
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

export default AddVehicle;