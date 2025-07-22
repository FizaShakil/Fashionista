import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import Heading from '../Reusable-subComponents/Heading';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get('/api/v1/orders/get-user-orders');
        setOrders(res.data.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch orders. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 md:px-0">
      <div className="max-w-4xl mx-auto">
        <Heading heading="My Orders" />
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6 text-center">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <i className="fas fa-box-open text-4xl mb-4 text-gray-300"></i>
            <p className="text-lg">You have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-8 mt-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-receipt text-blue-600 text-2xl"></i>
                    <span className="font-semibold text-gray-800">Order ID:</span>
                    <span className="text-gray-600 text-sm">{order._id}</span>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[order.status] || 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="mb-2">
                      <i className="fas fa-calendar-alt mr-2 text-gray-400"></i>
                      <span className="text-gray-600 text-sm">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-2">
                      <i className="fas fa-user mr-2 text-gray-400"></i>
                      <span className="text-gray-600 text-sm">{order.name}</span>
                    </div>
                    <div className="mb-2">
                      <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                      <span className="text-gray-600 text-sm">{order.address}</span>
                    </div>
                    <div className="mb-2">
                      <i className="fas fa-phone mr-2 text-gray-400"></i>
                      <span className="text-gray-600 text-sm">{order.phone}</span>
                    </div>
                    <div className="mb-2">
                      <i className="fas fa-credit-card mr-2 text-gray-400"></i>
                      <span className="text-gray-600 text-sm">{order.paymentMethod}</span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <i className="fas fa-money-bill-wave mr-2 text-gray-400"></i>
                      <span className="text-gray-600 text-sm font-semibold">
                        Total: PKR {order.amount}
                      </span>
                    </div>
                    <div className="mb-2">
                      <i className="fas fa-envelope mr-2 text-gray-400"></i>
                      <span className="text-gray-600 text-sm">{order.email}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <i className="fas fa-box mr-2 text-blue-600"></i>Products
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-gray-600 border-b">
                          <th className="py-2 px-2 text-left">Product</th>
                          <th className="py-2 px-2 text-left">Qty</th>
                          <th className="py-2 px-2 text-left">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.products.map((item, idx) => (
                          <tr key={idx} className="border-b last:border-0">
                            <td className="py-2 px-2 flex items-center gap-2">
                              {item.productID?.productImage && (
                                <img
                                  src={item.productID.productImage}
                                  alt={item.productID.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              )}
                              <span>{item.productID?.name || 'Product'}</span>
                            </td>
                            <td className="py-2 px-2">{item.quantity}</td>
                            <td className="py-2 px-2">PKR {item.productID?.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;