"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Search,
    Filter,
    ChevronDown,
    CheckCircle2,
    Clock,
    User,
    Mail,
    Phone,
    Paperclip,
    Send,
    ArrowLeft
} from 'lucide-react';

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

// بيانات وهمية مؤقتة حتى نربطها بقاعدة البيانات
const initialTickets = [
    {
        id: 'TKT-1024',
        user: { name: 'أحمد محمد', email: 'ahmed@example.com', phone: '+966 50 123 4567' },
        subject: 'مشكلة في تشغيل الفيديو',
        status: 'open',
        priority: 'high',
        date: '2024-05-15',
        messages: [
            { id: 1, sender: 'user', text: 'السلام عليكم، عندي مشكلة الفيديوهات ما تفتح عندي في التطبيق', time: '10:30 ص' }
        ]
    },
    {
        id: 'TKT-1025',
        user: { name: 'سارة خالد', email: 'sara@example.com', phone: '+966 55 987 6543' },
        subject: 'استفسار عن باقة الاشتراك',
        status: 'closed',
        priority: 'normal',
        date: '2024-05-14',
        messages: [
            { id: 1, sender: 'user', text: 'كيف ممكن أجدد اشتراكي السنوي؟', time: '02:15 م' },
            { id: 2, sender: 'admin', text: 'أهلاً بك أستاذة سارة، يمكنك التجديد من خلال صفحة الاشتراكات في التطبيق بخطوات بسيطة.', time: '02:45 م' }
        ]
    }
];

