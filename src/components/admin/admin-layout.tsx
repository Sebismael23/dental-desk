'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
    Shield, LayoutDashboard, Users, Calendar, Settings,
    Phone, BarChart3, Bell, ChevronLeft, ChevronRight,
    LogOut, Menu, X, Search, User, Loader2
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

interface AdminUser {
    id: string;
    email: string;
    full_name: string | null;
    role: 'super_admin' | 'admin' | 'viewer';
}

// Context to share admin user data
const AdminUserContext = createContext<AdminUser | null>(null);
export const useAdminUser = () => useContext(AdminUserContext);

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'Practices', href: '/admin/practices' },
    { icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
    { icon: Phone, label: 'Call Logs', href: '/admin/calls' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

const ROLE_LABELS: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    viewer: 'Viewer',
};

function Sidebar({ collapsed, onToggle, adminUser }: { collapsed: boolean; onToggle: () => void; adminUser: AdminUser | null }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleSignOut = async () => {
        setLoggingOut(true);
        try {
            await supabase.auth.signOut();
            router.push('/admin-login');
        } catch (err) {
            console.error('Error signing out:', err);
            setLoggingOut(false);
        }
    };

    return (
        <aside className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 z-40 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
            }`}>
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Shield size={20} className="text-white" />
                    </div>
                    {!collapsed && (
                        <div>
                            <div className="font-bold text-white text-lg">DentaVoice</div>
                            <div className="text-xs text-slate-500 -mt-0.5">
                                {adminUser ? ROLE_LABELS[adminUser.role] : 'Admin Console'}
                            </div>
                        </div>
                    )}
                </Link>
                <button
                    onClick={onToggle}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="p-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/admin' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-800">
                <button
                    onClick={handleSignOut}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                >
                    {loggingOut ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
                    {!collapsed && <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>}
                </button>
            </div>
        </aside>
    );
}

function Navbar({ onMobileMenuToggle, adminUser }: { onMobileMenuToggle: () => void; adminUser: AdminUser | null }) {
    const displayName = adminUser?.full_name || adminUser?.email?.split('@')[0] || 'Admin User';
    const displayRole = adminUser ? ROLE_LABELS[adminUser.role] : 'Admin';

    return (
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Mobile menu button */}
            <button
                onClick={onMobileMenuToggle}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400"
            >
                <Menu size={20} />
            </button>

            {/* Search */}
            <div className="hidden sm:flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search practices, bookings..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User menu */}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-700">
                    <div className="hidden sm:block text-right">
                        <div className="text-sm font-medium text-white">{displayName}</div>
                        <div className="text-xs text-slate-500">{displayRole}</div>
                    </div>
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <User size={18} className="text-white" />
                    </div>
                </div>
            </div>
        </header>
    );
}

function MobileMenu({ isOpen, onClose, adminUser }: { isOpen: boolean; onClose: () => void; adminUser: AdminUser | null }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleSignOut = async () => {
        setLoggingOut(true);
        try {
            await supabase.auth.signOut();
            router.push('/admin-login');
        } catch (err) {
            console.error('Error signing out:', err);
            setLoggingOut(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/60" onClick={onClose} />
            <div className="fixed left-0 top-0 h-full w-72 bg-slate-900 border-r border-slate-800 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Shield size={20} className="text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-white">DentaVoice</div>
                            <div className="text-xs text-slate-500">
                                {adminUser ? ROLE_LABELS[adminUser.role] : 'Admin Console'}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <nav className="space-y-1 flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign Out Button */}
                <div className="pt-4 border-t border-slate-800">
                    <button
                        onClick={handleSignOut}
                        disabled={loggingOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                        {loggingOut ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
                        <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminLayoutClient({ children }: AdminLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchAdminUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: adminData } = await supabase
                        .from('admin_users')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (adminData) {
                        setAdminUser(adminData as AdminUser);
                    }
                }
            } catch (err) {
                console.error('Error fetching admin user:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminUser();
    }, [supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-blue-400" />
            </div>
        );
    }

    return (
        <AdminUserContext.Provider value={adminUser}>
            <div className="min-h-screen bg-slate-950 text-white">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block">
                    <Sidebar
                        collapsed={sidebarCollapsed}
                        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                        adminUser={adminUser}
                    />
                </div>

                {/* Mobile Menu */}
                <MobileMenu
                    isOpen={mobileMenuOpen}
                    onClose={() => setMobileMenuOpen(false)}
                    adminUser={adminUser}
                />

                {/* Main content area */}
                <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
                    }`}>
                    <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} adminUser={adminUser} />
                    <main className="min-h-[calc(100vh-4rem)]">
                        {children}
                    </main>
                </div>
            </div>
        </AdminUserContext.Provider>
    );
}
