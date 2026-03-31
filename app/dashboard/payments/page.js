"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayments } from '@/hooks/usePayments';
import { useUsers } from '@/hooks/useUsers';
import { 
    CreditCard, Loader2, CheckCircle2, XCircle, Clock, 
    Gift, UserX, ExternalLink, CalendarDays, Search 
} from 'lucide-react';

export default function PaymentsPage() {
    const { payments, loading: loadingPayments } = usePayments();
    const { users, cancelSubscription, extendSubscription, loading: loadingUsers } = useUsers();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    // Merge payments with user data
    const enrichedPayments = useMemo(() => {
        if (!payments || !users) return [];
        return payments.map(payment => {
            // Find the user associated with this payment
            // Handle possibility of userId being stored differently
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
            alert("تم إرجاع المستخدم للباقة المجانية.");
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
            alert("تم إضافة 30 يوماً بنجاح.");
        } catch (err) {
            alert("حدث خطأ أثناء تمديد الاشتراك.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loadingPayments || loadingUsers) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={40} className="text-[#14B8A6] animate-spin mb-4" />
                <p className="text-[#14B8A6]/70 font-semibold">جاري جلب بيانات المدفوعات والمشتركين...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="glass-panel p-6 rounded-3xl border border-[#14B8A6]/10 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#14B8A6]/10 blur-3xl rounded-full" />
                
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#14B8A6]/20 to-[#0D9488]/20 rounded-2xl flex items-center justify-center border border-[#14B8A6]/20 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
                        <CreditCard size={28} className="text-[#14B8A6]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">سجل المدفوعات والاشتراكات</h1>
                        <p className="text-sm font-medium text-[#14B8A6]/60 mt-1">متابعة مدفوعات ميسر وإدارة اشتراكات المستخدمين.</p>
                    </div>
                </div>

                <div className="relative z-10 w-full md:w-auto">
                    <div className="flex items-center bg-[#1E2448]/80 border border-[#14B8A6]/15 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#14B8A6]/30 transition-all">
                        <Search size={18} className="text-[#14B8A6]/50" />
                        <input
                            type="text"
                            placeholder="ابحث برقم الدفع أو الايميل..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-white text-sm mr-3 w-64 placeholder:text-gray-500"
                        />
                    </div>
                </div>
            </div>

            {/* External Action Notice */}
            <div className="bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-2xl p-4 flex items-start gap-4">
                <ExternalLink className="text-[#14B8A6] shrink-0 mt-0.5" size={20} />
                <div>
                    <h3 className="text-white font-bold text-sm">لوحة تحكم ميسر الرسمية</h3>
                    <p className="text-[#14B8A6]/70 text-xs mt-1 leading-relaxed">
                        لإجراء عمليات الإسترجاع (Refunds) وإعادة المبالغ للبطاقات، أو لمراجعة التحويلات البنكية التفصيلية الخاصة بك؛ يجب استخدام لوحة تحكم ميسر. هذا السجل هنا للمطابقة وللتحكم بمدة الاشتراك الفعلية للعميل في التطبيق.
                    </p>
                </div>
            </div>

            {/* Table Section */}
            <div className="glass-panel border border-[#14B8A6]/10 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-[#1A2035]/80 border-b border-[#14B8A6]/10">
                                <th className="px-6 py-4 text-xs font-black text-[#14B8A6]/70 uppercase tracking-widest whitespace-nowrap">رقم الدفع المرجعي</th>
                                <th className="px-6 py-4 text-xs font-black text-[#14B8A6]/70 uppercase tracking-widest">المشترك / الباقة</th>
                                <th className="px-6 py-4 text-xs font-black text-[#14B8A6]/70 uppercase tracking-widest">التواريخ</th>
                                <th className="px-6 py-4 text-xs font-black text-[#14B8A6]/70 uppercase tracking-widest">الحالة</th>
                                <th className="px-6 py-4 text-xs font-black text-[#14B8A6]/70 uppercase tracking-widest">إجراءات الإدارة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#14B8A6]/5">
                            <AnimatePresence>
                                {enrichedPayments.length > 0 ? enrichedPayments.map((payment, index) => {
                                    
                                    // Parse payment dates
                                    let payDate = 'غير معروف';
                                    if (payment.createdAt) {
                                        if (payment.createdAt.toDate) payDate = payment.createdAt.toDate().toLocaleDateString('ar-SA');
                                        else payDate = new Date(payment.createdAt).toLocaleDateString('ar-SA');
                                    }

                                    // Render status
                                    const isPaid = payment.paymentStatus === 'paid' || payment.paymentStatus === 'successful';

                                    return (
                                        <motion.tr
                                            key={payment.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-[#14B8A6]/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white/90">
                                                {payment.paymentId || payment.id}
                                            </td>
                                            
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white mb-1">{payment.user?.displayName || payment.user?.email || 'بدون اسم'}</span>
                                                    <span className="text-xs text-[#14B8A6]/50">{payment.user?.email}</span>
                                                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md bg-[#1E2448] border border-[#14B8A6]/20 text-[10px] text-[#14B8A6] max-w-max">
                                                        {payment.planId || 'باقة مدفوعة'} ({payment.user?.subscriptionTier || 'unknown'})
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-white/70">
                                                        <Clock size={12} className="text-[#14B8A6]/50" />
                                                        <span>تاريخ الدفع: {payDate}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-[#14B8A6]">
                                                        <CalendarDays size={12} />
                                                        <span dir="ltr">النهاية: {payment.user?.endDate ? new Date(payment.user?.endDate?.seconds ? payment.user.endDate.seconds * 1000 : payment.user.endDate).toLocaleDateString() : 'مستمر'}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${isPaid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                                    {isPaid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                                    <span>{isPaid ? 'ناجحة' : 'مرفوضة / فشلت'}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2 opacity-100 lg:opacity-60 lg:group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleExtend(payment.user, payment.id)}
                                                        disabled={actionLoading !== null}
                                                        className="px-3 py-1.5 bg-[#14B8A6]/10 hover:bg-[#14B8A6]/20 text-[#14B8A6] rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-[#14B8A6]/20 disabled:opacity-50"
                                                    >
                                                        {actionLoading === `extend-${payment.id}` ? <Loader2 size={14} className="animate-spin" /> : <Gift size={14} />}
                                                        شهر مجاني
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCancel(payment.user, payment.id)}
                                                        disabled={actionLoading !== null}
                                                        className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-rose-500/20 disabled:opacity-50"
                                                    >
                                                        {actionLoading === `cancel-${payment.id}` ? <Loader2 size={14} className="animate-spin" /> : <UserX size={14} />}
                                                        إلغاء الاشتراك
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-[#14B8A6]/40 font-bold border-b border-[#14B8A6]/5 flex flex-col items-center gap-3">
                                            <CreditCard size={40} className="opacity-20 inline-block mb-2" />
                                            لا توجد أي مدفوعات مسجلة حتى الآن.
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
