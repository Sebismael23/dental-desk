'use client';

export default function Hero({ onDemoClick }: { onDemoClick: () => void }) {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
            {/* Background blobs */}
            <div className="hero-blob w-[800px] h-[800px] -top-20 -left-20 absolute" />
            <div className="hero-blob w-[600px] h-[600px] bottom-0 -right-20 absolute" style={{ background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, rgba(255,255,255,0) 70%)' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-xs font-semibold uppercase tracking-wide mb-6 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Now accepting new pilot partners
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-slate-900 animate-fade-in-up">
                        Stop Losing Patients to{' '}
                        <br className="hidden lg:block" />
                        <span className="gradient-text">Voicemail</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto animate-fade-in-up">
                        Your front desk works 9-5. Patients call 24/7.
                        DentaVoice is the AI receptionist that answers every call, qualifies leads, and books appointments directly into your calendar.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
                        <button
                            onClick={onDemoClick}
                            className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-full font-semibold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/30 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Hear a Live Call
                        </button>
                        <a
                            href="#calculator"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold text-lg hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            View ROI Data
                        </a>
                    </div>

                    {/* Social proof */}
                    <div className="mt-10 flex items-center justify-center gap-4 text-sm text-slate-500 animate-fade-in-up">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold"
                                >
                                    {['👨‍⚕️', '👩‍⚕️', '🦷'][i - 1]}
                                </div>
                            ))}
                        </div>
                        {/* <p>Trusted by 200+ dental practices</p> */}
                    </div>
                </div>
            </div>
        </section>
    );
}
