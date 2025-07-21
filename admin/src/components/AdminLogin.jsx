import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/v1/users/login', form);
      // Check if user is admin
      if (res.data?.data?.user?.role === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        navigate('/');
      } else {
        setError('Access denied: Only admin can login.');
        localStorage.removeItem('isAdmin');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
      localStorage.removeItem('isAdmin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#193246] tracking-wide">
          <i className="fas fa-tshirt mr-2 text-5xl text-[#b849b8] mb-4"></i> <br />
          Fashionista Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter admin email"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          {error && <div className="bg-red-100 text-red-700 p-2 rounded text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[#193246] hover:bg-[#1a476c] text-white font-semibold py-2 rounded transition-colors duration-200 shadow"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 