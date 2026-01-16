'use client';

import { CheckCircle, AlertCircle, XCircle, PhoneMissed } from 'lucide-react';

type CallStatus = 'booked' | 'action_needed' | 'spam' | 'missed';

interface StatusBadgeProps {
    status: CallStatus;
}

const statusConfig = {
    booked: {
        styles: 'bg-green-100 text-green-700 border-green-200',
        label: 'Booked',
        Icon: CheckCircle,
    },
    action_needed: {
        styles: 'bg-orange-100 text-orange-700 border-orange-200',
        label: 'Follow Up',
        Icon: AlertCircle,
    },
    spam: {
        styles: 'bg-slate-100 text-slate-600 border-slate-200',
        label: 'Spam Blocked',
        Icon: XCircle,
    },
    missed: {
        styles: 'bg-red-100 text-red-700 border-red-200',
        label: 'Missed',
        Icon: PhoneMissed,
    },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.spam;
    const { styles, label, Icon } = config;

    return (
        <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles} flex items-center gap-1 w-fit`}
        >
            <Icon size={12} />
            {label}
        </span>
    );
}
