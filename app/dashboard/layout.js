"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    Search
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
                        ? 'bg-[#8FB394]/10 text-[#8FB394] border border-[#8FB394]/20 shadow-[0_0_20px_rgba(143,179,148,0.1)]'
                        : 'text-[#8FB394]/40 hover:text-white'
                    }`}
            >
                {isActive && (
                    <motion.div
                        layoutId="sidebar-active-pill"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#8FB394] rounded-l-full"
                    />
                )}
                <div className={`${isActive ? 'text-[#8FB394]' : 'group-hover:text-[#8FB394]'} transition-colors shrink-0`}>
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
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname === '/dashboard') return 'نظرة عامة';
        if (pathname === '/dashboard/users') return 'إدارة المستخدمين';
        if (pathname === '/dashboard/subscriptions') return 'الاشتراكات والفوترة';
        if (pathname === '/dashboard/videos') return 'إدارة المحتوى والميديا';
        return 'لوحة التحكم';
    };

    return (
        <div className="min-h-screen bg-[#0D1510] text-[#F5F2ED] flex overflow-hidden font-sans selection:bg-[#8FB394]/30" dir="rtl">
            {/* Ambient Brand Background Accents */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-[#8FB394]/5 blur-[120px] rounded-full animate-glow-sage" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#4A6351]/5 blur-[120px] rounded-full animate-glow-sage" style={{ animationDelay: '-5s' }} />
            </div>

            {/* Premium Sidebar */}
            <motion.aside
                animate={{ width: isSidebarOpen ? 280 : 96 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel border-l border-[#8FB394]/10 flex flex-col shrink-0 z-30 relative h-screen shadow-3xl"
            >
                {/* Sidebar Header */}
                <div className="h-28 flex items-center justify-between px-7 shrink-0 border-b border-[#8FB394]/5">
                    <AnimatePresence mode="wait">
                        {isSidebarOpen ? (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex items-center gap-3"
                            >
                                <div className="p-2.5 bg-gradient-to-br from-[#8FB394] to-[#4A6351] rounded-2xl shadow-lg shadow-[#8FB394]/10 text-white">
                                    <BookOpen size={24} strokeWidth={2.5} />
                                </div>
                                <span className="text-lg font-black tracking-tight bg-gradient-to-l from-[#F5F2ED] to-[#8FB394] bg-clip-text text-transparent uppercase">قرآن الإشارة</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mx-auto p-2.5 bg-[#8FB394]/10 rounded-2xl text-[#8FB394] border border-[#8FB394]/20"
                            >
                                <BookOpen size={24} strokeWidth={2.5} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 py-8 px-4 space-y-3 overflow-y-auto custom-scrollbar">
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="لوحة التحكم" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/users" icon={<Users />} label="المستخدمين" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/subscriptions" icon={<CreditCard />} label="الاشتراكات" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/videos" icon={<Video />} label="الفيديوهات" isOpen={isSidebarOpen} />
                </nav>

                {/* Sidebar Footer */}
                <div className="p-6 border-t border-[#8FB394]/5 space-y-6">
                    <div className="flex items-center gap-4 bg-[#0D1510]/60 p-3 rounded-2xl border border-[#8FB394]/10 overflow-hidden">
                        <div className="h-10 w-10 rounded-xl bg-[#4A6351]/20 flex items-center justify-center font-black text-[#8FB394] text-sm border border-[#8FB394]/10 shrink-0">
                            {user?.email?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        {isSidebarOpen && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                                <p className="text-xs font-black text-white truncate">{user?.email}</p>
                                <p className="text-[10px] text-[#8FB394]/50 font-bold uppercase tracking-wider mt-0.5">مسؤول النظام</p>
                            </motion.div>
                        )}
                    </div>

                    <button
                        onClick={logout}
                        className={`w-full h-12 flex items-center justify-center gap-3 rounded-xl transition-all duration-300 font-bold text-xs
                            ${isSidebarOpen
                                ? 'bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/10'
                                : 'text-[#8FB394]/40 hover:text-rose-500 bg-[#4A6351]/10 border border-[#8FB394]/10'
                            }`}
                    >
                        <LogOut size={18} strokeWidth={2.5} />
                        {isSidebarOpen && <span>تسجيل الخروج</span>}
                    </button>
                </div>

                {/* Collapse Toggle */}
                <motion.button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#0D1510] border border-[#8FB394]/20 rounded-full flex items-center justify-center text-[#8FB394]/60 hover:text-[#8FB394] shadow-xl z-50 transition-colors"
                >
                    <ChevronRight size={14} strokeWidth={3} />
                </motion.button>
            </motion.aside>

            {/* Main Canvas Area */}
            <main className="flex-1 relative z-10 flex flex-col h-screen min-w-0">
                {/* Designer Header */}
                <header className="h-28 flex items-center justify-between px-12 shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#0D1510]/40 backdrop-blur-xl border-b border-[#8FB394]/5 z-[-1]" />

                    <div className="flex items-center gap-8">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">{getPageTitle()}</h2>
                            <p className="text-xs font-bold text-[#8FB394]/50 mt-1 uppercase tracking-widest leading-none">مرحباً بك مجدداً في نظام الإدارة</p>
                        </div>
                        <div className="hidden lg:flex items-center gap-3 bg-[#0D1510]/50 border border-[#8FB394]/10 rounded-2xl px-5 h-12 group focus-within:ring-2 focus-within:ring-[#8FB394]/20 transition-all">
                            <Search size={18} className="text-[#8FB394]/40 group-focus-within:text-[#8FB394]" />
                            <input
                                type="text"
                                placeholder="ابحث في النظام..."
                                className="bg-transparent border-none outline-none text-sm font-medium text-white placeholder:text-[#8FB394]/20 w-64"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 bg-[#4A6351]/10 border border-[#8FB394]/10 rounded-2xl text-[#8FB394]/60 hover:text-[#8FB394] hover:bg-[#8FB394]/5 transition-all relative"
                        >
                            <Bell size={20} strokeWidth={2} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#8FB394] rounded-full ring-4 ring-[#0D1510]/20" />
                        </motion.button>

                        <div className="h-10 w-[1px] bg-[#8FB394]/10" />

                        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#8FB394]/5 rounded-2xl border border-[#8FB394]/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#8FB394] shadow-[0_0_10px_rgba(143,179,148,0.8)] animate-pulse" />
                            <span className="text-[10px] font-black text-[#8FB394] uppercase tracking-widest">متصل بالخادم</span>
                        </div>
                    </div>
                </header>

                {/* Page Viewport */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-[1440px] mx-auto p-12">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
