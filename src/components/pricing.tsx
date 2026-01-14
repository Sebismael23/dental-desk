'use client';

import { useEffect, useRef, useState } from 'react';

const features = [
    'Unlimited inbound calls',
    '24/7/365 availability',
    'Direct calendar booking',
    'New patient intake',
    'SMS confirmations',
    'Call recordings & transcripts',
    'Custom voice & script',
    'Insurance pre-qualification',
];

export default function Pricing() {
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
        <section id="pricing" ref={sectionRef} className="py-20 bg-slate-900 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to clear your missed calls?</h2>

                {/* Stats */}
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-12">
                    <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm">
                        <h3 className="text-4xl font-bold text-primary-400">30%</h3>
                        <p className="text-left text-sm text-slate-300 leading-tight">Increase in<br />New Patients</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm">
                        <h3 className="text-4xl font-bold text-green-400">0s</h3>
                        <p className="text-left text-sm text-slate-300 leading-tight">Hold Time<br />Guaranteed</p>
                    </div>
                </div>

                {/* Pricing Card */}
                <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-md mx-auto mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}>
                    <div className="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-2">Professional</div>
                    <div className="flex items-baseline justify-center gap-1 mb-6">
                        <span className="text-5xl font-bold">$297</span>
                        <span className="text-slate-400">/month</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8 text-left">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                <svg className="w-4 h-4 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="bg-primary-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-primary-500 transition-all shadow-xl shadow-primary-500/20 transform hover:-translate-y-1">
                    Start Your 14-Day Free Pilot
                </button>
                <p className="mt-6 text-slate-400 text-sm">No credit card required for setup • Cancel anytime</p>
            </div>
        </section>
    );
}
