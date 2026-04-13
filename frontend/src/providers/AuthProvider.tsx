import { useCallback, useEffect, useState } from 'react';
import type { User } from '../types';
import { login, logout } from '../services/authService';
import { getUserProfile } from '../services/userService';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
    children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const fetchUserProfile = useCallback(async () => {
        setIsFetching(true);

        try {
            const signedInUser = await getUserProfile();
            setUser(signedInUser);
        } catch {
            setUser(null);
        } finally {
            setIsFetching(false);
            setIsLoading(false);
        }
    }, []);

    const signIn = useCallback(
        async (email: string, password: string) => {
            setIsLoading(true);

            try {
                await login(email, password);
                await fetchUserProfile();
            } catch (error) {
                setIsLoading(false);
                throw error;
            }
        },
        [fetchUserProfile]
    );

    const signOut = useCallback(async () => {
        try {
            await logout();
        } catch {
            // Clear local auth state even if the logout request fails.
        } finally {
            setUser(null);
            setIsFetching(false);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isFetching,
                signIn,
                signOut,
                refetchUser: fetchUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
