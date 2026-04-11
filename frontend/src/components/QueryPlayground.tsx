import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import FinqlQueryEditor from './FinqlQueryEditor';
import type { ProtectedApiKey, RunQueryResult, RunQueryError } from '../types';

import useToast from '../hooks/useToast';
import QueryResult from './QueryResult';

const EXAMPLE_QUERY = `SET income = 6000
SET expenses = 4500
CALCULATE surplus = income - expenses
OUTPUT surplus`;

interface QueryPlaygroundProps {
    apiKeys: ProtectedApiKey[];
    queryResult: RunQueryResult | null;
    queryError: RunQueryError | null;
    loadingQuery: boolean;
    onRunQuery: (query: string, apiKeyId: string) => void;
}

function QueryPlayground({
    apiKeys,
    queryResult,
    queryError,
    loadingQuery,
    onRunQuery,
}: QueryPlaygroundProps) {
    const [queryText, setQueryText] = useState(EXAMPLE_QUERY);
    const [apiKey, setApiKey] = useState<ProtectedApiKey | null>(null);

    const showToast = useToast();

    const handleRun = async () => {
        if (!apiKey) {
            showToast('Select an API key from the Api Keys tab.', 'error');
            return;
        }

        const query = queryText.trim();
        if (!query) {
            showToast('Enter a query to run.', 'error');
            return;
        }

        onRunQuery(query, apiKey.id);
    };

    const onSelectApiKey = (apiKeyId: string) => {
        const nextKey =
            apiKeys.find((keyEntry) => keyEntry.id === apiKeyId) ?? null;
        setApiKey(nextKey);
    };

    useEffect(() => {
        if (apiKeys.length === 0) {
            setApiKey(null);
            return;
        }
        setApiKey((currentSelection) => {
            if (
                currentSelection &&
                apiKeys.some((keyEntry) => keyEntry.id === currentSelection.id)
            ) {
                return currentSelection;
            }
            return apiKeys[0];
        });
    }, [apiKeys]);

    return (
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
            <Typography
                variant="body2"
                sx={{
                    mb: 2,
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                }}
            >
                Run FinQL queries against the API. Use an API key from the Api
                Keys tab in the header.
            </Typography>

            <Stack spacing={2}>
                <FormControl fullWidth size="small">
                    <InputLabel id="api-key-select-label">API key</InputLabel>
                    <Select
                        labelId="api-key-select-label"
                        label="API key"
                        value={apiKey?.id ?? ''}
                        displayEmpty
                        onChange={(event) =>
                            onSelectApiKey(event.target.value as string)
                        }
                        renderValue={(selectedApiKeyId) => {
                            if (!selectedApiKeyId) {
                                return 'No API keys yet';
                            }
                            const selectedEntry = apiKeys.find(
                                (keyEntry) => keyEntry.id === selectedApiKeyId
                            );
                            return selectedEntry?.name ?? selectedApiKeyId;
                        }}
                    >
                        {apiKeys.map((keyEntry: ProtectedApiKey) => (
                            <MenuItem key={keyEntry.id} value={keyEntry.id}>
                                {keyEntry.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FinqlQueryEditor
                    value={queryText}
                    onChange={setQueryText}
                    minHeight={280}
                />
                <Box>
                    <Button
                        variant="contained"
                        onClick={handleRun}
                        disabled={loadingQuery || !apiKey}
                        sx={{ textTransform: 'none' }}
                    >
                        {loadingQuery ? 'Running…' : 'Run query'}
                    </Button>
                </Box>

                <QueryResult
                    queryResult={queryResult}
                    queryError={queryError}
                />
            </Stack>
        </Box>
    );
}

export default QueryPlayground;
