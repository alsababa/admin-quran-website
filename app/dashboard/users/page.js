"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Trash2, Shield, Mail, Calendar,
    ChevronDown, Filter, Edit3, X, Loader2,
    CheckCircle2, AlertTriangle, User, Smartphone, Globe, Building2, Apple,
    ArrowLeft
} from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

// ── Shared Components ─────────────────────────────────────
const SectionHeader = ({ title, subtitle, icon, accentColor = "#5AA564" }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="text-right">
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4 justify-end">
                {title}
                <div 
                    className="w-1.5 h-10 rounded-full shadow-lg"
                    style={{ background: `linear-gradient(to bottom, ${accentColor}, transparent)` }} 
                />
            </h3>
            <p className="text-[#5AA564] font-black text-[10px] mt-3 tracking-[0.3em] uppercase opacity-40">{subtitle}</p>
        </div>
    </div>
);

// ── Toast Notification ────────────────────────────────────
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

// ── Modal Backdrop ────────────────────────────────────────
const ModalBackdrop = ({ onClick }) => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClick}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
    />
);

// ── Edit User Modal ───────────────────────────────────────
const EditModal = ({ user, onSave, onClose, saving }) => {
    const [name, setName] = useState(user.displayName || '');
    const [email, setEmail] = useState(user.email || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(user, { displayName: name, email });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <ModalBackdrop onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-panel w-full max-w-md rounded-[3rem] p-10 relative shadow-2xl bg-white/90 backdrop-blur-3xl"
            >
                <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#5AA564]/40 to-transparent" />
                <button onClick={onClose} className="absolute top-7 left-7 text-gray-300 hover:text-gray-900 transition-colors">
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-8 text-right justify-end">
                    <div className="text-right">
                        <h4 className="text-2xl font-black text-gray-900">تعديل المستخدم</h4>
                        <p className="text-[#5AA564] text-[10px] font-black uppercase tracking-widest mt-1 opacity-40">تحديث معلومات الحساب</p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-[#5AA564] text-xl shadow-sm">
                        {name?.charAt(0) || <User size={22} />}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 text-right">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">الاسم الكامل</label>
                        <input
                            type="text"
                            className="w-full h-13 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#5AA564]/30 transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="اسم المستخدم"
                        />
                    </div>
                    <div className="space-y-2 text-right">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">البريد الإلكتروني</label>
                        <div className="relative">
                            <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                type="email"
                                className="w-full h-13 bg-gray-50 border border-gray-100 rounded-2xl pr-11 pl-5 py-3.5 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#5AA564]/30 transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@example.com"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full h-14 bg-[#5AA564] text-white font-black rounded-2xl hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4 shadow-xl shadow-[#5AA564]/10"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : 'حفظ التغييرات'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

// ── Delete Confirm Modal ──────────────────────────────────
const DeleteModal = ({ user, onConfirm, onClose, deleting }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <ModalBackdrop onClick={onClose} />
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel w-full max-w-sm rounded-[3rem] p-12 relative text-center shadow-2xl bg-white/90 backdrop-blur-3xl"
        >
            <div className="h-20 w-20 rounded-[2rem] bg-rose-50 flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-sm">
                <Trash2 size={32} strokeWidth={1.5} />
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-2">حذف المستخدم؟</h4>
            <p className="text-[11px] font-bold text-gray-400 mb-10 leading-relaxed px-4">
                سيتم حذف حساب <span className="text-rose-500">{user.displayName || user.email}</span> بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => onConfirm(user)}
                    disabled={deleting}
                    className="w-full h-14 bg-rose-500 text-white font-black rounded-2xl hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-rose-500/10"
                >
                    {deleting ? <Loader2 size={16} className="animate-spin" /> : 'تأكيد الحذف النهائي'}
                </button>
                <button
                    onClick={onClose}
                    className="w-full h-14 bg-gray-50 text-gray-400 font-bold text-xs hover:text-gray-900 hover:bg-gray-100 transition-all rounded-2xl"
                >
                    تراجع / إلغاء
                </button>
            </div>
        </motion.div>
    </div>
);

// ── Upgrade User Modal ──────────────────────────────────────
const UpgradeModal = ({ user, onConfirm, onClose, upgrading }) => {
    const [type, setType] = useState('individual');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-right" dir="rtl">
            <ModalBackdrop onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-panel w-full max-w-md rounded-[3rem] p-10 relative shadow-2xl bg-white/90 backdrop-blur-3xl"
            >
                <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#5AA564]/40 to-transparent" />
                <button onClick={onClose} className="absolute top-7 right-7 text-gray-300 hover:text-gray-900 transition-colors">
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#5AA564] shadow-sm">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-gray-900">ترقية الحساب</h4>
                        <p className="text-[#5AA564] text-[10px] font-black uppercase tracking-widest mt-1 opacity-40">منح العضوية المميزة ✨</p>
                    </div>
                </div>

                <p className="text-sm font-bold text-gray-500 mb-8 leading-relaxed">
                    اختر نوع الحساب المميز لـ <span className="text-[#5AA564]">{user.displayName || user.email}</span>.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={() => setType('individual')}
                        className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 group
                            ${type === 'individual' 
                                ? 'bg-emerald-50 border-[#5AA564]/30 text-gray-900 shadow-sm' 
                                : 'bg-gray-50/50 border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                    >
                        <User size={24} className={type === 'individual' ? 'text-[#5AA564]' : 'text-gray-200'} />
                        <span className="text-xs font-black uppercase tracking-wider">حساب فردي</span>
                    </button>
                    <button
                        onClick={() => setType('entity')}
                        className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 group
                            ${type === 'entity' 
                                ? 'bg-blue-50 border-blue-200 text-gray-900 shadow-sm' 
                                : 'bg-gray-50/50 border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                    >
                        <Building2 size={24} className={type === 'entity' ? 'text-blue-500' : 'text-gray-200'} />
                        <span className="text-xs font-black uppercase tracking-wider">جهة / منظمة</span>
                    </button>
                </div>

                <AnimatePresence>
                    {type === 'entity' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3 mb-8 text-right overflow-hidden"
                        >
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">معرف المنظمة (Organization ID)</label>
                            <input
                                id="org-id-input"
                                type="text"
                                className="w-full h-13 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-200 transition-all"
                                placeholder="مثلاً: org_123"
                                required
                            />
                            <p className="text-[10px] text-gray-300 font-medium">يستخدم هذا المعرف لربط المستخدم بمنظمته في تطبيق الجوال.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => {
                        const orgId = type === 'entity' ? document.getElementById('org-id-input')?.value : null;
                        onConfirm(user, type, orgId);
                    }}
                    disabled={upgrading}
                    className="w-full h-14 bg-[#5AA564] text-white font-black rounded-2xl hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-[#5AA564]/10"
                >
                    {upgrading ? <Loader2 size={20} className="animate-spin" /> : 'تأكيد الترقية الآن'}
                </button>
            </motion.div>
        </div>
    );
};

// ── Change Account Type Modal ────────────────────────────
const ChangeTypeModal = ({ user, onConfirm, onClose, saving }) => {
    const [type, setType] = useState(user.accountType || 'individual');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-right" dir="rtl">
            <ModalBackdrop onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-panel w-full max-w-md rounded-[3rem] p-10 relative shadow-2xl bg-white/90 backdrop-blur-3xl"
            >
                <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
                <button onClick={onClose} className="absolute top-7 right-7 text-gray-300 hover:text-gray-900 transition-colors">
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-sm">
                        <Building2 size={28} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-gray-900">تغيير نوع الحساب</h4>
                        <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-40">تحديد طبيعة الحساب 🏢</p>
                    </div>
                </div>

                <p className="text-sm font-bold text-gray-500 mb-8 leading-relaxed">
                    اختر نوع الحساب لـ <span className="text-blue-500">{user.displayName || user.email}</span>.
                    <br/><span className="text-[10px] text-gray-300">لن يتأثر اشتراك المستخدم الحالي بهذا التغيير.</span>
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setType('individual')}
                        className={`p-6 rounded-[2.5rem] border transition-all flex flex-col items-center gap-3
                            ${type === 'individual'
                                ? 'bg-gray-50 border-[#5AA564]/20 text-gray-900 shadow-sm'
                                : 'bg-white/50 border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                    >
                        <User size={24} className={type === 'individual' ? 'text-[#5AA564]' : 'text-gray-200'} />
                        <span className="text-xs font-black uppercase tracking-wider">حساب فردي</span>
                    </button>
                    <button
                        onClick={() => setType('entity')}
                        className={`p-6 rounded-[2.5rem] border transition-all flex flex-col items-center gap-3
                            ${type === 'entity'
                                ? 'bg-blue-50 border-blue-200 text-gray-900 shadow-sm'
                                : 'bg-white/50 border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                    >
                        <Building2 size={24} className={type === 'entity' ? 'text-blue-500' : 'text-gray-200'} />
                        <span className="text-xs font-black uppercase tracking-wider">جهة / منظمة</span>
                    </button>
                </div>

                <button
                    onClick={() => onConfirm(user, type)}
                    disabled={saving || type === user.accountType}
                    className="w-full h-15 bg-blue-600 text-white font-black rounded-2xl hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/10"
                >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : 'تحديث نوع الحساب'}
                </button>
            </motion.div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────
export default function UsersPage() {
    const { users, loading, deleteUser, upgradeUser, updateUser, changeAccountType } = useUsers();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [upgradingUser, setUpgradingUser] = useState(null);
    const [changingTypeUser, setChangingTypeUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isChangingType, setIsChangingType] = useState(false);
    const [toast, setToast] = useState(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            setSearchTerm(query);
            showToast(`تصفية لوجود: ${query}`, 'success');
        }
    }, [searchParams]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSaveEdit = async (user, updates) => {
        setIsSaving(true);
        try {
            await updateUser(user, updates);
            setEditingUser(null);
            showToast('تم تحديث بيانات المستخدم بنجاح');
        } catch {
            showToast('فشل تحديث البيانات. حاول مجدداً.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (user) => {
        setIsDeleting(true);
        try {
            await deleteUser(user);
            setDeletingUser(null);
            showToast('تم حذف المستخدم بنجاح');
        } catch {
            showToast('فشل حذف المستخدم. حاول مجدداً.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleConfirmUpgrade = async (user, type, organizationId) => {
        setIsUpgrading(true);
        try {
            await upgradeUser(user, type, organizationId);
            setUpgradingUser(null);
            showToast(`تمت ترقية ${user.displayName || user.email} كـ ${type === 'entity' ? 'جهة' : 'فرد'} للباقة المميزة ✨`);
        } catch (err) {
            showToast(`فشل تنفيذ الترقية: ${err.message || 'تحقق من الصلاحيات'}`, 'error');
        } finally {
            setIsUpgrading(false);
        }
    };

    const handleConfirmChangeType = async (user, type) => {
        setIsChangingType(true);
        try {
            await changeAccountType(user, type);
            setChangingTypeUser(null);
            showToast(`تم تغيير نوع حساب ${user.displayName || user.email} إلى ${type === 'entity' ? 'جهة / منظمة' : 'حساب فردي'} 🏢`);
        } catch {
            showToast('فشل تغيير نوع الحساب. حاول مجدداً.', 'error');
        } finally {
            setIsChangingType(false);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="text-right">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter flex items-center justify-end gap-5">
                        قائمة المستخدمين
                        <div className="w-2 h-12 bg-gradient-to-b from-[#5AA564] to-transparent rounded-full shadow-[0_10px_20px_rgba(90,165,100,0.2)]" />
                    </h1>
                    <p className="text-[#5AA564] font-black text-[11px] mt-4 tracking-[0.4em] uppercase opacity-40">User Management System</p>
                </div>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-96 group">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5AA564] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="ابحث عن أي مستخدم ببريده أو اسمه..."
                            className="w-full h-15 bg-white border border-gray-100 rounded-[2rem] pr-14 pl-6 py-3.5 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#5AA564]/30 shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="h-15 px-6 py-3.5 bg-white border border-gray-100 rounded-[2rem] text-gray-400 hover:text-[#5AA564] hover:border-[#5AA564]/20 flex items-center gap-3 transition-all shadow-sm">
                        <Filter size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">فرز متقدم</span>
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="glass-panel rounded-[3.5rem] overflow-hidden border-gray-100 shadow-2xl bg-white/50 backdrop-blur-xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50 bg-gray-50/50">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">ملف المستخدم</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 text-center">التصنيف</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 text-center">حالة الاشتراك</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 text-center">الجهاز الرسمي</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">التواجد</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 text-left">التحكم</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-10 py-7"><div className="h-12 w-64 bg-gray-50 rounded-2xl" /></td>
                                            <td className="px-10 py-7"><div className="h-8 w-28 bg-gray-50 rounded-full mx-auto" /></td>
                                            <td className="px-10 py-7"><div className="h-8 w-24 bg-gray-50 rounded-full mx-auto" /></td>
                                            <td className="px-10 py-7"><div className="h-8 w-32 bg-gray-50 rounded-2xl mr-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredUsers.map((user, idx) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group hover:bg-[#5AA564]/5 transition-colors"
                                    >
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="h-12 w-12 rounded-[1.2rem] bg-gray-50 flex items-center justify-center font-black text-[#5AA564] text-sm overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                                                    {user.displayName?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="flex items-center gap-3">
                                                        <p className="font-black text-gray-900 text-base">{user.displayName || 'بدون اسم'}</p>
                                                        {user.isOrgAdmin && (
                                                            <div className="px-2 py-1 rounded-lg bg-blue-50 border border-blue-100 text-[7px] font-black text-blue-500 uppercase tracking-widest">MANAGER</div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-[11px] font-bold text-gray-400">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider
                                                    ${user.accountType === 'entity' 
                                                        ? 'bg-blue-50 border-blue-100 text-blue-500' 
                                                        : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                                    {user.accountType === 'entity' ? <Building2 size={12} /> : <User size={12} />}
                                                    {user.accountType === 'entity' ? 'جهة / مؤسسة' : 'فرد'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.1em]
                                                    ${user.subscriptionStatus === 'active'
                                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                                        : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${user.subscriptionStatus === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-amber-400'}`} />
                                                    {user.subscriptionStatus === 'active' ? 'مميز' : 'مجاني'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex justify-center">
                                                <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px]">
                                                    {user.platform === 'ios' && <Apple size={14} className="text-gray-900 opacity-60" />}
                                                    {user.platform === 'android' && <Smartphone size={14} className="text-emerald-500 opacity-60" />}
                                                    {(user.platform === 'manual' || !user.platform) && <Globe size={14} className="text-blue-500 opacity-60" />}
                                                    <span className="uppercase">{user.platform || 'WEB'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center justify-end gap-3 text-gray-400 font-bold text-xs">
                                                <span>{user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'N/A'}</span>
                                                <Calendar size={14} />
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center justify-start gap-2.5">
                                                <button
                                                    onClick={() => setEditingUser(user)}
                                                    className="p-3 bg-white border border-gray-100 rounded-xl text-gray-300 hover:text-[#5AA564] hover:shadow-md transition-all active:scale-90"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingUser(user)}
                                                    className="p-3 bg-white border border-gray-100 rounded-xl text-gray-300 hover:text-rose-500 hover:shadow-md transition-all active:scale-90"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setChangingTypeUser(user)}
                                                    className="p-3 bg-white border border-gray-100 rounded-xl text-gray-300 hover:text-blue-500 hover:shadow-md transition-all active:scale-90"
                                                >
                                                    <Building2 size={16} />
                                                </button>
                                                {user.subscriptionStatus !== 'active' && (
                                                    <button
                                                        onClick={() => setUpgradingUser(user)}
                                                        className="h-10 px-5 bg-emerald-50 border border-emerald-100 text-[#5AA564] hover:bg-[#5AA564] hover:text-white font-black text-[10px] rounded-xl transition-all flex items-center gap-2 shadow-sm"
                                                    >
                                                        <Shield size={14} strokeWidth={2.5} />
                                                        <span>ترقية</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Footer Controls */}
                <div className="px-10 py-7 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Total Users: {users.length} — Filtered: {filteredUsers.length}
                    </p>
                    <div className="flex gap-2">
                        <button className="h-10 w-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all rotate-180"><ChevronDown size={14} /></button>
                        <div className="h-10 px-5 flex items-center justify-center bg-white border border-[#5AA564]/30 rounded-xl text-[#5AA564] text-[11px] font-black shadow-sm">1</div>
                        <button className="h-10 w-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all"><ChevronDown size={14} /></button>
                    </div>
                </div>
            </div>

            {/* Modal Components (Client-side Rendering Only) */}
            <AnimatePresence>
                {editingUser && <EditModal user={editingUser} onSave={handleSaveEdit} onClose={() => setEditingUser(null)} saving={isSaving} />}
                {deletingUser && <DeleteModal user={deletingUser} onConfirm={handleDelete} onClose={() => setDeletingUser(null)} deleting={isDeleting} />}
                {upgradingUser && <UpgradeModal user={upgradingUser} onConfirm={handleConfirmUpgrade} onClose={() => setUpgradingUser(null)} upgrading={isUpgrading} />}
                {changingTypeUser && <ChangeTypeModal user={changingTypeUser} onConfirm={handleConfirmChangeType} onClose={() => setChangingTypeUser(null)} saving={isChangingType} />}
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
}
