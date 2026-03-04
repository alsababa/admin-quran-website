"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    UserCog,
    Trash2,
    Mail,
    ShieldCheck,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

const UserRow = ({ user, index }) => (
    <motion.tr
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="hover:bg-slate-800/30 transition-all border-b border-slate-800/40 group text-right"
    >
        <td className="px-6 py-5">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/10 flex items-center justify-center font-bold text-blue-400 shadow-inner group-hover:scale-110 transition-transform">
                    {user.fullName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                    <p className="font-bold text-slate-100">{user.fullName || 'بدون اسم'}</p>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
                        <Mail size={12} />
                        <span>{user.email}</span>
                    </div>
                </div>
            </div>
        </td>
        <td className="px-6 py-5">
            <span className={`px-3 py-1.5 rounded-xl text-[10px] uppercase font-black tracking-widest border ${user.subscriptionTier === 'premium'
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]'
                    : 'bg-slate-800/50 text-slate-500 border-slate-700/50'
                }`}>
                {user.subscriptionTier === 'premium' ? 'مميز' : 'مجاني'}
            </span>
        </td>
        <td className="px-6 py-5">
            <div className={`flex items-center gap-2 text-xs font-bold ${user.subscriptionStatus === 'active' ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                {user.subscriptionStatus === 'active' ? (
                    <>
                        <CheckCircle2 size={14} />
                        <span>نشط حالياً</span>
                    </>
                ) : (
                    <>
                        <XCircle size={14} />
                        <span>غير نشط</span>
                    </>
                )}
            </div>
        </td>
        <td className="px-6 py-5 text-left">
            <div className="flex items-center justify-end gap-2">
                <button className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-400 transition-all" title="إدارة المستخدم">
                    <UserCog size={18} />
                </button>
                <button className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
                    <MoreVertical size={18} />
                </button>
            </div>
        </td>
    </motion.tr>
);

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const q = query(collection(db, "users"));
                const querySnapshot = await getDocs(q);
                const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header Content */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-8 rounded-[2.5rem]">
                <div className="text-right">
                    <h3 className="text-3xl font-black tracking-tight text-white mb-2">إدارة المستخدمين</h3>
                    <p className="text-slate-500 text-sm font-medium">مراقبة وتحليل نشاط المستخدمين في التطبيق.</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-blue-500" size={18} />
                        <input
                            type="text"
                            placeholder="ابحث بالاسم أو البريد..."
                            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl pr-12 pl-4 py-3 text-sm text-white w-full lg:w-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-slate-400 hover:text-blue-400 transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                        <thead className="bg-slate-800/30 border-b border-slate-800/40 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                            <tr>
                                <th className="px-6 py-6">المستخدم</th>
                                <th className="px-6 py-6">فئة الاشتراك</th>
                                <th className="px-6 py-6">حالة الحساب</th>
                                <th className="px-6 py-6 text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <span className="text-slate-500 font-bold">جاري تحميل البيانات...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20 capitalize">
                                            <Users size={60} />
                                            <span className="text-xl font-bold">لا يوجد مستخدمين</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, idx) => (
                                    <UserRow key={user.id} user={user} index={idx} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
