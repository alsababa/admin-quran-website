"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    UserCog,
    Trash2,
    Shield,
    Mail,
    Calendar,
    ChevronDown,
    Filter,
    Edit3,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { supabase } from '@/lib/supabase';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch from Firebase
                const fbSnapshot = await getDocs(collection(db, "users"));
                const fbUsers = fbSnapshot.docs.map(doc => ({
                    id: `fb-${doc.id}`,
                    ...doc.data(),
                    source: 'firebase'
                }));

                // Fetch from Supabase
                let sbUsers = [];
                try {
                    const { data, error } = await supabase
                        .from('users')
                        .select('*');

                    if (data) {
                        sbUsers = data.map(user => ({
                            id: `sb-${user.id}`,
                            displayName: user.full_name || user.display_name || user.email?.split('@')[0],
                            email: user.email,
                            subscriptionStatus: user.subscription_status || 'inactive',
                            createdAt: user.created_at ? { seconds: Math.floor(new Date(user.created_at).getTime() / 1000) } : null,
                            source: 'supabase',
                            raw: user
                        }));
                    }
                } catch (sbErr) {
                    console.warn("Supabase fetch error:", sbErr);
                }

                setUsers([...fbUsers, ...sbUsers]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="text-right">
                    <h3 className="text-4xl font-black text-white tracking-tighter">قائمة المستخدمين</h3>
                    <p className="text-[#8FB394]/40 font-bold text-sm mt-2">إدارة والتحكم في حسابات المستخدمين المسجلين في النظام.</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8FB394]/30 group-focus-within:text-[#8FB394] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="ابحث عن مستخدم..."
                            className="w-full h-14 glass-input rounded-2xl pr-14 pl-6 text-sm font-medium text-white placeholder:text-[#8FB394]/20 focus:border-[#8FB394]/40 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="h-14 px-6 glass-panel border-[#8FB394]/10 rounded-2xl text-[#8FB394]/60 hover:text-[#8FB394] flex items-center gap-3 transition-all">
                        <Filter size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">تصفية</span>
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="glass-panel rounded-[2.5rem] overflow-hidden border-[#8FB394]/10 shadow-3xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-[#8FB394]/5 bg-[#8FB394]/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#8FB394]/50">المستخدم</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#8FB394]/50 text-center">الحالة</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#8FB394]/50">تاريخ التسجيل</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#8FB394]/50 text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#8FB394]/5">
                            <AnimatePresence>
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-8 py-6"><div className="h-10 w-48 bg-[#4A6351]/10 rounded-xl" /></td>
                                            <td className="px-8 py-6"><div className="h-8 w-24 bg-[#4A6351]/10 rounded-full mx-auto" /></td>
                                            <td className="px-8 py-6"><div className="h-6 w-32 bg-[#4A6351]/10 rounded-lg" /></td>
                                            <td className="px-8 py-6"><div className="h-10 w-32 bg-[#4A6351]/10 rounded-xl mr-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredUsers.map((user, idx) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group hover:bg-[#8FB394]/5 transition-colors"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#8FB394]/20 to-[#4A6351]/20 p-[1px]">
                                                    <div className="h-full w-full rounded-2xl bg-[#0D1510] flex items-center justify-center font-black text-[#8FB394] text-sm">
                                                        {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-extrabold text-white text-sm truncate">{user.displayName || 'مستخدم جديد'}</p>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <Mail size={12} className="text-[#8FB394]/30" />
                                                        <p className="text-[10px] font-bold text-[#8FB394]/40 truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest
                                                    ${user.subscriptionStatus === 'active'
                                                        ? 'bg-[#8FB394]/10 border-[#8FB394]/20 text-[#8FB394]'
                                                        : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${user.subscriptionStatus === 'active' ? 'bg-[#8FB394]' : 'bg-rose-500'}`} />
                                                    {user.subscriptionStatus === 'active' ? 'مشترك' : 'موقوف'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <p className="text-xs font-bold text-[#F5F2ED]/60">{user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير متوفر'}</p>
                                                <Calendar size={14} className="text-[#8FB394]/20" />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-start gap-2">
                                                <button className="p-3 bg-white/5 border border-white/5 rounded-xl text-[#F5F2ED]/40 hover:text-white hover:bg-[#8FB394]/20 hover:border-[#8FB394]/30 transition-all">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button className="p-3 bg-white/5 border border-white/5 rounded-xl text-[#F5F2ED]/40 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="h-10 px-4 bg-[#8FB394]/10 border border-[#8FB394]/20 rounded-xl text-[#8FB394] hover:bg-[#8FB394] hover:text-[#0D1510] font-black text-[10px] transition-all flex items-center gap-2">
                                                    <Shield size={14} strokeWidth={2.5} />
                                                    <span>ترقية</span>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="px-10 py-8 bg-[#8FB394]/5 border-t border-[#8FB394]/5 flex justify-between items-center text-right">
                    <p className="text-[10px] font-black text-[#8FB394]/40 uppercase tracking-widest leading-none">
                        عرض {filteredUsers.length} من أصل {users.length} مستخدم نشط في النظام
                    </p>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white/5 border border-white/5 rounded-lg text-[#F5F2ED]/40 hover:text-[#8FB394] transition-all rotate-180"><ChevronDown size={14} /></button>
                        <button className="p-2 bg-white/10 border border-[#8FB394]/20 rounded-lg text-[#8FB394] text-[10px] font-black px-4">1</button>
                        <button className="p-2 bg-white/5 border border-white/5 rounded-lg text-[#F5F2ED]/40 hover:text-[#8FB394] transition-all"><ChevronDown size={14} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
