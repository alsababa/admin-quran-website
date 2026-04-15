"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Home, Mail } from 'lucide-react';

const Reveal = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
        {children}
    </motion.div>
);

const PolicySection = ({ icon, title, children }) => (
    <Reveal>
        <div className="glass-card p-8 md:p-12 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    {icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900">{title}</h3>
            </div>
            <div className="text-gray-600 font-bold leading-relaxed space-y-4">
                {children}
            </div>
        </div>
    </Reveal>
);

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-primary/30 overflow-x-hidden" dir="rtl">
            {/* Mesh Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/5 blur-[100px] rounded-full opacity-30" />
            </div>

            {/* Navbar */}
            <nav className="fixed inset-x-0 top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <div className="flex items-center gap-3 cursor-pointer group">
                                <div className="p-2 bg-white border border-gray-100 shadow-sm rounded-xl group-hover:scale-110 transition-transform">
                                    <img src="/logo/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                                </div>
                                <span className="text-xl font-black text-gray-900">مصحف أنامل</span>
                            </div>
                        </Link>
                    </div>
                    <Link href="/" className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all">
                        <Home size={16} /> العودة للرئيسية
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 pt-40 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <Reveal>
                            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full mb-8">
                                <Shield size={16} className="text-primary" />
                                <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">حماية وخصوصية</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">سياسة الخصوصية</h1>
                            <p className="text-xl text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed">
                                نلتزم في "مصحف أنامل" بحماية خصوصيتك وضمان أمان بياناتك الشخصية كجزء من رسالتنا السامية لخدمة الصم.
                            </p>
                        </Reveal>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <PolicySection icon={<Eye size={24} />} title="مقدمة">
                            <p>توضح سياسة الخصوصية هذه نوع البيانات التي نجمعها في تطبيق وموقع "مصحف أنامل"، وكيفية استخدامها وحمايتها.</p>
                            <p>باستخدامك لخدماتنا، فإنك توافق على الممارسات الموضحة في هذه السياسة.</p>
                        </PolicySection>

                        <PolicySection icon={<Lock size={24} />} title="البيانات التي نجمعها">
                            <ul className="list-disc list-inside space-y-3 pr-4">
                                <li><strong>معلومات الحساب:</strong> مثل الاسم، والبريد الإلكتروني عند التسجيل لتخصيص تجربتك.</li>
                                <li><strong>معلومات الجهاز:</strong> نوع الجهاز، ونظام التشغيل لتحسين أداء المشغل الثلاثي الأبعاد.</li>
                                <li><strong>بيانات الموقع:</strong> نطلب الوصول للموقع لغرض وحيد وهو تحديد اتجاه القبلة بدقة ومواقيت الصلاة.</li>
                                <li><strong>الكاميرا:</strong> قد نطلب الوصول للكاميرا في حال تطوير ميزات تفاعلية تعتمد على الواقع المعزز أو التعرف على الإشارة.</li>
                            </ul>
                        </PolicySection>

                        <PolicySection icon={<FileText size={24} />} title="كيفية استخدام المعلومات">
                            <p>نستخدم البيانات التي نجمعها لـ:</p>
                            <ul className="list-disc list-inside space-y-3 pr-4">
                                <li>توفير وتحسين خدمات ترجمة القرآن الكريم لغة الإشارة.</li>
                                <li>تخصيص تجربة المستخدم وحفظ التقدم في القراءة.</li>
                                <li>ضمان دقة اتجاه القبلة ومواقيت الصلاة.</li>
                                <li>تحليل الاستخدام المجمع لتطوير ميزات جديدة تخدم مجتمع الصم.</li>
                            </ul>
                        </PolicySection>

                        <PolicySection icon={<Shield size={24} />} title="مشاركة البيانات">
                            <p>نحن لا نبيع بياناتك الشخصية لأي طرف ثالث. تتم مشاركة البيانات فقط مع مزودي الخدمة الموثوقين لضمان عمل التطبيق:</p>
                            <ul className="list-disc list-inside space-y-3 pr-4">
                                <li><strong>Supabase / Firebase:</strong> لتخزين البيانات وإدارة الهوية بشكل آمن.</li>
                                <li><strong>Moyasar:</strong> لمعالجة عمليات الدفع والاشتراكات بشكل مشفر وآمن تماماً.</li>
                            </ul>
                        </PolicySection>

                        <PolicySection icon={<Lock size={24} />} title="أمن البيانات">
                            <p>نطبق معايير تقنية وإدارية متقدمة لحماية بياناتك من الوصول غير المصرح به أو الكشف عنها. يتم تشفير كافة البيانات الحساسة أثناء النقل والتخزين.</p>
                        </PolicySection>

                        <PolicySection icon={<Mail size={24} />} title="تواصل معنا">
                            <p>إذا كان لديك أي استفسارات حول سياسة الخصوصية أو ترغب في ممارسة حقوقك المتعلقة ببياناتك، يسعدنا تواصلك معنا عبر:</p>
                            <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-400 mb-1">البريد الإلكتروني للدعم</p>
                                    <p className="text-xl font-black text-gray-900">info@alsababah.com</p>
                                </div>
                                <a href="mailto:info@alsababah.com" className="px-8 py-3 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-colors">
                                    ارسل رسالة
                                </a>
                            </div>
                        </PolicySection>
                    </div>

                    {/* Footer Hint */}
                    <div className="mt-20 text-center">
                        <p className="text-gray-400 text-sm font-bold">آخر تحديث: أبريل 2024</p>
                    </div>
                </div>
            </main>

            {/* Background Pattern */}
            <div className="fixed inset-0 arabic-pattern opacity-[0.03] pointer-events-none z-0" />
        </div>
    );
}
