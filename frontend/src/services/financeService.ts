import apiClient from '../apiClient';
import type { GenerateReportRequest, GenerateReportResult } from '../types';

export async function generateForecast(
    data: GenerateReportRequest
): Promise<GenerateReportResult> {
    const response = await apiClient.post<GenerateReportResult>(
        '/finance/generate-report',
        data
    );
    return response.data;
}
