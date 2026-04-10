import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  BarChart3,
  FileText,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function AdminSidebar({ isCollapsed, setIsCollapsed }: AdminSidebarProps) {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard />, label: 'Overview' },
    { path: '/admin/users', icon: <Users />, label: 'Users' },
    { path: '/admin/products', icon: <Package />, label: 'Products' },
    { path: '/admin/orders', icon: <ShoppingCart />, label: 'Orders' },
    { path: '/admin/payments', icon: <DollarSign />, label: 'Payments' },
    { path: '/admin/reviews', icon: <MessageSquare />, label: 'Reviews' },
    { path: '/admin/analytics', icon: <BarChart3 />, label: 'Analytics' },
    { path: '/admin/settings', icon: <Settings />, label: 'Settings' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen glass border-r border-white/5 z-50 transition-all duration-500 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-display text-black text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]">S</div>
            <span className="text-xl font-display tracking-tighter uppercase">SafinX <span className="text-[10px] text-neon-blue ml-1">Admin</span></span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-display text-black text-lg mx-auto">S</div>
        )}
      </div>

      <nav className="flex-grow px-4 space-y-2 mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
              location.pathname === item.path 
              ? 'bg-white/10 text-white border border-white/10' 
              : 'text-white/40 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className={`${location.pathname === item.path ? 'text-neon-blue' : 'group-hover:text-white'} transition-colors`}>
              {item.icon}
            </span>
            {!isCollapsed && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
            
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-black border border-white/10 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all mb-2"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        <Link 
          to="/"
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-bold text-sm tracking-tight">Exit Admin</span>}
        </Link>
      </div>
    </aside>
  );
}
