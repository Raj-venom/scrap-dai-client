import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getRefreshToken, getRole, removeTokens, setTokens } from './token/tokenService';
import { USER_ROLE } from '@/constants';

export const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
            console.log("No refresh token available");
            await removeTokens();
            return null;
        }

        const role = await getRole();
        if (!role) {
            console.log("No role found, logging out...");
            await removeTokens();
            return null;
        }

        const endpoint = role === USER_ROLE.USER
            ? "/user/refresh-access-token"
            : "/collector/refresh-access-token";

        // Create a new axios instance to avoid interceptor loop
        const response = await axios.create({
            baseURL: process.env.EXPO_PUBLIC_API_URL,
            headers: { 'Content-Type': 'application/json' },
        }).post(endpoint, { refreshToken });

        const accessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;

        if (accessToken && newRefreshToken) {
            await setTokens(accessToken, newRefreshToken);
            return accessToken;
        }

        return null;
    } catch (error: any) {
        console.log('API :: refreshAccessToken :: error', error.response?.data?.message || error.message);
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

        // Check if the error is due to an expired token (401 Unauthorized)
        // and ensure we don't retry more than once
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loop
            console.log("Token expired, attempting refresh");

            try {
                const newAccessToken = await refreshAccessToken();

                if (newAccessToken) {
                    console.log("Token refreshed successfully");
                    API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return API(originalRequest);
                } else {
                    console.log("Failed to get new token, logging out");
                    await removeTokens();
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                console.log("Error during token refresh:", refreshError);
                await removeTokens();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default API;