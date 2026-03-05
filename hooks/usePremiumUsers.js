"use client";
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';

export function usePremiumUsers() {
    const [premiumUsers, setPremiumUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [fbData, setFbData] = useState([]);
    const [sbData, setSbData] = useState([]);

    // 1. Firebase Real-time Listener for Active Subscriptions
    useEffect(() => {
        const fbQuery = query(collection(db, "users"), where("subscriptionStatus", "==", "active"));

        const unsubscribe = onSnapshot(fbQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: `fb-${doc.id}`,
                ...doc.data(),
                source: 'firebase'
            }));
            setFbData(data);
        }, (err) => {
            console.error("Firebase Snapshot Error (Premium Users):", err);
            setError(err);
        });

        return () => unsubscribe();
    }, []);

    // 2. Supabase Fetch for Active Subscriptions
    useEffect(() => {
        async function fetchSupabasePremiumUsers() {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('subscription_status', 'active');

                if (error) throw error;

                if (data) {
                    const mapped = data.map(user => ({
                        id: `sb-${user.id}`,
                        displayName: user.full_name || user.display_name || user.email?.split('@')[0],
                        email: user.email,
                        subscriptionStatus: 'active',
                        createdAt: user.created_at ? { seconds: Math.floor(new Date(user.created_at).getTime() / 1000) } : null,
                        source: 'supabase'
                    }));
                    setSbData(mapped);
                }
            } catch (err) {
                console.warn("Supabase Fetch Error (Premium Users):", err);
            }
        }
        fetchSupabasePremiumUsers();
    }, []);

    // 3. Merge Results
    useEffect(() => {
        setPremiumUsers([...fbData, ...sbData]);
        setLoading(false);
    }, [fbData, sbData]);

    return { premiumUsers, loading, error };
}
