import React, { useState, useEffect } from 'react';
import CouponService from '../services/CouponService';
import { CouponDto } from '../models';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '../utils/AlertUtils';

export const AdminCouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    couponId: 0,
    couponCode: '',
    discountAmount: '',
    minAmount: '',
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await CouponService.getAllCoupons();
      if (response.isSuccess) {
        setCoupons(response.result || []);
      } else {
        await showErrorAlert('Failed to Load Coupons', response.message || 'Failed to load coupons');
      }
    } catch (error) {
      await showErrorAlert('Failed to Load Coupons', error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({ couponId: 0, couponCode: '', discountAmount: '', minAmount: '' });
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      couponId: coupon.couponId,
      couponCode: coupon.couponCode,
      discountAmount: coupon.discountAmount?.toString() || '',
      minAmount: coupon.minAmount?.toString() || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({ couponId: 0, couponCode: '', discountAmount: '', minAmount: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.couponCode.trim()) {
      await showErrorAlert('Validation Error', 'Coupon code is required');
      return;
    }
    if (!formData.discountAmount || parseFloat(formData.discountAmount) <= 0) {
      await showErrorAlert('Validation Error', 'Discount amount must be greater than zero');
      return;
    }
    setIsSubmitting(true);
    try {
      const couponDto = new CouponDto(
        formData.couponId,
        formData.couponCode,
        parseFloat(formData.discountAmount),
        parseFloat(formData.minAmount) || 0
      );

      let response;
      if (editingCoupon) {
        response = await CouponService.updateCoupon(couponDto);
      } else {
        response = await CouponService.createCoupon(couponDto);
      }

      if (response.isSuccess) {
        await showSuccessAlert(
          editingCoupon ? 'Coupon Updated' : 'Coupon Created',
          editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!'
        );
        closeModal();
        await loadCoupons();
      } else {
        await showErrorAlert('Failed to Save Coupon', response.message || 'Failed to save coupon');
      }
    } catch (error) {
      await showErrorAlert('Error', error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (couponId) => {
    const confirmed = await showConfirmAlert(
      'Delete Coupon',
      'Are you sure you want to delete this coupon? This action cannot be undone.',
      'Delete',
      'Cancel'
    );

    if (!confirmed) return;

    try {
      const response = await CouponService.deleteCoupon(couponId);
      if (response.isSuccess) {
        await showSuccessAlert('Coupon Deleted', 'Coupon deleted successfully');
        await loadCoupons();
      } else {
        await showErrorAlert('Failed to Delete Coupon', response.message || 'Failed to delete coupon');
      }
    } catch (error) {
      await showErrorAlert('Error', error.message || 'An error occurred');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading coupons...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Coupon Management</h1>
          <p className="text-gray-600 mt-1">Create and update coupons for discounts and promotions.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition"
        >
          + Create Coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No coupons available yet.</p>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Add First Coupon
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Coupon Code</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Discount</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Min Order</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.couponId} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{coupon.couponId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{coupon.couponCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${coupon.discountAmount?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${coupon.minAmount?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.couponId)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleInputChange}
                  placeholder="e.g. SPRING20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Amount *</label>
                <input
                  type="number"
                  name="discountAmount"
                  value={formData.discountAmount}
                  onChange={handleInputChange}
                  placeholder="Enter discount amount"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Minimum Order Amount</label>
                <input
                  type="number"
                  name="minAmount"
                  value={formData.minAmount}
                  onChange={handleInputChange}
                  placeholder="Minimum order total to apply coupon"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouponPage;
