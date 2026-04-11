import { Box } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DocsPage from './pages/DocsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Box sx={{ width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/dashboard"
                        element={<Navigate to="/dashboard/api-keys" replace />}
                    />
                    <Route path="/dashboard/:tab" element={<DashboardPage />} />
                </Route>
            </Routes>
        </Box>
    );
}

export default App;
