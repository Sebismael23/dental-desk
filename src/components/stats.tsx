'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
    { value: '60%', label: 'of calls go unanswered at dental offices', icon: '📞' },
    { value: '$847', label: 'average value of each new patient', icon: '💰' },
    { value: '24/7', label: 'availability, nights & weekends', icon: '🌙' },
    { value: '98%', label: 'caller satisfaction rate', icon: '⭐' },
];

export default function Stats() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="bg-white py-16 md:py-20 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`text-center transform transition-all duration-700 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="text-3xl mb-3">{stat.icon}</div>
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
