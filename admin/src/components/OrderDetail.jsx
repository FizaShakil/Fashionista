import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const statusOptions = ['Pending', 'Delivered', 'Cancelled'];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/api/v1/orders/get-single-order/${id}`)
      .then(res => {
        setOrder(res.data.data);
        setStatus(res.data.data.status);
      })
      .catch(() => setError('Failed to fetch order.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdating(true);
    try {
      await axiosInstance.patch(`/api/v1/orders/update-order-status/${id}`, { status: newStatus });
      setOrder((prev) => ({ ...prev, status: newStatus }));
    } catch {
      setError('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;
  if (!order) return <div className="text-center py-10">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline flex items-center">
        <i className="fas fa-arrow-left mr-2"></i> Back to Orders
      </button>
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <div className="mb-4">
        <div className="mb-2"><span className="font-semibold">Order ID:</span> {order._id}</div>
        <div className="mb-2"><span className="font-semibold">Customer:</span> {order.name}</div>
        <div className="mb-2"><span className="font-semibold">Phone:</span> {order.phone}</div>
        <div className="mb-2"><span className="font-semibold">Email:</span> {order.email}</div>
        <div className="mb-2"><span className="font-semibold">Address:</span> {order.address}</div>
        <div className="mb-2"><span className="font-semibold">Payment:</span> {order.paymentMethod}</div>
        <div className="mb-2"><span className="font-semibold">Total:</span> PKR {order.amount}</div>
        <div className="mb-2 flex items-center gap-2">
          <span className="font-semibold">Status:</span>
          <select
            value={status}
            onChange={handleStatusChange}
            className="border rounded px-2 py-1"
            disabled={updating}
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {updating && <span className="text-xs text-blue-600 ml-2">Updating...</span>}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Products</h3>
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="bg-gray-100">
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
                      className="w-8 h-8 object-cover rounded"
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
  );
};

export default OrderDetail; 