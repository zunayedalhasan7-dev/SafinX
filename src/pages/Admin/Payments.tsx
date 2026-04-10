import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  CreditCard,
  Wallet,
  Search,
  RefreshCcw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminPayments() {
  const [loading, setLoading] = useState(false);

  const stats = [
    { label: 'Total Volume', value: '$1.2M', icon: <DollarSign />, trend: '+15%', color: 'neon-blue' },
    { label: 'Platform Fees', value: '$180k', icon: <CreditCard />, trend: '+12%', color: 'neon-purple' },
    { label: 'Pending Payouts', value: '$45k', icon: <Clock />, trend: '-5%', color: 'white' },
    { label: 'Available Balance', value: '$12k', icon: <Wallet />, trend: '+2%', color: 'neon-blue' },
  ];

  const payouts = [
    { id: 'PAY-001', seller: 'Alex Rivera', amount: 1250.00, method: 'Stripe', status: 'pending', date: '2023-10-12' },
    { id: 'PAY-002', seller: 'Sarah Chen', amount: 890.00, method: 'PayPal', status: 'completed', date: '2023-10-11' },
    { id: 'PAY-003', seller: 'Marcus Thorne', amount: 3400.00, method: 'Bank Transfer', status: 'failed', date: '2023-10-10' },
  ];

  const handlePayoutAction = (id: string, action: string) => {
    toast.success(`Payout ${id} ${action}`);
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Financial <span className="neon-text">Control</span></h1>
        <p className="text-white/40 text-sm font-medium">Manage payouts, fees, and platform revenue.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
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
              <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full ${
                stat.trend.startsWith('+') ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
              }`}>
                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="micro-label text-white/20 mb-1">{stat.label}</p>
            <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="premium-card p-0 overflow-hidden border-white/5">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-display uppercase tracking-tighter">Withdrawal Requests</h3>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search payouts..." 
              className="glass border-white/5 rounded-xl pl-12 pr-4 py-2 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all text-xs w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 micro-label text-white/20">
              <tr>
                <th className="px-8 py-6">Payout ID</th>
                <th className="px-8 py-6">Seller</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Method</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payouts.map(payout => (
                <tr key={payout.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-neon-blue transition-colors">#{payout.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-sm tracking-tight">{payout.seller}</p>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">{payout.date}</p>
                  </td>
                  <td className="px-8 py-6 font-black text-lg tracking-tighter text-neon-blue">
                    ${payout.amount.toFixed(2)}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{payout.method}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      payout.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                      payout.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {payout.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : 
                       payout.status === 'pending' ? <Clock className="w-3 h-3" /> : 
                       <XCircle className="w-3 h-3" />}
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {payout.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handlePayoutAction(payout.id, 'approved')}
                            className="p-2 glass rounded-lg text-green-400/40 hover:text-green-400 transition-colors" 
                            title="Approve Payout"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handlePayoutAction(payout.id, 'rejected')}
                            className="p-2 glass rounded-lg text-red-400/40 hover:text-red-400 transition-colors" 
                            title="Reject Payout"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {payout.status === 'failed' && (
                        <button 
                          onClick={() => handlePayoutAction(payout.id, 'retried')}
                          className="p-2 glass rounded-lg text-white/20 hover:text-white transition-colors" 
                          title="Retry Payout"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
