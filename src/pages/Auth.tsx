import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { AlertCircle, ArrowLeft, Shield, Lock, User, Mail, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!isLogin && !name) {
      setError('Please enter your full name');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back to SafinX!');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const isAdminEmail = email === 'xpzunayed@gmail.com';
        const targetRole = isAdminEmail ? 'admin' : 'buyer';
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email,
          displayName: name,
          role: targetRole,
          createdAt: serverTimestamp(),
        });
        toast.success('Account created successfully!');
      }
      navigate('/');
    } catch (err: any) {
      let message = 'An unexpected error occurred';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password is too weak';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later';
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerType: 'google') => {
    setLoading(true);
    setError('');
    try {
      let provider;
      if (providerType === 'google') provider = new GoogleAuthProvider();
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
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message);
        toast.error('Social login failed');
      }
    } finally {
      setLoading(false);
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
        <div className="text-center mb-6 md:mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4 md:mb-6 group">
            <img 
              src="https://i.postimg.cc/hPTW2zTw/Blue-and-White-Modern-Online-Shop-Logo.png"
              alt="SafinX Logo"
              className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
            <span className="text-xl md:text-2xl font-display tracking-tighter text-white uppercase leading-none mt-1">SafinX</span>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tighter mb-2 leading-none">
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
                    required={!isLogin}
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
              className="btn-primary w-full py-4 mt-2 text-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                isLogin ? 'Authorize' : 'Create Account'
              )}
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

          <div className="flex justify-center">
            <button 
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="glass px-8 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all group w-full disabled:opacity-50"
              title="Google"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span className="text-xs font-bold uppercase tracking-widest">Continue with Google</span>
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
