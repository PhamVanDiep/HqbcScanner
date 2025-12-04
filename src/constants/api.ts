// API Configuration
export const API_CONFIG = {
  // Development: use local network IP for testing on physical device
  // Production: use server IP accessible from physical device
  BASE_URL: __DEV__
    ? 'http://192.168.100.178:9000/hqbc-device/v1'  // Development
    : 'http://10.1.117.228/hqbc-device/v1', // Production
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
  THIET_BI: {
    SEARCH: '/thiet-bi/search',
    DETAIL: '/thiet-bi',
    QR_CODE: '/thiet-bi/qr-code',
  },

  VAN_HANH: {
    GET_HISTORY: '/van-hanh/lich-su',
    CREATE: '/van-hanh',
  },

  USER: {
    VERIFY: '/user/verify',
  },
};
