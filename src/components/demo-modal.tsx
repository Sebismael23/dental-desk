'use client';

interface DemoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Try the Live Demo</h3>
                    <p className="text-slate-600">
                        Call this number to experience DentDesk AI as a patient would:
                    </p>
                </div>

                <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 text-center mb-6 border border-primary-100">
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                        (801) 555-0123
                    </div>
                    <div className="text-sm text-slate-500 flex items-center justify-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Demo line • Available 24/7
                    </div>
                </div>

                <div className="space-y-3 mb-6 text-sm text-slate-600">
                    <div className="flex items-start gap-3">
                        <span className="text-primary-500">💡</span>
                        <span>Try scheduling an appointment or asking about services</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-primary-500">🎯</span>
                        <span>The AI will handle your call just like it would for your patients</span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
