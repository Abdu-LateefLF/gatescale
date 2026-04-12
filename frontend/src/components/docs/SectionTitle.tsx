import { Typography } from '@mui/material';

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <Typography variant="subtitle1" sx={{ mt: 4, mb: 1, fontWeight: 700 }}>
            {children}
        </Typography>
    );
}

export default SectionTitle;
