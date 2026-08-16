import BaseService from './BaseService';
import { SD } from '../utils/SD';

/**
 * Cart service for shopping cart API calls
 */
export class CartService {
  /**
   * Get cart by user ID
   * @param {string} userId
   * @returns {Promise<ResponseDto>}
   */
  static async getCart(userId) {
    return BaseService.sendAsync({
      url: `${SD.CartAPIBase}/GetCart/${userId}`,
      apiType: SD.ApiType.GET,
    });
  }

  /**
   * Add item to cart
   * @param {CartDto} cartDto
   * @returns {Promise<ResponseDto>}
   */
  static async addToCart(cartDto) {
    return BaseService.sendAsync({
      url: `${SD.CartAPIBase}/CartUpsert`,
      apiType: SD.ApiType.POST,
      data: cartDto,
    });
  }

  /**
   * Update cart
   * @param {CartDto} cartDto
   * @returns {Promise<ResponseDto>}
   */
  static async updateCart(cartDto) {
    return BaseService.sendAsync({
      url: `${SD.CartAPIBase}/CartUpsert`,
      apiType: SD.ApiType.POST,
      data: cartDto,
    });
  }

  /**
   * Remove item from cart
   * @param {number} cartDetailsId
   * @returns {Promise<ResponseDto>}
   */
  static async removeFromCart(cartDetailsId) {
    return BaseService.sendAsync({
      url: `${SD.CartAPIBase}/RemoveCart?cartDetailsId=${cartDetailsId}`,
      apiType: SD.ApiType.POST,
    });
  }

  /**
   * Apply coupon/promo code
   * @param {CartDto} cartDto
   * @param {string} couponCode
   * @returns {Promise<ResponseDto>}
   */
  static async applyPromo(cartDto, couponCode) {
    // Update the coupon code in the cart header
    if (cartDto.cartHeader) {
      cartDto.cartHeader.couponCode = couponCode;
    }
    return BaseService.sendAsync({
      url: `${SD.CartAPIBase}/ApplyCoupon`,
      apiType: SD.ApiType.POST,
      data: cartDto,
    });
  }

  /**
   * Remove coupon
   * @param {CartDto} cartDto
   * @returns {Promise<ResponseDto>}
   */
  static async removeCoupon(cartDto) {
    // Clear the coupon code in the cart header
    if (cartDto.cartHeader) {
      cartDto.cartHeader.couponCode = '';
    }
    return BaseService.sendAsync({
      url: `${SD.CartAPIBase}/RemoveCoupon`,
      apiType: SD.ApiType.POST,
      data: cartDto,
    });
  }
}

export default CartService;
