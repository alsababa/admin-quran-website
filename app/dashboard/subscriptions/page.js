"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, TrendingUp, Calendar, User,
    Search, Star, CheckCircle2, Apple, Smartphone, Globe, Building2, BarChart3,
    Plus, Trash2, Shield, Loader2, X, AlertTriangle, ChevronDown, Filter,
    RefreshCcw, Clock, Download, Mail, ArrowLeft
} from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

// ── Shared Header Component ──────────────────────────────
const SectionHeader = ({ title, subtitle, accentColor = "#5AA564" }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="text-right">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter flex items-center justify-end gap-5">
                {title}
                <div 
                    className="w-2 h-12 rounded-full shadow-lg"
                    style={{ background: `linear-gradient(to bottom, ${accentColor}, transparent)` }} 
                />
            </h1>
            <p className="text-[#5AA564] font-black text-[11px] mt-4 tracking-[0.4em] uppercase opacity-40">{subtitle}</p>
        </div>
    </div>
);

// ── Shared Toast Component ────────────────────────────────
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-bold backdrop-blur-xl
            ${type === 'success'
                ? 'bg-[#5AA564]/10 border-[#5AA564]/20 text-[#5AA564]'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}
    >
        {type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-40 hover:opacity-100 transition-opacity"><X size={14} /></button>
    </motion.div>
);

// ── Shared Modal Backdrop ─────────────────────────────────
const ModalBackdrop = ({ onClick }) => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClick}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
    />
);

