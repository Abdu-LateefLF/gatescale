import { Modal, Box, Typography, Button, Divider } from '@mui/material';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    description: string;
    onClose: () => void;
    onConfirm: () => void;
}

function ConfirmModal({
    open,
    title,
    description,
    onClose,
    onConfirm,
}: ConfirmModalProps) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 400,
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
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </Box>
                <Divider />
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                    }}
                >
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={onClose}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={onConfirm}
                        sx={{ textTransform: 'none' }}
                    >
                        Confirm
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ConfirmModal;
