import API from "../api";


class DashboardService {

    baseUrl = "/dashboard"

    async getUserStats() {
        try {
            const response = await API.get(`${this.baseUrl}/user-stats`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getUserStats :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async getCollectorStats() {
        try {
            const response = await API.get(`${this.baseUrl}/collector-stats`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getCollectorStats :: error', error.response?.data)
            return error.response?.data;
        }
    }


}


const dashboardService = new DashboardService();
export default dashboardService;
