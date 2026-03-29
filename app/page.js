import Link from 'next/link';
import { HandMetal, Smartphone, Accessibility, Star, Users, Video, ChevronLeft, Play, Globe, Shield, CheckCircle2, BookOpen, Compass, Check, ArrowLeft, Lightbulb, MessageSquareQuote } from 'lucide-react';

export const metadata = {
    title: 'قرآن الإشارة — تعلم القرآن بلغة الإشارة',
    description: 'المنصة الرسمية الأولى لتمكين الصم وضعاف السمع من تلاوة وتعلم القرآن الكريم عبر لغة الإشارة العربية.',
};

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

const StepIndicator = ({ number, title, desc, delay }) => (
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
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-[#14B8A6]/20" dir="rtl">

            {/* ── Navbar ── */}
            <nav className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo/logo.png" alt="شعار قرآن الإشارة" className="w-10 h-10 object-contain drop-shadow-sm" />
                        <span className="text-lg font-extrabold text-gray-900 tracking-tight hidden sm:block">قرآن الإشارة</span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
                        <a href="#features" className="hover:text-gray-900 transition-colors">المميزات</a>
                        <a href="#interface" className="hover:text-gray-900 transition-colors">واجهة التطبيق</a>
                        <a href="#process" className="hover:text-gray-900 transition-colors">كيف يعمل؟</a>
                        <a href="#pricing" className="hover:text-gray-900 transition-colors">الباقات</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors border-l border-gray-200 pl-4 hidden sm:block">
                            دخول الإدارة
                        </Link>
                        <a href="#download" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            تحميل التطبيق
                        </a>
                    </div>
                </div>
            </nav>

            {/* ── Hero Center Layout ── */}
            <section className="relative pt-40 pb-20 px-6 mx-auto overflow-hidden">
                {/* Advanced Beautiful Mesh Gradient Background */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#14B8A6]/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute right-[-10%] top-[20%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 shadow-sm rounded-full mb-8 cursor-pointer hover:shadow-md transition-shadow">
                        <div className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
                        <span className="text-xs font-extrabold text-gray-800">الأول من نوعه في العالم الإسلامي</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-gray-900 leading-[1.1] mb-6">
                        تلاوة وفهم القرآن <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#14B8A6] to-[#0D9488]">بلغة الإشارة</span> بيسر.
                    </h1>

                    <p className="text-lg md:text-xl text-gray-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                        منصة قرآن الإشارة هي نافذتك الشاملة لتعلم وتلاوة كتاب الله، مع مكتبة تفاعلية متكاملة مصممة خصيصاً للصم وضعاف السمع بجودة فائقة وواجهة استثنائية.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-24">
                        <a href="#download" className="w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-10 bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-[0_0_40px_rgba(20,184,166,0.25)]">
                            <Smartphone size={20} />
                            ابدأ رحلتك مجاناً
                        </a>
                        <a href="#demo" className="w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-10 bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 font-bold rounded-2xl transition-all shadow-sm">
                            <Play size={18} className="fill-gray-900" />
                            كيف يعمل التطبيق؟
                        </a>
                    </div>
                </div>

                {/* Video Presentation */}
                <div id="demo" className="relative mx-auto rounded-[2.5rem] overflow-hidden bg-black shadow-[0_20px_80px_rgba(0,0,0,0.12)] border-8 border-white max-w-5xl group transform hover:-translate-y-2 transition-transform duration-700 z-20">
                    <div className="aspect-video relative bg-gray-900 flex items-center justify-center overflow-hidden">
                        <video 
                            className="w-full h-full object-cover"
                            autoPlay 
                            muted 
                            loop 
                            playsInline 
                            poster="/logo/app_assets_images_indexpart.png"
                        >
                            <source src="/vedio/Founding%20Day.mp4" type="video/mp4" />
                            متصفحك لا يدعم تشغيل الفيديو.
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </section>

            {/* ── Logos/Trusted By ── */}
            <section className="bg-white py-12 border-y border-gray-100">
                <div className="max-w-7xl mx-auto text-center overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] px-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">شراكات استراتيجية موثوقة</p>
                    <div className="flex w-full overflow-hidden group">
                        {[1, 2, 3].map((set) => (
                            <div key={set} className="flex min-w-max animate-infinite-scroll group-hover:[animation-play-state:paused] gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-300 font-extrabold text-xl md:text-2xl text-gray-400 px-6 md:px-12" aria-hidden={set !== 1}>
                                <span className="hover:text-[#14B8A6] transition-colors">شركة السبابة الرقمية</span>
                                <span className="hover:text-gray-900 transition-colors">مصحف تبيان</span>
                                <span className="hover:text-gray-900 transition-colors">جمعية لأجلهم</span>
                                <span className="hover:text-[#14B8A6] transition-colors">لغة الإشارة SAL</span>
                                <span className="hover:text-gray-900 transition-colors">أكاديمية طويق</span>
                                <span className="hover:text-gray-900 transition-colors">وزارة التعليم</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── App Interface Showcase (Bento Grid) ── */}
            <section id="interface" className="py-28 max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-sm font-extrabold text-[#14B8A6] bg-[#14B8A6]/10 px-4 py-1.5 rounded-full inline-block mb-4">واجهة التطبيق</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">مصمم ليكون بين يديك دائماً</h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg hover:text-gray-700 transition-colors">
                        تجربة تصفح بديهية وسريعة، بنيت بدقة لتناسب احتياجات ضعاف السمع والصم بكل مرونة.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                    {/* Bento Box 1: Azkar */}
                    <div className="col-span-1 md:col-span-2 bg-[#F1F5F9] rounded-[2.5rem] p-10 flex flex-col items-center text-center group hover:bg-[#E2E8F0] transition-colors duration-500 overflow-hidden">
                        <h3 className="text-3xl font-black text-gray-900 mb-3 block">ترجمة الأذكار</h3>
                        <p className="text-gray-600 font-medium text-base mb-8 max-w-lg">أذكار الصباح والمساء وأذكار الصلاة مسجلة بدقة عالية بلغة الإشارة ليسهل حفظها وترديدها يومياً.</p>
                        <div className="w-full flex justify-center">
                            <img src="/logo/app_assets_images_azkartranslate.png" className="w-auto h-[320px] object-contain drop-shadow-2xl group-hover:-translate-y-2 transition-transform duration-700 rounded-3xl" />
                        </div>
                    </div>

                    {/* Bento Box 2: Location/Prayer */}
                    <div className="col-span-1 bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-10 flex flex-col items-center text-center group overflow-hidden">
                        <Compass className="text-[#14B8A6] mb-4 mx-auto" size={36} />
                        <h3 className="text-2xl font-black text-gray-900 mb-2">القبلة والصلاة</h3>
                        <p className="text-gray-500 font-medium text-sm mb-8">مواقيت وتحديد اتجاه مرئي.</p>
                        <div className="w-full flex justify-center mt-auto">
                            <img src="/logo/app_assets_images_indexitemlocationmecca.png" className="w-auto h-[180px] object-contain drop-shadow-xl group-hover:-translate-y-2 transition-transform duration-700 rounded-2xl" />
                        </div>
                    </div>

                    {/* Bento Box 3: Surahs List - Primary color box */}
                    <div className="col-span-1 bg-[#14B8A6] rounded-[2.5rem] p-10 flex flex-col items-center text-center text-white group shadow-[0_20px_40px_rgba(20,184,166,0.2)] hover:bg-[#0D9488] transition-colors duration-500 overflow-hidden">
                        <BookOpen className="text-white mb-4 mx-auto" size={36} />
                        <h3 className="text-2xl font-black mb-2">القرآن كاملاً</h3>
                        <p className="text-teal-50 font-medium text-sm mb-8">30 جزءاً مسجلاً وحاضراً للتصفح المُيسر.</p>
                        <div className="w-full flex justify-center mt-auto">
                            <img src="/logo/app_assets_images_indexpart.png" className="w-auto h-[280px] object-contain drop-shadow-2xl group-hover:-translate-y-2 transition-transform duration-700 rounded-3xl" />
                        </div>
                    </div>

                    {/* Bento Box 4: Acceptance/Success Flow */}
                    <div className="col-span-1 md:col-span-2 bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between text-center md:text-right group gap-10 overflow-hidden">
                        <div className="w-full md:w-1/2">
                            <h3 className="text-3xl font-black text-gray-900 mb-3">سهولة المتابعة</h3>
                            <p className="text-gray-500 font-medium text-base">تتبع تقدمك في الحفظ والتلاوة مع واجهات ذكية ومريحة للرؤية تشجعك على الاستمرارية (شاشات إنجاز سلسة واضحة).</p>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center md:justify-end gap-6 items-center">
                            <img src="/logo/app_assets_images_accept.png" className="w-auto h-[220px] object-contain drop-shadow-xl rounded-2xl group-hover:-translate-y-2 transition-transform duration-700" />
                            <img src="/logo/app_assets_images_bottombar_prayer.png" className="w-auto h-[220px] object-contain drop-shadow-xl rounded-2xl group-hover:-translate-y-2 transition-transform duration-700" />
                        </div>
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
                            <StepIndicator number="1" title="حمل التطبيق" desc="ابحث عن 'قرآن الإشارة' في متجر آبل أو جوجل بلاي وقم بتثبيته مجاناً." />
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
                            {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
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
                            {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
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
                            {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed mb-6">"إمكانية تحميل الفيديوهات واستخدامها بدون إنترنت كانت ميزة غير متوقعة وأنقذتني في كثير من الأوقات."</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#14B8A6]/10 rounded-full flex items-center justify-center font-bold text-[#14B8A6]">ف</div>
                            <div>
                                <h4 className="font-extrabold text-gray-900 text-sm">فاطمة علي</h4>
                                <p className="text-xs text-gray-500">مشتركة باقة احترافية</p>
                            </div>
                        </div>
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

            {/* ── Pricing ── */}
            <section id="pricing" className="py-28 max-w-7xl mx-auto px-6">
                 <div className="text-center mb-20">
                    <span className="text-sm font-extrabold text-[#14B8A6] bg-[#14B8A6]/10 px-4 py-1.5 rounded-full inline-block mb-4">الاشتراكات</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">باقات بسيطة ومرنة</h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg">اختر الخطة التي تناسب احتياجاتك لتبدأ رحلتك مع كتاب الله.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col items-start transition-shadow hover:shadow-md">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">الأساسية</p>
                        <h3 className="text-6xl font-black text-gray-900 mb-2">مجانًا</h3>
                        <p className="text-gray-500 font-medium mb-10 border-b border-gray-100 pb-8 w-full">استخدام أساسي دائم لبعض السور.</p>
                        <ul className="space-y-5 text-sm font-bold text-gray-600 mb-10 flex-grow">
                            {['تصفح السور الأساسية والأجزاء القصيرة', 'جودة عادية للفيديوهات', 'معرفة القبلة وأوقات الصلاة'].map((f, i) => (
                                <li key={i} className="flex items-center gap-3"><Check size={20} className="text-gray-400" />{f}</li>
                            ))}
                        </ul>
                        <button className="w-full h-14 bg-[#F1F5F9] hover:bg-gray-200 text-gray-900 font-bold rounded-2xl transition-colors mt-auto">
                            الاستمرار مجاناً
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gray-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden flex flex-col items-start transform md:-translate-y-4">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#14B8A6] rounded-full blur-[100px] opacity-20 pointer-events-none" />
                        <div className="w-full flex justify-between items-center mb-4">
                            <p className="text-sm font-bold text-[#14B8A6] uppercase tracking-widest">احترافي</p>
                            <span className="text-[10px] bg-[#14B8A6]/20 text-[#14B8A6] px-3 py-1 text-center font-bold rounded-full">الأشهر</span>
                        </div>
                        <h3 className="text-5xl lg:text-6xl font-black text-white mb-2 flex items-baseline gap-2">10<span className="text-lg text-gray-400 font-bold ml-1">ر.س/شهر</span></h3>
                        <p className="text-gray-400 font-medium mb-10 border-b border-gray-800 pb-8 w-full relative z-10">وصول غير محدود لكل المحتوى.</p>
                        <ul className="space-y-5 text-sm font-bold text-gray-300 mb-10 flex-grow relative z-10">
                            {['القرآن كاملاً مترجم للغة الإشارة', 'جودة فيديوهات فائقة الدقة HD', 'ترجمة الأذكار اليومية بالكامل', 'التحميل للاستخدام بدون إنترنت'].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-white"><Check size={20} className="text-[#14B8A6]" />{f}</li>
                            ))}
                        </ul>
                        <button className="w-full h-14 bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold rounded-2xl transition-colors relative z-10 shadow-[0_10px_30px_rgba(20,184,166,0.3)] mt-auto">
                            اشترك الآن
                        </button>
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
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">هل التطبيق موجه فقط للصم وضعاف السمع؟</h3>
                        <p className="text-gray-500 font-medium">نعم، تم تصميمه خصيصاً ليناسب احتياجات لغة الإشارة الخاصة بالصم وضعاف السمع، ولكن يمكن لأي شخص راغب في تعلم لغة الإشارة للقرآن استخدامه.</p>
                    </div>
                     {/* FAQ Item 2 */}
                     <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">هل أحتاج إلى الاتصال بالإنترنت دائماً؟</h3>
                        <p className="text-gray-500 font-medium">في البداية نعم لتحميل الفيديوهات والسور، ولكن بإمكانك حفظها في جهازك (للمشتركين في الباقة الاحترافية) ومشاهدتها في أي وقت وأي مكان دون إنترنت.</p>
                    </div>
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
                        قم بتحميل تطبيق قرآن الإشارة الآن، متوفر على المتاجر الرسمية لأجهزة آيفون وأندرويد وانضم لمجتمعنا الكبير.
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
                            <span className="text-lg font-extrabold text-gray-900">قرآن الإشارة</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">إحدى مبادرات شركة السبابة الرقمية</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 text-center">
                        © 2026 قرآن الإشارة التابع لشركة السبابة الرقمية. جميع الحقوق محفوظة لخدمة الصم وضعاف السمع.
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
