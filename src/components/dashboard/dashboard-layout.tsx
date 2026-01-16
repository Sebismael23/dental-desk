'use client';

import { useState } from 'react';
import Sidebar, { ViewType } from './sidebar';
import MobileHeader from './mobile-header';
import OverviewScreen from './screens/overview-screen';
import SettingsScreen from './screens/settings-screen';
import CallLogsScreen from './screens/call-logs-screen';
import PatientsScreen from './screens/patients-screen';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');

    const renderScreen = () => {
        switch (currentView) {
            case 'dashboard':
                return <OverviewScreen />;
            case 'calls':
                return <CallLogsScreen />;
            case 'leads':
                return <PatientsScreen />;
            case 'settings':
                return <SettingsScreen />;
            default:
                return <OverviewScreen />;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                currentView={currentView}
                onNavigate={setCurrentView}
            />

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-auto">
                {/* Mobile Header */}
                <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

                {/* Page Content */}
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {renderScreen()}
                </div>
            </main>
        </div>
    );
}
