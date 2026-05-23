import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CartService from '../services/CartService';

export const Header = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = () => {
    logout();
    setCartCount(0);
    navigate('/');
  };

  useEffect(() => {
    const loadCartCount = async () => {
      try {
        if (!user?.id) {
          setCartCount(0);
          return;
        }
        const resp = await CartService.getCart(user.id);
        if (resp?.isSuccess && resp.result) {
          setCartCount((resp.result.cartDetails && resp.result.cartDetails.length) || 0);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };
    loadCartCount();
  }, [user]);

  const menuLinks = (
    <>
      <Link to="/products" className="block md:inline-block hover:text-blue-200 transition">
        Products
      </Link>

      {isAuthenticated && (
        <>
          <Link to="/cart" className="block md:inline-block hover:text-blue-200 transition">
            🛒 Cart
          </Link>
          <Link to="/orders" className="block md:inline-block hover:text-blue-200 transition">
            My Orders
          </Link>
          {isAdmin() && (
            <>
              <Link
                to="/admin/products"
                className="block md:inline-block hover:text-blue-200 transition"
              >
                Manage Products
              </Link>
              <Link
                to="/admin/orders"
                className="block md:inline-block hover:text-blue-200 transition"
              >
                Manage Orders
              </Link>
              <Link
                to="/admin/coupons"
                className="block md:inline-block hover:text-blue-200 transition"
              >
                Manage Coupons
              </Link>
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-bold text-xl">
            🥭 Mango Store
          </Link>

          <div className="hidden md:flex items-center gap-6">
                {menuLinks}
                <div className="relative">
                  {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="hover:text-blue-200 transition"
                  >
                    {user?.name || 'Account'} ⚙️
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex gap-4">
                  <Link to="/auth/login" className="hover:text-blue-200 transition">
                    Login
                  </Link>
                  <Link to="/auth/register" className="hover:text-blue-200 transition">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-3 space-y-2 border-t border-blue-500">
            {menuLinks}
            <div className="border-t border-blue-500 pt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block hover:text-blue-200 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link to="/cart" className="block hover:text-blue-200 transition" onClick={() => setIsMobileMenuOpen(false)}>
                    🛒 Cart {cartCount > 0 ? `(${cartCount})` : ''}
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="block text-left w-full hover:text-blue-200 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="block hover:text-blue-200 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="block hover:text-blue-200 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
