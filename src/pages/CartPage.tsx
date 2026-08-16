import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartService from '../services/CartService';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../utils/AlertUtils';
import { SD } from '../utils/SD';

export const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [updatingQuantity, setUpdatingQuantity] = useState(null);
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      loadCart();
    }
  }, [user]);

  // Save cart to localStorage for faster UX fallback
  const saveCartToStorage = (cartData) => {
    try {
      if (cartData) {
        localStorage.setItem(SD.StorageKeys.Cart, JSON.stringify(cartData));
      }
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error);
    }
  };

  // Load cart from localStorage as fallback
  const loadCartFromStorage = () => {
    try {
      const cached = localStorage.getItem(SD.StorageKeys.Cart);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error);
      return null;
    }
  };

  const loadCart = async () => {
    setIsLoading(true);
    try {
      const response = await CartService.getCart(user.id);
      if (response.isSuccess) {
        setCart(response.result);
        saveCartToStorage(response.result);
        if (response.result?.cartHeader?.couponCode) {
          setAppliedCoupon(response.result.cartHeader.couponCode);
        }
      } else {
        // Try to load from localStorage as fallback
        const cached = loadCartFromStorage();
        if (cached) {
          setCart(cached);
          if (cached?.cartHeader?.couponCode) {
            setAppliedCoupon(cached.cartHeader.couponCode);
          }
        } else {
          await showErrorAlert('Failed to Load Cart', response.message || 'Failed to load cart');
        }
      }
    } catch (error) {
      // Try to load from localStorage as fallback
      const cached = loadCartFromStorage();
      if (cached) {
        setCart(cached);
        if (cached?.cartHeader?.couponCode) {
          setAppliedCoupon(cached.cartHeader.couponCode);
        }
      } else {
        await showErrorAlert('Failed to Load Cart', error.message || 'An error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (cartDetailsId) => {
    try {
      const response = await CartService.removeFromCart(cartDetailsId);
      if (response.isSuccess) {
        await showSuccessAlert('Item Removed', 'Item removed from cart');
        await loadCart();
        await refreshCartCount();
      } else {
        await showErrorAlert('Failed to Remove Item', response.message || 'Failed to remove item');
      }
    } catch (error) {
      await showErrorAlert('Failed to Remove Item', error.message || 'An error occurred');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      await showWarningAlert('Enter Coupon Code', 'Please enter a coupon code');
      return;
    }

    try {
      const response = await CartService.applyPromo(cart, couponCode);
      if (response.isSuccess) {
        setAppliedCoupon(couponCode);
        setCouponCode('');
        await showSuccessAlert('Coupon Applied', 'Coupon applied successfully!');
        loadCart();
      } else {
        await showErrorAlert('Failed to Apply Coupon', response.message || 'Failed to apply coupon');
      }
    } catch (error) {
      await showErrorAlert('Failed to Apply Coupon', error.message || 'An error occurred');
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      const response = await CartService.removeCoupon(cart);
      if (response.isSuccess) {
        setAppliedCoupon('');
        await showSuccessAlert('Coupon Removed', 'Coupon removed successfully');
        loadCart();
      } else {
        await showErrorAlert('Failed to Remove Coupon', response.message || 'Failed to remove coupon');
      }
    } catch (error) {
      await showErrorAlert('Failed to Remove Coupon', error.message || 'An error occurred');
    }
  };

  // Handle quantity increase/decrease with immutable state updates
  const handleQuantityChange = async (cartDetailsId, delta) => {
    if (!cart) return;

    // Find the item and calculate new quantity
    const itemIndex = cart.cartDetails.findIndex(item => item.cartDetailsId === cartDetailsId);
    if (itemIndex === -1) return;

    const currentItem = cart.cartDetails[itemIndex];
    const newQuantity = Math.max(1, currentItem.count + delta);

    // Don't update if quantity is same
    if (newQuantity === currentItem.count) return;

    setUpdatingQuantity(cartDetailsId);
    try {
      // Create updated cart with new quantity
      const updatedDetails = cart.cartDetails.map((item, idx) =>
        idx === itemIndex ? { ...item, count: newQuantity } : item
      );

      // Recalculate totals
      const subtotal = updatedDetails.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.count,
        0
      );

      const updatedCart = {
        ...cart,
        cartDetails: updatedDetails,
        cartHeader: {
          ...cart.cartHeader,
          cartTotal: subtotal
        }
      };

      // Optimistically update UI
      setCart(updatedCart);
      saveCartToStorage(updatedCart);

      // Sync with backend
      const response = await CartService.updateCart(updatedCart);
      if (response.isSuccess) {
        // Update header cart count
        await refreshCartCount();
      } else {
        // Rollback on failure
        setCart(cart);
        await showErrorAlert('Failed to Update Quantity', response.message || 'Failed to update item quantity');
      }
    } catch (error) {
      // Rollback on error
      setCart(cart);
      await showErrorAlert('Failed to Update Quantity', error.message || 'An error occurred');
    } finally {
      setUpdatingQuantity(null);
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
                  <div className="text-sm text-gray-600 mb-2">
                    ${item.product?.price?.toFixed(2)} each
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => handleQuantityChange(item.cartDetailsId, -1)}
                      disabled={item.count <= 1 || updatingQuantity === item.cartDetailsId}
                      className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 font-bold w-8 h-8 rounded transition"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.count}
                      min="1"
                      disabled
                      className="w-13 text-center border border-gray-300 rounded px-2 py-1 bg-white"
                      aria-label="Item quantity"
                    />
                    <button
                      onClick={() => handleQuantityChange(item.cartDetailsId, 1)}
                      disabled={updatingQuantity === item.cartDetailsId}
                      className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 font-bold w-8 h-8 rounded transition"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-600">
                      ${(item.product?.price * item.count)?.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.cartDetailsId)}
                      className="text-red-600 hover:text-red-800 font-bold text-lg"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}          </div>
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
