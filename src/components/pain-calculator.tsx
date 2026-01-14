'use client';

import { useState, useEffect, useRef } from 'react';

export default function PainCalculator() {
    const [missedCalls, setMissedCalls] = useState(15);
    const [patientValue, setPatientValue] = useState(1200);
    const [conversionRate, setConversionRate] = useState(30);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const MONTHLY_COST = 297;

    // Calculation: Missed calls per week * 4 weeks * conversion rate * patient value
    const monthlyRevenue = Math.round(missedCalls * 4 * (conversionRate / 100) * patientValue);
    const annualRevenue = monthlyRevenue * 12;

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
        <section id="calculator" ref={sectionRef} className="py-20 bg-slate-50 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-slate-900">
                        The High Cost of <span className="text-red-500">&quot;Please Leave a Message&quot;</span>
                    </h2>
                    <p className="text-slate-600">See exactly how much revenue you&apos;re losing every month based on industry averages.</p>
                </div>

                <div className={`bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <div className="grid md:grid-cols-2 gap-12">

                        {/* Inputs */}
                        <div className="space-y-8">
                            {/* Missed Calls */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-semibold text-slate-700">Missed Calls Per Week</label>
                                    <span className="text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded text-sm">{missedCalls}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={missedCalls}
                                    onChange={(e) => setMissedCalls(Number(e.target.value))}
                                    className="w-full"
                                />
                                <p className="text-xs text-slate-400 mt-2">Avg practice misses 15-20 calls/week</p>
                            </div>

                            {/* Patient Value */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-semibold text-slate-700">Avg. Patient Lifetime Value</label>
                                    <span className="text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded text-sm">${patientValue.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="500"
                                    max="5000"
                                    step="100"
                                    value={patientValue}
                                    onChange={(e) => setPatientValue(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            {/* Conversion Rate */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-semibold text-slate-700">Booking Rate (if answered)</label>
                                    <span className="text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded text-sm">{conversionRate}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="80"
                                    value={conversionRate}
                                    onChange={(e) => setConversionRate(Number(e.target.value))}
                                    className="w-full"
                                />
                                <p className="text-xs text-slate-400 mt-2">How many missed calls turn into patients if answered instantly?</p>
                            </div>
                        </div>

                        {/* Output Card */}
                        <div className="flex flex-col justify-center items-center bg-slate-900 rounded-2xl p-8 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full blur-[60px] opacity-20" />

                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Potential Recovered Revenue</p>
                            <h3 className="text-5xl font-bold mb-2 text-white">${monthlyRevenue.toLocaleString()}</h3>
                            <p className="text-slate-400 text-sm mb-8">per month</p>

                            <div className="w-full h-px bg-slate-700 mb-6" />

                            <div className="flex justify-between w-full text-sm mb-2">
                                <span className="text-slate-400">Annual Revenue:</span>
                                <span className="font-bold text-green-400">${annualRevenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between w-full text-sm">
                                <span className="text-slate-400">Cost of DentDesk AI:</span>
                                <span className="font-bold text-white">${MONTHLY_COST}/mo</span>
                            </div>

                            <button className="w-full mt-8 bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 rounded-lg transition-colors">
                                Recover This Revenue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
