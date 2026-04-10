import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion } from 'motion/react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Clock,
  UserPlus,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, users: 240 },
  { name: 'Tue', revenue: 3000, users: 139 },
  { name: 'Wed', revenue: 2000, users: 980 },
  { name: 'Thu', revenue: 2780, users: 390 },
  { name: 'Fri', revenue: 1890, users: 480 },
  { name: 'Sat', revenue: 2390, users: 380 },
  { name: 'Sun', revenue: 3490, users: 430 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // In a real app, these would be aggregated or fetched from a stats collection
      const usersSnap = await getDocs(collection(db, 'users'));
      const productsSnap = await getDocs(collection(db, 'products'));
      
      const sellers = usersSnap.docs.filter(doc => doc.data().role === 'seller' || doc.data().role === 'admin').length;
      
      setStats({
        totalUsers: usersSnap.size,
        totalSellers: sellers,
        totalProducts: productsSnap.size,
        totalOrders: 156, // Mock for now
        totalRevenue: 12450 // Mock for now
      });

      // Recent Users
      const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5));
      const recentUsersSnap = await getDocs(qUsers);
      setRecentUsers(recentUsersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Platform <span className="neon-text">Overview</span></h1>
        <p className="text-white/40 text-sm font-medium">Real-time performance metrics for SafinX.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign />, trend: '+12.5%', color: 'neon-blue' },
          { label: 'Active Users', value: stats.totalUsers, icon: <Users />, trend: '+5.2%', color: 'neon-purple' },
          { label: 'Total Products', value: stats.totalProducts, icon: <Package />, trend: '+8.1%', color: 'white' },
          { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingCart />, trend: '+2.4%', color: 'neon-blue' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-8 group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-white/20 group-hover:text-neon-blue transition-colors">
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-neon-blue bg-neon-blue/10 px-3 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> {stat.trend}
              </div>
            </div>
            <p className="micro-label text-white/20 mb-1">{stat.label}</p>
            <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 premium-card p-8 h-[450px]">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-display uppercase tracking-tighter">Revenue Growth</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 glass rounded-xl text-[10px] font-black uppercase tracking-widest text-neon-blue">Weekly</button>
              <button className="px-4 py-2 glass rounded-xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Monthly</button>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '20px', padding: '16px' }}
                  itemStyle={{ color: '#00f2ff', fontWeight: '900', fontSize: '14px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00f2ff" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="premium-card p-8 h-[450px]">
          <h3 className="text-xl font-display uppercase tracking-tighter mb-10">User Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#ffffff10" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '20px', padding: '16px' }}
                  cursor={{ fill: '#ffffff05' }}
                />
                <Bar dataKey="users" fill="#bc13fe" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="premium-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display uppercase tracking-tighter">New Registrations</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-neon-blue transition-colors">View All</button>
          </div>
          <div className="space-y-6">
            {recentUsers.map((user, i) => (
              <div key={user.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl glass border border-white/10 p-1">
                    <img 
                      src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                      className="w-full h-full rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">{user.displayName || 'Anonymous'}</p>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    user.role === 'seller' ? 'bg-neon-purple/10 text-neon-purple' : 'bg-neon-blue/10 text-neon-blue'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="premium-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display uppercase tracking-tighter">Recent Orders</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-neon-blue transition-colors">View All</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center text-white/20">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">Cyberpunk UI Kit</p>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">Order #ORD-772{i}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-neon-blue text-sm">$49.00</p>
                  <p className="text-[8px] text-white/20 uppercase tracking-widest">2 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
