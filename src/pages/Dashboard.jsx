import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, CreditCard, LayoutDashboard, LogOut, BookOpen } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import UsersPage from './Users';
import SubscriptionsPage from './Subscriptions';

const Dashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
                <div className="p-6">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <BookOpen className="text-blue-500" />
                        <span>Quran SL Admin</span>
                    </h1>
                </div>

                <nav className="mt-6 flex-1 px-4 space-y-2 overflow-y-auto">
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
                    <SidebarLink to="/dashboard/users" icon={<Users size={20} />} label="Users" />
                    <SidebarLink to="/dashboard/subscriptions" icon={<CreditCard size={20} />} label="Subscriptions" />
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                            {user?.email?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.email}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-8 shrink-0">
                    <h2 className="font-semibold text-lg">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-xs px-2 py-1 bg-green-500 bg-opacity-10 text-green-500 rounded border border-green-500 border-opacity-20 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            System Online
                        </span>
                    </div>
                </header>

                <main className="p-8 flex-1 overflow-y-auto w-full">
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/subscriptions" element={<SubscriptionsPage />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

const SidebarLink = ({ to, icon, label }) => (
    <Link
        to={to}
        className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
    >
        {icon}
        <span className="font-medium">{label}</span>
    </Link>
);

const Overview = () => {
    const [stats, setStats] = useState({ totalUsers: 0, activeSubs: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const usersSnap = await getDocs(collection(db, "users"));
                const total = usersSnap.size;

                const subsSnap = await getDocs(query(collection(db, "users"), where("subscriptionStatus", "==", "active")));
                const active = subsSnap.size;

                setStats({
                    totalUsers: total,
                    activeSubs: active,
                    revenue: active * 10
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Users" value={loading ? '...' : stats.totalUsers} subtitle="Registered accounts" />
                <StatCard title="Active Subscriptions" value={loading ? '...' : stats.activeSubs} subtitle="Premium access" />
                <StatCard title="Revenue (estimate)" value={loading ? '...' : `${stats.revenue} SAR`} subtitle="Per month" />
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
                <h4 className="font-semibold text-lg">Quick Actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickAction to="/dashboard/users" label="View Users" description="Account details & history" />
                    <QuickAction to="/dashboard/subscriptions" label="Update Plans" description="Manual premium granting" />
                    <QuickAction to="/dashboard/users" label="Support" description="Helping user issues" />
                    <div className="p-4 bg-gray-800 bg-opacity-40 rounded-lg border border-gray-700 flex flex-col justify-center opacity-50 cursor-not-allowed">
                        <span className="font-medium text-sm">Reports</span>
                        <span className="text-xs text-gray-500">Coming soon...</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, subtitle }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-2">{value}</h3>
        <p className="text-xs text-blue-500 mt-1">{subtitle}</p>
    </div>
);

const QuickAction = ({ to, label, description }) => (
    <Link
        to={to}
        className="p-4 bg-gray-800 bg-opacity-40 rounded-lg border border-gray-700 hover:border-blue-500 transition-all group"
    >
        <span className="font-medium text-sm group-hover:text-blue-500 transition-colors">{label}</span>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
    </Link>
);

export default Dashboard;

