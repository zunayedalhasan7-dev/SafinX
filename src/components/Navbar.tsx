import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase';
import { ShoppingCart, User, LogOut, LayoutDashboard, Heart, Menu, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MoreMenu from './MoreMenu';

export default function Navbar() {
  const { user, profile, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-4 md:top-8 left-0 right-0 z-50 px-4 md:px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto glass rounded-[24px] md:rounded-[32px] px-4 md:px-6 lg:px-10 py-3 md:py-4 lg:py-5 flex items-center justify-between pointer-events-auto border-white/[0.05] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)]">
        <Link to="/" className="flex items-center gap-2 md:gap-3 lg:gap-4 group shrink-0">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src="https://i.postimg.cc/hPTW2zTw/Blue-and-White-Modern-Online-Shop-Logo.png"
            alt="SafinX Logo"
            className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain rounded-lg md:rounded-xl lg:rounded-2xl"
            referrerPolicy="no-referrer"
          />
          <span className="text-xl md:text-2xl lg:text-3xl font-display tracking-tighter text-white transition-all uppercase leading-none mt-1">SafinX</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-12">
          <Link to="/marketplace" className="micro-label hover:text-white transition-all hover:tracking-[0.6em]">Marketplace</Link>
          {user && <Link to="/dashboard" className="micro-label text-neon-blue hover:text-white transition-all hover:tracking-[0.6em]">Dashboard</Link>}
          {isAdmin && <Link to="/admin" className="micro-label text-neon-purple hover:text-white transition-all hover:tracking-[0.6em]">Admin Panel</Link>}
        </div>

        <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
          <div className="flex items-center gap-1 md:gap-2 lg:gap-4">
            <Link to="/wishlist" className="p-1.5 md:p-3 hover:bg-white/5 rounded-xl lg:rounded-2xl transition-colors relative group">
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-white/30 group-hover:text-red-400 transition-colors" />
            </Link>
            <Link to="/cart" className="p-1.5 md:p-3 hover:bg-white/5 rounded-xl lg:rounded-2xl transition-colors relative group">
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-white/30 group-hover:text-neon-blue transition-colors" />
              {cart.length > 0 && (
                <span className="absolute top-0.5 md:top-2 right-0.5 md:right-2 w-3.5 h-3.5 md:w-4 md:h-4 bg-neon-blue text-black text-[8px] md:text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.5)]">
                  {cart.length}
                </span>
              )}
            </Link>
            <MoreMenu className="hidden sm:block" />
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          {user ? (
            <div className="relative group hidden sm:block">
              <button className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl border border-white/10 overflow-hidden hover:border-white/30 transition-all p-1 bg-white/5">
                <img src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Profile" className="w-full h-full object-cover rounded-[10px] lg:rounded-[12px]" referrerPolicy="no-referrer" />
              </button>
              <div className="absolute right-0 mt-6 w-64 glass rounded-[32px] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-4 group-hover:translate-y-0 border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
                <div className="px-4 py-4 border-b border-white/5 mb-3">
                  <p className="micro-label mb-2">Signed in as</p>
                  <p className="text-sm font-bold truncate">{profile?.displayName || user.email}</p>
                </div>
                <Link to="/profile" className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 rounded-2xl text-sm transition-colors">
                  <User className="w-4 h-4 text-white/30" /> Profile
                </Link>
                <Link to="/dashboard" className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 rounded-2xl text-sm transition-colors">
                  <LayoutDashboard className="w-4 h-4 text-white/30" /> Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 rounded-2xl text-sm transition-colors text-neon-purple">
                    <ShieldCheck className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <div className="h-px bg-white/5 my-2" />
                <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-red-500/10 text-red-400 rounded-2xl text-sm transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary py-2 lg:py-3 px-6 lg:px-8 text-[10px] hidden sm:block">
              Join SafinX
            </Link>
          )}
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-1.5 md:p-3 glass rounded-xl lg:rounded-2xl border-white/10"
          >
            {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-28 left-6 right-6 glass rounded-[40px] p-10 border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] pointer-events-auto lg:hidden"
          >
            <div className="flex flex-col gap-8">
              <Link onClick={() => setIsMenuOpen(false)} to="/marketplace" className="text-3xl font-display uppercase tracking-tighter">Marketplace</Link>
              {user && <Link onClick={() => setIsMenuOpen(false)} to="/dashboard" className="text-3xl font-display uppercase tracking-tighter text-neon-blue">Dashboard</Link>}
              {isAdmin && <Link onClick={() => setIsMenuOpen(false)} to="/admin" className="text-3xl font-display uppercase tracking-tighter text-neon-purple">Admin Panel</Link>}
              
              <div className="h-px bg-white/5 my-4" />
              
              {user ? (
                <div className="space-y-6">
                  <Link onClick={() => setIsMenuOpen(false)} to="/profile" className="flex items-center gap-5 text-xl text-white/60">
                    <User className="w-6 h-6" /> Profile Settings
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-5 text-xl text-red-400">
                    <LogOut className="w-6 h-6" /> Terminate Session
                  </button>
                </div>
              ) : (
                <Link onClick={() => setIsMenuOpen(false)} to="/auth" className="btn-primary py-5 text-center text-xs">Join SafinX Empire</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
