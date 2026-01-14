'use client';

import { useEffect, useRef, useState } from 'react';

const features = [
    {
        icon: '📊',
        color: 'bg-primary-100 text-primary-600',
        title: 'Real-Time Dashboard',
        desc: 'See every call as it happens. Listen to recordings, read summaries, and track bookings in one simple view.',
    },
    {
        icon: '💬',
        color: 'bg-purple-100 text-purple-600',
        title: 'SMS Follow-Up',
        desc: 'If a patient calls from a mobile phone, DentDesk AI instantly texts them a booking link after the call.',
    },
    {
        icon: '⚡',
        color: 'bg-orange-100 text-orange-600',
        title: 'Emergency Protocols',
        desc: 'Custom logic for nights and weekends. Routes true emergencies to your on-call cell phone instantly.',
    },
    {
        icon: '📅',
        color: 'bg-green-100 text-green-600',
        title: 'Direct Calendar Booking',
        desc: 'Integrates with Dentrix, Eaglesoft, and OpenDental. Appointments sync in real-time.',
    },
    {
        icon: '🎙️',
        color: 'bg-red-100 text-red-600',
        title: 'Call Recordings',
        desc: 'Every call is recorded and transcribed. Review any conversation with one click.',
    },
    {
        icon: '🌙',
        color: 'bg-indigo-100 text-indigo-600',
        title: '24/7 Availability',
        desc: 'Never miss a call again—nights, weekends, holidays. Your AI receptionist never sleeps.',
    },
];

export default function Features() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="features" ref={sectionRef} className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4 text-slate-900">More Than Just An Answering Machine</h2>
                    <p className="text-slate-600">Built specifically for the workflow of modern dental practices.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
