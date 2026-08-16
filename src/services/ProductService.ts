import BaseService from './BaseService';
import { SD } from '../utils/SD';

/**
 * Product service for product API calls
 */
export class ProductService {
  /**
   * Get all products
   * @returns {Promise<ResponseDto>}
   */
  static async getAllProducts() {
    return BaseService.sendAsync(
      {
        url: `${SD.ProductAPIBase}`,
        apiType: SD.ApiType.GET,
      },
      false // Products endpoint doesn't require authentication for GET
    );
  }

  /**
   * Get product by ID
   * @param {number} id
   * @returns {Promise<ResponseDto>}
   */
  static async getProductById(id) {
    return BaseService.sendAsync(
      {
        url: `${SD.ProductAPIBase}/${id}`,
        apiType: SD.ApiType.GET,
      },
      false
    );
  }

  static createProductFormData(productDto) {
    const formData = new FormData();

    Object.keys(productDto).forEach((key) => {
      const value = productDto[key];
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    return formData;
  }

  /**
   * Create product (admin only)
   * @param {ProductDto} productDto
   * @returns {Promise<ResponseDto>}
   */
  static async createProduct(productDto) {
    return BaseService.sendAsync({
      url: `${SD.ProductAPIBase}`,
      apiType: SD.ApiType.POST,
      data: ProductService.createProductFormData(productDto),
    });
  }

  /**
   * Update product (admin only)
   * @param {ProductDto} productDto
   * @returns {Promise<ResponseDto>}
   */
  static async updateProduct(productDto) {
    return BaseService.sendAsync({
      url: `${SD.ProductAPIBase}`,
      apiType: SD.ApiType.PUT,
      data: ProductService.createProductFormData(productDto),
    });
  }

  /**
   * Delete product (admin only)
   * @param {number} id
   * @returns {Promise<ResponseDto>}
   */
  static async deleteProduct(id) {
    return BaseService.sendAsync({
      url: `${SD.ProductAPIBase}/${id}`,
      apiType: SD.ApiType.DELETE,
    });
  }
}

export default ProductService;
