"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Filter,
    ArrowUpRight,
    Search
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';

const StatCard = ({ icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-6 rounded-[2rem] flex items-center gap-6 group hover:border-blue-500/30 transition-all cursor-default"
    >
        <div className={`h-16 w-16 rounded-2xl bg-${color}-500/10 border border-${color}-500/10 flex items-center justify-center text-${color}-500 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{label}</p>
            <h4 className="text-3xl font-black mt-1 text-white tracking-tight">{value}</h4>
        </div>
    </motion.div>
);

export default function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ active: 0, pending: 0, totalRevenue: 0 });

    useEffect(() => {
        const fetchSubscriptions = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "users"), where("subscriptionTier", "==", "premium"));
                const querySnapshot = await getDocs(q);
                const subsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSubscriptions(subsData);

                const activeCount = subsData.filter(s => s.subscriptionStatus === 'active').length;
                setStats({
                    active: activeCount,
                    pending: subsData.length - activeCount,
                    totalRevenue: activeCount * 10
                });
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, []);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-8 rounded-[2.5rem]">
                <div className="text-right">
                    <h3 className="text-3xl font-black tracking-tight text-white mb-2">الاشتراكات والفوترة</h3>
                    <p className="text-slate-500 text-sm font-medium">إدارة الوصول المميز ومتابعة الإيرادات الشهرية.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        إدارة الخطط
                    </button>
                    <button className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-slate-400 hover:text-blue-400 transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard
                    icon={<TrendingUp size={28} />}
                    label="الإيرادات الشهرية"
                    value={`${stats.totalRevenue} ريال`}
                    color="emerald"
                    delay={0.1}
                />
                <StatCard
                    icon={<CheckCircle size={28} />}
                    label="الخطط النشطة"
                    value={stats.active}
                    color="blue"
                    delay={0.2}
                />
                <StatCard
                    icon={<AlertCircle size={28} />}
                    label="منتهية / معلقة"
                    value={stats.pending}
                    color="amber"
                    delay={0.3}
                />
            </div>

            {/* Premium Users Table */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-slate-800/40 flex justify-between items-center">
                    <h4 className="font-bold text-lg text-white flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                        المشتركين المميزين
                    </h4>
                    <Search size={18} className="text-slate-600" />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                        <thead className="bg-slate-800/30 border-b border-slate-800/40 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                            <tr>
                                <th className="px-8 py-6">المستخدم</th>
                                <th className="px-8 py-6">طريقة الدفع</th>
                                <th className="px-8 py-6">تاريخ الانتهاء</th>
                                <th className="px-8 py-6 text-left">التفاصيل</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {loading ? (
                                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-500">جاري تحميل البيانات...</td></tr>
                            ) : subscriptions.length === 0 ? (
                                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-500 italic">لا يوجد مشتركون حالياً</td></tr>
                            ) : (
                                subscriptions.map((user, idx) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-800/30 transition-all border-b border-slate-800/40 group"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="text-right">
                                                <p className="font-bold text-slate-100">{user.fullName || user.email}</p>
                                                <p className="text-xs text-slate-500 mt-1">{user.subscriptionProductId || 'غير متوفر'}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="inline-flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-700/50">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span className="text-xs font-medium text-slate-300">
                                                    {user.subscriptionPlatform === 'admin_manual' ? 'يدوي' : 'جوجل بلاي'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-mono text-slate-400 bg-slate-800/30 px-3 py-1 rounded-lg">
                                                {user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString('ar-SA') : 'وصول دائم'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-left">
                                            <button className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 justify-end w-full group transition-all">
                                                <span>عرض التفاصيل</span>
                                                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
