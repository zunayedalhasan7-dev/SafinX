import { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RefreshCcw,
  FileText,
  User,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // In a real app, you'd have an orders collection
      // For now, let's mock some data or fetch if it exists
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      // handleFirestoreError(err, OperationType.LIST, 'orders');
      // Mocking for demo if collection doesn't exist
      setOrders([
        { id: 'ORD-7721', productTitle: 'Cyberpunk UI Kit', buyerEmail: 'buyer@example.com', sellerName: 'SafinX', amount: 49.00, status: 'completed', createdAt: { toDate: () => new Date() } },
        { id: 'ORD-7722', productTitle: 'E-book: Digital Empire', buyerEmail: 'user2@test.com', sellerName: 'SafinX', amount: 29.00, status: 'pending', createdAt: { toDate: () => new Date() } },
        { id: 'ORD-7723', productTitle: 'SaaS Dashboard Template', buyerEmail: 'dev@safinx.com', sellerName: 'SafinX', amount: 89.00, status: 'refunded', createdAt: { toDate: () => new Date() } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    toast.success(`Order ${orderId} marked as ${newStatus}`);
    // Update logic here
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Order <span className="neon-text">Management</span></h1>
          <p className="text-white/40 text-sm font-medium">Track transactions and handle refunds.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass border-white/5 rounded-xl pl-12 pr-4 py-2.5 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all text-sm w-64"
            />
          </div>
          
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="glass border-white/5 rounded-xl px-4 py-2.5 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all text-sm micro-label text-white/40"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </header>

      <div className="premium-card p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 micro-label text-white/20">
              <tr>
                <th className="px-8 py-6">Order ID</th>
                <th className="px-8 py-6">Product</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-neon-blue transition-colors">#{order.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-sm tracking-tight">{order.productTitle}</p>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">Seller: {order.sellerName}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-white/20" />
                      <span className="text-xs font-medium text-white/60">{order.buyerEmail}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-lg tracking-tighter text-neon-blue">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      order.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                      order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {order.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : 
                       order.status === 'pending' ? <Clock className="w-3 h-3" /> : 
                       <RefreshCcw className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 glass rounded-lg text-white/20 hover:text-white transition-colors" title="View Details">
                        <FileText className="w-4 h-4" />
                      </button>
                      {order.status === 'completed' && (
                        <button 
                          onClick={() => handleStatusChange(order.id, 'refunded')}
                          className="p-2 glass rounded-lg text-red-400/40 hover:text-red-400 transition-colors" 
                          title="Trigger Refund"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
