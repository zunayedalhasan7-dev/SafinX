import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Info, Briefcase, Shield, FileText, HelpCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  to?: string;
  onClick?: () => void;
  external?: boolean;
}

interface MoreMenuProps {
  items?: MenuItem[];
  className?: string;
}

export default function MoreMenu({ items, className = "" }: MoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const defaultItems: MenuItem[] = [
    { label: 'About Us', icon: <Info className="w-4 h-4" />, to: '/about' },
    { label: 'Careers', icon: <Briefcase className="w-4 h-4" />, to: '/careers' },
    { label: 'Privacy', icon: <Shield className="w-4 h-4" />, to: '/privacy' },
    { label: 'Terms', icon: <FileText className="w-4 h-4" />, to: '/terms' },
    { label: 'Support', icon: <HelpCircle className="w-4 h-4" />, onClick: () => window.location.href = 'mailto:support@safinx.com' },
  ];

  const displayItems = items || defaultItems;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 md:p-3 hover:bg-white/5 rounded-xl lg:rounded-2xl transition-colors text-white/30 hover:text-white"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-4 w-56 glass rounded-3xl p-2 border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] z-[100]"
          >
            <div className="flex flex-col gap-1">
              {displayItems.map((item, i) => (
                item.to ? (
                  <Link
                    key={i}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all group"
                  >
                    <span className="text-white/20 group-hover:text-neon-blue transition-colors">{item.icon}</span>
                    {item.label}
                    {item.external && <ExternalLink className="w-3 h-3 ml-auto opacity-20" />}
                  </Link>
                ) : (
                  <button
                    key={i}
                    onClick={() => { item.onClick?.(); setIsOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all group w-full text-left"
                  >
                    <span className="text-white/20 group-hover:text-neon-blue transition-colors">{item.icon}</span>
                    {item.label}
                  </button>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
