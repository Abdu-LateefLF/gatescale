import { Typography } from '@mui/material';

function Keyword({ children }: { children: React.ReactNode }) {
    return (
        <Typography
            component="span"
            sx={{ fontWeight: 700, color: 'primary.dark' }}
        >
            {children}
        </Typography>
    );
}

export default Keyword;
