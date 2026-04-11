import { Box, Typography, Paper } from '@mui/material';
import type { RunQueryError, RunQueryResult } from '../types';

interface QueryResultProps {
    queryResult: RunQueryResult | null;
    queryError: RunQueryError | null;
}

function QueryResult({ queryResult, queryError }: QueryResultProps) {
    if (queryError) {
        return (
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    Query error:
                </Typography>
                <Typography variant="body2" color="error">
                    <span style={{ fontWeight: 'bold', color: 'blue' }}>
                        {queryError.line != null
                            ? `Line ${queryError.line} => `
                            : ''}
                    </span>
                    {queryError.error}
                </Typography>
            </Paper>
        );
    }

    if (!queryResult) {
        return (
            <Typography variant="body2" color="text.secondary">
                Run a query to see the results.
            </Typography>
        );
    }

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
                {queryResult?.executionTimeMs} ms
            </Typography>
            <Box
                component="pre"
                sx={{
                    m: 0,
                    mt: 1,
                    fontSize: 13,
                    overflow: 'auto',
                    fontFamily: 'monospace',
                }}
            >
                {JSON.stringify(queryResult?.results, null, 2)}
            </Box>
        </Paper>
    );
}

export default QueryResult;
