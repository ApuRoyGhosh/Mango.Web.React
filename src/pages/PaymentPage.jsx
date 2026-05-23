import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import OrderService from '../services/OrderService';

export const PaymentPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
    }
  }, [orderId]);

  const loadOrder = async (id) => {
    setIsLoading(true);
    try {
      const response = await OrderService.getOrderById(Number(id));
      if (response.isSuccess) {
        setOrder(response.result);
      } else {
        toast.error(response.message || 'Failed to load order');
        navigate('/orders');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
      navigate('/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidatePayment = async () => {
    if (!order) return;
    setIsValidating(true);
    try {
      const response = await OrderService.validateStripe(order.orderHeaderId);
      if (response.isSuccess) {
        toast.success('Payment validated successfully');
        setOrder(response.result);
      } else {
        toast.error(response.message || 'Payment validation failed');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred during payment validation');
    } finally {
      setIsValidating(false);
    }
  };

  const handleCreateStripeSession = async () => {
    if (!order) return;
    setIsCreatingSession(true);

    try {
      const approvedUrl = `${window.location.origin}/orders/${order.orderHeaderId}`;
      const cancelUrl = `${window.location.origin}/orders/${order.orderHeaderId}`;

      const response = await OrderService.createStripeSession(order, approvedUrl, cancelUrl);
      if (response.isSuccess && response.result?.stripeSessionUrl) {
        window.location.href = response.result.stripeSessionUrl;
      } else {
        toast.error(response.message || 'Unable to create payment session');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while creating payment session');
    } finally {
      setIsCreatingSession(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading payment details...</div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Payment</h1>
          <p className="text-gray-600 mt-1">Review payment status and validate the order.</p>
        </div>
        <button
          onClick={() => navigate(`/orders/${order.orderHeaderId}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
        >
          Back to Order
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-600">Order ID</p>
            <p className="mt-1 text-lg font-bold">#{order.orderHeaderId}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Status</p>
            <p className="mt-1 text-lg font-semibold text-blue-700">{order.status}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Customer</p>
            <p className="mt-1 text-lg">{order.name || order.email}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Total</p>
            <p className="mt-1 text-lg font-bold">${order.orderTotal?.toFixed(2)}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Order Details</h2>
          <div className="space-y-2">
            {order.orderDetails?.map((item) => (
              <div key={item.productId} className="border rounded-lg p-3">
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <p className="font-semibold">{item.product?.name || item.productName || 'Product'}</p>
                    <p className="text-sm text-gray-600">Qty: {item.count}</p>
                  </div>
                  <p className="font-semibold">${item.price?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-600">Shipping Address</p>
            <p className="mt-1">{order.street}, {order.city}, {order.state}, {order.postalCode}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Coupon</p>
            <p className="mt-1">{order.couponCode || 'None'}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Payment Intent ID</p>
            <p className="font-medium">{order.paymentIntentId || 'Not available'}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleCreateStripeSession}
              disabled={isCreatingSession || order.status?.toLowerCase() === 'completed' || order.status?.toLowerCase() === 'cancelled'}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded transition w-full sm:w-auto"
            >
              {isCreatingSession ? 'Creating session...' : 'Create Stripe Payment'}
            </button>
            <button
              onClick={handleValidatePayment}
              disabled={isValidating || order.status?.toLowerCase() === 'completed'}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded transition w-full sm:w-auto"
            >
              {isValidating ? 'Validating...' : order.status?.toLowerCase() === 'completed' ? 'Already Completed' : 'Validate Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
