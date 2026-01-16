'use client';

import { Phone, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    change: string;
    icon: string;
    color: 'blue' | 'green' | 'emerald' | 'orange' | 'red';
}

const iconMap = {
    phone: Phone,
    calendar: Calendar,
    check: CheckCircle,
    alert: AlertCircle,
};

const colorClasses = {
    blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-500',
    },
    green: {
        bg: 'bg-green-50',
        text: 'text-green-500',
    },
    emerald: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-500',
    },
    orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-500',
    },
    red: {
        bg: 'bg-red-50',
        text: 'text-red-500',
    },
};

export default function StatCard({ label, value, change, icon, color }: StatCardProps) {
    const Icon = iconMap[icon as keyof typeof iconMap] || Phone;
    const colors = colorClasses[color] || colorClasses.blue;
    const isPositive = change.startsWith('+');

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
                <span className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                    {change}{' '}
                    <span className="text-slate-400 font-normal">vs yesterday</span>
                </span>
            </div>
            <div className={`p-3 rounded-xl ${colors.bg}`}>
                <Icon size={24} className={colors.text} />
            </div>
        </div>
    );
}
