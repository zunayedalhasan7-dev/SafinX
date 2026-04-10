import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, TwitterAuthProvider, GithubAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Github, AlertCircle, ArrowLeft, Shield, Lock, User, Mail, Sparkles, Twitter } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email,
          displayName: name,
          role: 'buyer',
          createdAt: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerType: 'google' | 'twitter' | 'github') => {
    try {
      let provider;
      if (providerType === 'google') provider = new GoogleAuthProvider();
      else if (providerType === 'twitter') provider = new TwitterAuthProvider();
      else if (providerType === 'github') provider = new GithubAuthProvider();
      else return;

      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: 'buyer',
          createdAt: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden py-12">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-display text-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:rotate-12 transition-transform">S</div>
            <span className="text-2xl font-display tracking-tighter uppercase">SafinX</span>
          </Link>
          
          <h1 className="text-4xl font-display uppercase tracking-tighter mb-2 leading-none">
            {isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
          </h1>
          <p className="micro-label text-[8px]">
            {isLogin ? 'Access your digital empire' : 'Start your journey today'}
          </p>
        </div>

        <div className="premium-card p-6 md:p-10 border-white/10">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-3"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="micro-label ml-2 text-[8px]">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon-blue transition-colors" />
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass border-white/5 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-neon-blue/30 focus:bg-white/[0.05] transition-all placeholder:text-white/10 text-sm"
                    required
                  />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="micro-label ml-2 text-[8px]">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon-blue transition-colors" />
                <input 
                  type="email" 
                  placeholder="name@empire.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass border-white/5 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-neon-blue/30 focus:bg-white/[0.05] transition-all placeholder:text-white/10 text-sm"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-2">
                <label className="micro-label text-[8px]">Password</label>
                {isLogin && (
                  <button type="button" className="text-[8px] text-white/20 hover:text-white transition-colors uppercase font-black tracking-widest">Forgot?</button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon-blue transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass border-white/5 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-neon-blue/30 focus:bg-white/[0.05] transition-all placeholder:text-white/10 text-sm"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 mt-2 text-xs"
            >
              {loading ? 'Processing...' : isLogin ? 'Authorize' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-deep-bg px-4 micro-label text-[8px]">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="glass p-3 rounded-xl flex items-center justify-center hover:bg-white/5 transition-all group"
              title="Google"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            </button>
            <button 
              onClick={() => handleSocialLogin('twitter')}
              className="glass p-3 rounded-xl flex items-center justify-center hover:bg-white/5 transition-all group"
              title="Twitter (X)"
            >
              <Twitter className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              className="glass p-3 rounded-xl flex items-center justify-center hover:bg-white/5 transition-all group"
              title="GitHub"
            >
              <Github className="w-5 h-5 text-white" />
            </button>
          </div>

          <p className="text-center mt-8 micro-label text-[8px]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-white hover:neon-text transition-all font-black ml-2 underline underline-offset-4"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
