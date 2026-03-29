import Link from 'next/link';
import { BookOpen, HandMetal, Smartphone, Accessibility, Star, Users, Video, ChevronLeft, Play, Globe, Shield } from 'lucide-react';

export const metadata = {
    title: 'قرآن الإشارة — تعلم القرآن بلغة الإشارة',
    description: 'منصة قرآن الإشارة تتيح للصم وضعاف السمع تعلم وتلاوة القرآن الكريم عبر لغة الإشارة العربية SAL',
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="group bg-[#141830]/60 backdrop-blur-sm border border-[#C9A84C]/12 rounded-3xl p-8 hover:border-[#C9A84C]/35 hover:bg-[#1E2448]/50 transition-all duration-500">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#C9A84C]/15 to-[#8B6F2E]/8 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] mb-5 group-hover:scale-110 transition-transform duration-500">
            {icon}
        </div>
        <h3 className="text-lg font-black text-white mb-2">{title}</h3>
        <p className="text-sm font-medium text-white/40 leading-relaxed">{desc}</p>
    </div>
);

const StatBadge = ({ value, label }) => (
    <div className="text-center">
        <p className="text-4xl font-black text-[#C9A84C]">{value}</p>
        <p className="text-xs font-bold text-white/40 mt-1 uppercase tracking-widest">{label}</p>
    </div>
);

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0A0D1A] text-white font-sans overflow-x-hidden" dir="rtl">

            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] right-[-15%] w-[60%] h-[60%] bg-[#C9A84C]/6 blur-[150px] rounded-full" />
                <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-[#1E2448]/80 blur-[120px] rounded-full" />
                {/* Dot grid pattern */}
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.05) 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }} />
            </div>

            {/* ── Navbar ── */}
            <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <Link href="/login" className="text-[10px] font-black text-[#C9A84C]/60 hover:text-[#C9A84C] uppercase tracking-widest border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 px-5 py-2.5 rounded-xl transition-all">
                    دخول المسؤول
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-[#C9A84C] to-[#8B6F2E] rounded-xl shadow-lg shadow-[#C9A84C]/20 text-[#0A0D1A]">
                        <BookOpen size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-base font-black tracking-tight bg-gradient-to-l from-white to-[#C9A84C] bg-clip-text text-transparent">قرآن الإشارة</span>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="relative z-10 max-w-5xl mx-auto px-8 pt-20 pb-28 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-full mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
                    <span className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest">متاح الآن على App Store و Google Play</span>
                </div>

                {/* Logo mark */}
                <div className="inline-flex p-6 rounded-[2rem] bg-gradient-to-br from-[#C9A84C] to-[#8B6F2E] shadow-2xl shadow-[#C9A84C]/25 mb-8">
                    <BookOpen size={56} strokeWidth={1.8} className="text-[#0A0D1A]" />
                </div>

                <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-tight mb-4">
                    <span className="bg-gradient-to-l from-white via-[#F5F0E8] to-[#C9A84C] bg-clip-text text-transparent">
                        قرآن الإشارة
                    </span>
                </h1>
                <p className="text-[#C9A84C] font-bold text-sm uppercase tracking-[0.2em] mb-8">Quran Sign Language</p>

                <p className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto font-medium mb-12">
                    أول منصة متخصصة تجمع بين <span className="text-white/80 font-bold">القرآن الكريم</span> و<span className="text-white/80 font-bold">لغة الإشارة العربية</span>، مصممة خصيصاً للصم وضعاف السمع لتمكينهم من تلاوة كتاب الله وفهمه.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="#"
                        className="group flex items-center gap-3 h-14 px-8 bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0A0D1A] font-extrabold rounded-2xl shadow-2xl shadow-[#C9A84C]/25 transition-all active:scale-95 text-sm relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/15 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <Smartphone size={20} />
                        تحميل التطبيق
                        <ChevronLeft size={18} strokeWidth={3} />
                    </a>
                    <a
                        href="#features"
                        className="flex items-center gap-3 h-14 px-8 bg-[#141830]/80 hover:bg-[#1E2448] text-white/70 hover:text-white font-bold rounded-2xl border border-[#C9A84C]/15 hover:border-[#C9A84C]/35 transition-all text-sm"
                    >
                        <Play size={18} className="text-[#C9A84C]" />
                        اكتشف المزيد
                    </a>
                </div>
            </section>

            {/* ── Stats Strip ── */}
            <section className="relative z-10 border-y border-[#C9A84C]/10 bg-[#0A0D1A]/80 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatBadge value="+10,000" label="مستخدم مسجل" />
                    <StatBadge value="30" label="جزء قرآني" />
                    <StatBadge value="6236" label="آية مترجمة" />
                    <StatBadge value="4.9 ★" label="تقييم المتجر" />
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-28">
                <div className="text-center mb-16">
                    <span className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.3em] bg-[#C9A84C]/8 border border-[#C9A84C]/15 px-4 py-2 rounded-full">المميزات</span>
                    <h2 className="text-4xl font-black text-white mt-6 mb-4 tracking-tight">كل ما تحتاجه في مكان واحد</h2>
                    <p className="text-white/40 font-medium max-w-xl mx-auto leading-relaxed">
                        منصة شاملة صُممت بعناية لتجعل تعلم القرآن الكريم ميسراً للجميع
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard
                        icon={<HandMetal size={26} strokeWidth={1.8} />}
                        title="لغة الإشارة العربية"
                        desc="فيديوهات احترافية بلغة الإشارة SAL تغطي كامل سور القرآن الكريم"
                    />
                    <FeatureCard
                        icon={<BookOpen size={26} strokeWidth={1.8} />}
                        title="القرآن كاملاً"
                        desc="الأجزاء الثلاثون كاملة مع نص كل آية والتفسير المبسط"
                    />
                    <FeatureCard
                        icon={<Accessibility size={26} strokeWidth={1.8} />}
                        title="وصولية شاملة"
                        desc="واجهة مصممة للصم وضعاف السمع مع بدائل بصرية لكل العناصر"
                    />
                    <FeatureCard
                        icon={<Globe size={26} strokeWidth={1.8} />}
                        title="يعمل بدون إنترنت"
                        desc="حمّل الفيديوهات مسبقاً واستمتع بالتعلم في أي وقت وأي مكان"
                    />
                </div>
            </section>

            {/* ── App Screenshot Area ── */}
            <section className="relative z-10 max-w-5xl mx-auto px-8 pb-28">
                <div className="relative rounded-[3rem] overflow-hidden border border-[#C9A84C]/15 shadow-[0_0_100px_rgba(201,168,76,0.08)]"
                    style={{ background: 'linear-gradient(135deg, #141830 0%, #0A0D1A 60%, #18140A 100%)' }}>
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.04) 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                    }} />
                    <div className="relative z-10 p-16 text-center">
                        <div className="inline-flex p-5 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-3xl mb-8">
                            <Video size={48} className="text-[#C9A84C]" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 tracking-tight">مكتبة فيديو احترافية</h3>
                        <p className="text-white/40 font-medium max-w-lg mx-auto leading-relaxed mb-10">
                            أكثر من <span className="text-[#C9A84C] font-bold">6000 فيديو</span> بجودة HD يعرض كل آية بلغة الإشارة مع النص والترجمة
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {['سورة الفاتحة', 'سورة البقرة', 'جزء عمّ', 'سورة يس', 'سورة الملك'].map((s) => (
                                <div key={s} className="flex items-center gap-2 px-4 py-2 bg-[#1E2448]/80 border border-[#C9A84C]/15 rounded-full text-xs font-bold text-[#C9A84C]/70">
                                    <Play size={12} className="text-[#C9A84C]" />
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Plans ── */}
            <section className="relative z-10 max-w-4xl mx-auto px-8 pb-28">
                <div className="text-center mb-14">
                    <span className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.3em] bg-[#C9A84C]/8 border border-[#C9A84C]/15 px-4 py-2 rounded-full">الباقات</span>
                    <h2 className="text-4xl font-black text-white mt-6 mb-4 tracking-tight">ابدأ مجاناً</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free */}
                    <div className="bg-[#141830]/60 border border-white/8 rounded-3xl p-10">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">مجاني</p>
                        <h3 className="text-5xl font-black text-white mb-1">0 <span className="text-xl text-white/30">ر.س</span></h3>
                        <p className="text-sm text-white/30 font-medium mb-8">للأبد</p>
                        <ul className="space-y-3 text-sm font-medium text-white/50">
                            {['الجزء الثلاثون كاملاً', 'سور مختارة', 'جودة عادية'].map(f => (
                                <li key={f} className="flex items-center gap-2"><Shield size={14} className="text-[#C9A84C]/40" />{f}</li>
                            ))}
                        </ul>
                        <a href="#" className="mt-8 w-full h-12 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-bold text-sm transition-all">
                            تحميل مجاناً
                        </a>
                    </div>
                    {/* Premium */}
                    <div className="relative bg-gradient-to-br from-[#1E2448] to-[#141830] border border-[#C9A84C]/30 rounded-3xl p-10 shadow-xl shadow-[#C9A84C]/8">
                        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest">احترافي</p>
                            <div className="flex items-center gap-1 px-2 py-1 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-full text-[9px] font-black text-[#C9A84C]">
                                <Star size={9} fill="currentColor" />
                                الأكثر شعبية
                            </div>
                        </div>
                        <h3 className="text-5xl font-black text-white mb-1">10 <span className="text-xl text-white/50">ر.س / شهر</span></h3>
                        <p className="text-sm text-[#C9A84C]/50 font-medium mb-8">أو 80 ر.س سنوياً</p>
                        <ul className="space-y-3 text-sm font-medium text-white/70">
                            {['القرآن كاملاً 30 جزءاً', 'جودة HD + 4K', 'تحميل بدون إنترنت', 'تفسير مفصل', 'دعم فني مباشر'].map(f => (
                                <li key={f} className="flex items-center gap-2 text-white/70"><Shield size={14} className="text-[#C9A84C]" />{f}</li>
                            ))}
                        </ul>
                        <a href="#" className="mt-8 w-full h-12 flex items-center justify-center bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0A0D1A] font-black rounded-2xl transition-all active:scale-95 text-sm">
                            ابدأ الآن
                        </a>
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="relative z-10 max-w-5xl mx-auto px-8 pb-28">
                <div className="relative rounded-[3rem] overflow-hidden text-center px-12 py-20 border border-[#C9A84C]/20"
                    style={{ background: 'linear-gradient(135deg, #1a140a 0%, #141830 50%, #0A0D1A 100%)' }}>
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
                    <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[100%] bg-[#C9A84C]/6 blur-[80px] rounded-full" />
                    <div className="relative z-10">
                        <Users size={40} className="text-[#C9A84C] mx-auto mb-6" strokeWidth={1.5} />
                        <h2 className="text-4xl font-black text-white mb-4 tracking-tight">انضم لأكثر من 10,000 مستخدم</h2>
                        <p className="text-white/40 font-medium mb-10 max-w-lg mx-auto">
                            ساعدنا الآلاف من الصم وضعاف السمع على التقرب من القرآن الكريم. انضم إليهم اليوم.
                        </p>
                        <a href="#" className="inline-flex items-center gap-3 h-14 px-10 bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0A0D1A] font-extrabold rounded-2xl shadow-2xl shadow-[#C9A84C]/25 transition-all active:scale-95 text-sm">
                            <Smartphone size={20} />
                            تحميل مجاني الآن
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="relative z-10 border-t border-[#C9A84C]/8 px-8 py-10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl text-[#C9A84C]">
                            <BookOpen size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-black text-white/60">قرآن الإشارة</span>
                    </div>
                    <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest text-center">
                        © 2026 قرآن لغة الإشارة — جميع الحقوق محفوظة
                    </p>
                    <Link href="/login" className="text-[10px] font-black text-[#C9A84C]/40 hover:text-[#C9A84C] uppercase tracking-widest transition-colors">
                        بوابة الإدارة →
                    </Link>
                </div>
            </footer>
        </div>
    );
}
