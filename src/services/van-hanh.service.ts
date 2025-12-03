import { ApiService } from ".";
import { API_ENDPOINTS } from "../constants/api";
import { ApiResponse, ITsvhDatum, TsvhPayload, TsvhRequest } from "../types";

class VanHanhService {
    async lichSuVanHanh(data: TsvhRequest): Promise<TsvhPayload> {
        const response = await ApiService.post<ApiResponse<TsvhPayload>>(
            `${API_ENDPOINTS.VAN_HANH.GET_HISTORY}`, data
        );
        return response.data ?? { data: [] };
    }

    async save(data: ITsvhDatum): Promise<ITsvhDatum> {
        const response = await ApiService.post<ApiResponse<ITsvhDatum>>(
            `${API_ENDPOINTS.VAN_HANH.CREATE}`, data
        );
        return response.data ?? {} as ITsvhDatum;
    }
}

export default new VanHanhService();