const MetricCard = ({ title, value, subtitle, icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card rounded-[2.5rem] p-8 flex items-center gap-6 relative overflow-hidden group bg-white shadow-xl hover:shadow-2xl transition-all"
    >
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-50 blur-2xl rounded-full group-hover:scale-110 transition-transform duration-700" />
        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[#5AA564] border border-gray-100 shrink-0 shadow-sm relative z-10">
            {React.cloneElement(icon, { size: 28, strokeWidth: 1.5 })}
        </div>
        <div className="text-right relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">{title}</p>
            <h4 className="text-3xl font-black text-gray-900 mt-1">{value}</h4>
            <p className="text-[10px] font-black text-[#5AA564] mt-1 uppercase tracking-widest opacity-40">{subtitle}</p>
        </div>
    </motion.div>
);

export default function SubscriptionsPage() {
    const { users, loading, upgradeUser, cancelSubscription, extendSubscription } = useUsers();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlatform, setFilterPlatform] = useState('all');
    const [filterType, setFilterType] = useState('all');
    
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [searchUserEmail, setSearchUserEmail] = useState('');
    const [selectedUserForUpgrade, setSelectedUserForUpgrade] = useState(null);
    const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const premiumUsers = users.filter(u => {
        const isPremium = u.subscriptionStatus === 'active';
        if (!isPremium) return false;

        const matchesSearch = u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             u.phoneNumber?.includes(searchTerm);
        const matchesPlatform = filterPlatform === 'all' || u.platform === filterPlatform;
        const matchesType = filterType === 'all' || u.accountType === filterType;

        return matchesSearch && matchesPlatform && matchesType;
    });

    const handleRevoke = async (user) => {
        if (!confirm(`هل أنت متأكد من إلغاء اشتراك ${user.displayName || user.email}؟`)) return;
        setIsProcessing(true);
        try {
            await cancelSubscription(user);
            showToast('تم إلغاء الاشتراك بنجاح');
        } catch (err) {
            showToast('فشل في إلغاء الاشتراك', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleExtend = async (user, days) => {
        setIsProcessing(true);
        try {
            await extendSubscription(user, days);
            showToast(`تم تجديد الاشتراك بنجاح لمدة ${days} يوم إضافي`);
        } catch (err) {
            showToast('فشل في تجديد الاشتراك', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleExportCSV = () => {
        const BOM = '\uFEFF';
        let csvContent = "الاسم,البريد الإلكتروني,نوع الحساب,المنصة,تاريخ الانتهاء\n";
        
        premiumUsers.forEach(user => {
            const name = user.displayName ? `"${user.displayName}"` : 'مستخدم مميز';
            const email = user.email ? `"${user.email}"` : 'غير متوفر';
            const accountType = user.accountType === 'entity' ? 'جهة / منظمة' : 'حساب فردي';
            const platform = user.platform || 'غير محدد';
            const endDate = user.endDate 
                ? new Date(user.endDate.seconds ? user.endDate.seconds * 1000 : user.endDate).toLocaleDateString('ar-SA') 
                : 'غير محدد';
                
            csvContent += `${name},${email},${accountType},${platform},${endDate}\n`;
        });

        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `subscriptions_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('تم تصدير البيانات بنجاح 📊');
    };

    const handleSuggestRenewal = (user) => {
        const subject = encodeURIComponent("اقتراح تجديد اشتراكك في مصحف أنامل");
        const body = encodeURIComponent(`أهلاً ${user.displayName || 'بك'}،\n\nنأمل أنك تستمتع بتجربتك مع منصة مصحف أنامل.\n\nلقد قارب اشتراكك على الانتهاء، ونود تذكيرك بتجديد اشتراكك لضمان عدم انقطاع الخدمة المميزة عنك.\n\nيمكنك التجديد من خلال التطبيق أو الموقع.\n\nتحياتنا،\nفريق مصحف أنامل`);
        window.open(`mailto:${user.email}?subject=${subject}&body=${body}`);
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <SectionHeader 
                    title="تقارير الاشتراكات" 
                    subtitle="Premium Subscription Analytics" 
                />
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="h-15 px-8 bg-[#5AA564] text-white font-black rounded-[2rem] shadow-xl shadow-[#5AA564]/10 hover:bg-gray-900 transition-all active:scale-95 flex items-center gap-3 shrink-0"
                    >
                        <Plus size={20} strokeWidth={3} />
                        <span className="text-sm">اشتراك يدوي جديد</span>
                    </button>
                    <div className="flex items-center gap-3 px-6 py-2 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-[#5AA564] animate-pulse shadow-[0_0_12px_rgba(90,165,100,0.5)]" />
                        <span className="text-[10px] font-black text-[#5AA564] uppercase tracking-[0.2em]">Live Registry</span>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricCard 
                    title="إجمالي المميزين" 
                    value={loading ? '...' : users.filter(u => u.subscriptionStatus === 'active').length} 
                    subtitle="TOTAL ACTIVE PREMIUM" 
                    icon={<Star />} 
                    delay={0.1} 
                />
                <MetricCard 
                    title="حسابات الجهات" 
                    value={loading ? '...' : users.filter(u => u.subscriptionStatus === 'active' && u.accountType === 'entity').length} 
                    subtitle="ORGANIZATIONAL UNITS" 
                    icon={<Building2 />} 
                    delay={0.2} 
                />
                <MetricCard 
                    title="نظام iOS" 
                    value={loading ? '...' : users.filter(u => u.subscriptionStatus === 'active' && u.platform === 'ios').length} 
                    subtitle="APPLE ECOSYSTEM" 
                    icon={<Apple />} 
                    delay={0.3} 
                />
                <MetricCard 
                    title="نظام Android" 
                    value={loading ? '...' : users.filter(u => u.subscriptionStatus === 'active' && u.platform === 'android').length} 
                    subtitle="GOOGLE PLAY USERS" 
                    icon={<Smartphone />} 
                    delay={0.4} 
                />
            </div>

            {/* Content Controls */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:max-w-4xl">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5AA564] transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="ابحث بالاسم، البريد، أو الهاتف..." 
                            className="w-full h-15 bg-white border border-gray-100 rounded-[2rem] pr-14 pl-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#5AA564]/30 shadow-sm transition-all" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-4 w-full sm:w-auto">
                        <select 
                            value={filterPlatform}
                            onChange={(e) => setFilterPlatform(e.target.value)}
                            className="flex-1 sm:flex-none h-15 px-6 bg-white border border-gray-100 rounded-[2rem] text-[10px] font-black text-gray-400 uppercase tracking-widest outline-none cursor-pointer hover:border-[#5AA564]/20 transition-all shadow-sm"
                        >
                            <option value="all">كل المنصات</option>
                            <option value="ios">Apple Store</option>
                            <option value="android">Google Play</option>
                            <option value="manual">Manual Entry</option>
                        </select>

                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="flex-1 sm:flex-none h-15 px-6 bg-white border border-gray-100 rounded-[2rem] text-[10px] font-black text-gray-400 uppercase tracking-widest outline-none cursor-pointer hover:border-[#5AA564]/20 transition-all shadow-sm"
                        >
                            <option value="all">كل التصنيفات</option>
                            <option value="individual">الأفراد</option>
                            <option value="entity">الجهات</option>
                        </select>
                    </div>
                </div>

                <button 
                    onClick={handleExportCSV}
                    className="w-full lg:w-auto h-15 px-8 bg-gray-900 border border-gray-800 text-white font-black rounded-[2rem] hover:bg-[#5AA564] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 group"
                >
                    <Download size={20} className="text-[#5AA564] group-hover:text-white transition-colors" />
                    <span className="text-[11px] uppercase tracking-[0.2em]">Export Ledger (CSV)</span>
                </button>
            </div>

            {/* Main Table Panel */}
            <div className="glass-panel rounded-[3.5rem] overflow-hidden border-gray-100 shadow-2xl bg-white/50 backdrop-blur-xl">
                <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-right">
                        <h4 className="font-black text-gray-900 text-lg flex items-center gap-4 justify-end">
                             مشترك مستهدف {premiumUsers.length}
                            <BarChart3 size={22} className="text-[#5AA564]" />
                        </h4>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-1">ACTIVE SUBSCRIBER DISTRIBUTION</p>
                    </div>
                    <div className="flex items-center gap-4">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort by expiry</span>
                         <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">عضوية المشترك</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 text-center">نوع الباقة</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 text-center">منصة الوصول</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">نهاية الصلاحية</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 text-left">أدوات التحكم</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-10 py-7"><div className="h-12 w-64 bg-gray-50 rounded-2xl" /></td>
                                        <td className="px-10 py-7"><div className="h-8 w-28 bg-gray-50 rounded-full mx-auto" /></td>
                                        <td className="px-10 py-7"><div className="h-8 w-32 bg-gray-50 rounded-full mx-auto" /></td>
                                        <td className="px-10 py-7"><div className="h-8 w-24 bg-gray-50 rounded-2xl" /></td>
                                        <td className="px-10 py-7"><div className="h-10 w-36 bg-gray-50 rounded-xl ml-auto" /></td>
                                    </tr>
                                ))
                            ) : premiumUsers.map((user, idx) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="group hover:bg-[#5AA564]/5 transition-all cursor-pointer"
                                    onClick={() => setSelectedUserForDetails(user)}
                                >
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="h-12 w-12 rounded-[1.2rem] bg-gray-50 flex items-center justify-center font-black text-[#5AA564] text-sm border border-gray-100 shadow-sm group-hover:bg-white transition-colors">
                                                {user.displayName?.charAt(0) || 'U'}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-black text-gray-900 text-base leading-none mb-1.5">{user.displayName || 'مستخدم مميز'}</p>
                                                <p className="text-[11px] font-bold text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <div className={`inline-flex px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest shadow-sm
                                            ${user.accountType === 'entity' ? 'bg-blue-50 border-blue-100 text-blue-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                            {user.accountType === 'entity' ? 'جهة / مؤسسة' : 'حساب فردي'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2.5 text-gray-400 font-black uppercase text-[10px] tracking-wider">
                                            {user.platform === 'ios' && <Apple size={15} className="text-gray-900" />}
                                            {user.platform === 'android' && <Smartphone size={15} className="text-emerald-500" />}
                                            {(user.platform === 'manual' || !user.platform) && <Globe size={15} className="text-blue-500" />}
                                            <span>{user.platform || 'WEB'}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                                            <Calendar size={16} className="text-gray-200" />
                                            <span>
                                                {user.endDate 
                                                    ? new Date(user.endDate.seconds ? user.endDate.seconds * 1000 : user.endDate).toLocaleDateString('ar-SA') 
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center justify-start gap-3">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleSuggestRenewal(user); }}
                                                className="h-11 w-11 flex items-center justify-center bg-white border border-gray-100 rounded-xl text-gray-300 hover:text-[#5AA564] hover:shadow-md transition-all active:scale-90"
                                                title="إرسال تذكير بالبريد"
                                            >
                                                <Mail size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleExtend(user, 30); }}
                                                className="h-11 w-11 flex items-center justify-center bg-white border border-gray-100 rounded-xl text-gray-300 hover:text-emerald-500 hover:shadow-md transition-all active:scale-90"
                                                title="+30 يوم"
                                            >
                                                <RefreshCcw size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleRevoke(user); }}
                                                className="h-11 w-11 flex items-center justify-center bg-white border border-gray-100 rounded-xl text-gray-300 hover:text-rose-500 hover:shadow-md transition-all active:scale-90"
                                                title="إلغاء الاشتراك"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Controls */}
                <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                        Refining {premiumUsers.length} active premium records
                    </p>
                    <div className="flex gap-2">
                         <button className="h-11 w-11 flex items-center justify-center bg-white border border-gray-100 rounded-[1rem] text-gray-300 hover:text-gray-900 transition-all rotate-180"><ArrowLeft size={16} /></button>
                         <div className="h-11 px-6 flex items-center justify-center bg-white border border-[#5AA564]/30 rounded-[1rem] text-[#5AA564] text-[11px] font-black shadow-sm tracking-[0.1em]">PAGE 01</div>
                         <button className="h-11 w-11 flex items-center justify-center bg-white border border-gray-100 rounded-[1rem] text-gray-300 hover:text-gray-900 transition-all"><ArrowLeft size={16} className="rotate-180" /></button>
                    </div>
                </div>
            </div>

            {/* Manual Upgrade Modal */}
            <AnimatePresence>
                {isUpgradeModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-right" dir="rtl">
                        <ModalBackdrop onClick={() => setIsUpgradeModalOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-panel w-full max-w-md rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl bg-white/95 backdrop-blur-3xl"
                        >
                            <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-[#5AA564]/40 to-transparent" />
                            <button onClick={() => setIsUpgradeModalOpen(false)} className="absolute top-8 left-8 text-gray-300 hover:text-gray-900 transition-colors"><X size={24} /></button>

                            <div className="flex items-center gap-5 mb-10">
                                <div className="h-16 w-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#5AA564] shadow-sm">
                                    <Shield size={32} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black text-gray-900 tracking-tight">ترقية يدوية</h4>
                                    <p className="text-[#5AA564] text-[11px] font-black uppercase tracking-widest mt-1 opacity-40">تفعيل العضوية المميزة لمحبينا</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mr-1">ابحث بالبريد الإلكتروني للعميل</label>
                                    <div className="flex gap-3">
                                        <input 
                                            type="text" 
                                            placeholder="example@mail.com" 
                                            className="flex-1 h-15 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#5AA564]/30 shadow-sm transition-all" 
                                            value={searchUserEmail}
                                            onChange={(e) => setSearchUserEmail(e.target.value)}
                                        />
                                        <button 
                                            onClick={() => {
                                                const u = users.find(u => u.email?.toLowerCase() === searchUserEmail.toLowerCase().trim());
                                                if (u) setSelectedUserForUpgrade(u);
                                                else alert('المستخدم غير موجود بالنظام!');
                                            }}
                                            className="h-15 px-6 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#5AA564] transition-all active:scale-90"
                                        >
                                            ابحث
                                        </button>
                                    </div>
                                </div>

                                {selectedUserForUpgrade && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 15 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        className="p-8 rounded-[2.5rem] bg-emerald-50/50 border border-emerald-100 shadow-sm"
                                    >
                                        <div className="flex items-center gap-5 mb-8">
                                            <div className="h-14 w-14 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-xl font-black text-[#5AA564] shadow-sm">
                                                {selectedUserForUpgrade.displayName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-gray-900">{selectedUserForUpgrade.displayName || 'User Found'}</p>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{selectedUserForUpgrade.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button 
                                                onClick={() => handleUpgradeFoundUser(selectedUserForUpgrade, 'individual')}
                                                disabled={isProcessing}
                                                className="h-14 bg-[#5AA564] text-white font-black rounded-2xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/10 active:scale-95"
                                            >
                                                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <><User size={16} /> تفعيل فردي</>}
                                            </button>
                                            <button 
                                                onClick={() => handleUpgradeFoundUser(selectedUserForUpgrade, 'entity')}
                                                disabled={isProcessing}
                                                className="h-14 bg-white border border-emerald-200 text-[#5AA564] font-black rounded-2xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-sm active:scale-95"
                                            >
                                                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <><Building2 size={16} /> تفعيل جهة</>}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Deep User Detail Modal */}
            <AnimatePresence>
                {selectedUserForDetails && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 text-right" dir="rtl">
                        <ModalBackdrop onClick={() => setSelectedUserForDetails(null)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="glass-panel w-full max-w-2xl rounded-[4rem] p-12 relative overflow-hidden shadow-3xl bg-white/95 backdrop-blur-3xl"
                        >
                            <div className="absolute top-0 left-12 right-12 h-[1.5px] bg-gradient-to-r from-transparent via-[#5AA564]/40 to-transparent" />
                            <button onClick={() => setSelectedUserForDetails(null)} className="absolute top-10 left-10 text-gray-300 hover:text-gray-900 transition-colors"><X size={28} /></button>

                            <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                                <div className="h-32 w-32 rounded-[3.5rem] bg-gray-50 border-4 border-white flex items-center justify-center text-6xl font-black text-[#5AA564] shadow-2xl relative">
                                    {selectedUserForDetails.displayName?.charAt(0) || 'U'}
                                    <div className="absolute -bottom-1 -right-1 h-10 w-10 bg-[#5AA564] rounded-2xl border-4 border-white flex items-center justify-center text-white">
                                        <Star size={20} fill="currentColor" />
                                    </div>
                                </div>
                                <div className="text-center md:text-right">
                                    <h4 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">{selectedUserForDetails.displayName || 'Premium Legend'}</h4>
                                    <p className="text-[#5AA564] font-black text-[12px] uppercase tracking-[0.2em] opacity-80">{selectedUserForDetails.email}</p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                                        <div className="px-5 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl text-[10px] font-black text-[#5AA564] uppercase tracking-widest shadow-sm">SRC: {selectedUserForDetails.source || 'GLOBAL'}</div>
                                        <div className="px-5 py-2 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">PLA: {selectedUserForDetails.platform || 'NATIVE'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                                <div className="p-8 rounded-[2.5rem] bg-gray-50/50 border border-gray-100 shadow-sm group hover:bg-white transition-all">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-2 group-hover:text-[#5AA564] transition-colors">Authentication Hash</p>
                                    <p className="text-xs font-mono font-bold text-gray-900 truncate">{selectedUserForDetails.id}</p>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-gray-50/50 border border-gray-100 shadow-sm group hover:bg-white transition-all">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-2 group-hover:text-[#5AA564] transition-colors">Account Classification</p>
                                    <p className="text-lg font-black text-gray-900 uppercase">{selectedUserForDetails.accountType === 'entity' ? 'Organization (B2B)' : 'Individual Pro'}</p>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-gray-50/50 border border-gray-100 shadow-sm sm:col-span-2 group hover:bg-white transition-all">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-2 group-hover:text-[#5AA564] transition-colors">Current Subscription Cycle Expiry</p>
                                    <p className="text-2xl font-black text-gray-900 italic">
                                        {selectedUserForDetails.endDate 
                                            ? new Date(selectedUserForDetails.endDate.seconds ? selectedUserForDetails.endDate.seconds * 1000 : selectedUserForDetails.endDate).toLocaleDateString('ar-SA', { dateStyle: 'full' }) 
                                            : 'NO EXPIRY DATE SET'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => { handleSuggestRenewal(selectedUserForDetails); setSelectedUserForDetails(null); }}
                                    className="flex-1 h-16 bg-gray-900 text-white rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest hover:bg-[#5AA564] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
                                >
                                    <Mail size={22} className="opacity-60" />
                                    <span>ارسال ملف تذكيري</span>
                                </button>
                                <button 
                                    onClick={() => { handleRevoke(selectedUserForDetails); setSelectedUserForDetails(null); }}
                                    className="h-16 px-8 bg-rose-50 text-rose-500 border border-rose-100 rounded-[1.5rem] hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                                    title="Revoke Permission"
                                >
                                    <Trash2 size={24} strokeWidth={1.5} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Global Toast System */}
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
}
