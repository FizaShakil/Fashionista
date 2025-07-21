import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axiosInstance.get('/api/v1/dashboard/total-users'),
          axiosInstance.get('/api/v1/dashboard/total-products'),
          axiosInstance.get('/api/v1/dashboard/total-orders'),
        ]);
        setStats({
          users: usersRes.data.data.totalUsers,
          products: productsRes.data.data.totalProducts,
          orders: ordersRes.data.data.totalOrders,
        });
      } catch (err) {
        setError('Failed to fetch dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-10">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-100 rounded-lg p-6 flex flex-col items-center shadow">
            <i className="fas fa-users text-3xl text-blue-600 mb-2"></i>
            <div className="text-3xl font-bold text-blue-800">{stats.users}</div>
            <div className="text-gray-700 mt-1">Total Users</div>
          </div>
          <div className="bg-purple-100 rounded-lg p-6 flex flex-col items-center shadow">
            <i className="fas fa-box text-3xl text-purple-600 mb-2"></i>
            <div className="text-3xl font-bold text-purple-800">{stats.products}</div>
            <div className="text-gray-700 mt-1">Total Products</div>
          </div>
          <div className="bg-green-100 rounded-lg p-6 flex flex-col items-center shadow">
            <i className="fas fa-shopping-cart text-3xl text-green-600 mb-2"></i>
            <div className="text-3xl font-bold text-green-800">{stats.orders}</div>
            <div className="text-gray-700 mt-1">Total Orders</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 