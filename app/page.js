"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Star, Users, Video, Play, Globe, Shield, CheckCircle2, BookOpen, Compass, Check, ArrowLeft, Lightbulb, MessageSquareQuote, Loader2, Download, Layers, Mail, MapPin, Instagram, Twitter, Youtube } from 'lucide-react';

const StatBadge = ({ value, label, icon }) => (
    <motion.div
        whileHover={{ y: -12, scale: 1.05 }}
        className="text-center group p-10 bg-white/80 backdrop-blur-xl border border-white/40 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_50px_100px_rgba(90,165,100,0.12)] transition-all duration-700 relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5AA564]/10 to-transparent rounded-bl-full opacity-40 -z-10 group-hover:scale-150 transition-transform duration-1000" />
        <div className="flex justify-center mb-6 text-[#5AA564] group-hover:scale-125 transition-transform duration-500">
            {icon}
        </div>
        <p className="text-6xl md:text-7xl font-black text-gray-900 mb-2 tracking-tighter group-hover:text-[#5AA564] transition-colors">{value}</p>
        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">{label}</p>
    </motion.div>
);

const FeatureCard = ({ title, desc, icon, color = "primary" }) => {
    const colorClasses = {
        primary: "bg-[#5AA564]/5 text-[#5AA564] border-[#5AA564]/10",
        gold: "bg-[#D4AF37]/5 text-[#D4AF37] border-[#D4AF37]/10",
        blue: "bg-blue-50 text-blue-600 border-blue-100"
    };
    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 text-right group"
        >
            <div className={`w-16 h-16 ${colorClasses[color]} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                {icon}
            </div>
            <h3 className="text-3xl font-black mb-4 text-gray-900 tracking-tight">{title}</h3>
            <p className="text-gray-400 font-bold text-lg leading-relaxed">{desc}</p>
        </motion.div>
    );
};

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
        if (section3DRef.current) {
            observer.observe(section3DRef.current);
        }
        return () => observer.disconnect();
    }, [isMounted]);

    if (!isMounted) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[#5AA564] z-[1000]">
                <div className="text-white text-center">
                    <Loader2 size={64} className="animate-spin mb-4 mx-auto" strokeWidth={1.5} />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">مصحف أنامل للصم</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-[#5AA564]/20" dir="rtl">
            {/* ── Navbar ── */}
            <nav className="fixed inset-x-0 top-6 z-[100] px-6 pointer-events-none">
                <div className="max-w-7xl mx-auto h-20 bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-gray-200/20 rounded-[2rem] flex items-center justify-between px-8 pointer-events-auto">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <motion.div whileHover={{ scale: 1.05 }} className="relative p-2 bg-white border border-gray-100 shadow-sm rounded-2xl">
                                <img src="/logo/logo.png" alt="شعار مصحف أنامل" className="w-10 h-10 object-contain" />
                            </motion.div>
                        </Link>
                        <div className="flex flex-col -space-y-1 text-right">
                            <span className="text-xl font-black text-gray-900 tracking-tighter">مصحف أنامل</span>
                            <span className="text-[10px] font-bold text-[#5AA564] uppercase tracking-widest">لخدمة الصم</span>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-gray-400">
                        <a href="#features" className="hover:text-[#5AA564] transition-colors relative group">المميزات<span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#5AA564] group-hover:w-full transition-all duration-500" /></a>
                        <a href="#interface" className="hover:text-[#5AA564] transition-colors relative group">الواجهات<span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#5AA564] group-hover:w-full transition-all duration-500" /></a>
                        <a href="#process" className="hover:text-[#5AA564] transition-colors relative group">كيف يعمل<span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#5AA564] group-hover:w-full transition-all duration-500" /></a>
                        <a href="#pricing" className="hover:text-[#5AA564] transition-colors relative group">الباقات<span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#5AA564] group-hover:w-full transition-all duration-500" /></a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-xs font-black uppercase text-gray-400 hover:text-gray-900 px-4 transition-colors hidden sm:block">دخول</Link>
                        <a href="#download" className="px-6 h-12 bg-gray-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-xl flex items-center shadow-xl shadow-gray-900/20 transition-all hover:-translate-y-0.5">تحميل التطبيق</a>
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="relative pt-48 pb-24 px-6 mx-auto bg-white overflow-hidden mesh-gradient arabic-pattern border-b border-gray-50">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1 text-right order-2 lg:order-1 relative z-10">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 px-6 py-2.5 bg-[#5AA564]/5 border border-[#5AA564]/10 rounded-full mb-10 shadow-sm">
                            <Star size={14} className="text-[#5AA564] fill-[#5AA564]" />
                            <span className="text-[11px] font-black text-[#5AA564] uppercase tracking-[0.3em]">المبادرة الأولى عالمياً</span>
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="text-6xl md:text-8xl font-black text-gray-900 leading-[1] mb-10 tracking-tight">
                            تلاوة وفهم القرآن <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#5AA564] via-[#4A8F53] to-[#5AA564] bg-[length:200%_auto] animate-shimmer">بأنامل الصم</span> بيسر.
                        </motion.h1>
                        <p className="text-xl md:text-2xl text-gray-500 font-bold mb-14 max-w-2xl leading-relaxed">منصة <span className="text-gray-900 font-black relative">مصحف أنامل<span className="absolute -bottom-1 left-0 w-full h-1 bg-[#5AA564]/10 rounded-full" /></span> تقدم أول ترجمة تفاعلية ثلاثية الأبعاد للقرآن الكريم مصممة خصيصاً للصم.</p>
                        <div className="flex flex-wrap gap-6">
                            <a href="#download" className="px-12 h-20 bg-gray-900 hover:bg-black text-white font-black rounded-3xl flex items-center gap-4 transition-all hover:scale-105 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.2)] group">
                                <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] opacity-50 mb-1">متوفر الآن في المتجر</span>
                                    <span className="text-lg">تحميل التطبيق</span>
                                </div>
                            </a>
                            <a href="#demo" className="px-10 h-20 bg-white hover:bg-gray-50 text-gray-900 border border-gray-100 rounded-3xl flex items-center font-black transition-all">شاهد كيف يعمل؟</a>
                        </div>
                    </div>
                    <motion.div initial={{ opacity: 0, x: 100, rotate: 10 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration: 1.2 }} className="flex-1 relative order-1 lg:order-2 group">
                        <div className="absolute inset-0 bg-[#5AA564]/20 blur-[150px] rounded-full scale-125 group-hover:scale-150 transition-transform duration-1000" />
                        <img src="/mockups/quran_main.png" alt="المصحف" className="relative z-10 w-full max-w-[500px] mx-auto drop-shadow-[0_50px_100_rgba(0,0,0,0.2)] group-hover:translate-y-[-10px] transition-transform duration-700" />
                    </motion.div>
                </div>
            </motion.section>

            {/* ── Features Grid ── */}
            <section id="features" className="py-32 bg-gray-50/50 relative arabic-pattern">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <FeatureCard title="القرآن الكريم كاملًا" desc="ترجمة إشارية دقيقية وفورية لجميع سور القرآن الكريم بوضوح فائق." icon={<BookOpen size={32} />} color="primary" />
                    <FeatureCard title="القبلة الذكية" desc="بوصلة ذهبية دقيقة مع تحديد أوقات الصلاة حسب موقعك الجغرافي." icon={<Compass size={32} />} color="gold" />
                    <FeatureCard title="خدمة المجتمعات" desc="لوحة تحكم خاصة للجهات التعليمية والمنظمات لخدمة أكبر عدد من المستفيدين." icon={<Users size={32} />} color="blue" />
                </div>
            </section>

            {/* ── 3D Viewer Section ── */}
            <section ref={section3DRef} className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="relative h-[650px] bg-gradient-to-br from-white to-[#5AA564]/5 rounded-[4rem] border border-gray-100 shadow-2xl overflow-hidden group">
                        {show3D && (
                            <iframe src="/3viewer/index.html" className="w-full h-full border-none relative z-10" onLoad={() => setIs3DLoading(false)} />
                        )}
                        {is3DLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                                <div className="w-16 h-16 border-4 border-[#5AA564]/20 border-t-[#5AA564] rounded-full animate-spin" />
                                <span className="text-xs font-black uppercase tracking-widest text-[#5AA564]">جاري تشغيل المعالج ثلاثي الأبعاد</span>
                            </div>
                        )}
                        <div className="absolute bottom-10 inset-x-0 mx-auto w-fit px-8 py-3 bg-white/70 backdrop-blur-md rounded-full border border-white/50 z-20 shadow-lg hidden md:block">
                            <span className="text-xs font-black text-gray-500">تم التقاط الحركة باستخدام تقنيات Motion Capture الاحترافية</span>
                        </div>
                    </motion.div>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-[#5AA564] bg-[#5AA564]/5 px-4 py-2 rounded-full inline-block mb-6 tracking-widest uppercase">ثورة في لغة الإشارة</span>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-10 leading-[1.1]">ترجمة <span className="text-[#5AA564]">3D</span> تفاعلية <br /> تجسد خشوع الآيات</h2>
                        <p className="text-lg md:text-xl text-gray-500 font-bold mb-12 leading-relaxed">نستخدم أحدث تقنيات الأنيميشن ثلاثي الأبعاد المعتمدة على الذكاء الاصطناعي لضمان فهم الصم لأدق تفاصيل معاني القرآن الكريم.</p>
                        <div className="space-y-4">
                            {['دقة متناهية في تعبيرات الوجه', 'حركات دقيقة للأصابع والأيدي', 'تزامن كامل مع النص القرآني'].map((txt, i) => (
                                <div key={i} className="flex items-center gap-4 justify-end group cursor-default text-right">
                                    <span className="font-black text-gray-700 group-hover:text-[#5AA564] transition-colors">{txt}</span>
                                    <div className="w-8 h-8 rounded-full bg-[#5AA564]/10 flex items-center justify-center text-[#5AA564]"><Check size={16} /></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── App Interfaces Showcase ── */}
            <section id="interface" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[350px]">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="md:col-span-12 lg:col-span-7 md:row-span-2 relative group overflow-hidden bg-slate-50 rounded-[4rem] border border-gray-100 p-12 flex flex-col items-start text-right transition-all duration-700 hover:shadow-2xl">
                        <div className="relative z-10 max-w-sm">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#5AA564] mb-8 border border-gray-50">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-4xl font-black text-gray-900 mb-6 font-bold">مصحف الصم التفاعلي</h3>
                            <p className="text-gray-400 font-bold text-lg leading-relaxed mb-8">ترجمة دقيقة لـ 114 سورة عبر مترجم 3D عالي الدقة يرافق النص القرآني.</p>
                        </div>
                        <img src="/mockups/quran_main.png" className="absolute bottom-[-100px] left-[-40px] w-full max-w-[420px] rounded-[3rem] shadow-2xl hidden md:block group-hover:rotate-0 transition-transform duration-700 rotate-[-5deg]" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} className="md:col-span-12 lg:col-span-5 md:row-span-2 relative group overflow-hidden bg-white border border-gray-100 rounded-[4rem] p-12 shadow-xl text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-[2rem] flex items-center justify-center text-[#D4AF37] mb-8">
                            <Compass size={40} />
                        </div>
                        <h3 className="text-3xl font-black mb-4">القبلة والأوقات</h3>
                        <p className="text-gray-400 font-bold mb-10">تحديد دقيق لاتجاه الكعبة ومواقيت الصلاة حسب موقعك الحالي.</p>
                        <div className="w-full space-y-3">
                            {['الفجر - 05:15 AM', 'الظهر - 12:30 PM', 'العصر - 03:45 PM'].map((p, i) => (
                                <div key={i} className="px-6 py-4 bg-gray-50 rounded-2xl font-black text-gray-900 border border-gray-100">{p}</div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── App Portfolio (Infinite Belt) ── */}
            <section className="py-32 bg-[#0A0D1A] overflow-hidden">
                <div className="text-center mb-20 px-6">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">واجهات رقمية ساحرة</h2>
                    <p className="text-white/40 font-bold text-lg">تجربة مستخدم صممت بعناية لتناسب كبار السن والأطفال من فئة الصم.</p>
                </div>
                <div className="relative flex overflow-hidden py-10">
                    <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="flex gap-12 whitespace-nowrap min-w-full px-12">
                        {["adhkar.png", "quran_main.png", "prayer.png", "app_steps.png"].map((img, i) => (
                            <div key={i} className="w-[320px] h-[650px] flex-shrink-0 bg-white rounded-[3.5rem] p-3 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5 relative group overflow-hidden">
                                <img src={`/mockups/${img}`} className="w-full h-full object-cover rounded-[3rem] group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-10 text-white font-black">
                                    <span className="text-xs opacity-60 mb-2 uppercase tracking-widest">مصحف أنامل</span>
                                    <span className="text-2xl">واجهة ذكية ومتطورة</span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Vision / About Section ── */}
            <section className="py-24 max-w-7xl mx-auto px-6 relative">
                <div className="bg-gray-900 text-white rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#5AA564] blur-[150px] opacity-30 rounded-full" />
                    <div className="relative z-10 text-right">
                        <span className="text-sm font-extrabold text-[#5AA564] tracking-widest uppercase mb-4 block">عن المبادرة</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">رؤيتنا لا تعرف حدوداً والصم في قلب الاهتمام</h2>
                        <p className="text-gray-400 font-medium leading-relaxed mb-8 text-lg">بجهود دؤوبة نسعى لبناء مجتمع رقمي شامل يعزز من قدرة الصم على الوصول للقرآن الكريم بيسر وسهولة، بمميزات عالمية وبأحدث التقنيات.</p>
                        <div className="flex items-center gap-4 border-t border-gray-800 pt-8 mt-8 justify-end">
                            <div className="text-right">
                                <h4 className="font-bold text-white text-lg">محتوى موثوق ومراجع</h4>
                                <p className="text-gray-400 text-sm">من قبل نخبة من علماء الشريعة وخبراء الإشارة.</p>
                            </div>
                            <Shield className="text-[#5AA564]" size={40} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <MessageSquareQuote size={64} className="text-[#5AA564] mx-auto mb-8 opacity-20" />
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-16">أصوات من القلب</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { name: "محمد عبدالله", quote: "لم أكن أتخيل أن أفهم القرآن بهذا الوضوح. الترجمة مذهلة." },
                            { name: "فاطمة أحمد", quote: "تطبيق متكامل وسهل، أذكار الصباح والمساء بلغة الإشارة رائعة." },
                            { name: "يوسف خالد", quote: "كأخصائي إشارة، أنصح بهذا التطبيق لكل عائلات الصم." }
                        ].map((t, i) => (
                            <div key={i} className="p-10 bg-gray-50 rounded-[3rem] text-right border border-gray-100 hover:bg-white hover:shadow-2xl transition-all">
                                <p className="text-xl font-bold text-gray-600 mb-8 italic">"{t.quote}"</p>
                                <h4 className="font-black text-gray-900">{t.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Pricing ── */}
            <section id="pricing" className="py-32 bg-gray-900 relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-5xl font-black text-white mb-16">باقات تناسب الجميع</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-16 rounded-[4rem] text-right">
                            <h3 className="text-2xl font-black text-white mb-6">باقة الأفراد</h3>
                            <div className="flex items-baseline gap-3 mb-10 justify-end">
                                <span className="text-xl font-bold text-white/40">ر.س / سنوياً</span>
                                <span className="text-8xl font-black text-white tracking-tighter">120</span>
                            </div>
                            <ul className="space-y-6 mb-16 text-white/70 font-bold">
                                {["وصول لـ 114 سورة", "ترجمة 3D احترافية", "أذكار ومواقيت"].map((li, i) => (
                                    <li key={i} className="flex items-center gap-4 justify-end">{li} <Check size={20} className="text-[#5AA564]" /></li>
                                ))}
                            </ul>
                            <Link href="/pay?type=single" className="flex items-center justify-center w-full h-16 bg-white text-gray-900 font-black rounded-2xl transition-all">اشترك الآن</Link>
                        </div>
                        <div className="bg-gradient-to-br from-[#5AA564] to-[#4A8F53] p-16 rounded-[4rem] text-right shadow-2xl">
                            <h3 className="text-2xl font-black text-white mb-6">باقة الجمعيات</h3>
                            <div className="flex items-baseline gap-3 mb-10 justify-end">
                                <span className="text-xl font-bold text-white/50">ر.س / للمستخدم</span>
                                <span className="text-8xl font-black text-white tracking-tighter">102</span>
                            </div>
                            <ul className="space-y-6 mb-16 text-white font-bold">
                                {["لوحة تحكم خاصة", "تفعيل فوري للأكواد", "إدارة المستخدمين"].map((li, i) => (
                                    <li key={i} className="flex items-center gap-4 justify-end">{li} <Check size={20} className="text-white" /></li>
                                ))}
                            </ul>
                            <Link href="/pay?type=org" className="flex items-center justify-center w-full h-16 bg-gray-900 text-white font-black rounded-2xl transition-all">شراء للمجموعات</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="py-32 max-w-4xl mx-auto px-6 text-center">
                <Lightbulb size={48} className="text-[#5AA564] mx-auto mb-8 opacity-20" />
                <h2 className="text-4xl font-black text-gray-900 mb-16">الأسئلة الشائعة</h2>
                <div className="space-y-6 text-right">
                    {[
                        { q: "هل يتطلب التطبيق إنترنت؟", a: "يمكنك تحميل السور ومشاهدتها أوفلاين في أي وقت." },
                        { q: "هل الترجمة معتمدة؟", a: "نعم، تمت مراجعة جميع الترجمات من كبار علماء الإشارة والشريعة." }
                    ].map((f, i) => (
                        <div key={i} className="p-10 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-xl transition-all">
                            <h3 className="text-xl font-black mb-4">{f.q}</h3>
                            <p className="text-gray-500 font-bold leading-relaxed">{f.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Download CTA (The MISSING section) ── */}
            <section id="download" className="py-24 max-w-7xl mx-auto px-6">
                <div className="bg-[#5AA564] rounded-[3.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-[#5AA564]/40">
                    <div className="absolute top-0 left-0 w-full h-full arabic-pattern opacity-10 pointer-events-none" />
                    <div className="relative z-10 max-w-3xl mx-auto uppercase">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">ابدأ رحلتك الإيمانية اليوم</h2>
                        <p className="text-white/80 font-bold text-xl mb-14 leading-relaxed">انضم إلى آلاف الصم الذين وجدوا راحتهم في تدبر القرآن بلغة الإشارة. التطبيق متوفر الآن مجاناً.</p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                            <a href="#" className="w-full sm:w-auto px-10 h-16 bg-white text-[#5AA564] rounded-2xl flex items-center justify-center gap-3 font-black transition-all hover:scale-105 shadow-xl">
                                <img src="/logo/apple.png" className="w-5 h-5 hidden" />
                                App Store
                            </a>
                            <a href="#" className="w-full sm:w-auto px-10 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center gap-3 font-black transition-all hover:scale-105 shadow-xl">
                                <img src="/logo/google.png" className="w-5 h-5 hidden" />
                                Google Play
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-20 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-4 mb-8">
                            <img src="/logo/logo.png" className="w-16 h-16" />
                            <div className="text-right">
                                <div className="font-black text-3xl text-gray-900 tracking-tighter">مصحف أنامل</div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">إحدى مبادرات شركة السبابة الرقمية</div>
                            </div>
                        </div>
                        <p className="text-gray-400 font-bold text-lg mb-8 text-right">المبادرة العالمية الأولى لترجمة القرآن الكريم كاملاً لخدمة فئة الصم وضعاف السمع حول العالم الإسلامي.</p>
                        <div className="flex gap-4 justify-end">
                            <a href="#" className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#5AA564] transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#5AA564] transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#5AA564] transition-colors"><Youtube size={20} /></a>
                        </div>
                    </div>
                    <div className="text-right">
                        <h4 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-xs">روابط سريعة</h4>
                        <ul className="space-y-4 font-bold text-gray-400">
                            <li><a href="#" className="hover:text-gray-900">عن التطبيق</a></li>
                            <li><a href="#" className="hover:text-gray-900">المميزات</a></li>
                            <li><a href="#" className="hover:text-gray-900">خريطة السور</a></li>
                            <li><a href="#" className="hover:text-gray-900">الباقات</a></li>
                        </ul>
                    </div>
                    <div className="text-right">
                        <h4 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-xs">التواصل</h4>
                        <ul className="space-y-6 font-bold text-gray-400">
                            <li className="flex items-center gap-3 justify-end leading-none"><span>info@alsababah.com</span> <Mail size={18} /></li>
                            <li className="flex items-center gap-3 justify-end leading-none"><span>المملكة العربية السعودية</span> <MapPin size={18} /></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">جميع الحقوق محفوظة © 2026 لشركة السبابة الرقمية</p>
                    <div className="flex items-center gap-4 text-xs font-black text-[#5AA564] uppercase tracking-widest">
                        <Link href="/login" className="hover:underline">دخول الإدارة</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
