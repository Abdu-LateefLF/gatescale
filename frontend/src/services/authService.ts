import apiClient from '../apiClient';

export async function login(email: string, password: string) {
    try {
        const response = await apiClient.post('/auth/login', {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function register(
    name: string,
    email: string,
    password: string,
    tier: 'free' | 'pro'
) {
    try {
        const response = await apiClient.post('/auth/register', {
            name,
            email,
            password,
            tier,
        });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export async function refreshToken() {
    try {
        const response = await apiClient.post('/auth/refresh-token');
        return response.data;
    } catch (error) {
        console.error('Token refresh error:', error);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}
