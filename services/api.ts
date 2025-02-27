import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getRefreshToken, getRole, removeTokens, setTokens } from './token/tokenService';
import { USER_ROLE } from '@/constants';


export const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");

        const role = await getRole();
        if (!role) {
            console.log("No role found, logging out...");
            await removeTokens();
            return null;
        }

        const endpoint = role === USER_ROLE.USER
            ? "/user/refresh-access-token"
            : "/collector/refresh-access-token";

        const response = await API.post(endpoint, { refreshToken });
        await setTokens(response.data.data.accessToken, response.data.data.refreshToken);

        return response.data.data.accessToken;
    } catch (error: any) {
        console.log('API :: refreshAccessToken :: error', error.response?.data.message || error.message);
        await removeTokens();
        return null;
    }
};

const API = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },

});




// Add an interceptor to attach the token automatically
API.interceptors.request.use(
    async (config) => {
        console.log()
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loop

            const newAccessToken = await refreshAccessToken();

            if (newAccessToken) {
                API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return API(originalRequest); // Retry the failed request
            } else {
                await removeTokens();
            }
        }

        return Promise.reject(error);
    }
);



export default API;