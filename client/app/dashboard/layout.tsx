"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, Menu, Moon, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

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
                <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                            <Package className="h-5 w-5 text-white" />
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
                                <Icon className="h-5 w-5" />
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
                    <div className="flex h-full items-center justify-between px-4 md:px-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="flex-1" />

                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={toggleTheme}>
                                {theme === 'light' ? (
                                    <Moon className="h-5 w-5" />
                                ) : (
                                    <Sun className="h-5 w-5" />
                                )}
                            </Button>

                            <Avatar className="h-9 w-9 border-2 border-primary">
                                <AvatarFallback className="bg-gradient-primary text-primary">
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
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