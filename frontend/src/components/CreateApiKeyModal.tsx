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
                component="form"
                onSubmit={handleSubmit(handleSubmitForm)}
            >
                <Typography variant="h6">Create API Key</Typography>
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

                <Button variant="contained" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create API Key'}
                </Button>
            </Box>
        </Modal>
    );
}

export default CreateApiKeyModal;
