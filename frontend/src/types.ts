export interface User {
    id: string;
    name: string;
    email: string;
    tier: 'free' | 'pro';
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
}

export interface ApiKey {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    expiresAt: string;
}

export interface CreateApiKeyFormInputs {
    name: string;
    expiresAt: Date;
}

export type ProtectedApiKey = Omit<ApiKey, 'key'>;

export interface GenerateReportRequest {
    income: number;
    expenses: number;
    currentSavings: number;
    interestRate: number;
    years: number;
}

export interface GenerateReportResult {
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySavings: number;
    monthlySurplus: number;
    projectedSavings: number;
    financialHealthScore: number;
    advice: string;
}

export interface RunQueryResult {
    results: Record<string, unknown>;
    executionTimeMs: number;
}

export interface RunQueryError {
    error: string;
    line?: number;
}

export interface ApiKeyUsageStat {
    apiKeyId: string;
    apiKeyName: string;
    totalRequests: number;
    errorRequests: number;
}

export interface MetricsSummary {
    totalRequests: number;
    requestsToday: number;
    errorRate: number;
    usagePerApiKey: ApiKeyUsageStat[];
}

export type TimeRange = '24h' | '7d' | '30d';

export interface UsageDataPoint {
    bucket: string;
    requests: number;
    errors: number;
}

export interface UserMetricsStat {
    userId: string;
    userName: string;
    userEmail: string;
    totalRequests: number;
    errorRequests: number;
}

export interface AdminMetricsSummary {
    totalRequests: number;
    requestsToday: number;
    errorRate: number;
    totalUsers: number;
    usagePerUser: UserMetricsStat[];
}
