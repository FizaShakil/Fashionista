import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosInstance.get('/api/v1/orders/admin/get-all-orders')
      .then(res => setOrders(res.data.data || []))
      .catch(() => setError('Failed to fetch orders.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter(order => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(searchLower) ||
      order.name?.toLowerCase().includes(searchLower) ||
      order.phone?.toLowerCase().includes(searchLower) ||
      order.email?.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by order id, name, phone, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 w-48"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-10">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-2 text-left">Order ID</th>
                <th className="py-2 px-2 text-left">Customer Name</th>
                <th className="py-2 px-2 text-left">Phone</th>
                <th className="py-2 px-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-blue-50 cursor-pointer"
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  <td className="py-2 px-2 font-mono">{order._id}</td>
                  <td className="py-2 px-2">{order.name}</td>
                  <td className="py-2 px-2">{order.phone}</td>
                  <td className="py-2 px-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-200 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;