import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, getDocs, doc, updateDoc, where } from 'firebase/firestore';
import { CreditCard, CheckCircle, AlertCircle, TrendingUp, Filter } from 'lucide-react';

const SubscriptionsPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ active: 0, pending: 0, totalRevenue: 0 });

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "users"), where("subscriptionTier", "==", "premium"));
            const querySnapshot = await getDocs(q);
            const subsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSubscriptions(subsData);

            const activeCount = subsData.filter(s => s.subscriptionStatus === 'active').length;
            setStats({
                active: activeCount,
                pending: subsData.length - activeCount,
                totalRevenue: activeCount * 10 // Assumption: 10 SAR/month
            });
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGrantPremium = async (userId) => {
        if (!window.confirm("Are you sure you want to manually grant Premium to this user?")) return;
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                subscriptionTier: 'premium',
                subscriptionStatus: 'active',
                subscriptionStartDate: new Date().toISOString(),
                subscriptionPlatform: 'admin_manual'
            });
            fetchSubscriptions();
            alert("Premium access granted successfully.");
        } catch (err) {
            console.error(err);
            alert("Failed to grant premium.");
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-right">
                    <h3 className="text-2xl font-bold">الاشتراكات</h3>
                    <p className="text-gray-400 text-sm">إدارة الوصول المميز والفوترة.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<TrendingUp className="text-green-500" />} label="الإيرادات الشهرية (تقديري)" value={`${stats.totalRevenue} ريال`} />
                <StatCard icon={<CheckCircle className="text-blue-500" />} label="الخطط النشطة" value={stats.active} />
                <StatCard icon={<AlertCircle className="text-amber-500" />} label="منتهية/معلقة" value={stats.pending} />
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mt-8">
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                    <h4 className="font-semibold order-last">المستخدمين المميزين</h4>
                    <Filter size={18} className="text-gray-500" />
                </div>
                <table className="w-full text-right text-sm">
                    <thead className="bg-gray-800 bg-opacity-50 border-b border-gray-800 text-gray-400">
                        <tr>
                            <th className="px-6 py-4 font-semibold">المستخدم</th>
                            <th className="px-6 py-4 font-semibold">الطريقة</th>
                            <th className="px-6 py-4 font-semibold">تاريخ الانتهاء</th>
                            <th className="px-6 py-4 font-semibold">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">جاري تحميل الاشتراكات...</td></tr>
                        ) : subscriptions.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">لم يتم العثور على مستخدمين مميزين.</td></tr>
                        ) : (
                            subscriptions.map(user => (
                                <tr key={user.id} className="hover:bg-gray-800 hover:bg-opacity-30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-right">
                                            <p className="font-medium">{user.fullName || user.email}</p>
                                            <p className="text-xs text-gray-500">{user.subscriptionProductId || 'غير متوفر'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs">{user.subscriptionPlatform === 'admin_manual' ? 'يدوي' : 'جوجل بلاي'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-mono text-gray-400">
                                            {user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString('ar-SA') : 'دائم'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-xs text-blue-500 hover:underline">عرض التفاصيل</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
            <h4 className="text-xl font-bold mt-0.5">{value}</h4>
        </div>
    </div>
);

export default SubscriptionsPage;
