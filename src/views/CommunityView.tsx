import React, { useState } from 'react';
import { ForumThread, EventItem } from '../types';
import { MOCK_EVENTS } from '../data/mockData';
import { 
  SquarePen, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  Users, 
  Send, 
  X, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Award,
  Filter
} from 'lucide-react';
import { IMG } from '../assets/images';

interface CommunityViewProps {
  threads: ForumThread[];
  onOpenStartDiscussion: () => void;
  onAddReply: (threadId: string, replyContent: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  threads,
  onOpenStartDiscussion,
  onAddReply,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'forum' | 'events'>('forum');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Topik');
  const [activeThread, setActiveThread] = useState<ForumThread | null>(null);
  const [replyText, setReplyText] = useState('');

  // Events State
  const [eventsList, setEventsList] = useState<EventItem[]>(MOCK_EVENTS);
  const [eventFilter, setEventFilter] = useState<string>('Semua');
  const [registeredEventToast, setRegisteredEventToast] = useState<string | null>(null);

  const categories = [
    'Semua Topik',
    'Teknik Pewarnaan Alami',
    'Filosofi Motif',
    'Tips Sertifikasi',
    'Peralatan & Bahan',
  ];

  const filteredThreads = threads.filter((t) => {
    if (selectedCategory === 'Semua Topik') return true;
    return t.category === selectedCategory;
  });

  const filteredEvents = eventsList.filter((ev) => {
    if (eventFilter === 'Semua') return true;
    return ev.category === eventFilter;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !replyText.trim()) return;

    onAddReply(activeThread.id, replyText.trim());

    setActiveThread((prev) => {
      if (!prev) return null;
      const updatedReplies = [
        ...(prev.replies || []),
        {
          id: `r-${Date.now()}`,
          authorName: 'Pengrajin Terverifikasi (Anda)',
          authorAvatar: IMG['artisan_avatar'],
          timeAgo: 'Baru saja',
          content: replyText.trim(),
        },
      ];
      return {
        ...prev,
        repliesCount: prev.repliesCount + 1,
        replies: updatedReplies,
      };
    });

    setReplyText('');
  };

  const handleRegisterEvent = (eventId: string, eventTitle: string) => {
    setEventsList((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const isReg = !ev.isRegistered;
          return {
            ...ev,
            isRegistered: isReg,
            attendeesCount: isReg ? ev.attendeesCount + 1 : ev.attendeesCount - 1,
          };
        }
        return ev;
      })
    );

