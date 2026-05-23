import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CartService from '../services/CartService';
import useAuth from '../hooks/useAuth';

export const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      loadCart();
    }
  }, [user]);

  const loadCart = async () => {
    setIsLoading(true);
    try {
      const response = await CartService.getCart(user.id);
      if (response.isSuccess) {
        setCart(response.result);
        if (response.result?.cartHeader?.couponCode) {
          setAppliedCoupon(response.result.cartHeader.couponCode);
        }
      } else {
        toast.error(response.message || 'Failed to load cart');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (cartDetailsId) => {
    try {
      const response = await CartService.removeFromCart(cartDetailsId);
      if (response.isSuccess) {
        toast.success('Item removed from cart');
        loadCart();
      } else {
        toast.error(response.message || 'Failed to remove item');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warning('Please enter a coupon code');
      return;
    }

    try {
      const response = await CartService.applyPromo(cart, couponCode);
      if (response.isSuccess) {
        setAppliedCoupon(couponCode);
        setCouponCode('');
        toast.success('Coupon applied!');
        loadCart();
      } else {
        toast.error(response.message || 'Failed to apply coupon');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      const response = await CartService.removeCoupon(cart);
      if (response.isSuccess) {
        setAppliedCoupon('');
        toast.success('Coupon removed');
        loadCart();
      } else {
        toast.error(response.message || 'Failed to remove coupon');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading cart...</div>;
  }

  if (!cart || cart.cartDetails?.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-600">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {cart.cartDetails?.map((item) => (
              <div
                key={item.cartDetailsId}
                className="flex gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50"
              >
                <img
                  src={item.product?.imageUrl || 'https://via.placeholder.com/100x100'}
                  alt={item.product?.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-bold">{item.product?.name}</h3>
                  <p className="text-gray-600 text-sm">{item.product?.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-blue-600">
                      ${(item.product?.price * item.count)?.toFixed(2)}
                    </span>
                    <span className="text-sm">Qty: {item.count}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.cartDetailsId)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="font-bold text-xl mb-4">Order Summary</h2>

          {/* Coupon Section */}
          <div className="mb-4">
            {appliedCoupon ? (
              <div className="bg-green-100 border border-green-400 rounded p-3 mb-3">
                <p className="text-sm">
                  <span className="font-bold">Coupon Applied:</span> {appliedCoupon}
                </p>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs text-red-600 hover:text-red-800 mt-1"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${(cart.cartHeader.cartTotal || 0)?.toFixed(2)}</span>
            </div>
            {cart.cartHeader.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${cart.cartHeader.discount?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${((cart.cartHeader.cartTotal - (cart.cartHeader.discount || 0)) || 0)?.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
