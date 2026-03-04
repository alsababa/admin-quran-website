"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    Video,
    Activity,
    Plus,
    MessageSquare,
    FileText
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import Link from 'next/link';

const StatCard = ({ title, value, icon, subtitle, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 blur-[60px] rounded-full group-hover:bg-${color}-500/10 transition-all duration-700`} />

        <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl bg-${color}-500/10 border border-${color}-500/10 text-${color}-500`}>
                {icon}
            </div>
            <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg text-xs font-bold">
                <ArrowUpRight size={14} />
                <span>+12%</span>
            </div>
        </div>

        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-4xl font-black text-white tracking-tight">{value}</h3>
        </div>
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <Activity size={12} className="text-blue-500" />
            {subtitle}
        </p>
    </motion.div>
);

const QuickAction = ({ to, label, description, icon, delay }) => (
    <Link href={to}>
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay }}
            className="p-5 bg-slate-900/30 border border-slate-800/40 rounded-2xl hover:border-blue-500/40 hover:bg-blue-600/5 transition-all group relative cursor-pointer"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-800/50 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
                    {icon}
                </div>
                <div>
                    <span className="font-bold text-sm text-slate-200 group-hover:text-blue-400 transition-colors">{label}</span>
                    <p className="text-xs text-slate-500 mt-1">{description}</p>
                </div>
                <ArrowUpRight size={16} className="absolute top-4 left-4 text-slate-700 group-hover:text-blue-500 transition-all" />
            </div>
        </motion.div>
    </Link>
);

export default function Overview() {
    const [stats, setStats] = useState({ totalUsers: 0, activeSubs: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const usersSnap = await getDocs(collection(db, "users"));
                const total = usersSnap.size;

                const subsSnap = await getDocs(query(collection(db, "users"), where("subscriptionStatus", "==", "active")));
                const active = subsSnap.size;

                setStats({
                    totalUsers: total,
                    activeSubs: active,
                    revenue: active * 10
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <StatCard
                    title="إجمالي المستخدمين"
                    value={loading ? '...' : stats.totalUsers}
                    subtitle="نمو مستمر في الحسابات"
                    icon={<Users size={24} />}
                    color="blue"
                    delay={0.1}
                />
                <StatCard
                    title="الاشتراكات النشطة"
                    value={loading ? '...' : stats.activeSubs}
                    subtitle="الوصول إلى المحتوى المميز"
                    icon={<CreditCard size={24} />}
                    color="indigo"
                    delay={0.2}
                />
                <StatCard
                    title="الإيرادات الشهرية"
                    value={loading ? '...' : `${stats.revenue} ريال`}
                    subtitle="تقديرات الشهر الحالي"
                    icon={<TrendingUp size={24} />}
                    color="emerald"
                    delay={0.3}
                />
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions Container */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-[2.5rem] p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xl text-white flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                إجراءات سريعة
                            </h4>
                            <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">عرض الكل</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <QuickAction
                                to="/dashboard/videos"
                                label="رفع فيديو جديد"
                                description="إضافة محتوى تعليمي جديد"
                                icon={<Plus size={20} />}
                                delay={0.4}
                            />
                            <QuickAction
                                to="/dashboard/users"
                                label="إدارة الحسابات"
                                description="التحقق من بيانات المستخدمين"
                                icon={<Users size={20} />}
                                delay={0.5}
                            />
                            <QuickAction
                                to="/dashboard/subscriptions"
                                label="تحديث الخطط"
                                description="إدارة الوصول اليدوي للمميز"
                                icon={<FileText size={20} />}
                                delay={0.6}
                            />
                            <QuickAction
                                to="/dashboard/users"
                                label="رسائل الدعم"
                                description="مساعدة المستخدمين في المشاكل"
                                icon={<MessageSquare size={20} />}
                                delay={0.7}
                            />
                        </div>
                    </div>
                </div>

                {/* Side Content / Recent Activity */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 backdrop-blur-md border border-blue-500/10 rounded-[2rem] p-8 flex flex-col justify-center text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400">
                            <Video size={32} />
                        </div>
                        <h5 className="font-bold text-lg text-white mb-2">تحديثات المحتوى</h5>
                        <p className="text-sm text-slate-400 mb-6">احرص على رفع الفيديوهات بانتظام للحفاظ على نشاط المستخدمين</p>
                        <Link href="/dashboard/videos">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                                انتقل للمحتوى
                            </button>
                        </Link>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-[2rem] p-8">
                        <h5 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-emerald-500" />
                            حالة النظام
                        </h5>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">خادم البيانات</span>
                                <span className="text-emerald-400 font-medium">مستقر</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '98%' }}
                                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
