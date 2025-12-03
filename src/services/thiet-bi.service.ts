import { ApiService } from ".";
import { API_ENDPOINTS } from "../constants/api";
import { IThietBi, Page } from "../types";

class ThietBiService {
    async search(
        keyword: string,
        page: number = 0,
        size: number = 20,
    ): Promise<Page<IThietBi>> {
        const response = await ApiService.get<Page<IThietBi>>(
            `${API_ENDPOINTS.THIET_BI.SEARCH}?page=${page}&size=${size}&keyword=${keyword}`,
        );
        return response;
    }

    async findById(id: string): Promise<IThietBi> {
        const response = await ApiService.get<IThietBi>(
            `${API_ENDPOINTS.THIET_BI.DETAIL}?id=${id}`,
        );
        return response;
    }

    async findByQRCode(qrCode: string): Promise<IThietBi[]> {
        const response = await ApiService.get<IThietBi[]>(
            `${API_ENDPOINTS.THIET_BI.QR_CODE}?qrCode=${encodeURIComponent(qrCode)}`,
        );
        return response;
    }
}

export default new ThietBiService();