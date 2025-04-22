
import API from "../api";

class ScrapService {
    baseUrl = "/scrap";


    async getRandomScrapPrice() {
        try {
            const response = await API.get(`${this.baseUrl}/random/price`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getRandomScrapPrice :: error', error.response?.data);
            return error.response?.data;
        }
    }
}

const scrapService = new ScrapService();
export default scrapService;