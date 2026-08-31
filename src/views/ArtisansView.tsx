import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Loader2, Info, AlertTriangle } from 'lucide-react';
import { Artisan, sortByTierDesc } from '../domain/artisan';
import { TRUST_TIERS, TRUST_TIER_ORDER, TrustTier } from '../domain/trust';
import { getArtisans } from '../services/trustService';
import { DEMO_DATA_NOTICE, IS_DEMO_DATA } from '../data/trustSeed';
import { TrustBadge } from '../components/TrustBadge';
import { ROUTES } from '../routes';

/**
 * DAFTAR PENGRAJIN.
 *
 * Sebelumnya halaman ini berisi tiga pengrajin yang ditulis langsung di dalam
 * komponen, lengkap dengan skor "98% Authenticity" yang tidak bersandar pada apa
 * pun — dan tidak ada satu pun tautan menuju halaman ini, sehingga tidak pernah
 * bisa dibuka sama sekali.
 *
 * Sekarang datanya dibaca dari layanan, tingkatnya dihitung dari bukti, dan
 * daftarnya bisa disaring per tingkat supaya terlihat bahwa sistemnya memang
 * membeda-bedakan.
 */
export const ArtisansView: React.FC = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<TrustTier | 'semua'>('semua');

  useEffect(() => {
    let cancelled = false;
    getArtisans().then((rows) => {
      if (!cancelled) {
        setArtisans([...rows].sort(sortByTierDesc));
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const map = new Map<TrustTier, number>();
    artisans.forEach((a) => map.set(a.tier, (map.get(a.tier) ?? 0) + 1));
    return map;
  }, [artisans]);

  const visible = useMemo(
    () => (filterTier === 'semua' ? artisans : artisans.filter((a) => a.tier === filterTier)),
    [artisans, filterTier],
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Kepala halaman */}
      <section className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#a14000]/10 text-[#a14000] rounded-full text-xs font-bold uppercase tracking-widest mb-3">
          <ShieldCheck className="w-4 h-4" /> Daftar Pengrajin
        </div>
        <h1 className="font-serif-garamond text-4xl md:text-5xl font-bold text-[#000666] mb-3">
          Orang di Balik Kainnya
        </h1>
        <p className="text-sm text-[#454652] leading-relaxed">
          Setiap pengrajin ditampilkan apa adanya, termasuk yang belum terverifikasi. Tingkat
          kepercayaan di sini dihitung dari bukti dan sertifikat yang benar-benar tercatat, bukan
          dari penilaian kami sendiri.
        </p>
      </section>

      {/* Saringan tingkat */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterTier('semua')}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
            filterTier === 'semua'
              ? 'bg-[#000666] text-white border-[#000666]'
              : 'bg-white text-[#454652] border-[#767683]/25 hover:border-[#000666]/40'
          }`}
        >
          Semua ({artisans.length})
        </button>
        {[...TRUST_TIER_ORDER].reverse().map((tier) => {
          const count = counts.get(tier) ?? 0;
          if (count === 0) return null;
          const active = filterTier === tier;
          return (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all"
              style={
                active
                  ? {
                      backgroundColor: TRUST_TIERS[tier].accent,
                      color: TRUST_TIERS[tier].onAccent,
                      borderColor: TRUST_TIERS[tier].accent,
                    }
                  : { backgroundColor: '#fff', color: '#454652', borderColor: '#76768340' }
              }
            >
              {TRUST_TIERS[tier].labelId} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-16 justify-center text-sm text-[#767683]">
          <Loader2 className="w-5 h-5 animate-spin" />
          Memuat daftar pengrajin...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((artisan) => (
            <Link
              key={artisan.id}
              to={ROUTES.artisanProfile(artisan.slug)}
              className="group bg-white border border-[#767683]/20 rounded-xl overflow-hidden hover:border-[#000666]/40 hover:shadow-lg transition-all flex flex-col"
            >
              <div className="h-28 bg-[#efeeea] overflow-hidden relative">
                {artisan.coverUrl && (
                  <img
                    src={artisan.coverUrl}
                    alt=""
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>

              <div className="px-4 pb-4 -mt-9 relative flex-1 flex flex-col">
                <img
                  src={artisan.avatarUrl}
                  alt={artisan.name}
                  className="w-16 h-16 rounded-xl object-cover border-4 border-white shadow-sm mb-2"
                />
                <TrustBadge tier={artisan.tier} size="sm" className="mb-2" />

                <h3 className="font-serif-garamond text-lg font-bold text-[#000666] leading-snug group-hover:text-[#a14000] transition-colors">
                  {artisan.name}
                </h3>
                <p className="text-xs text-[#454652] font-semibold">{artisan.workshop}</p>
                <p className="text-[11px] text-[#767683] flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {artisan.city}
                </p>

                <p className="text-[11px] text-[#454652] leading-relaxed mt-2.5 line-clamp-3 flex-1">
                  {artisan.bio}
                </p>

                <div className="mt-3 pt-3 border-t border-[#767683]/15 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#767683]">
                    {artisan.certificates.length > 0
                      ? `${artisan.certificates.length} sertifikat resmi`
                      : 'Belum ada sertifikat resmi'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#a14000] group-hover:underline">
                    Lihat profil
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Keterangan */}
      <div className="mt-10 space-y-2 border-t border-[#767683]/15 pt-5">
        <p className="text-[11px] text-[#454652] leading-relaxed flex gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#a14000] shrink-0 mt-px" />
          Ruang Canting tidak menerbitkan sertifikat apa pun. Sertifikat kompetensi diterbitkan
          BNSP melalui LSP, dan Batikmark diterbitkan Kementerian Perindustrian. Yang kami lakukan
          adalah mencocokkan nomornya dan mendampingi pengrajin mengurusnya.
        </p>
        {IS_DEMO_DATA && (
          <p className="text-[11px] text-[#854d0e] leading-relaxed flex gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
            {DEMO_DATA_NOTICE}
          </p>
        )}
      </div>
    </div>
  );
};
