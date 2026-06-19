import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductService from '../services/ProductService';
import { ProductDto } from '../models';
import { showSuccessAlert, showErrorAlert } from '../utils/AlertUtils';

export const AddProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    categoryName: '',
    imageUrl: '',
    image: null,
  });

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    setIsLoadingProduct(true);
    try {
      const response = await ProductService.getProductById(productId);
      if (response.isSuccess && response.result) {
        const product = response.result;
        setFormData({
          name: product.name || '',
          price: product.price?.toString() || '',
          description: product.description || '',
          categoryName: product.categoryName || '',
          imageUrl: product.imageUrl || '',
          image: null,
        });
        if (product.imageUrl) {
          setImagePreview(product.imageUrl);
        }
      } else {
        await showErrorAlert('Product Load Failed', response.message || 'Unable to load product.');
        navigate('/admin/products');
      }
    } catch (error) {
      await showErrorAlert('Product Load Failed', error.message || 'Unable to load product.');
      navigate('/admin/products');
    } finally {
      setIsLoadingProduct(false);
    }
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // File change handler with preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Generate image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: '',
        }));
      }
    }
  };

  // Remove image preview
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price greater than 0 is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category is required';
    }

    if (!formData.image && !formData.imageUrl) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const productDto = new ProductDto(
        isEditMode ? parseInt(productId, 10) : 0,
        formData.name,
        parseFloat(formData.price),
        formData.description,
        formData.categoryName,
        formData.imageUrl,
        formData.image
      );

      const response = isEditMode
        ? await ProductService.updateProduct(productDto)
        : await ProductService.createProduct(productDto);

      if (response.isSuccess) {
        await showSuccessAlert(
          isEditMode ? 'Product Updated Successfully' : 'Product Added Successfully',
          isEditMode
            ? 'The product has been updated in the system.'
            : 'The product has been added to the system.'
        );
        navigate('/admin/products');
      } else {
        await showErrorAlert(
          isEditMode ? 'Failed to Update Product' : 'Failed to Add Product',
          response.message || (isEditMode ? 'Failed to update product' : 'Failed to add product')
        );
      }
    } catch (error) {
      await showErrorAlert(
        isEditMode ? 'Failed to Update Product' : 'Failed to Add Product',
        error.message || 'An error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel and go back
  const handleCancel = () => {
    navigate('/admin/products');
  };

  if (isEditMode && isLoadingProduct) {
    return <div className="text-center py-12">Loading product details...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600">
            {isEditMode
              ? 'Update the product details and save your changes.'
              : 'Fill in the details below to add a new product to your inventory.'}
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </span>
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name (e.g., Fresh Mango - Alphonso)"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleInputChange}
                  placeholder="Enter category (e.g., Fruits, Vegetables, Dairy)"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.categoryName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.categoryName && (
                  <p className="text-red-500 text-sm mt-1">{errors.categoryName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                2
              </span>
              Pricing
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-600 font-semibold">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </span>
              Description
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter detailed description about the product, benefits, specifications, etc."
                rows="6"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              <p className="text-gray-500 text-sm mt-1">
                {formData.description.length}/500 characters
              </p>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                4
              </span>
              Product Image
            </h2>

            <div className="space-y-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-48 w-48 object-cover rounded-lg border-2 border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                </div>
              )}

              {/* File Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Product Image <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="image-input"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="image-input" className="cursor-pointer">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12v12m0 0l-3-3m3 3l3-3M4 44h40"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-gray-700 font-semibold mt-2">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>
                {errors.image && (
                  <p className="text-red-500 text-sm mt-2">{errors.image}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {isEditMode ? 'Updating Product...' : 'Adding Product...'}
                  </>
                ) : (
                  isEditMode ? 'Update Product' : 'Add Product'
                )}
              </button>
            </div>
          </div>

          {/* Bottom padding to prevent content overlap with sticky buttons */}
          <div className="h-24"></div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
