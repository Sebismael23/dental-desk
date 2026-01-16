'use client';

import { useState } from 'react';
import { Calendar, FileText, ChevronRight } from 'lucide-react';
import StatCard from '../stat-card';
import StatusBadge from '../status-badge';
import AudioPlayer from '../audio-player';
import CallDetailModal from '../call-detail-modal';
import { Call, MOCK_CALLS, MOCK_STATS, MOCK_USER } from '@/lib/mock-data';

type TabType = 'all' | 'booked' | 'action_needed';

export default function OverviewScreen() {
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredCalls = activeTab === 'all'
        ? MOCK_CALLS
        : MOCK_CALLS.filter(call => call.status === activeTab);

    const handleViewDetails = (call: Call) => {
        setSelectedCall(call);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 text-sm">Welcome back, {MOCK_USER.name}</p>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2 transition-colors">
                    <Calendar size={16} />
                    View Calendar
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_STATS.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            {/* Recent Calls Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-lg font-bold text-slate-900">Recent Calls</h2>
                    <div className="flex gap-2">
                        {(['all', 'booked', 'action_needed'] as TabType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab
                                        ? 'bg-slate-100 text-slate-900'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {tab.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Caller</th>
                                <th className="px-6 py-4">AI Summary</th>
                                <th className="px-6 py-4">Recording</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCalls.map((call) => (
                                <tr
                                    key={call.id}
                                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                    onClick={() => handleViewDetails(call)}
                                >
                                    <td className="px-6 py-4">
                                        <StatusBadge status={call.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">{call.name}</div>
                                        <div className="text-xs text-slate-400">
                                            {call.time} • {call.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="truncate text-slate-600" title={call.summary}>
                                            {call.summary}
                                        </p>
                                        {call.priority === 'high' && (
                                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider mt-1 block">
                                                Emergency Detected
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <AudioPlayer duration={call.duration} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewDetails(call);
                                            }}
                                            className="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-50 inline-flex items-center gap-1 text-xs font-medium"
                                        >
                                            <FileText size={14} />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-slate-100">
                    {filteredCalls.map((call) => (
                        <div
                            key={call.id}
                            className="p-4 space-y-3 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => handleViewDetails(call)}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-semibold text-slate-900">{call.name}</div>
                                    <div className="text-xs text-slate-400">
                                        {call.time} • {call.phone}
                                    </div>
                                </div>
                                <StatusBadge status={call.status} />
                            </div>
                            <p className="text-sm text-slate-600">{call.summary}</p>
                            {call.priority === 'high' && (
                                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                                    Emergency Detected
                                </span>
                            )}
                            <div className="flex items-center justify-between">
                                <div onClick={(e) => e.stopPropagation()}>
                                    <AudioPlayer duration={call.duration} />
                                </div>
                                <button className="text-blue-600 text-xs font-medium flex items-center gap-1">
                                    <FileText size={12} />
                                    Transcript
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-100 text-center">
                    <button className="text-sm text-blue-600 font-medium hover:underline flex items-center justify-center gap-1 w-full">
                        View All History <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Call Detail Modal */}
            <CallDetailModal
                call={selectedCall}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
