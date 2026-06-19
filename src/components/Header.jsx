import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import './Header.css';

export const Header = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { cartCount, refreshCartCount, resetCartCount } = useCart();

  const handleLogout = () => {
    logout();
    resetCartCount();
    navigate('/');
  };

  const cartBadgeText = cartCount > 99 ? '99+' : cartCount;

  const menuLinks = (
    <>
      <Link to="/products" className="header-cart-link" onClick={() => setIsMobileMenuOpen(false)}>
        Products
      </Link>

      {isAuthenticated && (
        <>
          <Link
            to="/cart"
            className="header-cart-link"
            aria-label="View Cart"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="header-cart-icon">
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h13m-6-5v5"
                />
              </svg>
              {cartCount > 0 && (
                <span className="header-cart-badge">
                  {cartBadgeText}
                </span>
              )}
            </span>
            <span className="header-cart-label">Cart</span>
          </Link>
          <Link to="/orders" className="header-cart-link" onClick={() => setIsMobileMenuOpen(false)}>
            My Orders
          </Link>
          {isAdmin() && (
            <>
              <Link
                to="/admin/products"
                className="header-cart-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Manage Products
              </Link>
              <Link
                to="/admin/orders"
                className="header-cart-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Manage Orders
              </Link>
              <Link
                to="/admin/coupons"
                className="header-cart-link"
                onClick={() => setIsMobileMenuOpen(false)}
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
                    className="header-cart-link flex items-center gap-1"
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
                  <Link to="/auth/login" className="header-cart-link">
                    Login
                  </Link>
                  <Link to="/auth/register" className="header-cart-link">
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
          <div className="md:hidden py-3 border-t border-blue-500">
            <div className="space-y-2">
              {menuLinks}
            </div>
            <div className="mt-4 border-t border-blue-500 pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="header-mobile-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="header-mobile-link text-left w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="header-mobile-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="header-mobile-link"
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
