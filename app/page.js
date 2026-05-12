"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Smartphone, Star, Users, Play, Globe, Shield,
    CheckCircle2, BookOpen, Compass, ArrowLeft,
    MessageSquareQuote, Loader2, Layers, Mail, MapPin, Instagram, Twitter, Youtube
} from 'lucide-react';

const Ornament = ({ className }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return (
        <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className={`pointer-events-none opacity-10 ${className}`}
        >
            <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L56.123 38.877L95 45L56.123 51.123L50 90L43.877 51.123L5 45L43.877 38.877L50 0Z" fill="currentColor" />
            </svg>
        </motion.div>
    );
};

const Reveal = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
        {children}
    </motion.div>
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
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
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
    const [show3D, setShow3D] = useState(false);
    const [is3DLoading, setIs3DLoading] = useState(true);
    const section3DRef = useRef(null);

    useEffect(() => {
        setIsMounted(true);
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
        if (section3DRef.current) observer.observe(section3DRef.current);
        return () => observer.disconnect();
    }, [isMounted]);

    if (!isMounted) {
        return (
            <div className="h-screen bg-[#5AA564] flex items-center justify-center">
                <div className="animate-spin text-white">
                    <Loader2 size={48} strokeWidth={2.5} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-[#5AA564]/30 overflow-x-hidden" dir="rtl">
            <Ornament className="fixed top-40 left-[-50px] text-[#5AA564] z-50" />
            <Ornament className="fixed bottom-40 right-[-50px] text-[#D4AF37] z-50" />

            {/* ── Navbar ── */}
            <nav className="fixed inset-x-0 top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <motion.div whileHover={{ scale: 1.05 }} className="relative group cursor-pointer">
                                <div className="absolute -inset-2 bg-gradient-to-tr from-[#5AA564]/30 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />
                                <div className="relative p-1.5 bg-white border border-gray-100 shadow-sm rounded-xl">
                                    <img src="/logo/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                                </div>
                            </motion.div>
                        </Link>
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
                        {/* Admin login hidden from view but remains in DOM for those who know its location */}
                        <Link href="/login" className="text-[2px] opacity-0 cursor-default select-none pointer-events-auto">
                            .
                        </Link>
                        <a href="#download" className="inline-flex items-center gap-2 px-6 h-11 bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 hover:-translate-y-0.5">
                            تحميل التطبيق
                        </a>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ── */}
            <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative pt-32 pb-16 px-6 overflow-hidden bg-white arabic-pattern">
                <div className="absolute top-0 inset-x-0 h-[800px] pointer-events-none">
                    <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-gradient-to-tr from-[#5AA564]/10 to-blue-400/5 blur-[120px] rounded-full opacity-30" />
                    <div className="absolute top-20 right-[-100px] w-[500px] h-[500px] bg-gradient-to-br from-[#4A8F53]/15 to-blue-500/5 blur-[100px] rounded-full opacity-20" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 pt-10">
                    <div className="flex-1 text-right order-2 lg:order-1 max-w-2xl">
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/40 backdrop-blur-2xl border border-white/20 shadow-sm rounded-full mb-12">
                            <Star size={14} className="text-[#5AA564] fill-[#5AA564]" />
                            <span className="text-[11px] font-black text-[#5AA564] uppercase tracking-[0.3em]">الأول من نوعه في العالم الإسلامي</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter text-gray-900 leading-[0.95] mb-10">
                            تلاوة وفهم القرآن <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#5AA564] to-[#4A8F53]">بأنامل الصم</span> بيسر.
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-500 font-bold mb-12 leading-relaxed">
                            منصة متكاملة مصممة خصيصاً للصم وضعاف السمع، تدمج التقنيات الحديثة مع قدسية الكتاب الكريم لتقديم تجربة إيمانية فريدة.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <a href="#download" className="group h-20 px-14 bg-gray-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs rounded-[2rem] flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl">
                                <Smartphone size={20} /> تحميل التطبيق مجاناً
                            </a>
                            <a href="#demo" className="h-20 px-14 bg-white text-gray-900 border border-gray-100 font-black uppercase tracking-widest text-xs rounded-[2rem] flex items-center justify-center gap-3 transition-all hover:border-[#5AA564]/30 shadow-sm group">
                                <div className="w-10 h-10 bg-gray-50 group-hover:bg-[#5AA564]/10 rounded-xl flex items-center justify-center transition-colors">
                                    <Play size={18} className="fill-gray-900 group-hover:fill-[#5AA564]" />
                                </div>
                                شاهد العرض المرئي
                            </a>
                        </div>
                    </div>
                    <div className="flex-1 relative order-1 lg:order-2">
                        <div className="relative z-20 w-full max-w-[480px] mx-auto p-4 bg-white/20 backdrop-blur-3xl border border-white/40 rounded-[4.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.12)]">
                            <img src="/mockups/quran_main.png" alt="App Main" className="w-full rounded-[4rem]" />
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* ── Stats ── */}
            <section className="bg-white py-12 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatBadge value="+10K" label="مستفيد نشط" icon={<Users size={24} />} />
                    <StatBadge value="114" label="سورة تفاعلية" icon={<BookOpen size={24} />} />
                    <StatBadge value="100%" label="دقة الترجمة" icon={<Shield size={24} />} />
                    <StatBadge value="4.9" label="تقييم المتجر" icon={<Star size={24} />} />
                </div>
            </section>

            {/* ── 3D Welcome Section ── */}
            <Reveal>
                <section ref={section3DRef} id="demo" className="relative py-24 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="relative group h-[600px] bg-gradient-to-br from-white via-gray-50 to-[#5AA564]/5 rounded-[4rem] overflow-hidden border border-gray-100 shadow-2xl">
                            <AnimatePresence>
                                {!show3D || is3DLoading ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-50/10 backdrop-blur-sm">
                                        <div className="w-16 h-16 rounded-full border-4 border-[#5AA564]/20 border-t-[#5AA564] animate-spin mb-4" />
                                        <p className="text-[10px] font-black text-[#5AA564] uppercase tracking-[0.2em]">جاري تشغيل المعالج الثلاثي الأبعاد...</p>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                            {show3D && <iframe src="/3viewer/index.html" className="w-full h-full border-none relative z-10" onLoad={() => setIs3DLoading(false)} />}
                        </div>
                        <div className="text-right">
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-10 leading-[1.1]">
                                نرحب بكم في المشروع <br /> <span className="text-[#5AA564]">الأول عالمياً</span> لترجمة <br /> القرآن بتقنية 3D
                            </h2>
                            <p className="text-gray-500 font-bold text-xl mb-12 leading-relaxed">
                                نستخدم أحدث تقنيات التقاط الحركة (Motion Capture) لتجسيد خشوع معاني القرآن الكريم بلغة الإشارة بشكل حيّ وتفاعلي.
                            </p>
                            <div className="flex gap-6 justify-end">
                                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center"><Layers size={32} className="text-gray-300" /></div>
                                <div className="w-20 h-20 bg-[#5AA564]/10 rounded-3xl flex items-center justify-center text-[#5AA564]"><Play size={32} /></div>
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* ── App Interface Showcase ── */}
            <section id="interface" className="relative py-24 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[400px]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-12 lg:col-span-7 md:row-span-2 relative group overflow-hidden bg-white rounded-[4rem] border border-gray-100 p-12 flex flex-col items-start text-right transition-all duration-700 hover:shadow-2xl"
                        >
                            <div className="relative z-10 max-w-sm">
                                <div className="w-16 h-16 bg-[#5AA564]/5 rounded-2xl flex items-center justify-center text-[#5AA564] mb-8 group-hover:rotate-6 transition-transform">
                                    <BookOpen size={28} />
                                </div>
                                <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">القرآن بلغة الإشارة</h3>
                                <p className="text-gray-400 font-bold text-lg leading-relaxed mb-8">ترجمة فورية لـ 114 سورة عبر مترجم 3D عالي الدقة يرافق النص القرآني مباشرة.</p>
                                <img src="/logo/app_assets_images_indexpart.png" alt="Quran Part" className="w-64 rounded-3xl shadow-xl mt-4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-10 group-hover:translate-y-0" />
                            </div>
                            <div className="absolute bottom-[-100px] left-[-40px] w-full max-w-[420px] md:block hidden rotate-[-5deg] group-hover:rotate-0 transition-transform duration-700">
                                <img src="/mockups/quran_main.png" alt="Quran Interface" className="w-full h-auto rounded-[3rem] shadow-2xl" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-12 lg:col-span-5 md:row-span-2 relative group overflow-hidden bg-white rounded-[4rem] p-12 flex flex-col shadow-sm border border-gray-100 hover:shadow-xl transition-all"
                        >
                            <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-[2rem] flex items-center justify-center text-[#D4AF37] mb-8 mx-auto group-hover:scale-110 transition-transform">
                                <Compass size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight text-center">القبلة والأوقات</h3>
                            <p className="text-gray-400 font-bold text-lg leading-relaxed text-center mb-10">تحديد دقيق لاتجاه الكعبة ومواقيت الصلاة حسب موقعك الجغرافي.</p>
                            <div className="relative w-full rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100">
                                <img src="/logo/app_assets_images_indexitemlocationmecca.png" alt="Qibla App" className="w-full" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-12 lg:col-span-12 md:row-span-2 relative group overflow-hidden bg-gradient-to-br from-[#5AA564] to-[#4A8F53] rounded-[4rem] p-16 flex flex-col lg:flex-row items-center gap-16 shadow-2xl"
                        >
                            <div className="relative z-10 flex-1 text-right">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8">
                                    <Globe size={32} />
                                </div>
                                <h3 className="text-4xl font-black text-white mb-6 tracking-tight">ترجمة كاملة للأذكار</h3>
                                <p className="text-white/80 font-bold text-xl leading-relaxed mb-8 max-w-md">أذكار الصباح والمساء والتحصينات اليومية، مترجمة بالكامل لضمان تجربة إيمانية شاملة للصم.</p>
                                <img src="/logo/app_assets_images_azkartranslate.png" alt="Adhkar App" className="w-80 rounded-3xl shadow-2xl border-4 border-white/20" />
                            </div>
                            <div className="relative w-full max-w-[400px]">
                                <img src="/mockups/adhkar.png" alt="Adhkar Mockup" className="w-full h-auto rounded-[3rem] shadow-2xl" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Carousel Section ── */}
            <section className="py-24 bg-[#0A0D1A] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <Ornament className="top-10 left-10 text-white" />
                    <Ornament className="bottom-10 right-10 text-white" />
                </div>
                <div className="max-w-7xl mx-auto px-6 text-center mb-16 relative z-10">
                    <h2 className="text-4xl font-black text-white mb-4">في ضيافة التطبيق</h2>
                    <p className="text-gray-500 font-bold">لمحات بصرية من داخل تجربة "مصحف أنامل"</p>
                </div>
                <div className="relative flex overflow-hidden py-10">
                    <div className="flex gap-12 whitespace-nowrap min-w-full px-12 animate-infinite-scroll">
                        {[
                            "adhkar.png", "quran_main.png", "prayer.png", "app_steps.png",
                            "adhkar.png", "quran_main.png", "prayer.png", "app_steps.png"
                        ].map((img, i) => (
                            <div key={i} className="w-[300px] h-[600px] flex-shrink-0 bg-white rounded-[3.5rem] p-3 shadow-2xl overflow-hidden relative group">
                                <img src={`/mockups/${img}`} alt={`App Screenshot ${i + 1}`} className="w-full h-full object-cover rounded-[3rem] group-hover:scale-110 transition-all duration-1000" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#5AA564] scale-0 group-hover:scale-100 transition-transform duration-500">
                                        <Smartphone size={32} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section id="process" className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="text-right">
                            <span className="text-[10px] font-black text-[#5AA564] bg-[#5AA564]/10 border border-[#5AA564]/20 px-4 py-1.5 rounded-full inline-block mb-6 uppercase tracking-[0.2em]">كيف نبدأ؟</span>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-12 leading-tight">رحلة التعلم <br /> <span className="text-[#5AA564]">بسيطة جداً</span></h2>

                            <div className="space-y-16 mt-12">
                                <StepIndicator number="1" title="حمل التطبيق" desc="ابحث عن 'مصحف أنامل للصم' في متجر آبل أو جوجل بلاي وقم بتثبيته مجاناً لتبدأ رحلتك." />
                                <StepIndicator number="2" title="اختر السورة" desc="تصفح قائمة الأجزاء والسور المنسقة بشكل احترافي، واختر المقطع الذي ترغب بمشاهدته." />
                                <StepIndicator number="3" title="شاهد واستمتع" desc="استمتع بترجمة مرئية عالية الدقة لآيات الله تضمن لك فهم المعاني بكل يسر وسهولة." />
                            </div>
                        </div>
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-[340px] p-2 bg-gray-900 rounded-[4rem] shadow-2xl">
                                <img src="/mockups/app_steps.png" alt="App Steps" className="w-full h-auto rounded-[3.5rem]" />
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#5AA564]/20 blur-2xl rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pricing & CTA ── */}
            <Reveal>
                <section id="pricing" className="py-24 bg-gray-900 mx-6 rounded-[5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5AA564]/10 blur-[150px] rounded-full" />
                    <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                        <h2 className="text-5xl font-black text-white mb-16">باقات تناسب رحلتك الإيمانية</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-16 rounded-[4rem] text-right group hover:bg-white/[0.08] transition-all">
                                <h3 className="text-2xl font-black text-white mb-6">باقة الأفراد</h3>
                                <div className="text-8xl font-black text-white mb-10 tracking-tighter group-hover:text-[#5AA564] transition-colors">120 <span className="text-xl font-bold text-white/40">ر.س</span></div>
                                <Link href="/pay?type=single" className="flex items-center justify-center w-full h-20 bg-white text-gray-900 font-black rounded-[1.5rem] text-sm group-hover:scale-105 transition-all">اشترك الآن</Link>
                            </div>
                            <div className="bg-[#5AA564] p-16 rounded-[4rem] text-right shadow-2xl shadow-[#5AA564]/20 hover:scale-[1.02] transition-all">
                                <h3 className="text-2xl font-black text-white mb-6">باقة الجمعيات</h3>
                                <div className="text-8xl font-black text-white mb-10 tracking-tighter">102 <span className="text-xl font-bold text-white/60">ر.س</span></div>
                                <Link href="/pay?type=org" className="flex items-center justify-center w-full h-20 bg-gray-900 text-white font-black rounded-[1.5rem] text-sm hover:bg-black transition-colors">شراء للمجموعات</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* ── Testimonials ── */}
            <Reveal>
                <section className="py-24 max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-black text-gray-900 mb-16">أصوات من القلب</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { n: "محمد عبدالله", q: "المصحف غيّر حياتي وفهمي للقرآن." },
                            { n: "فاطمة أحمد", q: "أفضل تطبيق لخدمة الصم على الإطلاق." },
                            { n: "يوسف خالد", q: "دقة لغة الإشارة والرسومات مذهلة." }
                        ].map((t, i) => (
                            <div key={i} className="p-12 bg-white border border-gray-100 rounded-[3.5rem] text-right shadow-sm hover:shadow-2xl transition-all group">
                                <MessageSquareQuote size={48} className="text-[#5AA564] mb-8 opacity-20 group-hover:opacity-40 transition-opacity" />
                                <p className="text-xl font-bold text-gray-600 mb-8 leading-relaxed">"{t.q}"</p>
                                <h4 className="font-black text-gray-900">{t.n}</h4>
                                <div className="flex gap-1 text-[#5AA564] mt-2">
                                    {[1, 2, 3, 4, 5].map(j => <Star key={j} size={12} fill="currentColor" />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </Reveal>

            {/* ── Download Section ── */}
            <section id="download" className="py-28 relative overflow-hidden bg-gray-50">
                <div className="absolute left-1/2 -top-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#5AA564]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="w-24 h-24 bg-white shadow-xl shadow-gray-200/50 rounded-3xl flex items-center justify-center mx-auto mb-10 overflow-hidden">
                        <img src="/logo/logo.png" className="w-14 h-14 object-contain hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">جاهز لاحتضان التغيير؟</h2>
                    <p className="text-xl text-gray-500 font-medium mb-12 max-w-2xl mx-auto">قم بتحميل تطبيق مصحف أنامل للصم الآن، متوفر على المتاجر الرسمية لأجهزة آيفون وأندرويد وانضم لمجتمعنا الكبير.</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <a href="#" className="w-full sm:w-auto h-16 px-12 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-lg">App Store</a>
                        <a href="https://play.google.com/store/apps/details?id=quran.alsababah.com" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto h-16 px-12 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-lg">Google Play</a>
                    </div>
                </div>
            </section>

            <footer className="py-24 bg-white border-t border-gray-100 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="md:col-span-2 text-right">
                        <div className="flex items-center gap-4 mb-8 justify-end">
                            <div className="text-right">
                                <div className="font-black text-4xl text-gray-900">مصحف أنامل</div>
                                <div className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">إحدى مبادرات شركة السبابة الرقمية</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-2xl">
                                <img src="/logo/logo.png" alt="Anaml Quran Logo" className="w-16 h-16 object-contain" />
                            </div>
                        </div>
                        <p className="text-gray-400 font-bold text-lg mb-10 leading-relaxed max-w-xl ml-auto">
                            أول مبادرة عالمية لترجمة القرآن الكريم كاملاً لخدمة فئة الصم حول العالم الإسلامي بمنصة تفاعلية 3D تعتمد أعلى المعايير التقنية والشرعية.
                        </p>
                        <div className="flex gap-4 justify-end">
                            {[Twitter, Instagram, Youtube].map((Icon, i) => (
                                <motion.div key={i} whileHover={{ y: -5 }} className="w-14 h-14 bg-gray-50 hover:bg-[#5AA564]/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#5AA564] cursor-pointer transition-colors shadow-sm">
                                    <Icon size={24} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div className="text-right">
                        <h4 className="font-black text-gray-900 mb-10 text-xs uppercase tracking-[0.2em]">روابط سريعة</h4>
                        <ul className="space-y-6 font-bold text-gray-400">
                            <li><a href="#" className="hover:text-gray-900 transition-colors">عن التطبيق</a></li>
                            <li><a href="#" className="hover:text-gray-900 transition-colors">خريطة السور</a></li>
                            <li><a href="#" className="hover:text-gray-900 transition-colors">سياسة الخصوصية</a></li>
                            <li><a href="#" className="hover:text-gray-900 transition-colors">الأسئلة الشائعة</a></li>
                        </ul>
                    </div>
                    <div className="text-right">
                        <h4 className="font-black text-gray-900 mb-10 text-xs uppercase tracking-[0.2em]">تواصل معنا</h4>
                        <ul className="space-y-8 font-bold text-gray-400">
                            <li className="flex items-center gap-4 justify-end group">
                                <span className="group-hover:text-gray-900">info@alsababah.com</span>
                                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-xl"><Mail size={20} /></div>
                            </li>
                            <li className="flex items-center gap-4 justify-end group">
                                <span className="group-hover:text-gray-900">المملكة العربية السعودية</span>
                                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-xl"><MapPin size={20} /></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>

            {/* Floating Contact */}
            <motion.a
                href="https://wa.me/yournumber"
                whileHover={{ scale: 1.1, y: -5 }}
                className="fixed bottom-10 left-10 z-[2000] w-16 h-16 bg-[#5AA564] text-white rounded-full flex items-center justify-center shadow-2xl transition-all"
            >
                <MessageSquareQuote size={32} />
            </motion.a>
        </div>
    );
}
