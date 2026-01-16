'use client';

import { useState, useEffect } from 'react';
import {
    Shield, Plus, Phone, Users, DollarSign, Activity, Search,
    TrendingUp, TrendingDown, Calendar, Clock,
    Eye, Settings, Loader2, RefreshCw,
    Mail, MessageSquare, CheckCircle, ArrowUpRight, BarChart3
} from 'lucide-react';
import OnboardModal from '@/components/admin/onboard-modal';

// Types
interface Practice {
    id: string;
    name: string;
    owner_name: string | null;
    email: string;
    status: 'onboarding' | 'pilot' | 'active' | 'paused' | 'churned';
    plan: 'free_trial' | 'basic' | 'pro';
    ai_phone_number: string | null;
    created_at: string;
    trial_ends_at: string | null;
}

interface BookingRequest {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    goal: string;
    details: string | null;
    status: string;
    created_at: string;
}

interface DashboardStats {
    totalPractices: number;
    activePractices: number;
    totalCalls: number;
    pendingBookings: number;
    monthlyRevenue: number;
}

const GOAL_LABELS: Record<string, string> = {
    missed_calls: 'Missed Calls',
    staffing: 'Staffing Issues',
    emergency: 'After-Hours',
    demo: 'Demo Request',
};

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        active: 'bg-green-500/10 text-green-400 border-green-500/20',
        pilot: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        onboarding: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        paused: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        churned: 'bg-red-500/10 text-red-400 border-red-500/20',
        new: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        scheduled: 'bg-green-500/10 text-green-400 border-green-500/20',
        free_trial: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        basic: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        pro: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border uppercase ${styles[status] || styles.active}`}>
            {status.replace('_', ' ')}
        </span>
    );
}

function StatCard({ icon: Icon, label, value, change, trend }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down'
}) {
    return (
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <Icon size={20} className="text-slate-400" />
                {change && (
                    <span className={`text-xs font-semibold flex items-center gap-1 ${trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {change}
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
        </div>
    );
}

