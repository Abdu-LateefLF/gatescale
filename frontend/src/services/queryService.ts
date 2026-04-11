import apiClient from '../apiClient';
import type { RunQueryResult } from '../types';

export async function runQuery(
    queryText: string,
    apiKeySecret: string
): Promise<RunQueryResult> {
    const response = await apiClient.post<RunQueryResult>(
        '/query/run',
        { query: queryText },
        { headers: { 'x-api-key': apiKeySecret } }
    );
    return response.data;
}

export async function runPlaygroundQuery(
    queryText: string,
    apiKeyId: string
): Promise<RunQueryResult> {
    const response = await apiClient.post<RunQueryResult>(
        `/query/run-playground/${apiKeyId}`,
        { query: queryText }
    );
    return response.data;
}
