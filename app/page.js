"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HandMetal, Smartphone, Star, Users, Video, Play, Globe, Shield, CheckCircle2, BookOpen, Compass, Check, ArrowLeft, Lightbulb, MessageSquareQuote, Loader2, Download, Layers } from 'lucide-react';

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

const StepIndicator = ({ number, title, desc, delay = 0 }) => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="relative pl-0 md:pl-10 text-center md:text-right flex flex-col md:flex-row items-center md:items-start gap-6 group"
    >
        <div className="flex-shrink-0 w-16 h-16 bg-white border-4 border-[#F8FAFC] shadow-xl rounded-full flex items-center justify-center text-xl font-black text-[#5AA564] z-10 relative group-hover:scale-110 transition-transform">
            {number}
        </div>
        <div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2 group-hover:text-[#5AA564] transition-colors">{title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed max-w-sm">{desc}</p>
        </div>
    </motion.div>
);

export default function LandingPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [show3D, setShow3D] = useState(false);
    const [is3DLoading, setIs3DLoading] = useState(true);
    const section3DRef = useRef(null);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsMounted(true));
        return () => cancelAnimationFrame(frame);
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

    if (!isMounted) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#5AA564]">
                <div className="animate-spin text-white">
                    <Loader2 size={48} strokeWidth={2.5} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-[#5AA564]/20 overflow-x-hidden" dir="rtl">

            {/* ── Navbar ── */}
            <nav className="fixed inset-x-0 top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative group cursor-pointer"
                            >
                                <div className="absolute -inset-2 bg-gradient-to-tr from-[#5AA564]/30 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />
                                <div className="relative p-1.5 bg-white border border-gray-100 shadow-sm rounded-xl transition-transform">
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
                        <Link href="/login" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors border-l border-gray-100 pr-0 pl-6 hidden sm:block">
                            دخول الإدارة
                        </Link>
                        <a href="#download" className="inline-flex items-center gap-2 px-6 h-11 bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 hover:-translate-y-0.5">
                            تحميل التطبيق
                        </a>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ── */}
            <header className="relative pt-40 pb-20 px-6 mx-auto bg-white overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1000px] pointer-events-none">
                    <div className="absolute -top-40 -left-20 w-[800px] h-[800px] bg-[#5AA564]/5 blur-[120px] rounded-full" />
                    <div className="absolute top-20 right-[-100px] w-[600px] h-[600px] bg-blue-500/5 blur-[100px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div className="text-right">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 px-6 py-2 bg-[#5AA564]/10 border border-[#5AA564]/20 rounded-full mb-8"
                        >
                            <Star size={14} className="text-[#5AA564] fill-[#5AA564]" />
                            <span className="text-[11px] font-black text-[#5AA564] uppercase tracking-[0.3em]">الأول من نوعه في العالم</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.95] mb-10 tracking-tighter"
                        >
                            تلاوة القرآن <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#5AA564] to-[#4A8F53]">بأنامل الصم</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-500 font-bold mb-12 max-w-xl leading-relaxed"
                        >
                            منصة متكاملة مصممة لتمكين الصم وضعاف السمع من تدبر وفهم القرآن الكريم بلغة الإشارة عبر تقنيات 3D متطورة.
                        </motion.p>

                        <div className="flex flex-wrap gap-6">
                            <a href="#download" className="h-16 px-10 bg-gray-900 text-white rounded-2xl flex items-center gap-3 font-black text-sm hover:scale-105 transition-all shadow-xl">
                                <Smartphone size={20} />
                                تحميل التطبيق مجاناً
                            </a>
                            <a href="#process" className="h-16 px-10 bg-white border border-gray-100 text-gray-900 rounded-2xl flex items-center gap-3 font-black text-sm hover:bg-gray-50 transition-all">
                                <Play size={20} className="fill-gray-400" />
                                شاهد كيف يعمل
                            </a>
                        </div>
                    </div>

                    <div className="relative flex justify-center lg:justify-end">
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative bg-white/10 backdrop-blur-3xl p-4 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden"
                        >
                            <img src="/mockups/quran_main.png" alt="App Preview" className="w-[450px] h-auto rounded-[3.5rem] brightness-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* ── Partner Logos ── */}
            <div className="bg-white py-12 border-y border-gray-50">
                <div className="max-w-7xl mx-auto px-6 opacity-30 grayscale flex flex-wrap justify-center items-center gap-16 md:gap-32">
                    <img src="/logo/logo.png" alt="Partner" className="h-10 w-auto" />
                    <img src="/logo/logo.png" alt="Partner" className="h-10 w-auto" />
                    <img src="/logo/logo.png" alt="Partner" className="h-10 w-auto" />
                    <img src="/logo/logo.png" alt="Partner" className="h-10 w-auto" />
                </div>
            </div>

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

            {/* ── 3D Viewer Section ── */}
            <section id="features" ref={section3DRef} className="relative py-32 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative h-[650px] bg-gray-50 rounded-[4rem] overflow-hidden shadow-內">
                            {!show3D || is3DLoading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <Loader2 className="animate-spin text-[#5AA564] mb-4" size={48} />
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">المعالج الذكي يستعد...</p>
                                </div>
                            ) : null}
                            {show3D && (
                                <iframe 
                                    src="/3viewer/index.html" 
                                    className="w-full h-full border-none"
                                    onLoad={() => setIs3DLoading(false)}
                                />
                            )}
                        </div>
                        
                        <div className="text-right">
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-tight">بوابة للصم <br /> نحو عالم <span className="text-[#5AA564]">القرآن</span></h2>
                            <p className="text-gray-500 font-bold text-xl mb-12 leading-relaxed">نستخدم أحدث تقنيات الـ 3D لتبسيط معاني القرآن، حيث يرافقك مترجم افتراضي يشرح كل كلمة وحركة بدقة متناهية.</p>
                            
                            <div className="space-y-4">
                                {[
                                    "ترجمة معتمدة من خبراء لغة الإشارة",
                                    "تفاعل حركي انسيابي عالي الجودة",
                                    "واجهة بصرية مريحة للعين"
                                ].map((text, i) => (
                                    <div key={i} className="flex items-center gap-4 justify-start">
                                        <div className="w-8 h-8 rounded-full bg-[#5AA564]/10 flex items-center justify-center text-[#5AA564]">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <span className="font-bold text-gray-700 text-lg">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Grid Interface Cards ── */}
            <section id="interface" className="relative py-32 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="md:col-span-12 lg:col-span-7 bg-white rounded-[4rem] p-12 border border-gray-100 flex flex-col items-start relative overflow-hidden group min-h-[500px]"
                    >
                        <div className="relative z-10 max-w-sm text-right">
                            <div className="w-16 h-16 bg-[#5AA564]/10 rounded-2xl flex items-center justify-center text-[#5AA564] mb-8">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">القرآن بلغة الإشارة</h3>
                            <p className="text-gray-400 font-bold text-lg leading-relaxed mb-8">أول مصحف تفاعلي يدمج النص القرآني مع ترجمة فورية لـ 114 سورة عبر مترجم 3D عالي الدقة.</p>
                        </div>
                        <img src="/mockups/quran_main.png" alt="Quran" className="absolute -left-20 -bottom-20 w-[600px] rotate-[-5deg] group-hover:rotate-0 transition-all duration-700 drop-shadow-2xl" />
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -10 }}
                        className="md:col-span-12 lg:col-span-5 bg-white rounded-[4rem] border border-gray-100 relative group overflow-hidden min-h-[500px]"
                    >
                        <Link href="/qibla" className="flex flex-col h-full p-12 relative z-10 group/q">
                            <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-[2rem] flex items-center justify-center text-[#D4AF37] mb-8 mx-auto group-hover/q:scale-110 group-hover/q:-rotate-6 transition-all duration-700">
                                <Compass size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight text-center">القبلة ومواقيت الصلاة</h3>
                            <p className="text-gray-400 font-bold text-lg leading-relaxed text-center mb-8">بوصلة ذهبية دقيقة وخدمة مواقيت الصلاة حسب الموقع (اضغط للاستكشاف).</p>
                            <div className="space-y-3 mt-auto">
                                {[
                                    { name: 'الفجر', time: '05:15 AM' },
                                    { name: 'الظهر', time: '12:30 PM' },
                                    { name: 'العصر', time: '03:45 PM' }
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center justify-between px-6 py-4 bg-gray-50/50 rounded-2xl group-hover/q:bg-white transition-all">
                                        <span className="text-gray-400 text-xs font-black uppercase tracking-widest">{p.name}</span>
                                        <span className="text-gray-900 text-sm font-black">{p.time}</span>
                                    </div>
                                ))}
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -10 }}
                        className="md:col-span-12 bg-gradient-to-br from-[#5AA564] to-[#4A8F53] rounded-[4rem] p-16 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden group shadow-2xl shadow-[#5AA564]/30"
                    >
                        <div className="relative z-10 flex-1 text-right text-white">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[1.5rem] flex items-center justify-center text-white mb-8">
                                <Layers size={28} />
                            </div>
                            <p className="text-white/50 font-bold text-xl leading-relaxed mb-10">مكتبة فيديو شاملة لكل ما يحتاجه المسلم في يومه، من أذكار الصباح والمساء إلى تعليم الصلاة.</p>
                            <img src="/mockups/adhkar.png" alt="Adhkar" className="absolute -left-20 -bottom-20 w-[480px] rotate-6 group-hover:rotate-0 transition-transform duration-700 md:block hidden drop-shadow-2xl" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Process ── */}
            <section id="process" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="text-right">
                        <span className="text-[10px] font-black text-[#5AA564] bg-[#5AA564]/10 px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-[0.2em]">ببساطة تامة</span>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-12 leading-tight">رحلة التعلم <br /> مع <span className="text-[#5AA564]">أنامل</span></h2>
                        <div className="space-y-12 mt-12">
                            <StepIndicator number="01" title="حمل التطبيق" desc="متوفر مجاناً على متجري آبل وجوجل؛ ابدأ رحلتك التفاعلية في ثوانٍ." delay={0.1} />
                            <StepIndicator number="02" title="اختر السورة" desc="تصفح قائمة السور المنسقة والمراجعة بعناية لتناسب القراءة والحفظ." delay={0.2} />
                            <StepIndicator number="03" title="مشاهدة الترجمة" desc="استمتع بالمعنى بكل جوارحك عبر ترجمة إشارة احترافية ترافق كل آية نطقاً وحركة." delay={0.3} />
                        </div>
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
            </section>

            {/* ── Stats ── */}
            <section className="bg-white py-16 border-y border-gray-50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
                    <StatBadge value="+10K" label="مستفيد نشط" icon={<Users size={24} />} />
                    <StatBadge value="114" label="سورة تفاعلية" icon={<BookOpen size={24} />} />
                    <StatBadge value="100%" label="دقة الترجمة" icon={<Shield size={24} />} />
                    <StatBadge value="4.9" label="تقييم المتجر" icon={<Star size={24} />} />
                </div>
            </section>

            {/* ── Pricing ── */}
            <section id="download" className="py-32 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl font-black text-gray-900 mb-6">باقات تناسب احتياجك</h2>
                        <p className="text-gray-400 font-bold text-lg">بنينا المنصة لتكون عوناً للجميع، اختر الباقة التي تدعم رحلتك.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm text-right flex flex-col">
                            <h3 className="text-2xl font-black mb-4">باقة الأفراد</h3>
                            <div className="flex items-baseline gap-3 mb-10">
                                <span className="text-6xl font-black tracking-tighter">120</span>
                                <span className="text-gray-400 font-bold">ر.س / سنوياً</span>
                            </div>
                            <ul className="space-y-4 mb-12 flex-1">
                                {["دخول كامل ל-114 سورة", "ترجمة 3D احترافية", "مواقيت القبلة والأذكار"].map((txt, i) => (
                                    <li key={i} className="flex items-center gap-3 justify-start font-bold text-gray-600">
                                        <Check size={16} className="text-[#5AA564]" /> {txt}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/pay?type=single" className="h-14 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-2xl flex items-center justify-center font-black transition-all">شراء الآن</Link>
                        </div>

                        <div className="bg-gray-900 p-12 rounded-[3.5rem] text-right flex flex-col relative overflow-hidden border-8 border-[#5AA564]/30">
                            <h3 className="text-2xl font-black text-white mb-4">باقة الجهات</h3>
                            <div className="flex items-baseline gap-3 mb-10">
                                <span className="text-6xl font-black text-[#5AA564] tracking-tighter">102</span>
                                <span className="text-gray-500 font-bold">ر.س / للمستخدم</span>
                            </div>
                            <ul className="space-y-4 mb-12 flex-1">
                                {["لوحة تحكم إدارية", "إدارة المستخدمين والأجهزة", "تقارير إحصائية دورية"].map((txt, i) => (
                                    <li key={i} className="flex items-center gap-3 justify-start font-bold text-white/70">
                                        <Check size={16} className="text-[#5AA564]" /> {txt}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/pay?type=org" className="h-14 bg-[#5AA564] hover:bg-[#4A8F53] text-white rounded-2xl flex items-center justify-center font-black transition-all shadow-xl shadow-[#5AA564]/20">تفعيل الباقة</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA Final ── */}
            <section className="py-24 bg-white relative">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <img src="/logo/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-10" />
                    <h2 className="text-5xl font-black text-gray-900 mb-8 leading-tight">ابدأ رحلتك الإيمانية <br /> اليوم مجاناً</h2>
                    <p className="text-xl text-gray-500 font-bold mb-12">انضم لآلاف المستفيدين الذين وجدوا في القرآن نذيراً وبشيراً بأناملهم.</p>
                    <div className="flex justify-center gap-4">
                        <a href="#" className="h-16 px-12 bg-gray-900 text-white rounded-2xl flex items-center font-bold text-lg hover:bg-black transition-all">App Store</a>
                        <a href="#" className="h-16 px-12 bg-gray-900 text-white rounded-2xl flex items-center font-bold text-lg hover:bg-black transition-all">Google Play</a>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-white border-t border-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4">
                        <img src="/logo/logo.png" alt="Logo" className="w-10 h-10" />
                        <div className="text-right">
                            <p className="font-black text-gray-900">مصحف أنامل للصم</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">إحدى مبادرات السبابة الرقمية</p>
                        </div>
                    </div>
                    <p className="text-gray-400 font-bold text-sm">© 2026 جميع الحقوق محفوظة لشركة السبابة الرقمية.</p>
                    <Link href="/login" className="text-gray-400 hover:text-gray-900 font-black text-xs uppercase tracking-widest transition-all px-4 py-2 bg-gray-50 rounded-lg">إدارة المنصة</Link>
                </div>
            </footer>
        </div>
    );
}
