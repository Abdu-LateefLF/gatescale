import { Box, Button, IconButton, Typography } from '@mui/material';
import { Modal } from '@mui/material';
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
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'divider',
                    boxShadow: 3,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Your new API key
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Copy it and store it safely. You will not be able to see the
                    full secret again.
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: 'grey.100',
                        p: 1.5,
                        borderRadius: 1,
                        border: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: 'monospace',
                            fontSize: 11,
                            width: '100%',
                            lineBreak: 'anywhere',
                        }}
                    >
                        {apiKey?.key || 'No API Key'}
                    </Typography>
                    <IconButton onClick={onCopy} aria-label="Copy API key">
                        <ContentCopy />
                    </IconButton>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={onClose}
                    sx={{ alignSelf: 'flex-end', textTransform: 'none' }}
                >
                    Close
                </Button>
            </Box>
        </Modal>
    );
}

export default ShowApiKeyModal;
