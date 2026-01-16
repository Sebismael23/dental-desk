import type { Metadata } from 'next';
import AdminLayoutClient from '@/components/admin/admin-layout';

export const metadata: Metadata = {
    title: 'Super Admin | DentaVoice',
    description: 'Concierge onboarding and system health monitoring.',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

