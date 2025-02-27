import API from "../api";
import { removeTokens, setTokens } from "../token/tokenService";


class CollectorAuthService {

    baseUrl = "/collector"


    async login({ identifier, password }: { identifier: string, password: string }) {
        try {
            const response = await API.post(`${this.baseUrl}/login`, {
                identifier,
                password
            });

            return response.data;

        } catch (error: any) {
            console.log('API :: login :: error', error.response?.data || error)
            return error.response?.data;

        }
    }

    async logout() {
        try {
            const response = await API.post(`${this.baseUrl}/logout`);

            await removeTokens();

            return response.data;
        } catch (error: any) {
            console.log('API :: logout :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async getCurrentUser() {
        try {
            const response = await API.get(`${this.baseUrl}/current-user`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getCurrentUser :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async changePassword({ oldPassword, newPassword }: { oldPassword: string, newPassword: string }) {
        try {
            const response = await API.post(`${this.baseUrl}/change-password`, {
                oldPassword,
                newPassword
            });

            return response.data;
        } catch (error: any) {
            console.log('API :: changePassword :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async refreshAccessToken() {
        try {
            const response = await API.post(`${this.baseUrl}/refresh-access-token`);

            await setTokens(response.data.accessToken, response.data.refreshToken);

            return response.data;
        } catch (error: any) {
            console.log('API :: refreshAccessToken :: error', error.response?.data)
            return error.response?.data;
        }
    }

}

const collectorAuthService = new CollectorAuthService()


export default collectorAuthService;