"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HandMetal, Smartphone, Accessibility, Star, Users, Video, ChevronLeft, Play, Globe, Shield, CheckCircle2, BookOpen, Compass, Check, ArrowLeft, Lightbulb, MessageSquareQuote, Loader2 } from 'lucide-react';


const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
        <div className="h-14 w-14 rounded-2xl bg-[#5AA564]/10 flex items-center justify-center text-[#5AA564] mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-sm font-medium text-gray-500 leading-relaxed">{desc}</p>
    </div>
);

const StatBadge = ({ value, label, icon }) => (
    <motion.div 
        whileHover={{ y: -8, scale: 1.05 }}
        className="text-center group p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(90,165,100,0.08)] transition-all duration-500 relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5AA564]/10 to-transparent rounded-bl-full opacity-40 -z-10 group-hover:scale-125 transition-transform duration-700" />
        <div className="flex justify-center mb-4 text-[#5AA564] opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
            {icon}
        </div>
        <p className="text-5xl md:text-6xl font-black text-gray-900 mb-2 tracking-tighter transition-colors group-hover:text-[#5AA564]">{value}</p>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">{label}</p>
    </motion.div>
);

const StepIndicator = ({ number, title, desc }) => (
    <div className="relative pl-0 md:pl-10 text-center md:text-right flex flex-col md:flex-row items-center md:items-start gap-6 group">
        <div className="flex-shrink-0 w-16 h-16 bg-white border-4 border-[#F8FAFC] shadow-xl rounded-full flex items-center justify-center text-xl font-black text-[#5AA564] z-10 relative">
            {number}
        </div>
        <div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed max-w-sm">{desc}</p>
        </div>
    </div>
);

