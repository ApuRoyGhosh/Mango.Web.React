import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="bg-blue-600 px-6 py-5 text-white">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Name</p>
              <p className="mt-2 text-xl font-bold text-gray-900">{user?.name || 'Not available'}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Email</p>
              <p className="mt-2 text-xl font-bold text-gray-900 break-all">{user?.email || 'Not available'}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Phone</p>
              <p className="mt-2 text-xl font-bold text-gray-900">{user?.phoneNumber || 'Not provided'}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Role</p>
              <p className="mt-2 text-xl font-bold text-gray-900">
                {Array.isArray(user?.roles)
                    ? user.roles.join(', ')
                    : user?.roles || 'Customer'}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/orders"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              View Orders
            </Link>
            <Link
              to="/products"
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
