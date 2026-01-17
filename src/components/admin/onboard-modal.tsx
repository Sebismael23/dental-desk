'use client';

import { useState, useEffect } from 'react';
import {
    X, Loader2, Check, Phone, User, Mail, Building,
    AlertCircle, Copy, CheckCircle, ExternalLink, Key
} from 'lucide-react';

interface OnboardPrefill {
    practiceName: string;
    ownerName: string;
    email: string;
    phone: string;
    bookingId?: string;
}

interface OnboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    prefill?: OnboardPrefill | null;
}

type Step = 'info' | 'provisioning' | 'complete' | 'error';

interface Credentials {
    loginUrl: string;
    email: string;
    tempPassword: string;
}

interface ProvisionStatus {
    auth: 'pending' | 'loading' | 'complete' | 'error';
    practice: 'pending' | 'loading' | 'complete' | 'error';
    phone: 'pending' | 'loading' | 'complete' | 'error';
}

export default function OnboardModal({ isOpen, onClose, onSuccess, prefill }: OnboardModalProps) {
    const [step, setStep] = useState<Step>('info');
    const [formData, setFormData] = useState({
        practiceName: '',
        ownerName: '',
        email: '',
        phone: '',
        plan: 'free_trial' as 'free_trial' | 'basic' | 'pro',
    });
    const [credentials, setCredentials] = useState<Credentials | null>(null);
    const [practiceInfo, setPracticeInfo] = useState<{ name: string; aiPhoneNumber: string } | null>(null);
    const [provisionStatus, setProvisionStatus] = useState<ProvisionStatus>({
        auth: 'pending',
        practice: 'pending',
        phone: 'pending',
    });
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Auto-fill from prefill prop (when converting from booking request)
    useEffect(() => {
        if (prefill && isOpen) {
            setFormData({
                practiceName: prefill.practiceName,
                ownerName: prefill.ownerName,
                email: prefill.email,
                phone: prefill.phone,
                plan: 'free_trial',
            });
        }
    }, [prefill, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const copyAllCredentials = async () => {
        if (!credentials || !practiceInfo) return;

        const text = `DentaVoice Login Credentials

Login URL: ${credentials.loginUrl}
Email: ${credentials.email}
Temporary Password: ${credentials.tempPassword}

Your AI Phone Number: ${practiceInfo.aiPhoneNumber}

Please log in and change your password in Settings.`;

        await copyToClipboard(text, 'all');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep('provisioning');
        setError(null);

        // Start provisioning animation
        setProvisionStatus({ auth: 'loading', practice: 'pending', phone: 'pending' });

        try {
            const response = await fetch('/api/admin/create-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create client');
            }

            // Simulate step-by-step completion for better UX
            setProvisionStatus(prev => ({ ...prev, auth: 'complete' }));
            await new Promise(r => setTimeout(r, 400));

            setProvisionStatus(prev => ({ ...prev, practice: 'loading' }));
            await new Promise(r => setTimeout(r, 400));
            setProvisionStatus(prev => ({ ...prev, practice: 'complete' }));

            setProvisionStatus(prev => ({ ...prev, phone: 'loading' }));
            await new Promise(r => setTimeout(r, 400));
            setProvisionStatus(prev => ({ ...prev, phone: 'complete' }));

            // Store credentials and practice info
            setCredentials(data.credentials);
            setPracticeInfo(data.practice);

            await new Promise(r => setTimeout(r, 500));
            setStep('complete');

        } catch (err) {
            console.error('Onboarding error:', err);
            setError(err instanceof Error ? err.message : 'Failed to create client');
            setStep('error');
        }
    };

    const resetModal = () => {
        setStep('info');
        setFormData({ practiceName: '', ownerName: '', email: '', phone: '', plan: 'free_trial' });
        setCredentials(null);
        setPracticeInfo(null);
        setProvisionStatus({ auth: 'pending', practice: 'pending', phone: 'pending' });
        setError(null);
        setCopiedField(null);
    };

    const handleClose = () => {
        if (step === 'complete') {
            onSuccess();
        }
        resetModal();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-700 sticky top-0 bg-slate-800">
                    <h2 className="text-xl font-bold text-white">
                        {step === 'info' && 'Onboard New Client'}
                        {step === 'provisioning' && 'Creating Account...'}
                        {step === 'complete' && '✅ Client Ready!'}
                        {step === 'error' && 'Setup Failed'}
                    </h2>
                    {(step === 'info' || step === 'error' || step === 'complete') && (
                        <button onClick={handleClose} className="text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Step 1: Info Form */}
                    {step === 'info' && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Practice Name *
                                </label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        name="practiceName"
                                        value={formData.practiceName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Smith Family Dental"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Owner Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Dr. Sarah Smith"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Office Phone
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="(555) 123-4567"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Owner Email * <span className="text-slate-500">(This becomes their login)</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="dr.smith@clinic.com"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Plan
                                </label>
                                <select
                                    name="plan"
                                    value={formData.plan}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                >
                                    <option value="free_trial">Free Trial (14 days)</option>
                                    <option value="basic">Basic ($149/mo)</option>
                                    <option value="pro">Pro ($197/mo)</option>
                                </select>
                            </div>

                            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-sm text-slate-400">
                                <p className="flex items-start gap-2">
                                    <Key size={16} className="mt-0.5 text-blue-400" />
                                    A temporary password will be generated. You'll send it to the client so they can log in.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                Create Client Account
                            </button>
                        </form>
                    )}

                    {/* Step 2: Provisioning */}
                    {step === 'provisioning' && (
                        <div className="space-y-6 py-4">
                            <ProvisionStep
                                label="Creating user account"
                                status={provisionStatus.auth}
                            />
                            <ProvisionStep
                                label="Setting up practice"
                                status={provisionStatus.practice}
                            />
                            <ProvisionStep
                                label="Provisioning AI phone number"
                                status={provisionStatus.phone}
                            />
                        </div>
                    )}

                    {/* Step 3: Complete - Show Credentials */}
                    {step === 'complete' && credentials && practiceInfo && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="text-green-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">
                                    {practiceInfo.name}
                                </h3>
                                <p className="text-slate-400">Account created successfully!</p>
                            </div>

                            {/* AI Setup Pending Notice */}
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
                                <div className="text-amber-400 text-sm font-medium mb-1 flex items-center justify-center gap-2">
                                    <AlertCircle size={16} />
                                    AI Setup Required
                                </div>
                                <p className="text-slate-400 text-sm">
                                    Go to Edit Practice to configure the Twilio phone number and Vapi assistant.
                                </p>
                            </div>

                            {/* Credentials Section */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                                    <Key size={16} />
                                    Send these credentials to the client:
                                </h4>
                                <div className="space-y-3">
                                    <CredentialRow
                                        label="Login URL"
                                        value={credentials.loginUrl}
                                        onCopy={() => copyToClipboard(credentials.loginUrl, 'url')}
                                        copied={copiedField === 'url'}
                                    />
                                    <CredentialRow
                                        label="Email"
                                        value={credentials.email}
                                        onCopy={() => copyToClipboard(credentials.email, 'email')}
                                        copied={copiedField === 'email'}
                                    />
                                    <CredentialRow
                                        label="Temp Password"
                                        value={credentials.tempPassword}
                                        onCopy={() => copyToClipboard(credentials.tempPassword, 'password')}
                                        copied={copiedField === 'password'}
                                        isPassword
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={copyAllCredentials}
                                    className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${copiedField === 'all'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                                        }`}
                                >
                                    {copiedField === 'all' ? (
                                        <>
                                            <CheckCircle size={18} />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={18} />
                                            Copy All
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Error */}
                    {step === 'error' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="text-red-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Onboarding Failed
                            </h3>
                            <p className="text-red-400 mb-6">
                                {error}
                            </p>
                            <button
                                onClick={() => setStep('info')}
                                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProvisionStep({
    label,
    status,
}: {
    label: string;
    status: 'pending' | 'loading' | 'complete' | 'error';
}) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center">
                {status === 'pending' && (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
                )}
                {status === 'loading' && (
                    <Loader2 className="text-blue-400 animate-spin" size={20} />
                )}
                {status === 'complete' && (
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Check className="text-green-400" size={14} />
                    </div>
                )}
                {status === 'error' && (
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                        <X className="text-red-400" size={14} />
                    </div>
                )}
            </div>
            <div className={`font-medium ${status === 'pending' ? 'text-slate-500' : status === 'error' ? 'text-red-400' : 'text-white'}`}>
                {label}
            </div>
        </div>
    );
}

function CredentialRow({
    label,
    value,
    onCopy,
    copied,
    isPassword = false
}: {
    label: string;
    value: string;
    onCopy: () => void;
    copied: boolean;
    isPassword?: boolean;
}) {
    return (
        <div className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-2.5">
            <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                <div className={`text-white truncate ${isPassword ? 'font-mono text-lg tracking-wider' : ''}`}>
                    {value}
                </div>
            </div>
            <button
                onClick={onCopy}
                className={`ml-3 p-2 rounded-lg transition-colors ${copied
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white'
                    }`}
            >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            </button>
        </div>
    );
}
