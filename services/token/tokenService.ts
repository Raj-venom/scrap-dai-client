import * as SecureStore from 'expo-secure-store';

async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
}


async function getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('accessToken');
}

async function getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('refreshToken');
}

async function removeTokens(): Promise<void> {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('role');
}

async function setRole(role: string): Promise<void> {
    await SecureStore.setItemAsync('role', role);
}

async function getRole(): Promise<string | null> {
    return await SecureStore.getItemAsync('role');
}



export {
    setTokens,
    getAccessToken,
    getRefreshToken,
    removeTokens,
    setRole,
    getRole,
}