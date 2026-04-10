import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Download, Package, ExternalLink, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Downloads() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'), 
          where('buyerId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto px-6 pb-32">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-4">My <span className="neon-text">Downloads</span></h1>
        <p className="text-white/40">Access all your purchased digital products here.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 glass rounded-3xl animate-pulse" />)}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8 border-white/5 hover:neon-border transition-all"
            >
              <div className="flex items-center gap-6 flex-grow">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Package className="w-8 h-8 text-neon-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{order.productTitle}</h3>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Purchased on {order.timestamp?.toDate().toLocaleDateString()}</span>
                    <span className="font-bold text-white/60">${order.price}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <a 
                  href={order.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2 py-3 px-8"
                >
                  <Download className="w-4 h-4" /> Download Files
                </a>
                <button className="btn-secondary p-3">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 glass rounded-[40px]">
          <Download className="w-12 h-12 text-white/10 mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-2">No downloads yet</h3>
          <p className="text-white/40 mb-8">You haven't purchased any products yet.</p>
          <Link to="/marketplace" className="btn-primary">Browse Marketplace</Link>
        </div>
      )}
    </div>
  );
}
