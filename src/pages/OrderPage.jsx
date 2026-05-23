import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OrderService from '../services/OrderService';
import useAuth from '../hooks/useAuth';

export const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await OrderService.getOrders(user?.id || '');
      if (response.isSuccess) {
        setOrders(response.result || []);
      } else {
        toast.error(response.message || 'Failed to load orders');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
        >
          Continue Shopping
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No orders yet</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop View - Table */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Shipping To</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.orderHeaderId}
                    className="border-b hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 font-semibold">#{order.orderHeaderId}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(order.orderTime).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.city}, {order.state}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-blue-600">
                      ${order.orderTotal?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/orders/${order.orderHeaderId}`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderHeaderId}
                onClick={() => navigate(`/orders/${order.orderHeaderId}`)}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-lg">Order #{order.orderHeaderId}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.orderTime).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3 pb-3 border-b">
                  <p className="text-sm">
                    <span className="text-gray-600">Shipping to:</span> {order.city}, {order.state}
                  </p>
                  <p className="font-bold text-blue-600">
                    Total: ${order.orderTotal?.toFixed(2)}
                  </p>
                </div>

                <button className="w-full text-blue-600 hover:text-blue-800 font-semibold text-sm">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
