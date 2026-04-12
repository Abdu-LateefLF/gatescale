import { useState } from 'react';
import { AxiosError } from 'axios';
import type { RunQueryError, RunQueryResult } from '../types';
import { runPlaygroundQuery } from '../services/queryService';
import useToast from './useToast';

export function usePlaygroundQuery() {
    const [queryResult, setQueryResult] = useState<RunQueryResult | null>(null);
    const [queryError, setQueryError] = useState<RunQueryError | null>(null);
    const [loadingQuery, setLoadingQuery] = useState(false);

    const showToast = useToast();

    const handleRunQuery = async (query: string, apiKeyId: string) => {
        setQueryResult(null);
        setQueryError(null);

        try {
            setLoadingQuery(true);
            const result = await runPlaygroundQuery(query, apiKeyId);
            setQueryResult(result);
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Query error:', error.response?.data);
                setQueryError(error.response?.data || null);
                showToast('Failed to run query', 'error');
            }
        } finally {
            setLoadingQuery(false);
        }
    };

    return { queryResult, queryError, loadingQuery, handleRunQuery };
}
