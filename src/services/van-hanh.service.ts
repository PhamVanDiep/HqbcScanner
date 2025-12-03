import { ApiService } from ".";
import { API_ENDPOINTS } from "../constants/api";
import { ITsvhDatum, TsvhPayload, TsvhRequest } from "../types";

class VanHanhService {
    async lichSuVanHanh(data: TsvhRequest): Promise<TsvhPayload> {
        const response = await ApiService.post<TsvhPayload>(
            `${API_ENDPOINTS.VAN_HANH.GET_HISTORY}`, data
        );
        return response;
    }

    async save(data: ITsvhDatum): Promise<ITsvhDatum> {
        const response = await ApiService.post<ITsvhDatum>(
            `${API_ENDPOINTS.VAN_HANH.CREATE}`, data
        );
        return response;
    }
}

export default new VanHanhService();