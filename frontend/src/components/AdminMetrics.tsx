import {
    Box,
    CircularProgress,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import type { AdminMetricsSummary, TimeRange, UsageDataPoint } from '../types';
import MetricStatCard from './MetricStatCard';
import UsageChart from './UsageChart';

interface AdminMetricsProps {
    metrics: AdminMetricsSummary | null;
    loading: boolean;
    error: string | null;
    chartRange: TimeRange;
    onChartRangeChange: (range: TimeRange) => void;
    chartData: UsageDataPoint[];
    chartLoading: boolean;
    chartError: string | null;
}

function AdminMetrics({
    metrics,
    loading,
    error,
    chartRange,
    onChartRangeChange,
    chartData,
    chartLoading,
    chartError,
}: AdminMetricsProps) {
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 10,
                }}
            >
                <CircularProgress size={32} />
            </Box>
        );
    }

    if (error || !metrics) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    {error ?? 'No data available.'}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                px: { xs: 2, sm: 3 },
                pt: 3,
                pb: 3,
                maxWidth: 960,
                mx: 'auto',
                width: '100%',
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 18 }}>
                    Admin Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Platform-wide request analytics across all users.
                </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <MetricStatCard
                        label="Total Requests"
                        value={metrics.totalRequests.toLocaleString()}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <MetricStatCard
                        label="Requests Today"
                        value={metrics.requestsToday.toLocaleString()}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <MetricStatCard
                        label="Error Rate"
                        value={`${metrics.errorRate}%`}
                        sub="HTTP 4xx / 5xx responses"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <MetricStatCard
                        label="Total Users"
                        value={metrics.totalUsers.toLocaleString()}
                    />
                </Grid>
            </Grid>

            <Box sx={{ mb: 4 }}>
                <UsageChart
                    range={chartRange}
                    onRangeChange={onChartRangeChange}
                    data={chartData}
                    loading={chartLoading}
                    error={chartError}
                />
            </Box>

            <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}
            >
                Usage per User
            </Typography>

            <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    display: { xs: 'none', sm: 'block' },
                }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">
                                Total Requests
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">
                                Errors
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">
                                Error Rate
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {metrics.usagePerUser.map((row) => {
                            const userErrorRate =
                                row.totalRequests > 0
                                    ? Math.round(
                                          (row.errorRequests /
                                              row.totalRequests) *
                                              10000
                                      ) / 100
                                    : 0;
                            return (
                                <TableRow key={row.userId} hover>
                                    <TableCell>{row.userName}</TableCell>
                                    <TableCell
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        {row.userEmail}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.totalRequests.toLocaleString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.errorRequests.toLocaleString()}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            color:
                                                userErrorRate > 10
                                                    ? 'error.main'
                                                    : userErrorRate > 5
                                                      ? 'warning.main'
                                                      : 'success.main',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {userErrorRate}%
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {metrics.usagePerUser.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    align="center"
                                    sx={{ py: 5, color: 'text.secondary' }}
                                >
                                    No requests recorded yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Stack spacing={1.5} sx={{ display: { xs: 'flex', sm: 'none' } }}>
                {metrics.usagePerUser.map((row) => {
                    const userErrorRate =
                        row.totalRequests > 0
                            ? Math.round((row.errorRequests / row.totalRequests) * 10000) /
                              100
                            : 0;

                    return (
                        <Paper
                            key={row.userId}
                            variant="outlined"
                            sx={{ p: 2, borderRadius: 1 }}
                        >
                            <Stack spacing={1}>
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600, color: 'text.primary' }}
                                    >
                                        {row.userName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {row.userEmail}
                                    </Typography>
                                </Box>

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={2}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        Total Requests
                                    </Typography>
                                    <Typography variant="body2">
                                        {row.totalRequests.toLocaleString()}
                                    </Typography>
                                </Stack>

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={2}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        Errors
                                    </Typography>
                                    <Typography variant="body2">
                                        {row.errorRequests.toLocaleString()}
                                    </Typography>
                                </Stack>

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={2}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        Error Rate
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color:
                                                userErrorRate > 10
                                                    ? 'error.main'
                                                    : userErrorRate > 5
                                                      ? 'warning.main'
                                                      : 'success.main',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {userErrorRate}%
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Paper>
                    );
                })}

                {metrics.usagePerUser.length === 0 && (
                    <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No requests recorded yet.
                        </Typography>
                    </Paper>
                )}
            </Stack>
        </Box>
    );
}

export default AdminMetrics;