export default function SupportPage() {
    const [tickets, setTickets] = useState(initialTickets);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTickets = tickets.filter(t => 
        t.subject.includes(searchTerm) || 
        t.user.name.includes(searchTerm) || 
        t.id.includes(searchTerm)
    );

    const handleSendReply = (e) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedTicket) return;

        const updatedTickets = tickets.map(t => {
            if (t.id === selectedTicket.id) {
                return {
                    ...t,
                    messages: [...t.messages, { id: Date.now(), sender: 'admin', text: replyText, time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) }]
                };
            }
            return t;
        });

        setTickets(updatedTickets);
        setSelectedTicket(updatedTickets.find(t => t.id === selectedTicket.id));
        setReplyText('');
    };

    return (
        <div className="space-y-12 pb-20 h-full flex flex-col">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 shrink-0">
                <SectionHeader 
                    title="الدعم الفني" 
                    subtitle="Technical Support Desk" 
                />

                <div className="relative w-full md:w-96 group">
                     <div className="absolute -inset-1 bg-gradient-to-r from-[#5AA564]/20 to-blue-400/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                     <div className="relative flex items-center bg-white border border-gray-100 rounded-[2rem] px-6 py-4 shadow-sm group-hover:border-[#5AA564]/30 transition-all">
                        <Search className="text-gray-300 group-hover:text-[#5AA564] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="رقم التذكرة، اسم المستخدم..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-gray-900 text-sm font-bold mr-4 w-full placeholder:text-gray-300"
                        />
                    </div>
                </div>
            </div>

            {/* Support Desk Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px]">
                
                {/* Tickets List */}
                <div className="lg:col-span-5 xl:col-span-4 glass-panel border-gray-100 rounded-[3.5rem] flex flex-col overflow-hidden bg-white/50 backdrop-blur-xl shadow-2xl">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h4 className="font-black text-gray-900 text-sm flex items-center gap-3">
                            <MessageSquare className="text-[#5AA564]" size={20} />
                            التذاكر الواردة
                        </h4>
                        <span className="bg-emerald-50 text-[#5AA564] px-4 py-1 text-[10px] font-black rounded-full border border-emerald-100 uppercase tracking-widest shadow-sm">
                            {filteredTickets.length} ACTIVE
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                        {filteredTickets.map(ticket => (
                            <motion.div 
                                key={ticket.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`p-6 rounded-[2rem] cursor-pointer transition-all border ${
                                    selectedTicket?.id === ticket.id 
                                    ? 'bg-white border-[#5AA564]/30 shadow-xl shadow-gray-200/50 scale-[1.02]' 
                                    : 'bg-white/40 border-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-lg'
                                } group`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${ticket.status === 'open' ? 'bg-[#5AA564] shadow-[0_0_12px_rgba(90,165,100,0.5)] animate-pulse' : 'bg-gray-200'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 group-hover:text-[#5AA564] transition-colors">{ticket.id}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold">{ticket.date}</span>
                                </div>
                                <h5 className="font-black text-gray-900 text-base mb-1.5">{ticket.subject}</h5>
                                <p className="text-xs font-bold text-gray-400 truncate">{ticket.user.name}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Ticket Details & Chat Area */}
                <div className="lg:col-span-7 xl:col-span-8 glass-panel border-gray-100 rounded-[3.5rem] flex flex-col overflow-hidden relative shadow-3xl bg-white/50 backdrop-blur-xl">
                    {selectedTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-10 border-b border-gray-50 bg-white/70 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <span className="px-4 py-1.5 bg-gray-50 border border-gray-100 text-gray-400 text-[10px] font-black rounded-lg uppercase tracking-[0.2em]">
                                            {selectedTicket.id}
                                        </span>
                                        <h4 className="text-2xl font-black text-gray-900 tracking-tight">{selectedTicket.subject}</h4>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-400">
                                        <span className="flex items-center gap-2"><User size={14} className="opacity-40" /> {selectedTicket.user.name}</span>
                                        <span className="flex items-center gap-2"><Mail size={14} className="opacity-40" /> {selectedTicket.user.email}</span>
                                        <span className="flex items-center gap-2"><Phone size={14} className="opacity-40" /> {selectedTicket.user.phone}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 shrink-0">
                                    <button className={`h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${
                                        selectedTicket.status === 'closed' 
                                        ? 'bg-rose-50 text-rose-500 border-rose-100' 
                                        : 'bg-[#5AA564] text-white border-[#5AA564] hover:bg-gray-900'
                                    }`}>
                                        {selectedTicket.status === 'open' ? 'إغلاق التذكرة' : 'مغلقة'}
                                    </button>
                                </div>
                            </div>

                            {/* Chat History */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-gradient-to-b from-transparent to-gray-50/30">
                                {selectedTicket.messages.map((msg, idx) => (
                                    <motion.div 
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`flex flex-col max-w-[85%] ${msg.sender === 'admin' ? 'mr-auto items-end text-left' : 'ml-auto items-start text-right'}`}
                                    >
                                        <div className={`flex items-center gap-3 mb-2 px-2 uppercase tracking-widest font-black text-[9px] ${msg.sender === 'admin' ? 'flex-row' : 'flex-row-reverse'}`}>
                                            <span className="text-gray-300">{msg.time}</span>
                                            <span className={msg.sender === 'admin' ? 'text-[#5AA564]' : 'text-blue-400'}>{msg.sender === 'admin' ? 'ADMIN SUPPORT' : 'USER MESSAGE'}</span>
                                        </div>
                                        <div className={`p-6 rounded-[2.5rem] text-sm font-bold leading-relaxed shadow-lg ${
                                            msg.sender === 'admin' 
                                            ? 'bg-emerald-600 text-white shadow-emerald-500/10 rounded-tl-none' 
                                            : 'bg-white border border-gray-100 text-gray-900 shadow-gray-200/50 rounded-tr-none'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Chat Entry Area */}
                            <div className="p-8 bg-white border-t border-gray-50 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                                <form onSubmit={handleSendReply} className="flex items-end gap-5">
                                    <div className="flex-1 relative group">
                                        <textarea 
                                            placeholder="اكتب ردك الاحترافي هنا..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-5 pr-14 min-h-[70px] max-h-[200px] text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#5AA564]/30 focus:bg-white transition-all shadow-sm custom-scrollbar"
                                            rows="2"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendReply(e);
                                                }
                                            }}
                                        />
                                        <button type="button" className="absolute top-5 right-6 text-gray-300 hover:text-[#5AA564] transition-colors">
                                            <Paperclip size={20} />
                                        </button>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={!replyText.trim()}
                                        className="h-16 w-16 shrink-0 bg-[#5AA564] text-white rounded-[1.5rem] flex items-center justify-center hover:bg-gray-900 transition-all disabled:opacity-30 disabled:hover:bg-[#5AA564] shadow-xl shadow-[#5AA564]/20 active:scale-90"
                                    >
                                        <Send size={24} className="mr-0.5 mt-0.5" />
                                    </button>
                                </form>
                                <p className="text-center text-[10px] text-gray-300 mt-4 font-black uppercase tracking-widest opacity-60">Press ENTER to send professional reply</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                            <div className="h-32 w-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mb-8 shadow-sm">
                                <MessageSquare size={54} className="text-[#5AA564] opacity-20" />
                            </div>
                            <h4 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">اختر تذكرة للبدء</h4>
                            <p className="text-sm font-bold text-gray-400 max-w-sm leading-relaxed">
                                قم باختيار إحدى التذاكر النشطة من القائمة الجانبية لعرض تفاصيلها والرد على استفسار المستخدم وتطبيق "ثقافة العناية بالعميل".
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
