export default function CTA() {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-br from-primary-50 via-white to-cyan-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    Ready to Capture Every Patient Call?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                    Join 200+ dental practices that never miss a call. Start your free trial today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-primary-lg transform hover:-translate-y-1">
                        Get Started Free →
                    </button>
                    <button className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-primary-500 hover:text-primary-600 transition-all">
                        Schedule a Demo
                    </button>
                </div>
                <p className="text-gray-500 text-sm mt-6">
                    Questions? Call us at (801) 555-0199 or email hello@dentdeskai.com
                </p>
            </div>
        </section>
    );
}
