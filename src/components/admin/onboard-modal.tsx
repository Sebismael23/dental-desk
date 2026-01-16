'use client';

import { useState } from 'react';
import { X, Loader2, Check, Phone, User, Mail, Building, AlertCircle } from 'lucide-react';

interface OnboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

type Step = 'info' | 'provisioning' | 'complete' | 'error';

interface ProvisionStatus {
    supabase: 'pending' | 'loading' | 'complete' | 'error';
    twilio: 'pending' | 'loading' | 'complete' | 'error';
    vapi: 'pending' | 'loading' | 'complete' | 'error';
}

export default function OnboardModal({ isOpen, onClose, onSubmit }: OnboardModalProps) {
    const [step, setStep] = useState<Step>('info');
    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        email: '',
        phone: '',
        plan: 'free_trial' as 'free_trial' | 'basic' | 'pro',
    });
    const [provisionedNumber, setProvisionedNumber] = useState<string | null>(null);
    const [provisionStatus, setProvisionStatus] = useState<ProvisionStatus>({
        supabase: 'pending',
        twilio: 'pending',
        vapi: 'pending',
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep('provisioning');
        setError(null);

        // Step 1: Show loading for Supabase
        setProvisionStatus(prev => ({ ...prev, supabase: 'loading' }));

        try {
            // Call API route (uses service role key server-side)
            const response = await fetch('/api/admin/practices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create practice');
            }

            // Step 1 complete
            setProvisionStatus(prev => ({ ...prev, supabase: 'complete' }));

            // Step 2: Twilio number (already done in API)
            setProvisionStatus(prev => ({ ...prev, twilio: 'loading' }));
            await new Promise(resolve => setTimeout(resolve, 800));

            if (data.practice?.ai_phone_number) {
                setProvisionedNumber(data.practice.ai_phone_number);
            }
            setProvisionStatus(prev => ({ ...prev, twilio: 'complete' }));

            // Step 3: Vapi assistant (already done in API)
            setProvisionStatus(prev => ({ ...prev, vapi: 'loading' }));
            await new Promise(resolve => setTimeout(resolve, 600));
            setProvisionStatus(prev => ({ ...prev, vapi: 'complete' }));

            // Complete!
            setStep('complete');

            // Wait and close
            setTimeout(() => {
                onSubmit();
                resetModal();
            }, 2000);

        } catch (err) {
            console.error('Onboarding error:', err);
            setError(err instanceof Error ? err.message : 'Failed to create practice');
            setStep('error');
        }
    };

    const resetModal = () => {
        setStep('info');
        setFormData({ name: '', ownerName: '', email: '', phone: '', plan: 'free_trial' });
        setProvisionedNumber(null);
        setProvisionStatus({ supabase: 'pending', twilio: 'pending', vapi: 'pending' });
        setError(null);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">
                        {step === 'info' && 'Onboard New Client'}
                        {step === 'provisioning' && 'Setting Up...'}
                        {step === 'complete' && 'Setup Complete!'}
                        {step === 'error' && 'Setup Failed'}
                    </h2>
                    {(step === 'info' || step === 'error') && (
                        <button onClick={handleClose} className="text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 'info' && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Practice Name
                                </label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
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
                                        Owner Name
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
                                    Owner Email
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
                                    <option value="free_trial">Free Trial (30 days)</option>
                                    <option value="basic">Basic ($99/mo)</option>
                                    <option value="pro">Pro ($199/mo)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2 mt-6"
                            >
                                Start Provisioning
                            </button>
                        </form>
                    )}

                    {step === 'provisioning' && (
                        <div className="space-y-6 py-4">
                            <ProvisionStep
                                label="Creating practice in database"
                                status={provisionStatus.supabase}
                            />
                            <ProvisionStep
                                label="Provisioning AI phone number"
                                status={provisionStatus.twilio}
                                detail={provisionedNumber || undefined}
                            />
                            <ProvisionStep
                                label="Setting up Vapi AI assistant"
                                status={provisionStatus.vapi}
                            />
                        </div>
                    )}

                    {step === 'complete' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="text-green-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                {formData.name} is ready!
                            </h3>
                            <p className="text-slate-400 mb-4">
                                AI phone number provisioned:
                            </p>
                            <div className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg font-mono text-lg text-green-400">
                                <Phone size={18} /> {provisionedNumber}
                            </div>
                        </div>
                    )}

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
    detail
}: {
    label: string;
    status: 'pending' | 'loading' | 'complete' | 'error';
    detail?: string;
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
            <div className="flex-1">
                <div className={`font-medium ${status === 'pending' ? 'text-slate-500' : status === 'error' ? 'text-red-400' : 'text-white'}`}>
                    {label}
                </div>
                {detail && (
                    <div className="text-sm text-green-400 font-mono">{detail}</div>
                )}
            </div>
        </div>
    );
}
