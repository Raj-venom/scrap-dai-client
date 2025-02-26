import { userRegisterProps } from "@/types/type";
import API from "./api";
import { removeTokens, setTokens } from "./token/tokenService";

class AuthService {

    baseUrl = "/user"

    async createAccount({ fullName, email, password, phone }: userRegisterProps) {
        try {
            const response = await API.post(`${this.baseUrl}/register`, {
                fullName,
                email,
                password,
                phone
            });

            console.log(response.data);
            return response.data;

        } catch (error: any) {
            console.log('API :: createAccount :: error', error)
            return error.response?.data;
        }
    }

    async verifyUser({ email, otp }: { email: string, otp: string }) {
        try {
            const response = await API.post(`${this.baseUrl}/verify`, {
                email,
                otp
            });

            return response.data;
        } catch (error: any) {
            console.log('API :: verifyUser :: error', error.response?.data)
            return error.response?.data;

        }
    }

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

    async forgotPassword({ email }: { email: string }) {
        try {
            const response = await API.post(`${this.baseUrl}/forgot-password`, {
                email
            });

            return response.data;
        } catch (error: any) {
            console.log('API :: forgotPassword :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async resetPassword({ password, otp, email }: { password: string, otp: string, email: string }) {
        try {
            const response = await API.post(`${this.baseUrl}/reset-password`, {
                password,
                otp,
                email
            });

            return response.data;
        } catch (error: any) {
            console.log('API :: resetPassword :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async requestAccountDeletion() {
        try {
            const response = await API.post(`${this.baseUrl}/request-account-deletion`);

            return response.data;
        } catch (error: any) {
            console.log('API :: requestAccountDeletion :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async cancelAccountDeletion({ cancelToken }: { cancelToken: string }) {
        try {
            const response = await API.post(`${this.baseUrl}/cancel-account-deletion/${cancelToken}`);

            return response.data;
        } catch (error: any) {
            console.log('API :: cancelAccountDeletion :: error', error.response?.data)
            return error.response?.data;
        }
    }



}


const authService = new AuthService();

export default authService;