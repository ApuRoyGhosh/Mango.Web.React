import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Homepage Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 p-8 shadow-xl overflow-hidden">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/90 font-semibold mb-2">
                Fresh mango deals
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Sweet savings on every order
              </h2>
              <p className="mt-3 max-w-2xl text-white/90">
                Enjoy fast delivery, premium tropical fruit, and special pricing for a limited time.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-white text-blue-700 font-semibold px-6 py-3 shadow-lg hover:bg-slate-100 transition"
            >
              Shop seasonal fruits
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 text-white/95">
              <p className="text-sm uppercase tracking-[0.24em]">Fast Delivery</p>
              <p className="mt-2 font-semibold">2-3 day shipping</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-white/95">
              <p className="text-sm uppercase tracking-[0.24em]">Always Fresh</p>
              <p className="mt-2 font-semibold">Hand-selected fruit</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-white/95">
              <p className="text-sm uppercase tracking-[0.24em]">Trusted Quality</p>
              <p className="mt-2 font-semibold">Top-rated produce</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to 🥭 Mango StoreSs</h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover the finest selection of mangoes and tropical fruits
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
        >
          Shop Now
        </Link>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-bold text-xl mb-2">Fresh Quality</h3>
              <p className="text-gray-600">
                All our fruits are hand-selected and shipped fresh from the farm
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-bold text-xl mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable shipping to your doorstep anywhere
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-bold text-xl mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Competitive pricing with regular discounts and offers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8">Browse our collection and find your favorite fruits</p>
          <Link
            to="/products"
            className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
          >
            Explore Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
