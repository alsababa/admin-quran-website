"use client";
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';

export function useVideos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [fbData, setFbData] = useState([]);
    const [sbData, setSbData] = useState([]);

    // 1. Firebase Real-time Listener
    useEffect(() => {
        const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: `fb-${doc.id}`,
                ...doc.data(),
                source: 'firebase'
            }));
            setFbData(data);
        }, (err) => {
            console.error("Firebase Snapshot Error (Videos):", err);
            setError(err);
        });

        return () => unsubscribe();
    }, []);

    // 2. Supabase Fetch 
    const fetchSupabaseVideos = async () => {
        try {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const mapped = data.map(video => ({
                    id: `sb-${video.id}`,
                    title: video.title,
                    url: video.url,
                    category: video.category || 'عام',
                    createdAt: video.created_at ? { seconds: Math.floor(new Date(video.created_at).getTime() / 1000) } : null,
                    source: 'supabase'
                }));
                setSbData(mapped);
            }
        } catch (err) {
            console.warn("Supabase Fetch Error (Videos):", err);
        }
    };

    useEffect(() => {
        fetchSupabaseVideos();
    }, []);

    // 3. Merge Results
    useEffect(() => {
        setVideos([...fbData, ...sbData]);
        setLoading(false);
    }, [fbData, sbData]);

    // Handle add video (currently only to Firebase, could add dual support)
    const handleAddVideo = async (newVideo) => {
        try {
            await addDoc(collection(db, "videos"), {
                ...newVideo,
                createdAt: serverTimestamp()
            });
            // Supabase fetch isn't realtime here by default, 
            // but we only add to Firebase for now.
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const handleDelete = async (id, source) => {
        try {
            if (source === 'firebase' || id.startsWith('fb-')) {
                const docId = id.replace('fb-', '');
                await deleteDoc(doc(db, "videos", docId));
            } else if (source === 'supabase' || id.startsWith('sb-')) {
                const docId = id.replace('sb-', '');
                await supabase.from('videos').delete().eq('id', docId);
                await fetchSupabaseVideos(); // Refresh supabase list
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    return { videos, loading, error, handleAddVideo, handleDelete };
}
