import { Modal, Box, Typography, Button } from '@mui/material';

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
                    p: 2,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body1">{description}</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ConfirmModal;
