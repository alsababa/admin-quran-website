"use client";
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function usePayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, "moyasar_payments"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const paymentsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPayments(paymentsList);
            setLoading(false);
        }, (err) => {
            console.error("Firebase Snapshot Error (Payments):", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { payments, loading, error };
}
