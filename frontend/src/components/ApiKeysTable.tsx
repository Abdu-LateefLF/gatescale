import {
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import type { ProtectedApiKey } from '../types';
import { MoreVert } from '@mui/icons-material';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

interface ApiKeysTableProps {
    apiKeys: ProtectedApiKey[];
    onClickCreateNewKey: () => void;
    onRevokeApiKey: (id: string) => void;
}

function ApiKeysTable({
    apiKeys,
    onClickCreateNewKey,
    onRevokeApiKey,
}: ApiKeysTableProps) {
    const [openMenu, setOpenMenu] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedApiKey, setSelectedApiKey] =
        useState<ProtectedApiKey | null>(null);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const handleOpenMenu = (apiKey: ProtectedApiKey) => {
        setSelectedApiKey(apiKey);
        setAnchorEl(
            document.getElementById(`api-key-menu-${apiKey.id}`) as HTMLElement
        );
        setOpenMenu(true);
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
        setAnchorEl(null);
        setSelectedApiKey(null);
    };

    const handleConfirmRevokeApiKey = () => {
        onRevokeApiKey(selectedApiKey?.id || '');
        setOpenConfirmModal(false);
        handleCloseMenu();
    };

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short',
        };
        return new Date(date).toLocaleString('en-US', options);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography>Your API Keys:</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClickCreateNewKey}
                >
                    Create New Key
                </Button>
            </Box>
            <TableContainer
                sx={{ marginTop: 2, width: '100%', overflowX: 'auto' }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Secret</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Expires At</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiKeys.map((apiKey) => (
                            <TableRow key={apiKey.id}>
                                <TableCell>{apiKey.name}</TableCell>
                                <TableCell>{'*'.repeat(12)}</TableCell>
                                <TableCell>
                                    {formatDate(apiKey.createdAt)}
                                </TableCell>
                                <TableCell>
                                    {formatDate(apiKey.expiresAt)}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        id={`api-key-menu-${apiKey.id}`}
                                        onClick={() => handleOpenMenu(apiKey)}
                                    >
                                        <MoreVert fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {apiKeys.length === 0 && (
                            <TableRow>
                                <Box sx={{ padding: 2 }}>
                                    You have no API keys. Create a new one.
                                </Box>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu open={openMenu} onClose={handleCloseMenu} anchorEl={anchorEl}>
                <MenuItem onClick={() => setOpenConfirmModal(true)}>
                    Revoke
                </MenuItem>
            </Menu>

            <ConfirmModal
                open={openConfirmModal}
                title="Revoke API Key"
                description="Are you sure you want to revoke this API key?"
                onClose={() => setOpenConfirmModal(false)}
                onConfirm={handleConfirmRevokeApiKey}
            />
        </Box>
    );
}

export default ApiKeysTable;
