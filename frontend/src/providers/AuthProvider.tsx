import { createContext, useCallback, useEffect, useState } from 'react';
import type { User } from '../types';
import { getUserProfile } from '../services/userService';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isFetching: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    refetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isFetching: false,
    setUser: () => {},
    refetchUser: async () => {},
});

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
            const user = await getUserProfile();
            setUser(user);
        } catch (error) {
            setUser(null);
        } finally {
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
                setUser,
                refetchUser: fetchUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
