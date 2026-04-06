"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, TrendingUp, Calendar, User,
    Search, Star, CheckCircle2, Apple, Smartphone, Globe, Building2, BarChart3,
    Plus, Trash2, Shield, Loader2, X, AlertTriangle, ChevronDown, Filter,
    RefreshCcw, Clock, Download, Mail
} from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

// ── Toast Notification (Shared Component) ───────────────────
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-bold backdrop-blur-xl
            ${type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}
    >
        {type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X size={14} /></button>
    </motion.div>
);

const MetricCard = ({ title, value, subtitle, icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden group"
    >
        <div className="absolute -top-6 -right-6 h-20 w-20 bg-[#14B8A6]/5 blur-2xl rounded-full group-hover:bg-[#14B8A6]/10 transition-all" />
        <div className="h-13 w-13 rounded-2xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] border border-[#14B8A6]/20 shrink-0">
            {React.cloneElement(icon, { size: 22, strokeWidth: 2 })}
        </div>
        <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#14B8A6]/40">{title}</p>
            <h4 className="text-2xl font-black text-white mt-0.5">{value}</h4>
            <p className="text-[9px] font-bold text-[#14B8A6]/30 mt-1">{subtitle}</p>
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
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Filtered Premium Users
    const premiumUsers = users.filter(u => {
        const isPremium = u.subscriptionStatus === 'active';
        if (!isPremium) return false;

        const matchesSearch = u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             u.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
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
        // Add BOM for UTF-8 Arabic support
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

    const handleUpgradeFoundUser = async (user, type, orgId) => {
        setIsProcessing(true);
        try {
            await upgradeUser(user, type, orgId);
            setIsUpgradeModalOpen(false);
            setSelectedUserForUpgrade(null);
            setSearchUserEmail('');
            showToast('تمت ترقية المستخدم بنجاح ✨');
        } catch (err) {
            showToast('فشل ترقية المستخدم', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Toast */}
            <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="text-right">
                    <h3 className="text-4xl font-black text-white tracking-tighter">تقارير الاشتراكات</h3>
                    <p className="text-[#14B8A6]/40 font-bold text-sm mt-2">تحليل وإدارة أداء الاشتراكات القادمة من كافة المنصات.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="h-13 px-7 py-3.5 bg-[#14B8A6] hover:bg-[#E8C97A] text-[#0A0D1A] font-black rounded-2xl shadow-xl shadow-[#14B8A6]/20 active:scale-95 transition-all flex items-center gap-2.5"
                    >
                        <Plus size={19} strokeWidth={3} />
                        <span className="text-xs">اشتراك يدوي</span>
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
                        <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-wider">تحديث حي</span>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard 
                    title="إجمالي المميزين" 
                    value={loading ? '...' : users.filter(u => u.subscriptionStatus === 'active').length} 
                    subtitle="كافة المنصات" 
                    icon={<Star />} 
                    delay={0.1} 
                />
                <MetricCard 
                    title="حسابات الجهات" 
                    value={loading ? '...' : users.filter(u => u.subscriptionStatus === 'active' && u.accountType === 'entity').length} 
                    subtitle="منظمات نشطة" 
                    icon={<Building2 />} 
                    delay={0.2} 
                />
                <MetricCard 
                    title="اشتراكات أيفون" 
                    value={loading ? '...' : users.filter(u => u.subscriptionStatus === 'active' && u.platform === 'ios').length} 
                    subtitle="App Store" 
                    icon={<Apple />} 
                    delay={0.3} 
                />
                <MetricCard 
                    title="اشتراكات أندرويد" 
                    value={loading ? '...' : users.filter(u => u.subscriptionStatus === 'active' && u.platform === 'android').length} 
                    subtitle="Google Play" 
                    icon={<Smartphone />} 
                    delay={0.4} 
                />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-1 max-w-2xl">
                    <div className="relative flex-1 group">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-[#14B8A6]/30 group-focus-within:text-[#14B8A6] transition-colors" size={17} />
                        <input 
                            type="text" 
                            placeholder="بحث عن مشترك..." 
                            className="w-full h-13 glass-input rounded-2xl pr-14 pl-6 py-3.5 text-sm font-medium text-white focus:border-[#14B8A6]/40 transition-all" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <select 
                        value={filterPlatform}
                        onChange={(e) => setFilterPlatform(e.target.value)}
                        className="h-13 px-5 glass-panel border-[#14B8A6]/10 rounded-2xl text-[10px] font-black text-[#14B8A6]/60 uppercase tracking-widest outline-none cursor-pointer hover:border-[#14B8A6]/30 transition-all"
                    >
                        <option value="all">كل المنصات</option>
                        <option value="ios">Apple Store</option>
                        <option value="android">Google Play</option>
                        <option value="manual">يدوي / أخرى</option>
                    </select>

                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="h-13 px-5 glass-panel border-[#14B8A6]/10 rounded-2xl text-[10px] font-black text-[#14B8A6]/60 uppercase tracking-widest outline-none cursor-pointer hover:border-[#14B8A6]/30 transition-all"
                    >
                        <option value="all">كل الأنواع</option>
                        <option value="individual">أفراد</option>
                        <option value="entity">جهات</option>
                    </select>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={handleExportCSV}
                        className="h-13 px-6 glass-panel border-[#14B8A6]/20 hover:bg-[#14B8A6]/10 text-white font-bold rounded-2xl transition-all flex items-center gap-2"
                    >
                        <Download size={16} className="text-[#14B8A6]" />
                        <span className="text-xs">تصدير CSV</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="glass-panel rounded-[2.5rem] overflow-hidden border-[#14B8A6]/10 shadow-2xl">
                <div className="px-9 py-6 border-b border-[#14B8A6]/8 bg-[#14B8A6]/3 flex justify-between items-center">
                    <p className="text-[9px] font-black text-[#14B8A6]/40 uppercase tracking-[0.2em]">
                        قائمة الأعضاء النشطين ({premiumUsers.length})
                    </p>
                    <h4 className="font-extrabold text-white text-base flex items-center gap-3">
                        <BarChart3 size={18} className="text-[#14B8A6]" />
                        توزيع المشتركين
                    </h4>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-[#14B8A6]/8">
                                <th className="px-9 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/40">المشترك</th>
                                <th className="px-9 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/40 text-center">نوع الحساب</th>
                                <th className="px-9 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/40 text-center">المنصة</th>
                                <th className="px-9 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/40">تاريخ الانتهاء</th>
                                <th className="px-9 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/40 text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#14B8A6]/5">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-9 py-5"><div className="h-10 w-40 bg-[#1E2448]/60 rounded-xl" /></td>
                                        <td className="px-9 py-5"><div className="h-8 w-24 bg-[#1E2448]/60 rounded-xl mx-auto" /></td>
                                        <td className="px-9 py-5"><div className="h-8 w-32 bg-[#1E2448]/60 rounded-xl mx-auto" /></td>
                                        <td className="px-9 py-5"><div className="h-8 w-20 bg-[#1E2448]/60 rounded-xl" /></td>
                                        <td className="px-9 py-5"><div className="h-8 w-32 bg-[#1E2448]/60 rounded-xl ml-auto" /></td>
                                    </tr>
                                ))
                            ) : premiumUsers.map((user, idx) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-[#14B8A6]/3 transition-colors"
                                >
                                    <td className="px-9 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center font-black text-[#14B8A6] text-xs">
                                                {user.displayName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-[#F5F0E8] text-sm">{user.displayName || 'مستخدم مميز'}</p>
                                                <p className="text-[9px] font-bold text-[#14B8A6]/40">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-9 py-5 text-center">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg border
                                            ${user.accountType === 'entity' ? 'bg-[#14B8A6]/20 border-[#14B8A6]/30 text-[#14B8A6]' : 'bg-white/5 border-white/10 text-white/50'}`}>
                                            {user.accountType === 'entity' ? 'جهة / منظمة' : 'حساب فردي'}
                                        </span>
                                    </td>
                                    <td className="px-9 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2 text-[#14B8A6]/60 font-bold uppercase text-[10px]">
                                            {user.platform === 'ios' && <Apple size={12} />}
                                            {user.platform === 'android' && <Smartphone size={12} />}
                                            {user.platform === 'manual' && <Globe size={12} />}
                                            {user.platform || 'غير محدد'}
                                        </div>
                                    </td>
                                    <td className="px-9 py-5">
                                        <div className="flex items-center gap-2 text-[#F5F0E8]/60">
                                            <Calendar size={12} className="text-[#14B8A6]/30" />
                                            <span className="text-[11px] font-bold">
                                                {user.endDate 
                                                    ? new Date(user.endDate.seconds ? user.endDate.seconds * 1000 : user.endDate).toLocaleDateString('ar-SA') 
                                                    : 'غير محدد'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-9 py-5">
                                        <div className="flex items-center justify-start gap-2">
                                            {/* Send Reminder */}
                                            <button 
                                                onClick={() => handleSuggestRenewal(user)}
                                                className="p-2.5 bg-white/4 border border-white/5 rounded-xl text-[#F5F0E8]/40 hover:text-[#14B8A6] hover:bg-[#14B8A6]/15 hover:border-[#14B8A6]/25 transition-all"
                                                title="أرسل تذكير بتجديد الاشتراك"
                                            >
                                                <Mail size={14} />
                                            </button>
                                            {/* Extend 30 days */}
                                            <button 
                                                onClick={() => handleExtend(user, 30)}
                                                className="p-2.5 bg-white/4 border border-white/5 rounded-xl text-[#F5F0E8]/40 hover:text-[#14B8A6] hover:bg-[#14B8A6]/15 hover:border-[#14B8A6]/25 transition-all"
                                                title="تجديد شهري (+30 يوم)"
                                            >
                                                <Clock size={14} />
                                            </button>
                                            {/* Extend Year */}
                                            <button 
                                                onClick={() => handleExtend(user, 365)}
                                                className="p-2.5 bg-white/4 border border-white/5 rounded-xl text-[#F5F0E8]/40 hover:text-[#14B8A6] hover:bg-[#14B8A6]/15 hover:border-[#14B8A6]/25 transition-all"
                                                title="تجديد سنوي (+365 يوم)"
                                            >
                                                <RefreshCcw size={14} />
                                            </button>
                                            {/* Revoke */}
                                            <button 
                                                onClick={() => handleRevoke(user)}
                                                className="p-2.5 bg-white/4 border border-white/5 rounded-xl text-[#F5F0E8]/40 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all"
                                                title="إلغاء الاشتراك"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Upgrade Modal */}
            <AnimatePresence>
                {isUpgradeModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-right" dir="rtl">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsUpgradeModalOpen(false)} className="absolute inset-0 bg-[#0A0D1A]/90 backdrop-blur-xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="glass-panel w-full max-w-md rounded-[3rem] p-10 relative overflow-hidden shadow-[0_0_80px_rgba(20,184,166,0.15)]">
                            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#14B8A6]/40 to-transparent" />
                            <button onClick={() => setIsUpgradeModalOpen(false)} className="absolute top-7 left-7 text-[#14B8A6]/40 hover:text-white transition-colors"><X size={20} /></button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6]"><Shield size={28} /></div>
                                <div><h4 className="text-2xl font-black text-white">اشتراك يدوي</h4><p className="text-[#14B8A6]/40 text-xs font-bold mt-0.5">تفعيل النسخة المميزة لمستخدم</p></div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#14B8A6]/50">ابحث عن المستخدم بالبريد</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="email" 
                                            placeholder="example@mail.com" 
                                            className="flex-1 h-13 glass-input rounded-xl px-5 text-sm font-medium text-white" 
                                            value={searchUserEmail}
                                            onChange={(e) => setSearchUserEmail(e.target.value)}
                                        />
                                        <button 
                                            onClick={() => {
                                                const u = users.find(u => u.email?.toLowerCase() === searchUserEmail.toLowerCase());
                                                if (u) setSelectedUserForUpgrade(u);
                                                else alert('المستخدم غير موجود');
                                            }}
                                            className="h-13 px-4 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-xl text-[#14B8A6] hover:bg-[#14B8A6]/20 transition-all font-black text-xs"
                                        >بحث</button>
                                    </div>
                                </div>

                                {selectedUserForUpgrade && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-[#14B8A6]/5 border border-[#14B8A6]/10">
                                        <div className="flex items-center gap-4">
                                            <div className="h-11 w-11 rounded-xl bg-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6] font-black">{selectedUserForUpgrade.displayName?.charAt(0) || 'U'}</div>
                                            <div>
                                                <p className="text-sm font-extrabold text-white">{selectedUserForUpgrade.displayName || 'مستخدم'}</p>
                                                <p className="text-[10px] text-[#14B8A6]/50">{selectedUserForUpgrade.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 mt-5">
                                            <button 
                                                onClick={() => handleUpgradeFoundUser(selectedUserForUpgrade, 'individual')}
                                                disabled={isProcessing}
                                                className="h-12 bg-[#14B8A6] text-[#0A0D1A] font-black rounded-xl text-xs flex items-center justify-center gap-2"
                                            >
                                                {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <><User size={14} /> ترقية فردي</>}
                                            </button>
                                            <button 
                                                onClick={() => handleUpgradeFoundUser(selectedUserForUpgrade, 'entity')}
                                                disabled={isProcessing}
                                                className="h-12 border border-[#14B8A6]/30 text-[#14B8A6] font-black rounded-xl text-xs flex items-center justify-center gap-2"
                                            >
                                                {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <><Building2 size={14} /> ترقية جهة</>}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
