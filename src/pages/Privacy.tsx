import { motion } from 'motion/react';
import { Shield, Lock, Eye, CheckCircle2 } from 'lucide-react';

export default function Privacy() {
  const points = [
    "Your data is never sold to third parties",
    "We use secure authentication and encryption technologies",
    "Payments are processed through trusted third-party providers",
    "We take all reasonable steps to protect your information"
  ];

  return (
    <div className="relative min-h-screen pb-32 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] bg-neon-blue/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[15%] left-[10%] w-[500px] h-[500px] bg-neon-purple/5 blur-[150px] rounded-full" />
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
            Security First
            <span className="w-8 h-px bg-white/10" />
          </div>
          <h1 className="display-title mb-8">
            PRIVACY <span className="neon-text">POLICY</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed max-w-2xl mx-auto">
            Your privacy is important to us. SafinX is committed to protecting your personal information and ensuring a secure experience.
          </p>
        </motion.div>

        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="premium-card p-12 md:p-16 border-white/5"
          >
            <div className="flex items-center gap-4 mb-10">
              <Lock className="w-8 h-8 text-neon-blue" />
              <h2 className="text-3xl font-display uppercase tracking-tighter">Data Protection</h2>
            </div>
            <p className="text-white/60 text-lg leading-relaxed mb-12">
              We only collect the information necessary to provide and improve our services. Our commitment to your security is unwavering.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {points.map((point, i) => (
                <div key={i} className="flex items-start gap-4 p-6 glass rounded-2xl border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-neon-blue shrink-0 mt-1" />
                  <span className="text-sm text-white/40 font-medium">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-[40px] border-white/5"
          >
            <p className="text-white/30 text-center italic">
              By using SafinX, you agree to the collection and use of information in accordance with this policy.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
