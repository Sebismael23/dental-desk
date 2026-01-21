'use client';

export default function Hero({ onDemoClick }: { onDemoClick: () => void }) {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
            {/* Background blobs - restored bluish gradient */}
            <div className="hero-blob w-[800px] h-[800px] -top-20 -left-20 absolute" />
            <div className="hero-blob w-[600px] h-[600px] bottom-0 -right-20 absolute" style={{ background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, rgba(255,255,255,0) 70%)' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Limited Pilot — Only 10 spots available
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-slate-900 animate-fade-in-up">
                        Never Miss Another{' '}
                        <br className="hidden sm:block" />
                        <span className="gradient-text">Patient Call</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up">
                        Join a limited pilot — AI receptionist that answers every call,
                        captures lead info, and books appointments — <span className="font-semibold text-slate-800">free for 14 days</span>
                    </p>

                    {/* Single Strong CTA */}
                    <div className="flex justify-center animate-fade-in-up">
                        <button
                            onClick={onDemoClick}
                            className="group px-10 py-5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full font-bold text-lg hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-1 flex items-center gap-3"
                        >
                            <span>Start Your Free 14-Day Pilot</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>

                    {/* Micro-trust */}
                    <div className="mt-10 flex items-center justify-center gap-6 text-sm text-slate-500 animate-fade-in-up">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Setup in 24 hours</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
