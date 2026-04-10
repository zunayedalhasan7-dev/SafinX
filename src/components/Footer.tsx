import { Link } from 'react-router-dom';
import { Instagram, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-black pt-32 pb-12 px-6 overflow-hidden">
      {/* Curved Top Border */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-full h-24 text-deep-bg" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-neon-blue/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-purple/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
          {/* Logo & Description - Staggered */}
          <div className="lg:col-span-4 lg:mt-12">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="relative">
                <img 
                  src="https://i.postimg.cc/hPTW2zTw/Blue-and-White-Modern-Online-Shop-Logo.png"
                  alt="SafinX Logo"
                  className="w-12 h-12 object-contain rounded-xl shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                  referrerPolicy="no-referrer"
                />
                <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-neon-blue animate-pulse" />
              </div>
              <span className="text-3xl font-display tracking-tighter text-white uppercase leading-none mt-1">SafinX</span>
            </Link>
            <p className="text-white/40 text-lg leading-relaxed mb-10 max-w-sm">
              The premium destination for elite digital assets. Empowering creators to scale their vision globally.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl glass border border-white/5 flex items-center justify-center hover:text-neon-blue hover:border-neon-blue/30 transition-all group">
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="mailto:support@safinx.com" className="w-12 h-12 rounded-2xl glass border border-white/5 flex items-center justify-center hover:text-neon-blue hover:border-neon-blue/30 transition-all group">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Links Sections - Asymmetrical Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8 lg:mt-24">
            <div className="space-y-8">
              <h4 className="micro-label text-neon-blue">Marketplace</h4>
              <ul className="space-y-6">
                <li><Link to="/marketplace?cat=ebooks" className="text-sm text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold">Ebooks</Link></li>
                <li><Link to="/marketplace?cat=courses" className="text-sm text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold">Courses</Link></li>
                <li><Link to="/marketplace?cat=templates" className="text-sm text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold">Templates</Link></li>
                <li><Link to="/marketplace?cat=software" className="text-sm text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold">Software</Link></li>
              </ul>
            </div>
            <div className="space-y-8 lg:mt-12">
              <h4 className="micro-label text-neon-purple">Company</h4>
              <ul className="space-y-6">
                <li><Link to="/about" className="text-sm text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold">About</Link></li>
                <li><Link to="/careers" className="text-sm text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold">Careers</Link></li>
                <li><Link to="/privacy" className="text-sm text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold">Privacy</Link></li>
                <li><Link to="/terms" className="text-sm text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold">Terms</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter - Offset */}
          <div className="lg:col-span-4 lg:mt-8">
            <div className="glass p-8 md:p-10 rounded-[40px] border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 blur-[50px] rounded-full group-hover:bg-neon-blue/10 transition-colors" />
              <h4 className="text-2xl font-display uppercase tracking-tighter mb-4">Stay Synchronized</h4>
              <p className="text-white/40 text-sm mb-8 leading-relaxed">
                Join our elite network for exclusive drops and digital insights.
              </p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="name@empire.com" 
                  className="w-full glass border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-neon-blue/50 transition-all placeholder:text-white/10"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-neon-blue hover:text-black transition-all flex items-center gap-2">
                  Join <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col items-center justify-center gap-4">
          <p className="micro-label text-white/20">© 2026 SafinX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
