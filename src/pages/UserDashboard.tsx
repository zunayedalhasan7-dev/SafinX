import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { motion } from 'motion/react';
import { 
  User, 
  ShoppingBag, 
  Download, 
  Heart, 
  Clock, 
  ArrowRight, 
  Package,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user, profile } = useAuth();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'), 
          where('buyerId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        setRecentOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'orders');
      } finally {
        setLoading(false);
      }
    };
    fetchRecentOrders();
  }, [user]);

  return (
    <div className="min-h-screen relative overflow-hidden pb-32">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-neon-blue/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-neon-purple/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        <header className="mb-16">
          <div className="micro-label mb-4 flex items-center gap-4">
            <span className="w-8 h-px bg-white/10" />
            Control Center
          </div>
          <h1 className="text-4xl md:text-7xl font-display uppercase tracking-tighter leading-none mb-6">
            WELCOME BACK, <br /> <span className="neon-text">{profile?.displayName?.split(' ')[0] || 'USER'}</span>
          </h1>
          <p className="text-white/40 max-w-md text-lg">
            Manage your digital assets, track your orders, and customize your profile.
          </p>
        </header>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { label: 'My Downloads', icon: <Download className="w-6 h-6" />, to: '/downloads', color: 'neon-blue', desc: 'Access your purchased assets' },
            { label: 'Profile Settings', icon: <User className="w-6 h-6" />, to: '/profile', color: 'neon-purple', desc: 'Update your identity' },
            { label: 'My Wishlist', icon: <Heart className="w-6 h-6" />, to: '/wishlist', color: 'white', desc: 'Saved for later' },
          ].map((action, i) => (
            <Link 
              key={i}
              to={action.to}
              className="premium-card p-10 group hover:border-white/20 transition-all relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl glass flex items-center justify-center mb-8 text-${action.color} group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="text-2xl font-display uppercase tracking-tighter mb-2">{action.label}</h3>
              <p className="text-white/20 text-sm mb-8">{action.desc}</p>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                Open Section <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${action.color}/5 blur-[40px] rounded-full group-hover:bg-${action.color}/10 transition-colors`} />
            </Link>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-display uppercase tracking-tighter">Recent Orders</h2>
              <Link to="/downloads" className="micro-label hover:text-white transition-colors flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => <div key={i} className="h-24 glass rounded-3xl animate-pulse" />)}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-6">
                {recentOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-6 rounded-[32px] flex items-center justify-between border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-neon-blue/10 transition-colors">
                        <Package className="w-6 h-6 text-white/20 group-hover:text-neon-blue transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-bold uppercase tracking-tight group-hover:text-white transition-colors">{order.productTitle}</h4>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3" /> {order.timestamp?.toDate().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black tracking-tighter text-white/60">${order.price}</p>
                      <a 
                        href={order.downloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-black uppercase tracking-widest text-neon-blue hover:text-white transition-colors mt-1 block"
                      >
                        Download
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass rounded-[40px] border-white/5">
                <ShoppingBag className="w-12 h-12 text-white/5 mx-auto mb-6" />
                <p className="text-white/20 micro-label">No orders found yet</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="premium-card p-10 border-white/5 sticky top-32">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-neon-blue">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display uppercase tracking-tighter">Account Status</h3>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <span className="micro-label text-white/20">Role</span>
                  <span className="text-xs font-black uppercase tracking-widest text-neon-blue bg-neon-blue/10 px-4 py-1.5 rounded-full">
                    {profile?.role || 'Buyer'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="micro-label text-white/20">Member Since</span>
                  <span className="text-xs font-bold text-white/60">
                    {profile?.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                  </span>
                </div>
                <div className="h-px bg-white/5 my-8" />
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <Zap className="w-4 h-4 text-neon-purple" />
                    Secure Authentication Active
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <Sparkles className="w-4 h-4 text-neon-blue" />
                    Premium Support Access
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
