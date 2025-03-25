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

    async getNewOrderRequest() {
        try {
            const response = await API.get(`${this.baseUrl}/new-order-request`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getNewOrderRequest :: error', error.response?.data)
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

    async getNearbyOrders(latitude: number, longitude: number) {
        try {
            const response = await API.get(`${this.baseUrl}/nearby-orders?latitude=${latitude}&longitude=${longitude}`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getNearbyOrders :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async getHighValueOrders() {
        try {
            const response = await API.get(`${this.baseUrl}/high-value-orders`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getHighValueOrders :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async getAllPendingOrders() {
        try {
            const response = await API.get(`${this.baseUrl}/pending-orders`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getAllPendingOrders :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async getOrderScheduledForToday() {
        try {
            const response = await API.get(`${this.baseUrl}/today-orders`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getOrderScheduledForToday :: error', error.response?.data)
            return error.response?.data;
        }
    }


}

const orderService = new OrderService()

export default orderService;