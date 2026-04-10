import { Link } from 'react-router-dom';
import { Twitter, Github, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center font-bold text-black">
              S
            </div>
            <span className="text-xl font-bold tracking-tighter neon-text">SafinX</span>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            The ultimate platform for digital creators to sell ebooks, courses, templates, and more with ease.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-neon-blue transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-neon-blue transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-neon-blue transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6">Marketplace</h4>
          <ul className="space-y-4 text-sm text-white/50">
            <li><Link to="/marketplace?cat=ebooks" className="hover:text-white transition-colors">Ebooks</Link></li>
            <li><Link to="/marketplace?cat=courses" className="hover:text-white transition-colors">Courses</Link></li>
            <li><Link to="/marketplace?cat=templates" className="hover:text-white transition-colors">Templates</Link></li>
            <li><Link to="/marketplace?cat=software" className="hover:text-white transition-colors">Software</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-white/50">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Newsletter</h4>
          <p className="text-white/50 text-sm mb-4">Get the latest updates on new products and features.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue/50 flex-1"
            />
            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:row items-center justify-between gap-4 text-white/30 text-xs">
        <p>© 2026 SafinX. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">Status</a>
          <a href="#" className="hover:text-white transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
}
