"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayments } from '@/hooks/usePayments';
import { useUsers } from '@/hooks/useUsers';
import { 
    CreditCard, Loader2, CheckCircle2, XCircle, Clock, 
    Gift, UserX, ExternalLink, CalendarDays, Search,
    ArrowLeft
} from 'lucide-react';

// ── Shared Header Component ──────────────────────────────
const SectionHeader = ({ title, subtitle, accentColor = "#5AA564" }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="text-right">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter flex items-center justify-end gap-5">
                {title}
                <div 
                    className="w-2 h-12 rounded-full shadow-lg"
                    style={{ background: `linear-gradient(to bottom, ${accentColor}, transparent)` }} 
                />
            </h1>
            <p className="text-[#5AA564] font-black text-[11px] mt-4 tracking-[0.4em] uppercase opacity-40">{subtitle}</p>
        </div>
    </div>
);

export default function PaymentsPage() {
    const { payments, loading: loadingPayments } = usePayments();
    const { users, cancelSubscription, extendSubscription, loading: loadingUsers } = useUsers();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            setSearchTerm(query);
        }
    }, [searchParams]);

    // Merge payments with user data
    const enrichedPayments = useMemo(() => {
        if (!payments || !users) return [];
        return payments.map(payment => {
            const user = users.find(u => u.rawId === payment.userId || u.id === payment.userId) || { 
                displayName: 'مستخدم غير معروف', 
                email: 'N/A',
                subscriptionTier: 'unknown',
                subscriptionStatus: 'unknown'
            };
            return {
                ...payment,
                user
            };
        }).filter(item => {
            const searchStr = `${item.paymentId} ${item.user.displayName} ${item.user.email}`.toLowerCase();
            return searchStr.includes(searchTerm.toLowerCase());
        });
    }, [payments, users, searchTerm]);

    const handleCancel = async (user, paymentId) => {
        if (!window.confirm("هل أنت متأكد من إلغاء اشتراك هذا المستخدم؟")) return;
        setActionLoading(`cancel-${paymentId}`);
        try {
            await cancelSubscription(user);
        } catch (err) {
            alert("حدث خطأ أثناء الإلغاء.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleExtend = async (user, paymentId) => {
        if (!window.confirm("هل أنت متأكد من إضافة شهر مجاني لهذ المستخدم؟")) return;
        setActionLoading(`extend-${paymentId}`);
        try {
            await extendSubscription(user, 30);
        } catch (err) {
            alert("حدث خطأ أثناء تمديد الاشتراك.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loadingPayments || loadingUsers) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 size={48} className="text-[#5AA564] animate-spin mb-6" />
                <p className="text-[#5AA564] font-black text-[10px] uppercase tracking-[0.3em] opacity-40">جاري تحميل سجلات الخزينة...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <SectionHeader 
                    title="سجل المدفوعات والاشتراكات" 
                    subtitle="Financial Ledger & Subscriptions" 
                />
                
                <div className="relative w-full md:w-auto group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#5AA564]/20 to-blue-400/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative flex items-center bg-white border border-gray-100 rounded-[2rem] px-6 py-4 shadow-sm group-hover:border-[#5AA564]/30 transition-all">
                        <Search size={22} className="text-gray-300 group-hover:text-[#5AA564] transition-colors" />
                        <input
                            type="text"
                            placeholder="ابحث برقم الدفع أو الايميل..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-gray-900 text-sm font-bold mr-4 w-72 placeholder:text-gray-300"
                        />
                    </div>
                </div>
            </div>

            {/* Premium Action Notice */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/50 backdrop-blur-xl border border-[#5AA564]/10 rounded-[2.5rem] p-8 flex items-start gap-6 shadow-xl shadow-gray-200/50"
            >
                <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    <ExternalLink className="text-[#5AA564]" size={24} />
                </div>
                <div>
                    <h3 className="text-gray-900 font-extrabold text-lg flex items-center gap-3">
                        لوحة تحكم ميسر الرسمية
                        <span className="text-[10px] font-black text-[#5AA564] bg-[#5AA564]/10 px-3 py-1 rounded-full uppercase tracking-widest">Admin Tip</span>
                    </h3>
                    <p className="text-gray-500 font-bold text-sm mt-2 leading-relaxed max-w-4xl shadow-sm">
                        لإجراء عمليات الإسترجاع (Refunds) وإعادة المبالغ للبطاقات، أو لمراجعة التحويلات البنكية التفصيلية الخاصة بك؛ يجب استخدام لوحة تحكم ميسر. هذا السجل هنا للمطابقة وللتحكم بمدة الاشتراك الفعلية للعميل في التطبيق.
                    </p>
                </div>
            </motion.div>

            {/* Table Section */}
            <div className="glass-panel rounded-[3.5rem] overflow-hidden border-gray-100 shadow-2xl bg-white/50 backdrop-blur-xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">رقم الدفع المرجعي</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">المشترك / الباقة</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">التواريخ</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 text-center">الحالة</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 text-left">إجراءات الإدارة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {enrichedPayments.length > 0 ? enrichedPayments.map((payment, index) => {
                                    const isPaid = payment.paymentStatus === 'paid' || payment.paymentStatus === 'successful';
                                    let payDate = 'N/A';
                                    if (payment.createdAt) {
                                        payDate = new Date(payment.createdAt.seconds ? payment.createdAt.seconds * 1000 : payment.createdAt).toLocaleDateString('ar-SA');
                                    }

                                    return (
                                        <motion.tr
                                            key={payment.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                            className="group hover:bg-[#5AA564]/5 transition-colors"
                                        >
                                            <td className="px-10 py-7">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900 font-mono tracking-tight uppercase">
                                                        {payment.paymentId || payment.id.slice(0, 12)}
                                                    </span>
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Transaction Ref</span>
                                                </div>
                                            </td>
                                            
                                            <td className="px-10 py-7">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base font-black text-gray-900">{payment.user?.displayName || 'Unknown'}</span>
                                                        <div className="px-2 py-0.5 rounded-lg bg-gray-50 border border-gray-100 text-[8px] font-black text-gray-400 uppercase tracking-tighter">
                                                            {payment.planId || 'PREMIUM'}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-400 mt-1">{payment.user?.email}</span>
                                                </div>
                                            </td>

                                            <td className="px-10 py-7">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                        <Clock size={14} className="opacity-40" />
                                                        <span>دفع في: {payDate}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-black text-[#5AA564]">
                                                        <CalendarDays size={14} />
                                                        <span dir="ltr">EXPIRES: {payment.user?.endDate ? new Date(payment.user?.endDate?.seconds ? payment.user.endDate.seconds * 1000 : payment.user.endDate).toLocaleDateString() : 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-10 py-7">
                                                <div className="flex justify-center">
                                                    <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm
                                                        ${isPaid 
                                                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                                                            : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
                                                        {isPaid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                                        <span>{isPaid ? 'ناجحة' : 'فاشلة'}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-10 py-7">
                                                <div className="flex items-center justify-start gap-3">
                                                    <button 
                                                        onClick={() => handleExtend(payment.user, payment.id)}
                                                        disabled={actionLoading !== null}
                                                        className="h-10 px-5 bg-white border border-gray-100 hover:border-[#5AA564]/30 text-gray-400 hover:text-[#5AA564] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-90 flex items-center gap-2"
                                                    >
                                                        {actionLoading === `extend-${payment.id}` ? <Loader2 size={14} className="animate-spin" /> : <Gift size={14} />}
                                                        هدية 30 يوم
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCancel(payment.user, payment.id)}
                                                        disabled={actionLoading !== null}
                                                        className="h-10 px-5 bg-white border border-gray-100 hover:border-rose-200 text-gray-400 hover:text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-90 flex items-center gap-2"
                                                    >
                                                        {actionLoading === `cancel-${payment.id}` ? <Loader2 size={14} className="animate-spin" /> : <UserX size={14} />}
                                                        إلغاء
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-32 text-center text-gray-300 font-black text-[10px] uppercase tracking-[0.5em] flex flex-col items-center gap-6">
                                            <CreditCard size={64} className="opacity-10" />
                                            لا توجد سجلات مالية للمطابقة حالياً
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Footer Controls */}
                <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Enriched Payment Records: {enrichedPayments.length}
                    </p>
                    <div className="flex gap-2">
                        <button className="h-11 w-11 flex items-center justify-center bg-white border border-gray-100 rounded-[1rem] text-gray-300 hover:text-gray-900 transition-all rotate-180"><ArrowLeft size={16} /></button>
                        <div className="h-11 px-6 flex items-center justify-center bg-white border border-[#5AA564]/30 rounded-[1rem] text-[#5AA564] text-[11px] font-black shadow-sm">PAGE 01</div>
                        <button className="h-11 w-11 flex items-center justify-center bg-white border border-gray-100 rounded-[1rem] text-gray-300 hover:text-gray-900 transition-all"><ArrowLeft size={16} className="rotate-180" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
