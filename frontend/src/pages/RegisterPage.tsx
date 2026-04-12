import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Divider,
    MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { useState } from 'react';
import useToast from '../hooks/useToast';
import PublicNavBar from '../components/PublicNavBar';

interface RegisterFormInputs {
    name: string;
    email: string;
    password: string;
    tier: 'free' | 'pro';
}

function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const showToast = useToast();
    const navigation = useNavigate();
    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormInputs>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            tier: 'free',
        },
    });

    const onSubmit = async (data: RegisterFormInputs) => {
        setLoading(true);
        try {
            await register(data.name, data.email, data.password, data.tier);
            showToast('Registration successful! Please log in.', 'success');
            navigation('/login');
        } catch {
            showToast('Registration failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <PublicNavBar />

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 2,
                    py: 6,
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        maxWidth: 420,
                        p: { xs: 3, sm: 4 },
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" fontWeight={700} gutterBottom>
                            Create an account
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Get started with FinQL in seconds.
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <TextField
                            label="Name"
                            size="small"
                            fullWidth
                            {...formRegister('name', {
                                required: 'Name is required',
                                minLength: {
                                    value: 2,
                                    message: 'Name must be at least 2 characters',
                                },
                            })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />

                        <TextField
                            label="Email"
                            type="email"
                            size="small"
                            fullWidth
                            {...formRegister('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid email address',
                                },
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            size="small"
                            fullWidth
                            {...formRegister('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <TextField
                            label="Plan"
                            select
                            size="small"
                            fullWidth
                            defaultValue="free"
                            SelectProps={{ native: false }}
                            {...formRegister('tier')}
                        >
                            <MenuItem value="free">Free</MenuItem>
                            <MenuItem value="pro">Pro</MenuItem>
                        </TextField>

                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            disabled={loading}
                            sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
                        >
                            {loading ? 'Creating account…' : 'Create account'}
                        </Button>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Already have an account?{' '}
                        <RouterLink
                            to="/login"
                            style={{ color: 'inherit', fontWeight: 600 }}
                        >
                            Sign in
                        </RouterLink>
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
}

export default RegisterPage;
