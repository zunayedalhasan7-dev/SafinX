import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Monitor,
  MousePointer2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as ReBarChart,
  Bar
} from 'recharts';

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];

const categoryData = [
  { name: 'Templates', value: 400 },
  { name: 'Ebooks', value: 300 },
  { name: 'Software', value: 300 },
  { name: 'Courses', value: 200 },
];

const COLORS = ['#00f2ff', '#bc13fe', '#ffffff', '#333333'];

export default function AdminAnalytics() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Deep <span className="neon-text">Analytics</span></h1>
        <p className="text-white/40 text-sm font-medium">Advanced platform performance insights.</p>
      </header>

      {/* Main Revenue Chart */}
      <div className="premium-card p-10 h-[500px]">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-display uppercase tracking-tighter">Revenue Intelligence</h3>
            <p className="text-xs text-white/20 uppercase tracking-widest mt-1">Monthly platform earnings</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-neon-blue tracking-tighter">$124,500.00</p>
            <p className="text-[10px] font-black text-green-400 flex items-center justify-end gap-1">
              <TrendingUp className="w-3 h-3" /> +24.5% vs last month
            </p>
          </div>
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevDeep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.2}/>
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
              <Area type="monotone" dataKey="value" stroke="#00f2ff" strokeWidth={4} fillOpacity={1} fill="url(#colorRevDeep)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="premium-card p-10 h-[450px]">
          <h3 className="text-xl font-display uppercase tracking-tighter mb-10">Sales by Category</h3>
          <div className="h-[280px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 ml-10">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Device Usage */}
        <div className="premium-card p-10 h-[450px]">
          <h3 className="text-xl font-display uppercase tracking-tighter mb-10">Device Distribution</h3>
          <div className="space-y-8">
            {[
              { label: 'Desktop', value: 65, icon: <Monitor className="w-5 h-5" />, color: 'neon-blue' },
              { label: 'Mobile', value: 28, icon: <Smartphone className="w-5 h-5" />, color: 'neon-purple' },
              { label: 'Tablet', value: 7, icon: <Globe className="w-5 h-5" />, color: 'white' },
            ].map((device) => (
              <div key={device.label} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-white/20">{device.icon}</div>
                    <span className="text-xs font-bold uppercase tracking-widest">{device.label}</span>
                  </div>
                  <span className="text-xs font-black text-neon-blue">{device.value}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${device.value}%` }}
                    className={`h-full bg-${device.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
