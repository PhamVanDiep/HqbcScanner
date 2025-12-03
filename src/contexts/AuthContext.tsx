import React, {createContext, useState, useContext, useEffect} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {User, LoginRequest, RegisterRequest} from '../types';
import {AuthService} from '../services';
import {BiometricUtils} from '../utils/biometric';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loginWithBiometric: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();

    // Listen for app state changes to detect when token is cleared
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Also check periodically in case token was cleared by API interceptor
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 3000); // Check every 3 seconds

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // Check auth when app comes to foreground
      checkAuthStatus();
    }
  };

  const checkAuthStatus = async () => {
    try {
      const storedUser = await AuthService.getStoredUser();
      const authenticated = await AuthService.isAuthenticated();

      if (storedUser && authenticated) {
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        // Token was cleared - logout
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Check auth status error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const authData = await AuthService.login(credentials);
      setUser(authData.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithBiometric = async () => {
    try {
      setIsLoading(true);

      // Check if biometric is available
      const {available} = await BiometricUtils.isBiometricAvailable();
      if (!available) {
        throw new Error('Sinh trắc học không khả dụng trên thiết bị này');
      }

      // Check if biometric is enabled for this user
      const biometricEnabled = await AuthService.checkBiometric();
      if (!biometricEnabled) {
        throw new Error('Bạn chưa kích hoạt đăng nhập bằng sinh trắc học');
      }

      // Authenticate with biometric
      const {success, error} = await BiometricUtils.authenticate(
        'Xác thực để đăng nhập',
      );

      if (!success) {
        throw new Error(error || 'Xác thực sinh trắc học thất bại');
      }

      // Get stored credentials (in real app, you might use secure storage)
      const storedUsername = await AsyncStorage.getItem('biometric_username');
      if (!storedUsername) {
        throw new Error('Không tìm thấy thông tin đăng nhập');
      }

      // Login with biometric flag
      await login({
        username: storedUsername,
        password: '', // Backend should handle biometric authentication differently
        useBiometric: true,
      });
    } catch (error) {
      console.error('Biometric login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      const authData = await AuthService.register(data);
      setUser(authData.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        loginWithBiometric,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
