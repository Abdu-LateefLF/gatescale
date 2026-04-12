import { useEffect } from 'react';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { useApiKeys } from '../hooks/useApiKeys';
import { usePlaygroundQuery } from '../hooks/usePlaygroundQuery';
import { useMetrics } from '../hooks/useMetrics';
import { useUsageOverTime } from '../hooks/useUsageOverTime';
import { useAdminMetrics } from '../hooks/useAdminMetrics';
import { useAdminUsageOverTime } from '../hooks/useAdminUsageOverTime';
import ApiKeysTable from '../components/ApiKeysTable';
import ShowApiKeyModal from '../components/ShowApiKeyModal';
import CreateApiKeyModal from '../components/CreateApiKeyModal';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import QueryPlayground from '../components/QueryPlayground';
import Metrics from '../components/Metrics';
import AdminMetrics from '../components/AdminMetrics';
import { logout } from '../services/authService';

const DASHBOARD_TABS = ['api-keys', 'playground', 'metrics', 'admin'] as const;
type DashboardTab = (typeof DASHBOARD_TABS)[number];

function normalizeTabParam(
    routeTabSlug: string | undefined,
    isAdmin: boolean
): DashboardTab {
    if (routeTabSlug === 'playground') return 'playground';
    if (routeTabSlug === 'metrics') return 'metrics';
    if (routeTabSlug === 'admin' && isAdmin) return 'admin';
    return 'api-keys';
}

function DashboardPage() {
    const routeParams = useParams<{ tab: string }>();
    const navigate = useNavigate();

    const { user, setUser } = useAuth();
    const isAdmin = user?.role === 'admin';

    const activeTab = normalizeTabParam(routeParams.tab, isAdmin);

    const {
        apiKeys,
        apiKeyToShow,
        openShowApiKeyModal,
        openCreateApiKeyModal,
        isCreatingApiKey,
        setOpenShowApiKeyModal,
        setOpenCreateApiKeyModal,
        handleCreateNewKey,
        handleRevokeApiKey,
    } = useApiKeys();

    const { queryResult, queryError, loadingQuery, handleRunQuery } =
        usePlaygroundQuery();

    const { metrics, loadingMetrics, metricsError } = useMetrics(
        activeTab === 'metrics'
    );

    const {
        range: chartRange,
        setRange: setChartRange,
        data: chartData,
        loading: chartLoading,
        error: chartError,
    } = useUsageOverTime(activeTab === 'metrics');

    const {
        metrics: adminMetrics,
        loading: adminLoading,
        error: adminError,
    } = useAdminMetrics(activeTab === 'admin');

    const {
        range: adminChartRange,
        setRange: setAdminChartRange,
        data: adminChartData,
        loading: adminChartLoading,
        error: adminChartError,
    } = useAdminUsageOverTime(activeTab === 'admin');

    const handleSignOut = async () => {
        try {
            await logout();
        } catch {
            // proceed regardless
        }
        setUser(null);
        navigate('/login');
    };

    useEffect(() => {
        const routeTabSlug = routeParams.tab;
        if (!routeTabSlug) return;
        const validTabs: readonly DashboardTab[] = isAdmin
            ? DASHBOARD_TABS
            : DASHBOARD_TABS.filter((t) => t !== 'admin');
        if (!validTabs.includes(routeTabSlug as DashboardTab)) {
            navigate('/dashboard/api-keys', { replace: true });
        }
    }, [routeParams.tab, navigate, isAdmin]);

    const tabButtonSx = (tab: DashboardTab) => ({
        textTransform: 'none',
        color: activeTab === tab ? 'primary.main' : 'text.primary',
        fontWeight: activeTab === tab ? 700 : 400,
        borderBottom: activeTab === tab ? '2px solid' : '2px solid transparent',
        borderColor: activeTab === tab ? 'primary.main' : 'transparent',
        borderRadius: 0,
        pb: '2px',
    });

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
                        sx={tabButtonSx('api-keys')}
                    >
                        API Keys
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/dashboard/playground"
                        variant="text"
                        size="small"
                        sx={tabButtonSx('playground')}
                    >
                        Playground
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/dashboard/metrics"
                        variant="text"
                        size="small"
                        sx={tabButtonSx('metrics')}
                    >
                        Metrics
                    </Button>
                    {isAdmin && (
                        <Button
                            component={RouterLink}
                            to="/dashboard/admin"
                            variant="text"
                            size="small"
                            sx={tabButtonSx('admin')}
                        >
                            Admin
                            <Chip
                                label="Admin"
                                size="small"
                                color="warning"
                                sx={{
                                    ml: 0.75,
                                    height: 16,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    '& .MuiChip-label': { px: 0.75 },
                                }}
                            />
                        </Button>
                    )}
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

            {activeTab === 'metrics' && (
                <Metrics
                    metrics={metrics}
                    loading={loadingMetrics}
                    error={metricsError}
                    chartRange={chartRange}
                    onChartRangeChange={setChartRange}
                    chartData={chartData}
                    chartLoading={chartLoading}
                    chartError={chartError}
                />
            )}

            {activeTab === 'admin' && isAdmin && (
                <AdminMetrics
                    metrics={adminMetrics}
                    loading={adminLoading}
                    error={adminError}
                    chartRange={adminChartRange}
                    onChartRangeChange={setAdminChartRange}
                    chartData={adminChartData}
                    chartLoading={adminChartLoading}
                    chartError={adminChartError}
                />
            )}
        </Box>
    );
}

export default DashboardPage;
