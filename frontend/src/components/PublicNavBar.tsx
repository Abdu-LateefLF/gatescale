import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export type PublicNavHighlight = 'home' | 'docs';

interface PublicNavBarProps {
    highlight?: PublicNavHighlight;
}

function PublicNavBar({ highlight }: PublicNavBarProps) {
    const { user, isLoading } = useAuth();

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                py: 1.5,
                px: { xs: 2, sm: 3 },
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}
        >
            <Button
                component={RouterLink}
                to="/"
                color="inherit"
                sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                }}
            >
                FinQL
            </Button>

            <Stack direction="row" spacing={1} alignItems="center">
                {highlight === 'docs' ? (
                    <Typography
                        variant="body2"
                        color="primary"
                        sx={{ fontWeight: 600, px: 1 }}
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
