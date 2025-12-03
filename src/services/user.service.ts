import { ApiService } from ".";
import { API_ENDPOINTS } from "../constants/api";

class UserService {
    async verify(): Promise<any> {
        const response = await ApiService.get<any>(
            `${API_ENDPOINTS.USER.VERIFY}`
        );
        return response;
    }
}

export default new UserService();