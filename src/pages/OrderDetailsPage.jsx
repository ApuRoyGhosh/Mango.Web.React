import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OrderService from '../services/OrderService';

export const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setIsLoading(true);
    try {
      const response = await OrderService.getOrderById(orderId);
      if (response.isSuccess) {
        setOrder(response.result);
      } else {
        toast.error(response.message || 'Failed to load order details');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Order not found</p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
        >
          Back to Orders
        </button>
      </div>
    );
  }

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/orders')}
        className="mb-6 text-blue-600 hover:text-blue-800 font-semibold"
      >
        ← Back to Orders
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Order Header Info */}
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Order ID</p>
            <p className="text-2xl font-bold mb-4">#{order.orderHeaderId}</p>

            <p className="text-gray-600 text-sm font-semibold mb-1">Order Date</p>
            <p className="text-lg mb-4">
              {new Date(order.orderTime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>

            <p className="text-gray-600 text-sm font-semibold mb-1">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          {/* Order Total */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span>${(order.orderTotal + order.discount)?.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-${order.discount?.toFixed(2)}</span>
                </div>
              )}
              {order.couponCode && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coupon:</span>
                  <span className="font-semibold">{order.couponCode}</span>
                </div>
              )}
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">${order.orderTotal?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-4">Order Items</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="hidden md:grid md:grid-cols-5 gap-4 bg-gray-200 px-4 py-3 font-semibold">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            <div className="divide-y">
              {order.orderDetails?.map((item) => (
                <div key={item.orderDetailsId} className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/80x80'}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-xs text-gray-600">{item.categoryName}</p>
                    </div>
                  </div>
                  <p>${item.price?.toFixed(2)}</p>
                  <p className="font-semibold">{item.count}</p>
                  <p className="font-bold text-blue-600">
                    ${(item.price * item.count)?.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Shipping Address</h3>
            <p className="text-sm">
              {order.name}
              <br />
              {order.street}
              <br />
              {order.city}, {order.state} {order.postalCode}
              <br />
              {order.phoneNumber}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Contact Information</h3>
            <p className="text-sm">
              Email: {order.email}
              <br />
              Phone: {order.phone}
            </p>
            {order.stripePaymentIntentId && (
              <p className="text-xs text-gray-600 mt-3">
                Payment ID: {order.stripePaymentIntentId}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {order.status?.toLowerCase() === 'pending' && (
          <button
            onClick={() => navigate(`/payment/${order.orderHeaderId}`)}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition"
          >
            Go to Payment
          </button>
        )}
        <button
          onClick={() => navigate('/orders')}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
