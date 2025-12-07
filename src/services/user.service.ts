import { ApiService } from ".";
import { API_ENDPOINTS } from "../constants/api";
import { ApiResponse, ChangePasswordRequest } from "../types";

class UserService {
    async verify(): Promise<any> {
        const response = await ApiService.get<any>(
            `${API_ENDPOINTS.USER.VERIFY}`
        );
        return response;
    }

    async changePassword(data: ChangePasswordRequest): Promise<void> {
        const response = await ApiService.post<ApiResponse<any>>(
            API_ENDPOINTS.USER.CHANGE_PASSWORD,
            data,
        );

        if (response.code !== 200) {
            throw new Error(response.message || 'Đổi mật khẩu thất bại');
        }
    }
}

export default new UserService();