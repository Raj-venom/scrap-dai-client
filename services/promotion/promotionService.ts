import API from "../api";

interface Promotion {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    url?: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt: string;
}


interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
class PromotionService {
    baseUrl = "/promotion";

    async getAllPromotions(): Promise<ApiResponse<Promotion[]>> {
        try {
            const response = await API.get(`${this.baseUrl}`);
            return response.data;
        } catch (error: any) {
            console.log('PromotionService :: getAllPromotions :: error', error.response?.data || error);
            return error.response?.data || { success: false, error: error.message };
        }
    }


    async getActivePromotions(): Promise<ApiResponse<Promotion[]>> {
        try {
            const response = await API.get(`${this.baseUrl}/active`);
            return response.data;
        } catch (error: any) {
            console.log('PromotionService :: getActivePromotions :: error', error.response?.data || error);
            return error.response?.data || { success: false, error: error.message };
        }
    }
}

const promotionService = new PromotionService();
export default promotionService;