import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { Star, Shield, Zap, Globe, ArrowLeft, ShoppingCart, Heart, Share2, CheckCircle2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          navigate('/marketplace');
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `products/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnailUrl: product.thumbnailUrl,
      category: product.category
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white font-display uppercase tracking-widest">Loading Empire...</div>;
  if (!product) return null;

  return (
    <div className="relative min-h-screen pb-32 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[5%] w-[500px] h-[500px] bg-neon-blue/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px] bg-neon-purple/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-24 relative z-10">
        <Link to="/marketplace" className="inline-flex items-center gap-4 text-white/20 hover:text-white transition-all mb-10 md:mb-16 micro-label group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left: Content */}
          <div className="lg:col-span-8 space-y-8 md:space-y-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-video glass rounded-[24px] md:rounded-[60px] overflow-hidden border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative group"
            >
              <img 
                src={product.thumbnailUrl || `https://picsum.photos/seed/${product.id}/1200/800`} 
                alt={product.title} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-8 right-8">
                <div className="glass p-4 rounded-2xl border-white/10 animate-float">
                  <Sparkles className="w-6 h-6 text-neon-blue" />
                </div>
              </div>
            </motion.div>

            <div className="space-y-12">
              <div className="flex flex-wrap items-center gap-8">
                <span className="px-8 py-3 rounded-full glass micro-label text-neon-blue border-neon-blue/20">
                  {product.category}
                </span>
                <div className="flex items-center gap-3 micro-label">
                  <Star className="w-4 h-4 fill-neon-blue text-neon-blue" />
                  <span className="text-white">{product.rating || '5.0'}</span>
                  <span className="text-white/20">({product.reviewCount || 0} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-6xl lg:text-8xl font-display uppercase tracking-tighter leading-[0.85]">{product.title}</h1>
              
              <div className="flex items-center gap-6 pt-6">
                <div className="w-16 h-16 rounded-2xl glass border border-white/10 p-1 overflow-hidden">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerId}`} 
                    alt={product.sellerName} 
                    className="w-full h-full object-cover rounded-[12px] opacity-80"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="micro-label mb-2">Created by</p>
                  <p className="text-2xl font-bold uppercase tracking-tight">{product.sellerName}</p>
                </div>
              </div>
            </div>

            <div className="premium-card space-y-8 md:space-y-12 border-white/5 p-6 md:p-16">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neon-blue">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-display uppercase tracking-tighter">OVERVIEW</h2>
              </div>
              <div className="prose prose-invert max-w-none text-white/40 leading-relaxed text-lg font-medium">
                <ReactMarkdown>{product.description}</ReactMarkdown>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="premium-card border-white/5 p-12">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-4 uppercase tracking-tight">
                  <CheckCircle2 className="w-6 h-6 text-neon-blue" /> Included
                </h3>
                <ul className="space-y-6 text-sm text-white/40 font-medium">
                  <li className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-neon-blue/40" /> Full digital asset files</li>
                  <li className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-neon-blue/40" /> Lifetime updates</li>
                  <li className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-neon-blue/40" /> Commercial license</li>
                  <li className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-neon-blue/40" /> Premium support</li>
                </ul>
              </div>
              <div className="premium-card border-white/5 p-12">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-4 uppercase tracking-tight">
                  <Shield className="w-6 h-6 text-neon-purple" /> Security
                </h3>
                <ul className="space-y-6 text-sm text-white/40 font-medium">
                  <li className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-neon-purple/40" /> Verified creator</li>
                  <li className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-neon-purple/40" /> Secure processing</li>
                  <li className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-neon-purple/40" /> Instant delivery</li>
                  <li className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-neon-purple/40" /> Satisfaction guarantee</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-12">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-8 md:p-12 rounded-[40px] md:rounded-[60px] border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-16">
                    <span className="micro-label">Investment</span>
                    <span className="text-6xl font-black tracking-tighter">${product.price}</span>
                  </div>

                  <div className="space-y-6">
                    <button 
                      onClick={handleAddToCart}
                      className={`w-full flex items-center justify-center gap-4 py-6 text-[10px] uppercase tracking-[0.3em] transition-all duration-500 ${
                        added ? 'bg-green-500 text-white' : 'btn-primary'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" /> {added ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                    <Link to="/cart" className="btn-secondary w-full flex items-center justify-center gap-4 py-6 text-[10px] uppercase tracking-[0.3em]">
                      View Cart
                    </Link>
                  </div>

                  <div className="mt-16 pt-16 border-t border-white/5 space-y-8">
                    <div className="flex items-center gap-5 micro-label text-white/30">
                      <Zap className="w-5 h-5 text-neon-blue" />
                      <span>Instant digital delivery</span>
                    </div>
                    <div className="flex items-center gap-5 micro-label text-white/30">
                      <Globe className="w-5 h-5 text-neon-purple" />
                      <span>Available worldwide</span>
                    </div>
                  </div>

                  <button className="w-full mt-16 flex items-center justify-center gap-3 micro-label text-white/10 hover:text-white transition-all">
                    <Share2 className="w-4 h-4" /> Share Asset
                  </button>
                </div>
                
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-neon-blue/10 blur-[100px] -z-10" />
              </motion.div>

              <div className="glass p-8 md:p-12 rounded-[40px] md:rounded-[60px] border-white/5">
                <h4 className="micro-label mb-10">Curator</h4>
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-20 h-20 rounded-3xl glass border border-white/10 p-1 overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerId}`} 
                      alt={product.sellerName} 
                      className="w-full h-full object-cover rounded-[16px] opacity-80"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h5 className="text-2xl font-bold uppercase tracking-tight">{product.sellerName}</h5>
                    <p className="micro-label text-neon-blue">Elite Creator</p>
                  </div>
                </div>
                <button className="w-full btn-secondary py-5 text-[10px]">
                  View Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
