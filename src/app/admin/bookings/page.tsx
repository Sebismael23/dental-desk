'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Calendar, Clock, Mail, Phone, Search,
    Loader2, CheckCircle, X, MoreVertical,
    PhoneCall, UserPlus, Trash2, Filter, ArrowRight
} from 'lucide-react';
import { useAdminUser } from '@/components/admin/admin-layout';

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
    notes?: string;
}

const GOAL_LABELS: Record<string, string> = {
    missed_calls: 'Missed Calls',
    staffing: 'Staffing Issues',
    emergency: 'After-Hours',
    demo: 'Demo Request',
};

const STATUS_TABS = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'completed', label: 'Completed' },
    { key: 'not_interested', label: 'Not Interested' },
    { key: 'unsubscribed', label: 'Unsubscribed' },
];

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        new: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        pending: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        scheduled: 'bg-green-500/10 text-green-400 border-green-500/20',
        completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        not_interested: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        unsubscribed: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border uppercase ${styles[status] || styles.new}`}>
            {status.replace('_', ' ')}
        </span>
    );
}

function formatTimeAgo(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

export default function BookingsHistoryPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenu, setOpenMenu] = useState<{ id: string; rect: DOMRect } | null>(null);

    // Get current admin user and check permissions
    const adminUser = useAdminUser();
    const canEdit = adminUser?.role !== 'viewer'; // Viewers cannot edit

    useEffect(() => {
        fetchBookings();
    }, []);

    // Close dropdown on scroll or click outside
    useEffect(() => {
        const handleScroll = () => setOpenMenu(null);
        const handleClickOutside = () => setOpenMenu(null);

        if (openMenu) {
            window.addEventListener('scroll', handleScroll, true);
            // Delay adding click listener to avoid immediate close
            const timer = setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 100);
            return () => {
                window.removeEventListener('scroll', handleScroll, true);
                document.removeEventListener('click', handleClickOutside);
                clearTimeout(timer);
            };
        }
    }, [openMenu]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/bookings');
            const data = await res.json();
            if (data.bookings) {
                setBookings(data.bookings);
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (id: string, newStatus: string) => {
        try {
            await fetch('/api/admin/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });
            fetchBookings();
        } catch (err) {
            console.error('Error updating booking:', err);
        }
        setOpenMenu(null);
    };

    const deleteBooking = async (id: string) => {
        if (!confirm('Are you sure you want to delete this booking request?')) return;
        try {
            await fetch('/api/admin/bookings', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            fetchBookings();
        } catch (err) {
            console.error('Error deleting booking:', err);
        }
    };

    const onboardClient = (booking: BookingRequest) => {
        // Navigate to admin page with pre-filled data via URL params
        const params = new URLSearchParams({
            onboard: 'true',
            name: `${booking.first_name} ${booking.last_name} Dental`,
            owner: `${booking.first_name} ${booking.last_name}`,
            email: booking.email,
            phone: booking.phone,
            bookingId: booking.id,
        });
        router.push(`/admin?${params.toString()}`);
    };

    const filteredBookings = bookings.filter(b => {
        const matchesSearch =
            `${b.first_name} ${b.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || b.status === activeTab ||
            (activeTab === 'new' && (!b.status || b.status === 'pending'));
        return matchesSearch && matchesTab;
    });

    const tabCounts = STATUS_TABS.reduce((acc, tab) => {
        if (tab.key === 'all') {
            acc[tab.key] = bookings.length;
        } else if (tab.key === 'new') {
            acc[tab.key] = bookings.filter(b => !b.status || b.status === 'pending' || b.status === 'new').length;
        } else {
            acc[tab.key] = bookings.filter(b => b.status === tab.key).length;
        }
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-xl font-bold">Booking History</h1>
                        <p className="text-slate-400 text-sm">
                            {bookings.length} total requests
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Tabs and Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Status Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {STATUS_TABS.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.key
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                                {tabCounts[tab.key] > 0 && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-slate-700 rounded text-xs">
                                        {tabCounts[tab.key]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex-1 md:max-w-sm md:ml-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                        </div>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="animate-spin text-blue-400" size={32} />
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="bg-slate-800 rounded-xl p-12 text-center">
                        <Calendar className="mx-auto text-slate-600 mb-4" size={48} />
                        <h3 className="text-lg font-semibold text-slate-300 mb-2">
                            No bookings found
                        </h3>
                        <p className="text-slate-500">
                            {activeTab === 'all'
                                ? 'No booking requests yet'
                                : `No ${activeTab.replace('_', ' ')} bookings`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                        <div className="divide-y divide-slate-700">
                            {filteredBookings.map((booking) => (
                                <div key={booking.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-white text-lg">
                                                    {booking.first_name} {booking.last_name}
                                                </h3>
                                                <StatusBadge status={booking.status || 'new'} />
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Mail size={14} />
                                                    {booking.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Phone size={14} />
                                                    {booking.phone}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {formatTimeAgo(booking.created_at)}
                                                </span>
                                            </div>
                                            {booking.goal && (
                                                <div className="mt-2 text-sm">
                                                    <span className="text-slate-500">Goal: </span>
                                                    <span className="text-slate-300">
                                                        {GOAL_LABELS[booking.goal] || booking.goal}
                                                    </span>
                                                </div>
                                            )}
                                            {booking.details && (
                                                <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                                                    {booking.details}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {/* Convert to Client button for scheduled/completed */}
                                            {canEdit && (booking.status === 'scheduled' || booking.status === 'completed' || !booking.status || booking.status === 'new' || booking.status === 'contacted') && (
                                                <button
                                                    onClick={() => onboardClient(booking)}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                                                >
                                                    <UserPlus size={14} />
                                                    Onboard
                                                </button>
                                            )}

                                            {/* Contact Actions */}
                                            <a
                                                href={`mailto:${booking.email}`}
                                                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2"
                                            >
                                                <Mail size={14} />
                                            </a>
                                            <a
                                                href={`tel:${booking.phone}`}
                                                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2"
                                            >
                                                <PhoneCall size={14} />
                                            </a>

                                            {/* Status Dropdown */}
                                            {canEdit && (
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setOpenMenu(openMenu?.id === booking.id ? null : { id: booking.id, rect });
                                                        }}
                                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>

                                                    {openMenu?.id === booking.id && (
                                                        <div
                                                            className="fixed bg-slate-700 border border-slate-600 rounded-lg shadow-xl py-1 z-[9999] min-w-[180px] max-h-[300px] overflow-y-auto"
                                                            style={{
                                                                top: openMenu.rect.bottom + 4,
                                                                left: Math.max(8, openMenu.rect.right - 180),
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <div className="px-3 py-1 text-xs text-slate-400 uppercase font-semibold">
                                                                Change Status
                                                            </div>
                                                            <button
                                                                onClick={() => updateBookingStatus(booking.id, 'new')}
                                                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-600 text-white flex items-center gap-2"
                                                            >
                                                                <div className="w-2 h-2 rounded-full bg-purple-400" />
                                                                New
                                                            </button>
                                                            <button
                                                                onClick={() => updateBookingStatus(booking.id, 'contacted')}
                                                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-600 text-white flex items-center gap-2"
                                                            >
                                                                <div className="w-2 h-2 rounded-full bg-blue-400" />
                                                                Contacted
                                                            </button>
                                                            <button
                                                                onClick={() => updateBookingStatus(booking.id, 'scheduled')}
                                                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-600 text-white flex items-center gap-2"
                                                            >
                                                                <div className="w-2 h-2 rounded-full bg-green-400" />
                                                                Scheduled
                                                            </button>
                                                            <button
                                                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                                                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-600 text-white flex items-center gap-2"
                                                            >
                                                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                                                Completed
                                                            </button>
                                                            <button
                                                                onClick={() => updateBookingStatus(booking.id, 'not_interested')}
                                                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-600 text-white flex items-center gap-2"
                                                            >
                                                                <div className="w-2 h-2 rounded-full bg-slate-400" />
                                                                Not Interested
                                                            </button>
                                                            <button
                                                                onClick={() => updateBookingStatus(booking.id, 'unsubscribed')}
                                                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-600 text-white flex items-center gap-2"
                                                            >
                                                                <div className="w-2 h-2 rounded-full bg-red-400" />
                                                                Unsubscribed
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
