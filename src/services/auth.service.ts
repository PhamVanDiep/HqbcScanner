import ApiService from './api.service';
import {API_ENDPOINTS} from '../constants/api';
import {
  AuthResponse,
  AuthResponseData,
  LoginRequest,
  RegisterRequest,
  ApiResponse,
  User,
} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  // Transform backend user info to app User format
  private transformUserInfo(backendData: AuthResponseData): AuthResponse {
    const user: User = {
      id: backendData.info.userid,
      username: backendData.info.username,
      email: backendData.info.email,
      phone: backendData.info.phoneNumber,
    };

    return {
      user,
      accessToken: backendData.accessToken,
      refreshToken: backendData?.refreshToken,
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await ApiService.post<ApiResponse<AuthResponseData>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );

    if (response.code === 200 && response.data) {
      const authData = this.transformUserInfo(response.data);
      await this.saveAuthData(authData);
      return authData;
    }

    throw new Error(response.message || 'Đăng nhập thất bại');
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await ApiService.post<ApiResponse<AuthResponseData>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
    );

    if (response.code === 200 && response.data) {
      const authData = this.transformUserInfo(response.data);
      await this.saveAuthData(authData);
      return authData;
    }

    throw new Error(response.message || 'Đăng ký thất bại');
  }

  async logout(): Promise<void> {
    try {
      await ApiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      await this.clearAuthData();
    }
  }

  async checkBiometric(): Promise<boolean> {
    try {
      const response = await ApiService.get<ApiResponse<{enabled: boolean}>>(
        API_ENDPOINTS.AUTH.CHECK_BIOMETRIC,
      );
      return response.data.enabled;
    } catch (error) {
      return false;
    }
  }

  async registerBiometric(enabled: boolean): Promise<void> {
    await ApiService.post(API_ENDPOINTS.AUTH.REGISTER_BIOMETRIC, {enabled});
  }

  private async saveAuthData(authData: AuthResponse): Promise<void> {
    await AsyncStorage.multiSet([
      ['accessToken', authData.accessToken],
      ['user', JSON.stringify(authData.user)],
    ]);
  }

  private async clearAuthData(): Promise<void> {
    await AsyncStorage.multiRemove(['accessToken', 'user']);
  }

  async getStoredUser() {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('accessToken');
    return !!token;
  }
}

export default new AuthService();
