import axios from 'axios';
import { SD } from '../utils/SD';

// Create axios instance for direct service calls (no gateway)
// Each service URL is already complete with its base path
export const httpClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to inject Bearer token
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(SD.StorageKeys.Token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem(SD.StorageKeys.Token);
      localStorage.removeItem(SD.StorageKeys.User);
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default httpClient;
