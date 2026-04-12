import { apiRequestLogsTable } from '../db/schemas/apiRequestLogs.js';
import { apiKeysTable } from '../db/schemas/apiKeys.js';
import { usersTable } from '../db/schemas/users.js';
import { CreateApiRequestLogParams } from '../db/types.js';
import db from '../index.js';
import { and, count, eq, gte, sql } from 'drizzle-orm';

export type TimeRange = '24h' | '7d' | '30d';

export interface UsageDataPoint {
    bucket: string;
    requests: number;
    errors: number;
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
    dailyLimit: number;
    usagePerApiKey: ApiKeyUsageStat[];
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

class ApiRequestLogsRepository {
    async insert(params: CreateApiRequestLogParams): Promise<void> {
        await db.insert(apiRequestLogsTable).values(params);
    }

    async getMetricsByUserId(userId: string, dailyLimit: number): Promise<MetricsSummary> {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [totalRow] = await db
            .select({ count: count() })
            .from(apiRequestLogsTable)
            .innerJoin(
                apiKeysTable,
                eq(apiRequestLogsTable.apiKeyId, apiKeysTable.id)
            )
            .where(eq(apiKeysTable.userId, userId));

        const [todayRow] = await db
            .select({ count: count() })
            .from(apiRequestLogsTable)
            .innerJoin(
                apiKeysTable,
                eq(apiRequestLogsTable.apiKeyId, apiKeysTable.id)
            )
            .where(
                and(
                    eq(apiKeysTable.userId, userId),
                    gte(apiRequestLogsTable.createdAt, todayStart)
                )
            );

        const [errorRow] = await db
            .select({ count: count() })
            .from(apiRequestLogsTable)
            .innerJoin(
                apiKeysTable,
                eq(apiRequestLogsTable.apiKeyId, apiKeysTable.id)
            )
            .where(
                and(
                    eq(apiKeysTable.userId, userId),
                    gte(apiRequestLogsTable.statusCode, 400)
                )
            );

        const perKeyRows = await db
            .select({
                apiKeyId: apiRequestLogsTable.apiKeyId,
                apiKeyName: apiKeysTable.name,
                totalRequests: count(),
                errorRequests: sql<number>`COUNT(*) FILTER (WHERE ${apiRequestLogsTable.statusCode} >= 400)`,
            })
            .from(apiRequestLogsTable)
            .innerJoin(
                apiKeysTable,
                eq(apiRequestLogsTable.apiKeyId, apiKeysTable.id)
            )
            .where(eq(apiKeysTable.userId, userId))
            .groupBy(apiRequestLogsTable.apiKeyId, apiKeysTable.name);

        const totalRequests = totalRow?.count ?? 0;
        const errorCount = errorRow?.count ?? 0;

        return {
            totalRequests,
            requestsToday: todayRow?.count ?? 0,
            errorRate:
                totalRequests > 0
                    ? Math.round((errorCount / totalRequests) * 10000) / 100
                    : 0,
            dailyLimit,
            usagePerApiKey: perKeyRows.map((row) => ({
                apiKeyId: row.apiKeyId,
                apiKeyName: row.apiKeyName,
                totalRequests: row.totalRequests,
                errorRequests: Number(row.errorRequests),
            })),
        };
    }

