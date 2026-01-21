'use client';

import { useEffect, useRef, useState } from 'react';

const painPoints = [
    {
        icon: '📵',
        text: 'New patients hang up they don\'t leave voicemails',
    },
    {
        icon: '🏃',
        text: 'Call another office that picks up',
    },
    {
        icon: '😫',
        text: 'Your team feels overwhelmed but can\'t do more',
    },
    {
        icon: '💸',
        text: 'You lose revenue you never even knew existed',
    },
];

export default function PainSection() {
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
        <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-br from-slate-200 via-primary-100 to-blue-200 relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-gradient-to-b from-primary-200/40 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-gradient-to-t from-blue-200/40 to-transparent rounded-full blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Subheadline */}
                <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <p className="text-slate-600 text-lg font-medium mb-3">
                        Most dental offices miss calls when the front desk is busy.
                    </p>
                    <p className="text-slate-500 text-lg">
                        That means missed patients and lost revenue.
                    </p>
                </div>

                {/* Main Headline */}
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 text-center mb-12 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    What happens when your front desk{' '}
                    <span className="text-primary-600">can't answer the phone?</span>
                </h2>

                {/* Pain Points Grid */}
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-12">
                    {painPoints.map((point, index) => (
                        <div
                            key={index}
                            className={`group flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-primary-200 hover:shadow-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${200 + index * 100}ms` }}
                        >
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                {point.icon}
                            </div>
                            <p className="text-slate-700 text-lg leading-relaxed pt-2">
                                {point.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Transition Statement */}
                <div className={`text-center transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-block">
                        <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary-400 to-primary-500 mx-auto mb-6" />
                        <p className="text-xl sm:text-2xl text-slate-700 font-medium max-w-2xl">
                            <span className="text-primary-600 font-semibold">DentaVoice</span> exists for one reason:
                            <span className="text-slate-900 font-semibold"> to capture the calls your team physically can't answer.</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
