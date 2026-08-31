import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NavTab, ReviewItem, ForumThread, Order } from '../types';
import { ARTISAN_AVATAR, MOCK_REVIEWS, MOCK_ARTICLES, MOCK_FORUM_THREADS } from '../data/mockData';
import { Artisan, LadderProgress } from '../domain/artisan';
import { TRUST_TIERS, isCertificateExpired } from '../domain/trust';
import { getArtisanById, getArtisanLadder } from '../services/trustService';
import { useSession } from '../hooks/useSession';
import { TrustBadge } from '../components/TrustBadge';
import { ROUTES } from '../routes';

import { 
  LayoutDashboard, 
  Palette, 
  BadgeCheck, 
  Store, 
  Settings, 
  Upload, 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Star, 
  Calendar, 
  Building2, 
  PlusCircle,
  ExternalLink
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenWriteReview: () => void;
  onOpenStartDiscussion: () => void;
  orders?: Order[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenWriteReview,
  onOpenStartDiscussion,
  orders = [],
}) => {
  const [activeSideTab, setActiveSideTab] = useState<'overview' | 'portfolio' | 'certifications' | 'marketplace' | 'settings'>('overview');
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(MOCK_REVIEWS);

  /* Status sertifikasi dibaca dari data pengrajin, bukan ditulis mati.
     Versi sebelumnya memasang "Authenticity Score 98%", "Top 5%", dan
     "MASTER ARTISAN LEVEL III" — tiga-tiganya jenjang karangan yang tidak ada
     di sistem sertifikasi mana pun, dan tanggal perpanjangannya pun sudah
     lewat menurut kalender aplikasi ini sendiri. */
  const { session } = useSession();
  const [portalArtisan, setPortalArtisan] = useState<Artisan | null>(null);
  const [ladder, setLadder] = useState<LadderProgress | null>(null);

  /* Portal menampilkan pengrajin yang sedang masuk. Sebelumnya slug-nya
     ditulis mati di dalam berkas ini, sehingga portal selalu memperlihatkan
     orang yang sama siapa pun yang membukanya. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!session?.artisanId) return;
      const artisan = await getArtisanById(session.artisanId);
      if (cancelled || !artisan) return;
      setPortalArtisan(artisan);
      const l = await getArtisanLadder(artisan.id);
      if (!cancelled) setLadder(l);
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.artisanId]);

  const activeCert = portalArtisan?.certificates.find((c) => !isCertificateExpired(c));

  return (
    <div className="w-full min-h-screen bg-[#fbf9f5] pt-20 flex flex-col lg:flex-row">
      {/* SideNavBar */}
      <aside className="w-full lg:w-64 bg-[#f5f3ef] border-b lg:border-b-0 lg:border-r border-[#767683]/15 lg:min-h-screen py-8 px-6 flex flex-col shrink-0">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-[#a14000] shadow-sm">
            <img 
              src={portalArtisan?.avatarUrl ?? ARTISAN_AVATAR} 
              alt="Foto profil pengrajin" 
              className="w-full h-full object-cover" 
            />
          </div>
          <h2 className="font-serif-garamond text-xl font-bold text-[#000666]">
            {portalArtisan?.name ?? 'Portal Pengrajin'}
          </h2>
          <p className="text-xs font-semibold text-[#767683] tracking-widest uppercase mt-0.5 whitespace-nowrap">
            {portalArtisan?.workshop ?? 'Memuat...'}
          </p>
          {portalArtisan && <TrustBadge tier={portalArtisan.tier} size="sm" className="mt-2" />}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 space-y-2">
          <button
            onClick={() => setActiveSideTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeSideTab === 'overview'
                ? 'bg-[#1a237e] text-white shadow-sm'
                : 'text-[#454652] hover:bg-[#e4e2de]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Ringkasan</span>
          </button>

          <button
            onClick={() => {
              setActiveSideTab('portfolio');
              onNavigateTab('catalog');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#454652] hover:bg-[#e4e2de] rounded-full text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
          >
            <Palette className="w-4 h-4 shrink-0" />
            <span>Karya Saya</span>
          </button>

          <button
            onClick={() => setActiveSideTab('certifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeSideTab === 'certifications'
                ? 'bg-[#1a237e] text-white'
                : 'text-[#454652] hover:bg-[#e4e2de]'
            }`}
          >
            <BadgeCheck className="w-4 h-4 shrink-0" />
            <span>Sertifikasi</span>
          </button>

          <button
            onClick={() => onNavigateTab('onboarding')}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#454652] hover:bg-[#e4e2de] rounded-full text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
          >
            <Store className="w-4 h-4 shrink-0" />
            <span>Pasar</span>
          </button>

          <button
            onClick={() => setActiveSideTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeSideTab === 'settings'
                ? 'bg-[#1a237e] text-white'
                : 'text-[#454652] hover:bg-[#e4e2de]'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Pengaturan</span>
          </button>
        </div>

        {/* Sidebar CTA */}
        <div className="mt-8 pt-4 border-t border-[#767683]/15">
          <button
            onClick={() => onNavigateTab('onboarding')}
            className="w-full py-3 bg-[#000666] text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-[#1a237e] transition-colors border border-transparent flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Upload className="w-4 h-4 shrink-0" />
            Unggah Karya Baru
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-w-[1400px] mx-auto px-4 sm:px-8 xl:px-12 py-10">
        {/* Header Bar */}
        <header className="mb-10 flex flex-col md:flex-row justify-between md:items-end border-b border-[#767683]/15 pb-6 gap-4">
          <div>
            <h1 className="font-serif-garamond text-3xl md:text-4xl font-bold text-[#000666]">
              Ringkasan Portal
            </h1>
            <p className="text-sm text-[#454652] mt-1 max-w-2xl">
              Selamat datang kembali. Berikut ringkasan aktivitas, status sertifikasi, dan pesanan yang masuk.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#eae8e4] rounded-full border border-[#767683]/15 text-xs font-bold text-[#454652] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#a14000] animate-pulse" />
              STATUS: AKTIF
            </span>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Certification Status (Span 8) */}
          <div className="col-span-1 md:col-span-8 bg-white rounded-xl border border-[#000666]/10 p-8 relative overflow-hidden flex flex-col justify-between min-h-[280px] shadow-sm">
            <div className="batik-pattern-overlay absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" />
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div>
                <h3 className="font-serif-garamond text-2xl font-bold text-[#000666] mb-1">
                  Status Sertifikasi
                </h3>
                {portalArtisan ? (
                  <>
                    <TrustBadge tier={portalArtisan.tier} size="md" />
                    <p className="text-[11px] text-[#454652] mt-1.5">
                      Diakui oleh {TRUST_TIERS[portalArtisan.tier].issuer}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-[#767683]">Memuat...</p>
                )}
              </div>
              <BadgeCheck className="w-8 h-8 text-[#a14000] shrink-0" />
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-auto">
              <div>
                <p className="text-xs text-[#454652] font-semibold uppercase tracking-wider mb-1">
                  Sertifikat Berlaku
                </p>
                {activeCert ? (
                  <>
                    <p className="font-serif-garamond text-xl font-bold text-[#000666] leading-snug">
                      {activeCert.scheme ?? 'Sertifikat Kompetensi'}
                    </p>
                    <p className="text-[11px] text-[#454652] mt-0.5">
                      {activeCert.legalBasis} · berlaku sampai{' '}
                      {activeCert.expiresAt
                        ? new Date(activeCert.expiresAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'tanpa batas waktu'}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-[#767683] leading-relaxed">
                    Belum ada sertifikat resmi yang berlaku.
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs text-[#454652] font-semibold uppercase tracking-wider mb-1">
                  Kemajuan Naik Tingkat
                </p>
                {ladder ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif-garamond text-4xl font-bold text-[#000666]">
                        {ladder.completedCount}
                      </span>
                      <span className="text-sm font-semibold text-[#a14000]">
                        dari {ladder.totalCount} langkah
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#767683]/20 rounded-full mt-2 overflow-hidden max-w-[220px]">
                      <div
                        className="h-full bg-[#a14000]"
                        style={{ width: `${(ladder.completedCount / ladder.totalCount) * 100}%` }}
                      />
                    </div>
                    {portalArtisan && (
                      <Link
                        to={ROUTES.artisanProfile(portalArtisan.slug)}
                        className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#a14000] hover:underline mt-2"
                      >
                        Lihat langkah yang tersisa
                      </Link>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-[#767683]">Memuat...</p>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Quick Action Upload (Span 4) */}
          <div 
            onClick={() => onNavigateTab('onboarding')}
            className="col-span-1 md:col-span-4 bg-[#000666] text-white rounded-xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1 shadow-sm"
          >
            <div className="absolute inset-0 bg-[#1a237e] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-3">
              <PlusCircle className="w-12 h-12 mx-auto text-[#ffe088]" />
              <h3 className="font-serif-garamond text-2xl font-bold">Unggah Karya Baru</h3>
              <p className="text-xs text-[#bdc2ff] leading-relaxed">
                Unggah kain terbaru Anda beserta paket buktinya untuk ditinjau verifikator sebelum tampil di pasar.
              </p>
            </div>
          </div>

          {/* Fulfillment Hub / Active E-Commerce Orders (Span 12) */}
          <div className="col-span-1 md:col-span-12 bg-white rounded-xl border border-[#000666]/10 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[#767683]/15">
              <div>
                <h3 className="font-serif-garamond text-2xl font-bold text-[#000666]">
                  Fulfillment Hub / <span className="text-sm font-normal text-[#454652]">Pusat Pesanan E-Commerce</span>
                </h3>
                <p className="text-xs text-[#454652] mt-0.5">
                  Pantau pesanan yang masuk, periksa pembayaran, dan perbarui status pengiriman.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('tracking')}
                className="bg-[#a14000] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#7b2f00] transition-colors"
              >
                Lacak Pesanan Berjalan
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-[#767683] italic py-4">Belum ada pesanan e-commerce masuk. Lakukan checkout di katalog untuk menguji!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f5f3ef] text-[#000666] uppercase font-bold tracking-wider">
                      <th className="p-3">Nomor Pesanan</th>
                      <th className="p-3">Pembeli / Tujuan</th>
                      <th className="p-3">Kain Anda</th>
                      <th className="p-3">Nilai Kain Anda</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#767683]/10">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#fbf9f5] transition-colors">
                        <td className="p-3 font-mono font-bold text-[#000666]">{ord.id}</td>
                        <td className="p-3">
                          <p className="font-bold text-[#1b1c1a]">{ord.shippingAddress.fullName}</p>
                          <p className="text-[11px] text-[#767683]">{ord.shippingAddress.city}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-medium text-[#1b1c1a]">
                            {ord.items
                              .filter((i) => i.artisanId === portalArtisan?.id)
                              .map((i) => `${i.name} (${i.quantity}x)`)
                              .join(', ')}
                          </p>
                        </td>
                        <td className="p-3 font-bold text-[#a14000]">
                          Rp{' '}
                          {ord.items
                            .filter((i) => i.artisanId === portalArtisan?.id)
                            .reduce((n, i) => n + i.priceIDR * i.quantity, 0)
                            .toLocaleString('id-ID')}
                        </td>
                        <td className="p-3">
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ffe088]/40 text-[#735c00] border border-[#cba72f]/40">
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onNavigateTab('tracking')}
                            className="text-xs font-bold text-[#000666] hover:underline"
                          >
                            Lihat Pelacakan
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Card 3: Cermatan Pasar (Span 6) */}
          <div className="col-span-1 md:col-span-6 bg-white rounded-xl border border-[#000666]/10 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif-garamond text-2xl font-bold text-[#000666]">
                Cermatan Pasar
              </h3>
              <TrendingUp className="w-5 h-5 text-[#767683]" />
            </div>
            <ul className="space-y-4">
              <li className="flex items-center justify-between pb-3 border-b border-[#cba72f]/20">
                <div>
                  <p className="text-xs font-bold text-[#000666] uppercase tracking-wider">Motif Sedang Diminati</p>
                  <p className="font-serif-garamond text-xl font-semibold text-[#1b1c1a]">Ragam Megamendung</p>
                </div>
                <span className="text-xs font-bold text-[#a14000]">+24% permintaan</span>
              </li>
              <li className="flex items-center justify-between pb-3 border-b border-[#cba72f]/20">
                <div>
                  <p className="text-xs font-bold text-[#000666] uppercase tracking-wider">Minat Pembeli</p>
                  <p className="font-serif-garamond text-xl font-semibold text-[#1b1c1a]">Pewarna Indigo Alamis</p>
                </div>
                <span className="text-xs font-bold text-[#a14000]">High</span>
              </li>
              <li className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-xs font-bold text-[#000666] uppercase tracking-wider">Avg. Gallery Price</p>
                  <p className="font-serif-garamond text-xl font-semibold text-[#1b1c1a]">IDR 4.5M - 8M</p>
                </div>
                <button 
                  onClick={() => onNavigateTab('catalog')}
                  className="text-xs font-bold text-[#000666] underline hover:text-[#a14000] flex items-center gap-1"
                >
                  Full Report <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Card 4: Resources & Support (Span 6) */}
          <div className="col-span-1 md:col-span-6 bg-white rounded-xl border border-[#000666]/10 p-6 flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif-garamond text-2xl font-bold text-[#000666]">
                Resources & Support
              </h3>
              <BookOpen className="w-5 h-5 text-[#767683]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div 
                onClick={() => onNavigateTab('community')}
                className="border border-[#767683]/15 rounded-lg p-4 hover:border-[#a14000] transition-colors cursor-pointer group bg-[#fbf9f5]"
              >
                <Calendar className="w-5 h-5 text-[#a14000] mb-2" />
                <h4 className="font-serif-garamond text-lg font-bold text-[#1b1c1a] group-hover:text-[#000666]">
                  Natural Dye Workshop
                </h4>
                <p className="text-xs text-[#454652] mt-1">Next week • Virtual</p>
              </div>
              <div 
                onClick={() => onNavigateTab('community')}
                className="border border-[#767683]/15 rounded-lg p-4 hover:border-[#a14000] transition-colors cursor-pointer group bg-[#fbf9f5]"
              >
                <Building2 className="w-5 h-5 text-[#a14000] mb-2" />
                <h4 className="font-serif-garamond text-lg font-bold text-[#1b1c1a] group-hover:text-[#000666]">
                  Heritage Grant 2024
                </h4>
                <p className="text-xs text-[#454652] mt-1">Applications open</p>
              </div>
            </div>
          </div>
        </div>

        {/* Community & Insights Section Header */}
        <div className="mt-14 mb-6 flex justify-between items-end border-b border-[#767683]/15 pb-4">
          <h2 className="font-serif-garamond text-3xl font-bold text-[#000666]">
            Community & Insights
          </h2>
          <button 
            onClick={() => onNavigateTab('community')}
            className="text-xs font-bold text-[#a14000] uppercase tracking-wider hover:underline"
          >
            View All
          </button>
        </div>

        {/* Community 3-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ulasan untuk Pengrajin (Span 4) */}
          <div className="col-span-1 lg:col-span-4 bg-white rounded-xl border border-[#000666]/10 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif-garamond text-xl font-bold text-[#000666]">Ulasan untuk Pengrajin</h3>
                <Star className="w-4 h-4 text-[#cba72f]" />
              </div>
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="border-b border-[#767683]/10 pb-3 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-[#000666]">{rev.itemName}</p>
                      <div className="flex text-[#cba72f] text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(rev.rating) ? 'fill-current' : ''}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#1b1c1a] italic line-clamp-2">{rev.reviewText}</p>
                    <p className="text-[11px] text-[#767683] mt-1">- {rev.reviewerName}, {rev.reviewerRole}</p>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={onOpenWriteReview}
              className="mt-6 w-full py-2 bg-[#efeeea] text-[#1b1c1a] text-xs font-bold uppercase tracking-wider rounded border border-[#767683]/20 hover:bg-[#e4e2de] transition-colors"
            >
              Write a Review
            </button>
          </div>

          {/* Pilihan Redaksi (Span 4) */}
          <div className="col-span-1 lg:col-span-4 bg-white rounded-xl border border-[#000666]/10 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif-garamond text-xl font-bold text-[#000666]">Pilihan Redaksi</h3>
                <BookOpen className="w-4 h-4 text-[#767683]" />
              </div>
              <div className="space-y-4">
                {MOCK_ARTICLES.map((art) => (
                  <div 
                    key={art.id} 
                    onClick={() => onNavigateTab('heritage')}
                    className="flex gap-3 group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded bg-[#e4e2de] shrink-0 overflow-hidden border border-[#767683]/10">
                      <img 
                        src={art.imageUrl} 
                        alt={art.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-[#a14000] uppercase tracking-wider mb-0.5">{art.category}</span>
                      <h4 className="font-serif-garamond text-sm font-bold text-[#1b1c1a] group-hover:text-[#000666] line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('heritage')}
              className="mt-6 w-full py-2 bg-[#efeeea] text-[#1b1c1a] text-xs font-bold uppercase tracking-wider rounded border border-[#767683]/20 hover:bg-[#e4e2de] transition-colors"
            >
              Read More Articles
            </button>
          </div>

          {/* Diskusi Anggota (Span 4) */}
          <div className="col-span-1 lg:col-span-4 bg-white rounded-xl border border-[#000666]/10 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif-garamond text-xl font-bold text-[#000666]">Diskusi Anggota</h3>
                <MessageSquare className="w-4 h-4 text-[#767683]" />
              </div>
              <div className="space-y-3">
                {MOCK_FORUM_THREADS.slice(0, 2).map((thread) => (
                  <div 
                    key={thread.id}
                    onClick={() => onNavigateTab('community')}
                    className="p-3 bg-[#f5f3ef] rounded-lg border border-[#767683]/10 hover:border-[#a14000] transition-colors cursor-pointer"
                  >
                    <h4 className="font-serif-garamond text-sm font-bold text-[#000666] line-clamp-1">
                      {thread.title}
                    </h4>
                    <p className="text-xs text-[#454652] line-clamp-2 mt-1">
                      {thread.content}
                    </p>
                    <div className="flex justify-between items-center text-[11px] text-[#767683] font-semibold mt-2">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {thread.repliesCount} replies
                      </span>
                      <span>Active {thread.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('community')}
              className="mt-6 w-full py-2 bg-[#efeeea] text-[#1b1c1a] text-xs font-bold uppercase tracking-wider rounded border border-[#767683]/20 hover:bg-[#e4e2de] transition-colors"
            >
              Join the Forum
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
