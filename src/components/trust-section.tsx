'use client';

import { useEffect, useRef, useState } from 'react';

const trustPoints = [
    {
        icon: '🦷',
        title: 'Dental Practices',
        desc: 'General, cosmetic, and family dentistry',
    },
    {
        icon: '😁',
        title: 'Orthodontic Offices',
        desc: 'Braces, aligners, and specialty treatments',
    },
    {
        icon: '🏥',
        title: 'Multi-Location Groups',
        desc: 'DSOs and practice networks',
    },
];

export default function TrustSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-16 md:py-20 bg-gradient-to-b from-white to-slate-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-3">
                        Purpose-Built
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Built for Appointment-Based Healthcare
                    </h2>
                    <p className="text-lg text-slate-600">
                        Starting with dental &amp; orthodontic practices
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {trustPoints.map((point, index) => (
                        <div
                            key={index}
                            className={`text-center p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${100 + index * 100}ms` }}
                        >
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
                                {point.icon}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                {point.title}
                            </h3>
                            <p className="text-slate-500 text-sm">
                                {point.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Problem statements section */}
                <div className={`mt-14 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <p className="text-center text-sm font-medium text-slate-500 uppercase tracking-wide mb-6">
                        What we hear from dental offices
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="flex items-start gap-3">
                                <span className="text-primary-500 mt-1">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <p className="text-slate-700 text-sm leading-relaxed italic">
                                    &ldquo;We miss calls when patients are checking in&rdquo;
                                </p>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="flex items-start gap-3">
                                <span className="text-primary-500 mt-1">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <p className="text-slate-700 text-sm leading-relaxed italic">
                                    &ldquo;Voicemail doesn&apos;t convert new patients&rdquo;
                                </p>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="flex items-start gap-3">
                                <span className="text-primary-500 mt-1">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <p className="text-slate-700 text-sm leading-relaxed italic">
                                    &ldquo;The front desk can&apos;t answer phones and help patients at the same time&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
