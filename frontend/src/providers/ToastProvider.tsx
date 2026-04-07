import { createContext, useState } from 'react';
import Toast from '../components/Toast';

type ToastContextType = (
    message: string,
    severity?: 'success' | 'error' | 'info' | 'warning',
    duration?: number
) => void;

export const ToastContext = createContext<ToastContextType>(() => {});

interface ToastProviderProps {
    children: React.ReactNode;
}

function ToastProvider({ children }: ToastProviderProps) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<
        'success' | 'error' | 'info' | 'warning'
    >('info');
    const [duration, setDuration] = useState(3000);

    const showToast = (
        message: string,
        severity: 'success' | 'error' | 'info' | 'warning' = 'info',
        duration: number = 3000
    ) => {
        setMessage(message);
        setSeverity(severity);
        setDuration(duration);
        setOpen(true);
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <Toast
                open={open}
                message={message}
                severity={severity}
                duration={duration}
                handleClose={() => setOpen(false)}
            />
        </ToastContext.Provider>
    );
}

export default ToastProvider;
