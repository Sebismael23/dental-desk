'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
    LayoutDashboard,
    Phone,
    Users,
    Settings,
    LogOut,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';

export type ViewType = 'dashboard' | 'calls' | 'leads' | 'settings';

interface NavItemProps {
    id: ViewType;
    icon: React.ElementType;
    label: string;
    currentView: ViewType;
    onNavigate: (view: ViewType) => void;
}

function NavItem({ id, icon: Icon, label, currentView, onNavigate }: NavItemProps) {
    const isActive = currentView === id;

    return (
        <button
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
        >
            <Icon size={20} />
            {label}
        </button>
    );
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    currentView: ViewType;
    onNavigate: (view: ViewType) => void;
}

export default function Sidebar({ isOpen, onClose, currentView, onNavigate }: SidebarProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleNavigate = (view: ViewType) => {
        onNavigate(view);
        onClose();
    };

    const handleSignOut = async () => {
        setLoggingOut(true);
        try {
            await supabase.auth.signOut();
            router.push('/login');
        } catch (err) {
            console.error('Error signing out:', err);
            setLoggingOut(false);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white p-6 transition-transform lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">
                        D
                    </div>
                    <div>
                        <h2 className="font-bold text-lg tracking-tight">DentaVoice</h2>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                            Practice Dashboard
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                    <NavItem
                        id="dashboard"
                        icon={LayoutDashboard}
                        label="Overview"
                        currentView={currentView}
                        onNavigate={handleNavigate}
                    />
                    <NavItem
                        id="calls"
                        icon={Phone}
                        label="Call Logs"
                        currentView={currentView}
                        onNavigate={handleNavigate}
                    />
                    <NavItem
                        id="leads"
                        icon={Users}
                        label="Patients CRM"
                        currentView={currentView}
                        onNavigate={handleNavigate}
                    />

                    <div className="pt-8 pb-2">
                        <p className="px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                            System
                        </p>
                    </div>

                    <NavItem
                        id="settings"
                        icon={Settings}
                        label="Configuration"
                        currentView={currentView}
                        onNavigate={handleNavigate}
                    />
                </nav>

                {/* Sign Out */}
                <div className="absolute bottom-6 left-6 right-6">
                    <button
                        onClick={handleSignOut}
                        disabled={loggingOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                    >
                        {loggingOut ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
                        {loggingOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                </div>
            </aside>
        </>
    );
}
