import httpClient from './httpClient';
import { ResponseDto } from '../models';

/**
 * Base service for making HTTP requests
 * Mirrors the ASP.NET BaseService functionality
 */
export class BaseService {
  /**
   * Send HTTP request
   * @param {RequestDto} requestDto - Request configuration
   * @param {boolean} withBearer - Whether to include Bearer token (default: true)
   * @returns {Promise<ResponseDto>}
   */
  static async sendAsync(requestDto, withBearer = true) {
    try {
      let config = {
        method: requestDto.apiType?.toLowerCase() || 'get',
        url: requestDto.url,
        headers: {
          Accept: 'application/json',
        },
      };

      // Add data for non-GET requests
      if (requestDto.apiType !== 'GET' && requestDto.data) {
        config.data = requestDto.data;

        if (typeof FormData !== 'undefined' && requestDto.data instanceof FormData) {
          // Override default JSON content header from the axios instance.
          // Axios will set the proper multipart/form-data boundary header for FormData.
          config.headers['Content-Type'] = undefined;
        }
      }

      // Handle token injection (can be disabled for login/register)
      if (withBearer) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await httpClient(config);

      // If response has isSuccess field, it's the full ResponseDto structure
      if (response.data.isSuccess !== undefined) {
        return new ResponseDto(
          response.data.isSuccess,
          response.data.message || 'Success',
          response.data.result
        );
      }

      // Otherwise, treat response.data as the result
      return new ResponseDto(
        true,
        'Success',
        response.data
      );
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      switch (status) {
        case 404:
          return new ResponseDto(false, 'Not Found');
        case 403:
          return new ResponseDto(false, 'Access Denied');
        case 401:
          return new ResponseDto(false, 'Unauthorized');
        case 400:
          return new ResponseDto(false, message || 'Bad Request');
        default:
          return new ResponseDto(false, message || 'An error occurred');
      }
    }
  }
}

export default BaseService;
