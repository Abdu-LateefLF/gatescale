import { Box, Typography } from '@mui/material';
import useAuth from '../hooks/useAuth';
import ApiKeysList from '../components/ApiKeysTable';
import { useState } from 'react';

function DashboardPage() {
    const [apiKeys, setApiKeys] = useState([]);
    const { user } = useAuth();

    const handleCreateNewKey = () => {};

    return (
        <Box sx={{ width: '100%', height: '100%', padding: 2 }}>
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

            <ApiKeysList
                apiKeys={apiKeys}
                onClickCreateNewKey={handleCreateNewKey}
            />
        </Box>
    );
}

export default DashboardPage;
