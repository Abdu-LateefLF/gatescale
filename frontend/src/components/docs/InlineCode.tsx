import { Typography } from '@mui/material';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

function InlineCode({ children }: { children: React.ReactNode }) {
    return (
        <Typography
            component="span"
            sx={{
                fontFamily: MONO,
                fontSize: '0.8rem',
                bgcolor: 'grey.100',
                px: 0.5,
                borderRadius: 0.5,
            }}
        >
            {children}
        </Typography>
    );
}

export default InlineCode;
