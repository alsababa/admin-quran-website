"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Ticket, Plus, Search, Filter, Trash2, 
    Download, Copy, CheckCircle2, AlertTriangle, 
    Loader2, X, Building2, User, Calendar, RefreshCcw,
    ChevronDown, MoreVertical, ExternalLink, ArrowLeft
} from 'lucide-react';
import { useActivationCodes } from '@/hooks/useActivationCodes';
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

// ── Generate Modal ───────────────────────────────────────
const GenerateModal = ({ onGenerate, onClose, loading, organizations }) => {
    const [count, setCount] = useState(50);
    const [orgId, setOrgId] = useState('');
    const [prefix, setPrefix] = useState('ANML');
    const [countryCode, setCountryCode] = useState('+966');
    const [duration, setDuration] = useState('1'); // Years

    const countries = [
        { name: 'المملكة العربية السعودية', code: '+966' },
        { name: 'اليمن', code: '+967' },
        { name: 'مصر', code: '+20' },
        { name: 'الإمارات', code: '+971' },
        { name: 'الكويت', code: '+965' },
        { name: 'قطر', code: '+974' },
        { name: 'عمان', code: '+968' },
        { name: 'البحرين', code: '+973' },
        { name: 'الأردن', code: '+962' },
        { name: 'أخرى', code: 'Global' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Calculate expiry date based on duration
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + parseInt(duration));
        
        onGenerate({ 
            count, 
            orgId, 
            prefix, 
            countryCode,
            expiresAt: expiryDate.toISOString() 
        });
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 text-right" dir="rtl">
            <ModalBackdrop onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-panel w-full max-w-lg rounded-[3.5rem] p-12 relative overflow-hidden shadow-3xl bg-white/95 backdrop-blur-3xl"
            >
                <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-[#5AA564]/40 to-transparent" />
                
                <div className="flex items-center justify-between mb-10">
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-900 transition-colors">
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-5">
                        <div className="text-right">
                            <h4 className="text-3xl font-black text-gray-900 tracking-tight">توليد أكواد جديدة</h4>
                            <p className="text-[#5AA564] text-[10px] font-black uppercase tracking-widest mt-1 opacity-40">إنشاء حزمة مفاتيح دخول طبقاً لبلد المستخدم</p>
                        </div>
                        <div className="h-16 w-16 rounded-[1.5rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#5AA564] shadow-sm">
                            <Ticket size={32} strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Organization Selection */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mr-1">الجهة / المنظمة المستفيدة</label>
                        <select 
                            required
                            className="w-full h-15 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#5AA564]/30 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                            value={orgId}
                            onChange={(e) => setOrgId(e.target.value)}
                        >
                            <option value="" disabled>اختر الجهة المستهدفة من القائمة...</option>
                            {organizations.map(org => (
                                <option key={org.id} value={org.rawId}>
                                    {org.displayName || org.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Country Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mr-1">مفتاح الدولة</label>
                            <select 
                                required
                                className="w-full h-15 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#5AA564]/30 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                            >
                                {countries.map(c => (
                                    <option key={c.code} value={c.code}>
                                        {c.name} ({c.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Duration */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mr-1">مدة الصلاحية</label>
                            <select 
                                required
                                className="w-full h-15 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#5AA564]/30 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            >
                                <option value="1">سنة واحدة</option>
                                <option value="2">سنتان</option>
                                <option value="3">3 سنوات</option>
                                <option value="5">5 سنوات</option>
                                <option value="10">10 سنوات</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Count */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mr-1">عدد الأكواد (MAX 500)</label>
                            <input
                                type="number" required min="1" max="500"
                                className="w-full h-15 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#5AA564]/30 focus:bg-white shadow-sm"
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                            />
                        </div>
                        {/* Prefix */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mr-1">بادئة التوليد (Prefix)</label>
                            <input
                                type="text" maxLength="6"
                                className="w-full h-15 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#5AA564]/30 focus:bg-white shadow-sm uppercase"
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-[#5AA564] text-white font-black rounded-2xl hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-lg shadow-xl shadow-[#5AA564]/10"
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : <><Plus size={24} strokeWidth={3} /> توليد المجموعة الآن</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────
export default function CodesPage() {
    const { codes, generateBulkCodes, deleteCode } = useActivationCodes();
    const { users } = useUsers();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grouped'); // 'grouped' | 'list'
    const [expandedGroups, setExpandedGroups] = useState({}); 
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [toast, setToast] = useState(null);

    const toggleGroup = (orgId) => {
        setExpandedGroups(prev => ({ ...prev, [orgId]: !prev[orgId] }));
    };

    const organizations = useMemo(() => {
        const entities = users.filter(u => u.accountType === 'entity');
        return entities.length > 0 ? entities : users.slice(0, 50);
    }, [users]);

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

    const enrichedCodes = useMemo(() => {
        return codes.map(code => {
            const cleanOrgId = (code.org_id || code.organization_id || code.organization)?.toString().trim();
            const org = users.find(u => 
                u.rawId?.toString() === cleanOrgId || 
                u.id?.toString() === cleanOrgId ||
                u.email?.toLowerCase() === cleanOrgId?.toLowerCase()
            );
            return {
                ...code,
                organization: org || { 
                    displayName: cleanOrgId || 'ENTITY UNKNOWN',
                    email: 'No registry found' 
                }
            };
        });
    }, [codes, users]);

    const filteredCodes = enrichedCodes.filter(c => 
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.organization?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.org_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedCodes = useMemo(() => {
        const groups = {};
        filteredCodes.forEach(code => {
            const orgId = code.org_id || 'unknown';
            if (!groups[orgId]) {
                groups[orgId] = {
                    organization: code.organization,
                    codes: [],
                    availableCount: 0,
                    consumedCount: 0,
                    soonestExpiry: null
                };
            }
            groups[orgId].codes.push(code);
            if (code.status === 'available') groups[orgId].availableCount++;
            else groups[orgId].consumedCount++;

            if (code.expires_at) {
                const expDate = new Date(code.expires_at);
                if (!groups[orgId].soonestExpiry || expDate < groups[orgId].soonestExpiry) {
                    groups[orgId].soonestExpiry = expDate;
                }
            }
        });
        return Object.entries(groups).sort((a, b) => b[1].codes.length - a[1].codes.length);
    }, [filteredCodes]);

    return (
        <div className="space-y-12 pb-20 text-right" dir="rtl">
            {/* Header & High-Level Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                <SectionHeader 
                    title="أكواد التفعيل" 
                    subtitle="Enterprise License Management" 
                />
                
                <div className="flex gap-6 w-full lg:w-auto overflow-x-auto pb-2 scrollbar-none">
                    {[
                        { label: 'إجمالي الأكواد', val: stats.total, icon: <Ticket size={18} /> },
                        { label: 'الأكواد المتاحة', val: stats.available, icon: <CheckCircle2 size={18} className="text-[#5AA564]" /> },
                        { label: 'تم استهلاكها', val: stats.used, icon: <RefreshCcw size={18} className="text-blue-400" /> },
                    ].map((s, i) => (
                        <div key={i} className="glass-card px-8 py-5 rounded-[2rem] border-gray-100 flex flex-col items-center gap-1.5 min-w-[160px] bg-white shadow-xl">
                            <div className="opacity-40 mb-1">{s.icon}</div>
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{s.label}</span>
                            <span className="text-2xl font-black text-gray-900">{s.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions & Filters Bar */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-5 w-full xl:max-w-2xl">
                    <div className="relative flex-1 group">
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5AA564] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="ابحث عن كود ترخيص أو جهة مستفيدة..."
                            className="w-full h-15 bg-white border border-gray-100 rounded-[2.5rem] pr-16 pl-8 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#5AA564]/30 shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 w-full xl:w-auto justify-end">
                    <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-100 shadow-inner">
                        <button 
                            onClick={() => setViewMode('grouped')}
                            className={`px-6 py-2.5 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grouped' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Grouped view
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`px-6 py-2.5 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            List view
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => setIsGenerateOpen(true)}
                        className="h-15 px-10 bg-[#5AA564] text-white rounded-[2.5rem] font-black text-sm hover:bg-gray-900 shadow-2xl shadow-[#5AA564]/10 transition-all active:scale-95 flex items-center gap-4 group"
                    >
                        <Plus size={22} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span>توليد حزمة أكواد</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-8">
                <AnimatePresence mode="wait">
                    {viewMode === 'grouped' ? (
                        <div key="grouped" className="space-y-8">
                            {groupedCodes.map(([orgId, group], idx) => (
                                <motion.div 
                                    key={orgId} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass-panel rounded-[3.5rem] overflow-hidden border-gray-100 shadow-2xl bg-white/50 backdrop-blur-xl group/org"
                                >
                                    {/* Group Trigger */}
                                    <button 
                                        onClick={() => toggleGroup(orgId)}
                                        className="w-full px-10 py-8 flex items-center justify-between bg-white/40 hover:bg-white transition-all text-right"
                                    >
                                        <div className="flex items-center gap-8">
                                            <div className="h-16 w-16 rounded-[1.5rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-[#5AA564] shadow-sm relative group-hover/org:bg-emerald-50 transition-colors">
                                                <Building2 size={28} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-black text-gray-900 tracking-tight">{group.organization.displayName}</h4>
                                                <div className="flex flex-wrap items-center gap-5 mt-1.5">
                                                    <span className="text-[11px] font-bold text-gray-400 tracking-tight">{group.organization.email}</span>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-100" />
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-[#5AA564] bg-emerald-50 px-3 py-1 rounded-lg uppercase tracking-widest border border-emerald-100/50">
                                                            {group.codes.length} TOTAL KEYS
                                                        </span>
                                                    </div>
                                                    {group.soonestExpiry && (
                                                        <div className="flex items-center gap-2 text-[10px] font-black text-amber-500/60 uppercase tracking-widest">
                                                            <Calendar size={14} className="opacity-40" />
                                                            Expiring soon: {group.soonestExpiry.toLocaleDateString('ar-SA')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-10">
                                            <div className="hidden md:flex items-center gap-8">
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Available</p>
                                                    <p className="text-lg font-black text-[#5AA564]">{group.availableCount}</p>
                                                </div>
                                                <div className="w-px h-10 bg-gray-100" />
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Consumed</p>
                                                    <p className="text-lg font-black text-blue-400">{group.consumedCount}</p>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: expandedGroups[orgId] ? 180 : 0 }}
                                                className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#5AA564] group-hover:text-white transition-all shadow-sm"
                                            >
                                                <ChevronDown size={24} />
                                            </motion.div>
                                        </div>
                                    </button>

                                    {/* Accordion Content */}
                                    <AnimatePresence>
                                        {expandedGroups[orgId] && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-gray-50"
                                            >
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-right border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-50/30">
                                                                <th className="px-10 py-5 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em]">الرمز السري (LICENSE)</th>
                                                                <th className="px-10 py-5 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] text-center">الدولة</th>
                                                                <th className="px-10 py-5 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] text-center">الحالة</th>
                                                                <th className="px-10 py-5 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em]">تاريخ الإصدار</th>
                                                                <th className="px-10 py-5 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em]">صلاحية المفتاح</th>
                                                                <th className="px-10 py-5 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em]"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-50 bg-white/40">
                                                            {group.codes.map((code) => {
                                                                const isExpired = code.expires_at && new Date(code.expires_at) < new Date();
                                                                return (
                                                                    <tr key={code.id} className="hover:bg-gray-50/50 transition-colors">
                                                                        <td className="px-10 py-5">
                                                                            <div className="flex items-center gap-4">
                                                                                <span className="font-mono text-base font-black text-gray-900 tracking-tighter">{code.code}</span>
                                                                                <button 
                                                                                    onClick={() => copyToClipboard(code.code)}
                                                                                    className="p-2 rounded-xl bg-gray-50 text-gray-300 hover:text-[#5AA564] hover:bg-emerald-50 transition-all opacity-0 group-hover:opacity-100"
                                                                                >
                                                                                    <Copy size={14} />
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-10 py-5 text-center">
                                                                            <span className="text-[11px] font-black text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                                                                {code.country_code || 'Global'}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-10 py-5 text-center">
                                                                            <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm
                                                                                ${code.status === 'available' 
                                                                                    ? 'bg-emerald-50 border-emerald-100 text-[#5AA564]' 
                                                                                    : 'bg-blue-50 border-blue-100 text-blue-500'}`}>
                                                                                {code.status === 'available' ? 'المفتاح جاهز' : 'تم تفعيله'}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-10 py-5">
                                                                            <span className="text-xs font-bold text-gray-400">
                                                                                {new Date(code.created_at).toLocaleDateString('ar-SA')}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-10 py-5">
                                                                            <div className="flex flex-col">
                                                                                <span className={`text-sm font-black tracking-tight ${isExpired ? 'text-rose-500' : 'text-gray-900 opacity-60'}`}>
                                                                                    {code.expires_at ? new Date(code.expires_at).toLocaleDateString('ar-SA') : 'UNLIMITED'}
                                                                                </span>
                                                                                {isExpired && (
                                                                                    <span className="text-[8px] font-black text-rose-300 uppercase tracking-widest mt-0.5">EXPIRED LICENSE</span>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-10 py-5 text-left">
                                                                            <button 
                                                                                onClick={() => deleteCode(code.id, code.code)}
                                                                                className="h-10 w-10 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-xl text-gray-300 hover:text-rose-500 hover:shadow-sm transition-all active:scale-95"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-[3.5rem] overflow-hidden border-gray-100 shadow-2xl bg-white/50 backdrop-blur-xl">
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-right">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">LICENSE KEY</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 text-center">COUNTRY</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 text-center">STATUS</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">BENEFICIARY ENTITY</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">EXPIRY DATE</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 text-left">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 bg-white/30">
                                        {filteredCodes.map((code) => (
                                            <tr key={code.id} className="hover:bg-gray-50/80 transition-all cursor-pointer group">
                                                <td className="px-10 py-6">
                                                   <div className="flex items-center gap-4 text-gray-900 font-mono text-base font-black">
                                                       {code.code}
                                                       <button onClick={() => copyToClipboard(code.code)} className="h-8 w-8 flex items-center justify-center bg-gray-50 rounded-lg text-gray-300 hover:text-[#5AA564] opacity-0 group-hover:opacity-100 transition-all"><Copy size={14} /></button>
                                                   </div>
                                                </td>
                                                <td className="px-10 py-6 text-center">
                                                    <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
                                                        {code.country_code || 'Global'}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-6 text-center">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm
                                                        ${code.status === 'available' ? 'bg-emerald-50 border-emerald-100 text-[#5AA564]' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                                                        {code.status === 'available' ? 'Active' : 'Consumed'}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-6">
                                                   <div className="flex items-center gap-4">
                                                       <div className="h-10 w-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-300"><Building2 size={18} /></div>
                                                       <div className="overflow-hidden">
                                                            <p className="font-black text-gray-900 text-sm leading-tight mb-0.5 truncate">{code.organization?.displayName || 'SYSTEM ENTITY'}</p>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter truncate">{code.organization?.email || 'Global Registry'}</p>
                                                       </div>
                                                   </div>
                                                </td>
                                                <td className="px-10 py-6">
                                                   <span className="text-sm font-black text-gray-900 opacity-60 italic">{code.expires_at ? new Date(code.expires_at).toLocaleDateString('ar-SA') : 'UNLIMITED'}</span>
                                                </td>
                                                <td className="px-10 py-6 text-left">
                                                   <button onClick={() => deleteCode(code.id, code.code)} className="h-10 w-10 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-xl text-gray-300 hover:text-rose-500 transition-colors active:scale-95"><Trash2 size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals & Toasts Overlay */}
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
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
}
