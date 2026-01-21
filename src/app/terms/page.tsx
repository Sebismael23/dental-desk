import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | DentaVoice',
    description: 'Terms of Service for DentaVoice AI Receptionist Service',
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <a href="/" className="flex items-center gap-2">
                        <img src="/dentavoice_logo.png" alt="DentaVoice" className="h-8 w-auto" />
                        <span className="font-bold text-xl text-slate-800">DentaVoice</span>
                    </a>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>
                <p className="text-slate-500 mb-8">Last updated: January 20, 2026</p>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            By accessing or using DentaVoice (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you may not access the Service.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            These Terms apply to all visitors, users, and others who access or use the Service.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Description of Service</h2>
                        <p className="text-slate-600 leading-relaxed">
                            DentaVoice provides an AI-powered receptionist service for dental and healthcare practices. Our service includes automated call answering, appointment scheduling, patient intake, and related features designed to help your practice never miss a call.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">3. User Accounts</h2>
                        <ul className="list-disc list-inside text-slate-600 space-y-2">
                            <li>You must provide accurate, complete, and current information when creating an account</li>
                            <li>You are responsible for safeguarding your account password</li>
                            <li>You agree to notify us immediately of any unauthorized access to your account</li>
                            <li>You are responsible for all activities that occur under your account</li>
                            <li>You must be at least 18 years old to use the Service</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Subscription and Payment</h2>
                        <h3 className="text-xl font-semibold text-slate-700 mb-3">4.1 Fees</h3>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Subscription fees are billed in advance on a monthly basis. You agree to pay all applicable fees associated with your subscription plan.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-700 mb-3">4.2 Free Trial</h3>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            We may offer a free trial period. At the end of the trial, your subscription will automatically convert to a paid subscription unless you cancel before the trial ends.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-700 mb-3">4.3 Cancellation</h3>
                        <p className="text-slate-600 leading-relaxed">
                            You may cancel your subscription at any time. Cancellation will be effective at the end of the current billing period. No refunds will be provided for partial months.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Acceptable Use</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">You agree not to:</p>
                        <ul className="list-disc list-inside text-slate-600 space-y-2">
                            <li>Use the Service for any unlawful purpose</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the Service</li>
                            <li>Use the Service to transmit harmful or offensive content</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Resell or redistribute the Service without authorization</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Intellectual Property</h2>
                        <p className="text-slate-600 leading-relaxed">
                            The Service and its original content, features, and functionality are owned by DentaVoice and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our Service without our express written permission.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Limitation of Liability</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            To the maximum extent permitted by law, DentaVoice shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                        </p>
                        <ul className="list-disc list-inside text-slate-600 space-y-2">
                            <li>Loss of profits, revenue, or data</li>
                            <li>Business interruption</li>
                            <li>Missed appointments or patient communications</li>
                            <li>Any damages arising from service interruptions</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Disclaimer of Warranties</h2>
                        <p className="text-slate-600 leading-relaxed">
                            The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free. DentaVoice is not a medical service and should not be used for medical emergencies.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">9. Indemnification</h2>
                        <p className="text-slate-600 leading-relaxed">
                            You agree to defend, indemnify, and hold harmless DentaVoice and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of the Service or violation of these Terms.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">10. Modifications to Terms</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect. Your continued use of the Service after changes become effective constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">11. Governing Law</h2>
                        <p className="text-slate-600 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of the State of Utah, United States, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">12. Contact Us</h2>
                        <p className="text-slate-600 leading-relaxed">
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <div className="mt-4 p-4 bg-slate-100 rounded-lg">
                            <p className="text-slate-700">
                                <strong>Email:</strong>{' '}
                                <a href="mailto:sebastienismael25@gmail.com" className="text-primary-600 hover:underline">
                                    sebastienismael25@gmail.com
                                </a>
                            </p>
                        </div>
                    </section>
                </div>

                {/* Back to Home */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                    <a href="/" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </a>
                </div>
            </div>
        </main>
    );
}
