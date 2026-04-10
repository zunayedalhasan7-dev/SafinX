import { motion } from 'motion/react';
import { Briefcase, Rocket, Heart, Mail, ArrowRight } from 'lucide-react';

export default function Careers() {
  const benefits = [
    {
      title: "Flexible Environment",
      description: "Flexible remote work environment to suit your lifestyle.",
      icon: <Globe className="w-5 h-5" />
    },
    {
      title: "Growth & Learning",
      description: "Opportunities for growth and continuous learning.",
      icon: <Rocket className="w-5 h-5" />
    },
    {
      title: "Innovation",
      description: "Work on innovative and meaningful projects that shape the future.",
      icon: <Heart className="w-5 h-5" />
    }
  ];

  return (
    <div className="relative min-h-screen pb-32 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-neon-purple/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[5%] w-[600px] h-[600px] bg-neon-blue/5 blur-[150px] rounded-full" />
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
            Join the Empire
            <span className="w-8 h-px bg-white/10" />
          </div>
          <h1 className="display-title mb-8">
            CAREERS AT <span className="neon-text">SAFINX</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed max-w-2xl mx-auto">
            At SafinX, we are building the future of digital commerce—and we want talented people to join us on this journey.
          </p>
        </motion.div>

        <div className="space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="premium-card p-12 md:p-16 border-white/5"
          >
            <h2 className="text-3xl font-display uppercase tracking-tighter mb-8">Why join us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="font-bold uppercase tracking-tight">Remote Work</h4>
                <p className="text-sm text-white/40">Flexible remote work environment.</p>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple">
                  <Rocket className="w-5 h-5" />
                </div>
                <h4 className="font-bold uppercase tracking-tight">Growth</h4>
                <p className="text-sm text-white/40">Opportunities for growth and learning.</p>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-bold uppercase tracking-tight">Innovation</h4>
                <p className="text-sm text-white/40">Work on innovative projects.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-12 md:p-16 rounded-[60px] border-white/5 text-center"
          >
            <Mail className="w-12 h-12 text-neon-blue mx-auto mb-8" />
            <h2 className="text-3xl font-display uppercase tracking-tighter mb-6">Get in Touch</h2>
            <p className="text-white/40 mb-10 text-lg">
              We are always looking for passionate, creative, and driven individuals who want to make an impact.
            </p>
            <a 
              href="mailto:careers@safinx.com" 
              className="btn-primary inline-flex items-center gap-4 px-12 py-6 text-[10px]"
            >
              careers@safinx.com <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import { Globe } from 'lucide-react';
