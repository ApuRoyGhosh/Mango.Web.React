import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ProductService from '../services/ProductService';
import { ProductDto } from '../models';

export const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productId: 0,
    name: '',
    price: '',
    description: '',
    categoryName: '',
    imageUrl: '',
    image: null,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await ProductService.getAllProducts();
      if (response.isSuccess) {
        setProducts(response.result || []);
      } else {
        toast.error(response.message || 'Failed to load products');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      productId: 0,
      name: '',
      price: '',
      description: '',
      categoryName: '',
      imageUrl: '',
      image: null,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productId: product.productId,
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      categoryName: product.categoryName,
      imageUrl: product.imageUrl || '',
      image: null,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      productId: 0,
      name: '',
      price: '',
      description: '',
      categoryName: '',
      imageUrl: '',
      image: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files?.[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const productDto = new ProductDto(
        formData.productId,
        formData.name,
        parseFloat(formData.price),
        formData.description,
        formData.categoryName,
        formData.imageUrl,
        formData.image
      );

      let response;
      if (editingProduct) {
        response = await ProductService.updateProduct(productDto);
      } else {
        response = await ProductService.createProduct(productDto);
      }

      if (response.isSuccess) {
        toast.success(
          editingProduct ? 'Product updated successfully!' : 'Product created successfully!'
        );
        handleCloseModal();
        await loadProducts();
      } else {
        toast.error(response.message || 'Failed to save product');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await ProductService.deleteProduct(productId);
        if (response.isSuccess) {
          toast.success('Product deleted successfully!');
          await loadProducts();
        } else {
          toast.error(response.message || 'Failed to delete product');
        }
      } catch (error) {
        toast.error(error.message || 'An error occurred');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button
          onClick={handleOpenCreate}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition"
        >
          + Create Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No products available</p>
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Create First Product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Category</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Price</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Description</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.productId} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">{product.productId}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{product.categoryName}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">
                    ${product.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900 truncate max-w-xs">
                    {product.description}
                  </td>
                  <td className="px-6 py-3 text-sm text-center">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs mr-2 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.productId)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Edit Product' : 'Create Product'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleInputChange}
                  placeholder="Enter category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-700"
                  disabled={isSubmitting}
                />
                {formData.image && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {formData.image.name}
                  </p>
                )}
                {!formData.image && formData.imageUrl && (
                  <p className="mt-2 text-sm text-gray-600">
                    Using image URL from form.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
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
                  {isSubmitting ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductPage;
