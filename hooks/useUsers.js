"use client";
import { useState, useEffect, useCallback } from 'react';
import {
    collection, onSnapshot, query, orderBy,
    deleteDoc, doc, updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { updateUserAdmin, deleteUserAdmin } from '@/app/actions/userActions';

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
        try {
            if (user.source === 'firebase') {
                await deleteDoc(doc(db, "users", user.rawId));
            } else {
                const result = await deleteUserAdmin(user.rawId);
                if (!result.success) throw new Error(result.error);
                await fetchSupabaseUsers();
            }
        } catch (err) {
            console.error("Delete user error:", err);
            throw err;
        }
    }, [fetchSupabaseUsers]);

    const upgradeUser = useCallback(async (user, accountType = 'individual') => {
        try {
            if (user.source === 'firebase') {
                await updateDoc(doc(db, "users", user.rawId), {
                    subscriptionStatus: 'active',
                    subscriptionTier: 'premium',
                    accountType: accountType,
                    platform: 'manual'
                });
            } else {
                const result = await updateUserAdmin(user.rawId, {
                    subscription_status: 'active',
                    subscription_tier: 'premium',
                    account_type: accountType,
                    platform: 'manual'
                });
                if (!result.success) throw new Error(result.error);
                await fetchSupabaseUsers();
            }
        } catch (err) {
            console.error("Upgrade user error:", err);
            throw err;
        }
    }, [fetchSupabaseUsers]);

    const updateUser = useCallback(async (user, updates) => {
        try {
            if (user.source === 'firebase') {
                const fbUpdates = {};
                if (updates.displayName !== undefined) fbUpdates.displayName = updates.displayName;
                if (updates.email !== undefined) fbUpdates.email = updates.email;
                await updateDoc(doc(db, "users", user.rawId), fbUpdates);
            } else {
                const sbUpdates = {};
                if (updates.displayName !== undefined) sbUpdates.full_name = updates.displayName;
                if (updates.email !== undefined) sbUpdates.email = updates.email;
                const result = await updateUserAdmin(user.rawId, sbUpdates);
                if (!result.success) throw new Error(result.error);
            }
            await fetchSupabaseUsers();
        } catch (err) {
            console.error("Update user error:", err);
            throw err;
        }
    }, [fetchSupabaseUsers]);

    const changeAccountType = useCallback(async (user, accountType) => {
        console.log(`Attempting to change account type for ${user.id} to ${accountType}`);
        try {
            if (user.source === 'firebase') {
                await updateDoc(doc(db, "users", user.rawId), {
                    accountType: accountType,
                });
            } else {
                const result = await updateUserAdmin(user.rawId, { account_type: accountType });
                if (!result.success) {
                    console.error("Supabase error changing account type:", result.error);
                    throw new Error(result.error);
                }
            }
            await fetchSupabaseUsers();
            console.log("Account type updated successfully");
        } catch (err) {
            console.error("Failed to change account type:", err);
            throw err;
        }
    }, [fetchSupabaseUsers]);

    const cancelSubscription = useCallback(async (user) => {
        try {
            if (user.source === 'firebase') {
                await updateDoc(doc(db, "users", user.rawId), {
                    subscriptionTier: 'free',
                    subscriptionStatus: 'inactive'
                });
            } else {
                const result = await updateUserAdmin(user.rawId, { 
                    subscription_tier: 'free',
                    subscription_status: 'inactive'
                });
                if (!result.success) throw new Error(result.error);
            }
            await fetchSupabaseUsers();
        } catch (err) {
            console.error("Failed to cancel subscription:", err);
            throw err;
        }
    }, [fetchSupabaseUsers]);

    const extendSubscription = useCallback(async (user, days = 30) => {
        try {
            // Determine the base date to extend from
            let currentEndDate = new Date();
            if (user.endDate) {
                // Handle different date formats (Firebase Timestamp or ISO string)
                if (user.endDate.toDate) {
                    currentEndDate = user.endDate.toDate();
                } else if (user.endDate.seconds) {
                    currentEndDate = new Date(user.endDate.seconds * 1000);
                } else {
                    currentEndDate = new Date(user.endDate);
                }
            }

            // If the end date is in the past, start from today
            if (isNaN(currentEndDate.getTime()) || currentEndDate < new Date()) {
                currentEndDate = new Date();
            }

            // Add the days
            const newEndDate = new Date(currentEndDate);
            newEndDate.setDate(newEndDate.getDate() + days);

            if (user.source === 'firebase') {
                await updateDoc(doc(db, "users", user.rawId), {
                    endDate: newEndDate.toISOString()
                });
            } else {
                const result = await updateUserAdmin(user.rawId, { end_date: newEndDate.toISOString() });
                if (!result.success) throw new Error(result.error);
            }
            await fetchSupabaseUsers();
        } catch (err) {
            console.error("Failed to extend subscription:", err);
            throw err;
        }
    }, [fetchSupabaseUsers]);

    return { 
        users, loading, error, 
        deleteUser, upgradeUser, updateUser, changeAccountType,
        cancelSubscription, extendSubscription 
    };
}

