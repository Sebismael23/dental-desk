'use client';

import { useState } from 'react';

const scenarios = {
    booking: {
        patient: "Hi, I'm a new patient and I'd like to schedule a cleaning.",
        ai: "Welcome! I'd be happy to help you schedule your first visit. We have openings Tuesday at 10am or Thursday at 2pm. Which works better?",
    },
    emergency: {
        patient: "I chipped a tooth, it really hurts.",
        ai: "I'm so sorry to hear that. Since you're in pain, that classifies as an emergency. Can you come in at 9 AM tomorrow?",
    },
    reschedule: {
        patient: "I need to reschedule my appointment for next week.",
        ai: "Of course! I see your appointment on the 15th. Would you prefer morning or afternoon for the new time?",
    },
};

const features = [
    {
        icon: '📅',
        color: 'bg-primary-100 text-primary-600',
        title: 'Books Appointments',
        desc: 'Works with your calendar via custom setup.',
    },
    {
        icon: '🛡️',
        color: 'bg-green-100 text-green-600',
        title: 'Filters Spam',
        desc: 'Politely hangs up on Yelp salespeople and robocalls.',
    },
    {
        icon: '🌙',
        color: 'bg-purple-100 text-purple-600',
        title: 'Emergency Triage',
        desc: 'Detects true emergencies and alerts the on-call doctor.',
    },
];

export default function AudioDemo() {
    const [activeScenario, setActiveScenario] = useState<'booking' | 'emergency' | 'reschedule'>('booking');
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const handlePlay = () => {
        if (isPlaying) return;
        setIsPlaying(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsPlaying(false);
                    return 0;
                }
                return prev + 2;
            });
        }, 60);
    };

    return (
        <section id="demo" className="py-20 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Copy */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-slate-900">
                            It sounds like a human.<br />
                            <span className="text-primary-600">Because your patients deserve empathy.</span>
                        </h2>
                        <p className="text-slate-600 mb-8 text-lg">
                            Unlike "Press 1 for hours" bots, DentaVoice understands context, nuance, and urgency. It sounds natural, handles interruptions, and never gets tired.
                        </p>

                        <div className="space-y-4">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-full ${feature.color} flex items-center justify-center flex-shrink-0 text-lg`}>
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                                        <p className="text-sm text-slate-500">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Interactive Player */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-cyan-400 rounded-2xl blur opacity-30" />
                        <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">

                            {/* Chat Messages */}
                            <div className="mb-6 space-y-4">
                                <div className="flex items-end gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">Pt</div>
                                    <div className="bg-slate-100 rounded-2xl rounded-bl-none px-4 py-2 text-sm text-slate-600 max-w-[80%]">
                                        {scenarios[activeScenario].patient}
                                    </div>
                                </div>
                                <div className="flex items-end gap-3 justify-end">
                                    <div className="bg-primary-600 text-white rounded-2xl rounded-br-none px-4 py-3 text-sm shadow-md max-w-[80%]">
                                        {isPlaying ? (
                                            <div className="flex gap-1 h-4 items-center justify-center">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <span
                                                        key={i}
                                                        className="w-1 bg-white rounded-full animate-pulse"
                                                        style={{
                                                            height: `${8 + Math.random() * 12}px`,
                                                            animationDelay: `${i * 75}ms`
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            scenarios[activeScenario].ai
                                        )}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">AI</div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Select Scenario</span>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    {(['booking', 'emergency', 'reschedule'] as const).map((scenario) => (
                                        <button
                                            key={scenario}
                                            onClick={() => { setActiveScenario(scenario); setProgress(0); setIsPlaying(false); }}
                                            className={`flex-1 py-2 text-sm rounded-lg border shadow-sm font-medium transition-all ${activeScenario === scenario
                                                    ? 'bg-white border-primary-500 text-primary-600 ring-2 ring-primary-500 ring-offset-1'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:border-primary-500 hover:text-primary-600'
                                                }`}
                                        >
                                            {scenario === 'booking' ? 'New Patient' : scenario === 'emergency' ? 'Emergency' : 'Reschedule'}
                                        </button>
                                    ))}
                                </div>

                                {/* Play Bar */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handlePlay}
                                        disabled={isPlaying}
                                        className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 disabled:opacity-70"
                                    >
                                        {isPlaying ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <rect x="6" y="4" width="4" height="16" />
                                                <rect x="14" y="4" width="4" height="16" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>
                                    <div className="flex-1">
                                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary-600 transition-all duration-100 ease-linear"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-[10px] text-slate-400">0:00</span>
                                            <span className="text-[10px] text-slate-400">0:18</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
