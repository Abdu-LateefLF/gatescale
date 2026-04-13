import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import type { TimeRange, UsageDataPoint } from '../types';

const RANGES: { label: string; value: TimeRange }[] = [
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
];

function formatBucket(bucket: string, range: TimeRange): string {
    const date = new Date(bucket);
    if (range === '24h') {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface UsageChartProps {
    range: TimeRange;
    onRangeChange: (range: TimeRange) => void;
    data: UsageDataPoint[];
    loading: boolean;
    error: string | null;
}

function UsageChart({
    range,
    onRangeChange,
    data,
    loading,
    error,
}: UsageChartProps) {
    const chartData = data.map((d) => ({
        ...d,
        label: formatBucket(d.bucket, range),
    }));

    return (
        <Paper
            variant="outlined"
            sx={{ p: { xs: 2, sm: 3 }, borderRadius: 1 }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', sm: 'flex-start' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    mb: 3,
                    gap: 1,
                }}
            >
                <Box>
                    <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                        Requests over time
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Total and failed requests per{' '}
                        {range === '24h' ? 'hour' : 'day'}
                    </Typography>
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ flexWrap: 'wrap' }}
                >
                    {RANGES.map(({ label, value }) => (
                        <Button
                            key={value}
                            onClick={() => onRangeChange(value)}
                            variant={range === value ? 'contained' : 'outlined'}
                            size="small"
                            sx={{
                                textTransform: 'none',
                                minWidth: 44,
                                flex: { xs: '1 1 0', sm: '0 0 auto' },
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </Stack>
            </Box>

            {loading && (
                <Box
                    sx={{
                        height: 240,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CircularProgress size={28} />
                </Box>
            )}

            {!loading && error && (
                <Box
                    sx={{
                        height: 240,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {error}
                    </Typography>
                </Box>
            )}

            {!loading && !error && chartData.length === 0 && (
                <Box
                    sx={{
                        height: 240,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        No requests in this time range.
                    </Typography>
                </Box>
            )}

            {!loading && !error && chartData.length > 0 && (
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart
                        data={chartData}
                        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="gradRequests"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#1976d2"
                                    stopOpacity={0.15}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#1976d2"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="gradErrors"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#d32f2f"
                                    stopOpacity={0.15}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#d32f2f"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11, fill: '#757575' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 11, fill: '#757575' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                fontSize: 12,
                                borderRadius: 6,
                                border: '1px solid #e0e0e0',
                            }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="requests"
                            name="Requests"
                            stroke="#1976d2"
                            strokeWidth={2}
                            fill="url(#gradRequests)"
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="errors"
                            name="Errors"
                            stroke="#d32f2f"
                            strokeWidth={2}
                            fill="url(#gradErrors)"
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </Paper>
    );
}

export default UsageChart;
