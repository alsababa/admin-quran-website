"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    Video,
    Activity,
    Plus,
    Smartphone,
    BookOpen,
    Accessibility,
    HandMetal,
    ArrowLeft,
    Star,
    Globe,
    MessageSquare,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const StatCard = ({ title, value, subtitle, icon, delay, trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-3xl p-7 relative overflow-hidden group hover:border-[#14B8A6]/40 transition-all duration-500"
    >
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-[#14B8A6]/5 blur-2xl rounded-full group-hover:bg-[#14B8A6]/10 transition-all duration-700" />
        <div className="flex justify-between items-center mb-5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#14B8A6]/15 to-[#0D9488]/5 flex items-center justify-center text-[#14B8A6] border border-[#14B8A6]/20 group-hover:scale-110 transition-transform duration-500">
                {React.cloneElement(icon, { size: 24, strokeWidth: 2 })}
            </div>
            {trend && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-black text-emerald-400">
                    <TrendingUp size={12} strokeWidth={3} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/40 mb-1">{title}</p>
        <h3 className="text-4xl font-black text-white tracking-tighter">{value}</h3>
        <p className="mt-4 text-[10px] font-bold text-[#14B8A6]/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#14B8A6] shadow-[0_0_8px_rgba(20,184,166,0.4)]" />
            {subtitle}
        </p>
    </motion.div>
);

const FeatureCard = ({ icon, title, desc, tag, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card rounded-3xl p-7 group hover:border-[#14B8A6]/40 transition-all duration-500 flex flex-col gap-4"
    >
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#14B8A6]/15 to-[#0D9488]/10 flex items-center justify-center text-[#14B8A6] border border-[#14B8A6]/20 group-hover:scale-110 transition-transform duration-500">
            {React.cloneElement(icon, { size: 26, strokeWidth: 1.8 })}
        </div>
        <div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/40 bg-[#14B8A6]/5 px-2 py-1 rounded-full border border-[#14B8A6]/10">{tag}</span>
            <h4 className="text-base font-extrabold text-white mt-2">{title}</h4>
            <p className="text-xs font-medium text-[#F5F0E8]/40 mt-1 leading-relaxed">{desc}</p>
        </div>
    </motion.div>
);

const QuickLink = ({ to, label, icon, delay }) => (
    <Link href={to}>
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay }}
            className="group glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-[#14B8A6]/40 hover:bg-[#14B8A6]/5 cursor-pointer transition-all"
        >
            <div className="h-10 w-10 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6]/60 group-hover:text-[#14B8A6] group-hover:bg-[#14B8A6]/20 border border-[#14B8A6]/10 transition-all shrink-0">
                {React.cloneElement(icon, { size: 20, strokeWidth: 2 })}
            </div>
            <span className="font-black text-sm text-[#F5F0E8]/70 group-hover:text-white transition-colors flex-1">{label}</span>
            <ArrowLeft size={14} className="text-[#14B8A6]/20 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </motion.div>
    </Link>
);

export default function Overview() {
    const { stats, loading } = useDashboardStats();

    return (
        <div className="space-y-10 pb-20">

            {/* ─── Hero: App Identity ─── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-[3rem] overflow-hidden group"
                style={{
                    background: 'linear-gradient(135deg, #0A0D1A 0%, #151B33 40%, #121626 100%)',
                    border: '1px solid rgba(20, 184, 166, 0.15)',
                    boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5), inset 0 0 80px rgba(20, 184, 166, 0.05)'
                }}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#14B8A6]/30 to-transparent" />
                <div className="absolute inset-0 arabic-pattern opacity-40 mix-blend-overlay" />
                
                {/* Glowing Orbs */}
                <div className="absolute -top-24 -left-20 w-96 h-96 bg-[#14B8A6]/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-[#0D9488]/15 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center md:items-start gap-10">
                    {/* Logo mark with improved glassmorphism */}
                    <div className="shrink-0 relative group">
                        <div className="absolute -inset-4 bg-[#14B8A6]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="h-28 w-28 rounded-[2.5rem] bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center shadow-2xl shadow-[#14B8A6]/30 transform group-hover:scale-105 transition-transform duration-500 relative">
                            <BookOpen size={48} strokeWidth={2} className="text-[#0A0D1A]" />
                        </div>
                        <div className="mt-4 flex justify-center gap-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className={`rounded-full transition-all duration-500 ${i === 1 ? 'w-6 h-1.5 bg-[#14B8A6]' : 'w-1.5 h-1.5 bg-[#14B8A6]/30'}`} />
                            ))}
                        </div>
                    </div>

                    {/* App info with better typography */}
                    <div className="text-right flex-1 pt-2">
                        <div className="flex items-center justify-end gap-3 mb-5">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#14B8A6] bg-[#14B8A6]/10 border border-[#14B8A6]/20 px-4 py-2 rounded-full backdrop-blur-md">
                                Version 2.0.4 — نظام نشط
                            </span>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
                        </div>
                        <h1 className="text-6xl font-black text-white tracking-tighter leading-tight drop-shadow-sm">مصحف أنامل للصم</h1>
                        <p className="text-[#14B8A6] font-extrabold text-sm mt-2 tracking-[0.3em] uppercase opacity-80">Anaml Quran for the Deaf</p>
                        <p className="mt-6 text-[#F5F0E8]/50 font-medium text-base leading-relaxed max-w-2xl bg-gradient-to-l from-white/10 to-transparent bg-clip-text text-transparent">
                            المنصة الرائدة لتمكين الصم وضعاف السمع من الوصول لبيان القرآن الكريم وتدبر آياته عبر لغة الإشارة العربية المتخصصة وحلول الوصول الرقمي المتقدمة.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-end gap-4">
                            {[
                                { label: 'Cross-Platform', icon: <Smartphone size={16} /> },
                                { label: 'Universal Access', icon: <Globe size={16} /> },
                                { label: 'Verified Content', icon: <Shield size={16} /> },
                            ].map(({ label, icon }) => (
                                <div key={label} className="flex items-center gap-3 px-5 py-2.5 bg-[#1E2448]/40 border border-[#14B8A6]/10 hover:border-[#14B8A6]/30 rounded-2xl text-[11px] font-bold text-[#14B8A6]/80 transition-all duration-300 backdrop-blur-sm group/tag cursor-default">
                                    <span className="text-[#14B8A6] group-hover/tag:scale-110 transition-transform">{icon}</span>
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ─── Live Stats ─── */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <Link href="/dashboard/users">
                        <span className="text-[10px] font-black text-[#14B8A6]/50 hover:text-[#14B8A6] uppercase tracking-widest transition-colors flex items-center gap-1">
                            عرض الكل <ArrowLeft size={10} />
                        </span>
                    </Link>
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <div className="w-1 h-6 bg-[#14B8A6] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.5)]" />
                        إحصائيات المنصة
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="المستخدمون النشطون" value={loading ? '...' : stats.totalUsers} subtitle="إجمالي المسجلين في المنصة" icon={<Users />} trend="+14.2%" delay={0.1} />
                    <StatCard title="إجمالي الفيديوهات" value="1,240+" subtitle="محتوى لغة الإشارة المرفوع" icon={<Video />} trend="+5.8%" delay={0.2} />
                    <StatCard title="طلبات الدعم" value="8" subtitle="تذاكر بانتظار المراجعة" icon={<MessageSquare />} trend="-2" delay={0.3} />
                </div>
            </div>

            {/* ─── Feature Cards + Quick Actions ─── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Feature Cards */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="flex items-center justify-end">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <div className="w-1 h-6 bg-[#14B8A6] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.5)]" />
                            ميزات التطبيق
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FeatureCard
                            icon={<HandMetal />}
                            tag="core feature"
                            title="لغة الإشارة العربية"
                            desc="فيديوهات احترافية تعرض آيات القرآن الكريم بلغة الإشارة العربية SAL بجودة عالية."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<BookOpen />}
                            tag="quran"
                            title="القرآن الكريم كاملاً"
                            desc="تغطية كاملة للأجزاء الثلاثين مع نصوص الآيات والتفسير المبسط."
                            delay={0.15}
                        />
                        <FeatureCard
                            icon={<Accessibility />}
                            tag="accessibility"
                            title="وصولية شاملة"
                            desc="مصمم للصم وضعاف السمع، يدعم واجهة مبسطة وبدائل بصرية لكل الصوتيات."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Smartphone />}
                            tag="mobile"
                            title="تطبيق iOS & Android"
                            desc="متوفر بمتجر App Store وGoogle Play، يعمل offline للمحتوى المحمّل مسبقاً."
                            delay={0.25}
                        />
                    </div>
                </div>

                {/* Quick Actions + Status */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="flex items-center justify-end">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <div className="w-1 h-6 bg-[#14B8A6] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.5)]" />
                            روابط سريعة
                        </h3>
                    </div>
                    <div className="space-y-3">
                        <QuickLink to="/dashboard/videos" label="رفع فيديو جديد" icon={<Plus />} delay={0.1} />
                        <QuickLink to="/dashboard/users" label="إدارة المستخدمين" icon={<Users />} delay={0.15} />
                        <QuickLink to="/dashboard/support" label="الدعم الفني" icon={<MessageSquare />} delay={0.2} />
                        <QuickLink to="/dashboard/videos" label="مكتبة الفيديو" icon={<Video />} delay={0.25} />
                    </div>

                    {/* Server Status */}
                    <div className="glass-panel rounded-3xl p-7 space-y-5">
                        <h5 className="font-extrabold text-white flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                            حالة الخوادم
                        </h5>
                        {[
                            { label: 'Firebase Auth', pct: 100 },
                            { label: 'Supabase DB', pct: 98 },
                            { label: 'Video CDN', pct: 95 },
                        ].map(({ label, pct }) => (
                            <div key={label} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[#14B8A6] text-[10px] font-black">{pct}%</span>
                                    <span className="text-[#14B8A6]/40 text-[9px] font-black uppercase tracking-widest">{label}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#1E2448] rounded-full overflow-hidden border border-[#14B8A6]/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        className="h-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.4)]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