    async getUsageOverTime(
        userId: string,
        range: TimeRange
    ): Promise<UsageDataPoint[]> {
        const now = new Date();
        const since = new Date(now);

        if (range === '24h') {
            since.setHours(since.getHours() - 24);
        } else if (range === '7d') {
            since.setDate(since.getDate() - 7);
        } else {
            since.setDate(since.getDate() - 30);
        }

        const granularity = sql.raw(range === '24h' ? 'hour' : 'day');
        const bucketExpr = sql<string>`date_trunc('${granularity}', ${apiRequestLogsTable.createdAt})`;

        const rows = await db
            .select({
                bucket: sql<string>`${bucketExpr}::text`,
                requests: count(),
                errors: sql<number>`COUNT(*) FILTER (WHERE ${apiRequestLogsTable.statusCode} >= 400)`,
            })
            .from(apiRequestLogsTable)
            .innerJoin(
                apiKeysTable,
                eq(apiRequestLogsTable.apiKeyId, apiKeysTable.id)
            )
            .where(
                and(
                    eq(apiKeysTable.userId, userId),
                    gte(apiRequestLogsTable.createdAt, since)
                )
            )
            .groupBy(bucketExpr)
            .orderBy(bucketExpr);

        return rows.map((row) => ({
            bucket: row.bucket,
            requests: row.requests,
            errors: Number(row.errors),
        }));
    }

    async getAdminMetrics(): Promise<AdminMetricsSummary> {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [totalRow] = await db
            .select({ count: count() })
            .from(apiRequestLogsTable);

        const [todayRow] = await db
            .select({ count: count() })
            .from(apiRequestLogsTable)
            .where(gte(apiRequestLogsTable.createdAt, todayStart));

        const [errorRow] = await db
            .select({ count: count() })
            .from(apiRequestLogsTable)
            .where(gte(apiRequestLogsTable.statusCode, 400));

        const [userCountRow] = await db
            .select({ count: count() })
            .from(usersTable);

        const perUserRows = await db
            .select({
                userId: usersTable.id,
                userName: usersTable.name,
                userEmail: usersTable.email,
                totalRequests: count(),
                errorRequests: sql<number>`COUNT(*) FILTER (WHERE ${apiRequestLogsTable.statusCode} >= 400)`,
            })
            .from(apiRequestLogsTable)
            .innerJoin(
                apiKeysTable,
                eq(apiRequestLogsTable.apiKeyId, apiKeysTable.id)
            )
            .innerJoin(usersTable, eq(apiKeysTable.userId, usersTable.id))
            .groupBy(usersTable.id, usersTable.name, usersTable.email);

        const totalRequests = totalRow?.count ?? 0;
        const errorCount = errorRow?.count ?? 0;

        return {
            totalRequests,
            requestsToday: todayRow?.count ?? 0,
            errorRate:
                totalRequests > 0
                    ? Math.round((errorCount / totalRequests) * 10000) / 100
                    : 0,
            totalUsers: userCountRow?.count ?? 0,
            usagePerUser: perUserRows.map((row) => ({
                userId: row.userId,
                userName: row.userName,
                userEmail: row.userEmail,
                totalRequests: row.totalRequests,
                errorRequests: Number(row.errorRequests),
            })),
        };
    }

    async getAdminUsageOverTime(range: TimeRange): Promise<UsageDataPoint[]> {
        const now = new Date();
        const since = new Date(now);

        if (range === '24h') {
            since.setHours(since.getHours() - 24);
        } else if (range === '7d') {
            since.setDate(since.getDate() - 7);
        } else {
            since.setDate(since.getDate() - 30);
        }

        const granularity = sql.raw(range === '24h' ? 'hour' : 'day');
        const bucketExpr = sql<string>`date_trunc('${granularity}', ${apiRequestLogsTable.createdAt})`;

        const rows = await db
            .select({
                bucket: sql<string>`${bucketExpr}::text`,
                requests: count(),
                errors: sql<number>`COUNT(*) FILTER (WHERE ${apiRequestLogsTable.statusCode} >= 400)`,
            })
            .from(apiRequestLogsTable)
            .where(gte(apiRequestLogsTable.createdAt, since))
            .groupBy(bucketExpr)
            .orderBy(bucketExpr);

        return rows.map((row) => ({
            bucket: row.bucket,
            requests: row.requests,
            errors: Number(row.errors),
        }));
    }
}

const apiRequestLogsRepository = new ApiRequestLogsRepository();
export default apiRequestLogsRepository;
