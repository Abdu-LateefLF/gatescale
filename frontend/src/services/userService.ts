import apiClient from '../apiClient';
import type { User } from '../types';

export async function getUserProfile(): Promise<User> {
    try {
        const response = await apiClient.get<User>('/users/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}
