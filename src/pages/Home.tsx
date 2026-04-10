import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Globe, Star, Users, TrendingUp, ShoppingCart, Heart, Eye, Layers, Code, Palette, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { collection, query, limit, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, 'products'), 
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc'), 
          limit(4)
        );
        const snapshot = await getDocs(q);
        setFeaturedProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Ebooks', icon: <BookOpen className="w-8 h-8" />, count: '1.2k+' },
    { name: 'Courses', icon: <GraduationCap className="w-8 h-8" />, count: '850+' },
    { name: 'Templates', icon: <Palette className="w-8 h-8" />, count: '2.4k+' },
    { name: 'Software', icon: <Code className="w-8 h-8" />, count: '400+' },
    { name: 'Design Assets', icon: <Layers className="w-8 h-8" />, count: '3.1k+' },
  ];

  return (
    <div className="space-y-16 md:space-y-48 pb-16 md:pb-48 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 md:pt-20 overflow-hidden">
        {/* Floating Illustrations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
          <motion.div 
            animate={{ 
              y: [0, -40, 0],
              rotate: [0, 10, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[5%] text-neon-blue"
          >
            <Sparkles className="w-32 h-32" />
          </motion.div>
          <motion.div 
            animate={{ 
              y: [0, 40, 0],
              rotate: [0, -10, 0],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[10%] text-neon-purple"
          >
            <Globe className="w-48 h-48" />
          </motion.div>
          <motion.div 
            animate={{ 
              x: [0, 30, 0],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] right-[5%] text-white"
          >
            <Zap className="w-24 h-24" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="micro-label mb-6 md:mb-12 flex items-center justify-center gap-2 md:gap-4">
              <span className="w-8 md:w-12 h-px bg-white/10" />
              The Future of Digital Assets
              <span className="w-8 md:w-12 h-px bg-white/10" />
            </div>
            
            <h1 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-display tracking-tighter leading-[0.85] mb-6 md:mb-12">
              BUILD YOUR <br /> 
              <span className="neon-text">DIGITAL EMPIRE</span>
            </h1>

            <p className="max-w-2xl mx-auto text-white/40 text-sm md:text-xl mb-12 md:mb-16 leading-relaxed font-medium px-4">
              SafinX is the premium marketplace for high-quality digital products. 
              Discover and grow your creative business with ease.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 px-6">
              <Link to="/marketplace" className="btn-primary w-full sm:w-auto group py-4 md:py-5">
                Explore Marketplace <ArrowRight className="inline-block w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/auth" className="btn-secondary w-full sm:w-auto py-4 md:py-5">
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-deep-bg to-transparent" />
      </section>

      {/* Features Section - SaaS Style */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
          <div>
            <div className="micro-label mb-6 flex items-center gap-4">
              <span className="w-8 h-px bg-neon-blue" />
              Platform Capabilities
            </div>
            <h2 className="text-2xl sm:text-5xl md:text-7xl lg:text-8xl font-display uppercase tracking-tighter leading-[0.9] md:leading-[0.85] mb-6 md:mb-12">
              ENGINEERED FOR <br className="hidden sm:block" /> <span className="neon-text">CREATORS</span>
            </h2>
            <p className="text-white/40 text-sm md:text-xl mb-10 md:mb-16 leading-relaxed max-w-xl">
              SafinX provides the infrastructure you need to scale your digital business globally. 
              From secure delivery to advanced analytics, we've got you covered.
            </p>
            <div className="space-y-6 md:space-y-8">
              {[
                { title: 'Instant Global Delivery', desc: 'Your products reach customers in seconds, anywhere in the world.', icon: <Globe className="w-6 h-6" /> },
                { title: 'Secure Transactions', desc: 'Enterprise-grade security for every single purchase.', icon: <Shield className="w-6 h-6" /> },
                { title: 'Advanced Analytics', desc: 'Deep insights into your sales performance and customer behavior.', icon: <TrendingUp className="w-6 h-6" /> },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 md:gap-8 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl glass flex items-center justify-center text-white/20 group-hover:text-neon-blue group-hover:shadow-[0_0_20px_rgba(0,242,255,0.2)] transition-all shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-1 md:mb-2 group-hover:text-white transition-colors">{feature.title}</h4>
                    <p className="text-xs md:text-base text-white/20 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-12 lg:mt-0">
            <div className="aspect-square glass rounded-[40px] md:rounded-[80px] border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 opacity-50" />
              <div className="absolute inset-10 border border-white/5 rounded-[60px] flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="text-white/5"
                >
                  <Sparkles className="w-64 h-64" />
                </motion.div>
              </div>
              {/* Floating UI Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-6 right-6 md:top-20 md:right-20 glass p-3 md:p-6 rounded-xl md:rounded-3xl border-white/10 shadow-2xl"
              >
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="w-6 h-6 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                    <TrendingUp className="w-3 h-3 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <p className="micro-label text-white/20 text-[6px] md:text-[10px]">Daily Revenue</p>
                    <p className="text-[10px] md:text-xl font-black text-white">+$2,450.00</p>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-6 left-6 md:bottom-20 md:left-20 glass p-3 md:p-6 rounded-xl md:rounded-3xl border-white/10 shadow-2xl"
              >
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="w-6 h-6 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                    <Users className="w-3 h-3 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <p className="micro-label text-white/20 text-[6px] md:text-[10px]">New Customers</p>
                    <p className="text-[10px] md:text-xl font-black text-white">+128</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-24 gap-8">
          <div>
            <div className="micro-label mb-3">Curated Selection</div>
            <h2 className="text-2xl sm:text-5xl md:text-7xl font-display uppercase tracking-tighter leading-[0.9] md:leading-none">
              FEATURED <br className="hidden sm:block" /> <span className="text-white/10">ASSETS</span>
            </h2>
          </div>
          <Link to="/marketplace" className="micro-label hover:text-neon-blue transition-colors flex items-center gap-3 bg-white/5 md:bg-transparent px-6 py-4 md:p-0 rounded-2xl border border-white/5 md:border-none w-full md:w-auto justify-center">
            View All Marketplace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] glass rounded-[40px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="group"
              >
                <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] glass rounded-[40px] overflow-hidden border-white/5 group-hover:border-white/20 transition-all mb-6">
                  <img 
                    src={product.thumbnailUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-8 left-8 right-8 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="btn-primary py-4 text-[10px] text-center">
                      Quick View
                    </div>
                  </div>
                </Link>
                <div className="px-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl uppercase tracking-tight truncate pr-4">{product.title}</h3>
                    <span className="text-neon-blue font-black tracking-tighter">${product.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="micro-label">{product.category}</p>
                    <div className="flex items-center gap-2 micro-label text-white/20">
                      <Star className="w-3 h-3 fill-neon-blue text-neon-blue" />
                      <span>{product.rating || '5.0'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-24">
          <div className="micro-label mb-3">Explore Niches</div>
          <h2 className="text-2xl md:text-6xl lg:text-7xl font-display uppercase tracking-tighter">
            BROWSE BY <br /> <span className="text-white/10">CATEGORY</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="premium-card group cursor-pointer text-center flex flex-col items-center p-6 md:p-8"
            >
              <div className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-neon-blue group-hover:bg-neon-blue/10 transition-all duration-500 mb-4 md:mb-8 group-hover:scale-110">
                {cat.icon}
              </div>
              <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 uppercase tracking-tight">{cat.name}</h3>
              <p className="micro-label text-[8px] md:text-[10px]">{cat.count} assets</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">
          {[
            { label: 'Total Creators', value: '12k+', icon: <Users className="w-4 h-4 md:w-6 md:h-6" /> },
            { label: 'Digital Assets', value: '45k+', icon: <Zap className="w-4 h-4 md:w-6 md:h-6" /> },
            { label: 'Global Sales', value: '$2.4M', icon: <TrendingUp className="w-4 h-4 md:w-6 md:h-6" /> },
            { label: 'Secure Payouts', value: '100%', icon: <Shield className="w-4 h-4 md:w-6 md:h-6" /> },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center glass p-4 md:p-8 rounded-2xl md:rounded-[32px] border-white/5"
            >
              <div className="w-8 h-8 md:w-16 md:h-16 rounded-xl md:rounded-[24px] bg-neon-blue/10 flex items-center justify-center text-neon-blue mb-2 md:mb-8">
                {stat.icon}
              </div>
              <p className="text-xl md:text-4xl font-black tracking-tighter mb-0.5 md:mb-2">{stat.value}</p>
              <p className="micro-label text-[7px] md:text-[10px] opacity-40">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative glass p-10 md:p-32 rounded-[40px] md:rounded-[60px] text-center overflow-hidden border-white/10">
          <div className="relative z-10">
            <div className="micro-label mb-6">Join the Revolution</div>
            <h2 className="text-2xl md:text-7xl lg:text-8xl font-display uppercase tracking-tighter mb-8 md:mb-12 leading-[0.85]">
              READY TO <br /> <span className="text-white/10">EXPLORE ASSETS?</span>
            </h2>
            <p className="text-white/40 mb-16 max-w-lg mx-auto text-base md:text-lg font-medium">
              Discover the exclusive collection of digital assets crafted for the next generation of creators.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
              <Link to="/auth" className="btn-primary w-full sm:w-auto py-4 md:py-5">
                Create Account
              </Link>
              <Link to="/marketplace" className="btn-secondary w-full sm:w-auto py-4 md:py-5">
                Browse Marketplace
              </Link>
            </div>
          </div>
          
          {/* Background Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-blue/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-purple/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
      </section>
    </div>
  );
}
