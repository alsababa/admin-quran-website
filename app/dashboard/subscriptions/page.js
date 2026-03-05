"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    TrendingUp,
    Calendar,
    User,
    Search,
    Filter,
    ArrowUpRight,
    Star,
    CheckCircle2
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { supabase } from '@/lib/supabase';
import { usePremiumUsers } from '@/hooks/usePremiumUsers';

const MetricCard = ({ title, value, subtitle, icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card rounded-3xl p-6 border-[#8FB394]/10 flex items-center gap-6"
    >
        <div className="h-14 w-14 rounded-2xl bg-[#8FB394]/10 flex items-center justify-center text-[#8FB394] border border-[#8FB394]/20">
            {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#8FB394]/40">{title}</p>
            <h4 className="text-2xl font-black text-white mt-1">{value}</h4>
            <p className="text-[10px] font-bold text-[#8FB394]/30 mt-1">{subtitle}</p>
        </div>
    </motion.div>
);


export default function SubscriptionsPage() {
    const { premiumUsers, loading } = usePremiumUsers();

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="text-right">
                    <h3 className="text-4xl font-black text-white tracking-tighter">نظام الاشتراكات</h3>
                    <p className="text-[#8FB394]/40 font-bold text-sm mt-2">تتبع العوائد والمشتركين المميزين في منصة قرآن الإشارة.</p>
                </div>
                <div className="flex gap-4">
                    <button className="h-12 px-6 bg-[#8FB394]/10 border border-[#8FB394]/20 rounded-xl text-[#8FB394] font-black text-xs hover:bg-[#8FB394]/20 transition-all">تحميل الفواتير</button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="إجمالي المشتركين"
                    value={premiumUsers.length}
                    subtitle="معدل نمو +5%"
                    icon={<User />}
                    delay={0.1}
                />
                <MetricCard
                    title="صافي العوائد"
                    value={`${premiumUsers.length * 10} ريال`}
                    subtitle="لهذا الشهر"
                    icon={<TrendingUp />}
                    delay={0.2}
                />
                <MetricCard
                    title="الاشتراكات الجديدة"
                    value="12"
                    subtitle="آخر 7 أيام"
                    icon={<Star />}
                    delay={0.3}
                />
            </div>

            {/* Detailed Table */}
            <div className="glass-panel rounded-[2.5rem] overflow-hidden border-[#8FB394]/10">
                <div className="px-10 py-7 border-b border-[#8FB394]/5 bg-[#8FB394]/5 flex justify-between items-center">
                    <h4 className="font-extrabold text-white text-lg flex items-center gap-3">
                        <CreditCard size={20} className="text-[#8FB394]" />
                        سجل المشتركين المميزين
                    </h4>
                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8FB394]/30" size={14} />
                            <input type="text" placeholder="بحث..." className="h-10 w-48 bg-[#0D1510]/50 border border-[#8FB394]/10 rounded-xl pr-10 pl-4 text-xs font-medium text-white outline-none focus:border-[#8FB394]/30 transition-all" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-[#8FB394]/5">
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#8FB394]/40">المشترك</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#8FB394]/40 text-center">الخطة</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#8FB394]/40 text-center">تاريخ التجديد</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#8FB394]/40 text-left">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#8FB394]/5">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-10 py-6"><div className="h-10 w-40 bg-[#4A6351]/10 rounded-xl" /></td>
                                        <td className="px-10 py-6"><div className="h-10 w-24 bg-[#4A6351]/10 rounded-xl mx-auto" /></td>
                                        <td className="px-10 py-6"><div className="h-10 w-32 bg-[#4A6351]/10 rounded-xl mx-auto" /></td>
                                        <td className="px-10 py-6"><div className="h-10 w-24 bg-[#4A6351]/10 rounded-xl mr-auto" /></td>
                                    </tr>
                                ))
                            ) : premiumUsers.map((user, idx) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-[#8FB394]/5 transition-colors"
                                >
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-[#8FB394]/10 flex items-center justify-center font-black text-[#8FB394] text-xs">
                                                {user.displayName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-[#F5F2ED] text-sm">{user.displayName || 'مستخدم مميز'}</p>
                                                <p className="text-[10px] font-bold text-[#8FB394]/40">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className="text-xs font-black text-[#8FB394] bg-[#8FB394]/10 px-3 py-1 rounded-lg border border-[#8FB394]/20">باقة احترافية</span>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Calendar size={12} className="text-[#8FB394]/30" />
                                            <span className="text-xs font-bold text-[#F5F2ED]/60">2024/05/12</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex justify-end">
                                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8FB394]/10 border border-[#8FB394]/20 text-[#8FB394] text-[10px] font-black uppercase tracking-widest">
                                                <CheckCircle2 size={12} />
                                                نشط
                                            </div>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
