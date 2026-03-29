"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Trash2, Shield, Mail, Calendar,
    ChevronDown, Filter, Edit3, X, Loader2,
    CheckCircle2, AlertTriangle, User, Smartphone, Globe, Building2, Apple
} from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

// ── Toast Notification ────────────────────────────────────
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
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#0A0D1A]/90 backdrop-blur-xl"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-panel w-full max-w-md rounded-[2.5rem] p-10 relative shadow-[0_0_60px_rgba(201,168,76,0.1)]"
            >
                <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#14B8A6]/40 to-transparent" />
                <button onClick={onClose} className="absolute top-7 left-7 text-[#14B8A6]/40 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-8 text-right">
                    <div className="h-14 w-14 rounded-2xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center font-black text-[#14B8A6] text-xl">
                        {name?.charAt(0) || <User size={22} />}
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-white">تعديل المستخدم</h4>
                        <p className="text-[#14B8A6]/40 text-xs font-bold mt-0.5">تحديث معلومات الحساب</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2 text-right">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#14B8A6]/50">الاسم الكامل</label>
                        <input
                            type="text"
                            className="w-full h-13 glass-input rounded-xl px-5 py-3.5 text-sm font-medium text-white placeholder:text-[#14B8A6]/20"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="اسم المستخدم"
                        />
                    </div>
                    <div className="space-y-2 text-right">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#14B8A6]/50">البريد الإلكتروني</label>
                        <div className="relative">
                            <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#14B8A6]/25" />
                            <input
                                type="email"
                                className="w-full h-13 glass-input rounded-xl pr-11 pl-5 py-3.5 text-sm font-medium text-white placeholder:text-[#14B8A6]/20"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@example.com"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full h-13 bg-[#14B8A6] text-[#0A0D1A] font-black rounded-xl hover:bg-[#E8C97A] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
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
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0A0D1A]/90 backdrop-blur-xl"
        />
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel w-full max-w-sm rounded-[2.5rem] p-10 relative text-center shadow-[0_0_60px_rgba(239,68,68,0.1)]"
            style={{ border: '1px solid rgba(239,68,68,0.2)' }}
        >
            <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-6">
                <Trash2 size={28} />
            </div>
            <h4 className="text-xl font-black text-white mb-2">حذف المستخدم؟</h4>
            <p className="text-xs font-bold text-[#F5F0E8]/40 mb-8 leading-relaxed">
                سيتم حذف حساب <span className="text-rose-400">{user.displayName || user.email}</span> بشكل نهائي ولا يمكن التراجع.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 h-12 glass-card border-[#14B8A6]/10 rounded-xl text-[#F5F0E8]/50 font-bold text-sm hover:text-white transition-all"
                >
                    إلغاء
                </button>
                <button
                    onClick={() => onConfirm(user)}
                    disabled={deleting}
                    className="flex-1 h-12 bg-rose-500 text-white font-black rounded-xl hover:bg-rose-400 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {deleting ? <Loader2 size={16} className="animate-spin" /> : 'تأكيد الحذف'}
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
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#0A0D1A]/90 backdrop-blur-xl"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-panel w-full max-w-md rounded-[2.5rem] p-10 relative shadow-[0_0_60px_rgba(20,184,166,0.15)]"
            >
                <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#14B8A6]/40 to-transparent" />
                <button onClick={onClose} className="absolute top-7 left-7 text-[#14B8A6]/40 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6]">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-white">ترقية الحساب</h4>
                        <p className="text-[#14B8A6]/40 text-xs font-bold mt-0.5">منح العضوية المميزة ✨</p>
                    </div>
                </div>

                <p className="text-sm font-bold text-white/60 mb-8 leading-relaxed">
                    اختر نوع الحساب المميز لـ <span className="text-[#14B8A6]">{user.displayName || user.email}</span>.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setType('individual')}
                        className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 group
                            ${type === 'individual' 
                                ? 'bg-[#14B8A6]/10 border-[#14B8A6]/40 text-white' 
                                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                    >
                        <User size={24} className={type === 'individual' ? 'text-[#14B8A6]' : 'text-white/20'} />
                        <span className="text-sm font-black">حساب فردي</span>
                    </button>
                    <button
                        onClick={() => setType('entity')}
                        className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 group
                            ${type === 'entity' 
                                ? 'bg-[#14B8A6]/10 border-[#14B8A6]/40 text-white' 
                                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                    >
                        <Building2 size={24} className={type === 'entity' ? 'text-[#14B8A6]' : 'text-white/20'} />
                        <span className="text-sm font-black">جهة / منظمة</span>
                    </button>
                </div>

                <button
                    onClick={() => onConfirm(user, type)}
                    disabled={upgrading}
                    className="w-full h-14 bg-[#14B8A6] text-[#0A0D1A] font-black rounded-2xl hover:bg-[#0D9488] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {upgrading ? <Loader2 size={20} className="animate-spin" /> : 'تأكيد الترقية الآن'}
                </button>
            </motion.div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────
export default function UsersPage() {
    const { users, loading, deleteUser, upgradeUser, updateUser } = useUsers();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [upgradingUser, setUpgradingUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleConfirmUpgrade = async (user, type) => {
        setIsUpgrading(true);
        try {
            await upgradeUser(user, type);
            setUpgradingUser(null);
            showToast(`تمت ترقية ${user.displayName || user.email} كـ ${type === 'entity' ? 'جهة' : 'فرد'} للباقة المميزة ✨`);
        } catch {
            showToast('فشل تنفيذ الترقية. تحقق من الصلاحيات.', 'error');
        } finally {
            setIsUpgrading(false);
        }
    };

    const handleUpgradeClick = (user) => {
        setUpgradingUser(user);
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="text-right">
                    <h3 className="text-4xl font-black text-white tracking-tighter">قائمة المستخدمين</h3>
                    <p className="text-[#14B8A6]/40 font-bold text-sm mt-2">إدارة والتحكم في حسابات المستخدمين المسجلين.</p>
                </div>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-[#14B8A6]/30 group-focus-within:text-[#14B8A6] transition-colors" size={17} />
                        <input
                            type="text"
                            placeholder="ابحث عن مستخدم..."
                            className="w-full h-13 glass-input rounded-2xl pr-14 pl-6 py-3.5 text-sm font-medium text-white placeholder:text-[#14B8A6]/20 focus:border-[#14B8A6]/40 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="h-13 px-5 py-3.5 glass-panel border-[#14B8A6]/10 rounded-2xl text-[#14B8A6]/50 hover:text-[#14B8A6] flex items-center gap-2.5 transition-all">
                        <Filter size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">تصفية</span>
                        <ChevronDown size={13} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="glass-panel rounded-[2.5rem] overflow-hidden border-[#14B8A6]/10 shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-[#14B8A6]/8 bg-[#14B8A6]/5">
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/50">المستخدم</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/50 text-center">نوع الحساب</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/50 text-center">الحالة</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/50 text-center">المنصة</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/50">تاريخ التسجيل</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/50 text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#14B8A6]/5">
                            <AnimatePresence>
                                {loading ? (
                                    [1, 2, 3, 4].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-8 py-5"><div className="h-10 w-48 bg-[#1E2448]/60 rounded-xl" /></td>
                                            <td className="px-8 py-5"><div className="h-8 w-24 bg-[#1E2448]/60 rounded-full mx-auto" /></td>
                                            <td className="px-8 py-5"><div className="h-6 w-32 bg-[#1E2448]/60 rounded-lg" /></td>
                                            <td className="px-8 py-5"><div className="h-10 w-36 bg-[#1E2448]/60 rounded-xl mr-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredUsers.map((user, idx) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                        className="group hover:bg-[#14B8A6]/3 transition-colors"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#14B8A6]/20 to-[#0D9488]/15 border border-[#14B8A6]/20 flex items-center justify-center font-black text-[#14B8A6] text-sm shrink-0">
                                                    {user.displayName?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-extrabold text-white text-sm truncate">{user.displayName || 'مستخدم جديد'}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <Mail size={11} className="text-[#14B8A6]/30" />
                                                        <p className="text-[10px] font-bold text-[#14B8A6]/40 truncate max-w-[180px]">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-bold
                                                    ${user.accountType === 'entity' 
                                                        ? 'bg-[#14B8A6]/20 border-[#14B8A6]/30 text-[#14B8A6]' 
                                                        : 'bg-white/5 border-white/10 text-white/60'}`}>
                                                    {user.accountType === 'entity' ? <Building2 size={12} /> : <User size={12} />}
                                                    {user.accountType === 'entity' ? 'جهة / منظمة' : 'حساب فردي'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest
                                                    ${user.subscriptionStatus === 'active'
                                                        ? 'bg-[#14B8A6]/10 border-[#14B8A6]/20 text-[#14B8A6]'
                                                        : 'bg-[#1E2448]/80 border-white/10 text-[#F5F0E8]/35'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${user.subscriptionStatus === 'active' ? 'bg-[#14B8A6]' : 'bg-white/20'}`} />
                                                    {user.subscriptionStatus === 'active' ? 'مميز' : 'مجاني'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center">
                                                <div className="flex items-center gap-2 text-[#14B8A6]/60">
                                                    {user.platform === 'ios' && <Apple size={14} />}
                                                    {user.platform === 'android' && <Smartphone size={14} />}
                                                    {user.platform === 'manual' && <Globe size={14} />}
                                                    <span className="text-[10px] font-bold uppercase">{user.platform || 'غير محدد'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <p className="text-xs font-bold text-[#F5F0E8]/45">
                                                    {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير متوفر'}
                                                </p>
                                                <Calendar size={13} className="text-[#14B8A6]/20" />
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-start gap-2">
                                                {/* Edit */}
                                                <button
                                                    onClick={() => setEditingUser(user)}
                                                    className="p-2.5 bg-white/4 border border-white/5 rounded-xl text-[#F5F0E8]/40 hover:text-white hover:bg-[#14B8A6]/15 hover:border-[#14B8A6]/25 transition-all"
                                                    title="تعديل"
                                                >
                                                    <Edit3 size={15} />
                                                </button>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => setDeletingUser(user)}
                                                    className="p-2.5 bg-white/4 border border-white/5 rounded-xl text-[#F5F0E8]/40 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all"
                                                    title="حذف"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                                {/* Upgrade */}
                                                {user.subscriptionStatus !== 'active' && (
                                                    <button
                                                        onClick={() => handleUpgradeClick(user)}
                                                        className="h-10 px-4 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-xl text-[#14B8A6] hover:bg-[#14B8A6] hover:text-[#0A0D1A] font-black text-[9px] transition-all flex items-center gap-1.5"
                                                        title="ترقية لمميز"
                                                    >
                                                        <Shield size={13} strokeWidth={2.5} />
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

                {/* Footer */}
                <div className="px-10 py-6 bg-[#14B8A6]/3 border-t border-[#14B8A6]/5 flex justify-between items-center">
                    <p className="text-[9px] font-black text-[#14B8A6]/40 uppercase tracking-widest">
                        عرض {filteredUsers.length} من أصل {users.length} مستخدم
                    </p>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white/4 border border-white/5 rounded-lg text-[#F5F0E8]/40 hover:text-[#14B8A6] transition-all rotate-180"><ChevronDown size={13} /></button>
                        <button className="px-4 py-2 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-lg text-[#14B8A6] text-[9px] font-black">1</button>
                        <button className="p-2 bg-white/4 border border-white/5 rounded-lg text-[#F5F0E8]/40 hover:text-[#14B8A6] transition-all"><ChevronDown size={13} /></button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingUser && (
                    <EditModal
                        user={editingUser}
                        onSave={handleSaveEdit}
                        onClose={() => setEditingUser(null)}
                        saving={isSaving}
                    />
                )}
            </AnimatePresence>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {deletingUser && (
                    <DeleteModal
                        user={deletingUser}
                        onConfirm={handleDelete}
                        onClose={() => setDeletingUser(null)}
                        deleting={isDeleting}
                    />
                )}
            </AnimatePresence>

            {/* Upgrade Modal */}
            <AnimatePresence>
                {upgradingUser && (
                    <UpgradeModal
                        user={upgradingUser}
                        onConfirm={handleConfirmUpgrade}
                        onClose={() => setUpgradingUser(null)}
                        upgrading={isUpgrading}
                    />
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
