"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Smartphone, Star, Users, Video, Play, Globe, Shield, CheckCircle2, BookOpen, Compass, Check, ArrowLeft, Lightbulb, MessageSquareQuote, Loader2, Download, Layers, Mail, MapPin, Instagram, Twitter, Youtube } from 'lucide-react';

const Ornament = ({ className }) => (
    <div className={`pointer-events-none opacity-20 ${className}`}>
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0L56.123 38.877L95 45L56.123 51.123L50 90L43.877 51.123L5 45L43.877 38.877L50 0Z" fill="currentColor" />
        </svg>
    </div>
);

const StatBadge = ({ value, label, icon }) => (
    <motion.div
        whileHover={{ y: -15, scale: 1.05 }}
        className="text-center group p-12 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[4rem] shadow-[0_25px_60px_rgba(0,0,0,0.03)] hover:shadow-[0_60px_120px_rgba(90,165,100,0.15)] transition-all duration-700 relative overflow-hidden"
    >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#5AA564]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        <div className="flex justify-center mb-8 text-[#5AA564] group-hover:rotate-[360deg] transition-transform duration-1000">
            {icon}
        </div>
        <p className="text-6xl md:text-8xl font-black text-gray-900 mb-4 tracking-tighter group-hover:text-[#5AA564] transition-colors">{value}</p>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">{label}</p>
    </motion.div>
);

