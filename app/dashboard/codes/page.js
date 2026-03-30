"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Ticket, Plus, Search, Filter, Trash2, 
    Download, Copy, CheckCircle2, AlertTriangle, 
    Loader2, X, Building2, User, Calendar, RefreshCcw,
    ChevronDown, MoreVertical, ExternalLink
} from 'lucide-react';
import { useActivationCodes } from '@/hooks/useActivationCodes';
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

// ── Generate Modal ───────────────────────────────────────
const GenerateModal = ({ onGenerate, onClose, loading, organizations }) => {
    const [count, setCount] = useState(50);
    const [orgId, setOrgId] = useState('');
    const [prefix, setPrefix] = useState('ANML');
    const [expiry, setExpiry] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate({ count, orgId, prefix, expiresAt: expiry || null });
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 text-right" dir="rtl">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#0A0D1A]/90 backdrop-blur-xl"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-panel w-full max-w-lg rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#14B8A6]/40 to-transparent" />
                
                <div className="flex items-center justify-between mb-8">
                    <button onClick={onClose} className="text-[#14B8A6]/40 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <h4 className="text-2xl font-black text-white">توليد أكواد جديدة</h4>
                            <p className="text-[#14B8A6]/40 text-xs font-bold mt-0.5">إنشاء مجموعة من الأكواد الفريدة</p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6]">
                            <Plus size={28} />
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Organization Selection */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#14B8A6]/50 mr-2">الجهة / المنظمة</label>
                        <select 
                            required
                            className="w-full h-13 glass-input rounded-xl px-4 text-sm font-medium text-white appearance-none cursor-pointer"
                            value={orgId}
                            onChange={(e) => setOrgId(e.target.value)}
                        >
                            <option value="" disabled className="bg-[#0A0D1A]">اختر الجهة المستفيدة...</option>
                            {organizations.map(org => (
                                <option key={org.id} value={org.id} className="bg-[#0A0D1A]">
                                    {org.displayName || org.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Count */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#14B8A6]/50 mr-2">عدد الأكواد (بحد أقصى 500)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="500"
                                className="w-full h-13 glass-input rounded-xl px-4 text-sm font-medium text-white"
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                            />
                        </div>
                        {/* Prefix */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#14B8A6]/50 mr-2">بادئة الكود (Prefix)</label>
                            <input
                                type="text"
                                maxLength="6"
                                className="w-full h-13 glass-input rounded-xl px-4 text-sm font-medium text-white uppercase"
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Expiry */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#14B8A6]/50 mr-2">تاريخ الانتهاء (اختياري)</label>
                        <input
                            type="date"
                            className="w-full h-13 glass-input rounded-xl px-4 text-sm font-medium text-white"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[#14B8A6] text-[#0A0D1A] font-black rounded-2xl hover:bg-[#0D9488] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : 'توليد المجموعات الآن'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────
export default function CodesPage() {
    const { codes, loading, generateBulkCodes, deleteCode } = useActivationCodes();
    const { users } = useUsers();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [toast, setToast] = useState(null);

    const organizations = useMemo(() => 
        users.filter(u => u.accountType === 'entity'), 
    [users]);

    const stats = useMemo(() => ({
        total: codes.length,
        available: codes.filter(c => c.status === 'available').length,
        used: codes.filter(c => c.status === 'consumed').length,
    }), [codes]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleGenerate = async (data) => {
        setIsGenerating(true);
        const result = await generateBulkCodes(data);
        setIsGenerating(false);
        
        if (result.success) {
            setIsGenerateOpen(false);
            showToast(`تم توليد ${data.count} كود بنجاح ✨`);
        } else {
            showToast(result.error, 'error');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showToast('تم نسخ الكود للمحفظة');
    };

    const exportToCSV = () => {
        if (codes.length === 0) return;
        
        const headers = ["الكود,الحالة,الجهة,تاريخ الإنشاء,تاريخ الانتهاء"];
        const rows = codes.map(c => 
            `${c.code},${c.status},${c.org_id},${c.created_at},${c.expires_at || 'None'}`
        );
        
        const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv;charset=utf8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `codes_export_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('جاري تحويل الملف للتحميل...');
    };

    const filteredCodes = codes.filter(c => 
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.org_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header & Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                <div className="text-right">
                    <h3 className="text-4xl font-black text-white tracking-tighter">أكواد التفعيل</h3>
                    <p className="text-[#14B8A6]/40 font-bold text-sm mt-2">إدارة وتوليد مفاتيح الدخول المميزة للمنظمات.</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
                    {[
                        { label: 'الإجمالي', val: stats.total, icon: <Ticket size={14} />, color: 'teal' },
                        { label: 'متاح', val: stats.available, icon: <CheckCircle2 size={14} />, color: 'emerald' },
                        { label: 'مستخدم', val: stats.used, icon: <RefreshCcw size={14} />, color: 'blue' },
                    ].map((s, i) => (
                        <div key={i} className="glass-card px-6 py-4 rounded-2xl border-white/5 flex flex-col items-center gap-1 min-w-[120px]">
                            <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">{s.label}</span>
                            <span className="text-xl font-black text-white">{s.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-[#14B8A6]/30 group-focus-within:text-[#14B8A6] transition-colors" size={17} />
                        <input
                            type="text"
                            placeholder="ابحث عن كود أو جهة..."
                            className="w-full h-13 glass-input rounded-2xl pr-14 pl-6 py-3.5 text-sm font-medium text-white placeholder:text-[#14B8A6]/20 focus:border-[#14B8A6]/40 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="h-13 px-5 glass-panel border-[#14B8A6]/10 rounded-2xl text-[#14B8A6]/50 hover:text-[#14B8A6] transition-all flex items-center gap-2">
                        <Filter size={16} />
                    </button>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={exportToCSV}
                        className="h-13 px-6 glass-panel border-[#14B8A6]/10 rounded-2xl text-white/60 hover:text-white hover:bg-[#14B8A6]/10 transition-all flex items-center gap-2.5"
                    >
                        <Download size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">تصدير CSV</span>
                    </button>
                    <button 
                        onClick={() => setIsGenerateOpen(true)}
                        className="h-13 px-8 bg-[#14B8A6] text-[#0A0D1A] rounded-2xl font-black text-xs hover:bg-[#0D9488] shadow-lg shadow-[#14B8A6]/10 transition-all active:scale-95 flex items-center gap-2.5"
                    >
                        <Plus size={18} strokeWidth={3} />
                        <span>توليد أكواد</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="glass-panel rounded-[2.5rem] overflow-hidden border-[#14B8A6]/10 shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right" dir="rtl">
                        <thead>
                            <tr className="border-b border-[#14B8A6]/8 bg-[#14B8A6]/5">
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/50">الكود</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/50 text-center">الحالة</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/50">الجهة المستفيدة</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/50">تاريخ الانتهاء</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-[#14B8A6]/50 text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#14B8A6]/5">
                            <AnimatePresence>
                                {loading && codes.length === 0 ? (
                                    [1, 2, 3, 4].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-8 py-5"><div className="h-10 w-40 bg-white/5 rounded-xl" /></td>
                                            <td className="px-8 py-5"><div className="h-8 w-20 bg-white/5 rounded-full mx-auto" /></td>
                                            <td className="px-8 py-5"><div className="h-10 w-32 bg-white/5 rounded-xl" /></td>
                                            <td className="px-8 py-5"><div className="h-6 w-24 bg-white/5 rounded-lg" /></td>
                                            <td className="px-8 py-5"><div className="h-10 w-10 bg-white/5 rounded-xl mr-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredCodes.map((code, idx) => (
                                    <motion.tr
                                        key={code.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                                        className="group hover:bg-[#14B8A6]/3 transition-colors"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-sm font-black text-white selection:bg-[#14B8A6]">{code.code}</span>
                                                <button 
                                                    onClick={() => copyToClipboard(code.code)}
                                                    className="p-1.5 rounded-lg bg-white/5 text-white/20 hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center">
                                                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
                                                    ${code.status === 'available' 
                                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                                    {code.status === 'available' ? 'متوفر' : 'مستخدم'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2.5">
                                                <Building2 size={13} className="text-[#14B8A6]/30" />
                                                <span className="text-xs font-bold text-white/60">
                                                    {code.organization?.displayName || 'جهة غير محددة'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2.5">
                                                <Calendar size={13} className="text-[#14B8A6]/30" />
                                                <span className="text-xs font-bold text-white/40">
                                                    {code.expires_at ? new Date(code.expires_at).toLocaleDateString('ar-SA') : 'مفتوح'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-left">
                                            <div className="flex items-center justify-start gap-2">
                                                <button 
                                                    onClick={() => deleteCode(code.id)}
                                                    className="p-2.5 bg-white/4 border border-white/5 rounded-xl text-white/20 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-10 py-6 bg-[#14B8A6]/3 border-t border-[#14B8A6]/5 flex justify-between items-center text-right">
                    <p className="text-[9px] font-black text-[#14B8A6]/40 uppercase tracking-[0.2em]">
                        عرض {filteredCodes.length} كود من أصل {codes.length}
                    </p>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white/4 border border-white/5 rounded-lg text-white/30 hover:text-[#14B8A6]"><ChevronDown size={14} className="rotate-90" /></button>
                        <button className="p-2 bg-white/4 border border-white/5 rounded-lg text-white/30 hover:text-[#14B8A6]"><ChevronDown size={14} className="-rotate-90" /></button>
                    </div>
                </div>
            </div>

            {/* Modals & Toasts */}
            <AnimatePresence>
                {isGenerateOpen && (
                    <GenerateModal
                        organizations={organizations}
                        onGenerate={handleGenerate}
                        onClose={() => setIsGenerateOpen(false)}
                        loading={isGenerating}
                    />
                )}
            </AnimatePresence>

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
