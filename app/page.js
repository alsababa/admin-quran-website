"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Play, Check, Loader2, Download, Layers, Mail, MapPin, Instagram, Twitter, Youtube, Shield, MessageSquareQuote } from 'lucide-react';

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

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5AA564] to-[#D4AF37] z-[2000] origin-right" style={{ scaleX }} />;
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
        try {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) { setShow3D(true); observer.disconnect(); }
            }, { threshold: 0.1 });
            if (section3DRef.current) observer.observe(section3DRef.current);
            return () => observer.disconnect();
        } catch (e) { console.error(e); }
    }, [isMounted]);

    if (!isMounted) return (
        <div className="h-screen bg-white flex items-center justify-center">
            <Loader2 className="animate-spin text-[#5AA564]" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-[#5AA564]/30 overflow-x-hidden" dir="rtl">
            <ScrollProgress />
            <Ornament className="fixed top-40 left-[-50px] text-[#5AA564] z-50" />
            <Ornament className="fixed bottom-40 right-[-50px] text-[#D4AF37] z-50" />

            <nav className="fixed inset-x-0 top-4 z-[100] px-6 pointer-events-none">
                <div className="max-w-7xl mx-auto h-20 bg-white/70 backdrop-blur-3xl border border-white/40 shadow-2xl rounded-[2.5rem] flex items-center justify-between px-10 pointer-events-auto">
                    <div className="flex items-center gap-5">
                        <Link href="/">
                            <div className="relative p-2.5 bg-white shadow-xl rounded-[1.2rem] border border-gray-100">
                                <img src="/logo/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                            </div>
                        </Link>
                        <div className="flex flex-col -space-y-1.5 text-right">
                            <span className="text-2xl font-black text-gray-900 tracking-tight">مصحف أنامل</span>
                            <span className="text-[9px] font-black text-[#5AA564] uppercase tracking-[0.3em]">لخدمة الصم</span>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <a href="#features" className="hover:text-gray-900 transition-all">المميزات</a>
                        <a href="#interface" className="hover:text-gray-900 transition-all">الواجهات</a>
                        <a href="#pricing" className="hover:text-gray-900 transition-all">الباقات</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="px-6 py-2 bg-gray-50 hover:bg-white text-[11px] font-black rounded-xl transition-all hidden sm:block">دخول</Link>
                        <a href="#download" className="px-8 h-12 bg-[#5AA564] text-white text-[11px] font-black rounded-2xl shadow-xl transition-all hover:scale-105">حمّل الآن</a>
                    </div>
                </div>
            </nav>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative pt-32 pb-16 px-6 overflow-hidden bg-white arabic-pattern">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-br from-[#5AA564]/5 via-transparent to-transparent blur-[150px] -mr-80 -mt-80" />
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 pt-10 relative z-10">
                    <div className="flex-1 text-right order-2 lg:order-1 max-w-md">
                        <div className="inline-flex gap-3 px-6 py-3 bg-white border border-gray-100 rounded-full shadow-sm mb-8">
                            <div className="w-2 h-2 rounded-full bg-[#5AA564] animate-pulse" />
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-tight">المشروع الأول من نوعه عالمياً</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[0.85] mb-8 tracking-tighter">
                            تلاوة <br /> <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#5AA564] to-[#4A8F53]">بأنامل تفيض</span> <br /> إيماناً.
                        </h1>
                        <div className="relative group/vid mb-10 w-fit">
                            <div className="absolute -inset-4 bg-[#5AA564]/10 blur-xl rounded-full animate-pulse" />
                            <a href="#demo" className="relative flex items-center gap-4 p-2 pl-6 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-xl transition-all font-black text-xs">
                                <div className="w-12 h-12 bg-[#5AA564] text-white rounded-full flex items-center justify-center shadow-lg"><Play size={18} fill="currentColor" /></div>
                                <span>شاهد العرض المرئي للمشروع</span>
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-6 mt-8">
                            <a href="#download" className="px-10 h-16 bg-gray-900 text-white font-black rounded-2xl flex items-center gap-3 transition-all hover:scale-105 shadow-xl">
                                <Download size={18} /> تحميل التطبيق مجاناً
                            </a>
                        </div>
                    </div>
                    <div className="flex-1 relative order-1 lg:order-2">
                        <div className="relative z-20 w-full max-w-[450px] mx-auto p-4 bg-white/20 backdrop-blur-3xl border border-white/40 rounded-[4rem] shadow-2xl">
                            <img src="/mockups/quran_main.png" alt="App" className="w-full rounded-[3rem]" />
                        </div>
                    </div>
                </div>
            </motion.section>

            <Reveal>
                <section id="features" className="py-12 bg-gray-50/50 arabic-pattern">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['القرآن كاملاً', 'القبلة الذكية', 'خدمة الجهات'].map((title, i) => (
                            <div key={i} className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all text-right group">
                                <div className="w-16 h-16 bg-[#5AA564]/5 text-[#5AA564] rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform"><Layers size={32} /></div>
                                <h3 className="text-2xl font-black mb-4">{title}</h3>
                                <p className="text-gray-400 font-bold">خدمة متكاملة مصممة بأحدث المعايير التقنية لتناسب لغة الإشارة.</p>
                            </div>
                        ))}
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <section ref={section3DRef} id="demo" className="py-16 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="relative h-[650px] bg-[#0A0D1A] rounded-[5rem] overflow-hidden shadow-2xl">
                            {show3D && <iframe src="/3viewer/index.html" className="w-full h-full border-none" onLoad={() => setIs3DLoading(false)} />}
                            {is3DLoading && <div className="absolute inset-0 flex items-center justify-center text-white font-black animate-pulse">جاري تشغيل المعالج...</div>}
                        </div>
                        <div className="text-right">
                            <h2 className="text-5xl lg:text-7xl font-black mb-10 leading-none">ترجمة <span className="text-[#5AA564]">3D</span> <br /> تحاكي الروح.</h2>
                            <p className="text-xl text-gray-400 font-bold mb-12">أول مترجم افتراضي يحاكي خشوع المعاني القرآنية عبر تقنيات Motion Capture الاحترافية.</p>
                            <div className="flex gap-6 justify-end">
                                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center"><Layers size={32} /></div>
                                <div className="w-20 h-20 bg-[#5AA564]/10 rounded-3xl flex items-center justify-center text-[#5AA564]"><Play size={32} /></div>
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <section id="interface" className="py-16 bg-white/50">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[350px]">
                        <div className="md:col-span-12 lg:col-span-7 md:row-span-2 relative group overflow-hidden bg-slate-50 rounded-[4rem] border border-gray-100 p-12 text-right">
                            <h3 className="text-4xl font-black mb-6">مصحف الصم التفاعلي</h3>
                            <p className="text-gray-400 font-bold text-lg mb-8">ترجمة 114 سورة عبر مترجم 3D عالي الدقة يرافق النص القرآني.</p>
                            <img src="/mockups/quran_main.png" className="absolute bottom-[-100px] left-[-40px] w-full max-w-[420px] rounded-[3rem] shadow-2xl hidden md:block" />
                        </div>
                        <div className="md:col-span-12 lg:col-span-5 md:row-span-2 relative group overflow-hidden bg-white border border-gray-100 rounded-[4rem] p-12 text-center flex flex-col items-center">
                            <h3 className="text-3xl font-black mb-4">القبلة والأوقات</h3>
                            <p className="text-gray-400 font-bold mb-10">تحديد دقيق لاتجاه الكعبة ومواقيت الصلاة حسب موقعك.</p>
                            <div className="w-full space-y-3">
                                {['الفجر - 05:15 AM', 'الظهر - 12:30 PM', 'العصر - 03:45 PM'].map((p, i) => (
                                    <div key={i} className="px-6 py-4 bg-gray-50 rounded-2xl font-black text-gray-900 border border-gray-100">{p}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            <section className="py-16 bg-[#0A0D1A] overflow-hidden">
                <div className="relative flex overflow-hidden py-10">
                    <div className="flex gap-12 whitespace-nowrap min-w-full px-12">
                        {["adhkar.png", "quran_main.png", "prayer.png", "adhkar.png"].map((img, i) => (
                            <div key={i} className="w-[300px] h-[600px] flex-shrink-0 bg-white rounded-[3.5rem] p-3 shadow-2xl overflow-hidden relative group">
                                <img src={`/mockups/${img}`} className="w-full h-full object-cover rounded-[3rem] group-hover:scale-110 transition-all duration-1000" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Reveal>
                <section className="py-16 max-w-7xl mx-auto px-6">
                    <div className="bg-gray-900 text-white rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#5AA564] blur-[150px] opacity-30 rounded-full" />
                        <div className="relative z-10 text-right">
                            <h2 className="text-4xl font-black mb-6">رؤيتنا لا تعرف حدوداً</h2>
                            <p className="text-gray-400 font-medium mb-8 text-lg">بجهود دؤوبة نسعى لبناء مجتمع رقمي شامل يعزز من قدرة الصم على الوصول للقرآن الكريم بيسر وسهولة.</p>
                            <div className="flex items-center gap-4 border-t border-gray-800 pt-8 mt-8 justify-end"><Shield className="text-[#5AA564]" size={40} /></div>
                        </div>
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <section className="py-16 max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-black text-gray-900 mb-16">أصوات من القلب</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[{ n: "محمد عبدالله", q: "المصحف غيّر حياتي." }, { n: "فاطمة أحمد", q: "أفضل تطبيق لخدمة الصم." }, { n: "يوسف خالد", q: "دقة في لغة الإشارة مذهلة." }].map((t, i) => (
                            <div key={i} className="p-10 bg-white border border-gray-100 rounded-[3rem] text-right shadow-sm hover:shadow-2xl transition-all">
                                <MessageSquareQuote size={32} className="text-[#5AA564] mb-6 opacity-20 mx-auto" />
                                <p className="text-xl font-bold text-gray-600 mb-8">"{t.q}"</p>
                                <h4 className="font-black text-gray-900">{t.n}</h4>
                            </div>
                        ))}
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <section id="pricing" className="py-16 bg-gray-900 mx-6 rounded-[5rem] relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                        <h2 className="text-5xl font-black text-white mb-16">باقات تناسب الجميع</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-16 rounded-[4rem] text-right">
                                <h3 className="text-2xl font-black text-white mb-6">باقة الأفراد</h3>
                                <div className="text-8xl font-black text-white mb-10 tracking-tighter">120 <span className="text-xl font-bold text-white/40">ر.س</span></div>
                                <Link href="/pay?type=single" className="flex items-center justify-center w-full h-16 bg-white text-gray-900 font-black rounded-2xl">اشترك الآن</Link>
                            </div>
                            <div className="bg-[#5AA564] p-16 rounded-[4rem] text-right shadow-2xl">
                                <h3 className="text-2xl font-black text-white mb-6">باقة الجمعيات</h3>
                                <div className="text-8xl font-black text-white mb-10 tracking-tighter">102 <span className="text-xl font-bold text-white/60">ر.س</span></div>
                                <Link href="/pay?type=org" className="flex items-center justify-center w-full h-16 bg-gray-900 text-white font-black rounded-2xl">شراء للمجموعات</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <section id="download" className="py-24 max-w-7xl mx-auto px-6">
                    <div className="bg-[#5AA564] rounded-[3.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
                        <h2 className="text-4xl md:text-6xl font-black mb-8">ابدأ رحلتك الإيمانية اليوم</h2>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-14">
                            <div className="px-10 h-16 bg-white text-[#5AA564] rounded-2xl flex items-center justify-center gap-3 font-black cursor-pointer">App Store</div>
                            <div className="px-10 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center gap-3 font-black cursor-pointer">Google Play</div>
                        </div>
                    </div>
                </section>
            </Reveal>

            <footer className="py-20 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2 text-right">
                        <div className="flex items-center gap-4 mb-8 justify-end">
                            <div className="text-right">
                                <div className="font-black text-3xl text-gray-900">مصحف أنامل</div>
                                <div className="text-[10px] font-bold text-gray-400">إحدى مبادرات شركة السبابة الرقمية</div>
                            </div>
                            <img src="/logo/logo.png" className="w-16 h-16" />
                        </div>
                        <p className="text-gray-400 font-bold text-lg mb-8 leading-relaxed text-right">أول مبادرة عالمية لترجمة القرآن الكريم كاملاً لخدمة فئة الصم حول العالم الإسلامي بمنصة تفاعلية 3D.</p>
                        <div className="flex gap-4 justify-end">
                            {[Twitter, Instagram, Youtube].map((Icon, i) => (
                                <div key={i} className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 cursor-pointer"><Icon size={20} /></div>
                            ))}
                        </div>
                    </div>
                    <div className="text-right">
                        <h4 className="font-black text-gray-900 mb-8 lowercase tracking-widest text-xs">روابط سريعة</h4>
                        <ul className="space-y-4 font-bold text-gray-400">
                            <li>عن التطبيق</li><li>خريطة السور</li><li>سياسة الخصوصية</li>
                        </ul>
                    </div>
                    <div className="text-right">
                        <h4 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-xs">تواصل معنا</h4>
                        <ul className="space-y-6 font-bold text-gray-400">
                            <li className="flex items-center gap-3 justify-end">info@alsababah.com <Mail size={18} /></li>
                            <li className="flex items-center gap-3 justify-end shadow-none uppercase">Saudi Arabia <MapPin size={18} /></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}
