import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Globe, 
  Shield, 
  CreditCard, 
  Mail, 
  Bell, 
  Save, 
  RefreshCcw,
  Percent,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'SafinX',
    siteEmail: 'admin@safinx.com',
    commissionRate: 15,
    stripePublicKey: 'pk_test_********************',
    stripeSecretKey: 'sk_test_********************',
    enableRegistration: true,
    enableSellerApproval: true,
    maintenanceMode: false
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Platform settings updated successfully');
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Platform <span className="neon-text">Settings</span></h1>
        <p className="text-white/40 text-sm font-medium">Configure global marketplace parameters.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                activeTab === tab.id 
                ? 'bg-white/10 text-white border border-white/10 shadow-lg' 
                : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`${activeTab === tab.id ? 'text-neon-blue' : 'group-hover:text-white'} transition-colors`}>
                {tab.icon}
              </span>
              <span className="font-bold text-sm tracking-tight">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Form */}
        <div className="flex-grow">
          <form onSubmit={handleSave} className="premium-card p-10 space-y-10">
            {activeTab === 'general' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="micro-label ml-2">Site Name</label>
                    <input 
                      type="text" 
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="w-full glass border-white/5 rounded-xl px-6 py-4 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="micro-label ml-2">Admin Email</label>
                    <input 
                      type="email" 
                      value={settings.siteEmail}
                      onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
                      className="w-full glass border-white/5 rounded-xl px-6 py-4 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="micro-label ml-2">Platform Commission (%)</label>
                  <div className="relative group">
                    <Percent className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon-blue transition-colors" />
                    <input 
                      type="number" 
                      value={settings.commissionRate}
                      onChange={(e) => setSettings({...settings, commissionRate: parseInt(e.target.value)})}
                      className="w-full glass border-white/5 rounded-xl pl-14 pr-6 py-4 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-white/20 ml-2 italic">Percentage taken from each sale on the marketplace.</p>
                </div>

                <div className="pt-6 space-y-6">
                  <div className="flex items-center justify-between p-6 glass rounded-2xl border-white/5">
                    <div>
                      <p className="font-bold text-sm">Maintenance Mode</p>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest">Disable public access to the store</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-red-500' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'payments' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <label className="micro-label ml-2">Stripe Public Key</label>
                  <input 
                    type="text" 
                    value={settings.stripePublicKey}
                    className="w-full glass border-white/5 rounded-xl px-6 py-4 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all font-mono text-xs text-white/60"
                  />
                </div>
                <div className="space-y-3">
                  <label className="micro-label ml-2">Stripe Secret Key</label>
                  <div className="relative">
                    <input 
                      type={showKey ? "text" : "password"} 
                      value={settings.stripeSecretKey}
                      className="w-full glass border-white/5 rounded-xl px-6 py-4 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all font-mono text-xs text-white/60"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="pt-10 border-t border-white/5 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-3 px-12"
              >
                {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
