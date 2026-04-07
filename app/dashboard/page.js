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
    Shield,
    Search
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useUsers } from '@/hooks/useUsers';
import { usePayments } from '@/hooks/usePayments';

const StatCard = ({ title, value, subtitle, icon, delay, trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-3xl p-7 relative overflow-hidden group hover:border-[#5AA564]/40 transition-all duration-500"
    >
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-[#5AA564]/5 blur-2xl rounded-full group-hover:bg-[#5AA564]/10 transition-all duration-700" />
        <div className="flex justify-between items-center mb-5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#5AA564]/15 to-[#4A8F53]/5 flex items-center justify-center text-[#5AA564] border border-[#5AA564]/20 group-hover:scale-110 transition-transform duration-500">
                {React.cloneElement(icon, { size: 24, strokeWidth: 2 })}
            </div>
            {trend && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#5AA564]/10 rounded-full border border-[#5AA564]/20 text-[10px] font-black text-[#5AA564]">
                    <TrendingUp size={12} strokeWidth={3} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5AA564]/40 mb-1">{title}</p>
        <h3 className="text-4xl font-black text-white tracking-tighter">{value}</h3>
        <p className="mt-4 text-[10px] font-bold text-[#5AA564]/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5AA564] shadow-[0_0_8px_rgba(90,165,100,0.4)]" />
            {subtitle}
        </p>
    </motion.div>
);

const FeatureCard = ({ icon, title, desc, tag, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card rounded-3xl p-7 group hover:border-[#5AA564]/40 transition-all duration-500 flex flex-col gap-4"
    >
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#5AA564]/15 to-[#4A8F53]/10 flex items-center justify-center text-[#5AA564] border border-[#5AA564]/20 group-hover:scale-110 transition-transform duration-500">
            {React.cloneElement(icon, { size: 26, strokeWidth: 1.8 })}
        </div>
        <div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#5AA564]/40 bg-[#5AA564]/5 px-2 py-1 rounded-full border border-[#5AA564]/10">{tag}</span>
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
            className="group glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-[#5AA564]/40 hover:bg-[#5AA564]/5 cursor-pointer transition-all"
        >
            <div className="h-10 w-10 rounded-xl bg-[#5AA564]/10 flex items-center justify-center text-[#5AA564]/60 group-hover:text-[#5AA564] group-hover:bg-[#5AA564]/20 border border-[#5AA564]/10 transition-all shrink-0">
                {React.cloneElement(icon, { size: 20, strokeWidth: 2 })}
            </div>
            <span className="font-black text-sm text-[#F5F0E8]/70 group-hover:text-white transition-colors flex-1">{label}</span>
            <ArrowLeft size={14} className="text-[#5AA564]/20 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </motion.div>
    </Link>
);

const ActivityRow = ({ icon, label, time, badge, color = "#5AA564", onClick }) => (
    <div 
        onClick={onClick}
        className={`flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 transition-all group/row ${onClick ? 'cursor-pointer hover:bg-[#5AA564]/5 hover:border-[#5AA564]/20' : ''}`}
    >
        <div 
            className="h-10 w-10 rounded-xl flex items-center justify-center border transition-all"
            style={{ 
                backgroundColor: `${color}10`, 
                borderColor: `${color}20`,
                color: color 
            }}
        >
            {React.cloneElement(icon, { size: 18 })}
        </div>
        <div className="flex-1">
            <p className="text-xs font-bold text-white group-hover/row:text-[#5AA564] transition-colors">{label}</p>
            <p className="text-[10px] font-medium text-[#F5F0E8]/30 mt-0.5">{time}</p>
        </div>
        {badge && (
            <span className="text-[9px] font-black px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[#F5F0E8]/40 uppercase tracking-widest group-hover/row:border-[#5AA564]/30 transition-colors">
                {badge}
            </span>
        )}
    </div>
);

export default function Overview() {
    const router = useRouter();
    const { stats, loading: statsLoading } = useDashboardStats();
    const { users, loading: usersLoading } = useUsers();
    const { payments, loading: paymentsLoading } = usePayments();
    const [quickSearch, setQuickSearch] = React.useState('');

    const recentUsers = users.slice(0, 4);
    const recentPayments = payments.slice(0, 4);

    const handleQuickSearch = (e) => {
        if (e.key === 'Enter' && quickSearch.trim()) {
            router.push(`/dashboard/users?search=${encodeURIComponent(quickSearch.trim())}`);
        }
    };

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
                    border: '1px solid rgba(90, 165, 100, 0.15)',
                    boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5), inset 0 0 80px rgba(90, 165, 100, 0.05)'
                }}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5AA564]/30 to-transparent" />
                <div className="absolute inset-0 arabic-pattern opacity-40 mix-blend-overlay" />
                
                {/* Glowing Orbs */}
                <div className="absolute -top-24 -left-20 w-96 h-96 bg-[#5AA564]/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-[#4A8F53]/15 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center md:items-start gap-10">
                    {/* Logo mark with improved glassmorphism */}
                    <div className="shrink-0 relative group">
                        <div className="absolute -inset-4 bg-[#5AA564]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="h-28 w-28 rounded-[2.5rem] bg-gradient-to-br from-[#5AA564] to-[#4A8F53] flex items-center justify-center shadow-2xl shadow-[#5AA564]/30 transform group-hover:scale-105 transition-transform duration-500 relative">
                            <BookOpen size={48} strokeWidth={2} className="text-[#0A0D1A]" />
                        </div>
                        <div className="mt-4 flex justify-center gap-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className={`rounded-full transition-all duration-500 ${i === 1 ? 'w-6 h-1.5 bg-[#5AA564]' : 'w-1.5 h-1.5 bg-[#5AA564]/30'}`} />
                            ))}
                        </div>
                    </div>

                    {/* App info with better typography */}
                    <div className="text-right flex-1 pt-2">
                        <div className="flex items-center justify-end gap-3 mb-5">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#5AA564] bg-[#5AA564]/10 border border-[#5AA564]/20 px-4 py-2 rounded-full backdrop-blur-md">
                                Version 2.0.4 — نظام نشط
                            </span>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
                        </div>
                        <h1 className="text-6xl font-black text-white tracking-tighter leading-tight drop-shadow-sm">تلاوة وفهم القرآن <br/> <span className="text-[#5AA564]">بأنامل الصم</span> بيسر</h1>
                        <p className="text-[#5AA564] font-extrabold text-sm mt-3 tracking-[0.3em] uppercase opacity-80">Anaml Quran for the Deaf</p>
                        <p className="mt-8 text-[#F5F0E8]/70 font-bold text-lg leading-relaxed max-w-2xl bg-gradient-to-l from-white/20 to-transparent bg-clip-text text-transparent">
                            منصة مصحف أنامل هي نافذتك الشاملة لتعلم وتدبر كتاب الله، مع مكتبة تفاعلية متكاملة مصممة خصيصاً للصم وضعاف السمع بجودة فائقة.
                        </p>

                        {/* Quick User Search */}
                        <div className="mt-10 relative max-w-md ml-auto group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#5AA564]/50 to-[#D4AF37]/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center">
                                <Search className="absolute right-5 text-[#5AA564]/40 group-focus-within:text-[#5AA564] transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="ابحث عن أي مستخدم (بريد أو هاتف)..."
                                    className="w-full h-14 bg-[#0A0D1A]/60 border border-white/5 rounded-2xl pr-14 pl-6 text-sm font-bold text-white placeholder:text-[#5AA564]/20 focus:outline-none focus:border-[#5AA564]/40 backdrop-blur-xl transition-all"
                                    value={quickSearch}
                                    onChange={(e) => setQuickSearch(e.target.value)}
                                    onKeyDown={handleQuickSearch}
                                />
                                <div className="absolute left-3 px-3 py-1.5 bg-[#5AA564]/10 border border-[#5AA564]/20 rounded-xl text-[9px] font-black text-[#5AA564] uppercase tracking-widest hidden sm:block">
                                    Press Enter ⏎
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap justify-end gap-4">
                            <a href="https://apps.apple.com" target="_blank" className="flex items-center gap-3 px-6 py-3 bg-[#5AA564] hover:bg-[#D4AF37] text-[#0A0D1A] rounded-2xl text-[12px] font-black transition-all duration-300 shadow-xl shadow-[#5AA564]/20 active:scale-95 group/btn">
                                <Smartphone size={18} strokeWidth={2.5} />
                                تحميل التطبيق مجاناً
                            </a>
                            {[
                                { label: 'Universal Access', icon: <Globe size={16} /> },
                                { label: 'Verified Content', icon: <Shield size={16} /> },
                            ].map(({ label, icon }) => (
                                <div key={label} className="flex items-center gap-3 px-5 py-3 bg-[#1E2448]/40 border border-[#5AA564]/10 hover:border-[#5AA564]/30 rounded-2xl text-[11px] font-bold text-[#5AA564]/80 transition-all duration-300 backdrop-blur-sm group/tag cursor-default">
                                    <span className="text-[#5AA564] group-hover/tag:scale-110 transition-transform">{icon}</span>
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
                        <span className="text-[10px] font-black text-[#5AA564]/50 hover:text-[#5AA564] uppercase tracking-widest transition-colors flex items-center gap-1">
                            عرض الكل <ArrowLeft size={10} />
                        </span>
                    </Link>
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <div className="w-1 h-6 bg-[#5AA564] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.5)]" />
                        إحصائيات المنصة
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="إجمالي المستخدمين" value={statsLoading ? '...' : stats.totalUsers} subtitle="إجمالي المسجلين في المنصة" icon={<Users />} trend="+14.2%" delay={0.1} />
                    <StatCard title="المشتركون النشطون" value={statsLoading ? '...' : stats.activeSubs} subtitle="باقات البريميوم الفعالة" icon={<Star />} trend="+8.4%" delay={0.15} />
                    <StatCard title="إجمالي الفيديوهات" value={statsLoading ? '...' : stats.videos} subtitle="محتوى لغة الإشارة المرفوع" icon={<Video />} trend="+5.8%" delay={0.2} />
                    <StatCard title="أكواد التفعيل" value={statsLoading ? '...' : stats.codesAvailable} subtitle="الأكواد الصالحة للاستخدام" icon={<Accessibility />} trend={stats.codesConsumed > 0 ? "Active" : "Stable"} delay={0.25} />
                </div>
            </div>

            {/* ─── Recent Activity Feed ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard/users">
                            <span className="text-[10px] font-black text-[#5AA564]/50 hover:text-[#5AA564] uppercase tracking-widest transition-colors flex items-center gap-1">
                                الكل <ArrowLeft size={10} />
                            </span>
                        </Link>
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <div className="w-1 h-6 bg-[#5AA564] rounded-full shadow-[0_0_8px_rgba(90,165,100,0.5)]" />
                            آخر المستخدمين المنضمين
                        </h3>
                    </div>
                    <div className="glass-panel rounded-[2rem] p-6 space-y-3">
                        {usersLoading ? (
                            <div className="py-10 text-center text-[#5AA564]/30 text-xs font-bold">جاري تحميل البيانات...</div>
                        ) : recentUsers.map((user, i) => (
                            <ActivityRow 
                                key={user.id} 
                                icon={<Users />} 
                                label={user.displayName || user.email} 
                                time={user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'منذ قليل'}
                                badge={user.source}
                                onClick={() => router.push(`/dashboard/users?search=${encodeURIComponent(user.email || user.phoneNumber)}`)}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard/payments">
                            <span className="text-[10px] font-black text-[#5AA564]/50 hover:text-[#5AA564] uppercase tracking-widest transition-colors flex items-center gap-1">
                                الكل <ArrowLeft size={10} />
                            </span>
                        </Link>
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <div className="w-1 h-6 bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                            العمليات المالية الأخيرة
                        </h3>
                    </div>
                    <div className="glass-panel rounded-[2rem] p-6 space-y-3">
                        {paymentsLoading ? (
                            <div className="py-10 text-center text-[#5AA564]/30 text-xs font-bold">جاري تحميل البيانات...</div>
                        ) : recentPayments.map((pay, i) => {
                            const isPaid = pay.paymentStatus === 'paid' || pay.paymentStatus === 'successful';
                            return (
                                <ActivityRow 
                                    key={pay.id} 
                                    icon={<CreditCard />} 
                                    label={`مدفوعات ${pay.amount ? `(${pay.amount / 100} SAR)` : 'جديدة'}`} 
                                    time={pay.createdAt ? new Date(pay.createdAt.seconds ? pay.createdAt.seconds * 1000 : pay.createdAt).toLocaleDateString('ar-SA') : 'N/A'}
                                    badge={isPaid ? 'ناجحة' : 'فاشلة'}
                                    color={isPaid ? "#5AA564" : "#F43F5E"}
                                    onClick={() => router.push(`/dashboard/payments?search=${encodeURIComponent(pay.userEmail || '')}`)}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ─── Feature Cards + Quick Actions ─── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Feature Cards */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="flex items-center justify-end">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <div className="w-1 h-6 bg-[#5AA564] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.5)]" />
                            ميزات التطبيق
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FeatureCard
                            icon={<HandMetal />}
                            tag="recitation"
                            title="تلاوة القرآن"
                            desc="فيديوهات احترافية تعرض آيات القرآن الكريم بلغة الإشارة العربية SAL بجودة فائقة."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<BookOpen />}
                            tag="understanding"
                            title="فهم وتدبر القرآن"
                            desc="مكتبة تفاعلية متكاملة مصممة خصيصاً للصم وضعاف السمع لتبسيط معاني الآيات."
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
                            tag="platform"
                            title="تطبيق متكامل"
                            desc="متوفر بمتجر App Store وGoogle Play، يعمل offline للمحتوى المحمّل مسبقاً."
                            delay={0.25}
                        />
                    </div>
                </div>

                {/* Quick Actions + Status */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="flex items-center justify-end">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <div className="w-1 h-6 bg-[#5AA564] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.5)]" />
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
                    <div className="glass-panel rounded-3xl p-7 space-y-6">
                        <div className="flex justify-between items-center">
                            <Link href="/dashboard/support">
                                <Activity size={16} className="text-[#5AA564]/50 hover:text-[#5AA564] cursor-pointer" />
                            </Link>
                            <h5 className="font-extrabold text-white flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                                مراقبة النظام
                            </h5>
                        </div>
                        
                        <div className="space-y-5">
                            {[
                                { label: 'Firebase Platform', pct: 100, color: '#5AA564' },
                                { label: 'Supabase Data', pct: 98, color: '#D4AF37' },
                                { label: 'Video Assets CDN', pct: 95, color: '#5AA564' },
                            ].map(({ label, pct, color }) => (
                                <div key={label} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                                            <span className="text-[#F5F0E8]/40 text-[9px] font-black uppercase tracking-widest">{label}</span>
                                        </div>
                                        <span className="text-[#F5F0E8]/60 text-[10px] font-black">{pct}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            className="h-full rounded-full"
                                            style={{ background: `linear-gradient(to right, ${color}40, ${color})` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-white/50">بانتظار الرد</span>
                                <span className="text-[10px] font-black text-[#5AA564] bg-[#5AA564]/10 px-2 py-0.5 rounded-md border border-[#5AA564]/20">{stats.tickets} تذاكر</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-white/50">أكواد مستخدمة</span>
                                <span className="text-[10px] font-black text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-md border border-[#D4AF37]/20">{statsLoading ? '...' : stats.codesConsumed} كود</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
