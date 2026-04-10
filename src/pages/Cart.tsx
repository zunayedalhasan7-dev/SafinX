import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, total, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-neon-blue/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-neon-purple/5 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="glass p-12 md:p-32 rounded-[40px] md:rounded-[60px] border-white/5 text-center relative z-10 max-w-4xl w-full"
        >
          <div className="w-32 h-32 glass rounded-[32px] flex items-center justify-center mx-auto mb-12 animate-float">
            <ShoppingBag className="w-12 h-12 text-white/10" />
          </div>
          <h2 className="text-3xl md:text-7xl font-display uppercase tracking-tighter mb-6 md:mb-8">
            YOUR CART <br /> <span className="text-white/10">IS EMPTY</span>
          </h2>
          <p className="text-white/30 mb-10 md:mb-16 max-w-sm mx-auto text-base md:text-lg font-medium">
            Looks like you haven't added any digital assets to your empire yet.
          </p>
          <Link to="/marketplace" className="btn-primary inline-block w-full sm:w-auto py-4 md:py-5 text-[10px] md:text-xs">
            Browse Marketplace
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-32 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-neon-blue/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] left-[5%] w-[600px] h-[600px] bg-neon-purple/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-24 relative z-10">
        <div className="mb-8 md:mb-24">
          <div className="micro-label mb-4 md:mb-6 flex items-center gap-4">
            <span className="w-8 h-px bg-white/10" />
            Review Selection
          </div>
          <h1 className="text-3xl md:text-7xl font-display uppercase tracking-tighter leading-[0.85] mb-6 md:mb-8">
            YOUR <br /> <span className="neon-text">SHOPPING CART</span>
          </h1>
          <p className="text-white/40 max-w-md text-lg">
            Review your selected digital assets before proceeding to secure checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-8">
            {cart.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="premium-card p-4 md:p-8 flex flex-col sm:flex-row items-center gap-6 md:gap-10 group"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl overflow-hidden shrink-0 border border-white/10 glass p-1">
                  <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover rounded-[14px] md:rounded-[20px] opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow text-left">
                  <p className="micro-label text-neon-blue mb-0.5 md:mb-2 text-[7px] md:text-[10px]">{item.category}</p>
                  <h3 className="text-sm md:text-2xl font-bold uppercase tracking-tight mb-0.5 md:mb-2 group-hover:text-neon-blue transition-colors line-clamp-1">{item.title}</h3>
                  <p className="text-lg md:text-3xl font-black tracking-tighter">${item.price}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-4 md:p-6 rounded-2xl md:rounded-3xl glass hover:bg-red-500/10 text-white/10 hover:text-red-400 transition-all group/del"
                >
                  <Trash2 className="w-5 h-5 md:w-6 md:h-6 group-hover/del:scale-110 transition-transform" />
                </button>
              </motion.div>
            ))}

            <div className="pt-8 flex justify-center sm:justify-start">
              <button 
                onClick={clearCart}
                className="micro-label hover:text-white transition-colors px-8 py-4 glass rounded-2xl border-white/5"
              >
                Clear All Items
              </button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="glass p-6 md:p-12 rounded-[32px] md:rounded-[60px] border-white/10 sticky top-32 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
              <h3 className="text-lg md:text-xl font-display uppercase tracking-tighter mb-6 md:mb-12">ORDER SUMMARY</h3>
              
              <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                <div className="flex justify-between micro-label text-[8px] md:text-[10px]">
                  <span>Subtotal</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between micro-label text-[8px] md:text-[10px]">
                  <span>Platform Fee</span>
                  <span className="text-white">$0.00</span>
                </div>
                <div className="h-px bg-white/5 my-6 md:my-8" />
                <div className="flex justify-between items-end">
                  <span className="micro-label mb-1 text-[8px] md:text-[10px]">Total</span>
                  <span className="text-3xl md:text-5xl font-black tracking-tighter neon-text">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-4 group">
                Secure Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>

              <div className="mt-12 flex items-center gap-4 micro-label text-white/20 justify-center">
                <ShieldCheck className="w-5 h-5 text-neon-blue" />
                Encrypted & Secure
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
