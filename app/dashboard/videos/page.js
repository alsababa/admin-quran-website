"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video, Plus, Search, Play, Trash2,
    MoreVertical, CheckCircle2, X, Upload, Link as LinkIcon, Film,
    ArrowLeft
} from 'lucide-react';
import { useVideos } from '@/hooks/useVideos';

// ── Shared Header Component ──────────────────────────────
const SectionHeader = ({ title, subtitle, accentColor = "#5AA564" }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="text-right">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter flex items-center justify-end gap-5">
                {title}
                <div 
                    className="w-2 h-12 rounded-full shadow-lg"
                    style={{ background: `linear-gradient(to bottom, ${accentColor}, transparent)` }} 
                />
            </h1>
            <p className="text-[#5AA564] font-black text-[11px] mt-4 tracking-[0.4em] uppercase opacity-40">{subtitle}</p>
        </div>
    </div>
);

// ── Modal Backdrop ────────────────────────────────────────
const ModalBackdrop = ({ onClick }) => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClick}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
    />
);

export default function VideosPage() {
    const { videos, loading, handleAddVideo, handleDelete } = useVideos();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newVideo, setNewVideo] = useState({ title: '', url: '', category: 'قرآن' });
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVideos = videos.filter(v =>
        v.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onSubmitNewVideo = async (e) => {
        e.preventDefault();
        try {
            await handleAddVideo(newVideo);
            setIsModalOpen(false);
            setNewVideo({ title: '', url: '', category: 'قرآن' });
        } catch (err) { console.error(err); }
    };

    const onDeleteVideo = async (id, source) => {
        if (confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
            try { await handleDelete(id, source); } catch (err) { console.error(err); }
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <SectionHeader 
                    title="مكتبة الفيديو" 
                    subtitle="Universal Video Library" 
                />

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5AA564] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="ابحث في المكتبة..."
                            className="w-full h-15 bg-white border border-gray-100 rounded-[2rem] pr-14 pl-6 py-3.5 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#5AA564]/30 shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="h-15 px-8 bg-[#5AA564] text-white font-black rounded-[2rem] shadow-xl shadow-[#5AA564]/10 hover:bg-gray-900 transition-all active:scale-95 flex items-center gap-3 shrink-0"
                    >
                        <Plus size={20} strokeWidth={3} />
                        <span className="text-sm">إضافة فيديو</span>
                    </button>
                </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence>
                    {loading ? (
                        [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-video glass-panel rounded-[2.5rem] animate-pulse bg-gray-50 border-gray-100" />
                        ))
                    ) : filteredVideos.map((video, idx) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="group glass-card rounded-[2.5rem] overflow-hidden hover:glass-card-hover border-transparent relative flex flex-col shadow-xl transition-all duration-700"
                        >
                            {/* Thumbnail Area */}
                            <div className="aspect-video bg-gray-50 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-20 transition-opacity">
                                    <Film size={64} strokeWidth={1} className="text-[#5AA564]" />
                                </div>
                                <div className="absolute inset-0 bg-gray-900/5 transition-opacity group-hover:bg-gray-900/10" />
                                
                                {/* Hover Play Button */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[4px]">
                                    <button className="h-16 w-16 bg-white text-[#5AA564] rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500 border border-gray-100">
                                        <Play size={28} fill="currentColor" className="mr-0.5" />
                                    </button>
                                </div>
                                
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-gray-100 text-[9px] font-black text-[#5AA564] uppercase tracking-[0.2em] shadow-sm">
                                    {video.category || 'GENERAL'}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1 bg-white">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-black text-gray-900 text-base leading-snug line-clamp-2 text-right flex-1">{video.title}</h4>
                                    <button className="text-gray-200 hover:text-[#5AA564] p-1 transition-colors shrink-0 ml-3">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                                <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                                    <button
                                        onClick={() => onDeleteVideo(video.id, video.source)}
                                        className="text-[10px] font-black text-rose-300 hover:text-rose-500 flex items-center gap-1.5 transition-all uppercase tracking-widest"
                                    >
                                        <Trash2 size={14} /> REMOVE
                                    </button>
                                    <div className="flex items-center gap-2 text-emerald-500/40 group-hover:text-emerald-500 transition-colors">
                                        <CheckCircle2 size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Video Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-right" dir="rtl">
                        <ModalBackdrop onClick={() => setIsModalOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-panel w-full max-w-lg rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl bg-white/95 backdrop-blur-3xl"
                        >
                            <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-[#5AA564]/40 to-transparent" />
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-8 left-8 text-gray-300 hover:text-gray-900 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-10">
                                <h4 className="text-4xl font-black text-gray-900 tracking-tighter">إضافة فيديو جديد</h4>
                                <p className="text-[#5AA564] font-black text-[11px] mt-2 tracking-[0.3em] uppercase opacity-40">Add New Media Asset</p>
                            </div>

                            <form onSubmit={onSubmitNewVideo} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pr-1">عنوان الفيديو</label>
                                    <div className="relative">
                                        <Film className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                        <input
                                            type="text" required
                                            placeholder="سورة الفاتحة - لغة الإشارة"
                                            className="w-full h-15 bg-gray-50 border border-gray-100 rounded-2xl pr-14 pl-6 py-3.5 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#5AA564]/30 transition-all shadow-sm"
                                            value={newVideo.title}
                                            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pr-1">رابط الفيديو</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                        <input
                                            type="url" required
                                            placeholder="https://youtube.com/..."
                                            className="w-full h-15 bg-gray-50 border border-gray-100 rounded-2xl pr-14 pl-6 py-3.5 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#5AA564]/30 transition-all shadow-sm"
                                            value={newVideo.url}
                                            onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pr-1">التصنيف الرئيسي</label>
                                    <select
                                        className="w-full h-15 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#5AA564]/30 transition-all cursor-pointer shadow-sm appearance-none"
                                        style={{ backgroundImage: 'none' }}
                                        value={newVideo.category}
                                        onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                                    >
                                        <option value="تلاوة">تلاوة القرآن</option>
                                        <option value="فهم">فهم القرآن</option>
                                        <option value="تعليم">تعليم عام</option>
                                        <option value="أخرى">أخرى</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-16 bg-[#5AA564] text-white font-black rounded-2xl shadow-xl shadow-[#5AA564]/10 hover:bg-gray-900 transition-all active:scale-95 text-base mt-2"
                                >
                                    نشر في المكتبة الآن
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
