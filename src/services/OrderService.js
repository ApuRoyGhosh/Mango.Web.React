import BaseService from './BaseService';
import { SD } from '../utils/SD';

/**
 * Order service for orders API calls
 */
export class OrderService {
  /**
   * Get all orders for the current user or all orders for an admin
   * @param {string} [userId='']
   * @returns {Promise<ResponseDto>}
   */
  static async getOrders(userId = '') {
    const url = userId
      ? `${SD.OrderAPIBase}/GetOrders?userId=${encodeURIComponent(userId)}`
      : `${SD.OrderAPIBase}/GetOrders`;
    return BaseService.sendAsync({
      url,
      apiType: SD.ApiType.GET,
    });
  }

  /**
   * Get order by ID
   * @param {number} id
   * @returns {Promise<ResponseDto>}
   */
  static async getOrderById(id) {
    return BaseService.sendAsync({
      url: `${SD.OrderAPIBase}/GetOrder/${id}`,
      apiType: SD.ApiType.GET,
    });
  }

  /**
   * Create order
   * @param {Object} cartDto
   * @returns {Promise<ResponseDto>}
   */
  static async createOrder(cartDto) {
    return BaseService.sendAsync({
      url: `${SD.OrderAPIBase}/CreateOrder`,
      apiType: SD.ApiType.POST,
      data: cartDto,
    });
  }

  /**
   * Create a Stripe session for order payment
   * @param {Object} orderHeaderDto
   * @param {string} approvedUrl
   * @param {string} cancelUrl
   * @returns {Promise<ResponseDto>}
   */
  static async createStripeSession(orderHeaderDto, approvedUrl, cancelUrl) {
    return BaseService.sendAsync({
      url: `${SD.OrderAPIBase}/CreateStripeSession`,
      apiType: SD.ApiType.POST,
      data: {
        approvedUrl,
        cancelUrl,
        orderHeader: orderHeaderDto,
      },
    });
  }

  /**
   * Update order status (admin only)
   * @param {number} orderId
   * @param {string} newStatus
   * @returns {Promise<ResponseDto>}
   */
  static async updateOrderStatus(orderId, newStatus) {
    return BaseService.sendAsync({
      url: `${SD.OrderAPIBase}/UpdateOrderStatus/${orderId}`,
      apiType: SD.ApiType.POST,
      data: newStatus,
    });
  }

  /**
   * Validate Stripe payment
   * @param {number} orderId
   * @returns {Promise<ResponseDto>}
   */
  static async validateStripe(orderId) {
    return BaseService.sendAsync({
      url: `${SD.OrderAPIBase}/ValidateStripeSession`,
      apiType: SD.ApiType.POST,
      data: orderId,
    });
  }
}

export default OrderService;
