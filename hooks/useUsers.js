"use client";
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';

/**
 * Hook to manage users from both Firebase and Supabase
 * Uses real-time listeners for Firebase.
 */
export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fbUsers, setFbUsers] = useState([]);
    const [sbUsers, setSbUsers] = useState([]);

    // 1. Firebase Real-time Listener
    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersList = snapshot.docs.map(doc => ({
                id: `fb-${doc.id}`,
                ...doc.data(),
                source: 'firebase'
            }));
            setFbUsers(usersList);
            setLoading(false);
        }, (err) => {
            console.error("Firebase Snapshot Error:", err);
            setError(err);
        });

        return () => unsubscribe();
    }, []);

    // 2. Supabase Fetch (One-time or could be real-time too)
    useEffect(() => {
        async function fetchSupabaseUsers() {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const mapped = data.map(user => ({
                        id: `sb-${user.id}`,
                        displayName: user.full_name || user.display_name || user.email?.split('@')[0],
                        email: user.email,
                        subscriptionStatus: user.subscription_status || 'inactive',
                        createdAt: user.created_at ? { seconds: Math.floor(new Date(user.created_at).getTime() / 1000) } : null,
                        source: 'supabase'
                    }));
                    setSbUsers(mapped);
                }
            } catch (err) {
                console.warn("Supabase Fetch Error:", err);
            }
        }
        fetchSupabaseUsers();
    }, []);

    // 3. Merge Results
    useEffect(() => {
        setUsers([...fbUsers, ...sbUsers]);
    }, [fbUsers, sbUsers]);

    return { users, loading, error };
}
