import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | DentaVoice',
    description: 'Manage your AI receptionist, view call logs, and configure settings.',
};

export default function DashboardRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
