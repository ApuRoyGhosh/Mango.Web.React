import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/OrderService';
import { showSuccessAlert, showErrorAlert } from '../utils/AlertUtils';

const statusOptions = [
  'Pending',
  'Confirmed',
  'Being Prepared',
  'Ready for Pickup',
  'Completed',
  'Cancelled',
];

export const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await OrderService.getOrders();
      if (response.isSuccess) {
        setOrders(response.result || []);
      } else {
        await showErrorAlert('Failed to Load Orders', response.message || 'Failed to load orders');
      }
    } catch (error) {
      await showErrorAlert('Failed to Load Orders', error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await OrderService.updateOrderStatus(orderId, newStatus);
      if (response.isSuccess) {
        await showSuccessAlert('Order Updated', 'Order status updated successfully');
        await loadOrders();
      } else {
        await showErrorAlert('Failed to Update Order', response.message || 'Failed to update order status');
      }
    } catch (error) {
      await showErrorAlert('Error', error.message || 'An error occurred');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-200 text-blue-800';
      case 'being prepared':
        return 'bg-purple-200 text-purple-800';
      case 'ready for pickup':
        return 'bg-cyan-200 text-cyan-800';
      case 'completed':
        return 'bg-green-200 text-green-800';
      case 'cancelled':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Orders</h1>
          <p className="text-gray-600 mt-1">View and update order statuses across the store.</p>
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
        >
          Manage Products
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No orders available yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Order ID</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Total</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Coupon</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Updated</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderHeaderId} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">#{order.orderHeaderId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.name || order.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">${order.orderTotal?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.couponCode || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(order.orderTime).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex flex-col gap-2 items-center">
                      <button
                        onClick={() => navigate(`/orders/${order.orderHeaderId}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded text-xs transition"
                      >
                        View
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderHeaderId, e.target.value)}
                        disabled={updatingOrderId === order.orderHeaderId}
                        className="mt-2 px-2 py-1 border rounded-lg text-xs"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
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

export default AdminOrderPage;
