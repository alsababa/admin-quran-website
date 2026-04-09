"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
    Smartphone, Star, Users, Play, Globe, Shield, 
    CheckCircle2, BookOpen, Compass, Check, ArrowLeft, 
    Lightbulb, MessageSquareQuote, Loader2, Zap, 
    Layers, MousePointer2, SmartphoneIcon, Download
} from 'lucide-react';

// ── Components ──

const StatBadge = ({ value, label, icon, delay = 0 }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
        whileHover={{ y: -12, scale: 1.02 }}
        className="relative group p-8 bg-white/40 backdrop-blur-xl border border-white/50 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(90,165,100,0.12)] transition-all duration-700 overflow-hidden flex flex-col items-center text-center"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5AA564]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#5AA564] mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            {icon}
        </div>
        <p className="text-5xl md:text-6xl font-black text-gray-900 mb-2 tracking-tighter">{value}</p>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">{label}</p>
    </motion.div>
);

const FeatureCard = ({ icon, title, desc, delay = 0, color = "#5AA564" }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
        whileHover={{ y: -10 }}
        className="relative overflow-hidden bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 group"
    >
        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700" style={{ backgroundColor: color }} />
        <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500" style={{ backgroundColor: color }}>
            {icon}
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{title}</h3>
        <p className="text-gray-500 font-medium leading-relaxed text-base">{desc}</p>
    </motion.div>
);

const StepIndicator = ({ number, title, desc, delay = 0 }) => (
    <motion.div 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
        className="flex flex-col md:flex-row items-center md:items-start gap-8 group"
    >
        <div className="flex-shrink-0 w-20 h-20 bg-white border border-gray-100 shadow-xl rounded-[2rem] flex items-center justify-center text-2xl font-black text-[#5AA564] transition-all group-hover:bg-[#5AA564] group-hover:text-white group-hover:scale-110 group-hover:rotate-6">
            {number}
        </div>
        <div className="text-center md:text-right">
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{title}</h3>
            <p className="text-gray-500 font-bold leading-relaxed max-w-sm text-lg">{desc}</p>
        </div>
    </motion.div>
);

// ── Main Page ──

