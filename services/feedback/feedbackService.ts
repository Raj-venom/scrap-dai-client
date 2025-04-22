import API from "../api";

class FeedbackService {

    baseUrl = "/feedback";

    async upsertUserFeedback(orderId: string, feedbackData: any) {
        try {
            const response = await API.post(`${this.baseUrl}/upsert/user/${orderId}`, feedbackData);
            return response.data;
        } catch (error: any) {
            console.log('API :: upsertFeedback :: error', error.response?.data);
            return error.response?.data;
        }
    }

    async upsertCollectorFeedback(orderId: string, feedbackData: any) {
        try {
            const response = await API.post(`${this.baseUrl}/upsert/collector/${orderId}`, feedbackData);
            return response.data;
        } catch (error: any) {
            console.log('API :: upsertFeedback :: error', error.response?.data);
            return error.response?.data;
        }
    }

    async getAllFeedback() {
        try {
            const response = await API.get(`${this.baseUrl}/all`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getAllFeedback :: error', error.response?.data);
            return error.response?.data;
        }
    }

    async getFeedbackById(id: string) {
        try {
            const response = await API.get(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getFeedbackById :: error', error.response?.data);
            return error.response?.data;
        }
    }

    async deleteFeedback(id: string) {
        try {
            const response = await API.delete(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: deleteFeedback :: error', error.response?.data);
            return error.response?.data;
        }
    }

    async getFeedbackByOrderId(orderId: string) {
        try {
            const response = await API.get(`${this.baseUrl}/order/${orderId}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getFeedbackByOrderId :: error', error.response?.data);
            return error.response?.data;
        }
    }


    async getAllFeedbackOfCollector(collectorId: string) {
        try {
            const response = await API.get(`${this.baseUrl}/all/collector/${collectorId}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getAllFeedbackOfCollector :: error', error.response?.data);
            return error.response?.data;
        }
    }


    async getAllFeedbackOfUser(userId: string) {
        try {
            const response = await API.get(`${this.baseUrl}/all/user/${userId}`);
            return response.data;
        } catch (error: any) {
            console.log('API :: getAllFeedbackOfUser :: error', error.response?.data);
            return error.response?.data;
        }
    }
}


const feedbackService = new FeedbackService();
export default feedbackService;
