// API Configuration
export const API_CONFIG = {
  // Using adb reverse tcp:9000 tcp:9000 for USB-connected device
  // This forwards PC's port 9000 to device's localhost:9000
  BASE_URL: __DEV__
    ? 'http://192.168.100.178:9000/hqbc-device/v1'  // USB device with adb reverse
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
