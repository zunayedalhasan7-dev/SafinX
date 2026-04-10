import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { motion } from 'motion/react';
import { Search, Filter, Star, ArrowRight, ShoppingCart, Sparkles, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Marketplace() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Ebooks', 'Courses', 'Templates', 'Software', 'Design Assets'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, 'products'), where('status', '==', 'approved'));
        
        if (category !== 'All') {
          q = query(q, where('category', '==', category));
        }

        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetched);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen pb-32 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-neon-blue/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] left-[5%] w-[600px] h-[600px] bg-neon-purple/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-20 md:pt-32 relative z-10">
        <div className="mb-12 md:mb-32 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="micro-label mb-6 md:mb-8 flex items-center justify-center lg:justify-start gap-4">
              <span className="w-8 h-px bg-white/10" />
              Premium Marketplace
              <span className="w-8 h-px bg-white/10" />
            </div>
            <h1 className="text-3xl md:text-7xl lg:text-8xl font-display tracking-tighter leading-[0.85] mb-6 md:mb-8">
              DIGITAL <br /> <span className="neon-text">MARKETPLACE</span>
            </h1>
            <p className="text-white/40 max-w-xl mx-auto lg:mx-0 text-lg leading-relaxed">
              Discover premium digital assets from top creators worldwide. 
              Hand-picked for quality and performance.
            </p>
          </motion.div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mb-16 md:mb-24 items-center justify-between">
          <div className="relative group w-full lg:max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-neon-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass border-white/5 rounded-2xl pl-16 pr-6 py-4 md:py-5 focus:outline-none focus:border-white/20 focus:bg-white/[0.03] transition-all text-base md:text-lg placeholder:text-white/10"
            />
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-end gap-2 md:gap-3 w-full">
            {categories.map((cat, i) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setCategory(cat)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl micro-label text-[8px] md:text-[10px] transition-all duration-300 ${
                  category === cat 
                  ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)] scale-105' 
                  : 'glass hover:bg-white/5 text-white/30 border-white/5'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-[40px] aspect-[4/5] animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="group premium-card p-0 overflow-hidden flex flex-col"
              >
                <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={product.thumbnailUrl || `https://picsum.photos/seed/${product.id}/800/600`} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 right-6 glass px-5 py-2 rounded-full micro-label text-white/60">
                    {product.category}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
                
                <div className="p-6 md:p-10 flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full glass flex items-center justify-center overflow-hidden border-white/10">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerId}`} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                      </div>
                      <span className="micro-label text-white/40">{product.sellerName}</span>
                    </div>
                    <div className="flex items-center gap-2 micro-label text-white/60">
                      <Star className="w-3 h-3 fill-neon-blue text-neon-blue" />
                      {product.rating || '5.0'}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-2xl mb-4 group-hover:text-neon-blue transition-colors uppercase tracking-tight">{product.title}</h3>
                  <p className="text-white/30 line-clamp-2 mb-10 leading-relaxed text-sm">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="micro-label mb-1">Price</span>
                      <span className="text-3xl font-black tracking-tighter">${product.price}</span>
                    </div>
                    <Link to={`/product/${product.id}`} className="w-16 h-16 rounded-2xl glass flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 group/btn">
                      <ShoppingCart className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-48 glass rounded-[60px] border-white/5"
          >
            <div className="relative inline-block mb-12">
              <Search className="w-24 h-24 text-white/5" />
              <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-neon-blue animate-pulse" />
            </div>
            <h3 className="text-4xl font-display uppercase tracking-tighter mb-6">No assets found</h3>
            <p className="text-white/20 max-w-md mx-auto text-lg">
              Try adjusting your search or category filters to find what you're looking for.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
