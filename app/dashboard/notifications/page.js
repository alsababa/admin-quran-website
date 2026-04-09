"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, Send, MessageSquare, Video, 
    Info, AlertTriangle, CheckCircle2, 
    X, Loader2, Smartphone, Eye,
    BookOpen, Sparkles, History,
    ArrowLeft
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

export default function NotificationsPage() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [type, setType] = useState('general'); // general | update | sign_language
    const [suraId, setSuraId] = useState('1');
    const [verseId, setVerseId] = useState('1');
    const [isSending, setIsSending] = useState(false);
    const [toast, setToast] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleSend = async () => {
        setIsSending(true);
        setShowConfirm(false);

        try {
            const { data, error } = await supabase.functions.invoke('broadcast-notification', {
                body: {
                    title,
                    body,
                    type,
                    metadata: type === 'sign_language' ? { suraId, verseId } : {}
                }
            });

            if (error) throw error;

            showToast('تم إرسال الإشعار لجميع المستخدمين بنجاح 🚀');
            setTitle('');
            setBody('');
        } catch (err) {
            console.error('Send error:', err);
            showToast(err.message || 'فشل إرسال الإشعار', 'error');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-12 pb-20 text-right" dir="rtl">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                <SectionHeader 
                    title="الإشعارات الجماعية" 
                    subtitle="Push Notification Broadcast" 
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Notification Form */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="glass-panel rounded-[3.5rem] p-12 relative overflow-hidden border-gray-100 shadow-2xl bg-white/50 backdrop-blur-3xl">
                        <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-[#5AA564]/40 to-transparent" />
                        
                        <div className="flex items-center gap-5 mb-10">
                            <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#5AA564] shadow-sm">
                                <MessageSquare size={28} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-gray-900 tracking-tight">إنشاء إشعار بـث</h4>
                                <p className="text-[#5AA564] text-[10px] font-black uppercase tracking-widest mt-1 opacity-40">أرسل تنبيهات مباشرة لجميع الهواتف</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Title */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mr-2">عنوان الإشعار (Title)</label>
                                <input
                                    type="text"
                                    placeholder="مثال: تحديث جديد متاح، أو تهنئة بالعيد..."
                                    className="w-full h-15 bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#5AA564]/30 focus:bg-white transition-all shadow-sm"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Body */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mr-2">نص الرسالة الواردة</label>
                                <textarea
                                    placeholder="اكتب تفاصيل الإشعار هنا..."
                                    className="w-full min-h-[140px] bg-gray-50 border border-gray-100 rounded-[2rem] px-6 py-6 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#5AA564]/30 focus:bg-white transition-all shadow-sm resize-none custom-scrollbar"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                />
                            </div>

                            {/* Notification Type Tabs */}
                            <div className="space-y-5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mr-2">نوع الإشعار والتوجيه التلقائي</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { id: 'general', label: 'عام', icon: <Bell size={18} /> },
                                        { id: 'update', label: 'تحديث نظام', icon: <Info size={18} /> },
                                        { id: 'sign_language', label: 'لغة إشارة', icon: <Video size={18} /> },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setType(t.id)}
                                            className={`h-16 rounded-[1.5rem] border transition-all flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-wider
                                                ${type === t.id 
                                                    ? 'bg-emerald-50 border-emerald-100 text-[#5AA564] shadow-md shadow-emerald-500/5' 
                                                    : 'bg-white/50 border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-white hover:shadow-sm'}`}
                                        >
                                            {t.icon}
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Conditional Sign Language Inputs */}
                            <AnimatePresence>
                                {type === 'sign_language' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-8 bg-emerald-50/30 border border-emerald-100/50 rounded-[2.5rem] grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black uppercase tracking-[0.15em] text-[#5AA564]/60 flex items-center gap-2">
                                                    <BookOpen size={14} /> رقم السورة المستهدفة
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="114"
                                                    className="w-full h-13 bg-white border border-emerald-100 rounded-xl px-5 text-sm font-black text-gray-900 text-center focus:outline-none focus:border-[#5AA564] shadow-sm"
                                                    value={suraId}
                                                    onChange={(e) => setSuraId(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black uppercase tracking-[0.15em] text-[#5AA564]/60 flex items-center gap-2">
                                                    <Info size={14} /> الآية المختارة
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-full h-13 bg-white border border-emerald-100 rounded-xl px-5 text-sm font-black text-gray-900 text-center focus:outline-none focus:border-[#5AA564] shadow-sm"
                                                    value={verseId}
                                                    onChange={(e) => setVerseId(e.target.value)}
                                                />
                                            </div>
                                            <div className="sm:col-span-2 text-[10px] text-gray-400 font-bold border-t border-emerald-100/30 pt-6 flex items-start gap-3">
                                                <Sparkles size={16} className="text-[#5AA564] shrink-0" /> 
                                                <span>سيقوم التطبيق تلقائياً بفتح شاشة القراءة وتشغيل فيديو لغة الإشارة لهذه الآية عند ضغط المستخدم على الإشعار.</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Final Action Button */}
                            <div className="pt-10">
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    disabled={!title || !body || isSending}
                                    className="w-full h-18 bg-[#5AA564] text-white font-black rounded-[2rem] hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-4 text-xl shadow-2xl shadow-[#5AA564]/10"
                                >
                                    {isSending ? <Loader2 size={28} className="animate-spin" /> : <Send size={28} className="translate-y-0.5" />}
                                    بث الإشعار الجماعي الآن
                                </button>
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#5AA564]/40" />
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.25em]">
                                        سيصل هذا التنبيه لجميع الأجهزة النشطة حول العالم
                                    </p>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#5AA564]/40" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Preview Area */}
                <div className="space-y-10">
                    <div className="glass-panel rounded-[3.5rem] p-10 border-gray-100 relative overflow-hidden flex flex-col items-center bg-white/50 backdrop-blur-xl shadow-xl">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5AA564] bg-emerald-50 px-5 py-2 rounded-full mb-10 flex items-center gap-3">
                            <Eye size={16} /> LIVE PREVIEW
                        </div>
                        
                        {/* Realistic Mockup */}
                        <div className="w-full max-w-[280px] aspect-[9/18.5] bg-gray-900 border-[8px] border-gray-800 rounded-[3.5rem] p-5 relative shadow-2xl shadow-gray-400/40 outline outline-1 outline-gray-200">
                            {/* Camera Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-800 rounded-b-3xl" />
                            
                            {/* Device Interface */}
                            <div className="h-full w-full rounded-[2.5rem] bg-gradient-to-br from-slate-800 via-slate-900 to-black overflow-hidden relative">
                                {/* Sample Lock Screen Content */}
                                <div className="absolute top-12 left-0 right-0 text-center">
                                    <span className="text-4xl text-white font-black opacity-90">12:45</span>
                                    <p className="text-[9px] text-white/40 mt-1 uppercase tracking-widest px-2">Thursday, May 15</p>
                                </div>

                                {/* Floating Notification */}
                                <motion.div
                                    animate={{ y: [40, 0], opacity: [0, 1] }}
                                    key={title + body}
                                    className="absolute top-36 left-2 right-2 bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] p-4 shadow-2xl"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 bg-[#5AA564] rounded-lg flex items-center justify-center p-1.5">
                                            <img src="/logo/logo.png" className="w-full h-full invert opacity-90" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-[8px] font-black text-white/50 uppercase tracking-tighter">مصحف أنامل للصم</p>
                                        </div>
                                        <span className="text-[7px] font-bold text-white/20">الآن</span>
                                    </div>
                                    <h5 className="text-[11px] font-black text-white truncate text-right">{title || 'عنوان التنبيه...'}</h5>
                                    <p className="text-[9px] font-medium text-white/60 line-clamp-2 mt-1 leading-relaxed text-right">{body || 'المحتوى البصري سيظهر هنا بهذا الشكل على هواتف المستخدمين...'}</p>
                                </motion.div>

                                {/* System UI Elements */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/30 rounded-full" />
                            </div>
                        </div>
                        
                        <div className="mt-10 flex items-center gap-3 text-gray-400 text-[10px] font-black uppercase tracking-widest opacity-80">
                            <Smartphone size={16} className="text-[#5AA564]" /> VISUAL FIDELITY PREVIEW
                        </div>
                    </div>

                    {/* Pro Tips Panel */}
                    <div className="glass-panel rounded-[2.5rem] p-10 border-gray-100 space-y-6 bg-white shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-700" />
                        <h5 className="text-base font-black text-gray-900 flex items-center gap-4 relative z-10">
                            <Info size={18} className="text-[#5AA564]" />
                            نصائح الوصول للجمهور
                        </h5>
                        <ul className="space-y-4 relative z-10">
                            {[
                                'عناوين "لغة الإشارة" تزيد نسبة الفتح بنسبة 35%.',
                                'أفضل وقت للإرسال هو بين الساعة 8 و 10 مساءً.',
                                'تأكد من اختيار نوع الإشعار المناسب للتوجه التلقائي.',
                                'قلل من استخدام الرموز التعبيرية المفرطة في العنوان.'
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-4 text-[12px] text-gray-500 font-bold leading-relaxed">
                                    <div className="w-2 h-2 rounded-full bg-emerald-100 border border-emerald-500/20 mt-1.5 shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Confirm Broadcast Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                        <ModalBackdrop onClick={() => setShowConfirm(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="glass-panel w-full max-w-md rounded-[3.5rem] p-12 relative overflow-hidden shadow-3xl bg-white/95 backdrop-blur-3xl text-center"
                        >
                            <div className="h-24 w-24 rounded-[2.5rem] bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mx-auto mb-8 shadow-sm">
                                <AlertTriangle size={48} strokeWidth={1.5} />
                            </div>
                            <h4 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter">تأكيد البث الجماعي؟</h4>
                            <p className="text-gray-400 text-sm font-bold mb-10 px-4 leading-relaxed">أنت على وشك إرسال إشعار فوري لجميع المستخدمين. لا يمكن التراجع عن هذه العملية بمجرد بدئها.</p>
                            
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleSend}
                                    className="w-full h-15 bg-[#5AA564] text-white font-black rounded-2xl hover:bg-gray-900 transition-all shadow-xl shadow-[#5AA564]/10 active:scale-95"
                                >
                                    نعم، أرسل للجميع الآن
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="w-full h-14 bg-gray-50 text-gray-400 font-black text-xs hover:text-gray-900 transition-all rounded-2xl"
                                >
                                    تراجع / مراجعة المحتوى
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast System */}
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
}
