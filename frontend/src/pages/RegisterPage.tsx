import {
    Box,
    Button,
    Input,
    InputLabel,
    Typography,
    FormHelperText,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { useState } from 'react';
import useToast from '../hooks/useToast';

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
        console.log('Form data:', data);
        setLoading(true);

        try {
            await register(data.name, data.email, data.password, data.tier);
            showToast('Registration successful! Please log in.', 'success');
            navigation('/login');
        } catch (error) {
            showToast('Registration failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
            }}
        >
            <Typography>Register</Typography>

            <Box sx={{ width: '100%', maxWidth: 400 }}>
                <InputLabel htmlFor="name" sx={{ textAlign: 'left' }}>
                    Name
                </InputLabel>
                <Input
                    id="name"
                    placeholder="Name"
                    fullWidth
                    {...formRegister('name', {
                        required: 'Name is required',
                        minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters',
                        },
                    })}
                    error={!!errors.name}
                />
                {errors.name && (
                    <FormHelperText error>{errors.name.message}</FormHelperText>
                )}
            </Box>

            <Box sx={{ width: '100%', maxWidth: 400 }}>
                <InputLabel htmlFor="email" sx={{ textAlign: 'left' }}>
                    Email
                </InputLabel>
                <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    fullWidth
                    {...formRegister('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email address',
                        },
                    })}
                    error={!!errors.email}
                />
                {errors.email && (
                    <FormHelperText error>
                        {errors.email.message}
                    </FormHelperText>
                )}
            </Box>

            <Box sx={{ width: '100%', maxWidth: 400 }}>
                <InputLabel htmlFor="password" sx={{ textAlign: 'left' }}>
                    Password
                </InputLabel>
                <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    fullWidth
                    {...formRegister('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                        },
                    })}
                    error={!!errors.password}
                />
                {errors.password && (
                    <FormHelperText error>
                        {errors.password.message}
                    </FormHelperText>
                )}
            </Box>

            <Box sx={{ width: '100%', maxWidth: 400 }}>
                <InputLabel htmlFor="tier" sx={{ textAlign: 'left' }}>
                    Subscription Tier
                </InputLabel>
                <select
                    id="tier"
                    {...formRegister('tier')}
                    style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                </select>
            </Box>

            <Button
                variant="contained"
                type="submit"
                sx={{ marginTop: 2, width: '100%', maxWidth: 400 }}
                disabled={loading}
            >
                Register
            </Button>

            <Link to="/login" style={{ marginTop: 1 }}>
                Already have an account? Login
            </Link>

            <Link to="/" style={{ marginTop: 1 }}>
                Back to Home
            </Link>
        </Box>
    );
}

export default RegisterPage;
