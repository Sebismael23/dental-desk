'use client';

import { Users, Link2 } from 'lucide-react';

export default function PatientsScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4">
            {/* Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-400">
                <Users size={48} />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Patients CRM</h2>
                <p className="text-slate-500 max-w-md leading-relaxed">
                    Connect your practice management system to sync patient data, appointment history, and contact information automatically.
                </p>
            </div>

            {/* Supported Integrations */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
                {['Dentrix', 'OpenDental', 'Eaglesoft', 'Curve Dental'].map((system) => (
                    <span
                        key={system}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600"
                    >
                        {system}
                    </span>
                ))}
            </div>

            {/* CTA Button */}
            <button className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25">
                <Link2 size={18} />
                Connect Your CRM
            </button>

            {/* Help Text */}
            <p className="text-xs text-slate-400 pt-4">
                Don't see your system? <a href="#" className="text-blue-600 hover:underline">Contact us</a> for custom integration.
            </p>
        </div>
    );
}
