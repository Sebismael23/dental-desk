export default function Footer() {
    return (
        <footer className="bg-slate-50 py-12 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <img
                        src="/dentavoice_logo.png"
                        alt="DentaVoice"
                        className="h-6 w-auto"
                    />
                    <span className="font-bold text-slate-800">DentaVoice</span>
                </div>
                <p className="text-slate-500 text-sm">© 2026 DentaVoice. All rights reserved.</p>
                <div className="flex gap-6 text-sm text-slate-600">
                    <a href="/privacy" className="hover:text-primary-600 transition-colors">Privacy</a>
                    <a href="/terms" className="hover:text-primary-600 transition-colors">Terms</a>
                    <a href="mailto:sebastienismael25@gmail.com" className="hover:text-primary-600 transition-colors">Support</a>
                </div>
            </div>
        </footer>
    );
}
