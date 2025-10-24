"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('mockUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        // Mock login - check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const foundUser = users.find((u: any) => u.email === email && u.password === password);

        if (foundUser) {
            const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
            setUser(userData);
            localStorage.setItem('mockUser', JSON.stringify(userData));
            toast.success('Logged in successfully!');
            router.push('/dashboard/products');
        } else {
            toast.error('Invalid email or password');
            throw new Error('Invalid credentials');
        }
    };

    const signup = async (email: string, password: string, name: string) => {
        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');

        if (users.find((u: any) => u.email === email)) {
            toast.error('User already exists');
            throw new Error('User already exists');
        }

        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            password,
            name,
        };

        users.push(newUser);
        localStorage.setItem('mockUsers', JSON.stringify(users));

        const userData = { id: newUser.id, email: newUser.email, name: newUser.name };
        setUser(userData);
        localStorage.setItem('mockUser', JSON.stringify(userData));
        toast.success('Account created successfully!');
        router.push('/dashboard/products');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mockUser');
        toast.success('Logged out successfully');
        router.push('/auth');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