function formatTimeAgo(date: string) {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

export default function AdminDashboardPage() {
    const [practices, setPractices] = useState<Practice[]>([]);
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalPractices: 0,
        activePractices: 0,
        totalCalls: 0,
        pendingBookings: 0,
        monthlyRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showOnboard, setShowOnboard] = useState(false);
    const [activeTab, setActiveTab] = useState<'practices' | 'bookings'>('practices');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const fetchData = async () => {
        setRefreshing(true);

        try {
            // Fetch practices via API
            const practicesRes = await fetch('/api/admin/practices');
            const practicesData = await practicesRes.json();

            if (practicesData.practices) {
                setPractices(practicesData.practices);
                setStats(prev => ({
                    ...prev,
                    totalPractices: practicesData.practices.length,
                    activePractices: practicesData.practices.filter((p: Practice) => p.status === 'active').length,
                    monthlyRevenue: practicesData.practices.reduce((sum: number, p: Practice) => {
                        if (p.plan === 'pro') return sum + 199;
                        if (p.plan === 'basic') return sum + 99;
                        return sum;
                    }, 0)
                }));
            }

            // Fetch booking requests via API
            const bookingsRes = await fetch('/api/admin/bookings');
            const bookingsData = await bookingsRes.json();

            if (bookingsData.bookings) {
                setBookings(bookingsData.bookings);
                setStats(prev => ({
                    ...prev,
                    pendingBookings: bookingsData.bookings.filter((b: BookingRequest) => b.status === 'new').length
                }));
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }

        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateBookingStatus = async (id: string, newStatus: string) => {
        try {
            await fetch('/api/admin/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });
            fetchData();
        } catch (err) {
            console.error('Error updating booking:', err);
        }
    };

    const filteredPractices = practices.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.owner_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleNewPractice = () => {
        setShowOnboard(false);
        fetchData();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                                <Shield size={24} />
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold">Super Admin Console</h1>
                        </div>
                        <p className="text-slate-400">Concierge Onboarding & System Health</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchData}
                            disabled={refreshing}
                            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                        <button
                            onClick={() => setShowOnboard(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                        >
                            <Plus size={18} /> Onboard Client
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <StatCard icon={Users} label="Total Practices" value={stats.totalPractices} />
                    <StatCard icon={CheckCircle} label="Active" value={stats.activePractices} change={stats.activePractices > 0 ? `+${stats.activePractices}` : undefined} trend="up" />
                    <StatCard icon={Phone} label="Total Calls" value={stats.totalCalls} />
                    <StatCard icon={Calendar} label="Pending Leads" value={stats.pendingBookings} />
                    <StatCard icon={DollarSign} label="Monthly MRR" value={`$${stats.monthlyRevenue}`} />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('practices')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'practices'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        Practices ({practices.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'bookings'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        Booking Requests
                        {stats.pendingBookings > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                {stats.pendingBookings}
                            </span>
                        )}
                    </button>
                </div>

                {/* Practices Tab */}
                {activeTab === 'practices' && (
                    <>
                        {/* Filters */}
                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search practices..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="pilot">Pilot</option>
                                    <option value="onboarding">Onboarding</option>
                                    <option value="paused">Paused</option>
                                    <option value="churned">Churned</option>
                                </select>
                            </div>
                        </div>

                        {/* Practices Table */}
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                            {filteredPractices.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Users className="mx-auto text-slate-600 mb-4" size={48} />
                                    <h3 className="text-lg font-semibold text-slate-300 mb-2">No practices yet</h3>
                                    <p className="text-slate-500 mb-4">Get started by onboarding your first client</p>
                                    <button
                                        onClick={() => setShowOnboard(true)}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium"
                                    >
                                        Onboard Client
                                    </button>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-slate-900/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 lg:p-6">Practice</th>
                                            <th className="p-4 lg:p-6 hidden sm:table-cell">Status</th>
                                            <th className="p-4 lg:p-6 hidden md:table-cell">Plan</th>
                                            <th className="p-4 lg:p-6 hidden lg:table-cell">AI Number</th>
                                            <th className="p-4 lg:p-6 hidden lg:table-cell">Created</th>
                                            <th className="p-4 lg:p-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {filteredPractices.map((practice) => (
                                            <tr key={practice.id} className="hover:bg-slate-700/30 transition-colors group">
                                                <td className="p-4 lg:p-6">
                                                    <div className="font-semibold text-white">{practice.name}</div>
                                                    <div className="text-slate-500 text-sm">{practice.email}</div>
                                                </td>
                                                <td className="p-4 lg:p-6 hidden sm:table-cell">
                                                    <StatusBadge status={practice.status} />
                                                </td>
                                                <td className="p-4 lg:p-6 hidden md:table-cell">
                                                    <StatusBadge status={practice.plan} />
                                                </td>
                                                <td className="p-4 lg:p-6 hidden lg:table-cell">
                                                    {practice.ai_phone_number ? (
                                                        <span className="text-slate-300 font-mono text-sm">{practice.ai_phone_number}</span>
                                                    ) : (
                                                        <span className="text-slate-500 text-sm">Not provisioned</span>
                                                    )}
                                                </td>
                                                <td className="p-4 lg:p-6 hidden lg:table-cell text-slate-400 text-sm">
                                                    {formatTimeAgo(practice.created_at)}
                                                </td>
                                                <td className="p-4 lg:p-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Eye size={14} />
                                                        </button>
                                                        <button className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 rounded text-white font-medium">
                                                            <Settings size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                        {bookings.length === 0 ? (
                            <div className="p-12 text-center">
                                <Calendar className="mx-auto text-slate-600 mb-4" size={48} />
                                <h3 className="text-lg font-semibold text-slate-300 mb-2">No booking requests</h3>
                                <p className="text-slate-500">Leads from the landing page will appear here</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-700">
                                {bookings.map((booking) => (
                                    <div key={booking.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-white text-lg">
                                                        {booking.first_name} {booking.last_name}
                                                    </h3>
                                                    <StatusBadge status={booking.status} />
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <Mail size={14} /> {booking.email}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Phone size={14} /> {booking.phone}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} /> {formatTimeAgo(booking.created_at)}
                                                    </span>
                                                </div>
                                                <div className="mt-3">
                                                    <span className="inline-block px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                                                        Goal: {GOAL_LABELS[booking.goal] || booking.goal}
                                                    </span>
                                                </div>
                                                {booking.details && (
                                                    <p className="mt-2 text-sm text-slate-400 italic">
                                                        "{booking.details}"
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                {booking.status === 'new' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateBookingStatus(booking.id, 'contacted')}
                                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                                                        >
                                                            <CheckCircle size={14} /> Mark Contacted
                                                        </button>
                                                        <button
                                                            onClick={() => updateBookingStatus(booking.id, 'scheduled')}
                                                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                                                        >
                                                            <Calendar size={14} /> Scheduled
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status === 'contacted' && (
                                                    <button
                                                        onClick={() => updateBookingStatus(booking.id, 'scheduled')}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                                                    >
                                                        <Calendar size={14} /> Mark Scheduled
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Actions Panel */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Activity size={18} /> Recent Activity
                        </h3>
                        <div className="space-y-3 text-sm">
                            {practices.slice(0, 5).map((p) => (
                                <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                                    <span className="text-slate-300">{p.name}</span>
                                    <span className="text-slate-500">{formatTimeAgo(p.created_at)}</span>
                                </div>
                            ))}
                            {practices.length === 0 && (
                                <p className="text-slate-500">No recent activity</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <ArrowUpRight size={18} /> Quick Links
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href="https://supabase.com/dashboard/project/ubljkwzhclzdcxykwhqy"
                                target="_blank"
                                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 text-slate-300 transition-colors"
                            >
                                <BarChart3 size={16} /> Supabase
                            </a>
                            <a
                                href="https://dashboard.stripe.com"
                                target="_blank"
                                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 text-slate-300 transition-colors"
                            >
                                <DollarSign size={16} /> Stripe
                            </a>
                            <a
                                href="https://www.twilio.com/console"
                                target="_blank"
                                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 text-slate-300 transition-colors"
                            >
                                <Phone size={16} /> Twilio
                            </a>
                            <a
                                href="https://vapi.ai/dashboard"
                                target="_blank"
                                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 text-slate-300 transition-colors"
                            >
                                <MessageSquare size={16} /> Vapi.ai
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Onboard Modal */}
            <OnboardModal
                isOpen={showOnboard}
                onClose={() => setShowOnboard(false)}
                onSubmit={handleNewPractice}
            />
        </div>
    );
}
