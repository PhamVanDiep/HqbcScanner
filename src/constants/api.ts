// API Configuration
export const API_CONFIG = {
  // Use your computer's IP address for real devices
  // For Android emulator, use 10.0.2.2 instead of localhost
  // For real devices, use your computer's IP (e.g., 'http://192.168.1.100:9000/palshop/v1')
  BASE_URL: __DEV__
    ? 'http://192.168.100.178:9000/hqbc-device/v1'  // Android emulator
    : 'http://localhost:9000/hqbc-device/v1', // Production
  TIMEOUT: 30000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    CHECK_BIOMETRIC: '/auth/biometric/check',
    REGISTER_BIOMETRIC: '/auth/biometric/register',
  },

  // App Update (Android)
  APP_UPDATE: {
    CHECK_VERSION: '/app/version',
    DOWNLOAD_APK: '/app/download',
  },
};
