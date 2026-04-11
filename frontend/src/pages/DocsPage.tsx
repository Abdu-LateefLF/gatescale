import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { Link as RouterLink } from 'react-router-dom';

const EXAMPLE = `SET income = 6000
SET expenses = 4500
CALCULATE surplus = income - expenses
OUTPUT surplus`;

function DocsPage() {
    const { user, isLoading } = useAuth();

    return (
        <Box
            sx={{
                minHeight: '100vh',
            }}
        >
            <Box
                sx={{
                    px: { xs: 2, sm: 3 },
                    pt: 3,
                    pb: 3,
                    maxWidth: 960,
                    mx: 'auto',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{ fontWeight: 700 }}
                    >
                        FinQL reference
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                            variant="body2"
                            color="primary"
                            sx={{ fontWeight: 600, px: 1 }}
                        >
                            Docs
                        </Typography>

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
                </Box>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, mb: 2, maxWidth: 720, lineHeight: 1.7 }}
                >
                    FinQL is a small line-based language for financial-style
                    queries. Each non-empty line is one statement. The
                    playground in the dashboard runs the same engine as the API.
                </Typography>

                <Typography
                    variant="subtitle1"
                    sx={{ mt: 3, mb: 1, fontWeight: 600 }}
                >
                    Line commands
                </Typography>
                <Stack spacing={1.5} component="ul" sx={{ m: 0, pl: 2.5 }}>
                    <Typography
                        component="li"
                        variant="body2"
                        color="text.secondary"
                    >
                        <Typography
                            component="span"
                            sx={{ fontWeight: 600, color: 'primary.dark' }}
                        >
                            SET
                        </Typography>{' '}
                        <Typography
                            component="span"
                            sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                        >
                            name = literal
                        </Typography>{' '}
                        — define a variable (number, boolean, or string
                        literal).
                    </Typography>
                    <Typography
                        component="li"
                        variant="body2"
                        color="text.secondary"
                    >
                        <Typography
                            component="span"
                            sx={{ fontWeight: 600, color: 'primary.dark' }}
                        >
                            CALCULATE
                        </Typography>{' '}
                        <Typography
                            component="span"
                            sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                        >
                            name = expression
                        </Typography>{' '}
                        — assign from an expression using variables and
                        operators.
                    </Typography>
                    <Typography
                        component="li"
                        variant="body2"
                        color="text.secondary"
                    >
                        <Typography
                            component="span"
                            sx={{ fontWeight: 600, color: 'primary.dark' }}
                        >
                            ANALYZE
                        </Typography>{' '}
                        <Typography
                            component="span"
                            sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                        >
                            target USING a, b, …
                        </Typography>{' '}
                        — rule-based analysis into{' '}
                        <Typography
                            component="span"
                            sx={{ fontFamily: 'monospace' }}
                        >
                            target
                        </Typography>
                        .
                    </Typography>
                    <Typography
                        component="li"
                        variant="body2"
                        color="text.secondary"
                    >
                        <Typography
                            component="span"
                            sx={{ fontWeight: 600, color: 'primary.dark' }}
                        >
                            OUTPUT
                        </Typography>{' '}
                        <Typography
                            component="span"
                            sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                        >
                            a, b, …
                        </Typography>{' '}
                        — return values (must appear once, on the last
                        statement).
                    </Typography>
                </Stack>

                <Typography
                    variant="subtitle1"
                    sx={{ mt: 3, mb: 1, fontWeight: 600 }}
                >
                    Example
                </Typography>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                        fontFamily:
                            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        fontSize: '0.8125rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        overflow: 'auto',
                    }}
                >
                    {EXAMPLE}
                </Paper>

                <Divider sx={{ my: 4 }} />

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                >
                    Use{' '}
                    <Typography component="span" fontWeight={600}>
                        API keys
                    </Typography>{' '}
                    from the dashboard to call the API or run queries in the
                    playground.
                </Typography>
            </Box>
        </Box>
    );
}

export default DocsPage;
