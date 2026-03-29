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
    Globe
} from 'lucide-react';
import Link from 'next/link';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const StatCard = ({ title, value, subtitle, icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-3xl p-7 relative overflow-hidden group"
    >
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-[#C9A84C]/5 blur-2xl rounded-full group-hover:bg-[#C9A84C]/10 transition-all duration-700" />
        <div className="flex justify-between items-center mb-5">
            <div className="h-11 w-11 rounded-2xl bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] border border-[#C9A84C]/20">
                {React.cloneElement(icon, { size: 22, strokeWidth: 2 })}
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#C9A84C]/5 rounded-full border border-[#C9A84C]/10 text-[9px] font-black text-[#C9A84C]">
                <ArrowUpRight size={10} strokeWidth={3} />
                <span>+12%</span>
            </div>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#C9A84C]/40">{title}</p>
        <h3 className="text-3xl font-black text-white tracking-tighter mt-1">{value}</h3>
        <p className="mt-3 text-[9px] font-bold text-[#C9A84C]/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
            {subtitle}
        </p>
    </motion.div>
);

const FeatureCard = ({ icon, title, desc, tag, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card rounded-3xl p-7 group hover:border-[#C9A84C]/40 transition-all duration-500 flex flex-col gap-4"
    >
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#C9A84C]/15 to-[#8B6F2E]/10 flex items-center justify-center text-[#C9A84C] border border-[#C9A84C]/20 group-hover:scale-110 transition-transform duration-500">
            {React.cloneElement(icon, { size: 26, strokeWidth: 1.8 })}
        </div>
        <div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#C9A84C]/40 bg-[#C9A84C]/5 px-2 py-1 rounded-full border border-[#C9A84C]/10">{tag}</span>
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
            className="group glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 cursor-pointer transition-all"
        >
            <div className="h-10 w-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]/60 group-hover:text-[#C9A84C] group-hover:bg-[#C9A84C]/20 border border-[#C9A84C]/10 transition-all shrink-0">
                {React.cloneElement(icon, { size: 20, strokeWidth: 2 })}
            </div>
            <span className="font-black text-sm text-[#F5F0E8]/70 group-hover:text-white transition-colors flex-1">{label}</span>
            <ArrowLeft size={14} className="text-[#C9A84C]/20 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </motion.div>
    </Link>
);

export default function Overview() {
    const { stats, loading } = useDashboardStats();

    return (
        <div className="space-y-10 pb-20">

            {/* ─── Hero: App Identity ─── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-[2.5rem] overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #0A0D1A 0%, #141830 40%, #1a1608 100%)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    boxShadow: '0 0 80px rgba(201,168,76,0.07), inset 0 0 60px rgba(201,168,76,0.03)'
                }}
            >
                {/* Gold shimmer top line */}
                <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />

                {/* Background pattern */}
                <div className="absolute inset-0 arabic-pattern opacity-60" />
                <div className="absolute top-[-30%] left-[-10%] w-[50%] h-[120%] bg-[#C9A84C]/6 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-30%] right-[-5%] w-[30%] h-[100%] bg-[#8B6F2E]/10 blur-[80px] rounded-full" />

                <div className="relative z-10 p-12 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Logo mark */}
                    <div className="shrink-0">
                        <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-[#C9A84C] to-[#8B6F2E] flex items-center justify-center shadow-2xl shadow-[#C9A84C]/30">
                            <BookOpen size={44} strokeWidth={2} className="text-[#0A0D1A]" />
                        </div>
                        <div className="mt-3 flex justify-center gap-1.5">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className={`rounded-full bg-[#C9A84C] ${i === 1 ? 'w-4 h-1.5' : 'w-1.5 h-1.5 opacity-40'}`} />
                            ))}
                        </div>
                    </div>

                    {/* App info */}
                    <div className="text-right flex-1">
                        <div className="flex items-center justify-end gap-3 mb-4">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-3 py-1.5 rounded-full">
                                v2.0 — إصدار نشط
                            </span>
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter leading-none">قرآن الإشارة</h1>
                        <p className="text-[#C9A84C] font-bold text-sm mt-1 tracking-widest uppercase">Quran Sign Language</p>
                        <p className="mt-4 text-[#F5F0E8]/50 font-medium text-sm leading-relaxed max-w-xl">
                            منصة رقمية متكاملة تجمع بين تعليم القرآن الكريم ولغة الإشارة، تتيح للصم وضعاف السمع تلاوة وتعلم القرآن الكريم عبر مقاطع فيديو متخصصة باللغة العربية للإشارة SAL.
                        </p>

                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            {[
                                { label: 'iOS & Android', icon: <Smartphone size={14} /> },
                                { label: 'عربي كامل', icon: <Globe size={14} /> },
                                { label: 'مجاني + مميز', icon: <Star size={14} /> },
                            ].map(({ label, icon }) => (
                                <div key={label} className="flex items-center gap-2 px-3 py-1.5 bg-[#1E2448]/80 border border-[#C9A84C]/15 rounded-full text-[10px] font-bold text-[#C9A84C]/70">
                                    {icon}
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
                        <span className="text-[10px] font-black text-[#C9A84C]/50 hover:text-[#C9A84C] uppercase tracking-widest transition-colors flex items-center gap-1">
                            عرض الكل <ArrowLeft size={10} />
                        </span>
                    </Link>
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <div className="w-1 h-6 bg-[#C9A84C] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.5)]" />
                        إحصائيات المنصة
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="المستخدمون النشطون" value={loading ? '...' : stats.totalUsers} subtitle="إجمالي المسجلين في المنصة" icon={<Users />} delay={0.1} />
                    <StatCard title="الاشتراكات الفعالة" value={loading ? '...' : stats.activeSubs} subtitle="مشتركون في الباقة المميزة" icon={<CreditCard />} delay={0.2} />
                    <StatCard title="العوائد التقديرية" value={loading ? '...' : `${stats.revenue} ر.س`} subtitle="الإيراد الشهري المقدر" icon={<TrendingUp />} delay={0.3} />
                </div>
            </div>

            {/* ─── Feature Cards + Quick Actions ─── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Feature Cards */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="flex items-center justify-end">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <div className="w-1 h-6 bg-[#C9A84C] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.5)]" />
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
                            <div className="w-1 h-6 bg-[#C9A84C] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.5)]" />
                            روابط سريعة
                        </h3>
                    </div>
                    <div className="space-y-3">
                        <QuickLink to="/dashboard/videos" label="رفع فيديو جديد" icon={<Plus />} delay={0.1} />
                        <QuickLink to="/dashboard/users" label="إدارة المستخدمين" icon={<Users />} delay={0.15} />
                        <QuickLink to="/dashboard/subscriptions" label="الاشتراكات والفوترة" icon={<CreditCard />} delay={0.2} />
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
                                    <span className="text-[#C9A84C] text-[10px] font-black">{pct}%</span>
                                    <span className="text-[#C9A84C]/40 text-[9px] font-black uppercase tracking-widest">{label}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#1E2448] rounded-full overflow-hidden border border-[#C9A84C]/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        className="h-full bg-gradient-to-r from-[#8B6F2E] to-[#C9A84C] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.4)]"
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
