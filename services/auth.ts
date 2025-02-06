import { userRegisterProps } from "@/types/type";
import API from "./api";



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

}


const authService = new AuthService();

export default authService;