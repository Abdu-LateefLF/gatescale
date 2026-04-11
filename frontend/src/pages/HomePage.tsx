import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PublicNavBar from '../components/PublicNavBar';

function HomePage() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
            }}
        >
            <PublicNavBar />

            <Container maxWidth="sm" sx={{ py: { xs: 6, sm: 10 }, px: 3 }}>
                <Stack spacing={3} alignItems="flex-start">
                    <Typography
                        variant="overline"
                        sx={{ letterSpacing: 1.2, color: 'primary.main' }}
                    >
                        Financial queries
                    </Typography>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: '2rem', sm: '2.5rem' },
                            lineHeight: 1.2,
                        }}
                    >
                        Model and run FinQL in one place
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.75, maxWidth: 480 }}
                    >
                        Gate Scale helps you define variables, calculate
                        expressions, and return structured results through a
                        simple line-based language and API.
                    </Typography>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        sx={{ pt: 1 }}
                    >
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            size="large"
                            sx={{ textTransform: 'none', minWidth: 140 }}
                        >
                            Create account
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="outlined"
                            size="large"
                            sx={{ textTransform: 'none', minWidth: 140 }}
                        >
                            Sign in
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/docs"
                            color="inherit"
                            size="large"
                            sx={{ textTransform: 'none' }}
                        >
                            Read the docs
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}

export default HomePage;
