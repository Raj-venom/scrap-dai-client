import API from "../api";

import { USER_ROLE } from "@/constants";

import { getRole } from "@/services/token/tokenService";


// router.route("/unread-count").get(getUnreadNotificationsCount);
// const getUnreadNotificationsCount = asyncHandler(async (req, res) => {
//     const { userId, collectorId } = req.query;
//     let query = {};

//     if (userId) {
//         query.user = userId;
//     } else if (collectorId) {
//         query.collector = collectorId;
//     } else {
//         return res.status(400).json({ message: "Either user or collector ID is required" });
//     }

//     const count = await Notification.countDocuments({ ...query, isRead: false });

//     return res.status(200).json(new ApiResponse(200, { count }, "Unread notifications count fetched successfully"));
// });


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

    async markAsAllReadUser(userId: string) {
        try {
            const response = await API.patch(`${this.baseUrl}/mark-as-all-read?userId=${userId}`);
            return response.data;
        } catch (error: any) {
            console.log("API :: markAsAllRead :: error", error.response?.data);
            return error.response?.data;
        }
    }

    async markAsAllReadCollector(collectorId: string) {
        try {
            const response = await API.patch(
                `${this.baseUrl}/mark-as-all-read?collectorId=${collectorId}`
            );
            return response.data;
        } catch (error: any) {
            console.log("API :: markAsAllReadCollector :: error", error.response?.data);
            return error.response?.data;
        }
    }

    async getUnreadNotificationsCount(user: any) {
        try {
            const role = await getRole();
            const response = await API.get(`${this.baseUrl}/unread-count?${role}Id=${user._id}`);
            return response.data;
        } catch (error: any) {
            console.log("API :: getUnreadNotificationsCount :: error", error.response?.data);
            return error.response?.data;
        }
    }


}

const notificationService = new NotificationService();
export default notificationService;