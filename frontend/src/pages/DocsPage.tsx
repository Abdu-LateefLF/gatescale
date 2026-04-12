import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { Link as RouterLink } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import {
    CodeBlock,
    SectionTitle,
    InlineCode,
    Keyword,
} from '../components/docs';
import {
    FULL_EXAMPLE,
    FULL_RESPONSE,
    REQUEST_EXAMPLE,
    SUCCESS_RESPONSE,
    ERROR_RESPONSE_SYNTAX,
    ERROR_RESPONSE_UNDEF,
    ERROR_RESPONSE_DIV,
    ERROR_RESPONSE_ASSERT,
} from '../data/docsExamples';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

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
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <BrandLogo />
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{ fontWeight: 700, color: 'text.primary' }}
                        >
                            reference
                        </Typography>
                    </Stack>

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
                <CodeBlock lang="finql">{FULL_EXAMPLE}</CodeBlock>
                <SectionTitle>Example response</SectionTitle>
                <CodeBlock lang="json">{FULL_RESPONSE}</CodeBlock>

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
                    FinQL v1.1 has seven commands. Every line must start with
                    one of them; anything else is a parse error.
                </Typography>

                <Stack spacing={3}>
                    {/* SET */}
                    <Box>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 0.75 }}
                        >
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
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.7 }}
                        >
                            Assigns a literal value to a variable. Supported
                            literal types are <strong>numbers</strong> (integer
                            or decimal), <strong>booleans</strong> (
                            <InlineCode>true</InlineCode> /{' '}
                            <InlineCode>false</InlineCode>), and{' '}
                            <strong>quoted strings</strong>. The variable is
                            then available to all subsequent statements.
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <CodeBlock lang="finql">{`SET income = 6000\nSET rate = 0.05\nSET label = "monthly"`}</CodeBlock>
                        </Box>
                    </Box>

                    {/* CALCULATE */}
                    <Box>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 0.75 }}
                        >
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
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.7 }}
                        >
                            Evaluates a math expression and stores the result.
                            Operators: <InlineCode>+ - * / ^</InlineCode> and
                            parentheses. Built-in functions:{' '}
                            <InlineCode>
                                sqrt abs round floor ceil log log10 log2 exp pow
                                min max mod sign
                            </InlineCode>
                            . Constants: <InlineCode>pi</InlineCode>{' '}
                            <InlineCode>e</InlineCode>. Every variable
                            referenced must already be defined earlier in the
                            script.
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <CodeBlock lang="finql">{`CALCULATE surplus = income - expenses\nCALCULATE compound = principal * (1 + rate) ^ years\nCALCULATE monthly = round(compound / 12, 2)\nCALCULATE logReturn = log(endPrice / startPrice)`}</CodeBlock>
                        </Box>
                    </Box>

                    {/* ANALYZE */}
                    <Box>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 0.75 }}
                        >
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
                            <InlineCode>
                                ANALYZE target USING a, b, …
                            </InlineCode>
                        </Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.7 }}
                        >
                            Stores a label in <InlineCode>target</InlineCode>{' '}
                            based on the savings rate (
                            <InlineCode>a / b</InlineCode>):
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
                        <Box sx={{ mt: 1 }}>
                            <CodeBlock lang="finql">
                                {'ANALYZE health USING surplus, income'}
                            </CodeBlock>
                        </Box>
                    </Box>

                    {/* FORECAST */}
                    <Box>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 0.75 }}
                        >
                            <Chip
                                label="FORECAST"
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
                            <InlineCode>
                                FORECAST name USING principal, rate FOR n YEARS
                            </InlineCode>
                        </Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.7 }}
                        >
                            Compound growth projection:{' '}
                            <InlineCode>principal × (1 + rate)^n</InlineCode>,
                            rounded to 2 decimal places. The first two{' '}
                            <InlineCode>USING</InlineCode> variables are
                            principal and rate.
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <CodeBlock lang="finql">{`SET principal = 10000\nSET rate = 0.05\nFORECAST futureValue USING principal, rate FOR 5 YEARS\nOUTPUT futureValue`}</CodeBlock>
                        </Box>
                    </Box>

                    {/* SCORE */}
                    <Box>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 0.75 }}
                        >
                            <Chip
                                label="SCORE"
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
                            <InlineCode>SCORE name USING a, b, …</InlineCode>
                        </Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.7 }}
                        >
                            Produces a score 0–100:{' '}
                            <InlineCode>(a / b) × 100</InlineCode>, clamped.
                            Requires at least two numeric variables; throws on
                            division by zero.
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <CodeBlock lang="finql">{`SET income = 6000\nSET expenses = 4500\nCALCULATE surplus = income - expenses\nSCORE stability USING surplus, income\nOUTPUT stability`}</CodeBlock>
                        </Box>
                    </Box>

                    {/* ASSERT */}
                    <Box>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 0.75 }}
                        >
                            <Chip
                                label="ASSERT"
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
                            <InlineCode>ASSERT expression</InlineCode>
                        </Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.7 }}
                        >
                            Halts execution with a structured error if the
                            condition is false. Operators:{' '}
                            <InlineCode>{'> < >= <= == !='}</InlineCode>. Each
                            side can be any numeric expression or variable.
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <CodeBlock lang="finql">{`SET income = 5000\nSET expenses = 6000\nCALCULATE surplus = income - expenses\nASSERT surplus > 0\nOUTPUT surplus`}</CodeBlock>
                        </Box>
                    </Box>

                    {/* OUTPUT */}
                    <Box>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 0.75 }}
                        >
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
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.7 }}
                        >
                            Returns the listed variables as the response and
                            ends execution. <Keyword>OUTPUT</Keyword> must
                            appear exactly once and must be the{' '}
                            <strong>last</strong> statement in the script.
                            Variables not listed are not returned.
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <CodeBlock lang="finql">
                                {'OUTPUT surplus, savingsRate, health'}
                            </CodeBlock>
                        </Box>
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
                    {[
                        'SET',
                        'CALCULATE',
                        'ANALYZE',
                        'FORECAST',
                        'SCORE',
                        'ASSERT',
                        'USING',
                        'FOR',
                        'YEARS',
                        'OUTPUT',
                    ].map((kw, i, arr) => (
                        <span key={kw}>
                            <InlineCode>{kw}</InlineCode>
                            {i < arr.length - 1 ? ', ' : ''}
                        </span>
                    ))}{' '}
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
                <CodeBlock lang="http">{'POST /api/run'}</CodeBlock>

                <SectionTitle>Headers</SectionTitle>
                <Stack spacing={1}>
                    {[
                        ['x-api-key', 'Your API key secret (required)'],
                        ['Content-Type', 'application/json'],
                    ].map(([header, desc]) => (
                        <Stack
                            key={header}
                            direction="row"
                            spacing={1.5}
                            alignItems="baseline"
                        >
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
                    script as a single string. Use <InlineCode>\n</InlineCode>{' '}
                    to separate statements.
                </Typography>
                <CodeBlock lang="http">{REQUEST_EXAMPLE}</CodeBlock>

                <SectionTitle>Success response — 200</SectionTitle>
                <CodeBlock lang="json">{SUCCESS_RESPONSE}</CodeBlock>
                <Stack spacing={1} sx={{ mt: 1.5 }}>
                    {[
                        [
                            'results',
                            'Object mapping each OUTPUT variable name to its value.',
                        ],
                        [
                            'executionTimeMs',
                            'Server-side execution time in milliseconds.',
                        ],
                    ].map(([field, desc]) => (
                        <Stack
                            key={field}
                            direction="row"
                            spacing={1.5}
                            alignItems="baseline"
                        >
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
                    <InlineCode>error</InlineCode> message and, when applicable,
                    the <InlineCode>line</InlineCode> number where the problem
                    occurred.
                </Typography>

                <Stack spacing={2}>
                    {[
                        [
                            '400 — Parse error (invalid syntax)',
                            ERROR_RESPONSE_SYNTAX,
                        ],
                        [
                            '400 — Execution error (undefined variable)',
                            ERROR_RESPONSE_UNDEF,
                        ],
                        [
                            '400 — Execution error (division by zero)',
                            ERROR_RESPONSE_DIV,
                        ],
                        [
                            '400 — Execution error (assertion failed)',
                            ERROR_RESPONSE_ASSERT,
                        ],
                    ].map(([label, code]) => (
                        <Box key={label}>
                            <Typography
                                variant="body2"
                                sx={{ mb: 0.75, fontWeight: 500 }}
                            >
                                {label}
                            </Typography>
                            <CodeBlock lang="json">{code}</CodeBlock>
                        </Box>
                    ))}
                </Stack>

                <Stack spacing={1} sx={{ mt: 1.5 }}>
                    {[
                        ['401', 'Missing or invalid API key.'],
                        ['500', 'Unexpected server error.'],
                    ].map(([status, desc]) => (
                        <Stack
                            key={status}
                            direction="row"
                            spacing={1.5}
                            alignItems="baseline"
                        >
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
