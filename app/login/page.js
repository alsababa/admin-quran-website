"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
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
        <div className="min-h-screen bg-[#0D1510] flex items-center justify-center p-4 relative overflow-hidden text-[#F5F2ED] font-sans" dir="rtl">
            {/* Animated Botanical Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#8FB394]/10 blur-[130px] rounded-full animate-glow-sage" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#4A6351]/10 blur-[130px] rounded-full animate-glow-sage" style={{ animationDelay: '-5s' }} />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md z-10"
            >
                {/* Branding Section */}
                <div className="text-center mb-10 overflow-hidden">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                        className="inline-flex p-5 rounded-3xl bg-gradient-to-br from-[#8FB394] to-[#4A6351] shadow-2xl shadow-[#8FB394]/20 mb-6 text-[#F5F2ED]"
                    >
                        <BookOpen size={44} strokeWidth={2.5} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl font-extrabold tracking-tight mb-3 text-[#F5F2ED]"
                    >
                        قرآن الإشارة
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-[#8FB394]/70 font-medium text-sm"
                    >
                        لوحة التحكم الإدارية للمحتوى والبيانات
                    </motion.p>
                </div>

                {/* Login Container */}
                <div className="glass-panel rounded-[2.5rem] p-10 shadow-3xl relative group">
                    <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#8FB394]/40 to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-xs font-bold"
                                >
                                    <AlertCircle size={18} className="shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-3 text-right">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8FB394]/60 pr-5">البريد الإلكتروني</label>
                            <div className="relative group/input">
                                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8FB394]/40 group-focus-within/input:text-[#8FB394] transition-colors" size={20} strokeWidth={1.5} />
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@example.com"
                                    className="w-full h-14 glass-input rounded-2xl pr-14 pl-6 text-sm font-medium text-[#F5F2ED] placeholder:text-[#8FB394]/20 focus:border-[#8FB394]/40 focus:ring-4 focus:ring-[#8FB394]/5 transition-all outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 text-right">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8FB394]/60 pr-5">كلمة المرور</label>
                            <div className="relative group/input">
                                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8FB394]/40 group-focus-within/input:text-[#8FB394] transition-colors" size={20} strokeWidth={1.5} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full h-14 glass-input rounded-2xl pr-14 pl-6 text-sm font-medium text-[#F5F2ED] placeholder:text-[#8FB394]/20 focus:border-[#8FB394]/40 focus:ring-4 focus:ring-[#8FB394]/5 transition-all outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-gradient-to-r from-[#8FB394] to-[#4A6351] hover:brightness-110 text-[#F5F2ED] font-extrabold rounded-2xl shadow-xl shadow-[#4A6351]/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <span>دخول للمنصة</span>
                                    <ArrowRight size={22} strokeWidth={2.5} className="transform rotate-180 group-hover:-translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center text-[#8FB394]/40 text-[10px] mt-12 font-bold tracking-widest uppercase"
                >
                    © 2026 قرآن لغة الإشارة — الهوية البصرية الرسمية
                </motion.p>
            </motion.div>
        </div>
    );
}
