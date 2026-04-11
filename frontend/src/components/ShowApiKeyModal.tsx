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
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 2,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Typography variant="h6">Here is your API Key:</Typography>
                <Typography>
                    Copy it and save it somewhere safe. You will not be able to
                    see it again.
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'rgb(249, 249, 249)',
                        padding: 1,
                        borderRadius: 1,
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
                    <IconButton onClick={onCopy}>
                        <ContentCopy />
                    </IconButton>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={onClose}
                    sx={{ alignSelf: 'flex-end' }}
                >
                    Close
                </Button>
            </Box>
        </Modal>
    );
}

export default ShowApiKeyModal;
