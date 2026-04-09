"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Clock, MapPin, ArrowRight, Settings, Bell, Star, Sun, Moon, CloudSun, Sunset, CloudMoon, Loader2 } from 'lucide-react';

const PrayerCard = ({ name, time, icon, isActive, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className={`relative overflow-hidden group p-6 rounded-[2rem] border transition-all duration-500 ${
            isActive 
            ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8960C] text-white border-transparent shadow-[0_20px_40px_rgba(212,175,55,0.3)] scale-[1.02]' 
            : 'bg-white border-gray-100 text-gray-900 hover:border-[#D4AF37]/30 hover:shadow-xl'
        }`}
    >
        <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isActive ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-[#D4AF37]/10 text-[#D4AF37]'
                }`}>
                    {icon}
                </div>
                <div>
                    <h3 className={`text-xl font-black ${isActive ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                    <p className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-white/70' : 'text-gray-400'}`}>صلاة {name}</p>
                </div>
            </div>
            <div className="text-right">
                <span className={`text-2xl font-black tracking-tighter ${isActive ? 'text-white' : 'text-gray-900'}`}>{time}</span>
            </div>
        </div>
        {isActive && (
            <motion.div 
                layoutId="active-glow"
                className="absolute inset-0 bg-white/10 blur-xl scale-150 pointer-events-none"
            />
        )}
    </motion.div>
);

export default function QiblaPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!isMounted) return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
            <Loader2 className="text-[#D4AF37] animate-spin" size={48} />
        </div>
    );

    const prayerTimes = [
        { name: 'الفجر', time: '05:15 AM', icon: <Sunset size={24} />, isActive: false },
        { name: 'الشروق', time: '06:38 AM', icon: <Sun size={24} />, isActive: false },
        { name: 'الظهر', time: '12:30 PM', icon: <CloudSun size={24} />, isActive: true },
        { name: 'العصر', time: '03:45 PM', icon: <Sun size={24} />, isActive: false },
        { name: 'المغرب', time: '06:12 PM', icon: <Sunset size={24} />, isActive: false },
        { name: 'العشاء', time: '07:30 PM', icon: <CloudMoon size={24} />, isActive: false },
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans selection:bg-[#D4AF37]/20" dir="rtl">
            {/* ── Background Decorative Elements ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#5AA564]/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                
                {/* ── Header ── */}
                <header className="flex items-center justify-between mb-12">
                    <Link href="/" className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-[#D4AF37] transition-all hover:shadow-lg group">
                        <ArrowRight size={20} className="group-hover:translate-x-1" />
                        <span className="text-sm font-black">العودة للرئيسية</span>
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#D4AF37] cursor-pointer transition-all shadow-sm">
                            <Settings size={22} />
                        </div>
                        <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#D4AF37] cursor-pointer transition-all shadow-sm">
                            <Bell size={22} />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* ── Left Column: Compass & Info ── */}
                    <div className="lg:col-span-7 flex flex-col items-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-16 w-full"
                        >
                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-gray-100 rounded-full shadow-sm mb-6">
                                <MapPin size={16} className="text-[#D4AF37]" />
                                <span className="text-xs font-black text-gray-500">الرياض، المملكة العربية السعودية</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-4">مواقيت الصلاة <span className="text-[#D4AF37]">&</span> القبلة</h1>
                            <p className="text-gray-400 font-bold text-lg max-w-lg mx-auto leading-relaxed">تحديد دقيق لاتجاه الكعبة المشرفة ومواعيد الصلاة اليومية حسب موقعك الجغرافي.</p>
                        </motion.div>

                        {/* ── The Golden Compass ── */}
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, rotate: -45 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                            className="relative w-full max-w-[500px] aspect-square flex items-center justify-center group"
                        >
                            {/* Decorative Outer Rings */}
                            <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-full blur-3xl group-hover:bg-[#D4AF37]/10 transition-colors duration-1000" />
                            <div className="absolute inset-[-5%] border-[1.5px] border-dashed border-[#D4AF37]/20 rounded-full animate-[spin_60s_linear_infinite]" />
                            <div className="absolute inset-[-15%] border border-[#D4AF37]/5 rounded-full" />
                            
                            {/* Main Compass Body */}
                            <div className="relative w-[85%] h-[85%] bg-white rounded-full shadow-[0_50px_100px_rgba(212,175,55,0.15)] border-8 border-white p-2">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent rounded-full" />
                                
                                {/* Compass Dial Text (N, E, S, W) - Simple Version */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-between items-center text-[#D4AF37]/40 font-black text-xl">
                                    <span>N</span>
                                    <span>S</span>
                                </div>
                                <div className="absolute inset-0 p-8 flex justify-between items-center text-[#D4AF37]/40 font-black text-xl">
                                    <span>W</span>
                                    <span>E</span>
                                </div>

                                {/* The Compass Image / Design */}
                                <div className="w-full h-full rounded-full border-[1.5px] border-[#D4AF37]/10 flex items-center justify-center relative overflow-hidden">
                                     {/* Mocking the detailed design with CSS/React icons */}
                                     <div className="absolute inset-4 rounded-full border border-[#D4AF37]/5" />
                                     <div className="absolute inset-10 rounded-full border border-[#D4AF37]/10" />
                                     
                                     {/* The Needle */}
                                     <motion.div 
                                        animate={{ rotate: [0, 5, -2, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative w-full h-full flex items-center justify-center"
                                     >
                                         {/* Qibla Direction Line */}
                                         <div className="absolute top-[10%] flex flex-col items-center gap-2">
                                             <div className="w-12 h-12 bg-white shadow-xl border border-gray-100 rounded-xl flex items-center justify-center mb-2">
                                                 <img src="/logo/logo.png" alt="Makkah" className="w-8 h-8 object-contain" />
                                             </div>
                                             <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Qibla Direction</span>
                                         </div>

                                         <div className="w-1.5 h-[60%] bg-gradient-to-b from-[#D4AF37] via-[#D4AF37] to-transparent rounded-full relative">
                                             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg">
                                                 <div className="w-2 h-2 bg-white rounded-full shadow-inner" />
                                             </div>
                                             {/* Needle Head */}
                                             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-[#D4AF37]" />
                                         </div>
                                     </motion.div>
                                     
                                     <Compass size={120} strokeWidth={0.5} className="text-[#D4AF37]/10 absolute" />
                                </div>
                            </div>

                            {/* Degree Markers */}
                            <div className="absolute bottom-[-60px] flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Qibla Angle</p>
                                    <p className="text-2xl font-black text-gray-900 tracking-tighter">256.4°</p>
                                </div>
                                <div className="w-[1px] h-10 bg-gray-200" />
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Accuracy</p>
                                    <p className="text-2xl font-black text-[#5AA564] tracking-tighter">98.2%</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ── Right Column: Prayer Times ── */}
                    <div className="lg:col-span-5">
                        <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.03)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl rounded-full" />
                            
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-black tracking-tight text-gray-900">مواقيت اليوم</span>
                                    <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#D4AF37]">
                                    <Clock size={28} />
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                {prayerTimes.map((prayer, i) => (
                                    <PrayerCard 
                                        key={i} 
                                        name={prayer.name} 
                                        time={prayer.time} 
                                        icon={prayer.icon} 
                                        isActive={prayer.isActive}
                                        delay={i * 0.1}
                                    />
                                ))}
                            </div>

                            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                                <p className="text-sm font-bold text-gray-400 mb-6">هل تريد استقبال تنبيهات للأذان؟</p>
                                <button className="w-full h-16 bg-gray-900 hover:bg-black text-white font-black rounded-[1.5rem] transition-all hover:scale-[1.02] shadow-xl flex items-center justify-center gap-3">
                                    <Bell size={20} className="text-[#D4AF37]" />
                                    تفعيل الإشعارات الآن
                                </button>
                            </div>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 text-center shadow-sm">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#5AA564] mx-auto mb-4">
                                    <Star size={24} fill="currentColor" />
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">وقت الإمساك</p>
                                <p className="text-xl font-black text-gray-900">04:55 AM</p>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 text-center shadow-sm">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#D4AF37] mx-auto mb-4">
                                    <Moon size={24} fill="currentColor" />
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">منتصف الليل</p>
                                <p className="text-xl font-black text-gray-900">11:45 PM</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── Footer Link ── */}
                <footer className="mt-20 py-8 border-t border-gray-100 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img src="/logo/logo.png" alt="Logo" className="w-10 h-10 object-contain opacity-40" />
                        <span className="font-bold text-sm tracking-tight text-gray-300">مصحف أنامل لخدمة الصم</span>
                    </div>
                    <p className="text-xs font-medium">© 2026 جميع الحقوق محفوظة لشركة السبابة الرقمية لتقنية المعلومات.</p>
                </footer>
            </div>
        </div>
    );
}
