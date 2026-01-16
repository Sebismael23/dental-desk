'use client';

import { useState } from 'react';
import { Search, Filter, Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from '../status-badge';
import AudioPlayer from '../audio-player';
import CallDetailModal from '../call-detail-modal';
import { Call, MOCK_CALLS } from '@/lib/mock-data';

export default function CallLogsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredCalls = MOCK_CALLS.filter((call) => {
        const matchesSearch =
            call.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            call.phone.includes(searchQuery) ||
            call.summary.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (call: Call) => {
        setSelectedCall(call);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Call Logs</h1>
                    <p className="text-slate-500 text-sm">
                        View and manage all incoming call recordings
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or summary..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="booked">Booked</option>
                            <option value="action_needed">Follow Up</option>
                            <option value="missed">Missed</option>
                            <option value="spam">Spam</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-700">{filteredCalls.length}</span> calls
            </p>

            {/* Calls List */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Caller</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">AI Summary</th>
                                <th className="px-6 py-4">Recording</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCalls.map((call) => (
                                <tr
                                    key={call.id}
                                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                                    onClick={() => handleViewDetails(call)}
                                >
                                    <td className="px-6 py-4">
                                        <StatusBadge status={call.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">{call.name}</div>
                                        <div className="text-xs text-slate-400">{call.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{call.time}</td>
                                    <td className="px-6 py-4 text-slate-500 tabular-nums">
                                        {call.duration}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="truncate text-slate-600" title={call.summary}>
                                            {call.summary}
                                        </p>
                                        {call.priority === 'high' && (
                                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider mt-1 block">
                                                Priority: High
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
                                        {call.time} • {call.duration}
                                    </div>
                                </div>
                                <StatusBadge status={call.status} />
                            </div>
                            <p className="text-sm text-slate-600">{call.summary}</p>
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

                {/* Empty State */}
                {filteredCalls.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-slate-500">No calls match your search criteria</p>
                    </div>
                )}

                {/* Pagination */}
                {filteredCalls.length > 0 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Page 1 of 1
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled
                                className="p-2 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-50"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                disabled
                                className="p-2 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-50"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
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
