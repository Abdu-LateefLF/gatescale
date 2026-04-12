import { Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface BrandLogoProps {
    /** Icon size in px. Defaults to 36. */
    iconSize?: number;
    /** Font size in px. Defaults to 26. */
    fontSize?: number;
    /** When true, wraps in a RouterLink to "/". Defaults to true. */
    asLink?: boolean;
}

function BrandLogo({ iconSize = 36, fontSize = 26, asLink = true }: BrandLogoProps) {
    const content = (
        <Stack direction="row" alignItems="center" spacing={1}>
            <img
                src="/finql-icon.png"
                alt="FinQL"
                style={{ width: iconSize, height: iconSize, display: 'block' }}
            />
            <span
                style={{
                    fontWeight: 700,
                    fontSize,
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, #185FA5 0%, #0C447C 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: 'inherit',
                }}
            >
                FinQL
            </span>
        </Stack>
    );

    if (!asLink) return content;

    return (
        <RouterLink
            to="/"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
        >
            {content}
        </RouterLink>
    );
}

export default BrandLogo;
