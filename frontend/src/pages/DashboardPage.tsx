import { useCallback, useEffect, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import useAuth from '../hooks/useAuth';
import ApiKeysTable from '../components/ApiKeysTable';
import type {
    ApiKey,
    CreateApiKeyFormInputs,
    ProtectedApiKey,
    RunQueryResult,
    RunQueryError,
} from '../types';
import {
    createApiKey,
    getApiKeys,
    revokeApiKey,
} from '../services/apiKeyService';
import useToast from '../hooks/useToast';
import ShowApiKeyModal from '../components/ShowApiKeyModal';
import CreateApiKeyModal from '../components/CreateApiKeyModal';
import { AxiosError } from 'axios';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import QueryPlayground from '../components/QueryPlayground';
import { runPlaygroundQuery } from '../services/queryService';

const DASHBOARD_TABS = ['api-keys', 'playground'] as const;
type DashboardTab = (typeof DASHBOARD_TABS)[number];

function normalizeTabParam(routeTabSlug: string | undefined): DashboardTab {
    if (routeTabSlug === 'playground') return 'playground';
    return 'api-keys';
}

function DashboardPage() {
    const [apiKeys, setApiKeys] = useState<ProtectedApiKey[]>([]);
    const [apiKeyToShow, setApiKeyToShow] = useState<ApiKey | null>(null);
    const [openShowApiKeyModal, setOpenShowApiKeyModal] = useState(false);
    const [openCreateApiKeyModal, setOpenCreateApiKeyModal] = useState(false);

    const [queryResult, setQueryResult] = useState<RunQueryResult | null>(null);
    const [queryError, setQueryError] = useState<RunQueryError | null>(null);
    const [loadingQuery, setLoadingQuery] = useState(false);

    const routeParams = useParams<{ tab: string }>();
    const navigate = useNavigate();
    const activeTab = normalizeTabParam(routeParams.tab);

    const [isCreatingApiKey, setIsCreatingApiKey] = useState(false);

    const { user } = useAuth();
    const showToast = useToast();

    const fetchApiKeys = useCallback(async () => {
        if (!user?.id) return;

        const fetchedApiKeys = await getApiKeys();
        setApiKeys(
            fetchedApiKeys.map((apiKey: ProtectedApiKey) => ({
                id: apiKey.id,
                name: apiKey.name,
                createdAt: apiKey.createdAt,
                expiresAt: apiKey.expiresAt,
            }))
        );
    }, [user?.id]);

    const handleCreateNewKey = async (
        createKeyFormInputs: CreateApiKeyFormInputs
    ) => {
        try {
            setIsCreatingApiKey(true);

            const newApiKey = await createApiKey(createKeyFormInputs);

            setOpenCreateApiKeyModal(false);
            setOpenShowApiKeyModal(true);
            setApiKeyToShow(newApiKey);
            fetchApiKeys();

            showToast('API key created successfully', 'success');
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(
                    'Failed to create API key:' + error.response?.data?.error,
                    'error'
                );
            } else {
                showToast('Failed to create API key', 'error');
            }
        } finally {
            setIsCreatingApiKey(false);
        }
    };

    const handleRevokeApiKey = async (apiKeyId: string) => {
        try {
            await revokeApiKey(apiKeyId);
            fetchApiKeys();

            showToast('API key revoked successfully', 'success');
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(
                    'Failed to revoke API key:' + error.response?.data?.error,
                    'error'
                );
            } else {
                showToast('Failed to revoke API key', 'error');
            }
        }
    };

    const handleRunQuery = async (query: string, apiKeyId: string) => {
        setQueryResult(null);
        setQueryError(null);

        try {
            setLoadingQuery(true);
            const queryResult = await runPlaygroundQuery(query, apiKeyId);
            setQueryResult(queryResult);
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

    useEffect(() => {
        if (user?.id) {
            fetchApiKeys();
        }
    }, [user?.id, fetchApiKeys]);

    useEffect(() => {
        const routeTabSlug = routeParams.tab;
        if (
            routeTabSlug &&
            !DASHBOARD_TABS.includes(routeTabSlug as DashboardTab)
        ) {
            navigate('/dashboard/api-keys', { replace: true });
        }
    }, [routeParams.tab, navigate]);

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 2,
                }}
            >
                <Stack direction="row" gap={2}>
                    <Typography variant="h1" sx={{ fontSize: '24px' }}>
                        Dashboard Page
                    </Typography>

                    <Button
                        component={RouterLink}
                        to="/dashboard/api-keys"
                        variant="text"
                        color="primary"
                        sx={{
                            fontWeight: activeTab === 'api-keys' ? 600 : 400,
                            textDecoration:
                                activeTab === 'api-keys' ? 'underline' : 'none',
                        }}
                    >
                        Api Keys
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/dashboard/playground"
                        variant="text"
                        color="primary"
                        sx={{
                            fontWeight: activeTab === 'playground' ? 600 : 400,
                            textDecoration:
                                activeTab === 'playground'
                                    ? 'underline'
                                    : 'none',
                        }}
                    >
                        Playground
                    </Button>
                </Stack>

                <Typography>Hi {user?.name || 'User'}!</Typography>
            </Box>

            {activeTab === 'api-keys' && (
                <>
                    <ApiKeysTable
                        apiKeys={apiKeys}
                        onClickCreateNewKey={() =>
                            setOpenCreateApiKeyModal(true)
                        }
                        onRevokeApiKey={handleRevokeApiKey}
                    />
                    <CreateApiKeyModal
                        open={openCreateApiKeyModal}
                        loading={isCreatingApiKey}
                        onSubmit={handleCreateNewKey}
                        onClose={() => setOpenCreateApiKeyModal(false)}
                    />

                    <ShowApiKeyModal
                        open={openShowApiKeyModal}
                        onClose={() => setOpenShowApiKeyModal(false)}
                        apiKey={apiKeyToShow}
                    />
                </>
            )}

            {activeTab === 'playground' && (
                <QueryPlayground
                    apiKeys={apiKeys}
                    queryResult={queryResult}
                    queryError={queryError}
                    loadingQuery={loadingQuery}
                    onRunQuery={handleRunQuery}
                />
            )}
        </Box>
    );
}

export default DashboardPage;
