'use client';

import { useEffect, useRef, useState } from 'react';

const steps = [
    {
        number: '1',
        icon: '📞',
        title: 'We set up your AI receptionist',
        description: 'Tell us your hours and preferences. We handle the rest.',
    },
    {
        number: '2',
        icon: '🔀',
        title: 'Forward missed calls to DentaVoice',
        description: 'When your front desk can\'t answer, calls route automatically.',
    },
    {
        number: '3',
        icon: '📊',
        title: 'See every call in your dashboard',
        description: 'Get instant summaries, recordings, and new patient details.',
    },
];

export default function HowItWorks({ onBookingClick }: { onBookingClick: () => void }) {
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
        <section id="how" ref={sectionRef} className="py-20 md:py-28 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get DentaVoice answering your calls in <span className="font-semibold text-primary-600">24 hours</span>.
                        No technical setup required.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`group relative text-center transition-all duration-500 transform ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {/* Step Number Badge */}
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold text-lg mb-6">
                                {step.number}
                            </div>

                            {/* Icon */}
                            <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 group-hover:scale-110 group-hover:border-primary-200 transition-all duration-300">
                                {step.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {step.description}
                            </p>

                            {/* Connector Arrow (not on last item) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-28 -right-4 lg:-right-6">
                                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center mt-14">
                    <button
                        onClick={onBookingClick}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full font-bold text-lg hover:from-primary-700 hover:to-primary-600 transition-all shadow-xl shadow-primary-500/25 hover:shadow-primary-500/30 hover:-translate-y-1"
                    >
                        <span>Start Your Free 14-Day Pilot</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