export default function LandingPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [runtimeError, setRuntimeError] = useState(null);
    const [show3D, setShow3D] = useState(false);
    const [is3DLoading, setIs3DLoading] = useState(true);
    const section3DRef = useRef(null);
    
    const { scrollYProgress } = useScroll();
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShow3D(true);
                    observer.disconnect(); 
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
                <h1 style={{ color: 'red', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Critical Error</h1>
                <p>{runtimeError.message}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    if (!isMounted) {
        return (
            <div className="h-screen w-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
                <motion.div
                    animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-8"
                >
                    <img src="/logo/logo.png" alt="Logo" className="w-24 h-24 object-contain grayscale" />
                </motion.div>
                <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 2 }}
                        className="w-full h-full bg-[#5AA564]" 
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-[#5AA564]/20 overflow-x-hidden" dir="rtl">
            
            {/* ── Dynamic Background ── */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <motion.div 
                    style={{ y: backgroundY }}
                    className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#5AA564]/5 rounded-full blur-[120px]" 
                />
                <motion.div 
                    style={{ y: backgroundY }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" 
                />
            </div>

            {/* ── Navbar ── */}
            <nav className="fixed inset-x-0 top-0 z-[100] px-6 py-4">
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-7xl mx-auto h-20 px-8 bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                                <img src="/logo/logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col -space-y-1">
                                <span className="text-xl font-black text-gray-900 tracking-tight">مصحف أنامل</span>
                                <span className="text-[9px] font-black text-[#5AA564] uppercase tracking-[0.25em]">لخدمة الصم</span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center gap-10">
                        {['المميزات', 'كيف يعمل؟', 'رؤيتنا', 'الاشتراكات'].map((item, i) => (
                            <a key={i} href="#" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#5AA564] transition-colors relative group">
                                {item}
                                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#5AA564] group-hover:w-full transition-all" />
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-xs font-black text-gray-400 hover:text-gray-900 transition-colors hidden sm:block">
                            دخول الإدارة
                        </Link>
                        <a href="#download" className="px-8 h-12 bg-gray-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 flex items-center justify-center">
                            ابدأ الآن
                        </a>
                    </div>
                </motion.div>
            </nav>

            {/* ── Hero Section ── */}
            <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center text-center lg:text-right">
                        
                        <div className="lg:col-span-12 xl:col-span-7">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-3 px-6 py-2 bg-[#5AA564]/5 border border-[#5AA564]/10 rounded-full mb-8"
                            >
                                <Zap size={14} className="text-[#5AA564] fill-[#5AA564]" />
                                <span className="text-[10px] font-black text-[#5AA564] uppercase tracking-[0.3em]">المنصة الأولى عالمياً لخدمة الصم</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-8xl xl:text-[7.5rem] font-black tracking-tighter text-gray-900 leading-[1] mb-10"
                            >
                                تلاوة وفهم القرآن <br />
                                <span className="relative inline-block mt-4">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#5AA564] via-[#4A8F53] to-[#5AA564] bg-[length:200%_auto] animate-shimmer">بأنامل الصم</span>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1.5, delay: 0.8 }}
                                        className="absolute -bottom-4 right-0 h-4 bg-[#5AA564]/10 blur-xl -z-10 rounded-full" 
                                    />
                                </span> <br className="hidden xl:block" /> بيسر.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl md:text-2xl text-gray-500 font-bold mb-14 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                            >
                                واجهتك الرقمية لتدبر كتاب الله؛ مكتبة تفاعلية ضخمة تجمع بين <span className="text-gray-900">لغة الإشارة المعتمدة</span> وأحدث تقنيات العرض المرئي 3D بجودة استثنائية.
                            </motion.p>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
                            >
                                <a href="#download" className="group w-full sm:w-auto h-20 px-12 bg-gray-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest rounded-[2rem] flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.15)] active:scale-95">
                                    <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                                    تحميل التطبيق مجاناً
                                </a>
                                <a href="#demo" className="group w-full sm:w-auto h-20 px-12 bg-white border border-gray-100 font-black text-xs uppercase tracking-widest rounded-[2rem] flex items-center justify-center gap-4 transition-all hover:border-[#5AA564]/30 shadow-sm active:scale-95">
                                    <div className="w-10 h-10 bg-[#5AA564]/5 group-hover:bg-[#5AA564]/10 rounded-xl flex items-center justify-center transition-colors">
                                        <Play size={18} className="text-[#5AA564] fill-[#5AA564]" />
                                    </div>
                                    كيف يعمل؟
                                </a>
                            </motion.div>
                        </div>

                        {/* ── Interactive Image/Device Placeholder ── */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="hidden xl:block lg:col-span-12 xl:col-span-5 relative"
                        >
                            <div className="relative z-10">
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative bg-white/10 backdrop-blur-3xl p-4 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden"
                                >
                                    <img src="/mockups/quran_main.png" alt="App Preview" className="w-[450px] h-auto rounded-[3.5rem] brightness-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                </motion.div>
                                
                                {/* Floating Badges */}
                                <motion.div 
                                    animate={{ x: [0, 10, 0], y: [0, 10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute -top-10 -right-10 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-50 flex flex-col items-center"
                                >
                                    <div className="flex gap-1 text-[#D4AF37] mb-2">
                                        {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-900">4.9 تقييم المتجر</span>
                                </motion.div>

                                <motion.div 
                                    animate={{ x: [0, -10, 0], y: [0, -10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-50 flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 bg-[#5AA564]/10 rounded-xl flex items-center justify-center text-[#5AA564]">
                                        <Users size={20} />
                                    </div>
                                    <span className="text-xs font-black text-gray-900">+10,000 مستفيد</span>
                                </motion.div>
                            </div>
                            
                            {/* Background Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5AA564]/20 blur-[150px] -z-10 rounded-full" />
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* ── Partner Logos ── */}
            <section className="py-20 bg-white border-y border-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] text-center mb-16">شركاء النجاح والمبادرة</p>
                    <div className="flex flex-wrap justify-center gap-16 md:gap-24 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                        {['شركة السبابة الرقمية', 'مصحف تبيان', 'جمعية لأجلهم', 'مركز خدمة الصم'].map((partner, i) => (
                            <span key={i} className="text-xl md:text-2xl font-black text-gray-400 cursor-default hover:text-[#5AA564] transition-colors whitespace-nowrap">{partner}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Infinite Scrolling Mockups Belt ── */}
            <section className="py-20 bg-white overflow-hidden border-b border-gray-50">
                <div className="relative flex overflow-hidden group">
                    <motion.div 
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="flex gap-12 whitespace-nowrap min-w-full"
                    >
                        {[
                            "/mockups/adhkar.png",
                            "/mockups/prayer.png",
                            "/mockups/app_steps.png",
                            "/mockups/quran_main.png"
                        ].map((src, i) => (
                            <div key={i} className="w-[300px] h-[550px] flex-shrink-0 bg-white rounded-[3rem] p-3 shadow-2xl border border-gray-100 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                <img src={src} alt={`Mockup ${i}`} className="w-full h-full object-cover rounded-[2.5rem]" />
                            </div>
                        ))}
                        {/* Repeat for seamless loop */}
                        {[
                            "/mockups/adhkar.png",
                            "/mockups/prayer.png",
                            "/mockups/app_steps.png",
                            "/mockups/quran_main.png"
                        ].map((src, i) => (
                            <div key={i + 10} className="w-[300px] h-[550px] flex-shrink-0 bg-white rounded-[3rem] p-3 shadow-2xl border border-gray-100 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                <img src={src} alt={`Mockup Dupe ${i}`} className="w-full h-full object-cover rounded-[2.5rem]" />
                            </div>
                        ))}
                    </motion.div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-12 text-center">
                    <p className="text-gray-400 font-bold text-lg">استكشف واجهات التطبيق المتعددة المصممة لراحتك</p>
                </div>
            </section>

            {/* ── 3D Viewer Section (The Moving Centerpiece) ── */}
            <section id="3d-viewer" className="relative py-32 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <motion.div
                            ref={section3DRef}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative aspect-[4/5] md:aspect-square bg-white rounded-[4rem] overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.08)] border border-white"
                        >
                            <AnimatePresence>
                                {!show3D || is3DLoading ? (
                                    <motion.div
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-50"
                                    >
                                        <Loader2 size={40} className="text-[#5AA564] animate-spin mb-4" />
                                        <span className="text-[10px] font-black text-[#5AA564] uppercase tracking-[0.2em]">جاري معالجة العرض ثلاثي الأبعاد...</span>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>

                            {show3D && (
                                <iframe
                                    src="/3viewer/index.html"
                                    className="w-full h-full border-none"
                                    onLoad={() => setIs3DLoading(false)}
                                    scrolling="no"
                                />
                            )}
                            
                            {/* Decorative Frame Elements */}
                            <div className="absolute top-8 right-8 z-30">
                                <div className="px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#5AA564] animate-pulse" />
                                    <span className="text-[10px] font-black text-gray-900 uppercase">بث مباشر - محاكاة الحركة</span>
                                </div>
                            </div>
                        </motion.div>

                        <div className="text-center lg:text-right">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-sm font-black text-[#5AA564] bg-[#5AA564]/5 px-5 py-1.5 rounded-full inline-block mb-6 uppercase tracking-widest">التكنولوجيا الحديثة</span>
                                <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-[1.1]">
                                    القرآن الكريم <br /> بتقنية <span className="text-[#5AA564]">Motion Capture</span>
                                </h2>
                                <p className="text-gray-500 font-bold text-xl mb-12 leading-relaxed">
                                    تجاوزنا حدود التصوير التقليدي، لنستخدم تقنيات التقاط الحركة المتقدمة التي تضمن سلاسة فائقة ودقة متناهية في نقل معاني الآيات بلغة الإشارة، مما يمنح تجربة بصرية واقعية تماماً.
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#5AA564] mx-auto lg:mx-0">
                                            <Shield size={22} />
                                        </div>
                                        <h4 className="font-black text-gray-900 text-lg">دقة شرعية معتمدة</h4>
                                        <p className="text-gray-400 font-medium text-sm">مراجعة دقيقة لكل حركة لضمان المعنى الصحيح.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#5AA564] mx-auto lg:mx-0">
                                            <Zap size={22} />
                                        </div>
                                        <h4 className="font-black text-gray-900 text-lg">أداء سلس للغاية</h4>
                                        <p className="text-gray-400 font-medium text-sm">سرعة استجابة فائقة وعرض مرئي بدون تقطيع.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Interactive Interface Showcase ── */}
            <section id="interface" className="py-32 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6"
                        >
                            واجهة ذكية <span className="text-[#5AA564]">تفهم احتياجاتك</span>
                        </motion.h2>
                        <p className="text-gray-500 font-bold max-w-2xl mx-auto text-lg leading-relaxed">
                            تجربة مستخدم حائزة على جوائز، صممت بعناية لتكون الأسهل والأسرع في الوصول لكل جزء من أجزاء القرآن الكريم والأذكار.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Big Card */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="md:col-span-8 relative group bg-gray-900 rounded-[4rem] p-16 overflow-hidden min-h-[500px] flex flex-col justify-end"
                        >
                            <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
                                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#5AA564] blur-[100px] rounded-full" />
                            </div>
                            <div className="relative z-10 max-w-md">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] flex items-center justify-center text-white mb-8">
                                    <Layers size={28} />
                                </div>
                                <p className="text-white/50 font-bold text-xl leading-relaxed mb-10">مكتبة فيديو شاملة لكل ما يحتاجه المسلم في يومه، من أذكار الصباح والمساء إلى تعليم الصلاة.</p>
                                <img src="/mockups/adhkar.png" alt="Adhkar" className="absolute -left-20 -bottom-20 w-[480px] rotate-6 group-hover:rotate-0 transition-transform duration-700 md:block hidden drop-shadow-2xl" />
                            </div>
                        </motion.div>

                        {/* Small Card */}
                        <motion.div 
                             initial={{ opacity: 0, scale: 0.9 }}
                             whileInView={{ opacity: 1, scale: 1 }}
                             viewport={{ once: true }}
                             transition={{ delay: 0.1 }}
                             className="md:col-span-4 relative group bg-[#5AA564] rounded-[4rem] p-12 overflow-hidden flex flex-col items-center text-center justify-center gap-8 shadow-2xl shadow-[#5AA564]/30"
                        >
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2rem] flex items-center justify-center text-white mb-8 mx-auto">
                                    <Compass size={40} />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">اتجاه القبلة</h3>
                                <p className="text-white/80 font-bold text-lg leading-relaxed">بوصلة بصرية ذكية تعتمد على موقعك الجغرافي لتحديد اتجاه القبلة بدقة.</p>
                            </div>
                            <img src="/mockups/prayer.png" alt="Prayer" className="w-48 group-hover:scale-110 transition-transform duration-700" />
                        </motion.div>

                        {/* Full Width Card */}
                        <motion.div 
                             initial={{ opacity: 0, y: 30 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             viewport={{ once: true }}
                             className="md:col-span-12 relative bg-white border border-gray-100 rounded-[4rem] p-12 md:p-20 overflow-hidden flex flex-col lg:flex-row items-center gap-16 group hover:shadow-2xl transition-all duration-700"
                        >
                            <div className="flex-1 text-center lg:text-right">
                                <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">إدارة الحفظ والمتابعة</h3>
                                <p className="text-gray-500 font-bold text-xl leading-relaxed mb-10">تتبع تقدمك اليومي في تلاوة القرآن وحفظه من خلال واجهات تفاعلية ذكية تحتفظ بآخر ما وصلت إليه تلقائياً.</p>
                                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                    <span className="px-6 py-3 bg-gray-50 rounded-full text-xs font-black text-gray-400 uppercase tracking-widest border border-gray-100">سجل تلاوة ذكي</span>
                                    <span className="px-6 py-3 bg-gray-50 rounded-full text-xs font-black text-gray-400 uppercase tracking-widest border border-gray-100">تنبيهات مخصصة</span>
                                    <span className="px-6 py-3 bg-gray-100 rounded-full text-xs font-black text-gray-900 uppercase tracking-widest border border-gray-200">تحميل للفيديو</span>
                                </div>
                            </div>
                            <div className="relative w-full max-w-[500px]">
                                <img src="/mockups/app_steps.png" alt="Steps" className="w-full rounded-[3rem] shadow-2xl skew-y-3 group-hover:skew-y-0 transition-transform duration-700" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Process Section ── */}
            <section id="process" className="py-24 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-16">
                            <StepIndicator number="01" title="تحميل التطبيق" desc="متوفر الآن على متجر آبل وجوجل بلاي، قم بتثبيته وابدأ تجربتك المجانية على الفور." delay={0.1} />
                            <StepIndicator number="02" title="تصفح السور" desc="اختر الجزء أو السورة التي ترغب في قراءتها، واجهاتنا مرتبة ومنظمة لتسهيل البحث." delay={0.2} />
                            <StepIndicator number="03" title="مشاهدة الترجمة" desc="استمتع بالمعنى بكل جوارحك عبر ترجمة إشارة احترافية ترافق كل آية نطقاً وحركة." delay={0.3} />
                        </div>
                        <div className="relative flex justify-center lg:justify-end">
                                <motion.div 
                                initial={{ opacity: 0, rotate: -5 }}
                                whileInView={{ opacity: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                className="relative w-[380px] bg-white p-2 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] border border-gray-100"
                            >
                                <img src="/mockups/app_steps.png" alt="Process" className="w-full h-auto rounded-[3.5rem]" />
                                <div className="absolute -right-12 top-1/4 w-24 h-24 bg-[#5AA564] flex items-center justify-center rounded-[2rem] shadow-xl animate-bounce">
                                    <Download className="text-white" size={32} />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StatBadge value="+10K" label="مستفيد حول العالم" icon={<Users size={28} />} delay={0.1} />
                        <StatBadge value="114" label="سورة مسجلة" icon={<BookOpen size={28} />} delay={0.2} />
                        <StatBadge value="100%" label="دقة المعايير" icon={<Shield size={28} />} delay={0.3} />
                        <StatBadge value="4.9" label="تقييم رائع" icon={<Star size={28} />} delay={0.4} />
                    </div>
                </div>
            </section>

            {/* ── About/Vision (Strong Statement) ── */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-gray-900 text-white rounded-[4rem] p-12 md:p-24 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#5AA564]/10 blur-[150px] -z-10 rounded-full" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="text-right">
                            <span className="text-sm font-black text-[#5AA564] tracking-[0.4em] uppercase mb-6 block">عن المبادرة</span>
                            <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[1.1]">رؤيتنا لا تعرف حدوداً <br /> <span className="text-white/40">والصم في القلب.</span></h2>
                            <p className="text-gray-400 font-medium text-xl leading-relaxed mb-12">
                                تحت مظلة <strong className="text-white">شركة السبابة الرقمية</strong>، نسعى لتمكين الصم وضعاف السمع عالمياً من الوصول لكلام الله بيسر وسهولة، عبر حلول تكنولوجية رائدة تكسر حاجز الصمت وتبني جسوراً من النور.
                            </p>
                            <div className="flex gap-6">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-black text-white">2026</span>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">توسيع النطاق</span>
                                </div>
                                <div className="w-px h-12 bg-gray-800" />
                                <div className="flex flex-col">
                                    <span className="text-3xl font-black text-white">+5</span>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">لغات إشارة قادمة</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="aspect-square bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center hover:bg-white/10 transition-colors group">
                                <Globe className="text-[#5AA564] mb-6 group-hover:scale-110 transition-transform" size={48} />
                                <h4 className="font-black text-lg mb-2">شمولية عالمية</h4>
                                <p className="text-gray-500 text-sm">نصل للصم في كل مكان بلا استثناء.</p>
                            </div>
                            <div className="aspect-square bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center transform sm:translate-y-12 hover:bg-white/10 transition-colors group">
                                <Shield className="text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" size={48} />
                                <h4 className="font-black text-lg mb-2">ثقة مطلقة</h4>
                                <p className="text-gray-500 text-sm">محتوى مراجع يضمن لك الأمان واليقين.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── Pricing ── */}
            <section id="pricing" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">استثمر في <span className="text-[#5AA564]">نور القلب</span></h2>
                        <p className="text-gray-500 font-bold max-w-2xl mx-auto text-lg leading-relaxed">بأسعار مدعومة لتناسب الجميع، اختر الباقة التي تليق باحتياجاتك وابدأ رحلتك الآن.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="bg-white border-2 border-gray-100 rounded-[3.5rem] p-12 flex flex-col items-center text-center shadow-sm group hover:border-[#5AA564]/30 transition-all duration-500"
                        >
                            <span className="px-5 py-1.5 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">حساب فردي</span>
                            <h3 className="text-3xl font-black text-gray-900 mb-6">باقة الأفراد</h3>
                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-7xl font-black text-gray-900 tracking-tighter">120</span>
                                <span className="text-lg font-bold text-gray-400">ر.س / سنوياً</span>
                            </div>
                            <ul className="space-y-4 mb-12 text-gray-600 font-bold text-sm">
                                <li className="flex items-center gap-3 justify-center"><Check size={16} className="text-[#5AA564]" /> وصول لجميع السور والأذكار</li>
                                <li className="flex items-center gap-3 justify-center"><Check size={16} className="text-[#5AA564]" /> ترجمة 3D عالية الدقة</li>
                                <li className="flex items-center gap-3 justify-center"><Check size={16} className="text-[#5AA564]" /> دعم فني ومتابعة</li>
                            </ul>
                            <div className="w-full p-6 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">يتم الاشتراك آلياً من داخل التطبيق</span>
                            </div>
                        </motion.div>

                        <motion.div 
                             whileHover={{ y: -10 }}
                             className="bg-[#0A0D1A] border-4 border-[#5AA564]/30 rounded-[3.5rem] p-12 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5AA564]/10 rounded-bl-full -z-10" />
                            <span className="px-5 py-1.5 bg-[#5AA564] rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-8">باقة المؤسسات</span>
                            <h3 className="text-3xl font-black text-white mb-6">الجهات والمنظمات</h3>
                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-7xl font-black text-[#5AA564] tracking-tighter">102</span>
                                <span className="text-lg font-bold text-white/30">ر.س / للمستخدم</span>
                            </div>
                            <ul className="space-y-4 mb-12 text-white/60 font-bold text-sm">
                                <li className="flex items-center gap-3 justify-center"><Check size={16} className="text-[#5AA564]" /> لوحة تحكم إدارية متكاملة</li>
                                <li className="flex items-center gap-3 justify-center"><Check size={16} className="text-[#5AA564]" /> إدارة تراخيص المستخدمين</li>
                                <li className="flex items-center gap-3 justify-center"><Check size={16} className="text-[#5AA564]" /> خصم خاص للكميات الكبيرة</li>
                            </ul>
                            <Link href="/pay?type=org" className="w-full h-16 bg-[#5AA564] hover:bg-[#4A8F53] text-white font-black text-xs uppercase tracking-widest rounded-[2rem] flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl shadow-[#5AA564]/20 active:scale-95">
                                اطلب الآن للجهات
                                <ArrowLeft size={16} />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="py-24 max-w-4xl mx-auto px-6">
                <div className="text-center mb-20 text-right md:text-center">
                    <Lightbulb className="mx-auto text-[#5AA564] mb-6 opacity-40 shrink-0" size={48} />
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">الأسئلة الشائعة</h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {[
                        { q: "هل التطبيق موجه فقط للصم وضعاف السمع؟", a: "نعم، تم تصميمه خصيصاً ليناسب احتياجات لغة الإشارة الخاصة بالصم وضعاف السمع، ولكن يمكن لأي شخص راغب في تعلم لغة الإشارة للقرآن استخدامه." },
                        { q: "هل أحتاج إلى الاتصال بالإنترنت دائماً؟", a: "بإمكانك بلمسة واحدة تحميل السور والأذكار وحفظها في جهازك لمشاهدتها في أي وقت وأي مكان دون الحاجة للاتصال بالإنترنت." }
                    ].map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row gap-8 group hover:shadow-xl transition-all duration-500"
                        >
                            <div className="w-14 h-14 bg-[#5AA564]/5 group-hover:bg-[#5AA564] group-hover:text-white rounded-2xl flex items-center justify-center text-[#5AA564] shrink-0 transition-all duration-500">
                                <MessageSquareQuote size={24} />
                            </div>
                            <div className="text-right">
                                <h3 className="text-xl font-black text-gray-900 mb-4">{f.q}</h3>
                                <p className="text-gray-500 font-bold text-lg leading-relaxed">{f.a}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Clean CTA ── */}
            <section id="download" className="py-24 relative overflow-hidden bg-gray-50">
                <div className="absolute left-1/2 -top-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#5AA564]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="w-24 h-24 bg-white shadow-xl shadow-gray-200/50 rounded-3xl flex items-center justify-center mx-auto mb-10 overflow-hidden">
                        <img src="/logo/logo.png" alt="Logo" className="w-14 h-14 object-contain hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">جاهز لاحتضان التغيير؟</h2>
                    <p className="text-xl text-gray-500 font-medium mb-12 max-w-2xl mx-auto">
                        قم بتحميل تطبيق مصحف أنامل للصم الآن، متوفر على المتاجر الرسمية لأجهزة آيفون وأندرويد وانضم لمجتمعنا الكبير.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <a href="#" className="w-full sm:w-auto h-16 px-12 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-lg">
                            App Store
                        </a>
                        <a href="#" className="w-full sm:w-auto h-16 px-12 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-lg">
                            Google Play
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-white py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <img src="/logo/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-gray-900 tracking-tight">مصحف أنامل للصم</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">إحدى مبادرات شركة السبابة الرقمية</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 text-center max-w-md">
                        © 2026 مصحف أنامل للصم — التابع لشركة السبابة الرقمية. جميع الحقوق محفوظة لخدمة الصم وضعاف السمع في كل مكان.
                    </p>
                    <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-[#5AA564] transition-colors flex items-center gap-2 group bg-gray-50 hover:bg-[#5AA564]/5 px-5 py-2.5 rounded-full">
                        بوابة إدارة المنصة <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>
            </footer>

            {/* ── Floating Support Button ── */}
            <a href="#" className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#5AA564] hover:bg-[#4A8F53] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:-translate-y-1 transition-all group">
                <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">تواصل معنا</span>
                <Users size={28} />
            </a>


        </div>
    );
}

const shimmer = `
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.animate-shimmer {
  animation: shimmer 8s linear infinite;
}
`;
