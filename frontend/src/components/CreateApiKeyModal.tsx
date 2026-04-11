import {
    Box,
    Button,
    FormHelperText,
    Input,
    InputLabel,
    Modal,
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
                    p: 3,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'divider',
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
                component="form"
                onSubmit={handleSubmit(handleSubmitForm)}
            >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Create API key
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <InputLabel htmlFor="name" sx={{ textAlign: 'left' }}>
                        API Key Name
                    </InputLabel>
                    <Input
                        id="name"
                        placeholder="Name"
                        fullWidth
                        {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                        <FormHelperText error>
                            {errors.name.message}
                        </FormHelperText>
                    )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <InputLabel htmlFor="expiresAt" sx={{ textAlign: 'left' }}>
                        Expires At
                    </InputLabel>
                    <Input
                        id="expiresAt"
                        type="date"
                        placeholder="Expires At"
                        fullWidth
                        {...register('expiresAt', {
                            required: 'Expires At is required',
                        })}
                    />
                    {errors.expiresAt && (
                        <FormHelperText error>
                            {errors.expiresAt.message}
                        </FormHelperText>
                    )}
                </Box>

                <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{ textTransform: 'none' }}
                >
                    {loading ? 'Creating…' : 'Create key'}
                </Button>
            </Box>
        </Modal>
    );
}

export default CreateApiKeyModal;
