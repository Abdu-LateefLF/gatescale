import { useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import useAuth from '../hooks/useAuth';
import ApiKeysTable from '../components/ApiKeysTable';
import type { ApiKey, CreateApiKeyFormInputs, ProtectedApiKey } from '../types';
import {
    createApiKey,
    getApiKeys,
    revokeApiKey,
} from '../services/apiKeyService';
import useToast from '../hooks/useToast';
import ShowApiKeyModal from '../components/ShowApiKeyModal';
import CreateApiKeyModal from '../components/CreateApiKeyModal';
import { AxiosError } from 'axios';

function DashboardPage() {
    const [apiKeys, setApiKeys] = useState<ProtectedApiKey[]>([]);
    const [apiKeyToShow, setApiKeyToShow] = useState<ApiKey | null>(null);
    const [openShowApiKeyModal, setOpenShowApiKeyModal] = useState(false);
    const [openCreateApiKeyModal, setOpenCreateApiKeyModal] = useState(false);

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

    const handleCreateNewKey = async (data: CreateApiKeyFormInputs) => {
        try {
            setIsCreatingApiKey(true);

            const newApiKey = await createApiKey(data);

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

    const handleRevokeApiKey = async (id: string) => {
        try {
            await revokeApiKey(id);
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

    useEffect(() => {
        if (user?.id) {
            fetchApiKeys();
        }
    }, [user?.id, fetchApiKeys]);

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
                <Typography variant="h1" sx={{ fontSize: '24px' }}>
                    Dashboard Page
                </Typography>
                <Typography>Hi {user?.name || 'User'}!</Typography>
            </Box>

            <ApiKeysTable
                apiKeys={apiKeys}
                onClickCreateNewKey={() => setOpenCreateApiKeyModal(true)}
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
        </Box>
    );
}

export default DashboardPage;
