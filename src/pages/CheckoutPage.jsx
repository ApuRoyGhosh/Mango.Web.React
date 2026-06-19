import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartService from '../services/CartService';
import OrderService from '../services/OrderService';
import { CartDto, CartHeaderDto, CartDetailsDto } from '../models';
import useAuth from '../hooks/useAuth';
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../utils/AlertUtils';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
  });

  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    setIsLoading(true);
    try {
      const response = await CartService.getCart(user.id);
      if (response.isSuccess) {
        if (!response.result?.cartDetails || response.result.cartDetails.length === 0) {
          await showWarningAlert('Cart Empty', 'Your cart is empty');
          navigate('/products');
          return;
        }
        setCart(response.result);
      } else {
        await showErrorAlert('Failed to Load Cart', response.message || 'Failed to load cart');
        navigate('/cart');
      }
    } catch (error) {
      await showErrorAlert('Error', error.message || 'An error occurred');
      navigate('/cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      await showErrorAlert('Validation Error', 'Name is required');
      return;
    }
    if (!formData.email.trim()) {
      await showErrorAlert('Validation Error', 'Email is required');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      await showErrorAlert('Validation Error', 'Phone number is required');
      return;
    }
    if (!formData.street.trim()) {
      await showErrorAlert('Validation Error', 'Street address is required');
      return;
    }
    if (!formData.city.trim()) {
      await showErrorAlert('Validation Error', 'City is required');
      return;
    }
    if (!formData.state.trim()) {
      await showErrorAlert('Validation Error', 'State is required');
      return;
    }
    if (!formData.postalCode.trim()) {
      await showErrorAlert('Validation Error', 'Postal code is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const cartHeader = new CartHeaderDto(
        cart.cartHeader.cartHeaderId || 0,
        user.id,
        cart.cartHeader.couponCode || '',
        cart.cartHeader.discount || 0,
        cart.cartHeader.cartTotal || 0,
        formData.name,
        formData.phoneNumber,
        formData.email
      );

      const cartDetails = cart.cartDetails.map((item) =>
        new CartDetailsDto(
          item.cartDetailsId,
          item.cartHeaderId,
          item.productId,
          item.product,
          item.count
        )
      );

      const cartDto = new CartDto(cartHeader, cartDetails);
      const response = await OrderService.createOrder(cartDto);

      if (response.isSuccess) {
        await showSuccessAlert('Order Placed Successfully', 'Your order has been placed successfully!');
        // Redirect to order details page
        navigate(`/orders/${response.result.orderHeaderId}`);
      } else {
        await showErrorAlert('Failed to Place Order', response.message || 'Failed to place order');
      }
    } catch (error) {
      await showErrorAlert('Error', error.message || 'An error occurred while placing the order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading checkout...</div>;
  }

  if (!cart || !cart.cartDetails || cart.cartDetails.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600 mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate('/cart')}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  const total = cart.cartHeader.cartTotal - (cart.cartHeader.discount || 0);
  //console.log('CheckoutPage - Cart:', cart);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {/* Contact Information */}
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Shipping Address */}
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Enter street address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Enter postal code"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
                disabled={isSubmitting}
              >
                Back to Cart
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="font-bold text-xl mb-4">Order Summary</h2>

            {/* Items */}
            <div className="mb-4 max-h-64 overflow-y-auto">
              <h3 className="font-semibold text-sm mb-3">Items</h3>
              <div className="space-y-2">
                {cart.cartDetails?.map((item) => (
                  <div key={item.cartDetailsId} className="flex justify-between text-sm border-b pb-2">
                    <span>
                      {item.product?.name} x{item.count}
                    </span>
                    <span>${(item.product?.price * item.count)?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span>${(cart.cartHeader.cartTotal + (cart.cartHeader.discount || 0))?.toFixed(2)}</span>
              </div>
              {cart.cartHeader.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-${cart.cartHeader.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span className="text-blue-600">${total?.toFixed(2)}</span>
              </div>
            </div>

            {cart.cartHeader.couponCode && (
              <div className="bg-green-100 border border-green-400 rounded p-3 text-sm">
                <p>
                  <span className="font-semibold">Coupon:</span> {cart.cartHeader.couponCode}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
