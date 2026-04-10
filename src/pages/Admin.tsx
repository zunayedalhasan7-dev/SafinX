import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Clock, ShieldAlert, User, Package, DollarSign } from 'lucide-react';

export default function Admin() {
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), where('status', '==', 'pending'));
      const snapshot = await getDocs(q);
      setPendingProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'products');
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'products', id), { status });
      fetchPending();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-32">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-4">Admin <span className="neon-text">Panel</span></h1>
          <p className="text-white/40">Manage platform products and users.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass p-4 rounded-2xl flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-neon-purple" />
            <span className="text-sm font-bold">Admin Access</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {[
          { label: 'Pending Approval', value: pendingProducts.length, icon: <Clock className="w-5 h-5 text-yellow-400" /> },
          { label: 'Total Users', value: '1,240', icon: <User className="w-5 h-5 text-neon-blue" /> },
          { label: 'Platform Sales', value: '$45,200', icon: <DollarSign className="w-5 h-5 text-neon-purple" /> },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">{stat.icon}</div>
            </div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Pending Products</h2>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 glass rounded-2xl animate-pulse" />)}
          </div>
        ) : pendingProducts.length > 0 ? (
          <div className="glass rounded-[40px] overflow-hidden border-white/5">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-xs font-bold uppercase tracking-widest text-white/40">
                <tr>
                  <th className="px-8 py-6">Product</th>
                  <th className="px-8 py-6">Seller</th>
                  <th className="px-8 py-6">Price</th>
                  <th className="px-8 py-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingProducts.map(product => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={product.thumbnailUrl} alt="" className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <p className="font-bold">{product.title}</p>
                          <p className="text-xs text-white/40">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerId}`} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                        <span className="text-sm">{product.sellerName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold">${product.price}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleStatus(product.id, 'approved')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-xl text-xs font-bold hover:bg-green-500/20 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve
                        </button>
                        <button 
                          onClick={() => handleStatus(product.id, 'rejected')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-[40px]">
            <Package className="w-12 h-12 text-white/10 mx-auto mb-6" />
            <p className="text-white/40">No pending products to review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