    setRegisteredEventToast(`Pendaftaran event "${eventTitle}" berhasil diperbarui!`);
    setTimeout(() => {
      setRegisteredEventToast(null);
    }, 3500);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-10">
      {/* Toast Notification */}
      {registeredEventToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000666] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#ffe088]/40 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#ffe088]" />
          <span className="text-xs font-bold uppercase tracking-wider">{registeredEventToast}</span>
        </div>
      )}

      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-[#767683]/15">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-[#a14000] uppercase tracking-widest block">
            Ruang Diskusi & Sinergi Pengrajin
          </span>
          <h1 className="font-serif-garamond text-3xl sm:text-4xl font-bold text-[#000666]">
            Komunitas & Event Batik Nusantara
          </h1>
          <p className="text-xs sm:text-sm text-[#454652] leading-relaxed">
            Wadah interaktif bagi pengrajin, kolektor, akademisi, dan pencinta batik untuk saling berbagi resep pewarnaan, tips sertifikasi, serta mengikuti agenda festival nasional.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenStartDiscussion}
            className="bg-[#000666] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#1a237e] transition-colors flex items-center gap-2 shrink-0 shadow-sm"
          >
            <SquarePen className="w-4 h-4" />
            Buat Diskusi Baru
          </button>
        </div>
      </section>

      {/* Navigation Switcher: Forum vs Events */}
      <div className="flex border-b border-[#767683]/20 gap-8 text-sm font-bold">
        <button
          onClick={() => setActiveMainTab('forum')}
          className={`pb-3 uppercase tracking-wider transition-colors relative ${
            activeMainTab === 'forum' ? 'text-[#000666]' : 'text-[#767683] hover:text-[#000666]'
          }`}
        >
          <span className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#a14000]" />
            Forum Diskusi ({filteredThreads.length})
          </span>
          {activeMainTab === 'forum' && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#000666] rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveMainTab('events')}
          className={`pb-3 uppercase tracking-wider transition-colors relative ${
            activeMainTab === 'events' ? 'text-[#000666]' : 'text-[#767683] hover:text-[#000666]'
          }`}
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#a14000]" />
            Agenda & Event Berjalan ({eventsList.length})
          </span>
          {activeMainTab === 'events' && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#000666] rounded-t-full" />
          )}
        </button>
      </div>

      {/* TAB 1: FORUM DISKUSI */}
      {activeMainTab === 'forum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Feed Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'border border-[#000666] text-[#000666] bg-[#000666]/5 shadow-xs'
                      : 'border border-[#767683]/20 text-[#454652] hover:bg-[#e4e2de]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Discussion List */}
            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setActiveThread(thread)}
                  className="bg-white border border-[#767683]/15 rounded-xl p-6 relative overflow-hidden group hover:border-[#000666]/30 transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex gap-4 items-start">
                    <img
                      src={thread.authorAvatar}
                      alt={thread.authorName}
                      className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#767683]/20"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#000666]">{thread.authorName}</span>
                        <span className="text-[#767683] text-xs">•</span>
                        <span className="text-[#767683] text-xs">{thread.timeAgo}</span>
                        <span className="ml-auto px-2.5 py-0.5 rounded bg-[#f5f3ef] text-[#000666] text-[10px] font-bold tracking-wider uppercase border border-[#000666]/10">
                          {thread.category}
                        </span>
                      </div>
                      <h3 className="font-serif-garamond text-xl font-bold text-[#1b1c1a] group-hover:text-[#000666] transition-colors leading-snug">
                        {thread.title}
                      </h3>
                      <p className="text-xs text-[#454652] leading-relaxed line-clamp-2">
                        {thread.content}
                      </p>
                      <div className="flex gap-6 text-[#767683] text-xs font-semibold pt-1">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-[#a14000]" /> {thread.repliesCount} Tanggapan
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" /> {thread.viewsCount} Dilihat
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Trending Topics Widget */}
            <div className="bg-white border border-[#767683]/15 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-serif-garamond text-xl font-bold text-[#000666] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#a14000]" />
                Topik Hangat Komunitas
              </h3>
              <div className="divide-y divide-[#767683]/10">
                <div className="py-3 group cursor-pointer" onClick={onOpenStartDiscussion}>
                  <h4 className="text-xs font-bold text-[#1b1c1a] group-hover:text-[#a14000] transition-colors mb-1">
                    Standar Sertifikasi Maestro Batik 2026
                  </h4>
                  <p className="text-[11px] text-[#767683]">45 tanggapan • 1.2k pembaca</p>
                </div>
                <div className="py-3 group cursor-pointer" onClick={onOpenStartDiscussion}>
                  <h4 className="text-xs font-bold text-[#1b1c1a] group-hover:text-[#a14000] transition-colors mb-1">
                    Komposisi Lilin Malam Terbaik Untuk Garis Tulis
                  </h4>
                  <p className="text-[11px] text-[#767683]">28 tanggapan • 850 pembaca</p>
                </div>
                <div className="py-3 group cursor-pointer" onClick={onOpenStartDiscussion}>
                  <h4 className="text-xs font-bold text-[#1b1c1a] group-hover:text-[#a14000] transition-colors mb-1">
                    Pameran Kebudayaan Batik di Kyoto & Paris
                  </h4>
                  <p className="text-[11px] text-[#767683]">12 tanggapan • 430 pembaca</p>
                </div>
              </div>
            </div>

            {/* Banner Statistik Komunitas */}
            <div className="bg-[#000666] text-white rounded-xl p-6 relative overflow-hidden shadow-sm space-y-3">
              <h3 className="font-serif-garamond text-2xl font-bold text-white">
                Denyut Komunitas
              </h3>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="font-serif-garamond text-3xl font-bold text-[#ffe088]">12.5k</div>
                  <div className="text-[10px] font-bold text-[#bdc2ff] uppercase tracking-wider">Pengrajin</div>
                </div>
                <div>
                  <div className="font-serif-garamond text-3xl font-bold text-[#ffe088]">15k</div>
                  <div className="text-[10px] font-bold text-[#bdc2ff] uppercase tracking-wider">Diskusi</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* TAB 2: AGENDA & EVENT BERJALAN */}
      {activeMainTab === 'events' && (
        <div className="space-y-8">
          {/* Filter Event Category */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#767683]/15 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#000666]">
              <Filter className="w-4 h-4 text-[#a14000]" /> Kategori Event:
            </div>
            <div className="flex flex-wrap gap-2">
              {['Semua', 'Festival', 'Workshop', 'Webinar', 'Lomba'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setEventFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    eventFilter === cat
                      ? 'bg-[#000666] text-white'
                      : 'bg-[#efeeea] text-[#454652] hover:bg-[#000666]/10 hover:text-[#000666]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-[#000666]/15 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 w-full relative overflow-hidden">
                    <img
                      src={ev.imageUrl}
                      alt={ev.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-[#000666] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
                      {ev.category}
                    </span>
                    {ev.isRegistered && (
                      <span className="absolute top-4 right-4 bg-[#735c00] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Terdaftar
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#a14000] font-bold uppercase">
                      <Calendar className="w-4 h-4" /> {ev.date}
                    </div>

                    <h3 className="font-serif-garamond text-xl font-bold text-[#000666] leading-snug">
                      {ev.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-[#454652]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#000666] shrink-0" /> {ev.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#a14000] shrink-0" /> {ev.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-[#735c00] shrink-0" /> Penyelenggara: {ev.organizer}
                      </div>
                    </div>

                    <p className="text-xs text-[#454652] leading-relaxed pt-2 border-t border-[#767683]/15">
                      {ev.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-[#767683]/10 mt-2">
                  <span className="text-xs text-[#767683]">
                    <Users className="w-3.5 h-3.5 inline mr-1 text-[#000666]" />
                    <b>{ev.attendeesCount}</b> Pengrajin Ikut Serta
                  </span>

                  <button
                    onClick={() => handleRegisterEvent(ev.id, ev.title)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs ${
                      ev.isRegistered
                        ? 'bg-[#767683]/20 text-[#1b1c1a] hover:bg-[#767683]/30'
                        : 'bg-[#a14000] text-white hover:bg-[#7b2f00]'
                    }`}
                  >
                    {ev.isRegistered ? 'Batal Daftar' : '+ Ikut Event Ini'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discussion Detail & Reply Drawer / Modal */}
      {activeThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#fbf9f5] border border-[#767683]/20 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative flex flex-col justify-between">
            <button
              onClick={() => setActiveThread(null)}
              className="absolute top-4 right-4 p-2 text-[#767683] hover:text-[#000666] hover:bg-[#efeeea] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#000666] text-white text-[10px] font-bold tracking-wider uppercase">
                  {activeThread.category}
                </span>
                <span className="text-xs text-[#767683]">Dibuat {activeThread.timeAgo}</span>
              </div>

              <h2 className="font-serif-garamond text-2xl font-bold text-[#000666]">
                {activeThread.title}
              </h2>

              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#767683]/15">
                <img
                  src={activeThread.authorAvatar}
                  alt={activeThread.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-[#767683]/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#000666]">{activeThread.authorName}</h4>
                  <p className="text-[11px] text-[#767683]">Pengrajin Terverifikasi Komunitas</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#1b1c1a] leading-relaxed bg-white p-4 rounded-lg border border-[#767683]/15">
                {activeThread.content}
              </p>

              {/* Existing Replies List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-[#a14000] uppercase tracking-wider">
                  Daftar Tanggapan ({activeThread.replies?.length || 0})
                </h4>

                {(!activeThread.replies || activeThread.replies.length === 0) && (
                  <p className="text-xs text-[#767683] italic">Belum ada tanggapan. Jadilah yang pertama memberikan masukan!</p>
                )}

                {activeThread.replies?.map((reply) => (
                  <div key={reply.id} className="p-3 bg-white rounded-lg border border-[#767683]/15 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#000666]">{reply.authorName}</span>
                      <span className="text-[10px] text-[#767683]">{reply.timeAgo}</span>
                    </div>
                    <p className="text-[#454652]">{reply.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Send Reply Form */}
            <form onSubmit={handleSendReply} className="pt-4 mt-6 border-t border-[#767683]/15 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tuliskan masukan atau saran Anda..."
                className="flex-1 bg-white border border-[#767683]/30 rounded-lg px-3 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#000666]"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#000666] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#1a237e] transition-colors flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
