export default function Footer() {
    return (
        <footer className="bg-slate-50 py-12 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center text-white text-xs font-bold">D</div>
                    <span className="font-bold text-slate-800">DentaVoice</span>
                </div>
                <p className="text-slate-500 text-sm">© 2026 DentaVoice. All rights reserved.</p>
                <div className="flex gap-6 text-sm text-slate-600">
                    <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
                    <a href="#" className="hover:text-primary-600 transition-colors">Support</a>
                </div>
            </div>
        </footer>
    );
}
