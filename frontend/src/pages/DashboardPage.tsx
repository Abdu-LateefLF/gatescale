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
import { logout } from '../services/authService';

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

    const { user, setUser } = useAuth();
    const showToast = useToast();

    const handleSignOut = async () => {
        try {
            await logout();
        } catch {
            // proceed regardless
        }
        setUser(null);
        navigate('/login');
    };

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
        <Box sx={{ width: '100%', minHeight: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    px: { xs: 2, sm: 3 },
                }}
            >
                <Stack direction="row" gap={0.5} alignItems="center">
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, fontSize: 24, mr: 1.5 }}
                    >
                        FinQL
                    </Typography>

                    <Button
                        component={RouterLink}
                        to="/docs"
                        variant="text"
                        color="inherit"
                        size="small"
                        sx={{ textTransform: 'none' }}
                    >
                        Docs
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/dashboard/api-keys"
                        variant="text"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            color:
                                activeTab === 'api-keys'
                                    ? 'primary.main'
                                    : 'text.primary',
                            fontWeight: activeTab === 'api-keys' ? 700 : 400,
                            borderBottom:
                                activeTab === 'api-keys'
                                    ? '2px solid'
                                    : '2px solid transparent',
                            borderColor:
                                activeTab === 'api-keys'
                                    ? 'primary.main'
                                    : 'transparent',
                            borderRadius: 0,
                            pb: '2px',
                        }}
                    >
                        Api Keys
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/dashboard/playground"
                        variant="text"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            color:
                                activeTab === 'playground'
                                    ? 'primary.main'
                                    : 'text.primary',
                            fontWeight: activeTab === 'playground' ? 700 : 400,
                            borderBottom:
                                activeTab === 'playground'
                                    ? '2px solid'
                                    : '2px solid transparent',
                            borderColor:
                                activeTab === 'playground'
                                    ? 'primary.main'
                                    : 'transparent',
                            borderRadius: 0,
                            pb: '2px',
                        }}
                    >
                        Playground
                    </Button>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                        {user?.name || 'User'}
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleSignOut}
                        sx={{ textTransform: 'none' }}
                    >
                        Sign out
                    </Button>
                </Stack>
            </Box>

            {activeTab === 'api-keys' && (
                <>
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
                        <ApiKeysTable
                            apiKeys={apiKeys}
                            onClickCreateNewKey={() =>
                                setOpenCreateApiKeyModal(true)
                            }
                            onRevokeApiKey={handleRevokeApiKey}
                        />
                    </Box>
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
