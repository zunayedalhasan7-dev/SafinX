import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Wishlist() {
  // Mock wishlist for now
  const wishlistItems: any[] = [];

  return (
    <div className="max-w-7xl mx-auto px-6 pb-32">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-4">My <span className="neon-text">Wishlist</span></h1>
        <p className="text-white/40">Products you've saved for later.</p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Wishlist items would go here */}
        </div>
      ) : (
        <div className="text-center py-32 glass rounded-[40px]">
          <Heart className="w-12 h-12 text-white/10 mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-2">Your wishlist is empty</h3>
          <p className="text-white/40 mb-8">Save products you're interested in to see them here.</p>
          <Link to="/marketplace" className="btn-primary">Explore Marketplace</Link>
        </div>
      )}
    </div>
  );
}
