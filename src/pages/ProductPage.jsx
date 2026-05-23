import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ProductService from '../services/ProductService';
import CartService from '../services/CartService';
import { CartDto, CartHeaderDto, CartDetailsDto } from '../models';
import useAuth from '../hooks/useAuth';

export const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const [addingToCart, setAddingToCart] = useState(null);

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

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.warning('Please login to add items to cart');
      return;
    }

    setAddingToCart(product.productId);
    try {
      // Create CartDetailsDto for the product
      const cartDetails = new CartDetailsDto(
        0, // cartDetailsId (new item)
        0, // cartHeaderId (will be created by API)
        product.productId,
        product,
        1 // count: 1 item
      );

      // Create CartHeaderDto with user ID
      const cartHeader = new CartHeaderDto(
        0, // cartHeaderId (new cart)
        user.id,
        '', // couponCode
        0, // discount
        product.price, // cartTotal (single item price)
        user.name,
        user.phoneNumber,
        user.email
      );

      // Create CartDto with nested header and details
      const cartDto = new CartDto(
        cartHeader,
        [cartDetails]
      );

      const response = await CartService.addToCart(cartDto);
      
      if (response.isSuccess) {
        toast.success(`${product.name} added to cart!`);
      } else {
        toast.error(response.message || 'Failed to add item to cart');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while adding to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.productId}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={product.imageUrl || 'https://via.placeholder.com/300x300'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price?.toFixed(2)}
                  </span>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {product.categoryName}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addingToCart === product.productId}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart === product.productId ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
