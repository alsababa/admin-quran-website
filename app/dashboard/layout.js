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
    Ticket,
    Building2,
    AlertTriangle,
    Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/context/AuthContext';
import { useAdminAlerts } from '@/hooks/useAdminAlerts';

const SidebarLink = ({ to, icon, label, isOpen }) => {
    const pathname = usePathname();
    const isActive = pathname === to;

    return (
        <Link href={to} className="block group">
            <motion.div
                whileHover={{ x: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden
                    ${isActive
                        ? 'bg-white text-[#5AA564] border border-[#5AA564]/10 shadow-[0_10px_25px_-5px_rgba(90,165,100,0.15),0_8px_10px_-6px_rgba(0,0,0,0.02)] scale-[1.02]'
                        : 'text-gray-400 hover:text-gray-900 border border-transparent hover:bg-gray-50/50'
                    }`}
            >
                <div className={`${isActive ? 'text-[#5AA564]' : 'group-hover:text-gray-900'} transition-colors shrink-0`}>
                    {React.cloneElement(icon, { size: 20, strokeWidth: isActive ? 2.5 : 2 })}
                </div>
                {isOpen && (
                    <motion.span
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`text-sm tracking-tight ${isActive ? 'font-black' : 'font-bold'}`}
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
    const { alerts, unreadCount } = useAdminAlerts();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
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
            <div className="min-h-screen bg-white flex items-center justify-center">
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
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 flex overflow-hidden font-sans selection:bg-[#5AA564]/10" dir="rtl">
            {/* Ambient Background Accents */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#5AA564]/3 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/3 blur-[120px] rounded-full" />
                {/* Subtle dot pattern */}
                <div className="absolute inset-0 arabic-pattern opacity-[0.4]" />
            </div>

            {/* Sidebar */}
            <motion.aside
                animate={{ width: isSidebarOpen ? 280 : 88 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border-l border-gray-100 flex flex-col shrink-0 z-30 relative h-screen shadow-[10px_0_50px_rgba(0,0,0,0.02)]"
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
                                    <span className="text-base font-black tracking-tighter bg-gradient-to-l from-gray-900 via-gray-800 to-[#5AA564] bg-clip-text text-transparent">أنامل القرآني</span>
                                    <p className="text-[9px] font-black text-[#5AA564] uppercase tracking-[0.2em] mt-0.5">Premium Terminal</p>
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
                <div className="p-5 border-t border-gray-50 space-y-4">
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#5AA564]/10 to-[#4A8F53]/5 flex items-center justify-center font-black text-[#5AA564] text-sm border border-[#5AA564]/10 shrink-0">
                            {user?.email?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        {isSidebarOpen && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                                <p className="text-xs font-black text-gray-900 truncate">{user?.email}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">مسؤول النظام</p>
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
                    className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-300 hover:text-[#5AA564] shadow-lg z-50 transition-colors"
                >
                    <ChevronRight size={13} strokeWidth={3} />
                </motion.button>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex flex-col h-screen min-w-0">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-10 shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl border-b border-gray-100/50 z-[-1]" />

                    <div className="flex items-center gap-6">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">{getPageTitle()}</h2>
                            <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">مصحف أنامل للصم - نظام الإدارة المتكامل</p>
                        </div>
                        <div className="hidden lg:flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-5 h-11 group focus-within:ring-2 focus-within:ring-[#5AA564]/10 transition-all">
                            <Search size={16} className="text-gray-300 group-focus-within:text-[#5AA564]" />
                            <input
                                type="text"
                                placeholder="ابحث في النظام..."
                                className="bg-transparent border-none outline-none text-sm font-medium text-gray-900 placeholder:text-gray-300 w-56"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className={`p-2.5 rounded-xl transition-all relative border
                                ${isNotificationsOpen 
                                    ? 'bg-[#5AA564] text-white border-[#5AA564]' 
                                    : 'bg-white border-gray-100 text-gray-400 hover:text-[#5AA564] hover:bg-gray-50'}`}
                        >
                            <Bell size={18} strokeWidth={2} />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-[#5AA564] rounded-full ring-2 ring-white animate-pulse" />
                            )}
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

            {/* Notifications Drawer */}
            <AnimatePresence>
                {isNotificationsOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsNotificationsOpen(false)}
                            className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: 400 }}
                            animate={{ x: 0 }}
                            exit={{ x: 400 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-full max-w-sm bg-white border-r border-gray-100 z-[110] flex flex-col shadow-2xl"
                        >
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="text-xl font-black text-gray-900">إشعارات النظام</h3>
                                <button 
                                    onClick={() => setIsNotificationsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-gray-50 text-gray-300 transition-colors"
                                >
                                    <ChevronRight size={20} className="rotate-180" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                {alerts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 opacity-30">
                                        <Bell size={40} className="mb-4" />
                                        <p className="text-xs font-bold uppercase tracking-widest">لا توجد إشعارات حالية</p>
                                    </div>
                                ) : (
                                    alerts.map((alert) => (
                                        <motion.div
                                            key={alert.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-5 rounded-2xl border backdrop-blur-xl group cursor-pointer hover:scale-[1.02] transition-all
                                                ${alert.type === 'urgent' 
                                                    ? 'bg-rose-50 border-rose-100' 
                                                    : alert.type === 'warning'
                                                    ? 'bg-amber-50 border-amber-100'
                                                    : 'bg-[#5AA564]/5 border-gray-100'}`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`p-2.5 rounded-xl border shrink-0
                                                    ${alert.type === 'urgent' 
                                                        ? 'bg-rose-100 border-rose-200 text-rose-500' 
                                                        : alert.type === 'warning'
                                                        ? 'bg-amber-100 border-amber-200 text-amber-600'
                                                        : 'bg-[#5AA564]/10 border-[#5AA564]/20 text-[#5AA564]'}`}>
                                                    {alert.category === 'codes' ? <Ticket size={18} /> : 
                                                     alert.category === 'stock' ? <Building2 size={18} /> : 
                                                     <MessageSquare size={18} />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-xs font-black text-gray-900 mb-1">{alert.title}</h4>
                                                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed text-right">{alert.message}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
