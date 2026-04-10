import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Bell, Search, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-deep-bg text-white flex">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Sidebar - Mobile */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
        <div className={`absolute left-0 top-0 h-full w-72 transition-transform duration-500 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <AdminSidebar isCollapsed={false} setIsCollapsed={() => {}} />
        </div>
      </div>
      
      <main className={`flex-grow transition-all duration-500 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 sm:px-8 sticky top-0 bg-deep-bg/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4 flex-grow max-w-xl">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 glass rounded-xl text-white/40 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative w-full group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon-blue transition-colors" />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="w-full glass border-white/5 rounded-xl pl-12 pr-4 py-2.5 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-white/40 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-neon-blue rounded-full shadow-[0_0_10px_#00f2ff]"></span>
            </button>
            
            <div className="h-8 w-px bg-white/5"></div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold tracking-tight">{profile?.displayName || user?.displayName}</p>
                <p className="text-[10px] micro-label text-neon-blue">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl glass border border-white/10 p-1">
                <img 
                  src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                  alt="Admin" 
                  className="w-full h-full rounded-lg object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
