import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Upload, 
  Trash2, 
  Edit, 
  DollarSign, 
  ShoppingCart,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Sparkles,
  Zap,
  Shield,
  MoreVertical,
  Eye,
  Download
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import MoreMenu from '../components/MoreMenu';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Ebooks',
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), where('sellerId', '==', user.uid));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'products');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !thumbnail || !file) return;

    setUploading(true);
    try {
      const thumbRef = ref(storage, `thumbnails/${user.uid}/${Date.now()}_${thumbnail.name}`);
      await uploadBytes(thumbRef, thumbnail);
      const thumbnailUrl = await getDownloadURL(thumbRef);

      const fileRef = ref(storage, `products/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'products'), {
        ...newProduct,
        price: parseFloat(newProduct.price),
        thumbnailUrl,
        fileUrl,
        sellerId: user.uid,
        sellerName: profile?.displayName || user.displayName || 'Anonymous',
        status: 'pending',
        rating: 5.0,
        reviewCount: 0,
        salesCount: 0,
        createdAt: serverTimestamp(),
      });

      setActiveTab('manage');
      fetchProducts();
      setNewProduct({ title: '', description: '', price: '', category: 'Ebooks' });
      setThumbnail(null);
      setFile(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'products');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-neon-blue/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-neon-purple/5 blur-[150px] rounded-full" />
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-72 glass border-r border-white/5 flex-col fixed h-full z-40 transition-all duration-500">
        <div className="p-8 flex items-center justify-start gap-4">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-display text-black text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:rotate-12 transition-transform">S</div>
            <span className="text-xl font-display tracking-tighter uppercase">SafinX</span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-8">
          {[
            { id: 'overview', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview' },
            { id: 'upload', icon: <PlusCircle className="w-5 h-5" />, label: 'Publish' },
            { id: 'manage', icon: <Package className="w-5 h-5" />, label: 'Inventory' },
            { id: 'orders', icon: <ShoppingCart className="w-5 h-5" />, label: 'Sales' },
            { id: 'analytics', icon: <TrendingUp className="w-5 h-5" />, label: 'Analytics' },
            { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-start gap-4 px-5 py-4 rounded-2xl transition-all group ${
                activeTab === item.id 
                ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10' 
                : 'text-white/20 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`${activeTab === item.id ? 'text-neon-blue' : 'text-white/20 group-hover:text-white'} transition-colors`}>{item.icon}</span>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-start gap-4 px-5 py-4 rounded-2xl text-white/20 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">Exit Console</span>
          </button>
        </div>
      </aside>

      {/* Bottom Nav (Mobile) */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-50 glass border border-white/10 rounded-[32px] p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {[
          { id: 'overview', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'upload', icon: <PlusCircle className="w-5 h-5" /> },
          { id: 'manage', icon: <Package className="w-5 h-5" /> },
          { id: 'orders', icon: <ShoppingCart className="w-5 h-5" /> },
          { id: 'settings', icon: <Settings className="w-5 h-5" /> },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-4 rounded-2xl transition-all ${
              activeTab === item.id 
              ? 'bg-white/10 text-neon-blue' 
              : 'text-white/20'
            }`}
          >
            {item.icon}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-grow lg:ml-72 p-3 lg:p-12 relative z-10 pb-32 lg:pb-12">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-16 gap-6 md:gap-6">
          <div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-display uppercase tracking-tighter leading-none mb-1 lg:mb-2">{activeTab}</h1>
            <p className="micro-label text-white/20 text-[8px] lg:text-[10px]">Manage your digital ecosystem</p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4 lg:gap-6">
            <div className="text-left sm:text-right">
              <p className="micro-label text-white/20 mb-0.5 lg:mb-1 text-[8px] lg:text-[10px]">Available Funds</p>
              <p className="text-xl lg:text-2xl font-black text-neon-blue tracking-tighter">${profile?.totalEarnings?.toFixed(2) || '0.00'}</p>
            </div>
            <Link to="/profile" className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl border border-white/10 p-1 glass group">
              <img 
                src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                alt="Profile" 
                className="w-full h-full rounded-[8px] lg:rounded-[12px] object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: `$${profile?.totalEarnings || 0}`, icon: <DollarSign className="w-5 h-5" />, trend: '+12.5%', color: 'neon-blue' },
                  { label: 'Total Sales', value: products.reduce((acc, p) => acc + (p.salesCount || 0), 0), icon: <ShoppingCart className="w-5 h-5" />, trend: '+5.2%', color: 'neon-purple' },
                  { label: 'Active Assets', value: products.length, icon: <Package className="w-5 h-5" />, trend: '0%', color: 'white' },
                  { label: 'Avg Rating', value: '4.9', icon: <Star className="w-5 h-5" />, trend: '+0.1', color: 'neon-blue' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="premium-card p-4 md:p-8 border-white/5 group hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-white/20 group-hover:text-neon-blue transition-colors">{stat.icon}</div>
                      <span className="text-[10px] font-black text-neon-blue bg-neon-blue/10 px-3 py-1 rounded-full">{stat.trend}</span>
                    </div>
                    <p className="micro-label text-white/20 mb-1">{stat.label}</p>
                    <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Chart & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 premium-card border-white/5 p-8 lg:p-10 relative overflow-hidden h-[450px]">
                  <div className="flex items-center justify-between mb-10 relative z-10">
                    <h3 className="text-xl font-display uppercase tracking-tighter">Revenue Flow</h3>
                    <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 micro-label text-white/40 focus:outline-none">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                  <div className="h-full relative z-10">
                    <ResponsiveContainer width="100%" height="70%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '20px', padding: '16px' }}
                          itemStyle={{ color: '#00f2ff', fontWeight: '900', fontSize: '14px' }}
                        />
                        <Area type="monotone" dataKey="sales" stroke="#00f2ff" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="premium-card border-white/5 p-8 lg:p-10">
                  <h3 className="text-xl font-display uppercase tracking-tighter mb-8">Recent Sales</h3>
                  <div className="space-y-6">
                    {[1, 2, 3, 4].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl glass border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                          <img src={`https://picsum.photos/seed/${i}/100/100`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-bold text-sm truncate group-hover:text-neon-blue transition-colors uppercase tracking-tight">Cyber Kit Pro</p>
                          <p className="text-[10px] text-white/20 uppercase tracking-widest">2 mins ago</p>
                        </div>
                        <p className="font-black text-neon-blue text-sm">+$49</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-10 py-4 glass border-white/5 rounded-2xl micro-label hover:bg-white/5 transition-all">View All Sales</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto premium-card border-white/5 p-8 lg:p-16"
            >
              <form onSubmit={handleUpload} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="micro-label ml-2">Asset Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Cyberpunk UI Kit" 
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                      className="w-full glass border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-white/20 focus:bg-white/[0.03] transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="micro-label ml-2">Category</label>
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full glass border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-white/20 focus:bg-white/[0.03] transition-all appearance-none micro-label text-white/40"
                    >
                      <option className="bg-black">Ebooks</option>
                      <option className="bg-black">Courses</option>
                      <option className="bg-black">Templates</option>
                      <option className="bg-black">Software</option>
                      <option className="bg-black">Design Assets</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="micro-label ml-2">Description</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="Tell the world about your creation..." 
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full glass border-white/5 rounded-3xl px-6 py-5 focus:outline-none focus:border-white/20 focus:bg-white/[0.03] transition-all resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-3">
                  <label className="micro-label ml-2">Price (USD)</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-neon-blue transition-colors" />
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full glass border-white/5 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:border-white/20 focus:bg-white/[0.03] transition-all text-3xl font-black tracking-tighter"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="micro-label ml-2">Thumbnail</label>
                    <div className="relative group cursor-pointer">
                      <input 
                        required
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full h-40 glass border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center group-hover:border-neon-blue/20 transition-all">
                        <Upload className="w-8 h-8 text-white/10 mb-3 group-hover:text-neon-blue transition-colors" />
                        <span className="micro-label text-white/20">{thumbnail ? thumbnail.name : 'Select Image'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="micro-label ml-2">Asset File</label>
                    <div className="relative group cursor-pointer">
                      <input 
                        required
                        type="file" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full h-40 glass border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center group-hover:border-neon-purple/20 transition-all">
                        <Package className="w-8 h-8 text-white/10 mb-3 group-hover:text-neon-purple transition-colors" />
                        <span className="micro-label text-white/20">{file ? file.name : 'Select File'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={uploading}
                  className="btn-primary w-full py-6 disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {uploading ? 'Publishing...' : 'Publish Asset'}
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'manage' && (
            <motion.div 
              key="manage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-32 glass rounded-3xl animate-pulse" />)}
                </div>
              ) : products.length > 0 ? (
                <div className="glass rounded-[40px] border-white/5 overflow-x-auto shadow-2xl">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-white/5 micro-label text-white/20">
                      <tr>
                        <th className="px-10 py-6">Asset</th>
                        <th className="px-10 py-6">Status</th>
                        <th className="px-10 py-6">Price</th>
                        <th className="px-10 py-6">Sales</th>
                        <th className="px-10 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map(product => (
                        <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-2xl glass border border-white/10 p-1 overflow-hidden">
                                <img src={product.thumbnailUrl} alt="" className="w-full h-full object-cover rounded-[12px] opacity-80" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                <p className="text-lg font-bold uppercase tracking-tight group-hover:text-neon-blue transition-colors">{product.title}</p>
                                <p className="micro-label text-white/20">{product.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full micro-label ${
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
                          <td className="px-10 py-6 font-black text-2xl tracking-tighter">${product.price}</td>
                          <td className="px-10 py-6 text-white/40 font-black text-lg">{product.salesCount || 0}</td>
                          <td className="px-10 py-6 text-right">
                            <MoreMenu 
                              items={[
                                { label: 'View Asset', icon: <Eye className="w-4 h-4" />, to: `/product/${product.id}` },
                                { label: 'Edit Details', icon: <Edit className="w-4 h-4" />, onClick: () => console.log('Edit', product.id) },
                                { label: 'Download File', icon: <Download className="w-4 h-4" />, onClick: () => window.open(product.fileUrl) },
                                { label: 'Delete Asset', icon: <Trash2 className="w-4 h-4 text-red-400" />, onClick: () => handleDelete(product.id) },
                              ]}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-32 glass rounded-[40px] border-white/5">
                  <Package className="w-20 h-20 text-white/5 mx-auto mb-8 animate-float" />
                  <h3 className="text-3xl font-display uppercase tracking-tighter mb-4">No assets found</h3>
                  <p className="text-white/20 mb-10 max-w-xs mx-auto text-sm">Start your journey by publishing your first digital asset.</p>
                  <button onClick={() => setActiveTab('upload')} className="btn-primary px-12">Publish Asset</button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="glass rounded-[60px] border-white/5 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
                <table className="w-full text-left">
                  <thead className="bg-white/5 micro-label text-white/20">
                    <tr>
                      <th className="px-12 py-10">Order ID</th>
                      <th className="px-12 py-10">Product</th>
                      <th className="px-12 py-10">Customer</th>
                      <th className="px-12 py-10">Amount</th>
                      <th className="px-12 py-10">Date</th>
                      <th className="px-12 py-10 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/5 transition-colors group">
                      <td className="px-12 py-10 micro-label text-white/20">#ORD-7721</td>
                      <td className="px-12 py-10 text-xl font-bold uppercase tracking-tight">Cyberpunk UI Kit</td>
                      <td className="px-12 py-10 text-white/40 text-lg">customer@example.com</td>
                      <td className="px-12 py-10 font-black text-3xl tracking-tighter text-neon-blue">$49.00</td>
                      <td className="px-12 py-10 micro-label text-white/20">Oct 12, 2023</td>
                      <td className="px-12 py-10 text-right">
                        <span className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-green-500/10 text-green-400 micro-label">
                          <CheckCircle2 className="w-4 h-4" /> Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
