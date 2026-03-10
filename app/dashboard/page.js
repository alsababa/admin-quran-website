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
    FileText,
    ArrowLeft
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const StatCard = ({ title, value, icon, subtitle, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-[2rem] p-7 ring-1 ring-[#8FB394]/10 relative overflow-hidden group shadow-2xl"
    >
        {/* Decorative Background Element */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-[#8FB394]/5 blur-3xl rounded-full group-hover:bg-[#8FB394]/10 transition-all duration-700`} />

        <div className="flex justify-between items-center mb-6">
            <div className={`h-12 w-12 rounded-2xl bg-[#8FB394]/10 flex items-center justify-center text-[#8FB394] ring-1 ring-[#8FB394]/20`}>
                {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8FB394]/5 rounded-full border border-[#8FB394]/10 text-[10px] font-black text-[#8FB394]">
                <ArrowUpRight size={12} strokeWidth={3} />
                <span>+12%</span>
            </div>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#8FB394]/40">{title}</p>
        <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
        </div>
        <p className="mt-4 text-[10px] font-bold text-[#8FB394]/30 flex items-center gap-1.5 opacity-60">
            <span className={`w-1.5 h-1.5 rounded-full bg-[#8FB394]`} />
            {subtitle}
        </p>
    </motion.div>
);

const QuickActionCard = ({ to, label, description, icon, delay }) => (
    <Link href={to}>
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="group glass-card rounded-3xl p-6 ring-1 ring-white/5 hover:bg-[#8FB394]/10 relative overflow-hidden flex flex-col items-center text-center cursor-pointer"
        >
            <div className="h-14 w-14 rounded-2xl bg-[#0D1510] flex items-center justify-center text-[#8FB394]/40 group-hover:text-[#8FB394] group-hover:bg-[#8FB394]/20 border border-[#8FB394]/10 transition-all mb-4 group-hover:scale-110">
                {React.cloneElement(icon, { size: 28, strokeWidth: 2 })}
            </div>
            <span className="font-extrabold text-sm text-[#F5F2ED]/80 group-hover:text-[#8FB394] transition-colors">{label}</span>
            <p className="text-[10px] font-bold text-[#8FB394]/30 mt-2 leading-relaxed">{description}</p>
            <ArrowLeft size={14} className="absolute top-6 left-6 text-[#8FB394]/20 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </motion.div>
    </Link>
);


export default function Overview() {
    const { stats, loading } = useDashboardStats();

    return (
        <div className="space-y-12 pb-20">
            {/* Elegant Header with Greeting */}
            <div className="flex justify-between items-end">
                <div className="text-right">
                    <h3 className="text-4xl font-black text-white tracking-tighter">نظرة سريعة</h3>
                    <p className="text-[#8FB394]/40 font-bold text-sm mt-2">إليك ملخص شامل لنشاط المنصة اليوم بناءً على الهوية البصرية.</p>
                </div>
                <div className="flex gap-4">
                    <button className="h-12 px-6 bg-[#0D1510] border border-[#8FB394]/20 rounded-2xl font-bold text-xs text-[#8FB394]/60 hover:text-white transition-all">تصدير التقرير</button>
                    <Link href="/dashboard/videos">
                        <button className="h-12 px-8 bg-[#8FB394] hover:bg-[#4A6351] text-[#0D1510] font-black rounded-2xl shadow-xl shadow-[#8FB394]/20 active:scale-95 text-xs transition-all flex items-center gap-2">
                            <Plus size={16} strokeWidth={3} />
                            إضافة محتوى
                        </button>
                    </Link>
                </div>
            </div>

            {/* Brand Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <StatCard
                    title="الجمهور النشط"
                    value={loading ? '...' : stats.totalUsers}
                    subtitle="نمو إيجابي بنسبة 4% هذا الأسبوع"
                    icon={<Users />}
                    delay={0.1}
                />
                <StatCard
                    title="الاشتراكات الفعالة"
                    value={loading ? '...' : stats.activeSubs}
                    subtitle="معدل استبقاء مرتفع بحوالي 92%"
                    icon={<CreditCard />}
                    delay={0.2}
                />
                <StatCard
                    title="العوائد المقدرة"
                    value={loading ? '...' : `${stats.revenue} ريال`}
                    subtitle="زيادة مطردة في المبيعات"
                    icon={<TrendingUp />}
                    delay={0.3}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Advanced Quick Actions */}
                <div className="xl:col-span-8 space-y-8">
                    <div className="glass-panel rounded-[3rem] p-10 ring-1 ring-white/5 space-y-10">
                        <div className="flex items-center justify-between">
                            <h4 className="font-black text-xl text-white flex items-center gap-4">
                                <div className="w-1.5 h-7 bg-[#8FB394] rounded-full shadow-[0_0_10px_rgba(143,179,148,0.5)]" />
                                مركز التحكم السريع
                            </h4>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#8FB394]/40" />
                                <div className="w-2 h-2 rounded-full bg-[#8FB394]/20" />
                                <div className="w-2 h-2 rounded-full bg-[#8FB394]/10" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <QuickActionCard
                                to="/dashboard/videos"
                                label="رفع فيديو"
                                description="إضافة دروس لغة إشارة"
                                icon={<Plus />}
                                delay={0.4}
                            />
                            <QuickActionCard
                                to="/dashboard/users"
                                label="المستخدمين"
                                description="تحكم كامل بالحسابات"
                                icon={<Users />}
                                delay={0.5}
                            />
                            <QuickActionCard
                                to="/dashboard/subscriptions"
                                label="الاشتراكات"
                                description="إدارة الفوترة والخطط"
                                icon={<FileText />}
                                delay={0.6}
                            />
                            <QuickActionCard
                                to="/dashboard/users"
                                label="الدعم الفني"
                                description="الرد على الطلبات"
                                icon={<MessageSquare />}
                                delay={0.7}
                            />
                        </div>
                    </div>

                    <div className="glass-panel rounded-[3rem] p-10 overflow-hidden relative min-h-[300px] flex items-center justify-center text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#8FB394]/5 via-transparent to-[#4A6351]/5" />
                        <div className="z-10 max-w-lg space-y-4">
                            <div className="w-20 h-20 bg-[#8FB394]/10 rounded-[2rem] flex items-center justify-center text-[#8FB394] mx-auto border border-[#8FB394]/20 mb-6">
                                <Activity size={40} />
                            </div>
                            <h5 className="text-2xl font-black text-white">رؤية المحتوى المستقبلية</h5>
                            <p className="text-[#8FB394]/40 font-bold text-sm leading-relaxed px-10">سيتم قريباً توفير تحليلات تفصيلية عن أكثر الفيديوهات مشاهدة وتفاعل المستخدمين مع المحتوى التعليمي.</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Widget Area */}
                <div className="xl:col-span-4 space-y-10">
                    <div className="glass-panel rounded-[3rem] p-10 bg-gradient-to-br from-[#8FB394]/10 to-[#4A6351]/10 border-[#8FB394]/10 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8FB394]/30 to-transparent" />
                        <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white/5 backdrop-blur-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            <Video size={36} className="text-[#8FB394]" strokeWidth={1.5} />
                        </div>
                        <h5 className="font-black text-xl text-white mb-3">مكتبة الميديا</h5>
                        <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#8FB394]/50 mb-8 leading-relaxed">
                            لديك حالياً مكتبة متكاملة بالفيديوهات<br />يمكنك إدارتها بضغطة زر
                        </p>
                        <Link href="/dashboard/videos">
                            <button className="h-16 w-full bg-[#F5F2ED] text-[#0D1510] font-black rounded-2xl shadow-2xl hover:bg-white transition-all active:scale-95 text-xs flex items-center justify-center gap-3">
                                <span>انتقال للمكتبة</span>
                                <ArrowLeft size={18} strokeWidth={3} />
                            </button>
                        </Link>
                    </div>

                    <div className="glass-panel rounded-[3rem] p-10 ring-1 ring-white/5 space-y-8">
                        <h5 className="font-extrabold text-white flex items-center gap-3 text-lg">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#8FB394] animate-pulse shadow-[0_0_8px_rgba(143,179,148,0.8)]" />
                            حالة الخوادم
                        </h5>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[#8FB394]/40 text-[10px] font-black uppercase tracking-widest">قاعدة البيانات</span>
                                <span className="text-[#8FB394] text-xs font-black">نشط 100%</span>
                            </div>
                            <div className="h-2 w-full bg-[#0D1510] rounded-full overflow-hidden p-[2px] border border-[#8FB394]/10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1, delay: 1 }}
                                    className="h-full bg-gradient-to-r from-[#4A6351] to-[#8FB394] rounded-full shadow-[0_0_15px_rgba(143,179,148,0.3)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
