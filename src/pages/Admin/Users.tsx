import { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  User, 
  Shield, 
  ShieldAlert, 
  Ban, 
  Trash2, 
  Mail,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${userId}`);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">User <span className="neon-text">Management</span></h1>
          <p className="text-white/40 text-sm font-medium">Control user access and permissions.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-neon-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass border-white/5 rounded-xl pl-12 pr-4 py-2.5 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all text-sm w-64"
            />
          </div>
          
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="glass border-white/5 rounded-xl px-4 py-2.5 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all text-sm micro-label text-white/40"
          >
            <option value="all">All Roles</option>
            <option value="buyer">Buyers</option>
            <option value="seller">Sellers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </header>

      <div className="premium-card p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 micro-label text-white/20">
              <tr>
                <th className="px-8 py-6">User</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Joined</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6"><div className="h-12 bg-white/5 rounded-xl" /></td>
                  </tr>
                ))
              ) : filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
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
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-transparent text-xs font-black uppercase tracking-widest text-white/60 focus:outline-none hover:text-neon-blue transition-colors cursor-pointer"
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[8px] font-black uppercase tracking-widest">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </td>
                  <td className="px-8 py-6 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'Recently'}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 glass rounded-lg text-white/20 hover:text-white transition-colors" title="View Profile">
                        <User className="w-4 h-4" />
                      </button>
                      <button className="p-2 glass rounded-lg text-white/20 hover:text-red-400 transition-colors" title="Ban User">
                        <Ban className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 glass rounded-lg text-white/20 hover:text-red-500 transition-colors" 
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-20">
            <User className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 font-medium">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
