"use client";
import { useState, useEffect, useCallback } from 'react';
import {
    collection, onSnapshot, query, orderBy,
    deleteDoc, doc, updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';

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
                rawId: doc.id,
                ...doc.data(),
                accountType: doc.data().accountType || 'individual',
                platform: doc.data().platform || 'manual',
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

    // 2. Supabase Fetch
    const fetchSupabaseUsers = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const mapped = data.map(user => ({
                    id: `sb-${user.id}`,
                    rawId: user.id,
                    displayName: user.full_name || user.display_name || user.email?.split('@')[0],
                    email: user.email,
                    subscriptionStatus: user.subscription_status || 'inactive',
                    subscriptionTier: user.subscription_tier || 'free',
                    accountType: user.account_type || 'individual',
                    platform: user.platform || 'manual',
                    createdAt: user.created_at ? { seconds: Math.floor(new Date(user.created_at).getTime() / 1000) } : null,
                    source: 'supabase'
                }));
                setSbUsers(mapped);
            }
        } catch (err) {
            console.warn("Supabase Fetch Error:", err);
        }
    }, []);

    useEffect(() => { fetchSupabaseUsers(); }, [fetchSupabaseUsers]);

    // 3. Merge Results
    useEffect(() => {
        setUsers([...fbUsers, ...sbUsers]);
    }, [fbUsers, sbUsers]);

    // ── Mutations ────────────────────────────────────────────

    const deleteUser = useCallback(async (user) => {
        if (user.source === 'firebase') {
            await deleteDoc(doc(db, "users", user.rawId));
        } else {
            const { error } = await supabase.from('users').delete().eq('id', user.rawId);
            if (error) throw error;
            await fetchSupabaseUsers();
        }
    }, [fetchSupabaseUsers]);

    const upgradeUser = useCallback(async (user, accountType = 'individual') => {
        if (user.source === 'firebase') {
            await updateDoc(doc(db, "users", user.rawId), {
                subscriptionStatus: 'active',
                subscriptionTier: 'premium',
                accountType: accountType,
                platform: 'manual'
            });
        } else {
            await supabase
                .from('users')
                .update({ 
                    subscription_status: 'active', 
                    subscription_tier: 'premium',
                    account_type: accountType,
                    platform: 'manual'
                })
                .eq('id', user.rawId);
            await fetchSupabaseUsers();
        }
    }, [fetchSupabaseUsers]);

    const updateUser = useCallback(async (user, updates) => {
        if (user.source === 'firebase') {
            const fbUpdates = {};
            if (updates.displayName !== undefined) fbUpdates.displayName = updates.displayName;
            if (updates.email !== undefined) fbUpdates.email = updates.email;
            await updateDoc(doc(db, "users", user.rawId), fbUpdates);
        } else {
            const sbUpdates = {};
            if (updates.displayName !== undefined) sbUpdates.full_name = updates.displayName;
            if (updates.email !== undefined) sbUpdates.email = updates.email;
            const { error } = await supabase.from('users').update(sbUpdates).eq('id', user.rawId);
            if (error) throw error;
            await fetchSupabaseUsers();
        }
    }, [fetchSupabaseUsers]);

    const changeAccountType = useCallback(async (user, accountType) => {
        if (user.source === 'firebase') {
            await updateDoc(doc(db, "users", user.rawId), {
                accountType: accountType,
            });
        } else {
            const { error } = await supabase
                .from('users')
                .update({ account_type: accountType })
                .eq('id', user.rawId);
            if (error) throw error;
            await fetchSupabaseUsers();
        }
    }, [fetchSupabaseUsers]);

    return { users, loading, error, deleteUser, upgradeUser, updateUser, changeAccountType };
}

