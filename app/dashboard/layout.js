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
import { useAuth } from '@/src/context/AuthContext';

const SidebarLink = ({ to, icon, label, isOpen }) => {
    const pathname = usePathname();
    const isActive = pathname === to;

    return (
        <Link href={to}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group
                    ${isActive
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    }`}
            >
                {isActive && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                    />
                )}
                <div className={`${isActive ? 'text-blue-500' : 'group-hover:text-blue-400'} transition-colors`}>
                    {icon}
                </div>
                {isOpen && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-medium text-sm"
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
        if (pathname === '/dashboard/subscriptions') return 'الاشتراكات';
        if (pathname === '/dashboard/videos') return 'إدارة المحتوى';
        return 'لوحة التحكم';
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex overflow-hidden font-sans" dir="rtl">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            {/* Sidebar */}
            <motion.aside
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-slate-900/40 backdrop-blur-xl border-l border-slate-800/50 flex flex-col shrink-0 z-20 relative h-screen transition-all duration-500"
            >
                <div className="p-8 flex items-center justify-between">
                    <AnimatePresence mode="wait">
                        {isSidebarOpen && (
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-3"
                            >
                                <BookOpen className="text-blue-500" size={28} />
                                <span>قرآن الإشارة</span>
                            </motion.h1>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
                    >
                        <ChevronRight className={`transform transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} size={20} />
                    </button>
                </div>

                <nav className="mt-8 flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard size={22} />} label="نظرة عامة" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/users" icon={<Users size={22} />} label="المستخدمين" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/subscriptions" icon={<CreditCard size={22} />} label="الاشتراكات" isOpen={isSidebarOpen} />
                    <SidebarLink to="/dashboard/videos" icon={<Video size={22} />} label="الفيديوهات" isOpen={isSidebarOpen} />
                </nav>

                <div className="p-6 border-t border-slate-800/50">
                    <div className="flex items-center gap-4 mb-6 px-2 overflow-hidden">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20 text-white shrink-0">
                            {user?.email?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="overflow-hidden text-right"
                            >
                                <p className="text-sm font-semibold truncate text-slate-100">{user?.email}</p>
                                <p className="text-xs text-slate-500">مسؤول النظام</p>
                            </motion.div>
                        )}
                    </div>
                    <button
                        onClick={logout}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all group overflow-hidden`}
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        {isSidebarOpen && <span>تسجيل الخروج</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 z-10 relative overflow-hidden h-screen">
                {/* Header */}
                <header className="h-20 border-b border-slate-800/40 bg-[#020617]/50 backdrop-blur-md flex items-center justify-between px-10 shrink-0">
                    <div className="flex items-center gap-6">
                        <h2 className="text-xl font-bold text-slate-100">{getPageTitle()}</h2>
                        <div className="hidden md:flex items-center gap-2 bg-slate-900/50 border border-slate-800/50 rounded-xl px-4 py-2 text-slate-500 group focus-within:border-blue-500/50 transition-all">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="ابحث عن أي شيء..."
                                className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-600 w-64"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950" />
                        </button>
                        <div className="h-8 w-[1px] bg-slate-800 mx-2" />
                        <span className="text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 flex items-center gap-2 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            النظام نشط
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-7xl mx-auto"
                    >
                        {children}
                    </motion.div>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1e293b;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #334155;
                }
            `}</style>
        </div>
    );
}
