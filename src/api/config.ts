import axios from 'axios';

// TODO: Thay đổi BASE_URL này thành URL backend thực tế
export const API_BASE_URL = 'https://your-api-domain.com/api/v1';

// TODO: Thay đổi token này hoặc implement login flow
export const API_TOKEN = 'YOUR_ACCESS_TOKEN';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token vào mọi request
apiClient.interceptors.request.use(
  config => {
    if (API_TOKEN) {
      config.headers.Authorization = `Bearer ${API_TOKEN}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor để xử lý lỗi chung
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server trả về lỗi
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error('Network Error:', error.message);
    } else {
      // Lỗi khác
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
