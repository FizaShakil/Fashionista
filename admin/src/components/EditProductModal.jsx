import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

const EditProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: product.name || '',
    productUniqueID: product.productUniqueID || '',
    description: product.description || '',
    price: product.price || '',
    gender: product.gender || '',
    newArrival: product.newArrival || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.patch('/api/v1/products/update-product-details', {
        ...form,
        productUniqueID: product.productUniqueID, // ensure unique ID is sent
      });
      onSave(res.data.data);
      onClose();
    } catch (err) {
      setError('Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
        <h2 className="text-xl font-bold mb-6">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Product Unique ID</label>
            <input
              type="text"
              name="productUniqueID"
              value={form.productUniqueID}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-1">Category</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              name="newArrival"
              checked={form.newArrival}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">Mark as New Arrival</label>
          </div>
          {error && <div className="text-red-600 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors duration-200 shadow"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal; 