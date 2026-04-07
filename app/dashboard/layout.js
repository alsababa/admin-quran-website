"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    CreditCard,
    LayoutDashboard,
    LogOut,
    BookOpen,
    Video,
    ChevronRight,
    Bell,
    Search,
    Loader2,
    MessageSquare,
    Ticket
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/context/AuthContext';

const SidebarLink = ({ to, icon, label, isOpen }) => {
    const pathname = usePathname();
    const isActive = pathname === to;

    return (
        <Link href={to} className="block group">
            <motion.div
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden
                    ${isActive
                        ? 'bg-[#5AA564]/10 text-[#5AA564] border border-[#5AA564]/25 shadow-[0_0_20px_rgba(201,168,76,0.12)]'
                        : 'text-[#5AA564]/40 hover:text-white'
                    }`}
            >
                {isActive && (
                    <motion.div
                        layoutId="sidebar-active-pill"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#5AA564] rounded-l-full shadow-[0_0_8px_rgba(201,168,76,0.6)]"
                    />
                )}
                <div className={`${isActive ? 'text-[#5AA564]' : 'group-hover:text-[#5AA564]'} transition-colors shrink-0`}>
                    {React.cloneElement(icon, { size: 22, strokeWidth: 2 })}
                </div>
                {isOpen && (
                    <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-bold text-sm tracking-tight"
                    >
                        {label}
                    </motion.span>
                )}
            </motion.div>
        </Link>
    );
};

export default function DashboardLayout({ children }) {
    return (
        <AuthProvider>
            <DashboardInner>{children}</DashboardInner>
        </AuthProvider>
    );
}

function DashboardInner({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, logout, loading: authLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    // ── Auth Guard ────────────────────────────────────────────
    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-[#0A0D1A] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={36} className="text-[#5AA564] animate-spin" />
                    <p className="text-[10px] font-black text-[#5AA564]/40 uppercase tracking-widest">جاري التحقق من الهوية...</p>
                </div>
            </div>
        );
    }

    const getPageTitle = () => {
        if (pathname === '/dashboard') return 'لوحة التحكم';
        if (pathname === '/dashboard/users') return 'إدارة المستخدمين';
        if (pathname === '/dashboard/videos') return 'إدارة المحتوى والميديا';
        if (pathname === '/dashboard/codes') return 'أكواد التفعيل وإدارة المجموعات';
        if (pathname === '/dashboard/support') return 'الدعم الفني والتذاكر';
        return 'لوحة التحكم';
    };

    return (
        <div className="min-h-screen bg-[#0A0D1A] text-[#F5F0E8] flex overflow-hidden font-sans selection:bg-[#5AA564]/30" dir="rtl">
            {/* Ambient Background Accents */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-[#5AA564]/5 blur-[140px] rounded-full animate-glow-green" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#1E2448]/60 blur-[140px] rounded-full animate-glow-green" style={{ animationDelay: '-5s' }} />
                {/* Subtle Arabic geometric dot pattern */}
                <div className="absolute inset-0 arabic-pattern opacity-100" />
            </div>

            {/* Sidebar */}
            <motion.aside
                animate={{ width: isSidebarOpen ? 280 : 88 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel border-l border-[#5AA564]/10 flex flex-col shrink-0 z-30 relative h-screen shadow-2xl"
            >
                {/* Sidebar Header */}
                <div className="h-24 flex items-center justify-between px-6 shrink-0 border-b border-[#5AA564]/8">
                    <AnimatePresence mode="wait">
                        {isSidebarOpen ? (
                            <motion.div
                                key="open"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex items-center gap-3"
                            >
                                <div className="p-1 bg-gradient-to-br from-[#5AA564]/20 to-[#4A8F53]/20 rounded-2xl shadow-lg shadow-[#5AA564]/10 border border-[#5AA564]/20">
                                    <img src="/logo/logo.png" alt="Logo" className="w-8 h-8 object-contain drop-shadow-md" />
                                </div>
                                <div>
                                    <span className="text-base font-black tracking-tight bg-gradient-to-l from-[#F5F0E8] to-[#5AA564] bg-clip-text text-transparent">مصحف أنامل للصم</span>
                                    <p className="text-[9px] font-bold text-[#5AA564]/40 uppercase tracking-widest mt-0.5">لوحة الإدارة المركزية</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="closed"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mx-auto p-1.5 bg-[#5AA564]/10 rounded-2xl border border-[#5AA564]/20"
                            >
                                <img src="/logo/logo.png" alt="Logo" className="w-8 h-8 object-contain drop-shadow-md" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="الرئيسية" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/users" icon={<Users />} label="المستخدمون" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/videos" icon={<Video />} label="الفيديوهات" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/subscriptions" icon={<CreditCard />} label="الاشتراكات المالية" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/payments" icon={<CreditCard />} label="المدفوعات وميسر" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/codes" icon={<Ticket />} label="أكواد التفعيل" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/notifications" icon={<Bell />} label="الإشعارات الجماعية" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/support" icon={<MessageSquare />} label="الدعم الفني" isOpen={isSidebarOpen} />
                </nav>

                {/* Sidebar Footer */}
                <div className="p-5 border-t border-[#5AA564]/8 space-y-4">
                    <div className="flex items-center gap-3 bg-[#141830] p-3 rounded-2xl border border-[#5AA564]/10 overflow-hidden">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#5AA564]/20 to-[#4A8F53]/20 flex items-center justify-center font-black text-[#5AA564] text-sm border border-[#5AA564]/15 shrink-0">
                            {user?.email?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        {isSidebarOpen && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                                <p className="text-xs font-black text-white truncate">{user?.email}</p>
                                <p className="text-[9px] text-[#5AA564]/50 font-bold uppercase tracking-wider mt-0.5">مسؤول النظام</p>
                            </motion.div>
                        )}
                    </div>

                    <button
                        onClick={logout}
                        className={`w-full h-11 flex items-center justify-center gap-3 rounded-xl transition-all duration-300 font-bold text-xs
                            ${isSidebarOpen
                                ? 'bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/15'
                                : 'text-[#5AA564]/40 hover:text-rose-500 bg-[#1E2448]/50 border border-[#5AA564]/10'
                            }`}
                    >
                        <LogOut size={16} strokeWidth={2.5} />
                        {isSidebarOpen && <span>تسجيل الخروج</span>}
                    </button>
                </div>

                {/* Collapse Toggle */}
                <motion.button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                    className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#141830] border border-[#5AA564]/25 rounded-full flex items-center justify-center text-[#5AA564]/60 hover:text-[#5AA564] shadow-xl z-50 transition-colors"
                >
                    <ChevronRight size={13} strokeWidth={3} />
                </motion.button>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex flex-col h-screen min-w-0">
                {/* Header */}
                <header className="h-24 flex items-center justify-between px-10 shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#0A0D1A]/60 backdrop-blur-xl border-b border-[#5AA564]/8 z-[-1]" />

                    <div className="flex items-center gap-6">
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">{getPageTitle()}</h2>
                            <p className="text-[10px] font-bold text-[#5AA564]/40 mt-0.5 uppercase tracking-widest">مصحف أنامل للصم - نظام الإدارة المتكامل</p>
                        </div>
                        <div className="hidden lg:flex items-center gap-3 bg-[#141830]/80 border border-[#5AA564]/10 rounded-2xl px-5 h-11 group focus-within:ring-2 focus-within:ring-[#5AA564]/20 transition-all">
                            <Search size={16} className="text-[#5AA564]/30 group-focus-within:text-[#5AA564]" />
                            <input
                                type="text"
                                placeholder="ابحث في النظام..."
                                className="bg-transparent border-none outline-none text-sm font-medium text-white placeholder:text-[#5AA564]/20 w-56"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 bg-[#1E2448]/60 border border-[#5AA564]/10 rounded-xl text-[#5AA564]/50 hover:text-[#5AA564] hover:bg-[#5AA564]/5 transition-all relative"
                        >
                            <Bell size={18} strokeWidth={2} />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#5AA564] rounded-full ring-2 ring-[#0A0D1A]" />
                        </motion.button>

                        <div className="h-8 w-[1px] bg-[#5AA564]/10" />

                        <div className="flex items-center gap-2 px-4 py-2 bg-[#5AA564]/5 rounded-xl border border-[#5AA564]/15">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#5AA564] shadow-[0_0_8px_rgba(201,168,76,0.8)] animate-pulse" />
                            <span className="text-[10px] font-black text-[#5AA564] uppercase tracking-widest">متصل</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-[1440px] mx-auto p-10">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
