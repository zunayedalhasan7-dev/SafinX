import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addDoc, collection, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { CreditCard, Shield, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, total, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0 && !success) {
      navigate('/marketplace');
    }
  }, [cart, success, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || cart.length === 0) return;

    setProcessing(true);
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Process each item in the cart
      for (const item of cart) {
        // 1. Create Order
        await addDoc(collection(db, 'orders'), {
          buyerId: user.uid,
          productId: item.id,
          productTitle: item.title,
          price: item.price,
          timestamp: serverTimestamp(),
          status: 'completed'
        });

        // 2. Update Product Sales Count
        await updateDoc(doc(db, 'products', item.id), {
          salesCount: increment(1)
        });
      }

      clearCart();
      setSuccess(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'orders');
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </motion.div>
        <h1 className="text-3xl font-black mb-4">Payment Successful!</h1>
        <p className="text-white/40 mb-12">Your order has been processed. You can now download your files from your dashboard.</p>
        <div className="space-y-4">
          <Link to="/downloads" className="btn-primary w-full block">Go to Downloads</Link>
          <Link to="/marketplace" className="btn-secondary w-full block">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-32">
      <Link to="/cart" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <h1 className="text-4xl font-black tracking-tight">Checkout</h1>
          
          <div className="glass p-8 rounded-[32px] space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-neon-blue" /> Payment Method
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="glass p-4 rounded-2xl border-neon-blue bg-neon-blue/5 flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">💳</div>
                <span className="text-sm font-bold">Credit Card</span>
              </button>
              <button className="glass p-4 rounded-2xl border-white/5 hover:bg-white/5 flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">🅿️</div>
                <span className="text-sm font-bold">PayPal</span>
              </button>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Card Number</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-neon-blue/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-neon-blue/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">CVC</label>
                  <input 
                    type="text" 
                    placeholder="000" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-neon-blue/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-white/40 mt-8">
                <Lock className="w-4 h-4" />
                <span>Your payment information is encrypted and secure.</span>
              </div>

              <button 
                type="submit" 
                disabled={processing}
                className="btn-primary w-full py-4 mt-8 disabled:opacity-50"
              >
                {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="glass p-8 rounded-[32px] space-y-6">
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 no-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.thumbnailUrl} alt="" className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-grow">
                    <h3 className="font-bold text-sm line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-white/40">{item.category}</p>
                    <p className="text-sm font-black mt-1">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-4 border-t border-white/5">
                <span>Total</span>
                <span className="neon-text">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
              <Shield className="w-5 h-5 text-neon-blue" />
              <p className="text-xs text-white/60">100% Secure Transaction. Instant access after purchase.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
