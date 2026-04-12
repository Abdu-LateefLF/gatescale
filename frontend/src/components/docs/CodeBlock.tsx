import { Box, Typography } from '@mui/material';

export type CodeLang = 'finql' | 'json' | 'http';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

const LANG_LABEL: Record<CodeLang, string> = {
    finql: 'FinQL',
    json: 'JSON',
    http: 'HTTP',
};

interface CodeBlockProps {
    children: string;
    lang?: CodeLang;
}

function CodeBlock({ children, lang = 'finql' }: CodeBlockProps) {
    return (
        <Box
            sx={{
                borderRadius: 1.5,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'grey.800',
                fontSize: '0.8125rem',
                fontFamily: MONO,
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 0.75,
                    bgcolor: 'grey.900',
                    borderBottom: '1px solid',
                    borderColor: 'grey.800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <Box sx={{ display: 'flex', gap: 0.625 }}>
                    {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                        <Box
                            key={c}
                            sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }}
                        />
                    ))}
                </Box>
                <Typography
                    sx={{
                        fontFamily: MONO,
                        fontSize: '0.7rem',
                        color: 'grey.500',
                        ml: 0.5,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                    }}
                >
                    {LANG_LABEL[lang]}
                </Typography>
            </Box>
            <Box
                component="pre"
                sx={{
                    m: 0,
                    px: 2,
                    py: 1.75,
                    bgcolor: '#1a1b26',
                    color: '#c0caf5',
                    fontFamily: MONO,
                    fontSize: '0.8125rem',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto',
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

export default CodeBlock;
