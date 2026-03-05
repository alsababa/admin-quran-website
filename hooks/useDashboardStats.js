"use client";
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';

export function useDashboardStats() {
    const [stats, setStats] = useState({ totalUsers: 0, activeSubs: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    const [fbCounts, setFbCounts] = useState({ total: 0, active: 0 });
    const [sbCounts, setSbCounts] = useState({ total: 0, active: 0 });

    // 1. Firebase Real-time Stats
    useEffect(() => {
        // We can't use simple 'count' queries with onSnapshot easily for the whole collection 
        // without downloading docs, unless we use a specialized counter doc.
        // For small/medium apps, downloading the snapshot and checking size is common.
        const usersCol = collection(db, "users");

        const unsubscribe = onSnapshot(usersCol, (snapshot) => {
            const total = snapshot.size;
            const active = snapshot.docs.filter(doc => doc.data().subscriptionStatus === 'active').length;
            setFbCounts({ total, active });
        }, (err) => {
            console.error("Firebase Dashboard Stats Error:", err);
        });

        return () => unsubscribe();
    }, []);

    // 2. Supabase Stats
    useEffect(() => {
        async function fetchSbStats() {
            try {
                const { count: totalCount } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true });

                const { count: activeCount } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .eq('subscription_status', 'active');

                setSbCounts({ total: totalCount || 0, active: activeCount || 0 });
            } catch (err) {
                console.warn("Supabase Stats Error:", err);
            }
        }
        fetchSbStats();
    }, []);

    // 3. Coordinate Loading and Merging
    useEffect(() => {
        const totalUsers = fbCounts.total + sbCounts.total;
        const activeSubs = fbCounts.active + sbCounts.active;

        setStats({
            totalUsers,
            activeSubs,
            revenue: activeSubs * 10
        });

        // Assume loaded once we have some data or error
        setLoading(false);
    }, [fbCounts, sbCounts]);

    return { stats, loading };
}