export default function LandingPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [runtimeError, setRuntimeError] = useState(null);
    const [show3D, setShow3D] = useState(false);
    const [is3DLoading, setIs3DLoading] = useState(true);
    const section3DRef = useRef(null);

    useEffect(() => {
        try {
            setIsMounted(true);
        } catch (e) {
            setRuntimeError(e);
        }
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShow3D(true);
                    observer.disconnect(); // Load once and keep it
                }
            },
            { threshold: 0.1 }
        );
        if (section3DRef.current) {
            observer.observe(section3DRef.current);
        }
        return () => observer.disconnect();
    }, [isMounted]);

    if (runtimeError) {
        return (
            <div style={{ padding: 40, background: '#fff', color: '#000', direction: 'ltr', textAlign: 'left', minHeight: '100vh' }}>
                <h1 style={{ color: 'red', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Production Runtime Exception (Landing)</h1>
                <p style={{ marginBottom: 10 }}>This error is captured by the diagnostic layer.</p>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                    <p style={{ fontWeight: 'bold', color: '#E53E3E' }}>{runtimeError.name}: {runtimeError.message}</p>
                    <pre style={{ fontSize: 12, lineHeight: 1.5, marginTop: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                        {runtimeError.stack}
                    </pre>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    style={{ padding: '12px 24px', background: '#5AA564', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    if (!isMounted) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#5AA564' }}>
                <div className="animate-spin text-white">
                    <Loader2 size={48} strokeWidth={2.5} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-[#5AA564]/20" dir="rtl">

            {/* ── Navbar ── */}
            <nav className="fixed inset-x-0 top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative group cursor-pointer"
                        >
                            <div className="absolute -inset-2 bg-gradient-to-tr from-[#5AA564]/30 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />
                            <div className="relative p-1.5 bg-white border border-gray-100 shadow-sm rounded-xl transition-transform">
                                <img src="/logo/logo.png" alt="شعار مصحف أنامل للصم" className="w-10 h-10 object-contain" />
                            </div>
                        </motion.div>
                        <div className="flex flex-col -space-y-1">
                            <span className="text-xl font-black text-gray-900 tracking-tight hidden sm:block">مصحف أنامل</span>
                            <span className="text-[10px] font-bold text-[#5AA564] uppercase tracking-[0.2em] hidden sm:block text-right">لخدمة الصم</span>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-10 text-[13px] font-black uppercase tracking-widest text-gray-400">
                        <a href="#features" className="hover:text-[#5AA564] transition-colors relative group">
                            المميزات
                            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#5AA564] group-hover:w-full transition-all" />
                        </a>
                        <a href="#interface" className="hover:text-[#5AA564] transition-colors relative group">
                            واجهة التطبيق
                            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#5AA564] group-hover:w-full transition-all" />
                        </a>
                        <a href="#process" className="hover:text-[#5AA564] transition-colors relative group">
                            كيف يعمل؟
                            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#5AA564] group-hover:w-full transition-all" />
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors border-l border-gray-100 pr-0 pl-6 hidden sm:block">
                            دخول الإدارة
                        </Link>
                        <a href="#download" className="inline-flex items-center gap-2 px-6 h-11 bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 hover:-translate-y-0.5">
                            تحميل التطبيق
                        </a>
                    </div>
                </div>
            </nav>

            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative pt-24 pb-12 px-6 mx-auto overflow-hidden bg-white"
            >
                {/* Advanced Premium Background Elements */}
                <div className="absolute top-0 inset-x-0 h-[800px] pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            x: [0, 50, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-gradient-to-tr from-[#5AA564]/10 to-blue-400/5 blur-[120px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.4, 0.2],
                            y: [0, -40, 0],
                            rotate: [0, 45, 0]
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-20 right-[-100px] w-[500px] h-[500px] bg-gradient-to-br from-[#4A8F53]/15 to-blue-500/5 blur-[100px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.1, 0.2, 0.1],
                            x: [-100, 100, -100]
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#5AA564]/5 blur-[150px] rounded-full"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/40 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(90,165,100,0.1)] rounded-full mb-12 group cursor-default"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#5AA564] blur-md opacity-40 animate-pulse rounded-full" />
                            <Star size={14} className="text-[#5AA564] relative z-10 fill-[#5AA564]" />
                        </div>
                        <span className="text-[11px] font-black text-[#5AA564] uppercase tracking-[0.3em]">الأول من نوعه في العالم الإسلامي</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter text-gray-900 leading-[0.95] mb-10"
                    >
                        تلاوة وفهم القرآن <br className="hidden md:block" />
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#5AA564] via-[#4A8F53] to-[#5AA564] bg-[length:200%_auto] animate-shimmer">بأنامل الصم</span>
                            <div className="absolute -bottom-2 inset-x-0 h-4 bg-[#5AA564]/10 blur-xl -z-10 rounded-full" />
                        </span> بيسر.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-2xl text-gray-500 font-bold mb-16 max-w-3xl mx-auto leading-relaxed px-4"
                    >
                        منصة <span className="text-gray-900 font-black relative">
                            مصحف أنامل
                            <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#5AA564]/10 rounded-full" />
                        </span> هي نافذتك الشاملة لتعلم وتدبر كتاب الله، مع مكتبة تفاعلية متكاملة مصممة خصيصاً للصم وضعاف السمع بجودة فائقة.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16"
                    >
                        <a href="#download" className="group w-full sm:w-auto relative overflow-hidden flex items-center justify-center gap-3 h-20 px-14 bg-gray-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs rounded-[2rem] transition-all hover:scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine" />
                            <Smartphone size={20} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                            تحميل التطبيق مجاناً
                        </a>
                        <a href="#demo" className="w-full sm:w-auto flex items-center justify-center gap-3 h-20 px-14 bg-white text-gray-900 hover:text-[#5AA564] border border-gray-100 hover:border-[#5AA564]/30 font-black uppercase tracking-widest text-xs rounded-[2rem] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.02)] active:scale-95 group/demo">
                            <div className="w-10 h-10 bg-gray-50 group-hover/demo:bg-[#5AA564]/10 rounded-xl flex items-center justify-center transition-colors">
                                <Play size={18} className="fill-gray-900 group-hover/demo:fill-[#5AA564] transition-colors" />
                            </div>
                            كيف يعمل؟
                        </a>
                    </motion.div>
                </div>


            </motion.section>
            {/* ── 3D Interactive Welcome Section ── */}
            <section className="relative py-12 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* 3D Viewer Container */}
                        <motion.div
                            ref={section3DRef}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.03, rotate: 0.5 }}
                            animate={{ 
                                y: [0, -15, 0],
                                rotate: [0, 0.5, -0.5, 0]
                            }}
                            transition={{ 
                                opacity: { duration: 0.8 },
                                scale: { duration: 0.8 },
                                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                                rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                            }}
                            viewport={{ once: true }}
                            className="relative group h-[550px] md:h-[650px] bg-gradient-to-br from-white via-gray-50 to-[#5AA564]/5 rounded-[4rem] overflow-hidden border-[1.5px] border-gray-100 shadow-[0_50px_100px_rgba(0,0,0,0.08)] hover:shadow-[0_80px_150px_rgba(90,165,100,0.15)] transition-all duration-1000"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#5AA564]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#5AA564]/5 blur-[100px] rounded-full animate-pulse" />
                            
                            <AnimatePresence>
                                {!show3D || is3DLoading ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-50/10 backdrop-blur-sm"
                                    >
                                        <div className="w-16 h-16 rounded-full border-4 border-[#5AA564]/20 border-t-[#5AA564] animate-spin mb-4" />
                                        <p className="text-[10px] font-black text-[#5AA564] uppercase tracking-[0.2em]">جاري تشغيل المعالج الثلاثي الأبعاد...</p>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>

                            {show3D && (
                                <iframe
                                    src="/3viewer/index.html"
                                    className="w-full h-full border-none relative z-10 scale-[1.02] origin-center transition-transform duration-700 group-hover:scale-105 pointer-events-none group-hover:pointer-events-auto"
                                    title="3D Sign Language Translator"
                                    scrolling="no"
                                    onLoad={() => setIs3DLoading(false)}
                                />
                            )}
                        </motion.div>

                        <div className="text-right flex flex-col justify-center">

                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-10 leading-[1.1]">
                                نرحب بكم في المشروع <br /> <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#5AA564] to-[#4A8F53]">الأول عالمياً</span> لترجمة <br /> القرآن بتقنية 3D
                            </h2>

                            <div className="relative">
                                <div className="absolute -right-6 top-0 w-1.5 h-full bg-gradient-to-b from-[#5AA564] via-[#5AA564]/20 to-transparent rounded-full shadow-[0_0_15px_rgba(90,165,100,0.2)]" />
                                <p className="text-gray-500 font-bold text-xl mb-12 leading-relaxed max-w-xl pr-8">
                                    ثورة في عالم التواصل الديني؛ نستخدم تقنيات "التقاط الحركة" المتقدمة لنقل أدق تفاصيل تعابير الوجه وحركات اليدين لتجسيد قدسية القرآن الكريم بلغة الإشارة بشكل حيّ وتفاعلي.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { title: 'ترجمة لغوية فورية', desc: 'تفسير دقيق لمعاني القرآن الكريم تم تحويله إلى لغة إشارة معتمدة.' },
                                    { title: 'تفاعل حركي ذكي', desc: 'استخدام تقنيات الذكاء الاصطناعي لضمان سلاسة الربط بين الكلمات والإشارات.' },
                                    { title: 'قاموس إشاري متكامل', desc: 'مكتبة ضخمة تغطي جميع المفردات القرآنية لخدمة مجتمع الصم.' }
                                ].map((item, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-5 items-start group/item"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-extrabold text-gray-900 text-lg mb-1 group-hover/item:text-[#5AA564] transition-colors">{item.title}</h4>
                                            <p className="text-gray-400 font-medium text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#5AA564] shrink-0 border border-gray-100 group-hover/item:bg-[#5AA564] group-hover/item:text-white transition-all duration-500">
                                            <CheckCircle2 size={22} strokeWidth={2.5} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Logos/Trusted By ── */}
            <section className="bg-gray-50/50 py-10 border-y border-gray-100/50 flex flex-col items-center">
                <div className="max-w-7xl mx-auto text-center px-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">شراكات استراتيجية موثوقة</p>
                    <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                        {[
                            { name: 'شركة السبابة الرقمية', role: 'الشريك التقني' },
                            { name: 'مصحف تبيان', role: 'المحتوى العلمي' },
                            { name: 'جمعية لأجلهم', role: 'شريك استراتيجي' }
                        ].map((p, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ scale: 1.1, opacity: 1 }}
                                className="flex flex-col items-center gap-2 cursor-default group"
                            >
                                <span className="text-lg font-black text-gray-400 group-hover:text-[#5AA564] transition-colors">{p.name}</span>
                                <span className="text-[9px] font-bold text-gray-300 group-hover:text-[#5AA564]/60 uppercase tracking-widest">{p.role}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── App Interface Showcase (Visual Mockups) ── */}
            <section id="interface" className="relative py-32 bg-white overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5AA564]/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#5AA564]/10 border border-[#5AA564]/20 rounded-full mb-6"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#5AA564] shadow-[0_0_8px_#5AA564]" />
                            <span className="text-[10px] font-black text-[#5AA564] uppercase tracking-[0.2em]">واجهة التطبيق الذكية</span>
                        </motion.div>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-tight">تجربة رقمية فريدة <br /> <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#5AA564] to-[#4A8F53]">بين يديك دائماً</span></h2>
                        <p className="text-gray-400 font-bold max-w-2xl mx-auto text-xl leading-relaxed">
                            بنينا التطبيق ليعمل بسلاسة فائقة، مع واجهات تجمع بين الجمال البصري والسهولة المطلقة لمجتمع الصم.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[350px]">
                        {/* Bento Box 1: Quran Main Translation (The Hero) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8 }}
                            viewport={{ once: true }}
                            className="md:col-span-12 lg:col-span-7 md:row-span-2 relative group overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-[4rem] border border-gray-100 p-12 flex flex-col items-start text-right transition-all duration-700 hover:shadow-[0_50px_100px_rgba(0,0,0,0.08)]"
                        >
                            <div className="relative z-10 max-w-sm">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#5AA564] mb-8 border border-gray-50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                    <BookOpen size={28} strokeWidth={2.2} />
                                </div>
                                <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">القرآن بلغة الإشارة</h3>
                                <p className="text-gray-400 font-bold text-lg leading-relaxed mb-8">أول مصحف تفاعلي يدمج النص القرآني مع ترجمة فورية لـ 114 سورة عبر مترجم 3D عالي الدقة، لضمان الفهم الصحيح لكل آية.</p>
                                <div className="flex gap-4">
                                    <div className="px-4 py-2 bg-emerald-50 text-[#5AA564] text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100">3D Technology</div>
                                    <div className="px-4 py-2 bg-blue-50 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-blue-100">114 Surahs</div>
                                </div>
                            </div>
                            
                            {/* Floating Mockup Image */}
                            <motion.div 
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-[-100px] left-[-40px] w-full max-w-[420px] drop-shadow-[0_50px_100px_rgba(0,0,0,0.2)] md:block hidden"
                            >
                                <img src="/mockups/quran_main.png" alt="Quran Interface Mockup" className="w-full h-auto rounded-[3rem] group-hover:scale-105 transition-transform duration-1000" />
                            </motion.div>
                        </motion.div>

                        {/* Bento Box 2: Prayer Times & Qibla */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            whileHover={{ y: -8 }}
                            viewport={{ once: true }}
                            className="md:col-span-6 lg:col-span-5 md:row-span-2 relative group overflow-hidden bg-[#0A0D1A] rounded-[4rem] p-12 flex flex-col items-center text-center shadow-2xl shadow-gray-900/40"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#5AA564]/40 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
                            
                            <div className="relative z-10 w-full mb-10">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center justify-center text-white mb-8 mx-auto group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-xl">
                                    <Compass size={32} strokeWidth={2.2} />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">القبلة ومواقيت الصلاة</h3>
                                <p className="text-white/40 font-bold text-lg leading-relaxed">بوصلة ذهبية دقيقة وخدمة تحديد المواقيت حسب موقعك الجغرافي لضمان صلاتك في وقتها.</p>
                            </div>

                            <motion.div 
                                whileHover={{ scale: 1.1, rotate: 2 }}
                                className="relative w-full max-w-[280px] drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                            >
                                <img src="/mockups/prayer.png" alt="Prayer Times Mockup" className="w-full h-auto rounded-[2.5rem]" />
                            </motion.div>
                        </motion.div>

                        {/* Bento Box 3: Adhkar (Wide Panel) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8 }}
                            viewport={{ once: true }}
                            className="md:col-span-6 lg:col-span-12 md:row-span-2 relative group overflow-hidden bg-gradient-to-br from-[#5AA564] to-[#4A8F53] rounded-[4rem] p-16 flex flex-col lg:flex-row items-center gap-16 shadow-2xl shadow-[#5AA564]/20"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full pointer-events-none" />
                            
                            <div className="relative z-10 flex-1 text-right">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center text-white mb-8">
                                    <Globe size={32} strokeWidth={2.2} />
                                </div>
                                <h3 className="text-4xl font-black text-white mb-6 tracking-tight">ترجمة كاملة للأذكار</h3>
                                <p className="text-white/80 font-bold text-xl leading-relaxed mb-8 max-w-md">أذكار الصباح والمساء والتحصينات اليومية، مسجلة بلغة الإشارة بمقاطع فيديو ذات جودة فائقة لترافقك في يومك.</p>
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
                                    <span>اكتشف المزيد من الخصائص</span>
                                    <ArrowLeft size={16} />
                                </div>
                            </div>

                            <motion.div 
                                initial={{ x: 100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative w-full max-w-[320px] lg:max-w-[400px] drop-shadow-[0_40px_80px_rgba(0,0,0,0.3)]"
                            >
                                <img src="/mockups/adhkar.png" alt="Adhkar Interface Mockup" className="w-full h-auto rounded-[3rem]" />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>



            {/* ── How It Works (Process) ── */}
            <section id="process" className="py-16 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-sm font-extrabold text-[#5AA564] bg-[#5AA564]/10 px-4 py-1.5 rounded-full inline-block mb-4">الخطوات</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-8">عملية التعلم بسيطة جداً</h2>

                        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[3.5rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent mt-12">
                            <StepIndicator number="1" title="حمل التطبيق" desc="ابحث عن 'مصحف أنامل للصم' في متجر آبل أو جوجل بلاي وقم بتثبيته مجاناً." />
                            <StepIndicator number="2" title="اختر الترجمة" desc="تصفح قائمة التراجم المنسقة بشكل رائع واختر الجزء الذي ترغب بقراءته أو حفظه." />
                            <StepIndicator number="3" title="شاهد الآيات" desc="شاهد ترجمة كل آية بلغة الإشارة بشكل مرئي وعالي الدقة لتفهم المعنى الصحيح." />
                        </div>
                    </div>

                    <div className="relative flex justify-center lg:justify-end mt-10 lg:mt-0">
                        <div className="w-[300px] bg-white rounded-[2.5rem] p-2 shadow-2xl relative border-8 border-gray-900 overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-6 flex justify-center">
                                <div className="w-1/3 h-5 bg-gray-900 rounded-b-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── About The Initiative (Vision & Mission) ── */}
            <section className="py-16 max-w-7xl mx-auto px-6 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5AA564]/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="bg-gray-900 text-white rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#5AA564] blur-[150px] opacity-30 rounded-full" />

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-sm font-extrabold text-[#5AA564] tracking-widest uppercase mb-4 block">عن المبادرة</span>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">رؤيتنا لا تعرف حدوداً والصم في قلب الاهتمام</h2>
                            <p className="text-gray-400 font-medium leading-relaxed mb-8 text-lg">
                                بجهود دؤوبة، وتحت مظلة <strong className="text-white">"شركة السبابة الرقمية"</strong>، نسعى لبناء مجتمع رقمي شامل يعزز من قدرة الصم وضعاف السمع على الوصول إلى القرآن الكريم وفهمه بيسر وسهولة، معتمدين على أحدث تقنيات العرض المرئي وفريق متخصص لضمان دقة لغة الإشارة المعتمدة.
                            </p>
                            <div className="flex items-center gap-4 border-t border-gray-800 pt-8 mt-8">
                                <div className="w-14 h-14 bg-[#5AA564]/20 rounded-2xl flex items-center justify-center text-[#5AA564]">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">محتوى موثوق ومراجع</h4>
                                    <p className="text-gray-400 text-sm">من قبل نخبة من علماء الشريعة وخبراء الإشارة.</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
                            {/* Decorative blocks to replace images, maintaining the SaaS aesthetic */}
                            <motion.div 
                                whileHover={{ y: -10 }}
                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center shadow-2xl border border-white/5 hover:border-[#5AA564]/30 transition-all duration-500"
                            >
                                <div className="w-20 h-20 bg-[#5AA564]/10 rounded-3xl flex items-center justify-center text-[#5AA564] mb-6 shadow-inner">
                                    <Users size={48} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">مجتمع مترابط</h3>
                                <p className="text-gray-400 font-medium text-sm leading-relaxed">شراكات ممتدة لخدمة المستفيدين في كل مكان.</p>
                            </motion.div>
                            <motion.div 
                                whileHover={{ y: -10 }}
                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center shadow-2xl border border-white/5 hover:border-[#5AA564]/30 transition-all duration-500 transform sm:translate-y-12"
                            >
                                <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-3xl flex items-center justify-center text-[#D4AF37] mb-6 shadow-inner">
                                    <Globe size={48} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">معايير عالمية</h3>
                                <p className="text-gray-400 font-medium text-sm leading-relaxed">أداء يفوق التطلعات وشمولية رقمية بمعايير دولية.</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="py-16 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <MessageSquareQuote className="mx-auto text-[#5AA564] mb-4 opacity-50" size={48} />
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">رأي المستفيدين</h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg">صُمم هذا العمل ليلمس قلوب فئة غالية علينا وتجاربهم تسرد النجاح.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[
                        { name: "محمد عبدالله", role: "مستخدم منتظم", char: "م", quote: "التطبيق سهل عليّ فهم القرآن بطريقة لم أكن أتصورها من قبل. الترجمة دقيقة جداً والصورة واضحة." },
                        { name: "سالم عبدالرحمن", role: "معلم لغة إشارة", char: "س", quote: "أفضل تطبيق رأيته يخدم الصم في العالم العربي، الألوان مريحة للعين وتقسيم السور رائع جداً." },
                        { name: "فاطمة علي", role: "مشرفة تعليمية", char: "ف", quote: "إمكانية تحميل الفيديوهات واستخدامها بدون إنترنت كانت ميزة غير متوقعة وأنقذتني في كثير من الأوقات.", active: true }
                    ].map((t, i) => (
                        <motion.div 
                            key={i}
                            whileHover={{ y: -10 }}
                            className="bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-500 relative group"
                        >
                            <div className="flex gap-1 text-[#5AA564] mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
                                {[1, 2, 3, 4, 5].map(j => <Star key={j} size={14} fill="currentColor" />)}
                            </div>
                            <p className="text-gray-600 font-medium leading-relaxed mb-8 text-lg">"{t.quote}"</p>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${t.active ? 'bg-[#5AA564]/10 text-[#5AA564]' : 'bg-gray-100 text-gray-400'} rounded-full flex items-center justify-center font-black text-lg`}>
                                    {t.char}
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 text-base">{t.name}</h4>
                                    <p className="text-xs text-gray-400 font-bold">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Pricing & Plans (Entity Focus) ── */}
            <section id="pricing" className="py-16 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#5AA564]/10 border border-[#5AA564]/20 rounded-full mb-6"
                        >
                            <Shield size={14} className="text-[#5AA564]" />
                            <span className="text-[10px] font-black text-[#5AA564] uppercase tracking-[0.2em]">الخطط والاشتراكات</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">اختر الباقة المناسبة لك</h2>
                        <p className="text-gray-400 font-bold max-w-2xl mx-auto text-lg">
                            دعم مستمر وتطوير دائم لخدمة فئة غالية علينا. اختر باقتك وابدأ الرحلة اليوم.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                        {/* Individual Plan */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white border border-gray-100 rounded-[3.5rem] p-12 shadow-[0_30px_60px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_50px_100px_rgba(0,0,0,0.08)] transition-all duration-700"
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gray-50 rounded-bl-[6rem] -z-10 group-hover:bg-[#5AA564]/5 transition-colors duration-700" />
                            <div className="mb-10">
                                <h3 className="text-3xl font-black text-gray-900 mb-2">باقة الأفراد</h3>
                                <p className="text-gray-400 font-bold text-base">للاستخدام الشخصي على جهاز واحد</p>
                            </div>

                            <div className="flex items-baseline gap-3 mb-12 group-hover:scale-105 origin-right transition-transform">
                                <span className="text-7xl font-black text-gray-900 tracking-tighter">120</span>
                                <span className="text-xl font-bold text-gray-400">ر.س / سنوياً</span>
                            </div>

                            <ul className="space-y-5 mb-14">
                                {['وصول كامل لـ 114 سورة', 'ترجمة إشارة احترافية', 'أذكار ومواقيت صلاة', 'دعم فني مباشر'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-base font-bold text-gray-600 group-hover:translate-x-[-4px] transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                                        <div className="w-7 h-7 rounded-full bg-[#5AA564]/10 flex items-center justify-center text-[#5AA564]">
                                            <Check size={16} strokeWidth={3} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="bg-gray-50 rounded-[2.5rem] p-8 text-center border border-dashed border-gray-200 group-hover:border-[#5AA564]/30 transition-colors">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-relaxed">الاشتراك يتم من داخل التطبيق مباشرة عبر Apple Pay أو بطاقة مدى</p>
                            </div>
                        </motion.div>

                        {/* Organization Plan */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-[#0A0D1A] to-[#141830] border-[8px] border-[#5AA564]/20 rounded-[3.5rem] p-12 shadow-[0_60px_120px_rgba(0,0,0,0.4)] relative overflow-hidden group transform md:-translate-y-8 hover:-translate-y-12 transition-all duration-700"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#5AA564]/20 to-transparent rounded-bl-[10rem] -z-10 group-hover:scale-110 transition-transform duration-700" />
                            <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#5AA564] text-white text-[11px] font-black uppercase tracking-widest rounded-full mb-10 shadow-lg shadow-[#5AA564]/20 animate-pulse">
                                <Star size={14} className="fill-white" />
                                الأكثر توفيراً للجهات والجمعيات
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2">باقة الجهات والمنظمات</h3>
                            <p className="text-white/40 font-bold text-base mb-12">حلول متكاملة للجمعيات والمؤسسات التعليمية</p>

                            <div className="flex items-baseline gap-3 mb-6 group-hover:scale-105 origin-right transition-transform">
                                <span className="text-2xl font-bold text-white/20 line-through">120</span>
                                <span className="text-7xl font-black text-[#5AA564] tracking-tighter drop-shadow-[0_0_30px_rgba(90,165,100,0.3)]">102</span>
                                <span className="text-xl font-bold text-white/30">ر.س / للمستخدم</span>
                            </div>
                            <div className="text-[11px] font-black text-[#5AA564] mb-12 uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#5AA564] shadow-[0_0_8px_#5AA564]" />
                                خصم خاص عند شراء 50 رخصة أو أكثر
                            </div>

                            <ul className="space-y-6 mb-16">
                                {['لوحة تحكم إدارية خاصة', 'توليد أكواد تفعيل فورية', 'إدارة المستخدمين والأجهزة', 'تقارير أداء ومتابعة'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-base font-bold text-white/80 group-hover:translate-x-[-4px] transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                                        <div className="w-7 h-7 rounded-full bg-[#5AA564] flex items-center justify-center text-white shadow-lg shadow-[#5AA564]/40">
                                            <Check size={16} strokeWidth={3} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/pay?type=org" className="group relative overflow-hidden flex items-center justify-center gap-4 w-full h-22 bg-[#5AA564] hover:bg-[#4A8F53] text-white font-black uppercase tracking-widest text-xs rounded-[2rem] transition-all shadow-2xl shadow-[#5AA564]/30 active:scale-95">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                                <span className="relative z-10 text-sm">شراء للجهات والمنظمات</span>
                                <ArrowLeft size={20} className="relative z-10 group-hover:-translate-x-2 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Bulk pricing note */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-400 font-bold text-sm">
                            تحتاج لأكثر من 1000 رخصة؟ <a href="mailto:sales@alsababah.com" className="text-[#5AA564] hover:underline">تواصل مع قسم المبيعات</a> للحصول على عرض سعر مخصص بخصم 15%.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="py-20 bg-white relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#5AA564]/5 blur-[120px] rounded-full -translate-x-1/2" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <div className="inline-block px-4 py-1 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">المميزات الأساسية</div>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8">تصميم يُركز على المضمون</h2>
                        <p className="text-gray-500 font-bold max-w-2xl mx-auto text-xl leading-relaxed">
                            ابتعدنا عن التعقيد، لنقدم تجربة سهلة وسريعة تمكنك من التركيز على حفظ وتلاوة كتاب الله بأحدث التقنيات.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: <HandMetal size={32} />, title: "لغة الإشارة المعتمدة", desc: "فيديوهات دقيقة تم مراجعتها لضمان ترجمة معاني الآيات بدقة متناهية وبأسلوب واضح." },
                            { icon: <Video size={32} />, title: "مكتبة فيديو HD", desc: "أكثر من 6000 فيديو عالي الدقة (HD) تم تصويرها باحترافية لتجربة بصرية مريحة للعينين." },
                            { icon: <Globe size={32} />, title: "بدون إنترنت", desc: "حمل المقاطع التي تود مشاهدتها واستخدم المنصة بالكامل أوفلاين كأنك متصل تماماً." }
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-10 bg-white border border-gray-100 rounded-[2.5rem] hover:border-[#5AA564]/30 hover:shadow-[0_40px_80px_rgba(90,165,100,0.06)] transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gray-50 text-[#5AA564] flex items-center justify-center mb-8 border border-gray-100 group-hover:bg-[#5AA564] group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-sm">
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4">{f.title}</h3>
                                <p className="text-gray-400 font-bold text-base leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ── Stats ── */}
            <section className="bg-white py-16 border-y border-gray-100/50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
                    <StatBadge value="+10K" label="مستفيد نشط" icon={<Users size={24} />} />
                    <StatBadge value="114" label="سورة تفاعلية" icon={<BookOpen size={24} />} />
                    <StatBadge value="100%" label="دقة الترجمة" icon={<Shield size={24} />} />
                    <StatBadge value="4.9" label="تقييم المتجر" icon={<Star size={24} />} />
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="py-16 max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <Lightbulb className="mx-auto text-[#5AA564] mb-4 opacity-50" size={40} />
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">الأسئلة الشائعة</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { icon: <Users size={22} />, q: "هل التطبيق موجه فقط للصم وضعاف السمع؟", a: "نعم، تم تصميمه خصيصاً ليناسب احتياجات لغة الإشارة الخاصة بالصم وضعاف السمع، ولكن يمكن لأي شخص راغب في تعلم لغة الإشارة للقرآن استخدامه." },
                        { icon: <Globe size={22} />, q: "هل أحتاج إلى الاتصال بالإنترنت دائماً؟", a: "في البداية نعم لتحميل الفيديوهات والسور، ولكن بإمكانك حفظها في جهازك ومشاهدتها في أي وقت وأي مكان دون إنترنت." }
                    ].map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all flex gap-6 items-start group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#5AA564] shrink-0 group-hover:bg-[#5AA564] group-hover:text-white transition-all duration-500">
                                {f.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 mb-3">{f.q}</h3>
                                <p className="text-gray-500 font-bold text-sm leading-relaxed">{f.a}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <p className="text-gray-400 font-bold text-sm">لم تجد إجابة لسؤالك؟ <a href="mailto:support@alsababah.com" className="text-[#5AA564] hover:underline">تحدث معنا مباشرة</a></p>
                </div>
            </section>

            {/* ── Clean CTA ── */}
            <section id="download" className="py-16 relative overflow-hidden bg-gray-50">
                <div className="absolute left-1/2 -top-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#5AA564]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="w-24 h-24 bg-white shadow-xl shadow-gray-200/50 rounded-3xl flex items-center justify-center mx-auto mb-10 overflow-hidden">
                        <img src="/logo/logo.png" alt="شعار التطبيق" className="w-14 h-14 object-contain hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">جاهز لاحتضان التغيير؟</h2>
                    <p className="text-xl text-gray-500 font-medium mb-12 max-w-2xl mx-auto">
                        قم بتحميل تطبيق مصحف أنامل للصم الآن، متوفر على المتاجر الرسمية لأجهزة آيفون وأندرويد وانضم لمجتمعنا الكبير.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <a href="#" className="w-full sm:w-auto h-16 px-12 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-lg">
                            App Store
                        </a>
                        <a href="#" className="w-full sm:w-auto h-16 px-12 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-lg">
                            Google Play
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-white py-8 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <img src="/logo/logo.png" alt="شعار شركة السبابة الرقمية" className="w-10 h-10 object-contain" />
                        <div className="flex flex-col">
                            <span className="text-lg font-extrabold text-gray-900">مصحف أنامل للصم</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">إحدى مبادرات شركة السبابة الرقمية</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 text-center">
                        © 2026 مصحف أنامل للصم — التابع لشركة السبابة الرقمية. جميع الحقوق محفوظة لخدمة الصم وضعاف السمع.
                    </p>
                    <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 group bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full">
                        بوابة إدارة المنصة <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>
            </footer>
            {/* ── Floating Support Button ── */}
            <a href="#" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#5AA564] hover:bg-[#4A8F53] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:-translate-y-1 transition-all group">
                <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">تواصل معنا</span>
                <Users size={24} />
            </a>
        </div>
    );
}

// Dummy Component definition just in case
const Settings2 = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
    </svg>
);
