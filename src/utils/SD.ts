// Constants and enums similar to Mango.Web
export const SD = {
  // Direct Service URLs (bypassing API Gateway)
  AuthAPIBase: import.meta.env.VITE_AUTH_API_BASE || 'http://localhost:7002/api/auth',
  ProductAPIBase: import.meta.env.VITE_PRODUCT_API_BASE || 'http://localhost:7000/api/product',
  CouponAPIBase: import.meta.env.VITE_COUPON_API_BASE || 'http://localhost:7001/api/coupon',
  CartAPIBase: import.meta.env.VITE_CART_API_BASE || 'http://localhost:7003/api/cart',
  OrderAPIBase: import.meta.env.VITE_ORDER_API_BASE || 'http://localhost:7004/api/order',

  // API Types/Methods
  ApiType: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
  },

  // Content Types
  ContentType: {
    Json: 'application/json',
    MultipartFormData: 'multipart/form-data',
  },

  // Roles
  Roles: {
    Admin: 'admin',
    Customer: 'customer',
  },

  // Storage Keys
  StorageKeys: {
    Token: 'token',
    User: 'user',
    Cart: 'cart',
  },
};
