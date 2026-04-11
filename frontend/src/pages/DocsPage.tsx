import { Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { Link as RouterLink } from 'react-router-dom';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

const CODE_BLOCK_SX = {
    p: 2,
    bgcolor: 'grey.100',
    borderRadius: 1,
    fontFamily: MONO,
    fontSize: '0.8125rem',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    overflow: 'auto',
} as const;

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <Typography variant="subtitle1" sx={{ mt: 4, mb: 1, fontWeight: 700 }}>
            {children}
        </Typography>
    );
}

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

const FULL_EXAMPLE = `SET income = 6000
SET expenses = 4500
CALCULATE surplus = income - expenses
CALCULATE savingsRate = surplus / income
ANALYZE health USING surplus, income
OUTPUT surplus, savingsRate, health`;

const FULL_RESPONSE = `{
  "results": {
    "surplus": 1500,
    "savingsRate": 0.25,
    "health": "Strong"
  },
  "executionTimeMs": 14
}`;

const REQUEST_EXAMPLE = `POST /api/run HTTP/1.1
Host: your-api-host
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "query": "SET income = 6000\\nSET expenses = 4500\\nCALCULATE surplus = income - expenses\\nOUTPUT surplus"
}`;

const SUCCESS_RESPONSE = `{
  "results": {
    "surplus": 1500
  },
  "executionTimeMs": 8
}`;

const ERROR_RESPONSE_SYNTAX = `{
  "error": "Invalid syntax in CALCULATE statement",
  "line": 3
}`;

const ERROR_RESPONSE_UNDEF = `{
  "error": "Undefined variable: income",
  "line": 2
}`;

const ERROR_RESPONSE_DIV = `{
  "error": "Division by zero",
  "line": 4
}`;

