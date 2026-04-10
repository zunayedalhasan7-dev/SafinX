import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Database, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DUMMY_PRODUCTS = [
  {
    title: "Cyberpunk UI Kit Pro",
    description: "A comprehensive UI kit for futuristic interfaces. Includes 50+ components, 20+ screens, and full source files. Perfect for game devs and SaaS builders.",
    price: 49.99,
    category: "Templates",
    thumbnailUrl: "https://picsum.photos/seed/cyber/800/600",
    fileUrl: "https://example.com/files/cyber-ui-kit.zip",
    status: "approved",
    rating: 4.9,
    reviewCount: 128,
    salesCount: 450,
  },
  {
    title: "Mastering React 18",
    description: "Go from zero to hero with this deep dive into React 18. Covers hooks, suspense, concurrent mode, and advanced patterns. Includes 10 real-world projects.",
    price: 29.99,
    category: "Courses",
    thumbnailUrl: "https://picsum.photos/seed/react/800/600",
    fileUrl: "https://example.com/files/react-course.zip",
    status: "approved",
    rating: 5.0,
    reviewCount: 85,
    salesCount: 210,
  },
  {
    title: "Minimalist Icon Set",
    description: "1000+ high-quality minimalist icons for modern web and mobile apps. Available in SVG, PNG, and Figma formats. Fully customizable and scalable.",
    price: 19.99,
    category: "Design Assets",
    thumbnailUrl: "https://picsum.photos/seed/icons/800/600",
    fileUrl: "https://example.com/files/icons-set.zip",
    status: "approved",
    rating: 4.8,
    reviewCount: 240,
    salesCount: 1200,
  },
  {
    title: "SaaS Boilerplate (Next.js)",
    description: "Launch your SaaS in days, not months. Includes authentication, billing (Stripe), database setup, and a beautiful dashboard. Built with Next.js and Tailwind CSS.",
    price: 99.99,
    category: "Software",
    thumbnailUrl: "https://picsum.photos/seed/saas/800/600",
    fileUrl: "https://example.com/files/saas-boilerplate.zip",
    status: "approved",
    rating: 4.7,
    reviewCount: 56,
    salesCount: 89,
  },
  {
    title: "Digital Marketing Ebook",
    description: "The ultimate guide to growing your business online in 2024. Covers SEO, social media, email marketing, and paid ads. Written by industry experts.",
    price: 14.99,
    category: "Ebooks",
    thumbnailUrl: "https://picsum.photos/seed/marketing/800/600",
    fileUrl: "https://example.com/files/marketing-ebook.pdf",
    status: "approved",
    rating: 4.6,
    reviewCount: 312,
    salesCount: 1540,
  }
];

export default function SeedData() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const seedProducts = async () => {
    if (!user) {
      toast.error("You must be logged in as admin");
      return;
    }

    setLoading(true);
    try {
      for (const product of DUMMY_PRODUCTS) {
        await addDoc(collection(db, 'products'), {
          ...product,
          sellerId: user.uid,
          sellerName: profile?.displayName || "Admin",
          createdAt: serverTimestamp(),
        });
      }
      toast.success("Successfully added dummy products!");
      window.location.reload(); // Refresh to show new data
    } catch (err) {
      console.error("Error seeding products:", err);
      toast.error("Failed to seed products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-card p-8 border-white/5 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-neon-blue mb-6">
        <Database className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-display uppercase tracking-tighter mb-2">Development Tools</h3>
      <p className="text-white/40 text-sm mb-8 max-w-xs">Populate your marketplace with high-quality dummy products for testing.</p>
      
      <button 
        onClick={seedProducts}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-3 py-4"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
        {loading ? 'Seeding...' : 'Seed Dummy Products'}
      </button>
    </div>
  );
}
