"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { ref, onValue, update } from 'firebase/database';
import { Users, BarChart, DollarSign, Activity, Search, Edit3, Save, X } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalGenerations: 0, totalRevenue: 0 });
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ plan: 'FREE', credits: 0 });

  useEffect(() => {
    if (!user) return;

    // Fetch Global Stats
    const statsRef = ref(db, 'analytics/global');
    onValue(statsRef, (snapshot) => {
      if (snapshot.exists()) setStats(snapshot.val());
    });

    // Fetch Users List
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUsers(Object.entries(data).map(([uid, val]) => ({ uid, ...val })));
      }
    });
  }, [user]);

  const handleUpdateUser = async (uid) => {
    try {
      await update(ref(db, `users/${uid}`), editForm);
      setEditingUser(null);
      alert('User updated successfully');
    } catch (err) {
      alert('Failed to update user');
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Admin...</div>;
  if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-bold text-2xl">Access Denied</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-md px-10 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black">I</div>
          <span className="font-bold tracking-tight text-xl">Infonana <span className="text-indigo-400">Admin</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">Welcome, {user.email}</span>
        </div>
      </header>

      <main className="p-10 max-w-7xl mx-auto w-full">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'text-blue-400' },
            { label: 'Total Generations', value: stats.totalGenerations || 0, icon: Activity, color: 'text-indigo-400' },
            { label: 'Revenue Est.', value: `$${stats.totalRevenue || 0}`, icon: DollarSign, color: 'text-emerald-400' }
          ].map((card, i) => (
            <div key={i} className="bg-slate-900 border border-white/5 p-6 rounded-3xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{card.label}</span>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="text-4xl font-black">{card.value}</div>
            </div>
          ))}
        </div>

        {/* User Table */}
        <section className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold">User Management</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users..."
                className="bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Credits</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.uid} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{u.email}</div>
                      <div className="text-[10px] font-mono text-slate-600">{u.uid}</div>
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === u.uid ? (
                        <select
                          className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs"
                          value={editForm.plan}
                          onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                        >
                          <option value="FREE">FREE</option>
                          <option value="PRO">PRO</option>
                          <option value="ENTERPRISE">ENTERPRISE</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.plan === 'PRO' ? 'bg-indigo-500/10 text-indigo-400' :
                            u.plan === 'ENTERPRISE' ? 'bg-emerald-500/10 text-emerald-400' :
                              'bg-slate-800 text-slate-400'
                          }`}>
                          {u.plan}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === u.uid ? (
                        <input
                          type="number"
                          className="bg-slate-800 border border-white/10 rounded w-20 px-2 py-1 text-xs"
                          value={editForm.credits}
                          onChange={(e) => setEditForm({ ...editForm, credits: parseInt(e.target.value) })}
                        />
                      ) : (
                        <span className="text-sm font-mono">{u.credits}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingUser === u.uid ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleUpdateUser(u.uid)} className="p-2 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingUser(u.uid);
                            setEditForm({ plan: u.plan, credits: u.credits });
                          }}
                          className="p-2 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
