"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard, TrendingUp, Calendar, User,
    Search, Star, CheckCircle2, Apple, Smartphone, Globe, Building2, BarChart3
} from 'lucide-react';
import { usePremiumUsers } from '@/hooks/usePremiumUsers';

const MetricCard = ({ title, value, subtitle, icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card rounded-3xl p-6 flex items-center gap-5"
    >
        <div className="h-13 w-13 rounded-2xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] border border-[#14B8A6]/20 shrink-0">
            {React.cloneElement(icon, { size: 22, strokeWidth: 2 })}
        </div>
        <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#14B8A6]/40">{title}</p>
            <h4 className="text-2xl font-black text-white mt-0.5">{value}</h4>
            <p className="text-[9px] font-bold text-[#14B8A6]/30 mt-1">{subtitle}</p>
        </div>
    </motion.div>
);

export default function SubscriptionsPage() {
    const { premiumUsers, loading } = usePremiumUsers();

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="text-right">
                    <h3 className="text-4xl font-black text-white tracking-tighter">تقارير الاشتراكات</h3>
                    <p className="text-[#14B8A6]/40 font-bold text-sm mt-2">تحليل أداء الاشتراكات القادمة من تطبيقات الهواتف الذكية.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
                        <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-wider">تحديث حي</span>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <MetricCard 
                    title="إجمالي المميزين" 
                    value={loading ? '...' : premiumUsers.length} 
                    subtitle="كافة المنصات" 
                    icon={<Star />} 
                    delay={0.1} 
                />
                <MetricCard 
                    title="حسابات الجهات" 
                    value={loading ? '...' : premiumUsers.filter(u => u.accountType === 'entity').length} 
                    subtitle="منظمات مسجلة" 
                    icon={<Building2 />} 
                    delay={0.2} 
                />
                <MetricCard 
                    title="نمو أندرويد" 
                    value={loading ? '...' : premiumUsers.filter(u => u.platform === 'android').length} 
                    subtitle="Google Play" 
                    icon={<Smartphone />} 
                    delay={0.3} 
                />
                <MetricCard 
                    title="نمو أيفون" 
                    value={loading ? '...' : premiumUsers.filter(u => u.platform === 'ios').length} 
                    subtitle="App Store" 
                    icon={<Apple />} 
                    delay={0.4} 
                />
            </div>

            {/* Table */}
            <div className="glass-panel rounded-[2.5rem] overflow-hidden border-[#14B8A6]/10">
                <div className="px-9 py-6 border-b border-[#14B8A6]/8 bg-[#14B8A6]/3 flex justify-between items-center">
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#14B8A6]/30" size={14} />
                            <input type="text" placeholder="بحث..." className="h-10 w-44 glass-input rounded-xl pr-10 pl-4 text-xs font-medium text-white outline-none" />
                        </div>
                    </div>
                    <h4 className="font-extrabold text-white text-base flex items-center gap-3">
                        <BarChart3 size={18} className="text-[#14B8A6]" />
                        توزيع المشتركين حسب النوع والمنصة
                    </h4>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-[#14B8A6]/8">
                                <th className="px-9 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/40">المشترك</th>
                                <th className="px-9 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/40 text-center">نوع الحساب</th>
                                <th className="px-9 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/40 text-center">المنصة</th>
                                <th className="px-9 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/40 text-left">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#14B8A6]/5">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-9 py-5"><div className="h-10 w-40 bg-[#1E2448]/60 rounded-xl" /></td>
                                        <td className="px-9 py-5"><div className="h-8 w-24 bg-[#1E2448]/60 rounded-xl mx-auto" /></td>
                                        <td className="px-9 py-5"><div className="h-8 w-32 bg-[#1E2448]/60 rounded-xl mx-auto" /></td>
                                        <td className="px-9 py-5"><div className="h-8 w-20 bg-[#1E2448]/60 rounded-xl mr-auto" /></td>
                                    </tr>
                                ))
                            ) : premiumUsers.map((user, idx) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-[#14B8A6]/3 transition-colors"
                                >
                                    <td className="px-9 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center font-black text-[#14B8A6] text-xs">
                                                {user.displayName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-[#F5F0E8] text-sm">{user.displayName || 'مستخدم مميز'}</p>
                                                <p className="text-[9px] font-bold text-[#14B8A6]/40">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-9 py-5 text-center">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg border
                                            ${user.accountType === 'entity' ? 'bg-[#14B8A6]/20 border-[#14B8A6]/30 text-[#14B8A6]' : 'bg-white/5 border-white/10 text-white/50'}`}>
                                            {user.accountType === 'entity' ? 'جهة / منظمة' : 'حساب فردي'}
                                        </span>
                                    </td>
                                    <td className="px-9 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2 text-[#14B8A6]/60 font-bold uppercase text-[10px]">
                                            {user.platform === 'ios' && <Apple size={12} />}
                                            {user.platform === 'android' && <Smartphone size={12} />}
                                            {user.platform === 'manual' && <Globe size={12} />}
                                            {user.platform || 'غير محدد'}
                                        </div>
                                    </td>
                                    <td className="px-9 py-5">
                                        <div className="flex justify-end gap-2 items-center text-[#F5F0E8]/40">
                                            <span className="text-xs font-bold">
                                                {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير متوفر'}
                                            </span>
                                            <Calendar size={12} />
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
