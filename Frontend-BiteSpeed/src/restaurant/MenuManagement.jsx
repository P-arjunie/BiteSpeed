/*
import React, { useEffect, useState } from "react";
import RestaurantDashboardSidebar from "../components/RestaurantDashboardSidebar";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "", image: null });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("restaurantToken");
      if (!token) return setError("No token found. Please log in again.");
      const res = await fetch("http://localhost:5000/api/restaurant/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRestaurantId(data._id);
        fetchMenuItems(data._id);
      } else {
        setError("Unable to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  const fetchMenuItems = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/menu/${id}`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      setError("Failed to load menu items.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("restaurantToken");
    const form = new FormData();
    form.append("restaurantId", restaurantId);
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));

    try {
      const url = isEditing
        ? `http://localhost:5000/api/menu/${editingItemId}`
        : "http://localhost:5000/api/menu";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        setFormData({ name: "", description: "", price: "", category: "", image: null });
        fetchMenuItems(restaurantId);
        setSuccessMessage(isEditing ? "✅ Item updated successfully!" : "✅ Item added successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          setIsModalOpen(false);
        }, 2000);
        setIsEditing(false);
        setEditingItemId(null);
      } else {
        setError(data.message || "Error occurred");
      }
    } catch (err) {
      setError("Error saving item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const token = localStorage.getItem("restaurantToken");
    try {
      const res = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMenuItems(menuItems.filter((item) => item._id !== id));
      } else {
        setError("Failed to delete item");
      }
    } catch (err) {
      setError("Delete request failed");
    }
  };

  const toggleAvailability = async (item) => {
    const token = localStorage.getItem("restaurantToken");
    try {
      const res = await fetch(`http://localhost:5000/api/menu/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      const updated = await res.json();
      if (res.ok) {
        setMenuItems((prev) =>
          prev.map((i) => (i._id === item._id ? updated.updatedItem : i))
        );
      }
    } catch (err) {
      setError("Availability update failed");
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditingItemId(item._id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: null,
    });
    setIsModalOpen(true);
  };

  const filteredItems = categoryFilter === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === categoryFilter);

  const uniqueCategories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="flex">
      <RestaurantDashboardSidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">🍽️ Menu Management</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-600 font-semibold mb-4">{successMessage}</p>}

        <button
          onClick={() => {
            setIsEditing(false);
            setEditingItemId(null);
            setFormData({ name: "", description: "", price: "", category: "", image: null });
            setIsModalOpen(true);
          }}
          className="mb-6 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-md"
        >
          <FaPlus /> Add New Item
        </button>

        <div className="mb-4">
          <label className="font-semibold mr-2">Filter by Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="All">All</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
              <Dialog.Title className="text-xl font-semibold mb-4">
                {isEditing ? "✏️ Edit Menu Item" : "➕ Add Menu Item"}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} required className="w-full border p-2 rounded" />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded" />
                <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required className="w-full border p-2 rounded" />
                <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} required className="w-full border p-2 rounded" />
                <input type="file" name="image" accept="image/*" onChange={handleInputChange} className="w-full" />
                <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
                  {loading ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update Item" : "Add Item"}
                </button>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>

        <div className="bg-white p-4 shadow rounded overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">📋 View All Items</h2>
          {filteredItems.length === 0 ? (
            <p>No items found.</p>
          ) : (
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Image</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Available</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-yellow-50">
                    <td className="p-2">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-20 w-20 object-cover rounded" />
                      ) : "No Image"}
                    </td>
                    <td className="p-2 font-medium">{item.name}</td>
                    <td className="p-2 text-gray-600">{item.description}</td>
                    <td className="p-2">Rs. {Number(item.price).toFixed(2)}</td>
                    <td className="p-2">{item.category}</td>
                    <td className="p-2">
                      <div
                        onClick={() => toggleAvailability(item)}
                        className={`relative w-12 h-6 cursor-pointer rounded-full transition-colors duration-300 ${
                          item.isAvailable ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                            item.isAvailable ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </td>
                    <td className="p-2 flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 text-xl shadow-sm"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 text-xl shadow-sm"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
*/


