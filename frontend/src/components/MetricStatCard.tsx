import { Paper, Typography } from '@mui/material';

interface MetricStatCardProps {
    label: string;
    value: string | number;
    sub?: string;
}

function MetricStatCard({ label, value, sub }: MetricStatCardProps) {
    return (
        <Paper
            variant="outlined"
            sx={{ p: 3, borderRadius: 1, height: '100%' }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5, fontWeight: 500 }}
            >
                {label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {value}
            </Typography>
            {sub && (
                <Typography variant="caption" color="text.secondary">
                    {sub}
                </Typography>
            )}
        </Paper>
    );
}

export default MetricStatCard;
