import { Box, Button, Divider, IconButton, Modal, Tooltip, Typography } from '@mui/material';
import type { ApiKey } from '../types';
import { ContentCopy } from '@mui/icons-material';
import useToast from '../hooks/useToast';

interface ShowApiKeyModalProps {
    open: boolean;
    onClose: () => void;
    apiKey: ApiKey | null;
}

function ShowApiKeyModal({ open, onClose, apiKey }: ShowApiKeyModalProps) {
    const showToast = useToast();

    const onCopy = () => {
        navigator.clipboard.writeText(apiKey?.key || '');
        showToast('API key copied to clipboard', 'info');
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 500,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'divider',
                    boxShadow: 24,
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Your new API key
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Copy it and store it safely. You will not be able to see
                        the full secret again.
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 2,
                            bgcolor: 'grey.50',
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 1,
                            pl: 1.5,
                            pr: 0.5,
                            py: 0.5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'monospace',
                                fontSize: 12,
                                flex: 1,
                                wordBreak: 'break-all',
                                color: 'text.primary',
                            }}
                        >
                            {apiKey?.key || 'No API Key'}
                        </Typography>
                        <Tooltip title="Copy">
                            <IconButton
                                size="small"
                                onClick={onCopy}
                                aria-label="Copy API key"
                            >
                                <ContentCopy fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
                <Divider />
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Button
                        variant="contained"
                        size="small"
                        onClick={onClose}
                        sx={{ textTransform: 'none' }}
                    >
                        Done
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ShowApiKeyModal;
