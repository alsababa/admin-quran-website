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
    Send
} from 'lucide-react';

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
        <div className="space-y-10 pb-20 h-full flex flex-col">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
                <div className="text-right">
                    <h3 className="text-4xl font-black text-white tracking-tighter">الدعم الفني</h3>
                    <p className="text-[#5AA564]/40 font-bold text-sm mt-2">إدارة تذاكر الدعم والرد على استفسارات المستخدمين.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5AA564]/30" size={18} />
                        <input
                            type="text"
                            placeholder="رقم التذكرة، اسم المستخدم..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-14 glass-input rounded-2xl pr-14 pl-6 text-sm font-medium text-white placeholder:text-[#5AA564]/20 focus:border-[#5AA564]/40 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Support Desk Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
                
                {/* Tickets List */}
                <div className="lg:col-span-5 xl:col-span-4 glass-panel border-[#5AA564]/10 rounded-[2.5rem] flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-[#5AA564]/5 flex justify-between items-center bg-[#5AA564]/5">
                        <h4 className="font-black text-white flex items-center gap-3">
                            <MessageSquare className="text-[#5AA564]" size={20} />
                            التذاكر الواردة
                        </h4>
                        <span className="bg-[#5AA564]/20 text-[#5AA564] px-3 py-1 text-[10px] font-black rounded-full border border-[#5AA564]/20">
                            {filteredTickets.length} تذكرة
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                        {filteredTickets.map(ticket => (
                            <div 
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                                    selectedTicket?.id === ticket.id 
                                    ? 'bg-[#5AA564]/10 border-[#5AA564]/30 shadow-lg' 
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-[#5AA564]/20'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${ticket.status === 'open' ? 'bg-[#5AA564] animate-pulse shadow-[0_0_8px_rgba(90,165,100,0.8)]' : 'bg-gray-500'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#5AA564]/50">{ticket.id}</span>
                                    </div>
                                    <span className="text-[10px] text-[#5AA564]/40 font-bold">{ticket.date}</span>
                                </div>
                                <h5 className="font-bold text-white text-sm mb-1">{ticket.subject}</h5>
                                <p className="text-xs text-[#5AA564]/60 truncate">{ticket.user.name}</p>
                            </div>
                        ))}
                        {filteredTickets.length === 0 && (
                            <div className="text-center py-10 text-[#5AA564]/40 font-bold text-sm">
                                لا توجد تذاكر متطابقة مع بحثك
                            </div>
                        )}
                    </div>
                </div>

                {/* Ticket Details & Chat */}
                <div className="lg:col-span-7 xl:col-span-8 glass-panel border-[#5AA564]/10 rounded-[2.5rem] flex flex-col overflow-hidden relative shadow-3xl">
                    {selectedTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-6 md:p-8 border-b border-[#5AA564]/5 bg-[#0D1510]/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-[#5AA564]/10 border border-[#5AA564]/20 text-[#5AA564] text-[10px] font-black rounded-lg uppercase tracking-widest">
                                            {selectedTicket.id}
                                        </span>
                                        <h4 className="text-lg font-black text-white">{selectedTicket.subject}</h4>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#5AA564]/50">
                                        <span className="flex items-center gap-1.5"><User size={14} /> {selectedTicket.user.name}</span>
                                        <span className="flex items-center gap-1.5"><Mail size={14} /> {selectedTicket.user.email}</span>
                                        <span className="flex items-center gap-1.5"><Phone size={14} /> {selectedTicket.user.phone}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 shrink-0">
                                    <button className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                                        selectedTicket.status === 'closed' 
                                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                                        : 'bg-[#5AA564]/10 text-[#5AA564] border-[#5AA564]/20 hover:bg-[#5AA564] hover:text-[#0D1510]'
                                    }`}>
                                        {selectedTicket.status === 'open' ? 'إغلاق التذكرة' : 'مغلقة'}
                                    </button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-[#5AA564]/5">
                                {selectedTicket.messages.map((msg) => (
                                    <motion.div 
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex flex-col max-w-[80%] ${msg.sender === 'admin' ? 'mr-auto items-end' : 'ml-auto items-start'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-2 px-1">
                                            <span className="text-[10px] font-black text-[#5AA564]/40">{msg.sender === 'admin' ? 'الإدارة' : selectedTicket.user.name}</span>
                                            <span className="text-[10px] text-[#5AA564]/30">{msg.time}</span>
                                        </div>
                                        <div className={`p-4 md:p-5 rounded-2xl text-sm leading-relaxed shadow-lg ${
                                            msg.sender === 'admin' 
                                            ? 'bg-[#5AA564] text-[#0D1510] font-bold rounded-tl-none' 
                                            : 'glass-card border-[#5AA564]/20 text-[#F5F2ED] rounded-tr-none'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Chat Input */}
                            <div className="p-6 bg-[#0D1510]/80 border-t border-[#5AA564]/10 backdrop-blur-xl">
                                <form onSubmit={handleSendReply} className="flex items-end gap-3 relative">
                                    <div className="flex-1 relative">
                                        <textarea 
                                            placeholder="اكتب ردك هنا..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="w-full glass-input rounded-2xl p-4 pr-12 min-h-[60px] max-h-[150px] resize-y text-sm font-medium text-white placeholder:text-[#5AA564]/30 focus:border-[#5AA564]/40 custom-scrollbar"
                                            rows="2"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendReply(e);
                                                }
                                            }}
                                        />
                                        <button type="button" className="absolute top-4 right-4 text-[#5AA564]/40 hover:text-[#5AA564] transition-colors">
                                            <Paperclip size={18} />
                                        </button>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={!replyText.trim()}
                                        className="h-14 w-14 shrink-0 bg-[#5AA564] text-[#0D1510] rounded-2xl flex items-center justify-center hover:bg-white transition-all disabled:opacity-50 disabled:hover:bg-[#5AA564] shadow-xl shadow-[#5AA564]/20"
                                    >
                                        <Send size={20} className="mr-1 mt-1" />
                                    </button>
                                </form>
                                <p className="text-center text-[10px] text-[#5AA564]/30 mt-3 font-bold">اضغط Enter للإرسال، Shift + Enter لسطر جديد</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-[#5AA564]/30 p-10 text-center">
                            <MessageSquare size={64} className="mb-6 opacity-20" />
                            <h4 className="text-xl font-black text-white mb-2">اختر تذكرة للبدء</h4>
                            <p className="text-sm font-bold max-w-sm leading-relaxed">قم باختيار إحدى التذاكر من القائمة الجانبية لعرض تفاصيلها والرد على استفسار المستخدم.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
