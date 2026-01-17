'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAdminUser } from '@/components/admin/admin-layout';
import {
    Users, Plus, Shield, Mail, Calendar, Loader2,
    Trash2, Edit, Eye, UserCog, AlertCircle, CheckCircle
} from 'lucide-react';

interface AdminUser {
    id: string;
    email: string;
    full_name: string | null;
    role: 'super_admin' | 'admin' | 'viewer';
    created_at: string;
    last_login: string | null;
}

const ROLES = [
    { value: 'super_admin', label: 'Super Admin', description: 'Full access, can manage all admins', color: 'text-purple-400' },
    { value: 'admin', label: 'Admin', description: 'Full access to practices and bookings', color: 'text-blue-400' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access', color: 'text-slate-400' },
];

const ROLE_HIERARCHY = { super_admin: 3, admin: 2, viewer: 1 };

function formatDate(dateStr: string | null) {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function SettingsPage() {
    const currentUser = useAdminUser();
    const supabase = createClient();

    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // New user form
    const [newEmail, setNewEmail] = useState('');
    const [newFullName, setNewFullName] = useState('');
    const [newRole, setNewRole] = useState<'admin' | 'viewer'>('admin');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        fetchAdminUsers();
    }, []);

    const fetchAdminUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setAdminUsers(data || []);
        } catch (err) {
            console.error('Error fetching admin users:', err);
        } finally {
            setLoading(false);
        }
    };

    const canManageRole = (targetRole: string) => {
        if (!currentUser) return false;
        const currentLevel = ROLE_HIERARCHY[currentUser.role] || 0;
        const targetLevel = ROLE_HIERARCHY[targetRole as keyof typeof ROLE_HIERARCHY] || 0;
        return currentLevel > targetLevel;
    };

    const canManageUser = (user: AdminUser) => {
        if (!currentUser) return false;
        if (user.id === currentUser.id) return false; // Can't manage yourself
        return canManageRole(user.role);
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            // Create user via API
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newEmail,
                    password: newPassword,
                    full_name: newFullName,
                    role: newRole,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create user');
            }

            setSuccess('User created successfully! They can now log in.');
            setShowAddModal(false);
            setNewEmail('');
            setNewFullName('');
            setNewPassword('');
            setNewRole('admin');
            fetchAdminUsers();

            setTimeout(() => setSuccess(null), 5000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to create user';
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to remove this admin? They will no longer have access.')) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete user');
            }

            setSuccess('User removed successfully.');
            fetchAdminUsers();
            setTimeout(() => setSuccess(null), 5000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to delete user';
            setError(message);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'super_admin': return <Shield size={16} className="text-purple-400" />;
            case 'admin': return <UserCog size={16} className="text-blue-400" />;
            default: return <Eye size={16} className="text-slate-400" />;
        }
    };

    const getRoleBadge = (role: string) => {
        const roleConfig = ROLES.find(r => r.value === role);
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/50 ${roleConfig?.color || 'text-slate-400'}`}>
                {getRoleIcon(role)}
                {roleConfig?.label || role}
            </span>
        );
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <p className="text-slate-400">Manage admin users and permissions</p>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="mb-6 flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                    <CheckCircle size={20} />
                    <p>{success}</p>
                </div>
            )}
            {error && (
                <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
                        ×
                    </button>
                </div>
            )}

            {/* Admin Users Section */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Users size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-white">Admin Users</h2>
                            <p className="text-sm text-slate-400">
                                {adminUsers.length} user{adminUsers.length !== 1 ? 's' : ''} with admin access
                            </p>
                        </div>
                    </div>
                    {currentUser?.role === 'super_admin' && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                        >
                            <Plus size={18} />
                            Add User
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="p-12 flex items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-blue-400" />
                    </div>
                ) : (
                    <div className="divide-y divide-slate-700">
                        {adminUsers.map((user) => (
                            <div key={user.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                                            {(user.full_name || user.email)[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-white">
                                                    {user.full_name || user.email.split('@')[0]}
                                                </span>
                                                {user.id === currentUser?.id && (
                                                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">You</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Mail size={12} />
                                                    {user.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    Last login: {formatDate(user.last_login)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getRoleBadge(user.role)}
                                        {canManageUser(user) && (
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Remove user"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
                        <div className="p-6 border-b border-slate-700">
                            <h2 className="text-xl font-semibold text-white">Add Admin User</h2>
                            <p className="text-slate-400 text-sm mt-1">
                                Create a new admin account
                            </p>
                        </div>
                        <form onSubmit={handleAddUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={newFullName}
                                    onChange={(e) => setNewFullName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Temporary Password
                                </label>
                                <input
                                    type="text"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimum 8 characters"
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Share this with the user. They can change it after logging in.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Role
                                </label>
                                <div className="space-y-2">
                                    {ROLES.filter(r => r.value !== 'super_admin').map((role) => (
                                        <label
                                            key={role.value}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${newRole === role.value
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-slate-600 hover:border-slate-500'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role.value}
                                                checked={newRole === role.value}
                                                onChange={(e) => setNewRole(e.target.value as 'admin' | 'viewer')}
                                                className="sr-only"
                                            />
                                            <div className={role.color}>
                                                {role.value === 'admin' ? <UserCog size={20} /> : <Eye size={20} />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{role.label}</div>
                                                <div className="text-xs text-slate-400">{role.description}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create User'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
