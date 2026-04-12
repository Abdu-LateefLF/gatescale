import {
    Box,
    Button,
    Divider,
    Modal,
    TextField,
    Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import type { CreateApiKeyFormInputs } from '../types';
import { useEffect } from 'react';

interface CreateApiKeyModalProps {
    open: boolean;
    loading: boolean;
    onSubmit: (data: CreateApiKeyFormInputs) => void;
    onClose: () => void;
}

function CreateApiKeyModal({
    open,
    loading,
    onSubmit,
    onClose,
}: CreateApiKeyModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateApiKeyFormInputs>({
        defaultValues: {
            name: '',
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
    });

    const handleSubmitForm = (data: CreateApiKeyFormInputs) => {
        onSubmit(data);
        onClose();
    };

    useEffect(() => {
        if (open) {
            reset();
        }
    }, [open, reset]);

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
                    borderRadius: '5px',
                    border: 1,
                    borderColor: 'divider',
                    boxShadow: 24,
                    overflow: 'hidden',
                }}
                component="form"
                onSubmit={handleSubmit(handleSubmitForm)}
            >
                <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Create API key
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <TextField
                            id="name"
                            label="Name"
                            size="small"
                            fullWidth
                            autoFocus
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            {...register('name', {
                                required: 'Name is required',
                            })}
                        />
                        <TextField
                            id="expiresAt"
                            label="Expires at"
                            type="date"
                            size="small"
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }}
                            error={!!errors.expiresAt}
                            helperText={errors.expiresAt?.message}
                            {...register('expiresAt', {
                                required: 'Expires at is required',
                            })}
                        />
                    </Box>
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
                        type="submit"
                        size="small"
                        disabled={loading}
                        sx={{ textTransform: 'none' }}
                    >
                        {loading ? 'Creating…' : 'Create key'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateApiKeyModal;
