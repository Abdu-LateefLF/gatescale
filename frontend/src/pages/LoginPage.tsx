import { Box, Typography, Button, FormHelperText, Input, InputLabel } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

interface LoginFormInputs {
    email: string;
    password: string;
}

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormInputs) => {
        console.log('Form data:', data);
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
            <Typography>Login</Typography>

            <Box sx={{ width: '100%', maxWidth: 400 }}>
                <InputLabel htmlFor="email" sx={{ textAlign: 'left' }}>Email</InputLabel>
                <Input
                    id="email"
                    placeholder='Email'
                    type="email"
                    fullWidth
                    {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                    })}
                    error={!!errors.email}
                />
                {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
            </Box>

            <Box sx={{ width: '100%', maxWidth: 400 }}>
                <InputLabel htmlFor="password" sx={{ textAlign: 'left' }}>Password</InputLabel>
                <Input
                    id="password"
                    placeholder='Password'
                    type="password"
                    fullWidth
                    {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                    error={!!errors.password}
                />
                {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
            </Box>

            <Button variant="contained" type="submit" sx={{ marginTop: 2, width: '100%', maxWidth: 400 }}>
                Login
            </Button>

            <Link to="/register" style={{ marginTop: 1 }}>
                Don't have an account? Register
            </Link>

            <Link to="/" style={{ marginTop: 1 }}>
                Back to Home
            </Link>
        </Box>
    );
}

export default LoginPage;