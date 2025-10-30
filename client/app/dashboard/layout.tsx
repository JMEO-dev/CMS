"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, Menu, Moon, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProfileDropdownMenu } from '@/components/ProfileDropdown';
import useAuthStore from '@/store/authStore';
import useThemeStore from '@/store/themeStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = useAuthStore(state => state.user);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const theme = useThemeStore(state => state.theme);
    const toggleTheme = useThemeStore(state => state.toggleTheme);
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const navItems = [
        { path: '/dashboard/products', label: 'Products', icon: Package },
        { path: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 z-40 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                )}
            >
                <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-primary">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-sidebar-foreground">Dashboard</span>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                    isActive
                                        ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-md'
                                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                                )}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="md:pl-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                    <div className="flex items-center justify-between h-full px-4 md:px-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>

                        <div className="flex-1" />



                        <div className="flex items-center gap-3">
                            <div className='text-primary'>{isAuthenticated && (<>Hi, {user?.name}</>)}</div>
                            <Button variant="ghost" size="icon" onClick={toggleTheme}>
                                {theme === 'light' ? (
                                    <Moon className="w-5 h-5" />
                                ) : (
                                    <Sun className="w-5 h-5" />
                                )}
                            </Button>
                            <ProfileDropdownMenu />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-6">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}