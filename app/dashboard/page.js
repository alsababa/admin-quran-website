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

const SectionHeader = ({ title, subtitle, icon, accentColor = "#5AA564", href }) => (
    <div className="flex items-center justify-between mb-8">
        {href && (
            <Link href={href}>
                <span className="text-[10px] font-black text-[#5AA564]/50 hover:text-[#5AA564] uppercase tracking-[0.2em] transition-all flex items-center gap-2 group">
                    عرض الكل 
                    <ArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
                </span>
            </Link>
        )}
        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4">
            <div 
                className="w-1.5 h-8 rounded-full shadow-lg"
                style={{ background: `linear-gradient(to bottom, ${accentColor}, transparent)` }} 
            />
            {title}
        </h3>
    </div>
);

const StatCard = ({ title, value, subtitle, icon, delay, trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-3xl p-7 relative overflow-hidden group hover:glass-card-hover transition-all duration-700"
    >
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#5AA564]/5 blur-3xl rounded-full group-hover:bg-[#5AA564]/10 transition-all duration-1000" />
        <div className="flex justify-between items-center mb-6">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-[#5AA564] border border-gray-100 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-700">
                {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
            </div>
            {trend && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#5AA564]/10 rounded-full border border-[#5AA564]/20 text-[10px] font-black text-[#5AA564]">
                    <TrendingUp size={12} strokeWidth={3} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{title}</p>
        <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{value}</h3>
        <p className="mt-5 text-[10px] font-bold text-gray-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5AA564] animate-pulse" />
            {subtitle}
        </p>
    </motion.div>
);

const FeatureCard = ({ icon, title, desc, tag, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card rounded-3xl p-7 group hover:glass-card-hover transition-all duration-700 flex flex-col gap-5 border-transparent"
    >
        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[#5AA564] border border-gray-100 group-hover:scale-110 transition-all duration-700">
            {React.cloneElement(icon, { size: 26, strokeWidth: 2 })}
        </div>
        <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5AA564] bg-[#5AA564]/10 px-3 py-1 rounded-full border border-[#5AA564]/10">{tag}</span>
            <h4 className="text-lg font-black text-gray-900 mt-3">{title}</h4>
            <p className="text-xs font-medium text-gray-400 mt-2 leading-relaxed">{desc}</p>
        </div>
    </motion.div>
);

const QuickLink = ({ to, label, icon, delay }) => (
    <Link href={to}>
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay }}
            className="group glass-card rounded-2xl p-5 flex items-center gap-4 hover:glass-card-hover cursor-pointer transition-all border-transparent"
        >
            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#5AA564] group-hover:bg-[#5AA564]/10 border border-gray-100 transition-all shrink-0">
                {React.cloneElement(icon, { size: 20, strokeWidth: 2 })}
            </div>
            <span className="font-black text-sm text-gray-500 group-hover:text-gray-900 transition-colors flex-1">{label}</span>
            <ArrowLeft size={14} className="text-[#5AA564]/40 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </motion.div>
    </Link>
);

const ActivityRow = ({ icon, label, time, badge, color = "#5AA564", onClick }) => (
    <div 
        onClick={onClick}
        className={`flex items-center gap-4 p-4 rounded-2xl bg-white border border-transparent shadow-sm transition-all duration-500 group/row ${onClick ? 'cursor-pointer hover:glass-card-hover hover:scale-[1.01]' : ''}`}
    >
        <div 
            className="h-10 w-10 rounded-xl flex items-center justify-center border transition-all"
            style={{ 
                backgroundColor: `${color}10`, 
                borderColor: `${color}15`,
                color: color 
            }}
        >
            {React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}
        </div>
        <div className="flex-1">
            <p className="text-sm font-black text-gray-900 group-hover/row:text-[#5AA564] transition-colors">{label}</p>
            <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">{time}</p>
        </div>
        {badge && (
            <span className="text-[9px] font-black px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-500 uppercase tracking-widest group-hover/row:border-[#5AA564]/30 transition-colors">
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
        <div className="space-y-12 pb-20">

            {/* ─── Hero: App Identity ─── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-[3.5rem] overflow-hidden group mesh-gradient"
                style={{
                    border: '1px solid #F1F5F9',
                    boxShadow: '0 40px 80px -30px rgba(0,0,0,0.05), inset 0 0 100px rgba(255,255,255,0.8)'
                }}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#5AA564]/30 to-transparent" />
                <div className="absolute inset-0 arabic-pattern opacity-[0.15] mix-blend-multiply" />
                
                {/* Glowing Orbs */}
                <div className="absolute -top-24 -left-20 w-96 h-96 bg-[#5AA564]/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-[#4A8F53]/15 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center md:items-start gap-10 text-right">
                    {/* Logo mark with improved glassmorphism */}
                    <div className="shrink-0 relative group">
                        <div className="absolute -inset-6 bg-[#5AA564]/15 blur-3xl rounded-full opacity-60 animate-pulse" />
                        <div className="h-32 w-32 rounded-[2.5rem] bg-white flex items-center justify-center shadow-[0_20px_50px_rgba(90,165,100,0.15)] transform group-hover:scale-105 transition-all duration-700 relative border border-white">
                            <BookOpen size={56} strokeWidth={1.5} className="text-[#5AA564]" />
                        </div>
                        <div className="mt-4 flex justify-center gap-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className={`rounded-full transition-all duration-500 ${i === 1 ? 'w-6 h-1.5 bg-[#5AA564]' : 'w-1.5 h-1.5 bg-[#5AA564]/30'}`} />
                            ))}
                        </div>
                    </div>

                    {/* App info with better typography */}
                    <div className="flex-1 pt-2">
                        <div className="flex items-center justify-end gap-3 mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5AA564] bg-[#5AA564]/10 border border-[#5AA564]/20 px-4 py-2 rounded-full backdrop-blur-md">
                                Version 2.0.4 — نظام نشط
                            </span>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
                        </div>
                        <h1 className="text-7xl font-black text-gray-900 tracking-tighter leading-[0.9] drop-shadow-sm mb-4">تلاوة وفهم القرآن <br/> <span className="text-[#5AA564] relative">بأنامل الصم<span className="absolute -bottom-2 right-0 w-full h-2 bg-[#5AA564]/10 -z-10 rounded-full" /></span> بيسر</h1>
                        <p className="text-[#5AA564] font-black text-[10px] mt-6 tracking-[0.5em] uppercase opacity-40 mb-8">Architected for universal accessibility</p>
                        <p className="text-gray-500 font-bold text-xl leading-relaxed max-w-2xl ml-auto">
                            اختبر الثورة الرقمية في تعلم القرآن؛ منصة مصممة بأحدث تقنيات "التقاط الحركة" لخدمة مجتمع الصم بجودة تليق بكلام الله.
                        </p>

                        {/* Quick User Search */}
                        <div className="mt-12 relative max-w-md ml-auto group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#5AA564]/50 to-[#D4AF37]/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center">
                                <Search className="absolute right-5 text-gray-300 group-focus-within:text-[#5AA564] transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="ابحث عن أي مستخدم (بريد أو هاتف)..."
                                    className="w-full h-14 bg-white border border-gray-100 rounded-2xl pr-14 pl-6 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#5AA564]/30 shadow-sm transition-all"
                                    value={quickSearch}
                                    onChange={(e) => setQuickSearch(e.target.value)}
                                    onKeyDown={handleQuickSearch}
                                />
                                <div className="absolute left-4 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-black text-gray-300 uppercase tracking-widest hidden sm:block">
                                    Search Command ⌘
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-wrap justify-end gap-5">
                            <a href="https://apps.apple.com" target="_blank" className="flex items-center gap-3 px-8 py-4 bg-[#5AA564] hover:bg-gray-900 text-white rounded-2xl text-[12px] font-black transition-all duration-300 shadow-xl shadow-[#5AA564]/10 active:scale-95 group/btn">
                                <Smartphone size={18} strokeWidth={2.5} />
                                تحميل التطبيق مجاناً
                            </a>
                            {[
                                { label: 'Universal Access', icon: <Globe size={16} /> },
                                { label: 'Verified Content', icon: <Shield size={16} /> },
                            ].map(({ label, icon }) => (
                                <div key={label} className="flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-100 hover:border-[#5AA564]/30 rounded-2xl text-[11px] font-extrabold text-gray-500 transition-all duration-500 shadow-sm hover:shadow-md group/tag cursor-default active:scale-95">
                                    <span className="text-[#5AA564] group-hover/tag:rotate-12 transition-transform">{icon}</span>
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ─── Live Stats ─── */}
            <div>
                <SectionHeader title="إحصائيات المنصة" href="/dashboard/users" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="إجمالي المستخدمين" value={statsLoading ? '...' : stats.totalUsers} subtitle="إجمالي المسجلين في المنصة" icon={<Users />} trend="+14.2%" delay={0.1} />
                    <StatCard title="المشتركون النشطون" value={statsLoading ? '...' : stats.activeSubs} subtitle="باقات البريميوم الفعالة" icon={<Star />} trend="+8.4%" delay={0.15} />
                    <StatCard title="إجمالي الفيديوهات" value={statsLoading ? '...' : stats.videos} subtitle="محتوى لغة الإشارة المرفوع" icon={<Video />} trend="+5.8%" delay={0.2} />
                    <StatCard title="أكواد التفعيل" value={statsLoading ? '...' : stats.codesAvailable} subtitle="الأكواد الصالحة للاستخدام" icon={<Accessibility />} trend={stats.codesConsumed > 0 ? "Active" : "Stable"} delay={0.25} />
                </div>
            </div>

            {/* ─── Recent Activity Feed ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <SectionHeader title="آخر المستخدمين المنضمين" href="/dashboard/users" />
                    <div className="glass-panel rounded-[2.5rem] p-6 space-y-3">
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

                <div className="space-y-6">
                    <SectionHeader title="العمليات المالية الأخيرة" href="/dashboard/payments" accentColor="#FBBF24" />
                    <div className="glass-panel rounded-[2.5rem] p-6 space-y-3">
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
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

                {/* Feature Cards */}
                <div className="xl:col-span-8 space-y-8">
                    <SectionHeader title="ميزات التطبيق" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FeatureCard
                            icon={<HandMetal />}
                            tag="RECITATION"
                            title="تلاوة القرآن"
                            desc="فيديوهات احترافية تعرض آيات القرآن الكريم بلغة الإشارة العربية SAL بجودة فائقة."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<BookOpen />}
                            tag="UNDERSTANDING"
                            title="فهم وتدبر القرآن"
                            desc="مكتبة تفاعلية متكاملة مصممة خصيصاً للصم وضعاف السمع لتبسيط معاني الآيات."
                            delay={0.15}
                        />
                        <FeatureCard
                            icon={<Accessibility />}
                            tag="ACCESSIBILITY"
                            title="وصولية شاملة"
                            desc="مصمم للصم وضعاف السمع، يدعم واجهة مبسطة وبدائل بصرية لكل الصوتيات."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Smartphone />}
                            tag="PLATFORM"
                            title="تطبيق متكامل"
                            desc="متوفر بمتجر App Store وGoogle Play، يعمل offline للمحتوى المحمّل مسبقاً."
                            delay={0.25}
                        />
                    </div>
                </div>

                {/* Quick Actions + Status */}
                <div className="xl:col-span-4 space-y-8">
                    <SectionHeader title="روابط سريعة" />
                    <div className="space-y-4">
                        <QuickLink to="/dashboard/videos" label="رفع فيديو جديد" icon={<Plus />} delay={0.1} />
                        <QuickLink to="/dashboard/users" label="إدارة المستخدمين" icon={<Users />} delay={0.15} />
                        <QuickLink to="/dashboard/support" label="الدعم الفني" icon={<MessageSquare />} delay={0.2} />
                        <QuickLink to="/dashboard/videos" label="مكتبة الفيديو" icon={<Video />} delay={0.25} />
                    </div>

                    {/* Server Status */}
                    <div className="glass-panel rounded-[2.5rem] p-7 space-y-8">
                        <div className="flex justify-between items-center">
                            <Link href="/dashboard/support">
                                <Activity size={16} className="text-[#5AA564]/50 hover:text-[#5AA564] cursor-pointer" />
                            </Link>
                            <h5 className="font-black text-gray-900 flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.3)]" />
                                مراقبة النظام
                            </h5>
                        </div>
                        
                        <div className="space-y-6">
                            {[
                                { label: 'Firebase Platform', pct: 100, color: '#5AA564' },
                                { label: 'Supabase Data', pct: 98, color: '#D4AF37' },
                                { label: 'Video Assets CDN', pct: 95, color: '#5AA564' },
                            ].map(({ label, pct, color }) => (
                                <div key={label} className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
                                        </div>
                                        <span className="text-gray-500 text-[11px] font-black">{pct}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50 p-[2px]">
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

                        <div className="pt-6 border-t border-gray-100/50 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">بانتظار الرد</span>
                                <span className="text-[10px] font-black text-[#5AA564] bg-[#5AA564]/10 px-3 py-1 rounded-lg border border-[#5AA564]/15">{stats.tickets} تذاكر</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">أكواد مستخدمة</span>
                                <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100">{statsLoading ? '...' : stats.codesConsumed} كود</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
