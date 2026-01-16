'use client';

import { useState, useEffect } from 'react';

interface NavigationProps {
    onBookingClick?: () => void;
}

export default function Navigation({ onBookingClick }: NavigationProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleBooking = () => {
        setMobileMenuOpen(false);
        onBookingClick?.();
    };

    return (
        <nav className={`fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                            D
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-800">
                            DentaVoice
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
                        <a href="#demo" className="hover:text-primary-600 transition-colors">Live Demo</a>
                        <a href="#calculator" className="hover:text-primary-600 transition-colors">ROI Calculator</a>
                        <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <a href="/login" className="text-slate-600 hover:text-primary-600 text-sm font-medium transition-colors">
                            Sign In
                        </a>
                        <button
                            onClick={handleBooking}
                            className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary-600 transition-all duration-300 shadow-lg shadow-primary-500/20"
                        >
                            Book a Strategy Call
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-100 animate-fade-in-up">
                        <div className="flex flex-col gap-4">
                            <a href="#demo" className="text-slate-600 hover:text-primary-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Live Demo</a>
                            <a href="#features" className="text-slate-600 hover:text-primary-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
                            <a href="#calculator" className="text-slate-600 hover:text-primary-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>ROI Calculator</a>
                            <a href="#pricing" className="text-slate-600 hover:text-primary-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                            <button
                                onClick={handleBooking}
                                className="bg-slate-900 text-white px-6 py-3 rounded-full font-medium w-full"
                            >
                                Book a Strategy Call
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
