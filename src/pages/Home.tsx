import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Globe, Star, Users, TrendingUp, ShoppingCart, Heart, Eye, Layers, Code, Palette, BookOpen, GraduationCap, Sparkles, AlertTriangle, ChevronDown, Zap as ZapIcon } from 'lucide-react';
import { collection, query, limit, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef(null);
  const bentoRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: bentoScroll } = useScroll({
    target: bentoRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -100]);

  useEffect(() => {
    const fetchFeatured = async () => {
      setError(null);
      try {
        // Workaround for missing composite index: 
        // Fetch by orderBy and filter status in memory
        const q = query(
          collection(db, 'products'), 
          orderBy('createdAt', 'desc'), 
          limit(20)
        );
        const snapshot = await getDocs(q);
        const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const approvedProducts = allProducts
          .filter((p: any) => p.status === 'approved')
          .slice(0, 4);
        
        setFeaturedProducts(approvedProducts);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to load featured products.");
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
    <div ref={containerRef} className="space-y-16 md:space-y-48 pb-16 md:pb-48 overflow-hidden relative">
      {/* Parallax Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 opacity-20"
      >
        <div className="absolute top-[10%] left-[5%] w-[800px] h-[800px] bg-neon-blue/10 blur-[150px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-[20%] right-[5%] w-[800px] h-[800px] bg-neon-purple/10 blur-[150px] rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </motion.div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            style={{ 
              opacity: heroOpacity, 
              scale: heroScale,
              y: heroY
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[160px] font-display tracking-tighter leading-[0.8] mb-12 uppercase">
              <motion.span 
                initial={{ opacity: 0, filter: "blur(20px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.2 }}
                className="block"
              >
                BUILD YOUR
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, filter: "blur(20px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.4 }}
                className="neon-text block"
              >
                DIGITAL EMPIRE
              </motion.span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="max-w-2xl mx-auto text-white/40 text-lg md:text-2xl mb-16 leading-relaxed font-light px-4"
            >
              The premium destination for elite digital assets. 
              Empowering creators to scale their vision globally.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 px-6"
            >
              <Link to="/marketplace" className="btn-primary w-full sm:w-auto group py-6 px-12 text-xs">
                Explore Marketplace <ArrowRight className="inline-block w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/auth" className="glass w-full sm:w-auto py-6 px-12 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                Join the Network
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="micro-label opacity-20">Scroll to Explore</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-white/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Features - Apple Style */}
      <section ref={bentoRef} className="max-w-7xl mx-auto px-6 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="micro-label mb-4 text-neon-blue">Platform Capabilities</div>
          <h2 className="text-3xl md:text-6xl font-display uppercase tracking-tighter mb-4">Engineered for <span className="neon-text">Excellence</span></h2>
          <p className="text-white/40 max-w-xl mx-auto text-base md:text-lg">Experience a platform built with precision, security, and performance at its core.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {/* Large Feature Card */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 glass rounded-[24px] md:rounded-[40px] p-5 md:p-10 border-white/5 relative overflow-hidden group min-h-[280px] md:min-h-[400px]"
          >
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue mb-5 md:mb-10">
                <ZapIcon className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <h3 className="text-xl md:text-4xl lg:text-5xl font-display uppercase tracking-tighter mb-3 md:mb-5">Instant <br /> Deployment</h3>
              <p className="text-white/40 max-w-md text-xs md:text-lg leading-relaxed">Download your assets immediately after purchase. No waiting, no friction. Just pure speed for your workflow.</p>
              
              <div className="mt-auto pt-6 md:pt-10">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="px-2.5 py-1 md:px-4 md:py-2 glass rounded-full text-[7px] md:text-[9px] font-bold uppercase tracking-widest text-white/40">Global CDN</div>
                  <div className="px-2.5 py-1 md:px-4 md:py-2 glass rounded-full text-[7px] md:text-[9px] font-bold uppercase tracking-widest text-white/40">Zero Latency</div>
                </div>
              </div>
            </div>
            
            {/* Visual Element */}
            <div className="absolute -right-20 -bottom-20 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-neon-blue/5 blur-[60px] md:blur-[80px] rounded-full group-hover:bg-neon-blue/10 transition-colors duration-700" />
            <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:block">
              <motion.div 
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [12, 15, 12]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-56 h-56 xl:w-72 xl:h-72 glass rounded-[24px] md:rounded-[40px] border-white/10 rotate-12 flex items-center justify-center p-5 md:p-7 shadow-2xl"
              >
                <div className="w-full h-full bg-gradient-to-br from-neon-blue/20 via-transparent to-neon-purple/20 rounded-[20px] md:rounded-[28px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tech/800/800')] bg-cover opacity-20 mix-blend-overlay" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Medium Feature Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 glass rounded-[24px] md:rounded-[40px] p-5 md:p-10 border-white/5 relative overflow-hidden group min-h-[280px] md:min-h-[400px]"
          >
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple mb-5 md:mb-10">
              <Shield className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <h3 className="text-xl md:text-2xl font-display uppercase tracking-tighter mb-3 md:mb-5">Elite <br /> Security</h3>
            <p className="text-white/40 text-xs md:text-sm leading-relaxed">Every transaction is protected by enterprise-grade encryption and secure authentication protocols.</p>
            <div className="absolute -right-10 -bottom-10 w-40 md:w-56 h-40 md:h-56 bg-neon-purple/5 blur-[30px] md:blur-[50px] rounded-full group-hover:bg-neon-purple/10 transition-colors duration-700" />
          </motion.div>

          {/* Medium Feature Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 glass rounded-[24px] md:rounded-[40px] p-5 md:p-10 border-white/5 relative overflow-hidden group min-h-[280px] md:min-h-[400px]"
          >
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-white mb-5 md:mb-10">
              <Globe className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <h3 className="text-xl md:text-2xl font-display uppercase tracking-tighter mb-3 md:mb-5">Global <br /> Network</h3>
            <p className="text-white/40 text-xs md:text-sm leading-relaxed">Join a worldwide community of creators and innovators scaling their vision across borders.</p>
            <div className="absolute -right-10 -bottom-10 w-40 md:w-56 h-40 md:h-56 bg-white/5 blur-[30px] md:blur-[50px] rounded-full group-hover:bg-white/10 transition-colors duration-700" />
          </motion.div>

          {/* Large Feature Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-8 glass rounded-[24px] md:rounded-[40px] p-5 md:p-10 border-white/5 relative overflow-hidden group min-h-[280px] md:min-h-[400px]"
          >
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue mb-5 md:mb-10">
                <Sparkles className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <h3 className="text-xl md:text-4xl lg:text-5xl font-display uppercase tracking-tighter mb-3 md:mb-5">Premium <br /> Curation</h3>
              <p className="text-white/40 max-w-md text-xs md:text-lg leading-relaxed">Only the highest quality assets make it to our marketplace. We filter for excellence so you can focus on building.</p>
              
              <div className="mt-auto pt-6 md:pt-10 flex items-center gap-3 md:gap-6">
                <div className="flex -space-x-2.5 md:-space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-7 h-7 md:w-10 md:h-10 rounded-full border-2 border-black bg-white/10 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p className="micro-label text-[7px] md:text-[9px] text-white/40">Trusted by 12k+ creators</p>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-neon-blue/5 blur-[60px] md:blur-[80px] rounded-full group-hover:bg-neon-blue/10 transition-colors duration-700" />
          </motion.div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="micro-label mb-4 text-neon-blue">Curated Selection</div>
            <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tighter leading-none">
              FEATURED <span className="text-white/10">ASSETS</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/marketplace" className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] hover:text-neon-blue transition-colors">
              View All Marketplace <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] glass rounded-[32px] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24 glass rounded-[48px] border-red-500/10">
            <AlertTriangle className="w-12 h-12 text-red-500/50 mx-auto mb-6" />
            <p className="text-white/20 font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden bg-[#0A0A0A] border border-white/5 group-hover:border-white/20 transition-all duration-700">
                    <img 
                      src={product.thumbnailUrl} 
                      alt={product.title} 
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="micro-label text-white/40 mb-2">{product.category}</p>
                          <h3 className="text-xl font-display uppercase tracking-tight group-hover:text-neon-blue transition-colors">{product.title}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black tracking-tighter">${product.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
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
            { label: 'Digital Assets', value: '45k+', icon: <ZapIcon className="w-4 h-4 md:w-6 md:h-6" /> },
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
