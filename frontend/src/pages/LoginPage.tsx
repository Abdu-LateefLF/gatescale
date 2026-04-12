import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';
import { login } from '../services/authService';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import PublicNavBar from '../components/PublicNavBar';

interface LoginFormInputs {
    email: string;
    password: string;
}

function LoginPage() {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { refetchUser } = useAuth();
    const showToast = useToast();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormInputs) => {
        setLoading(true);
        try {
            await login(data.email, data.password);
            await refetchUser();
            showToast('Login successful!', 'success');
            navigate('/dashboard');
        } catch {
            showToast('Login failed. Please check your credentials.', 'error');
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
                            Sign in
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Welcome back. Enter your credentials to continue.
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <TextField
                            label="Email"
                            type="email"
                            size="small"
                            fullWidth
                            {...register('email', {
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
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            disabled={loading}
                            sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
                        >
                            {loading ? 'Signing in…' : 'Sign in'}
                        </Button>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Don't have an account?{' '}
                        <RouterLink
                            to="/register"
                            style={{ color: 'inherit', fontWeight: 600 }}
                        >
                            Create one
                        </RouterLink>
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
}

export default LoginPage;
