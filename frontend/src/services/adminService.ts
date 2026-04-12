import apiClient from '../apiClient';
import type { AdminMetricsSummary, TimeRange, UsageDataPoint } from '../types';

export async function getAdminMetrics(): Promise<AdminMetricsSummary> {
    const response = await apiClient.get<AdminMetricsSummary>('/admin/metrics');
    return response.data;
}

export async function getAdminUsageOverTime(
    range: TimeRange
): Promise<UsageDataPoint[]> {
    const response = await apiClient.get<UsageDataPoint[]>(
        '/admin/metrics/usage-over-time',
        { params: { range } }
    );
    return response.data;
}
