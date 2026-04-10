import { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, deleteDoc, orderBy, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Package, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2, 
  Edit, 
  ExternalLink,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'products');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (productId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      await updateDoc(doc(db, 'products', productId), { status: newStatus });
      toast.success(`Product status updated to ${newStatus}`);
      fetchProducts();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${productId}`);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sellerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Product <span className="neon-text">Inventory</span></h1>
          <p className="text-white/40 text-sm font-medium">Review and moderate digital assets.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search products..." 
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </header>

      <div className="premium-card p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 micro-label text-white/20">
              <tr>
                <th className="px-8 py-6">Asset</th>
                <th className="px-8 py-6">Seller</th>
                <th className="px-8 py-6">Price</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6"><div className="h-16 bg-white/5 rounded-xl" /></td>
                  </tr>
                ))
              ) : filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl glass border border-white/10 p-1 overflow-hidden">
                        <img 
                          src={product.thumbnailUrl} 
                          className="w-full h-full rounded-lg object-cover opacity-80"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight group-hover:text-neon-blue transition-colors">{product.title}</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full glass border border-white/10 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerId}`} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-medium text-white/60">{product.sellerName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-lg tracking-tighter text-neon-blue">
                    ${product.price}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      product.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                      product.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {product.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : 
                       product.status === 'pending' ? <Clock className="w-3 h-3" /> : 
                       <XCircle className="w-3 h-3" />}
                      {product.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {product.status !== 'approved' && (
                        <button 
                          onClick={() => handleStatusChange(product.id, 'approved')}
                          className="p-2 glass rounded-lg text-green-400/40 hover:text-green-400 transition-colors" 
                          title="Approve"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {product.status !== 'rejected' && (
                        <button 
                          onClick={() => handleStatusChange(product.id, 'rejected')}
                          className="p-2 glass rounded-lg text-red-400/40 hover:text-red-400 transition-colors" 
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 glass rounded-lg text-white/20 hover:text-white transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 glass rounded-lg text-white/20 hover:text-red-500 transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 font-medium">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
