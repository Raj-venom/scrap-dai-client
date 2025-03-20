import API from "../api";


class OrderService {

    baseUrl = "/order"

    async createOrder(orderData: any) {
        try {
            const response = await API.post(`${this.baseUrl}`, orderData);

            return response.data;
        } catch (error: any) {
            console.log('API :: createOrder :: error', error.response?.data)
            return error.response?.data;
        }
    }

    // FormData requests
    async createOrderWithFormData(formData: FormData) {
        try {
            const response = await API.post(`${this.baseUrl}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error: any) {
            console.log('API :: createOrderWithFormData :: error', error.response?.data);
            return error.response?.data || { success: false, message: 'Network error' };
        }
    }

    async getMyOrders() {
        try {
            const response = await API.get(`${this.baseUrl}/my-orders`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getMyOrders :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async getUnassignedOrders() {
        try {
            const response = await API.get(`${this.baseUrl}/unassigned-orders`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getUnassignedOrders :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async getOderById(orderId: string) {
        try {
            const response = await API.get(`${this.baseUrl}/${orderId}`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getOderById :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async acceptOrder(orderId: string) {
        try {
            const response = await API.patch(`${this.baseUrl}/${orderId}/accept`);

            return response.data;
        } catch (error: any) {
            console.log('API :: acceptOrder :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async completeOrder(orderId: string, orderData: any) {
        try {
            const response = await API.patch(`${this.baseUrl}/${orderId}/complete`, orderData);

            return response.data;
        } catch (error: any) {
            console.log('API :: completeOrder :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async cancelOrder(orderId: string) {
        try {
            const response = await API.patch(`${this.baseUrl}/${orderId}/cancel`);

            return response.data;
        } catch (error: any) {
            console.log('API :: cancelOrder :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async getCollectorsPendingOrders() {
        try {
            const response = await API.get(`${this.baseUrl}/collector-orders`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getCollectorsPendingOrders :: error', error.response?.data)
            return error.response?.data;
        }
    }

}

const orderService = new OrderService()

export default orderService;