function DocsPage() {
    const { user, isLoading } = useAuth();

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Box
                sx={{
                    px: { xs: 2, sm: 3 },
                    pt: 3,
                    pb: 6,
                    maxWidth: 960,
                    mx: 'auto',
                    width: '100%',
                }}
            >
                {/* ── Nav ── */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                    }}
                >
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
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

                {/* ── Intro ── */}
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 720, lineHeight: 1.75 }}
                >
                    FinQL is a lightweight, line-based language for financial
                    computation. Each non-empty line is one statement. Scripts
                    are stateless — every request runs independently with no
                    shared state between calls. The playground in the dashboard
                    runs the same engine as the HTTP API.
                </Typography>

                {/* ── Full example ── */}
                <SectionTitle>Example script</SectionTitle>
                <Paper variant="outlined" sx={CODE_BLOCK_SX}>
                    {FULL_EXAMPLE}
                </Paper>
                <SectionTitle>Example response</SectionTitle>
                <Paper variant="outlined" sx={CODE_BLOCK_SX}>
                    {FULL_RESPONSE}
                </Paper>

                <Divider sx={{ my: 4 }} />

                {/* ── Commands ── */}
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Commands
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, mb: 2, lineHeight: 1.7 }}
                >
                    FinQL v1 has four commands. Every line must start with one
                    of them; anything else is a parse error.
                </Typography>

                <Stack spacing={3}>
                    {/* SET */}
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                            <Chip
                                label="SET"
                                size="small"
                                sx={{
                                    fontFamily: MONO,
                                    fontWeight: 700,
                                    bgcolor: 'primary.50',
                                    color: 'primary.dark',
                                    border: '1px solid',
                                    borderColor: 'primary.200',
                                }}
                            />
                            <InlineCode>SET name = literal</InlineCode>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            Assigns a literal value to a variable. Supported
                            literal types are <strong>numbers</strong> (integer
                            or decimal), <strong>booleans</strong> (
                            <InlineCode>true</InlineCode> /{' '}
                            <InlineCode>false</InlineCode>), and{' '}
                            <strong>quoted strings</strong>. The variable is
                            then available to all subsequent statements.
                        </Typography>
                        <Paper variant="outlined" sx={{ ...CODE_BLOCK_SX, mt: 1 }}>
                            {`SET income = 6000\nSET rate = 0.05\nSET label = "monthly"`}
                        </Paper>
                    </Box>

                    {/* CALCULATE */}
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                            <Chip
                                label="CALCULATE"
                                size="small"
                                sx={{
                                    fontFamily: MONO,
                                    fontWeight: 700,
                                    bgcolor: 'primary.50',
                                    color: 'primary.dark',
                                    border: '1px solid',
                                    borderColor: 'primary.200',
                                }}
                            />
                            <InlineCode>CALCULATE name = expression</InlineCode>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            Evaluates a mathematical expression and stores the
                            result. Supports{' '}
                            <InlineCode>+</InlineCode>{' '}
                            <InlineCode>-</InlineCode>{' '}
                            <InlineCode>*</InlineCode>{' '}
                            <InlineCode>/</InlineCode>{' '}
                            <InlineCode>^</InlineCode> (exponentiation), and
                            parentheses for grouping. Every variable referenced
                            must already be defined earlier in the script.
                        </Typography>
                        <Paper variant="outlined" sx={{ ...CODE_BLOCK_SX, mt: 1 }}>
                            {`CALCULATE surplus = income - expenses\nCALCULATE savingsRate = surplus / income\nCALCULATE compound = principal * (1 + rate)^years`}
                        </Paper>
                    </Box>

                    {/* ANALYZE */}
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                            <Chip
                                label="ANALYZE"
                                size="small"
                                sx={{
                                    fontFamily: MONO,
                                    fontWeight: 700,
                                    bgcolor: 'primary.50',
                                    color: 'primary.dark',
                                    border: '1px solid',
                                    borderColor: 'primary.200',
                                }}
                            />
                            <InlineCode>ANALYZE target USING a, b, …</InlineCode>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            Runs a rule-based financial analysis over the
                            supplied variables and stores a label in{' '}
                            <InlineCode>target</InlineCode>. In v1 the result
                            is derived from the <em>savings rate</em> (
                            <InlineCode>surplus / income</InlineCode>):
                        </Typography>
                        <Stack
                            component="ul"
                            spacing={0.5}
                            sx={{ mt: 1, mb: 1, pl: 2.5 }}
                        >
                            {[
                                ['Savings rate ≥ 20 %', '"Strong"'],
                                ['Savings rate ≥ 10 %', '"Stable"'],
                                ['Otherwise', '"At Risk"'],
                            ].map(([cond, label]) => (
                                <Typography
                                    key={cond}
                                    component="li"
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {cond} → <InlineCode>{label}</InlineCode>
                                </Typography>
                            ))}
                        </Stack>
                        <Paper variant="outlined" sx={{ ...CODE_BLOCK_SX, mt: 1 }}>
                            {'ANALYZE health USING surplus, income'}
                        </Paper>
                    </Box>

                    {/* OUTPUT */}
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                            <Chip
                                label="OUTPUT"
                                size="small"
                                sx={{
                                    fontFamily: MONO,
                                    fontWeight: 700,
                                    bgcolor: 'primary.50',
                                    color: 'primary.dark',
                                    border: '1px solid',
                                    borderColor: 'primary.200',
                                }}
                            />
                            <InlineCode>OUTPUT a, b, …</InlineCode>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            Returns the listed variables as the response and
                            ends execution. <Keyword>OUTPUT</Keyword> must
                            appear exactly once and must be the{' '}
                            <strong>last</strong> statement in the script.
                            Variables not listed are not returned.
                        </Typography>
                        <Paper variant="outlined" sx={{ ...CODE_BLOCK_SX, mt: 1 }}>
                            {'OUTPUT surplus, savingsRate, health'}
                        </Paper>
                    </Box>
                </Stack>

                <Divider sx={{ my: 4 }} />

                {/* ── Identifiers ── */}
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Identifiers
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, lineHeight: 1.7 }}
                >
                    Variable names must start with a letter and may contain
                    letters, digits, and underscores. They are case-sensitive.
                    The reserved words{' '}
                    {['SET', 'CALCULATE', 'ANALYZE', 'USING', 'OUTPUT'].map(
                        (kw, i, arr) => (
                            <span key={kw}>
                                <InlineCode>{kw}</InlineCode>
                                {i < arr.length - 1 ? ', ' : ''}
                            </span>
                        )
                    )}{' '}
                    cannot be used as variable names (case-insensitive check).
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* ── API reference ── */}
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    API reference
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, mb: 2, lineHeight: 1.7 }}
                >
                    The HTTP API accepts a FinQL script as a JSON body and
                    authenticates via an API key header. Create keys in the
                    dashboard — the full secret is shown only once.
                </Typography>

                <SectionTitle>Endpoint</SectionTitle>
                <Paper variant="outlined" sx={CODE_BLOCK_SX}>
                    {'POST /api/run'}
                </Paper>

                <SectionTitle>Headers</SectionTitle>
                <Stack spacing={1}>
                    {[
                        ['x-api-key', 'Your API key secret (required)'],
                        ['Content-Type', 'application/json'],
                    ].map(([header, desc]) => (
                        <Stack key={header} direction="row" spacing={1.5} alignItems="baseline">
                            <InlineCode>{header}</InlineCode>
                            <Typography variant="body2" color="text.secondary">
                                {desc}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>

                <SectionTitle>Request</SectionTitle>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, lineHeight: 1.7 }}
                >
                    The <InlineCode>query</InlineCode> field is the full FinQL
                    script as a single string. Use{' '}
                    <InlineCode>\n</InlineCode> to separate statements.
                </Typography>
                <Paper variant="outlined" sx={CODE_BLOCK_SX}>
                    {REQUEST_EXAMPLE}
                </Paper>

                <SectionTitle>Success response — 200</SectionTitle>
                <Paper variant="outlined" sx={CODE_BLOCK_SX}>
                    {SUCCESS_RESPONSE}
                </Paper>
                <Stack spacing={1} sx={{ mt: 1.5 }}>
                    {[
                        ['results', 'Object mapping each OUTPUT variable name to its value.'],
                        ['executionTimeMs', 'Server-side execution time in milliseconds.'],
                    ].map(([field, desc]) => (
                        <Stack key={field} direction="row" spacing={1.5} alignItems="baseline">
                            <InlineCode>{field}</InlineCode>
                            <Typography variant="body2" color="text.secondary">
                                {desc}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>

                <SectionTitle>Error responses</SectionTitle>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5, lineHeight: 1.7 }}
                >
                    All errors return a JSON body with an{' '}
                    <InlineCode>error</InlineCode> message and, when
                    applicable, the <InlineCode>line</InlineCode> number where
                    the problem occurred.
                </Typography>

                <Stack spacing={2}>
                    {[
                        ['400 — Parse error (invalid syntax)', ERROR_RESPONSE_SYNTAX],
                        ['400 — Execution error (undefined variable)', ERROR_RESPONSE_UNDEF],
                        ['400 — Execution error (division by zero)', ERROR_RESPONSE_DIV],
                    ].map(([label, code]) => (
                        <Box key={label as string}>
                            <Typography
                                variant="body2"
                                sx={{ mb: 0.75, fontWeight: 500 }}
                            >
                                {label}
                            </Typography>
                            <Paper variant="outlined" sx={CODE_BLOCK_SX}>
                                {code}
                            </Paper>
                        </Box>
                    ))}
                </Stack>

                <Stack spacing={1} sx={{ mt: 1.5 }}>
                    {[
                        ['401', 'Missing or invalid API key.'],
                        ['500', 'Unexpected server error.'],
                    ].map(([status, desc]) => (
                        <Stack key={status} direction="row" spacing={1.5} alignItems="baseline">
                            <InlineCode>{status}</InlineCode>
                            <Typography variant="body2" color="text.secondary">
                                {desc}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}

export default DocsPage;
