'use client';

import { useState } from 'react';
import { AlertCircle, Volume2 } from 'lucide-react';
import { VOICE_OPTIONS, DEFAULT_OFFICE_HOURS } from '@/lib/mock-data';

export default function SettingsScreen() {
    const [emergencyMode, setEmergencyMode] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState('sarah');
    const [officeHours, setOfficeHours] = useState(DEFAULT_OFFICE_HOURS);

    const toggleDayEnabled = (dayIndex: number) => {
        setOfficeHours(prev =>
            prev.map((item, idx) =>
                idx === dayIndex ? { ...item, enabled: !item.enabled } : item
            )
        );
    };

    const updateHours = (dayIndex: number, field: 'open' | 'close', value: string) => {
        setOfficeHours(prev =>
            prev.map((item, idx) =>
                idx === dayIndex ? { ...item, [field]: value } : item
            )
        );
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Configuration</h1>
                <p className="text-slate-500 text-sm">
                    Manage how your AI receptionist behaves.
                </p>
            </div>

            {/* Emergency Toggle Card */}
            <div
                className={`p-6 rounded-2xl border transition-all ${emergencyMode
                        ? 'bg-red-50 border-red-200'
                        : 'bg-white border-slate-200'
                    }`}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div
                            className={`p-2 rounded-lg ${emergencyMode
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                        >
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <h3
                                className={`font-bold ${emergencyMode ? 'text-red-900' : 'text-slate-900'
                                    }`}
                            >
                                Emergency Mode
                            </h3>
                            <p
                                className={`text-sm ${emergencyMode ? 'text-red-700' : 'text-slate-500'
                                    }`}
                            >
                                {emergencyMode
                                    ? 'AI is currently telling callers the office is CLOSED due to emergency.'
                                    : 'AI is operating on standard schedule.'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setEmergencyMode(!emergencyMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emergencyMode ? 'bg-red-500' : 'bg-slate-300'
                            }`}
                        role="switch"
                        aria-checked={emergencyMode}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emergencyMode ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Voice Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Volume2 size={20} className="text-slate-500" />
                    <h3 className="font-bold text-slate-900">AI Voice Persona</h3>
                </div>
                <div className="space-y-3">
                    {VOICE_OPTIONS.map((voice) => (
                        <label
                            key={voice.id}
                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedVoice === voice.id
                                    ? 'border-blue-500 bg-blue-50/50'
                                    : 'border-slate-100 hover:border-slate-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                                    {voice.name[0]}
                                </div>
                                <div>
                                    <span className="font-medium text-slate-700 block">
                                        {voice.name}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {voice.description}
                                    </span>
                                </div>
                            </div>
                            <input
                                type="radio"
                                name="voice"
                                checked={selectedVoice === voice.id}
                                onChange={() => setSelectedVoice(voice.id)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-4">Office Hours</h3>
                <div className="space-y-4">
                    {officeHours.map((schedule, idx) => (
                        <div
                            key={schedule.day}
                            className={`flex items-center justify-between text-sm ${!schedule.enabled ? 'opacity-50' : ''
                                }`}
                        >
                            <span className="font-medium text-slate-700 w-24">
                                {schedule.day}
                            </span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="time"
                                    value={schedule.open}
                                    onChange={(e) => updateHours(idx, 'open', e.target.value)}
                                    disabled={!schedule.enabled}
                                    className="border border-slate-200 rounded px-2 py-1.5 text-slate-600 disabled:bg-slate-50"
                                />
                                <span className="text-slate-400">to</span>
                                <input
                                    type="time"
                                    value={schedule.close}
                                    onChange={(e) => updateHours(idx, 'close', e.target.value)}
                                    disabled={!schedule.enabled}
                                    className="border border-slate-200 rounded px-2 py-1.5 text-slate-600 disabled:bg-slate-50"
                                />
                            </div>
                            <div className="w-12 text-right">
                                <button
                                    onClick={() => toggleDayEnabled(idx)}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${schedule.enabled ? 'bg-blue-500' : 'bg-slate-300'
                                        }`}
                                    role="switch"
                                    aria-checked={schedule.enabled}
                                >
                                    <span
                                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${schedule.enabled ? 'translate-x-5' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
                <button className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Cancel
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Save Changes
                </button>
            </div>
        </div>
    );
}
