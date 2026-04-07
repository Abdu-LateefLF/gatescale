import { Snackbar, Alert } from '@mui/material';

interface ToastProps {
    open: boolean;
    message: string;
    severity?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    handleClose: () => void;
}

function Toast({
    open,
    message,
    severity = 'info',
    duration = 3000,
    handleClose,
}: ToastProps) {
    return (
        <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}

export default Toast;
