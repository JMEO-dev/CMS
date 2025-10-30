import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
    name?: string;
    email: string;
    password: string;
}
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    signup: (user: User) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (user) => set({
                user,
                isAuthenticated: true,
            }),
            signup: (user) => set({
                user,
                isAuthenticated: true,
            }),
            logout: () => set({
                user: null,
                isAuthenticated: false,
            }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
export default useAuthStore;