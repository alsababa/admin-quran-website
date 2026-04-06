"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HandMetal, Smartphone, Accessibility, Star, Users, Video, ChevronLeft, Play, Globe, Shield, CheckCircle2, BookOpen, Compass, Check, ArrowLeft, Lightbulb, MessageSquareQuote, Loader2 } from 'lucide-react';


const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
        <div className="h-14 w-14 rounded-2xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-sm font-medium text-gray-500 leading-relaxed">{desc}</p>
    </div>
);

const StatBadge = ({ value, label }) => (
    <div className="text-center group p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#14B8A6]/5 rounded-bl-full pointer-events-none" />
        <p className="text-4xl md:text-5xl font-extrabold text-[#14B8A6] mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">{value}</p>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest relative z-10">{label}</p>
    </div>
);

const StepIndicator = ({ number, title, desc }) => (
    <div className="relative pl-0 md:pl-10 text-center md:text-right flex flex-col md:flex-row items-center md:items-start gap-6 group">
        <div className="flex-shrink-0 w-16 h-16 bg-white border-4 border-[#F8FAFC] shadow-xl rounded-full flex items-center justify-center text-xl font-black text-[#14B8A6] z-10 relative">
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

    useEffect(() => {
        try {
            setIsMounted(true);
        } catch (e) {
            setRuntimeError(e);
        }
    }, []);

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
                    style={{ padding: '12px 24px', background: '#14B8A6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    if (!isMounted) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F8FAFC' }}>
                <div className="animate-spin text-[#14B8A6]">
                    <Loader2 size={40} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-[#14B8A6]/20" dir="rtl">

            {/* ── Navbar ── */}
            <nav className="fixed inset-x-0 top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative group cursor-pointer"
                        >
                            <div className="absolute -inset-2 bg-gradient-to-tr from-[#14B8A6]/30 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />
                            <div className="relative p-1.5 bg-white border border-gray-100 shadow-sm rounded-xl transition-transform">
                                <img src="/logo/logo.png" alt="مصحف أنامل للصم" className="w-10 h-10 object-contain" />
                            </div>
                        </motion.div>
                        <div className="flex flex-col -space-y-1">
                            <span className="text-xl font-black text-gray-900 tracking-tight hidden sm:block">مصحف أنامل</span>
                            <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-[0.2em] hidden sm:block text-right">لخدمة الصم</span>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-10 text-[13px] font-black uppercase tracking-widest text-gray-400">
                        <a href="#features" className="hover:text-[#14B8A6] transition-colors relative group">
                            المميزات
                            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#14B8A6] group-hover:w-full transition-all" />
                        </a>
                        <a href="#interface" className="hover:text-[#14B8A6] transition-colors relative group">
                            واجهة التطبيق
                            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#14B8A6] group-hover:w-full transition-all" />
                        </a>
                        <a href="#process" className="hover:text-[#14B8A6] transition-colors relative group">
                            كيف يعمل؟
                            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#14B8A6] group-hover:w-full transition-all" />
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
                className="relative pt-44 pb-32 px-6 mx-auto overflow-hidden bg-white"
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
                        className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-gradient-to-tr from-[#14B8A6]/10 to-blue-400/5 blur-[120px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.2, 0.4, 0.2],
                            y: [0, -40, 0]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-20 right-[-100px] w-[500px] h-[500px] bg-gradient-to-br from-[#0D9488]/10 to-[#14B8A6]/5 blur-[100px] rounded-full"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-l from-[#14B8A6]/5 to-transparent border border-[#14B8A6]/10 shadow-sm rounded-full mb-10"
                    >
                        <div className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
                        <span className="text-[10px] font-black text-[#14B8A6] uppercase tracking-[0.25em]">الأول من نوعه في العالم الإسلامي</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter text-gray-900 leading-[1] mb-8">
                        تلاوة وفهم القرآن <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#14B8A6] to-[#0D9488]">بأنامل الصم</span> بيسر.
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 font-bold mb-14 max-w-2xl mx-auto leading-relaxed">
                        منصة <span className="text-gray-900">مصحف أنامل</span> هي نافذتك الشاملة لتعلم وتدبر كتاب الله، مع مكتبة تفاعلية متكاملة مصممة خصيصاً للصم وضعاف السمع بجودة فائقة.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mb-28">
                        <a href="#download" className="w-full sm:w-auto flex items-center justify-center gap-3 h-16 px-12 bg-gray-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all hover:scale-105 shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95">
                            <Smartphone size={18} strokeWidth={2.5} />
                            تحميل التطبيق مجاناً
                        </a>
                        <a href="#demo" className="w-full sm:w-auto flex items-center justify-center gap-3 h-16 px-12 bg-white text-gray-900 hover:bg-gray-50 border border-gray-100 font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-sm active:scale-95">
                            <Play size={16} className="fill-gray-900" />
                            كيف يعمل؟
                        </a>
                    </div>
                </div>

                {/* Video Presentation with Professional Frame */}
                <div id="demo" className="relative mx-auto max-w-5xl px-4">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14B8A6]/10 via-transparent to-transparent blur-3xl -z-10" />
                    <div className="relative rounded-[3rem] overflow-hidden bg-black shadow-[0_40px_100px_rgba(0,0,0,0.15)] border-[12px] border-white group transition-transform duration-700">
                        <div className="aspect-video relative bg-gray-900 flex items-center justify-center overflow-hidden">
                            <video
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                autoPlay
                                muted
                                loop
                                playsInline
                                poster="/logo/app_assets_images_indexpart.png"
                            >
                                <source src="/vedio/Founding%20Day.mp4" type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* ── Logos/Trusted By ── */}
            <section className="bg-gray-50/50 py-16 border-y border-gray-100/50 flex flex-col items-center">
                <div className="max-w-7xl mx-auto text-center px-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">شراكات استراتيجية موثوقة</p>
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        {['شركة السبابة الرقمية', 'مصحف تبيان', 'جمعية لأجلهم'].map((p, i) => (
                            <span key={i} className="text-sm font-black text-gray-300">{p}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── App Interface Showcase (Bento Grid) ── */}
            <section id="interface" className="relative py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-full mb-6"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
                            <span className="text-[10px] font-black text-[#14B8A6] uppercase tracking-[0.2em]">واجهة التطبيق</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-6">مصمم ليكون بين يديك دائماً</h2>
                        <p className="text-gray-400 font-bold max-w-2xl mx-auto text-lg">
                            تجربة تصفح بديهية وسريعة، بنيت بدقة لتناسب احتياجات الصم وضعاف السمع بكل مرونة.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
                        {/* Bento Box 1: Azkar (Large) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="md:col-span-8 md:row-span-2 relative group overflow-hidden bg-slate-50 rounded-[3rem] border border-gray-100 p-12 flex flex-col items-start text-right transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)]"
                        >
                            <div className="relative z-10 max-w-md">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#14B8A6] mb-6 border border-gray-50">
                                    <Globe size={20} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-4">ترجمة الأذكار</h3>
                                <p className="text-gray-400 font-bold text-base leading-relaxed">أذكار الصباح والمساء وأذكار الصلاة مسجلة بدقة عالية بلغة الإشارة ليسهل حفظها وترديدها يومياً.</p>
                            </div>
                            <div className="absolute left-0 bottom-[-10%] w-[60%] group-hover:scale-105 transition-transform duration-700 pointer-events-none">
                                <img src="/logo/app_assets_images_azkartranslate.png" alt="Azkar" className="w-full h-auto drop-shadow-2xl brightness-105" />
                            </div>
                        </motion.div>

                        {/* Bento Box 2: Location (Vertical) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-4 md:row-span-2 relative group overflow-hidden bg-gray-900 rounded-[3rem] p-12 flex flex-col items-center text-center shadow-2xl shadow-gray-900/20"
                        >
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#14B8A6]/20 to-transparent opacity-50" />
                            <div className="relative z-10 mt-auto">
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                                    <Compass size={24} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4">القبلة والصلاة</h3>
                                <p className="text-white/40 font-bold text-sm mb-10 leading-relaxed">مواقيت وتحديد اتجاه مرئي يعتمد على الموقع الجغرافي.</p>
                                <img src="/logo/app_assets_images_indexitemlocationmecca.png" alt="Mecca" className="w-auto h-48 mx-auto drop-shadow-3xl transform group-hover:-translate-y-4 transition-transform duration-700" />
                            </div>
                        </motion.div>

                        {/* Bento Box 3: Quran (Primary) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-6 md:row-span-2 relative group overflow-hidden bg-[#14B8A6] rounded-[3rem] p-12 flex flex-col items-start gap-10 hover:bg-[#0D9488] transition-colors duration-500 shadow-2xl shadow-[#14B8A6]/20"
                        >
                            <div className="relative z-10 w-full">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center text-white mb-6">
                                    <BookOpen size={20} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4">القرآن كاملاً</h3>
                                <p className="text-white/70 font-bold text-base max-w-xs transition-colors group-hover:text-white/90">30 جزءاً مسجلاً وحاضراً للتصفح المُيسر بنقرة واحدة.</p>
                            </div>
                            <div className="mt-auto w-full flex justify-end">
                                <img src="/logo/app_assets_images_indexpart.png" className="w-auto h-64 object-contain drop-shadow-3xl transform group-hover:-translate-y-4 transition-transform duration-700" />
                            </div>
                        </motion.div>

                        {/* Bento Box 4: Success (Wide) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-6 md:row-span-2 relative group overflow-hidden bg-slate-100 rounded-[3rem] border border-gray-100 p-12 flex flex-col justify-center items-center text-center transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)]"
                        >
                            <div className="relative z-10 mb-10">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#14B8A6] mb-6 mx-auto">
                                    <Check size={20} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-3">سهولة المتابعة</h3>
                                <p className="text-gray-400 font-bold text-base max-w-sm">تتبع تقدمك في الحفظ والتلاوة مع واجهات ذكية ومريحة للرؤية.</p>
                            </div>
                            <div className="flex gap-6 items-center">
                                <img src="/logo/app_assets_images_accept.png" className="w-auto h-44 drop-shadow-xl transform group-hover:-translate-y-2 transition-transform duration-500" />
                                <img src="/logo/app_assets_images_bottombar_prayer.png" className="w-auto h-44 drop-shadow-xl transform group-hover:translate-y-2 transition-transform duration-500 delay-75" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>



            {/* ── How It Works (Process) ── */}
            <section id="process" className="py-24 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-sm font-extrabold text-[#14B8A6] bg-[#14B8A6]/10 px-4 py-1.5 rounded-full inline-block mb-4">الخطوات</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-8">عملية التعلم بسيطة جداً</h2>

                        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[3.5rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent mt-12">
                            <StepIndicator number="1" title="حمل التطبيق" desc="ابحث عن 'مصحف أنامل للصم' في متجر آبل أو جوجل بلاي وقم بتثبيته مجاناً." />
                            <StepIndicator number="2" title="اختر السورة" desc="تصفح قائمة السور المنسقة بشكل رائع واختر الجزء الذي ترغب بقراءته أو حفظه." />
                            <StepIndicator number="3" title="شاهد الآيات" desc="شاهد ترجمة كل آية بلغة الإشارة بشكل مرئي وعالي الدقة لتفهم المعنى الصحيح." />
                        </div>
                    </div>

                    <div className="relative flex justify-center lg:justify-end mt-10 lg:mt-0">
                        <div className="w-[300px] bg-white rounded-[2.5rem] p-2 shadow-2xl relative border-8 border-gray-900 overflow-hidden">
                            <img src="/logo/app_assets_images_indexpart.png" className="w-full h-auto object-contain rounded-2xl border border-gray-100" />
                            <div className="absolute top-0 inset-x-0 h-6 flex justify-center">
                                <div className="w-1/3 h-5 bg-gray-900 rounded-b-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── About The Initiative (Vision & Mission) ── */}
            <section className="py-24 max-w-7xl mx-auto px-6 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#14B8A6]/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="bg-gray-900 text-white rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#14B8A6] blur-[150px] opacity-30 rounded-full" />

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-sm font-extrabold text-[#14B8A6] tracking-widest uppercase mb-4 block">عن المبادرة</span>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">رؤيتنا لا تعرف حدوداً والصم في قلب الاهتمام</h2>
                            <p className="text-gray-400 font-medium leading-relaxed mb-8 text-lg">
                                بجهود دؤوبة، وتحت مظلة <strong className="text-white">"شركة السبابة الرقمية"</strong>، نسعى لبناء مجتمع رقمي شامل يعزز من قدرة الصم وضعاف السمع على الوصول إلى القرآن الكريم وفهمه بيسر وسهولة، معتمدين على أحدث تقنيات العرض المرئي وفريق متخصص لضمان دقة لغة الإشارة المعتمدة.
                            </p>
                            <div className="flex items-center gap-4 border-t border-gray-800 pt-8 mt-8">
                                <div className="w-14 h-14 bg-[#14B8A6]/20 rounded-2xl flex items-center justify-center text-[#14B8A6]">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">محتوى موثوق ومراجع</h4>
                                    <p className="text-gray-400 text-sm">من قبل نخبة من علماء الشريعة وخبراء الإشارة.</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 relative">
                            {/* Decorative blocks to replace images, maintaining the SaaS aesthetic */}
                            <div className="bg-gray-800 rounded-3xl p-8 transform translate-y-8 flex flex-col justify-center items-center text-center shadow-lg border border-gray-700 hover:-translate-y-2 transition-transform duration-500">
                                <Users size={40} className="text-[#14B8A6] mb-4" />
                                <h3 className="text-2xl font-black text-white mb-2">مجتمع مترابط</h3>
                                <p className="text-gray-400 text-sm">شراكات ممتدة لخدمة المستفيدين</p>
                            </div>
                            <div className="bg-gray-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-lg border border-gray-700 hover:-translate-y-2 transition-transform duration-500">
                                <Globe size={40} className="text-[#14B8A6] mb-4" />
                                <h3 className="text-2xl font-black text-white mb-2">معايير عالمية</h3>
                                <p className="text-gray-400 text-sm">أداء يفوق التطلعات وشمولية رقمية</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <MessageSquareQuote className="mx-auto text-[#14B8A6] mb-4 opacity-50" size={48} />
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">رأي المستفيدين</h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg">صُمم هذا العمل ليلمس قلوب فئة غالية علينا وتجاربهم تسرد النجاح.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Dummy Testimonial 1 */}
                    <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-shadow">
                        <div className="flex gap-1 text-[#14B8A6] mb-4">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed mb-6">"التطبيق سهل عليّ فهم القرآن بطريقة لم أكن أتصورها من قبل. الترجمة دقيقة جداً والصورة واضحة."</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400">م</div>
                            <div>
                                <h4 className="font-extrabold text-gray-900 text-sm">محمد عبدالله</h4>
                                <p className="text-xs text-gray-500">مستخدم منتظم</p>
                            </div>
                        </div>
                    </div>
                    {/* Dummy Testimonial 2 */}
                    <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-shadow">
                        <div className="flex gap-1 text-[#14B8A6] mb-4">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed mb-6">"أفضل تطبيق رأيته يخدم الصم في العالم العربي، الألوان مريحة للعين وتقسيم السور رائع جداً."</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400">س</div>
                            <div>
                                <h4 className="font-extrabold text-gray-900 text-sm">سالم عبدالرحمن</h4>
                                <p className="text-xs text-gray-500">معلم لغة إشارة</p>
                            </div>
                        </div>
                    </div>
                    {/* Dummy Testimonial 3 */}
                    <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-shadow">
                        <div className="flex gap-1 text-[#14B8A6] mb-4">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed mb-6">"إمكانية تحميل الفيديوهات واستخدامها بدون إنترنت كانت ميزة غير متوقعة وأنقذتني في كثير من الأوقات."</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#14B8A6]/10 rounded-full flex items-center justify-center font-bold text-[#14B8A6]">ف</div>
                            <div>
                                <h4 className="font-extrabold text-gray-900 text-sm">فاطمة علي</h4>
                                <p className="text-xs text-gray-500">مشرفة تعليمية</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pricing & Plans (Entity Focus) ── */}
            <section id="pricing" className="py-24 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-full mb-6"
                        >
                            <Shield size={14} className="text-[#14B8A6]" />
                            <span className="text-[10px] font-black text-[#14B8A6] uppercase tracking-[0.2em]">الخطط والاشتراكات</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">اختر الباقة المناسبة لك</h2>
                        <p className="text-gray-400 font-bold max-w-2xl mx-auto text-lg">
                            دعم مستمر وتطوير دائم لخدمة فئة غالية علينا. اختر باقتك وابدأ الرحلة اليوم.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Individual Plan */}
                        <div className="bg-white border-2 border-gray-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[4rem] -z-10 transition-colors group-hover:bg-[#14B8A6]/5" />
                            <h3 className="text-2xl font-black text-gray-900 mb-2">باقة الأفراد</h3>
                            <p className="text-gray-400 font-bold text-sm mb-8">للاستخدام الشخصي على جهاز واحد</p>

                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-5xl font-black text-gray-900">120</span>
                                <span className="text-lg font-bold text-gray-400">ر.س / سنوياً</span>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {['وصول كامل لـ 114 سورة', 'ترجمة إشارة احترافية', 'أذكار ومواقيت صلاة', 'دعم فني مباشر'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                        <CheckCircle2 size={18} className="text-[#14B8A6]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="bg-gray-50 rounded-2xl p-4 text-center border border-dashed border-gray-200">
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">الاشتراك يتم من داخل التطبيق مباشرة</p>
                            </div>
                        </div>

                        {/* Organization Plan */}
                        <div className="bg-gray-900 border-4 border-[#14B8A6] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group transform md:-translate-y-4">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#14B8A6]/20 rounded-bl-[5rem] -z-10" />
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#14B8A6] text-white text-[9px] font-black uppercase tracking-widest rounded-full mb-4">
                                الأكثر توفيراً للجهات
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">باقة الجهات والمنظمات</h3>
                            <p className="text-white/40 font-bold text-sm mb-8">حلول متكاملة للجمعيات والمؤسسات</p>

                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-xl font-bold text-white/50 line-through">120</span>
                                <span className="text-5xl font-black text-[#14B8A6]">102</span>
                                <span className="text-lg font-bold text-white/50">ر.س / للمستخدم</span>
                            </div>
                            <p className="text-[10px] font-bold text-[#14B8A6] mb-8 uppercase tracking-widest">* عند شراء 50 رخصة أو أكثر</p>

                            <ul className="space-y-4 mb-10">
                                {[
                                    'لوحة تحكم إدارية خاصة',
                                    'توليد أكواد تفعيل فورية',
                                    'إدارة المستخدمين والأجهزة',
                                    'خصومات تصل إلى 15%',
                                    'تقارير أداء ومتابعة'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/80">
                                        <CheckCircle2 size={18} className="text-[#14B8A6]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/pay?type=org" className="flex items-center justify-center gap-3 w-full h-14 bg-[#14B8A6] hover:bg-[#0D9488] text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-[#14B8A6]/20 active:scale-95">
                                شراء للجهات الآن
                                <ArrowLeft size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Bulk pricing note */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-400 font-bold text-sm">
                            تحتاج لأكثر من 1000 رخصة؟ <a href="mailto:sales@alsababah.com" className="text-[#14B8A6] hover:underline">تواصل مع قسم المبيعات</a> للحصول على عرض سعر مخصص بخصم 15%.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="py-24 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">تصميم يُركز على المضمون</h2>
                        <p className="text-gray-500 font-medium max-w-2xl mx-auto">
                            ابتعدنا عن التعقيد، لنقدم تجربة سهلة وسريعة تمكنك من التركيز على حفظ وتلاوة كتاب الله.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard icon={<HandMetal size={28} strokeWidth={2} />} title="لغة الإشارة المعتمدة" desc="فيديوهات دقيقة تم مراجعتها لضمان ترجمة معاني الآيات بدقة متناهية وبأسلوب واضح." />
                        <FeatureCard icon={<Video size={28} strokeWidth={2} />} title="مكتبة فيديو HD" desc="أكثر من 6000 فيديو عالي الدقة (HD) تم تصويرها باحترافية لتجربة بصرية مريحة للعينين." />
                        <FeatureCard icon={<Globe size={28} strokeWidth={2} />} title="بدون إنترنت" desc="حمل المقاطع التي تود مشاهدتها واستخدم المنصة بالكامل أوفلاين كأنك متصل تماماً." />
                    </div>
                </div>
            </section>


            {/* ── Stats ── */}
            <section className="bg-white border-y border-gray-100 py-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatBadge value="+10K" label="مستفيد نشط" />
                    <StatBadge value="114" label="سورة تفاعلية" />
                    <StatBadge value="100%" label="دقة الترجمة" />
                    <StatBadge value="4.9" label="تقييم المتجر" />
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="py-24 max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <Lightbulb className="mx-auto text-[#14B8A6] mb-4 opacity-50" size={40} />
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">الأسئلة الشائعة</h2>
                </div>

                <div className="space-y-4">
                    {/* FAQ Item 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex gap-4 items-start"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] shrink-0">
                            <Users size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">هل التطبيق موجه فقط للصم وضعاف السمع؟</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">نعم، تم تصميمه خصيصاً ليناسب احتياجات لغة الإشارة الخاصة بالصم وضعاف السمع، ولكن يمكن لأي شخص راغب في تعلم لغة الإشارة للقرآن استخدامه.</p>
                        </div>
                    </motion.div>
                    {/* FAQ Item 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex gap-4 items-start"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] shrink-0">
                            <Globe size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">هل أحتاج إلى الاتصال بالإنترنت دائماً؟</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">في البداية نعم لتحميل الفيديوهات والسور، ولكن بإمكانك حفظها في جهازك ومشاهدتها في أي وقت وأي مكان دون إنترنت.</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Clean CTA ── */}
            <section id="download" className="py-28 relative overflow-hidden bg-gray-50">
                <div className="absolute left-1/2 -top-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#14B8A6]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="w-24 h-24 bg-white shadow-xl shadow-gray-200/50 rounded-3xl flex items-center justify-center mx-auto mb-10 overflow-hidden">
                        <img src="/logo/logo.png" className="w-14 h-14 object-contain hover:scale-110 transition-transform duration-500" />
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
            <footer className="bg-white py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <img src="/logo/logo.png" className="w-10 h-10 object-contain" />
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
            <a href="#" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:-translate-y-1 transition-all group">
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
