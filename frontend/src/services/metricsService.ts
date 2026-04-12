import apiClient from '../apiClient';
import type { MetricsSummary, TimeRange, UsageDataPoint } from '../types';

export async function getMetrics(): Promise<MetricsSummary> {
    const response = await apiClient.get<MetricsSummary>('/metrics');
    return response.data;
}

export async function getUsageOverTime(
    range: TimeRange
): Promise<UsageDataPoint[]> {
    const response = await apiClient.get<UsageDataPoint[]>(
        '/metrics/usage-over-time',
        { params: { range } }
    );
    return response.data;
}
