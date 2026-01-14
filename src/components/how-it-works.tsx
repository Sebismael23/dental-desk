'use client';

import { useEffect, useRef, useState } from 'react';

const steps = [
    {
        number: '1',
        icon: '📋',
        title: 'Tell Us About Your Practice',
        description: 'Share your hours, services, providers, and common patient questions. We\'ll customize your AI to sound just like your front desk.',
        features: ['Custom greeting', 'Practice-specific responses', 'Insurance handling'],
    },
    {
        number: '2',
        icon: '📅',
        title: 'Connect Your Calendar',
        description: 'We integrate with Dentrix, Eaglesoft, Open Dental, and others. Your AI sees real-time availability and books directly.',
        features: ['Direct scheduling', 'Real-time availability', 'Automatic sync'],
    },
    {
        number: '3',
        icon: '📞',
        title: 'Forward Your Calls',
        description: 'Set up call forwarding when your staff is busy, after hours, or always. Your AI handles the rest and you get notified of every call.',
        features: ['After-hours routing', 'Overflow handling', 'Instant notifications'],
    },
];

export default function HowItWorks() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="how" ref={sectionRef} className="py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-primary-100/80 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <span>⚡</span>
                        <span>Quick & Easy Setup</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get your AI receptionist up and running in 48 hours with zero technical setup required
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {/* Step Number */}
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                                {step.number}
                            </div>

                            {/* Icon */}
                            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                                {step.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {step.description}
                            </p>

                            {/* Features */}
                            <div className="space-y-2">
                                {step.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            {/* Connector Line (not on last item) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 w-12 lg:w-16 h-0.5 bg-gradient-to-r from-primary-200 to-transparent" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Integrations */}
                <div className="mt-16 text-center">
                    <p className="text-gray-500 mb-6">Integrates with your existing tools</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                        {['Dentrix', 'Eaglesoft', 'Open Dental', 'Curve', 'Practice Web'].map((tool, i) => (
                            <div key={i} className="text-gray-400 font-semibold text-lg hover:text-primary-600 transition-colors cursor-default">
                                {tool}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
