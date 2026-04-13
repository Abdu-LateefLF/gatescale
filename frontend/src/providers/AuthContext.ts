import { createContext } from 'react';
import type { User } from '../types';

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isFetching: boolean;
    signIn: (email: string, password: string) => void;
    signOut: () => Promise<void>;
    refetchUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);
