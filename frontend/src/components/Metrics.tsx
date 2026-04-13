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
import type { MetricsSummary, TimeRange, UsageDataPoint } from '../types';
import MetricStatCard from './MetricStatCard';
import UsageChart from './UsageChart';

interface MetricsProps {
    metrics: MetricsSummary | null;
    loading: boolean;
    error: string | null;
    chartRange: TimeRange;
    onChartRangeChange: (range: TimeRange) => void;
    chartData: UsageDataPoint[];
    chartLoading: boolean;
    chartError: string | null;
}

function Metrics({
    metrics,
    loading,
    error,
    chartRange,
    onChartRangeChange,
    chartData,
    chartLoading,
    chartError,
}: MetricsProps) {
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
                    Usage Metrics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Request analytics across all your API keys.
                </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <MetricStatCard
                        label="Total Requests"
                        value={metrics.totalRequests.toLocaleString()}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <MetricStatCard
                        label="Requests Today"
                        value={metrics.requestsToday.toLocaleString()}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <MetricStatCard
                        label="Error Rate"
                        value={`${metrics.errorRate}%`}
                        sub="HTTP 4xx / 5xx responses"
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
                Usage per API Key
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
                            <TableCell sx={{ fontWeight: 600 }}>
                                API Key Name
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">
                                Total Requests
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">
                                Daily Limit
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
                        {metrics.usagePerApiKey.map((row) => {
                            const keyErrorRate =
                                row.totalRequests > 0
                                    ? Math.round(
                                          (row.errorRequests /
                                              row.totalRequests) *
                                              10000
                                      ) / 100
                                    : 0;
                            return (
                                <TableRow key={row.apiKeyId} hover>
                                    <TableCell>{row.apiKeyName}</TableCell>
                                    <TableCell align="right">
                                        {row.totalRequests.toLocaleString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        {metrics.dailyLimit.toLocaleString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.errorRequests.toLocaleString()}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            color:
                                                keyErrorRate > 10
                                                    ? 'error.main'
                                                    : keyErrorRate > 5
                                                      ? 'warning.main'
                                                      : 'success.main',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {keyErrorRate}%
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {metrics.usagePerApiKey.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    align="center"
                                    sx={{ py: 5, color: 'text.secondary' }}
                                >
                                    No requests recorded yet. Use your API keys
                                    to start tracking usage.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Stack spacing={1.5} sx={{ display: { xs: 'flex', sm: 'none' } }}>
                {metrics.usagePerApiKey.map((row) => {
                    const keyErrorRate =
                        row.totalRequests > 0
                            ? Math.round((row.errorRequests / row.totalRequests) * 10000) /
                              100
                            : 0;

                    return (
                        <Paper
                            key={row.apiKeyId}
                            variant="outlined"
                            sx={{ p: 2, borderRadius: 1 }}
                        >
                            <Stack spacing={1}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 600, color: 'text.primary' }}
                                >
                                    {row.apiKeyName}
                                </Typography>

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
                                        Daily Limit
                                    </Typography>
                                    <Typography variant="body2">
                                        {metrics.dailyLimit.toLocaleString()}
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
                                                keyErrorRate > 10
                                                    ? 'error.main'
                                                    : keyErrorRate > 5
                                                      ? 'warning.main'
                                                      : 'success.main',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {keyErrorRate}%
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Paper>
                    );
                })}

                {metrics.usagePerApiKey.length === 0 && (
                    <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No requests recorded yet. Use your API keys to start
                            tracking usage.
                        </Typography>
                    </Paper>
                )}
            </Stack>
        </Box>
    );
}

export default Metrics;
