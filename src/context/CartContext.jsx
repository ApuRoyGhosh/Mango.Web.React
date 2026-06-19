import React, { createContext, useCallback, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import CartService from '../services/CartService';

export const CartContext = createContext({
  cartCount: 0,
  refreshCartCount: async () => {},
  resetCartCount: () => {},
});

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    if (!user?.id) {
      setCartCount(0);
      return;
    }

    try {
      const resp = await CartService.getCart(user.id);
      if (resp?.isSuccess && resp.result) {
        const totalItems = Array.isArray(resp.result.cartDetails)
          ? resp.result.cartDetails.reduce((sum, item) => sum + (item.count || 0), 0)
          : 0;
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch {
      setCartCount(0);
    }
  }, [user]);

  const resetCartCount = useCallback(() => setCartCount(0), []);

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount, resetCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
