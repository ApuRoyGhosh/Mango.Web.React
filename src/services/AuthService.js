import BaseService from './BaseService';
import { SD } from '../utils/SD';

/**
 * Authentication service for handling auth API calls
 * Mirrors the ASP.NET AuthService
 */
export class AuthService {
  /**
   * Login user with credentials
   * @param {LoginRequestDto} loginRequestDto
   * @returns {Promise<ResponseDto>}
   */
  static async login(loginRequestDto) {
    return BaseService.sendAsync(
      {
        url: `${SD.AuthAPIBase}/login`,
        apiType: SD.ApiType.POST,
        data: loginRequestDto,
      },
      false // Don't include bearer token for login
    );
  }

  /**
   * Register new user
   * @param {RegistrationRequestDto} registrationRequestDto
   * @returns {Promise<ResponseDto>}
   */
  static async register(registrationRequestDto) {
    return BaseService.sendAsync(
      {
        url: `${SD.AuthAPIBase}/register`,
        apiType: SD.ApiType.POST,
        data: registrationRequestDto,
      },
      false // Don't include bearer token for register
    );
  }

  /**
   * Assign role to user
   * @param {RegistrationRequestDto} registrationRequestDto
   * @returns {Promise<ResponseDto>}
   */
  static async assignRole(registrationRequestDto) {
    return BaseService.sendAsync({
      url: `${SD.AuthAPIBase}/AssignRole`,
      apiType: SD.ApiType.POST,
      data: registrationRequestDto,
    });
  }
}

export default AuthService;
