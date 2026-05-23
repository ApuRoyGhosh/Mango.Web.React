import BaseService from './BaseService';
import { SD } from '../utils/SD';

/**
 * Coupon service for coupon API calls
 */
export class CouponService {
  static async getAllCoupons() {
    return BaseService.sendAsync({
      url: `${SD.CouponAPIBase}`,
      apiType: SD.ApiType.GET,
    });
  }

  static async getCouponById(id) {
    return BaseService.sendAsync({
      url: `${SD.CouponAPIBase}/${id}`,
      apiType: SD.ApiType.GET,
    });
  }

  static async createCoupon(couponDto) {
    return BaseService.sendAsync({
      url: `${SD.CouponAPIBase}`,
      apiType: SD.ApiType.POST,
      data: couponDto,
    });
  }

  static async updateCoupon(couponDto) {
    return BaseService.sendAsync({
      url: `${SD.CouponAPIBase}`,
      apiType: SD.ApiType.PUT,
      data: couponDto,
    });
  }

  static async deleteCoupon(id) {
    return BaseService.sendAsync({
      url: `${SD.CouponAPIBase}/${id}`,
      apiType: SD.ApiType.DELETE,
    });
  }
}

export default CouponService;
