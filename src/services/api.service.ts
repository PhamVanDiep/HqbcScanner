import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_CONFIG, API_ENDPOINTS} from '../constants/api';
import {logError} from '../utils/errorHandler';

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
        // const originalRequest = error.config;

        // // Log error
        // logError(error, `API Request: ${originalRequest?.url}`);

        // // Handle token expiration
        // if (error.response?.status === 401 && !originalRequest._retry) {
        //   originalRequest._retry = true;

        //   try {
        //     const refreshToken = await AsyncStorage.getItem('refreshToken');
        //     if (refreshToken) {
        //       const response = await axios.post(
        //         `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
        //         {refreshToken},
        //       );

        //       // Extract tokens from backend response structure
        //       const newAccessToken = response.data.data?.accessToken || response.data.accessToken;
        //       const newRefreshToken = response.data.data?.refreshToken || response.data.refreshToken;

        //       if (newAccessToken) {
        //         await AsyncStorage.setItem('accessToken', newAccessToken);
        //         if (newRefreshToken) {
        //           await AsyncStorage.setItem('refreshToken', newRefreshToken);
        //         }

        //         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        //         return this.axiosInstance(originalRequest);
        //       }
        //     }
        //   } catch (refreshError) {
        //     // Token refresh failed, redirect to login
        //     await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        //     logError(refreshError, 'Token refresh failed');
        //     // You might want to dispatch a logout action here
        //     return Promise.reject(refreshError);
        //   }
        // }

        return Promise.reject(error);
      },
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
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
