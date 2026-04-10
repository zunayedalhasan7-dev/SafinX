import { motion } from 'motion/react';
import { FileText, AlertCircle, CheckCircle2, Scale } from 'lucide-react';

export default function Terms() {
  const terms = [
    "You must provide accurate and complete information",
    "You are responsible for maintaining the security of your account",
    "Products uploaded must not violate copyright or legal regulations",
    "SafinX is not responsible for user-generated content",
    "Payments, refunds, and disputes follow our platform policies"
  ];

  return (
    <div className="relative min-h-screen pb-32 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-neon-purple/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-neon-blue/5 blur-[150px] rounded-full" />
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
            Legal Framework
            <span className="w-8 h-px bg-white/10" />
          </div>
          <h1 className="display-title mb-8">
            TERMS OF <span className="neon-text">SERVICE</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed max-w-2xl mx-auto">
            By accessing or using SafinX, you agree to comply with our terms and conditions.
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
              <Scale className="w-8 h-8 text-neon-purple" />
              <h2 className="text-3xl font-display uppercase tracking-tighter">Agreement</h2>
            </div>
            
            <div className="space-y-6">
              {terms.map((term, i) => (
                <div key={i} className="flex items-start gap-6 p-8 glass rounded-3xl border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-white/60 font-medium leading-relaxed">{term}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-[40px] border-neon-purple/20 flex items-center gap-6"
          >
            <AlertCircle className="w-8 h-8 text-neon-purple shrink-0" />
            <p className="text-white/40 text-sm leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms at any time.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
