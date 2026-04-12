import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PublicNavBar from '../components/PublicNavBar';
import { CodeBlock } from '../components/docs';
import { HERO_SNIPPET, HERO_RESPONSE } from '../data/homeExamples';

function HomePage() {
    return (
        <Box sx={{ minHeight: '100vh' }}>
            <PublicNavBar />

            <Box
                sx={{
                    maxWidth: 1100,
                    mx: 'auto',
                    px: { xs: 3, sm: 4 },
                    pt: { xs: 6, sm: 10 },
                    pb: { xs: 8, sm: 12 },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { md: 'center' },
                    gap: { xs: 6, md: 8 },
                }}
            >
                {/* ── Left: copy ── */}
                <Box sx={{ flex: '0 0 auto', maxWidth: { md: 420 } }}>
                    <Typography
                        variant="overline"
                        sx={{ letterSpacing: 1.2, color: 'primary.main' }}
                    >
                        Financial scripting API
                    </Typography>

                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: '2rem', sm: '2.4rem' },
                            lineHeight: 1.2,
                            mt: 1,
                            mb: 2,
                        }}
                    >
                        Run financial logic over an API
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.8, mb: 1 }}
                    >
                        Welcome to FinQL, a lightweight, finance-focused
                        domain-specific language (DSL). Users can run financial
                        logic through a simple, sequential scripting syntax.
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.8, mb: 3 }}
                    >
                        Authenticate with an API key. No infrastructure to
                        manage.
                    </Typography>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                    >
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            size="large"
                            sx={{ textTransform: 'none', minWidth: 140 }}
                        >
                            Get started
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/docs"
                            variant="outlined"
                            size="large"
                            sx={{ textTransform: 'none', minWidth: 140 }}
                        >
                            Read the docs
                        </Button>
                    </Stack>
                </Box>

                {/* ── Right: code preview ── */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack spacing={1.5}>
                        <CodeBlock lang="finql">{HERO_SNIPPET}</CodeBlock>
                        <CodeBlock lang="json">{HERO_RESPONSE}</CodeBlock>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

export default HomePage;
