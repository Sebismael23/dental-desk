'use client';

import { useState } from 'react';
import { X, FileText, Sparkles, Phone, Clock, User, Loader2 } from 'lucide-react';
import { Call, generateAISummary } from '@/lib/mock-data';
import StatusBadge from './status-badge';
import AudioPlayer from './audio-player';

interface CallDetailModalProps {
    call: Call | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function CallDetailModal({ call, isOpen, onClose }: CallDetailModalProps) {
    const [activeTab, setActiveTab] = useState<'transcript' | 'summary'>('transcript');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);

    if (!isOpen || !call) return null;

    const handleGenerateSummary = async () => {
        setIsGenerating(true);
        setActiveTab('summary');
        try {
            const summary = await generateAISummary(call);
            setGeneratedSummary(summary);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleClose = () => {
        setGeneratedSummary(null);
        setActiveTab('transcript');
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex-shrink-0">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {call.name[0]}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{call.name}</h2>
                                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Phone size={14} />
                                        {call.phone}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {call.time} • {call.duration}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <StatusBadge status={call.status} />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Audio Player */}
                    <div className="mt-4">
                        <AudioPlayer duration={call.duration} />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 flex-shrink-0">
                    <button
                        onClick={() => setActiveTab('transcript')}
                        className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'transcript'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <FileText size={16} />
                        Transcript
                    </button>
                    <button
                        onClick={() => setActiveTab('summary')}
                        className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'summary'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Sparkles size={16} />
                        AI Summary
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'transcript' && (
                        <div className="space-y-4">
                            {call.transcript.map((entry, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-3 ${entry.speaker === 'ai' ? '' : 'flex-row-reverse'
                                        }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${entry.speaker === 'ai'
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        {entry.speaker === 'ai' ? 'AI' : <User size={14} />}
                                    </div>
                                    <div
                                        className={`max-w-[80%] ${entry.speaker === 'ai' ? '' : 'text-right'
                                            }`}
                                    >
                                        <div
                                            className={`inline-block px-4 py-2.5 rounded-2xl text-sm ${entry.speaker === 'ai'
                                                    ? 'bg-blue-50 text-slate-700 rounded-tl-none'
                                                    : 'bg-slate-100 text-slate-700 rounded-tr-none'
                                                }`}
                                        >
                                            {entry.text}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1 px-1">
                                            {entry.timestamp}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'summary' && (
                        <div>
                            {!generatedSummary && !isGenerating && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Sparkles size={28} className="text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        Generate AI Summary
                                    </h3>
                                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                        Let AI analyze this call and create a detailed summary with key insights and action items.
                                    </p>
                                    <button
                                        onClick={handleGenerateSummary}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
                                    >
                                        <Sparkles size={18} />
                                        Generate Summary
                                    </button>
                                </div>
                            )}

                            {isGenerating && (
                                <div className="text-center py-12">
                                    <Loader2 size={40} className="text-blue-600 animate-spin mx-auto mb-4" />
                                    <p className="text-slate-600 font-medium">Analyzing call transcript...</p>
                                    <p className="text-sm text-slate-400 mt-1">This may take a few seconds</p>
                                </div>
                            )}

                            {generatedSummary && !isGenerating && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                        <Sparkles size={14} className="text-purple-500" />
                                        <span>AI-generated summary</span>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                        <div className="prose prose-sm prose-slate max-w-none">
                                            {generatedSummary.split('\n').map((line, idx) => {
                                                if (line.startsWith('**') && line.endsWith('**')) {
                                                    return (
                                                        <h4 key={idx} className="font-semibold text-slate-900 mt-4 first:mt-0">
                                                            {line.replace(/\*\*/g, '')}
                                                        </h4>
                                                    );
                                                }
                                                if (line.startsWith('**')) {
                                                    const parts = line.split(':**');
                                                    return (
                                                        <p key={idx} className="text-slate-600">
                                                            <strong className="text-slate-800">{parts[0].replace('**', '')}:</strong>
                                                            {parts[1]}
                                                        </p>
                                                    );
                                                }
                                                if (line.startsWith('- ')) {
                                                    return (
                                                        <p key={idx} className="text-slate-600 pl-4">
                                                            • {line.substring(2)}
                                                        </p>
                                                    );
                                                }
                                                if (line.trim() === '') {
                                                    return <div key={idx} className="h-2" />;
                                                }
                                                return (
                                                    <p key={idx} className="text-slate-600">
                                                        {line}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleGenerateSummary}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                    >
                                        <Sparkles size={14} />
                                        Regenerate Summary
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex-shrink-0">
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                        >
                            Close
                        </button>
                        {call.status === 'action_needed' && (
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                Mark as Resolved
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
