"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, Send, MessageSquare, Video, 
    Info, AlertTriangle, CheckCircle2, 
    X, Loader2, Smartphone, Eye,
    BookOpen, Sparkles, History
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ── Toast Notification ────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-bold backdrop-blur-xl
            ${type === 'success'
                ? 'bg-[#5AA564]/10 border-[#5AA564]/20 text-[#5AA564]'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}
    >
        {type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X size={14} /></button>
    </motion.div>
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
            // Call Supabase Edge Function
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
        <div className="space-y-10 pb-20 text-right" dir="rtl">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                <div>
                    <h3 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
                        الإشعارات الجماعية
                        <Sparkles className="text-[#5AA564] animate-pulse" size={32} />
                    </h3>
                    <p className="text-[#5AA564]/40 font-bold text-sm mt-2">أرسل تنبيهات مباشرة لجميع مستخدمي التطبيق (FCM Broadcast).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Notification Form */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="glass-panel rounded-[2.5rem] p-10 relative overflow-hidden border-[#5AA564]/10 shadow-2xl">
                        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#5AA564]/40 to-transparent" />
                        
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-12 w-12 rounded-2xl bg-[#5AA564]/10 border border-[#5AA564]/20 flex items-center justify-center text-[#5AA564]">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white">إنشاء إشعار جديد</h4>
                                <p className="text-[#5AA564]/40 text-xs font-bold mt-0.5">املاً البيانات لإرسال التنبيه فوراً</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#5AA564]/50 mr-2">عنوان الإشعار</label>
                                <input
                                    type="text"
                                    placeholder="مثال: تحديث جديد متاح، أو تهنئة بالعيد..."
                                    className="w-full h-14 glass-input rounded-2xl px-6 text-sm font-bold text-white focus:border-[#5AA564]/40 transition-all"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Body */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#5AA564]/50 mr-2">نص الإشعار (Body)</label>
                                <textarea
                                    placeholder="اكتب تفاصيل الإشعار هنا..."
                                    className="w-full min-h-[120px] glass-input rounded-3xl px-6 py-5 text-sm font-medium text-white focus:border-[#5AA564]/40 transition-all resize-none"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                />
                            </div>

                            {/* Notification Type Tabs */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#5AA564]/50 mr-2">نوع الإشعار والتوجيه</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'general', label: 'عام', icon: <Bell size={16} /> },
                                        { id: 'update', label: 'تحديث', icon: <Info size={16} /> },
                                        { id: 'sign_language', label: 'لغة إشارة', icon: <Video size={16} /> },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setType(t.id)}
                                            className={`h-14 rounded-2xl border transition-all flex items-center justify-center gap-2 text-xs font-black
                                                ${type === t.id 
                                                    ? 'bg-[#5AA564]/10 border-[#5AA564]/30 text-[#5AA564] shadow-lg shadow-[#5AA564]/5' 
                                                    : 'bg-white/3 border-white/5 text-white/30 hover:text-white hover:bg-white/5'}`}
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
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 bg-[#5AA564]/5 border border-[#5AA564]/10 rounded-3xl grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase text-[#5AA564]/60 flex items-center gap-2">
                                                    <BookOpen size={12} /> رقم السورة
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="114"
                                                    className="w-full h-12 glass-input rounded-xl px-4 text-sm font-bold text-white text-center"
                                                    value={suraId}
                                                    onChange={(e) => setSuraId(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase text-[#5AA564]/60 flex items-center gap-2">
                                                    <Info size={12} /> رقم الآية
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-full h-12 glass-input rounded-xl px-4 text-sm font-bold text-white text-center"
                                                    value={verseId}
                                                    onChange={(e) => setVerseId(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-2 text-[10px] text-[#5AA564]/40 font-bold border-t border-[#5AA564]/10 pt-4 flex items-center gap-2">
                                                <Sparkles size={12} /> سيقوم التطبيق بفتح شاشة القراءة وتشغيل لغة الإشارة تلقائياً لهذه الآية.
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Send Button */}
                            <div className="pt-6">
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    disabled={!title || !body || isSending}
                                    className="w-full h-16 bg-[#5AA564] text-[#0A0D1A] font-black rounded-[1.25rem] hover:bg-[#4A8F53] transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3 text-lg shadow-xl shadow-[#5AA564]/20"
                                >
                                    {isSending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                                    إرسال الإشعار لجميع الأجهزة
                                </button>
                                <p className="text-center text-[10px] font-bold text-[#5AA564]/30 mt-4 uppercase tracking-[0.2em]">
                                    تنبيه: سيتم إرسال هذا الإشعار لجميع المستخدمين النشطين (Android/iOS)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview / Instructions */}
                <div className="space-y-8">
                    {/* Mobile Preview */}
                    <div className="glass-panel rounded-[2.5rem] p-8 border-white/5 relative overflow-hidden flex flex-col items-center">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#5AA564]/40 mb-6 flex items-center gap-2">
                            <Eye size={14} /> معاينة مباشرة
                        </div>
                        
                        <div className="w-full max-w-[260px] aspect-[9/19] bg-[#1a1c2e] border-4 border-[#2a2d4a] rounded-[2.5rem] p-4 relative shadow-2xl">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#2a2d4a] rounded-b-2xl" />
                            
                            {/* Sample Notification */}
                            <motion.div
                                animate={{ y: [20, 0], opacity: [0, 1] }}
                                key={title + body}
                                className="mt-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-5 h-5 bg-[#5AA564] rounded-md flex items-center justify-center">
                                        <img src="/logo/logo.png" className="w-3 h-3 invert" />
                                    </div>
                                    <span className="text-[8px] font-black text-white/40 uppercase">مصحف أنامل</span>
                                    <span className="text-[8px] text-white/20 mr-auto">الآن</span>
                                </div>
                                <h5 className="text-[10px] font-black text-white truncate">{title || 'عنوان الإشعار'}</h5>
                                <p className="text-[9px] text-white/60 line-clamp-2 mt-0.5 leading-relaxed">{body || 'محتوى الإشعار وتفاصيله ستظهر هنا للجمهور...'}</p>
                            </motion.div>
                            
                            {/* Bottom Home Indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/20 rounded-full" />
                        </div>
                        
                        <div className="mt-8 flex items-center gap-2 text-[#5AA564]/40 text-[10px] font-bold">
                            <Smartphone size={12} /> يظهر الإشعار تلقائياً على شاشة القفل والمنبثقة
                        </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="glass-panel rounded-3xl p-8 border-[#5AA564]/5 space-y-4">
                        <h5 className="text-sm font-black text-white flex items-center gap-3">
                            <Info size={16} className="text-[#5AA564]" />
                            نصائح للإرسال
                        </h5>
                        <ul className="space-y-3">
                            {[
                                'استخدم عناوين قصيرة وجذابة.',
                                'إشعارات لغة الإشارة تزيد من التفاعل بنسبة 40%.',
                                'تأكد من صحة رقم السورة والآية قبل الإرسال.',
                                'تجنب الإرسال المكرر في أوقات متقاربة.'
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs text-white/40 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#5AA564] mt-1.5 shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Confirm Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowConfirm(false)}
                            className="absolute inset-0 bg-[#0A0D1A]/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-panel w-full max-w-md rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl text-center"
                        >
                            <div className="h-20 w-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-6">
                                <AlertTriangle size={40} />
                            </div>
                            <h4 className="text-2xl font-black text-white mb-2">تأكيد الإرسال الجماعي؟</h4>
                            <p className="text-white/40 text-sm font-medium mb-8">أنت على وشك إرسال إشعار لجميع مستخدمي التطبيق. هذا الإجراء لا يمكن التراجع عنه.</p>
                            
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 h-14 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleSend}
                                    className="flex-1 h-14 bg-[#5AA564] text-[#0A0D1A] font-black rounded-2xl hover:bg-[#4A8F53] transition-all"
                                >
                                    تأكيد وإرسال
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
}
