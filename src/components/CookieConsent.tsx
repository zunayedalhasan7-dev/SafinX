import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[100] pointer-events-none flex justify-center"
        >
          <div className="max-w-2xl w-full glass rounded-[32px] p-6 md:p-8 pointer-events-auto border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center text-neon-blue shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg font-bold uppercase tracking-tight mb-2">Cookie Consent</h4>
              <p className="text-sm text-white/50 leading-relaxed">
                We use cookies to enhance your experience, analyze site traffic, and serve personalized content. By clicking "Accept", you consent to our use of cookies.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={handleDecline}
                className="flex-1 md:flex-none px-6 py-3 rounded-2xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-colors"
              >
                Decline
              </button>
              <button 
                onClick={handleAccept}
                className="flex-1 md:flex-none px-8 py-3 rounded-2xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Accept
              </button>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-2 text-white/20 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
