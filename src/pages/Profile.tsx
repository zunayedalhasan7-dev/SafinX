import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { User, Mail, Shield, Camera, Save, Sparkles, Lock, Trash2 } from 'lucide-react';

export default function Profile() {
  const { user, profile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName
      });
      toast.success('Identity Updated Successfully');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      toast.error('Failed to update identity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-32 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[5%] w-[500px] h-[500px] bg-neon-blue/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[15%] right-[5%] w-[500px] h-[500px] bg-neon-purple/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-32 relative z-10">
        <div className="text-center mb-24">
          <div className="micro-label mb-8 flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-white/10" />
            Account Management
            <span className="w-8 h-px bg-white/10" />
          </div>
          <h1 className="display-title mb-8">PROFILE <br /> <span className="neon-text">SETTINGS</span></h1>
          <p className="text-white/20 micro-label">Manage your identity and security preferences</p>
        </div>

        <div className="space-y-16">
          <div className="premium-card p-12 md:p-20">
            <div className="flex flex-col items-center mb-24">
              <div className="relative group">
                <div className="w-48 h-48 rounded-[60px] border border-white/10 p-2 glass relative overflow-hidden group-hover:shadow-[0_0_50px_rgba(0,242,255,0.2)] transition-all duration-700">
                  <img 
                    src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                    alt="Profile" 
                    className="w-full h-full rounded-[48px] object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <button className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-black shadow-2xl hover:scale-110 hover:rotate-12 transition-all group/cam">
                  <Camera className="w-7 h-7 group-hover/cam:scale-110 transition-transform" />
                </button>
              </div>
              <h2 className="text-4xl font-display mt-12 uppercase tracking-tighter">{profile?.displayName || 'User'}</h2>
              <p className="micro-label text-white/20 mt-4">{profile?.email}</p>
              <div className="mt-8 px-8 py-3 rounded-full glass border border-white/5 micro-label text-neon-blue">
                {profile?.role} Account
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="micro-label ml-4">Display Name</label>
                  <div className="relative group">
                    <User className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10 group-focus-within:text-neon-blue transition-colors" />
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full glass border-white/5 rounded-[32px] pl-20 pr-8 py-6 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all text-lg font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="micro-label ml-4">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10" />
                    <input 
                      disabled
                      type="email" 
                      value={profile?.email || ''}
                      className="w-full glass border-white/5 rounded-[32px] pl-20 pr-8 py-6 opacity-20 cursor-not-allowed text-lg font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-16 border-t border-white/5">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neon-purple">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-display uppercase tracking-tighter">SECURITY PROTOCOL</h3>
                </div>
                <button type="button" className="btn-secondary px-12 py-5 micro-label">
                  Change Password
                </button>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-8 flex items-center justify-center gap-6"
              >
                <Save className="w-6 h-6" /> {loading ? 'Processing Identity...' : 'Update Identity'}
              </button>
            </form>
          </div>

          <div className="premium-card border-red-500/10 p-12 md:p-16 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-display text-red-500 uppercase tracking-tighter mb-4">DANGER ZONE</h3>
                <p className="micro-label text-white/20">Permanent account termination and asset removal</p>
              </div>
              <button className="px-12 py-5 rounded-[24px] border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all micro-label flex items-center gap-4 group/del">
                <Trash2 className="w-5 h-5 group-hover/del:rotate-12 transition-transform" />
                Delete Account
              </button>
            </div>
            {/* Subtle red glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
}
