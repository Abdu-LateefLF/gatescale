import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
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
        <Box sx={{ px: 2, pb: 2, maxWidth: 960 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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

                <TextField
                    label="Query"
                    multiline
                    minRows={10}
                    fullWidth
                    value={queryText}
                    onChange={(event) => setQueryText(event.target.value)}
                    spellCheck={false}
                    sx={{ fontFamily: 'monospace' }}
                />
                <Box>
                    <Button
                        variant="contained"
                        onClick={handleRun}
                        disabled={loadingQuery || !apiKey}
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
