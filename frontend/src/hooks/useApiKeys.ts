import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import type { ApiKey, CreateApiKeyFormInputs, ProtectedApiKey } from '../types';
import {
    createApiKey,
    getApiKeys,
    revokeApiKey,
} from '../services/apiKeyService';
import useToast from './useToast';
import useAuth from './useAuth';

export function useApiKeys() {
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

    useEffect(() => {
        if (user?.id) {
            fetchApiKeys();
        }
    }, [user?.id, fetchApiKeys]);

    return {
        apiKeys,
        apiKeyToShow,
        openShowApiKeyModal,
        openCreateApiKeyModal,
        isCreatingApiKey,
        setOpenShowApiKeyModal,
        setOpenCreateApiKeyModal,
        handleCreateNewKey,
        handleRevokeApiKey,
    };
}
