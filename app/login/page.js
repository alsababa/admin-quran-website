"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Mail, Lock, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            setError('فشل تسجيل الدخول. يرجى التحقق من البيانات.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0D1A] flex items-center justify-center p-4 relative overflow-hidden text-[#F5F0E8] font-sans" dir="rtl">
            {/* Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#C9A84C]/8 blur-[130px] rounded-full animate-glow-gold" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#1E2448]/80 blur-[130px] rounded-full animate-glow-gold" style={{ animationDelay: '-5s' }} />
            <div className="absolute inset-0 arabic-pattern" />

            {/* Gold top shimmer */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md z-10"
            >
                {/* Branding */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                        className="inline-flex p-5 rounded-3xl bg-gradient-to-br from-[#C9A84C] to-[#8B6F2E] shadow-2xl shadow-[#C9A84C]/25 mb-5 text-[#0A0D1A]"
                    >
                        <BookOpen size={42} strokeWidth={2.5} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl font-extrabold tracking-tight text-[#F5F0E8]"
                    >
                        قرآن الإشارة
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-[#C9A84C]/60 font-bold text-xs mt-2 uppercase tracking-widest"
                    >
                        لوحة التحكم الإدارية
                    </motion.p>
                </div>

                {/* Login Card */}
                <div className="glass-panel rounded-[2.5rem] p-10 shadow-2xl relative">
                    <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-7">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-xs font-bold"
                                >
                                    <AlertCircle size={17} className="shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2.5 text-right">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C9A84C]/60 pr-4">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-[#C9A84C]/30" size={18} strokeWidth={1.5} />
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@example.com"
                                    className="w-full h-14 glass-input rounded-2xl pr-14 pl-6 text-sm font-medium text-[#F5F0E8] placeholder:text-[#C9A84C]/20 outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5 text-right">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C9A84C]/60 pr-4">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-[#C9A84C]/30" size={18} strokeWidth={1.5} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full h-14 glass-input rounded-2xl pr-14 pl-6 text-sm font-medium text-[#F5F0E8] placeholder:text-[#C9A84C]/20 outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-gradient-to-r from-[#C9A84C] to-[#8B6F2E] hover:brightness-110 text-[#0A0D1A] font-extrabold rounded-2xl shadow-xl shadow-[#C9A84C]/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            {loading ? (
                                <Loader2 className="animate-spin" size={22} />
                            ) : (
                                <>
                                    <span>دخول للمنصة</span>
                                    <ArrowLeft size={20} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center text-[#C9A84C]/30 text-[9px] mt-10 font-bold tracking-widest uppercase"
                >
                    © 2026 قرآن لغة الإشارة — نظام الإدارة
                </motion.p>
            </motion.div>
        </div>
    );
}
