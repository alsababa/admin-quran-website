"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video, Plus, Search, Play, Trash2,
    MoreVertical, CheckCircle2, X, Upload, Link as LinkIcon, Film
} from 'lucide-react';
import { useVideos } from '@/hooks/useVideos';

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
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="text-right">
                    <h3 className="text-4xl font-black text-white tracking-tighter">مكتبة الفيديو</h3>
                    <p className="text-[#5AA564]/40 font-bold text-sm mt-2">إدارة محتوى فيديوهات لغة الإشارة والدروس التعليمية.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72 group">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5AA564]/30" size={17} />
                        <input
                            type="text"
                            placeholder="ابحث في المكتبة..."
                            className="w-full h-13 glass-input rounded-2xl pr-14 pl-6 py-3.5 text-sm font-medium text-white placeholder:text-[#5AA564]/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="h-13 px-7 py-3.5 bg-[#5AA564] hover:bg-[#D4AF37] text-[#0A0D1A] font-black rounded-2xl shadow-xl shadow-[#5AA564]/20 active:scale-95 transition-all flex items-center gap-2.5 shrink-0"
                    >
                        <Plus size={19} strokeWidth={3} />
                        <span className="text-xs">إضافة فيديو</span>
                    </button>
                </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-video glass-panel rounded-3xl animate-pulse bg-[#5AA564]/3" />
                        ))
                    ) : filteredVideos.map((video, idx) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group glass-card rounded-3xl overflow-hidden hover:border-[#5AA564]/40 relative flex flex-col shadow-xl"
                        >
                            {/* Thumbnail */}
                            <div className="aspect-video bg-gradient-to-br from-[#1E2448] to-[#0A0D1A] relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Film size={44} className="text-[#5AA564]/15 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <button className="h-14 w-14 bg-[#5AA564] text-[#0A0D1A] rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-all duration-500">
                                        <Play size={24} fill="currentColor" className="mr-0.5" />
                                    </button>
                                </div>
                                <div className="absolute top-3 right-3 bg-[#0A0D1A]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#5AA564]/20 text-[9px] font-black text-[#5AA564] uppercase tracking-widest">
                                    {video.category || 'عام'}
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-extrabold text-[#F5F0E8] text-sm leading-snug line-clamp-2 text-right flex-1">{video.title}</h4>
                                    <button className="text-[#5AA564]/30 hover:text-[#5AA564] p-1 transition-colors shrink-0 ml-2">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                                <div className="mt-auto pt-4 border-t border-[#5AA564]/8 flex items-center justify-between">
                                    <button
                                        onClick={() => onDeleteVideo(video.id, video.source)}
                                        className="text-[9px] font-bold text-rose-500/40 hover:text-rose-400 flex items-center gap-1.5 transition-all"
                                    >
                                        <Trash2 size={13} />حذف
                                    </button>
                                    <div className="flex items-center gap-1.5 text-[#5AA564]/40">
                                        <CheckCircle2 size={13} className="text-[#5AA564]" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">مفعّل</span>
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-[#0A0D1A]/95 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-panel w-full max-w-lg rounded-[3rem] p-12 relative overflow-hidden shadow-[0_0_80px_rgba(90,165,100,0.12)]"
                        >
                            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#5AA564]/40 to-transparent" />
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-8 left-8 text-[#5AA564]/40 hover:text-white transition-colors"
                            >
                                <X size={22} />
                            </button>

                            <div className="mb-8 text-right">
                                <h4 className="text-3xl font-black text-white">إضافة فيديو جديد</h4>
                                <p className="text-[#5AA564]/40 font-bold text-sm mt-1">أدخل تفاصيل الفيديو ليظهر في التطبيق.</p>
                            </div>

                            <form onSubmit={onSubmitNewVideo} className="space-y-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#5AA564]/60 pr-1">عنوان الفيديو</label>
                                    <div className="relative">
                                        <Film className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5AA564]/20" size={18} />
                                        <input
                                            type="text" required
                                            placeholder="سورة الفاتحة - لغة الإشارة"
                                            className="w-full h-13 glass-input rounded-2xl pr-14 pl-6 py-3.5 text-sm font-medium text-white placeholder:text-[#5AA564]/20"
                                            value={newVideo.title}
                                            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 text-right">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#5AA564]/60 pr-1">رابط الفيديو</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5AA564]/20" size={18} />
                                        <input
                                            type="url" required
                                            placeholder="https://youtube.com/..."
                                            className="w-full h-13 glass-input rounded-2xl pr-14 pl-6 py-3.5 text-sm font-medium text-white placeholder:text-[#5AA564]/20"
                                            value={newVideo.url}
                                            onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 text-right">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#5AA564]/60 pr-1">التصنيف</label>
                                    <select
                                        className="w-full h-13 glass-input rounded-2xl px-6 py-3.5 text-sm font-medium text-white appearance-none"
                                        value={newVideo.category}
                                        onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                                    >
                                        <option value="تلاوة" className="bg-[#0A0D1A]">تلاوة القرآن</option>
                                        <option value="فهم" className="bg-[#0A0D1A]">فهم القرآن</option>
                                        <option value="تعليم" className="bg-[#0A0D1A]">تعليم عام</option>
                                        <option value="أخرى" className="bg-[#0A0D1A]">أخرى</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-14 bg-[#5AA564] text-[#0A0D1A] font-black rounded-2xl shadow-xl shadow-[#5AA564]/20 hover:bg-[#D4AF37] transition-all active:scale-95 text-sm mt-2"
                                >
                                    تأكيد الإضافة ونشر الفيديو
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
