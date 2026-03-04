"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video,
    Plus,
    Trash2,
    ExternalLink,
    Play,
    X,
    Filter,
    Layers,
    Clock,
    Check
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const VideoCard = ({ video, onDelete, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-[2rem] overflow-hidden group hover:border-blue-500/30 transition-all duration-500"
    >
        <div className="aspect-video bg-slate-800/50 flex items-center justify-center relative overflow-hidden">
            <Video size={48} className="text-slate-700 transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/40 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                >
                    <Play fill="currentColor" size={24} className="mr-1" />
                </motion.div>
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 bg-slate-950/60 backdrop-blur-md rounded-full border border-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {video.category || 'عام'}
            </div>
        </div>

        <div className="p-6">
            <div className="flex justify-between items-start gap-4">
                <div className="text-right">
                    <h4 className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">{video.title}</h4>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {video.createdAt ? new Date(video.createdAt).toLocaleDateString('ar-SA') : 'تاريخ غير معروف'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Layers size={12} />
                            {video.category}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
                <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800/50 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-all text-xs font-bold text-slate-400"
                >
                    <ExternalLink size={14} />
                    <span>فتح الرابط</span>
                </a>
                <button
                    onClick={() => onDelete(video.id)}
                    className="p-2.5 bg-red-500/5 hover:bg-red-500/20 text-red-500 border border-red-500/10 rounded-xl transition-all active:scale-90"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    </motion.div>
);

export default function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newVideo, setNewVideo] = useState({ title: '', url: '', category: 'Quran' });

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "videos"));
            const querySnapshot = await getDocs(q);
            const videosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setVideos(videosData);
        } catch (error) {
            console.error("Error fetching videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "videos"), {
                ...newVideo,
                createdAt: new Date().toISOString()
            });
            setNewVideo({ title: '', url: '', category: 'Quran' });
            setIsModalOpen(false);
            fetchVideos();
        } catch (error) {
            console.error("Error adding video:", error);
        }
    };

    const handleDeleteVideo = async (id) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا الفيديو؟")) return;
        try {
            await deleteDoc(doc(db, "videos", id));
            fetchVideos();
        } catch (error) {
            console.error("Error deleting video:", error);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header Content */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-8 rounded-[2.5rem]">
                <div className="text-right">
                    <h3 className="text-3xl font-black tracking-tight text-white mb-2">إدارة المحتوى</h3>
                    <p className="text-slate-500 text-sm font-medium">رفع وتصنيف فيديوهات لغة الإشارة للقرآن الكريم.</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-[1.5rem] font-black transition-all shadow-xl shadow-blue-500/20 active:scale-95 text-sm"
                    >
                        <Plus size={20} />
                        <span>إضافة فيديو جديد</span>
                    </button>
                    <button className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-slate-400 hover:text-blue-400 transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Grid Content */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="py-32 text-center"
                    >
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 font-bold">جاري تحميل المكتبة...</p>
                    </motion.div>
                ) : videos.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="py-32 flex flex-col items-center opacity-30 grayscale"
                    >
                        <div className="w-24 h-24 bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-6 border border-slate-700">
                            <Video size={48} />
                        </div>
                        <h4 className="text-2xl font-black">المكتبة فارغة حالياً</h4>
                        <p className="mt-2 font-medium">ابدأ بإضافة أول فيديو لعرضه هنا.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.map((video, idx) => (
                            <VideoCard key={video.id} video={video} index={idx} onDelete={handleDeleteVideo} />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Premium Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-slate-900 border border-slate-800/60 rounded-[3rem] p-10 w-full max-w-xl shadow-2xl relative z-10"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-8 left-8 p-3 hover:bg-slate-800 rounded-2xl text-slate-500 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-10 text-right">
                                <h3 className="text-3xl font-black text-white mb-2">إضافة محتوى جديد</h3>
                                <p className="text-slate-500 text-sm">أدخل تفاصيل الفيديو للتخزين السحابي.</p>
                            </div>

                            <form onSubmit={handleAddVideo} className="space-y-6 text-right">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3 pr-2">عنوان الفيديو</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                                        placeholder="مثال: سورة الواقعة - لغة الإشارة"
                                        value={newVideo.title}
                                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3 pr-2">رابط الفيديو (URL)</label>
                                    <input
                                        type="url"
                                        required
                                        className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl px-6 py-4 text-white text-left focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                                        placeholder="https://youtube.com/..."
                                        value={newVideo.url}
                                        onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3 pr-2">التصنيف</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Quran', 'Meaning', 'Lesson'].map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setNewVideo({ ...newVideo, category: cat })}
                                                className={`py-3 rounded-2xl border transition-all text-xs font-bold ${newVideo.category === cat
                                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                        : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-500'
                                                    }`}
                                            >
                                                {cat === 'Quran' ? 'قرآن' : cat === 'Meaning' ? 'معاني' : 'دروس'}
                                                {newVideo.category === cat && <Check size={14} className="inline mr-1" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                                    >
                                        تأكيد الإضافة
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-8 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-5 rounded-[1.5rem] transition-all"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
