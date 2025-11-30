import apiClient from './config';
import type {
  DeviceFieldsResponse,
  SaveDeviceRequest,
  SaveDeviceResponse,
} from '../types';

class DeviceService {
  /**
   * Lấy thông tin các trường cần nhập cho thiết bị
   * @param deviceId Mã thiết bị từ QR code
   * @param type Loại thiết bị (optional)
   * @returns DeviceFieldsResponse
   */
  async getDeviceFields(
    deviceId: string,
    type?: string,
  ): Promise<DeviceFieldsResponse> {
    try {
      const response = await apiClient.post<DeviceFieldsResponse>(
        '/device/fields',
        {
          deviceId,
          type,
        },
      );
      return response.data;
    } catch (error: any) {
      // Xử lý lỗi và trả về format chuẩn
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối.',
        },
      };
    }
  }

  /**
   * Lưu thông tin thiết bị
   * @param request Dữ liệu thiết bị cần lưu
   * @returns SaveDeviceResponse
   */
  async saveDeviceInfo(
    request: SaveDeviceRequest,
  ): Promise<SaveDeviceResponse> {
    try {
      const response = await apiClient.post<SaveDeviceResponse>(
        '/device/save',
        request,
      );
      return response.data;
    } catch (error: any) {
      // Xử lý lỗi và trả về format chuẩn
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Không thể lưu dữ liệu. Vui lòng thử lại.',
        },
      };
    }
  }
}

export default new DeviceService();
