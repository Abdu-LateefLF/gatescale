import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function ProtectedRoute() {
    const { user, isLoading } = useAuth();

    if (!user && !isLoading) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <Outlet />;
}

export default ProtectedRoute;
