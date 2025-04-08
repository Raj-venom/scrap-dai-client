
import API from "../api";

import { USER_ROLE } from "@/constants";

import { getRole } from "@/services/token/tokenService";

class NotificationService {
    baseUrl = "/notification";

    async getNotifications(user: any) {
        try {
            const role = await getRole();

            const response = await API.get(`${this.baseUrl}/?${role}Id=${user._id}&sort=-createdAt`);

            return response.data;
        } catch (error: any) {
            console.log("API :: getNotifications :: error", error.response?.data);
            return error.response?.data;
        }
    }

    async markAsRead(notificationId: string) {
        try {
            const response = await API.patch(`${this.baseUrl}/${notificationId}/read`);

            return response.data;
        } catch (error: any) {
            console.log("API :: markAsRead :: error", error.response?.data);
            return error.response?.data;
        }
    }


    async deleteNotification(notificationId: string) {
        try {
            const response = await API.delete(`${this.baseUrl}/${notificationId}`);
            return response.data;
        } catch (error: any) {
            console.log("API :: deleteNotification :: error", error.response?.data);
            return error.response?.data;
        }
    }


    async createNotification(notificationData: any) {
        try {
            const response = await API.post(this.baseUrl, notificationData);
            return response.data;
        } catch (error: any) {
            console.log("API :: createNotification :: error", error.response?.data);
            return error.response?.data;
        }
    }


}

const notificationService = new NotificationService();
export default notificationService;