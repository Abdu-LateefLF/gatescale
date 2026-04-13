import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import BrandLogo from './BrandLogo';

export type PublicNavHighlight = 'home' | 'docs';

interface PublicNavBarProps {
    highlight?: PublicNavHighlight;
}

function PublicNavBar({ highlight }: PublicNavBarProps) {
    const { user, isLoading } = useAuth();

    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            spacing={{ xs: 1.5, sm: 0 }}
            sx={{
                py: 1.5,
                px: { xs: 2, sm: 3 },
                maxWidth: 960,
                mx: 'auto',
                width: '100%',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <BrandLogo />
            </Box>

            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent={{ xs: 'center', sm: 'flex-end' }}
                useFlexGap
                sx={{ flexWrap: 'wrap', width: '100%' }}
            >
                {highlight === 'docs' ? (
                    <Typography
                        variant="body2"
                        color="primary"
                        sx={{ fontWeight: 600, px: 1, py: 0.5 }}
                    >
                        Docs
                    </Typography>
                ) : (
                    <Button
                        component={RouterLink}
                        to="/docs"
                        color="inherit"
                        size="small"
                        sx={{ textTransform: 'none' }}
                    >
                        Docs
                    </Button>
                )}

                {!isLoading && user ? (
                    <Button
                        component={RouterLink}
                        to="/dashboard/api-keys"
                        variant="contained"
                        size="small"
                        sx={{ textTransform: 'none' }}
                    >
                        Dashboard
                    </Button>
                ) : !isLoading ? (
                    <>
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="outlined"
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            Sign in
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            Sign up
                        </Button>
                    </>
                ) : null}
            </Stack>
        </Stack>
    );
}

export default PublicNavBar;