/*
import React, { useEffect, useState } from "react";
import RestaurantDashboardSidebar from "../components/RestaurantDashboardSidebar";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "", image: null });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("restaurantToken");
      if (!token) return setError("No token found. Please log in again.");
      const res = await fetch("https://restaurant-management-service.onrender.com/api/restaurant/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRestaurantId(data._id);
        fetchMenuItems(data._id);
      } else {
        setError("Unable to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  const fetchMenuItems = async (id) => {
    try {
      const res = await fetch(`https://restaurant-management-service.onrender.com/api/menu/${id}`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      setError("Failed to load menu items.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("restaurantToken");
    const form = new FormData();
    form.append("restaurantId", restaurantId);
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));

    try {
      const url = isEditing
        ? `https://restaurant-management-service.onrender.com/api/menu/${editingItemId}`
        : "https://restaurant-management-service.onrender.com/api/menu";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        setFormData({ name: "", description: "", price: "", category: "", image: null });
        fetchMenuItems(restaurantId);
        setSuccessMessage(isEditing ? "✅ Item updated successfully!" : "✅ Item added successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          setIsModalOpen(false);
        }, 2000);
        setIsEditing(false);
        setEditingItemId(null);
      } else {
        setError(data.message || "Error occurred");
      }
    } catch (err) {
      setError("Error saving item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const token = localStorage.getItem("restaurantToken");
    try {
      const res = await fetch(`https://restaurant-management-service.onrender.com/api/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMenuItems(menuItems.filter((item) => item._id !== id));
      } else {
        setError("Failed to delete item");
      }
    } catch (err) {
      setError("Delete request failed");
    }
  };

  const toggleAvailability = async (item) => {
    const token = localStorage.getItem("restaurantToken");
    try {
      const res = await fetch(`https://restaurant-management-service.onrender.com/api/menu/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      const updated = await res.json();
      if (res.ok) {
        setMenuItems((prev) =>
          prev.map((i) => (i._id === item._id ? updated.updatedItem : i))
        );
      }
    } catch (err) {
      setError("Availability update failed");
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditingItemId(item._id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: null,
    });
    setIsModalOpen(true);
  };

  const filteredItems = categoryFilter === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === categoryFilter);

  const uniqueCategories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="flex">
      <RestaurantDashboardSidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">🍽️ Menu Management</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-600 font-semibold mb-4">{successMessage}</p>}

        <button
          onClick={() => {
            setIsEditing(false);
            setEditingItemId(null);
            setFormData({ name: "", description: "", price: "", category: "", image: null });
            setIsModalOpen(true);
          }}
          className="mb-6 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-md"
        >
          <FaPlus /> Add New Item
        </button>

        <div className="mb-4">
          <label className="font-semibold mr-2">Filter by Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="All">All</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
              <Dialog.Title className="text-xl font-semibold mb-4">
                {isEditing ? "✏️ Edit Menu Item" : "➕ Add Menu Item"}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} required className="w-full border p-2 rounded" />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded" />
                <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required className="w-full border p-2 rounded" />
                <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} required className="w-full border p-2 rounded" />
                <input type="file" name="image" accept="image/*" onChange={handleInputChange} className="w-full" />
                <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
                  {loading ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update Item" : "Add Item"}
                </button>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>

        <div className="bg-white p-4 shadow rounded overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">📋 View All Items</h2>
          {filteredItems.length === 0 ? (
            <p>No items found.</p>
          ) : (
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Image</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Available</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-yellow-50">
                    <td className="p-2">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-20 w-20 object-cover rounded" />
                      ) : "No Image"}
                    </td>
                    <td className="p-2 font-medium">{item.name}</td>
                    <td className="p-2 text-gray-600">{item.description}</td>
                    <td className="p-2">Rs. {Number(item.price).toFixed(2)}</td>
                    <td className="p-2">{item.category}</td>
                    <td className="p-2">
                      <div
                        onClick={() => toggleAvailability(item)}
                        className={`relative w-12 h-6 cursor-pointer rounded-full transition-colors duration-300 ${
                          item.isAvailable ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                            item.isAvailable ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </td>
                    <td className="p-2 flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 text-xl shadow-sm"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 text-xl shadow-sm"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
*/


