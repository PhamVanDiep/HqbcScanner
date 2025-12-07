import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {API_CONFIG, API_ENDPOINTS} from '../constants/api';
import {logError} from '../utils/errorHandler';
import {ApiResponse} from '../types';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async config => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(config.data);
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      response => {
        // Log successful responses in development
        if (__DEV__) {
          console.log('API Response:', {
            url: response.config.url,
            method: response.config.method,
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      async error => {
        // Handle token expiration (401 Unauthorized)
        if (error.response?.status === 401) {
          // Token expired or invalid - clear auth data and force logout
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);

          // Log for debugging
          if (__DEV__) {
            console.log('Token expired - clearing auth data');
          }
        }

        // Log errors in development
        if (__DEV__) {
          console.error('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
          });
        }

        // Check if backend returned an error (code !== 200)
        const apiResponse = error.response.data as ApiResponse<any>;
        if (apiResponse.code && apiResponse.code !== 200 && apiResponse.code !== 401) {
          // Show alert with error message from backend
          if (apiResponse.message) {
            Alert.alert('Lỗi', apiResponse.message);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.get(url, config);
    return response.data.data as T;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(
      url,
      data,
      config,
    );
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(
      url,
      data,
      config,
    );
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(
      url,
      config,
    );
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(
      url,
      data,
      config,
    );
    return response.data;
  }
}

export default new ApiService();
