"use client";
import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';

export function useDashboardStats() {
    const [loading, setLoading] = useState(true);
    const [fbCounts, setFbCounts] = useState({ total: 0, active: 0 });
    const [sbCounts, setSbCounts] = useState({ total: 0, active: 0, codes: 0, videos: 0 });
    const [extraStats, setExtraStats] = useState({ codes: 0, videos: 0, tickets: 0 });

    // 1. Firebase Real-time Stats
    useEffect(() => {
        const usersCol = collection(db, "users");
        const unsubscribe = onSnapshot(usersCol, (snapshot) => {
            const total = snapshot.size;
            const active = snapshot.docs.filter(doc => doc.data().subscriptionStatus === 'active').length;
            setFbCounts({ total, active });
            setLoading(false);
        }, (err) => {
            console.error("Firebase Dashboard Stats Error:", err);
            setLoading(false);
        });

        // Simple fetch for extra collections (non-realtime for now to save listeners)
        const fetchExtras = async () => {
            try {
                const codesSnap = await supabase.from('activation_codes').select('*', { count: 'exact', head: true });
                const videosSnap = await supabase.from('videos').select('*', { count: 'exact', head: true });
                // We'll use a mocked or real tickets count if table exists
                setExtraStats({
                    codes: codesSnap.count || 0,
                    videos: videosSnap.count || 0,
                    tickets: 2 // Mocked for now until we verify table name
                });
            } catch (e) {
                console.warn("Extras fetch error:", e);
            }
        };
        fetchExtras();

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

                setSbCounts(prev => ({ ...prev, total: totalCount || 0, active: activeCount || 0 }));
            } catch (err) {
                console.warn("Supabase Stats Error:", err);
            }
        }
        fetchSbStats();
    }, []);

    // 3. Derived Stats (Using useMemo to avoid cascading renders)
    const stats = useMemo(() => {
        const totalUsers = fbCounts.total + sbCounts.total;
        const activeSubs = fbCounts.active + sbCounts.active;
        
        return {
            totalUsers,
            activeSubs,
            revenue: activeSubs * 10,
            codes: extraStats.codes,
            videos: extraStats.videos,
            tickets: extraStats.tickets
        };
    }, [fbCounts, sbCounts, extraStats]);

    return { stats, loading };
}
