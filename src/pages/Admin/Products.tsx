import { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, deleteDoc, orderBy, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../../firebase';
import { motion, AnimatePresence } from 'motion/react';
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
  Eye,
  Plus,
  X,
  Upload,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function AdminProducts() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Ebooks',
    status: 'approved'
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);

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

  const handleOpenModal = (product?: any) => {
    if (product) {
      setIsEditing(true);
      setCurrentProductId(product.id);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        status: product.status
      });
    } else {
      setIsEditing(false);
      setCurrentProductId(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'Ebooks',
        status: 'approved'
      });
    }
    setThumbnail(null);
    setFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    try {
      let thumbnailUrl = isEditing ? products.find(p => p.id === currentProductId)?.thumbnailUrl : '';
      let fileUrl = isEditing ? products.find(p => p.id === currentProductId)?.fileUrl : '';

      if (thumbnail) {
        const thumbRef = ref(storage, `thumbnails/admin/${Date.now()}_${thumbnail.name}`);
        await uploadBytes(thumbRef, thumbnail);
        thumbnailUrl = await getDownloadURL(thumbRef);
      }

      if (file) {
        const fileRef = ref(storage, `products/admin/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }

      if (!thumbnailUrl || !fileUrl) {
        toast.error('Thumbnail and Asset File are required');
        setSubmitting(false);
        return;
      }

      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        status: formData.status,
        thumbnailUrl,
        fileUrl,
        sellerId: user.uid,
        sellerName: profile?.displayName || 'Admin',
        updatedAt: serverTimestamp(),
      };

      if (isEditing && currentProductId) {
        await updateDoc(doc(db, 'products', currentProductId), productData);
        toast.success('Product updated successfully');
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          rating: 5.0,
          reviewCount: 0,
          salesCount: 0,
          createdAt: serverTimestamp(),
        });
        toast.success('Product added successfully');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      handleFirestoreError(err, isEditing ? OperationType.UPDATE : OperationType.CREATE, 'products');
    } finally {
      setSubmitting(false);
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
          <button 
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2 px-6 py-2.5 text-[10px]"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          
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
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 glass rounded-lg text-white/20 hover:text-white transition-colors" 
                        title="Edit"
                      >
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass w-full max-w-2xl rounded-[40px] border-white/10 p-8 sm:p-12 relative z-10 max-h-[90vh] overflow-y-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 glass rounded-xl text-white/20 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-display uppercase tracking-tighter mb-10">
                {isEditing ? 'Edit' : 'Add New'} <span className="neon-text">Product</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="micro-label ml-2">Title</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full glass border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-white/20 transition-all font-bold"
                      placeholder="Product Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="micro-label ml-2">Price (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full glass border-white/5 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-white/20 transition-all font-bold"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="micro-label ml-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full glass border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-white/20 transition-all micro-label text-white/40"
                    >
                      <option value="Ebooks">Ebooks</option>
                      <option value="Courses">Courses</option>
                      <option value="Templates">Templates</option>
                      <option value="Software">Software</option>
                      <option value="Design Assets">Design Assets</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="micro-label ml-2">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full glass border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-white/20 transition-all micro-label text-white/40"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="micro-label ml-2">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full glass border-white/5 rounded-3xl px-6 py-4 focus:outline-none focus:border-white/20 transition-all resize-none"
                    placeholder="Product description..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="micro-label ml-2">Thumbnail {isEditing && '(Optional)'}</label>
                    <div className="relative group cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full h-32 glass border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center group-hover:border-neon-blue/20 transition-all">
                        <Upload className="w-6 h-6 text-white/10 mb-2" />
                        <span className="text-[10px] micro-label text-white/20">{thumbnail ? thumbnail.name : 'Select Image'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="micro-label ml-2">Asset File {isEditing && '(Optional)'}</label>
                    <div className="relative group cursor-pointer">
                      <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full h-32 glass border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center group-hover:border-neon-purple/20 transition-all">
                        <Package className="w-6 h-6 text-white/10 mb-2" />
                        <span className="text-[10px] micro-label text-white/20">{file ? file.name : 'Select File'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary w-full py-5 flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : (isEditing ? 'Update Product' : 'Add Product')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
