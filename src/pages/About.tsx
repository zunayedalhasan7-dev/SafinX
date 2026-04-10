import { motion } from 'motion/react';
import { Sparkles, Globe, Zap, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="relative min-h-screen pb-32 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-neon-blue/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] left-[5%] w-[600px] h-[600px] bg-neon-purple/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="micro-label mb-8 flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-white/10" />
            Our Story
            <span className="w-8 h-px bg-white/10" />
          </div>
          <h1 className="display-title mb-8">
            ABOUT <span className="neon-text">SAFINX</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed max-w-2xl mx-auto">
            Building the future of digital commerce, one creator at a time.
          </p>
        </motion.div>

        <div className="space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="premium-card p-12 md:p-16 border-white/5"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-display uppercase tracking-tighter">The Platform</h2>
            </div>
            <div className="space-y-6 text-white/60 text-lg leading-relaxed font-medium">
              <p>
                SafinX is a modern digital marketplace built for creators, entrepreneurs, and innovators. Our platform allows users to easily buy and sell digital products such as eBooks, courses, templates, software, and design assets.
              </p>
              <p>
                We aim to empower creators by providing a secure, fast, and user-friendly environment to grow their business globally. At the same time, we ensure buyers get access to high-quality digital products with a smooth and reliable experience.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="premium-card p-12 border-white/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 flex items-center justify-center text-neon-purple mb-8">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display uppercase tracking-tighter mb-6">Our Mission</h3>
              <p className="text-white/40 leading-relaxed">
                Our mission is simple: make digital selling smarter, easier, and accessible to everyone.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="premium-card p-12 border-white/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-8">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display uppercase tracking-tighter mb-6">Our Values</h3>
              <p className="text-white/40 leading-relaxed">
                Security, transparency, and quality are at the heart of everything we build at SafinX.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