export default function LandingPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [show3D, setShow3D] = useState(false);
    const [is3DLoading, setIs3DLoading] = useState(true);
    const section3DRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setShow3D(true); observer.disconnect(); }
        }, { threshold: 0.1 });
        if (section3DRef.current) observer.observe(section3DRef.current);
        return () => observer.disconnect();
    }, [isMounted]);

    if (!isMounted) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-[1000]">
                <div className="text-white text-center">
                    <div className="w-24 h-24 relative mb-6 mx-auto">
                        <div className="absolute inset-0 border-4 border-[#5AA564]/20 rounded-full" />
                        <div className="absolute inset-0 border-4 border-[#5AA564] rounded-full border-t-transparent animate-spin" />
                        <img src="/logo/logo.png" className="absolute inset-0 m-auto w-12 h-12" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">مصحف أنامل للصم</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-[#5AA564]/20" dir="rtl">
            <Ornament className="fixed top-20 left-10 text-[#5AA564] z-50 animate-spin-slow" />
            <Ornament className="fixed bottom-20 right-10 text-[#D4AF37] z-50 animate-reverse-spin-slow" />

            {/* ── Navbar ── */}
            <nav className="fixed inset-x-0 top-4 z-[100] px-6 pointer-events-none">
                <div className="max-w-7xl mx-auto h-20 bg-white/60 backdrop-blur-3xl border border-white/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] flex items-center justify-between px-10 pointer-events-auto">
                    <div className="flex items-center gap-5">
                        <Link href="/">
                            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative p-2.5 bg-white shadow-xl rounded-[1.2rem] border border-gray-100">
                                <img src="/logo/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                            </motion.div>
                        </Link>
                        <div className="flex flex-col -space-y-1.5 text-right">
                            <span className="text-2xl font-black text-gray-900 tracking-tight">أنامل</span>
                            <span className="text-[9px] font-black text-[#5AA564] uppercase tracking-[0.3em]">القرآن للصم</span>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {['features', 'interface', 'process', 'pricing'].map(item => (
                            <a key={item} href={`#${item}`} className="hover:text-gray-900 transition-all hover:tracking-[0.2em]">{item === 'features' ? 'المميزات' : item === 'interface' ? 'الواجهات' : item === 'process' ? 'كيف يعمل' : 'الباقات'}</a>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="px-6 py-2 bg-gray-50 hover:bg-white text-[11px] font-black rounded-xl transition-all hidden sm:block">دخول</Link>
                        <a href="#download" className="px-8 h-12 bg-[#5AA564] hover:bg-[#4A8F53] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-[#5AA564]/30 transition-all hover:scale-105 active:scale-95">حمّل الآن</a>
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <motion.section className="relative pt-32 pb-16 px-6 overflow-hidden bg-white arabic-pattern">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-br from-[#5AA564]/5 via-transparent to-transparent blur-[150px] -mr-80 -mt-80" />
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 pt-10">
                    <div className="flex-1 text-right order-2 lg:order-1 max-w-md">
                        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="inline-flex gap-3 px-6 py-3 bg-white border border-gray-100 rounded-full shadow-sm mb-8 max-w-[280px]">
                            <span className="w-2 h-2 rounded-full bg-[#5AA564] animate-ping" />
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-normal leading-tight">المشروع الأول من نوعه عالمياً</span>
                        </motion.div>
                        <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[0.85] mb-8 tracking-tighter">
                            تلاوة <br /> <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#5AA564] to-[#4A8F53]">بأنامل تفيض</span> <br /> إيماناً.
                        </motion.h1>
                        <p className="text-lg text-gray-400 font-bold mb-10 max-w-xs leading-relaxed">أول منصة رقمية تترجم قدسية القرآن الكريم إلى لغة الإشارة بتصاميم عصرية وتقنيات 3D تفاعلية.</p>
                        <div className="flex flex-wrap gap-8">
                            <a href="#download" className="group relative px-14 h-24 bg-gray-900 text-white rounded-[2.5rem] flex items-center gap-4 transition-all hover:translate-y-[-5px] overflow-hidden">
                                <div className="absolute inset-0 bg-[#5AA564] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                <Download size={28} className="relative z-10" />
                                <span className="relative z-10 font-black text-lg">ابدأ التجربة مجاناً</span>
                            </a>
                        </div>
                    </div>
                    <motion.div style={{ y: y1 }} className="flex-1 relative order-1 lg:order-2">
                        <div className="relative z-20 w-full max-w-[550px] mx-auto p-4 bg-white/20 backdrop-blur-3xl border border-white/40 rounded-[4rem] shadow-2xl">
                            <img src="/mockups/quran_main.png" alt="App" className="w-full rounded-[3rem] drop-shadow-2xl hover:scale-[1.03] transition-transform duration-1000" />
                        </div>
                        <motion.img style={{ y: y2 }} src="/mockups/adhkar.png" className="absolute -bottom-20 -left-20 w-64 rounded-[3rem] shadow-2xl z-30 border-8 border-white hidden md:block" />
                    </motion.div>
                </div>
            </motion.section>

            {/* ── Showcase stacked Grid ── */}
            <section id="interface" className="py-12 bg-gray-50/50 arabic-pattern relative">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-10 bg-[#5AA564]/10 blur-[120px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                        <div className="relative flex items-center justify-center">
                            <motion.img initial={{ x: -100, rotate: -20, opacity: 0 }} whileInView={{ x: 0, rotate: -15, opacity: 1 }} src="/mockups/prayer.png" className="w-[300px] rounded-[3.5rem] shadow-2xl z-10 translate-x-12 translate-y-12" />
                            <motion.img initial={{ x: 100, rotate: 20, opacity: 0 }} whileInView={{ x: 0, rotate: 5, opacity: 1 }} src="/mockups/quran_main.png" className="w-[300px] rounded-[3.5rem] shadow-2xl z-20 border-8 border-white" />
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-6xl font-black text-gray-900 mb-10 tracking-tighter">بساطة التصميم <br /> <span className="text-[#5AA564]">وعمق التجربة</span></h2>
                        <p className="text-xl text-gray-400 font-bold mb-14 leading-relaxed">كل أيقونة وكل لون اختير بعناية فائقة ليناسب الراحة البصرية لفئة الصم، مع واجهات بديهية لا تحتاج لشرح.</p>
                        <div className="grid grid-cols-2 gap-8">
                            {['تنسيق بصري مريح', 'أيقونات تعبيرية', 'ترجمة فورية', 'متابعة يومية'].map(txt => (
                                <div key={txt} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all">
                                    <Check size={24} className="text-[#5AA564] mb-4 mx-auto" />
                                    <p className="font-black text-center text-sm">{txt}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 3D Visual Experience ── */}
            <section ref={section3DRef} className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="relative h-[750px] bg-[#0A0D1A] rounded-[5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)]">
                        {show3D && <iframe src="/3viewer/index.html" className="w-full h-full border-none" onLoad={() => setIs3DLoading(false)} />}
                        {is3DLoading && <div className="absolute inset-0 flex items-center justify-center text-white font-black">جاري التحميل...</div>}
                    </motion.div>
                    <div className="text-right">
                        <span className="px-6 py-2 bg-gray-50 text-[10px] font-black uppercase tracking-widest rounded-full mb-10 inline-block">تكنولوجيا المستقبل</span>
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-10 leading-none">ترجمة <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-[#5AA564] to-gray-900">3D</span> <br /> تحاكي الروح.</h2>
                        <p className="text-xl text-gray-400 font-bold mb-12">أول مترجم افتراضي يستخدم تقنيات الذكاء الاصطناعي لتصوير خشوع المعاني القرآنية عبر لغة الإشارة العالمية.</p>
                        <div className="flex gap-6 justify-end">
                            <div className="w-20 h-20 bg-[#5AA564]/5 rounded-3xl flex items-center justify-center text-[#5AA564]"><Layers size={32} /></div>
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400"><Play size={32} /></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials Section ── */}
            <section className="py-16 max-w-7xl mx-auto px-6">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
                    {[
                        { q: "التطبيق غير حياتي. الآن أفهم الآيات كما لم أفهمها من قبل.", n: "أحمد منصور", r: "مستفيد" },
                        { q: "بساطة الواجهات مذهلة، حتى كبار السن في جمعيتنا يستخدمونه بسهولة.", n: "سارة المهدي", r: "منسقة جمعية" },
                        { q: "القبلة ومواقيت الصلاة بتصميمها الذهبي رائعة جداً.", n: "حمدان الحربي", r: "مستفيد" }
                    ].map((t, i) => (
                        <div key={i} className="break-inside-avoid p-12 bg-white border border-gray-100 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all duration-700">
                            <MessageSquareQuote size={40} className="text-[#5AA564] mb-8 opacity-20" />
                            <p className="text-2xl font-bold text-gray-900 mb-10 leading-relaxed italic">"{t.q}"</p>
                            <div className="flex items-center gap-4 justify-end">
                                <div className="text-right">
                                    <h4 className="font-black">{t.n}</h4>
                                    <p className="text-[10px] font-black text-[#5AA564] uppercase">{t.r}</p>
                                </div>
                                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center font-black">{t.n[0]}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Pricing ── */}
            <section id="pricing" className="py-16 bg-gray-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#5AA564]/10 blur-[200px] rounded-full -mr-40 -mt-40" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
                    <h2 className="text-6xl font-black text-white text-center mb-24">جزء من رسالتنا <br /> <span className="text-[#5AA564]">وبداية رحلتك</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-16 rounded-[4rem] text-right group hover:border-[#5AA564]/40 transition-all duration-700">
                            <h3 className="text-3xl font-black text-white mb-8">باقة الأفراد</h3>
                            <div className="text-8xl font-black text-white mb-4 tracking-tighter">120 <span className="text-lg opacity-40">ر.س / سنوي</span></div>
                            <p className="text-white/40 font-bold mb-12">استمتع بتجربة كاملة لـ 114 سورة مع تحديثات مستمرة.</p>
                            <Link href="/pay?type=single" className="flex items-center justify-center w-full h-20 bg-white text-gray-900 font-black rounded-3xl hover:scale-105 transition-all text-xl">اشترك الآن</Link>
                        </div>
                        <div className="bg-[#5AA564] p-16 rounded-[4rem] text-right shadow-2xl relative overflow-hidden group">
                            <h3 className="text-3xl font-black text-white mb-8">باقة المنظمات</h3>
                            <div className="text-8xl font-black text-white mb-4 tracking-tighter">102 <span className="text-lg opacity-60">ر.س / مستفيد</span></div>
                            <p className="text-white/80 font-bold mb-12">لوحة إدارية للجهات التعليمية والجمعيات الخيرية.</p>
                            <Link href="/pay?type=org" className="flex items-center justify-center w-full h-20 bg-gray-900 text-white font-black rounded-3xl hover:scale-105 transition-all text-xl">تفعيل المجموعات</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Download CTA ── */}
            <section id="download" className="py-16 max-w-7xl mx-auto px-6">
                <div className="bg-white border-2 border-[#5AA564]/20 rounded-[5rem] p-16 md:p-32 relative overflow-hidden text-center flex flex-col items-center">
                    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#5AA564]/5 to-transparent" />
                    <Star size={48} className="text-[#5AA564] mb-8 animate-pulse" />
                    <h2 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter mb-12 uppercase">كن جزءاً من <br /> <span className="text-[#5AA564]">القادم القريب</span></h2>
                    <p className="text-xl md:text-2xl text-gray-400 font-bold max-w-2xl mb-16 px-4">انضم إلى مجتمع مستخدمي أنامل وساهم في نشر تلاوة القرآن الكريم بلغة الإشارة حول العالم.</p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <img src="/mockups/adhkar.png" className="w-20 md:w-32 h-auto opacity-20 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                        <img src="/mockups/prayer.png" className="w-20 md:w-32 h-auto opacity-20 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                        <img src="/mockups/quran_main.png" className="w-20 md:w-32 h-auto opacity-20 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-16 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16">
                    <div className="flex items-center gap-6">
                        <img src="/logo/logo.png" className="w-24 h-24" />
                        <div className="text-right">
                            <span className="text-4xl font-black text-gray-900 tracking-tighter">مصحف أنامل</span>
                            <p className="text-[10px] font-black text-[#5AA564] uppercase tracking-widest mt-1">شركة السبابة الرقمية © 2026</p>
                        </div>
                    </div>
                    <div className="flex gap-10">
                        <Twitter className="text-gray-300 hover:text-[#5AA564] cursor-pointer transition-colors" />
                        <Instagram className="text-gray-300 hover:text-[#5AA564] cursor-pointer transition-colors" />
                        <Youtube className="text-gray-300 hover:text-[#5AA564] cursor-pointer transition-colors" />
                    </div>
                </div>
            </footer>
        </div>
    );
}