//after ui changes
import React, { useEffect, useState } from "react";
import RestaurantDashboardSidebar from "../components/RestaurantDashboardSidebar";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import food1 from '../assets/food1.jpg';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "", image: null });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("restaurantToken");
      if (!token) return setError("No token found. Please log in again.");
      const res = await fetch("https://restaurant-management-service.onrender.com/api/restaurant/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRestaurantId(data._id);
        fetchMenuItems(data._id);
      } else {
        setError("Unable to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  const fetchMenuItems = async (id) => {
    try {
      const res = await fetch(`https://restaurant-management-service.onrender.com/api/menu/${id}`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      setError("Failed to load menu items.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("restaurantToken");
    const form = new FormData();
    form.append("restaurantId", restaurantId);
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));

    try {
      const url = isEditing
        ? `https://restaurant-management-service.onrender.com/api/menu/${editingItemId}`
        : "https://restaurant-management-service.onrender.com/api/menu";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        setFormData({ name: "", description: "", price: "", category: "", image: null });
        fetchMenuItems(restaurantId);
        setSuccessMessage(isEditing ? "✅ Item updated successfully!" : "✅ Item added successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          setIsModalOpen(false);
        }, 2000);
        setIsEditing(false);
        setEditingItemId(null);
      } else {
        setError(data.message || "Error occurred");
      }
    } catch (err) {
      setError("Error saving item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const token = localStorage.getItem("restaurantToken");
    try {
      const res = await fetch(`https://restaurant-management-service.onrender.com/api/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMenuItems(menuItems.filter((item) => item._id !== id));
      } else {
        setError("Failed to delete item");
      }
    } catch (err) {
      setError("Delete request failed");
    }
  };

  const toggleAvailability = async (item) => {
    const token = localStorage.getItem("restaurantToken");
    try {
      const res = await fetch(`https://restaurant-management-service.onrender.com/api/menu/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      const updated = await res.json();
      if (res.ok) {
        setMenuItems((prev) =>
          prev.map((i) => (i._id === item._id ? updated.updatedItem : i))
        );
      }
    } catch (err) {
      setError("Availability update failed");
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditingItemId(item._id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: null,
    });
    setIsModalOpen(true);
  };

  const filteredItems = categoryFilter === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === categoryFilter);

  const uniqueCategories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="flex">
      <RestaurantDashboardSidebar />
      <div className="flex-1 relative">
        {/* Background image overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none" 
          style={{ backgroundImage: `url(${food1})` }}
        ></div>
        
        {/* Main content with z-index */}
        <div className="relative z-10 p-6">
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-2">🍽️</span>
            <h1 className="text-3xl font-bold">Menu Management</h1>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {successMessage && <p className="text-green-600 font-semibold mb-4">{successMessage}</p>}

          <button
            onClick={() => {
              setIsEditing(false);
              setEditingItemId(null);
              setFormData({ name: "", description: "", price: "", category: "", image: null });
              setIsModalOpen(true);
            }}
            className="mb-6 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-md"
          >
            <FaPlus /> Add New Item
          </button>

          <div className="mb-4">
            <label className="font-semibold mr-2">Filter by Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="All">All</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="bg-white shadow rounded">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">📋 View All Items</h2>
            </div>
            
            {filteredItems.length === 0 ? (
              <p className="p-4">No items found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Image</th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-left">Price</th>
                      <th className="p-2 text-left">Category</th>
                      <th className="p-2 text-left">Available</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item._id} className="border-b hover:bg-yellow-50">
                        <td className="p-2">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded" />
                          ) : "No Image"}
                        </td>
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 text-gray-600">{item.description}</td>
                        <td className="p-2">Rs. {Number(item.price).toFixed(2)}</td>
                        <td className="p-2">{item.category}</td>
                        <td className="p-2">
                          <div
                            onClick={() => toggleAvailability(item)}
                            className={`relative w-12 h-6 cursor-pointer rounded-full transition-colors duration-300 ${
                              item.isAvailable ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                item.isAvailable ? "translate-x-6" : "translate-x-0"
                              }`}
                            ></div>
                          </div>
                        </td>
                        <td className="p-2 flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 text-lg"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 text-lg"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
            <Dialog.Title className="text-xl font-semibold mb-4">
              {isEditing ? "✏️ Edit Menu Item" : "➕ Add Menu Item"}
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} required className="w-full border p-2 rounded" />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded" />
              <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required className="w-full border p-2 rounded" />
              <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} required className="w-full border p-2 rounded" />
              <input type="file" name="image" accept="image/*" onChange={handleInputChange} className="w-full" />
              <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
                {loading ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update Item" : "Add Item"}
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MenuManagement;
