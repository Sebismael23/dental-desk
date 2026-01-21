import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | DentaVoice',
    description: 'Privacy Policy for DentaVoice AI Receptionist Service',
};

export default function PrivacyPage() {
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
                <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
                <p className="text-slate-500 mb-8">Last updated: January 20, 2026</p>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Introduction</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            DentaVoice (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI receptionist service.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Please read this privacy policy carefully. By using DentaVoice, you agree to the collection and use of information in accordance with this policy.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Information We Collect</h2>
                        <h3 className="text-xl font-semibold text-slate-700 mb-3">2.1 Information You Provide</h3>
                        <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                            <li>Account registration information (name, email, phone number)</li>
                            <li>Practice information (practice name, address, business hours)</li>
                            <li>Payment and billing information</li>
                            <li>Communications with our support team</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-700 mb-3">2.2 Information Collected Automatically</h3>
                        <ul className="list-disc list-inside text-slate-600 space-y-2">
                            <li>Call recordings and transcriptions</li>
                            <li>Caller information (phone numbers, names provided during calls)</li>
                            <li>Usage data and analytics</li>
                            <li>Device and browser information</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">3. How We Use Your Information</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">We use the information we collect to:</p>
                        <ul className="list-disc list-inside text-slate-600 space-y-2">
                            <li>Provide and maintain our AI receptionist service</li>
                            <li>Process appointments and patient inquiries</li>
                            <li>Improve our AI systems and service quality</li>
                            <li>Send you service updates and notifications</li>
                            <li>Process payments and manage your account</li>
                            <li>Respond to your inquiries and provide customer support</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Data Security</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                        </p>
                        <ul className="list-disc list-inside text-slate-600 space-y-2">
                            <li>Encryption of data in transit and at rest</li>
                            <li>Regular security assessments and audits</li>
                            <li>Access controls and authentication measures</li>
                            <li>Secure data centers with physical security measures</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Data Retention</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. Call recordings are typically retained for 90 days unless you request earlier deletion.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Your Rights</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">Depending on your location, you may have the following rights:</p>
                        <ul className="list-disc list-inside text-slate-600 space-y-2">
                            <li>Access and receive a copy of your personal data</li>
                            <li>Rectify inaccurate personal data</li>
                            <li>Request deletion of your personal data</li>
                            <li>Object to or restrict processing of your data</li>
                            <li>Data portability</li>
                            <li>Withdraw consent at any time</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Third-Party Services</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We may share your information with third-party service providers who assist us in operating our service, including cloud hosting providers, payment processors, and analytics services. These third parties are contractually obligated to protect your information and use it only for the purposes we specify.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Changes to This Policy</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this privacy policy periodically for any changes.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">9. Contact Us</h2>
                        <p className="text-slate-600 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
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
