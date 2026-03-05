"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video,
    Plus,
    Search,
    Play,
    Trash2,
    Edit,
    MoreVertical,
    CheckCircle2,
    X,
    Upload,
    Link as LinkIcon,
    Film
} from 'lucide-react';
import { useVideos } from '@/hooks/useVideos';

export default function VideosPage() {
    const { videos, loading, handleAddVideo, handleDelete } = useVideos();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newVideo, setNewVideo] = useState({ title: '', url: '', category: 'قرآن' });

    const onSubmitNewVideo = async (e) => {
        e.preventDefault();
        try {
            await handleAddVideo(newVideo);
            setIsModalOpen(false);
            setNewVideo({ title: '', url: '', category: 'قرآن' });
        } catch (err) {
            console.error(err);
        }
    };

    const onDeleteVideo = async (id, source) => {
        if (confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
            try {
                await handleDelete(id, source);
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="text-right">
                    <h3 className="text-4xl font-black text-white tracking-tighter text-right">مكتبة الفيديو</h3>
                    <p className="text-[#8FB394]/40 font-bold text-sm mt-2 text-right">إدارة محتوى فيديوهات لغة الإشارة والدروس التعليمية.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8FB394]/30" size={18} />
                        <input
                            type="text"
                            placeholder="ابحث في المكتبة..."
                            className="w-full h-14 glass-input rounded-2xl pr-14 pl-6 text-sm font-medium text-white placeholder:text-[#8FB394]/20 focus:border-[#8FB394]/40 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="h-14 px-8 bg-[#8FB394] hover:bg-[#4A6351] text-[#0D1510] font-black rounded-2xl shadow-xl shadow-[#8FB394]/20 active:scale-95 transition-all flex items-center gap-3 shrink-0"
                    >
                        <Plus size={20} strokeWidth={3} />
                        <span className="text-xs">إضافة فيديو</span>
                    </button>
                </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence>
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-video glass-panel rounded-3xl animate-pulse bg-[#8FB394]/5" />
                        ))
                    ) : videos.map((video, idx) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group glass-card rounded-[2.5rem] overflow-hidden border-[#8FB394]/10 hover:border-[#8FB394]/40 relative flex flex-col h-full shadow-2xl"
                        >
                            {/* Thumbnail Placeholder with Sage Gradient */}
                            <div className="aspect-video bg-gradient-to-br from-[#4A6351]/40 to-[#0D1510] relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Film size={48} className="text-[#8FB394]/20 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <button className="h-16 w-16 bg-[#8FB394] text-[#0D1510] rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-all duration-500">
                                        <Play size={28} fill="currentColor" className="mr-1" />
                                    </button>
                                </div>
                                <div className="absolute top-4 right-4 bg-[#0D1510]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#8FB394]/20 text-[10px] font-black text-[#8FB394] uppercase tracking-widest">
                                    {video.category || 'عام'}
                                </div>
                            </div>

                            <div className="p-7 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-extrabold text-[#F5F2ED] text-base leading-snug line-clamp-2 text-right">{video.title}</h4>
                                    <button className="text-[#8FB394]/40 hover:text-[#8FB394] p-1 transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>

                                <div className="mt-auto pt-6 border-t border-[#8FB394]/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#8FB394]/40">
                                        <CheckCircle2 size={14} className="text-[#8FB394]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">مفعل</span>
                                    </div>
                                    <button
                                        onClick={() => onDeleteVideo(video.id, video.source)}
                                        className="text-[10px] font-bold text-rose-500/50 hover:text-rose-500 flex items-center gap-1.5 transition-all"
                                    >
                                        <Trash2 size={14} />
                                        حذف
                                    </button>
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
                            className="absolute inset-0 bg-[#0D1510]/95 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-panel w-full max-w-xl rounded-[3rem] p-12 relative overflow-hidden shadow-[0_0_100px_rgba(143,179,148,0.1)]"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-10 left-10 text-[#8FB394]/40 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="text-center mb-10 text-right">
                                <h4 className="text-3xl font-black text-white text-right">إضافة فيديو جديد</h4>
                                <p className="text-[#8FB394]/40 font-bold text-sm mt-2 text-right">أدخل تفاصيل الفيديو ليتم عرضه في التطبيق.</p>
                            </div>

                            <form onSubmit={onSubmitNewVideo} className="space-y-8">
                                <div className="space-y-3 text-right">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8FB394]/60 mr-4">عنوان الفيديو</label>
                                    <div className="relative">
                                        <Film className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8FB394]/20" size={20} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="سورة الفاتحة - لغة الإشارة"
                                            className="w-full h-14 glass-input rounded-2xl pr-14 pl-6 text-sm font-medium text-white placeholder:text-[#8FB394]/20"
                                            value={newVideo.title}
                                            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 text-right">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8FB394]/60 mr-4">رابط الفيديو (URL)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8FB394]/20" size={20} />
                                        <input
                                            type="url"
                                            required
                                            placeholder="https://youtube.com/..."
                                            className="w-full h-14 glass-input rounded-2xl pr-14 pl-6 text-sm font-medium text-white placeholder:text-[#8FB394]/20"
                                            value={newVideo.url}
                                            onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-right">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#8FB394]/60 mr-4">التصنيف</label>
                                        <select
                                            className="w-full h-14 glass-input rounded-2xl px-6 text-sm font-medium text-white appearance-none"
                                            value={newVideo.category}
                                            onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                                        >
                                            <option value="قرآن" className="bg-[#0D1510]">قرآن كريم</option>
                                            <option value="تعليم" className="bg-[#0D1510]">تعليم</option>
                                            <option value="أخرى" className="bg-[#0D1510]">أخرى</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end justify-center pb-1">
                                        <div className="p-4 bg-[#8FB394]/5 border border-[#8FB394]/10 rounded-2xl flex items-center justify-center gap-3 w-full">
                                            <Upload size={18} className="text-[#8FB394]" />
                                            <span className="text-[10px] font-black text-[#8FB394] uppercase tracking-widest">جاهز للرفع</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-16 bg-[#8FB394] text-[#0D1510] font-black rounded-2xl shadow-2xl shadow-[#8FB394]/20 hover:bg-white transition-all active:scale-95 text-sm mt-4"
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
