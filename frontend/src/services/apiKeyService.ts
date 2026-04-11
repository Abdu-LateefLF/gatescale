import apiClient from '../apiClient';
import type { ApiKey, CreateApiKeyFormInputs, ProtectedApiKey } from '../types';

export async function createApiKey(
    data: CreateApiKeyFormInputs
): Promise<ApiKey> {
    const response = await apiClient.post<ApiKey>('/api-keys', data);
    return response.data;
}

export async function getApiKeys(): Promise<ProtectedApiKey[]> {
    const response = await apiClient.get<ProtectedApiKey[]>('/api-keys');
    return response.data;
}

export async function revokeApiKey(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/api-keys/${id}`);
    return response.data;
}
