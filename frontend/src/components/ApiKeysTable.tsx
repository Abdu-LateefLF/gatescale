import {
    Box,
    Button,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Paper,
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
    onRevokeApiKey: (apiKeyId: string) => void;
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
        if (selectedApiKey) {
            onRevokeApiKey(selectedApiKey.id);
        }
        setOpenConfirmModal(false);
        handleCloseMenu();
    };

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        };
        return new Date(date).toLocaleString('en-US', options);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', sm: 'flex-start' },
                    gap: 2,
                    mb: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, fontSize: 18 }}
                    >
                        API keys
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Keys authenticate API requests. The secret is shown only
                        once when you create a key.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={onClickCreateNewKey}
                    sx={{ textTransform: 'none', alignSelf: { sm: 'center' } }}
                >
                    Create new key
                </Button>
            </Box>

            <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                                Secret
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                                Created
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                                Expires
                            </TableCell>
                            <TableCell width={56} align="right" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiKeys.map((apiKey) => (
                            <TableRow key={apiKey.id} hover>
                                <TableCell>{apiKey.name}</TableCell>
                                <TableCell>
                                    <Chip
                                        size="small"
                                        label="Hidden"
                                        variant="outlined"
                                        sx={{
                                            fontFamily: 'monospace',
                                            fontSize: 11,
                                        }}
                                    />
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: 13,
                                    }}
                                >
                                    {formatDate(apiKey.createdAt)}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: 13,
                                    }}
                                >
                                    {formatDate(apiKey.expiresAt)}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        id={`api-key-menu-${apiKey.id}`}
                                        onClick={() => handleOpenMenu(apiKey)}
                                        aria-label="Key actions"
                                        size="small"
                                    >
                                        <MoreVert fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {apiKeys.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    align="center"
                                    sx={{ py: 5, color: 'text.secondary' }}
                                >
                                    No API keys yet. Create one to use the API
                                    and playground.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu open={openMenu} onClose={handleCloseMenu} anchorEl={anchorEl}>
                <MenuItem onClick={() => setOpenConfirmModal(true)}>
                    Revoke key
                </MenuItem>
            </Menu>

            <ConfirmModal
                open={openConfirmModal}
                title="Revoke API key"
                description="This key will stop working immediately. This cannot be undone."
                onClose={() => setOpenConfirmModal(false)}
                onConfirm={handleConfirmRevokeApiKey}
            />
        </Box>
    );
}

export default ApiKeysTable;
