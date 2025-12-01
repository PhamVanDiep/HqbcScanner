import {Alert} from 'react-native';
import {AxiosError} from 'axios';

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Parse error from API response
 */
export const parseApiError = (error: any): ApiError => {
  if (error.response) {
    // Server responded with error status
    const {status, data} = error.response;

    return {
      message: data?.message || getDefaultErrorMessage(status),
      statusCode: status,
      errors: data?.errors,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      statusCode: 0,
    };
  } else {
    // Something happened in setting up the request
    return {
      message: error.message || 'Đã có lỗi xảy ra',
    };
  }
};

/**
 * Get default error message based on status code
 */
const getDefaultErrorMessage = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return 'Dữ liệu không hợp lệ';
    case 401:
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
    case 403:
      return 'Bạn không có quyền thực hiện thao tác này';
    case 404:
      return 'Không tìm thấy dữ liệu';
    case 409:
      return 'Dữ liệu đã tồn tại';
    case 422:
      return 'Dữ liệu không hợp lệ';
    case 500:
      return 'Lỗi server. Vui lòng thử lại sau';
    case 503:
      return 'Server đang bảo trì. Vui lòng thử lại sau';
    default:
      return 'Đã có lỗi xảy ra';
  }
};

/**
 * Show error alert to user
 */
export const showErrorAlert = (error: any, title: string = 'Lỗi') => {
  const apiError = parseApiError(error);

  let message = apiError.message;

  // Add validation errors if present
  if (apiError.errors) {
    const errorMessages = Object.entries(apiError.errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('\n');
    message += '\n\n' + errorMessages;
  }

  Alert.alert(title, message);
};

/**
 * Log error for debugging
 */
export const logError = (error: any, context?: string) => {
  if (__DEV__) {
    console.error('=== Error ===');
    if (context) {
      console.error('Context:', context);
    }
    console.error('Error:', error);
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Response Status:', error.response.status);
    }
    console.error('=============');
  }
};

/**
 * Handle API error with logging and alert
 */
export const handleApiError = (
  error: any,
  context?: string,
  showAlert: boolean = true,
) => {
  logError(error, context);

  if (showAlert) {
    showErrorAlert(error);
  }

  return parseApiError(error);
};

/**
 * Check if error is network error
 */
export const isNetworkError = (error: any): boolean => {
  return !error.response && error.request;
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401;
};

/**
 * Check if error is validation error
 */
export const isValidationError = (error: any): boolean => {
  return error.response?.status === 422 || error.response?.status === 400;
};
