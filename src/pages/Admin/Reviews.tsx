import { useState, useEffect } from 'react';
import { collection, query, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Trash2, 
  Star, 
  User, 
  Package,
  Search,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Mocking for now as reviews might not be in a separate collection yet
      setReviews([
        { id: '1', productTitle: 'Cyberpunk UI Kit', userName: 'Alex Rivera', rating: 5, comment: 'Absolutely stunning design! Saved me weeks of work.', createdAt: new Date() },
        { id: '2', productTitle: 'SaaS Dashboard', userName: 'Sarah Chen', rating: 2, comment: 'The code is a bit messy and hard to customize.', createdAt: new Date() },
        { id: '3', productTitle: 'E-book: Digital Empire', userName: 'Marcus Thorne', rating: 4, comment: 'Great insights, though some parts felt a bit repetitive.', createdAt: new Date() },
      ]);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    toast.success('Review deleted');
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Review <span className="neon-text">Moderation</span></h1>
          <p className="text-white/40 text-sm font-medium">Manage platform feedback and ratings.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon-blue transition-colors" />
          <input 
            type="text" 
            placeholder="Search reviews..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass border-white/5 rounded-xl pl-12 pr-4 py-2.5 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all text-sm w-64"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {reviews.map((review) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card p-8 group"
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center text-white/20 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-lg tracking-tight">{review.userName}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < review.rating ? 'fill-neon-blue text-neon-blue' : 'text-white/10'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Package className="w-3 h-3" /> {review.productTitle}
                  </p>
                  <p className="text-white/60 leading-relaxed italic">"{review.comment}"</p>
                </div>
              </div>
              
              <div className="flex items-start justify-end gap-3">
                <button 
                  onClick={() => handleDeleteReview(review.id)}
                  className="p-3 glass rounded-xl text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  title="Delete Review"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
