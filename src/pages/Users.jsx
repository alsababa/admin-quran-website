import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Search, UserCog, Trash2, Mail, Calendar, ShieldCheck } from 'lucide-react';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "users"));
            const querySnapshot = await getDocs(q);
            const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-right">
                    <h3 className="text-2xl font-bold">إدارة المستخدمين</h3>
                    <p className="text-gray-400 text-sm">مراقبة وإدارة مستخدمي التطبيق.</p>
                </div>
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="البحث بالاسم أو البريد الإلكتروني..."
                        className="pr-10 pl-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none text-right"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-right text-sm">
                    <thead className="bg-gray-800 bg-opacity-50 border-b border-gray-800 text-gray-400">
                        <tr>
                            <th className="px-6 py-4 font-semibold">بيانات المستخدم</th>
                            <th className="px-6 py-4 font-semibold">الفئة</th>
                            <th className="px-6 py-4 font-semibold">الحالة</th>
                            <th className="px-6 py-4 font-semibold">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">جاري تحميل المستخدمين...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">لم يتم العثور على مستخدمين.</td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-800 hover:bg-opacity-30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-500 bg-opacity-10 text-blue-500 flex items-center justify-center font-bold">
                                                {user.fullName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{user.fullName || 'بدون اسم'}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${user.subscriptionTier === 'premium' ? 'bg-amber-500 bg-opacity-10 text-amber-500 border border-amber-500 border-opacity-20' : 'bg-gray-700 text-gray-400'
                                            }`}>
                                            {user.subscriptionTier === 'premium' ? 'مميز' : 'مجاني'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1.5 text-xs ${user.subscriptionStatus === 'active' ? 'text-green-500' : 'text-gray-500'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                            {user.subscriptionStatus === 'active' ? 'نشط' : 'غير نشط'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors" title="إدارة المستخدم">
                                                <UserCog size={18} />
                                            </button>
                                        </div>
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

export default UsersPage;
