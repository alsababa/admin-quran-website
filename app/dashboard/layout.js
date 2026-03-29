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
    Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
                        ? 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/25 shadow-[0_0_20px_rgba(201,168,76,0.12)]'
                        : 'text-[#C9A84C]/40 hover:text-white'
                    }`}
            >
                {isActive && (
                    <motion.div
                        layoutId="sidebar-active-pill"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#C9A84C] rounded-l-full shadow-[0_0_8px_rgba(201,168,76,0.6)]"
                    />
                )}
                <div className={`${isActive ? 'text-[#C9A84C]' : 'group-hover:text-[#C9A84C]'} transition-colors shrink-0`}>
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
                    <Loader2 size={36} className="text-[#C9A84C] animate-spin" />
                    <p className="text-[10px] font-black text-[#C9A84C]/40 uppercase tracking-widest">جاري التحقق من الهوية...</p>
                </div>
            </div>
        );
    }

    const getPageTitle = () => {
        if (pathname === '/dashboard') return 'لوحة التحكم';
        if (pathname === '/dashboard/users') return 'إدارة المستخدمين';
        if (pathname === '/dashboard/subscriptions') return 'الاشتراكات والفوترة';
        if (pathname === '/dashboard/videos') return 'إدارة المحتوى';
        return 'لوحة التحكم';
    };

    return (
        <div className="min-h-screen bg-[#0A0D1A] text-[#F5F0E8] flex overflow-hidden font-sans selection:bg-[#C9A84C]/30" dir="rtl">
            {/* Ambient Background Accents */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-[#C9A84C]/5 blur-[140px] rounded-full animate-glow-gold" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#1E2448]/60 blur-[140px] rounded-full animate-glow-gold" style={{ animationDelay: '-5s' }} />
                {/* Subtle Arabic geometric dot pattern */}
                <div className="absolute inset-0 arabic-pattern opacity-100" />
            </div>

            {/* Sidebar */}
            <motion.aside
                animate={{ width: isSidebarOpen ? 280 : 88 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel border-l border-[#C9A84C]/10 flex flex-col shrink-0 z-30 relative h-screen shadow-2xl"
            >
                {/* Sidebar Header */}
                <div className="h-24 flex items-center justify-between px-6 shrink-0 border-b border-[#C9A84C]/8">
                    <AnimatePresence mode="wait">
                        {isSidebarOpen ? (
                            <motion.div
                                key="open"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex items-center gap-3"
                            >
                                <div className="p-2.5 bg-gradient-to-br from-[#C9A84C] to-[#8B6F2E] rounded-2xl shadow-lg shadow-[#C9A84C]/20 text-[#0A0D1A]">
                                    <BookOpen size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <span className="text-base font-black tracking-tight bg-gradient-to-l from-[#F5F0E8] to-[#C9A84C] bg-clip-text text-transparent">قرآن الإشارة</span>
                                    <p className="text-[9px] font-bold text-[#C9A84C]/40 uppercase tracking-widest mt-0.5">Admin Panel</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="closed"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mx-auto p-2.5 bg-[#C9A84C]/10 rounded-2xl text-[#C9A84C] border border-[#C9A84C]/20"
                            >
                                <BookOpen size={22} strokeWidth={2.5} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="الرئيسية" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/users" icon={<Users />} label="المستخدمون" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/subscriptions" icon={<CreditCard />} label="الاشتراكات" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/videos" icon={<Video />} label="الفيديوهات" isOpen={isSidebarOpen} />
                </nav>

                {/* Sidebar Footer */}
                <div className="p-5 border-t border-[#C9A84C]/8 space-y-4">
                    <div className="flex items-center gap-3 bg-[#141830] p-3 rounded-2xl border border-[#C9A84C]/10 overflow-hidden">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#C9A84C]/20 to-[#8B6F2E]/20 flex items-center justify-center font-black text-[#C9A84C] text-sm border border-[#C9A84C]/15 shrink-0">
                            {user?.email?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        {isSidebarOpen && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                                <p className="text-xs font-black text-white truncate">{user?.email}</p>
                                <p className="text-[9px] text-[#C9A84C]/50 font-bold uppercase tracking-wider mt-0.5">مسؤول النظام</p>
                            </motion.div>
                        )}
                    </div>

                    <button
                        onClick={logout}
                        className={`w-full h-11 flex items-center justify-center gap-3 rounded-xl transition-all duration-300 font-bold text-xs
                            ${isSidebarOpen
                                ? 'bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/15'
                                : 'text-[#C9A84C]/40 hover:text-rose-500 bg-[#1E2448]/50 border border-[#C9A84C]/10'
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
                    className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#141830] border border-[#C9A84C]/25 rounded-full flex items-center justify-center text-[#C9A84C]/60 hover:text-[#C9A84C] shadow-xl z-50 transition-colors"
                >
                    <ChevronRight size={13} strokeWidth={3} />
                </motion.button>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex flex-col h-screen min-w-0">
                {/* Header */}
                <header className="h-24 flex items-center justify-between px-10 shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#0A0D1A]/60 backdrop-blur-xl border-b border-[#C9A84C]/8 z-[-1]" />

                    <div className="flex items-center gap-6">
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">{getPageTitle()}</h2>
                            <p className="text-[10px] font-bold text-[#C9A84C]/40 mt-0.5 uppercase tracking-widest">نظام الإدارة المتكامل</p>
                        </div>
                        <div className="hidden lg:flex items-center gap-3 bg-[#141830]/80 border border-[#C9A84C]/10 rounded-2xl px-5 h-11 group focus-within:ring-2 focus-within:ring-[#C9A84C]/20 transition-all">
                            <Search size={16} className="text-[#C9A84C]/30 group-focus-within:text-[#C9A84C]" />
                            <input
                                type="text"
                                placeholder="ابحث في النظام..."
                                className="bg-transparent border-none outline-none text-sm font-medium text-white placeholder:text-[#C9A84C]/20 w-56"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 bg-[#1E2448]/60 border border-[#C9A84C]/10 rounded-xl text-[#C9A84C]/50 hover:text-[#C9A84C] hover:bg-[#C9A84C]/5 transition-all relative"
                        >
                            <Bell size={18} strokeWidth={2} />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#C9A84C] rounded-full ring-2 ring-[#0A0D1A]" />
                        </motion.button>

                        <div className="h-8 w-[1px] bg-[#C9A84C]/10" />

                        <div className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C]/5 rounded-xl border border-[#C9A84C]/15">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_8px_rgba(201,168,76,0.8)] animate-pulse" />
                            <span className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest">متصل</span>
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
