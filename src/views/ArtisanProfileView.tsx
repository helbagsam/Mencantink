import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  Check,
  CircleDashed,
  Clock,
  Loader2,
  MapPin,
  ScrollText,
  Wallet,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Artisan, LadderProgress } from '../domain/artisan';
import { ProofPack, TRUST_TIERS, isCertificateExpired } from '../domain/trust';
import {
  getArtisanBySlug,
  getArtisanLadder,
  getArtisanProofPacks,
} from '../services/trustService';
import { DEMO_DATA_NOTICE, IS_DEMO_DATA } from '../data/trustSeed';
import { INITIAL_MOTIFS } from '../data/mockData';
import { TrustBadge } from '../components/TrustBadge';
import { ROUTES } from '../routes';

/**
 * PROFIL PENGRAJIN.
 *
 * Pada versi lama, halaman pengrajin sama sekali tidak bisa diakses — tidak ada
 * satu pun tautan menujunya — padahal pengrajin adalah subjek utama produk ini.
 *
 * Bagian terpenting di halaman ini adalah tangga naik tingkat. Dia bukan hiasan:
 * daftar langkah yang belum selesai itulah pekerjaan yang dijanjikan platform
 * kepada pemberi dana, dan sekaligus memperlihatkan di mana persisnya seorang
 * pengrajin tertahan oleh syarat administratif.
 */
export const ArtisanProfileView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [ladder, setLadder] = useState<LadderProgress | null>(null);
  const [packs, setPacks] = useState<ProofPack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const found = slug ? await getArtisanBySlug(slug) : null;
      if (cancelled) return;

      setArtisan(found);
      if (found) {
        const [l, p] = await Promise.all([
          getArtisanLadder(found.id),
          getArtisanProofPacks(found.id),
        ]);
        if (cancelled) return;
        setLadder(l);
        setPacks(p);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center gap-2 text-sm text-[#767683]">
        <Loader2 className="w-5 h-5 animate-spin" />
        Memuat profil pengrajin...
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="pt-32 pb-20 text-center px-4">
        <h1 className="font-serif-garamond text-2xl font-bold text-[#000666] mb-2">
          Pengrajin tidak ditemukan
        </h1>
        <Link
          to={ROUTES.artisans}
          className="text-xs font-bold uppercase tracking-widest text-[#a14000] hover:underline"
        >
          Kembali ke daftar pengrajin
        </Link>
      </div>
    );
  }

  const tierMeta = TRUST_TIERS[artisan.tier];
  const verifiedPacks = packs.filter((p) => p.status === 'verified');
  const productsById = new Map(INITIAL_MOTIFS.map((m) => [m.id, m]));

  return (
    <div className="w-full">
      {/* --------------------------------------------------------- */}
      {/* Sampul                                                     */}
      {/* --------------------------------------------------------- */}
      <div className="relative h-56 md:h-72 bg-[#000666] overflow-hidden mt-20">
        {artisan.coverUrl && (
          <img
            src={artisan.coverUrl}
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000666] via-[#000666]/60 to-transparent" />
        <div className="absolute top-4 left-0 right-0 max-w-[1200px] mx-auto px-4 sm:px-6">
          <Link
            to={ROUTES.artisans}
            className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Daftar Pengrajin
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* ------------------------------------------------------- */}
        {/* Identitas                                                */}
        {/* ------------------------------------------------------- */}
        <header className="-mt-16 relative z-10 flex flex-col sm:flex-row gap-5 items-start mb-8">
          <img
            src={artisan.avatarUrl}
            alt={artisan.name}
            className="w-28 h-28 rounded-xl object-cover border-4 border-[#fbf9f5] shadow-lg shrink-0"
          />
          <div className="flex-1 pt-2 sm:pt-16">
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <h1 className="font-serif-garamond text-3xl md:text-4xl font-bold text-[#000666]">
                {artisan.name}
              </h1>
              <TrustBadge tier={artisan.tier} size="lg" />
            </div>
            <p className="text-sm text-[#454652] font-semibold">{artisan.workshop}</p>
            <p className="text-xs text-[#767683] flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {artisan.city}, {artisan.region}
              {artisan.yearsOfPractice && (
                <>
                  <span className="mx-1.5">·</span>
                  <Clock className="w-3.5 h-3.5" />
                  {artisan.yearsOfPractice} tahun menekuni batik
                </>
              )}
            </p>
          </div>
        </header>

        {/* Arti tingkatnya, dalam bahasa awam */}
        <div
          className="p-4 rounded-xl mb-8 border"
          style={{ borderColor: `${tierMeta.accent}40`, backgroundColor: `${tierMeta.accent}0d` }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: tierMeta.accent }}>
            Apa artinya tingkat ini
          </p>
          <p className="text-sm text-[#1b1c1a] leading-relaxed">{tierMeta.meaningId}</p>
          <p className="text-[11px] text-[#767683] mt-2 pt-2 border-t border-[#767683]/15">
            Dasar pengakuan: {tierMeta.basisId}
          </p>
        </div>

        <p className="text-sm text-[#454652] leading-relaxed mb-3 max-w-3xl">{artisan.bio}</p>
        <div className="flex flex-wrap gap-1.5 mb-10">
          {artisan.specialties.map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 bg-[#efeeea] border border-[#767683]/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#454652]"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ----------------------------------------------------- */}
          {/* Kiri: sertifikat dan karya                             */}
          {/* ----------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sertifikat resmi */}
            <section>
              <h2 className="font-serif-garamond text-2xl font-bold text-[#000666] mb-3 flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-[#a14000]" />
                Sertifikat Resmi
              </h2>

              {artisan.certificates.length === 0 ? (
                <div className="p-4 bg-[#fef3c7] border border-[#854d0e]/25 rounded-lg flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#854d0e] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#454652] leading-relaxed">
                    Pengrajin ini belum memiliki sertifikat resmi. Kemampuannya belum tentu kurang —
                    banyak pengrajin terampil tidak pernah punya akses ke uji kompetensi. Langkah
                    yang tersisa untuk mendapatkannya ada di panel sebelah.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {artisan.certificates.map((cert) => {
                    const expired = isCertificateExpired(cert);
                    return (
                      <div
                        key={cert.id}
                        className="p-4 bg-white border border-[#767683]/20 rounded-lg"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="text-sm font-bold text-[#000666]">
                              {cert.kind === 'lsp_bnsp'
                                ? 'Sertifikat Kompetensi Kerja'
                                : 'Batikmark "batik INDONESIA"'}
                            </p>
                            {cert.scheme && (
                              <p className="text-xs text-[#454652] mt-0.5">Skema: {cert.scheme}</p>
                            )}
                          </div>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                              expired
                                ? 'bg-[#ffe4e6] text-[#9f1239]'
                                : 'bg-[#dcfce7] text-[#166534]'
                            }`}
                          >
                            {expired ? 'Kedaluwarsa' : 'Berlaku'}
                          </span>
                        </div>

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                          <div>
                            <dt className="text-[#767683] uppercase tracking-wider font-bold text-[9px]">
                              Nomor
                            </dt>
                            <dd className="text-[#1b1c1a]">{cert.number}</dd>
                          </div>
                          <div>
                            <dt className="text-[#767683] uppercase tracking-wider font-bold text-[9px]">
                              Diterbitkan oleh
                            </dt>
                            <dd className="text-[#1b1c1a]">{cert.issuer}</dd>
                          </div>
                          <div>
                            <dt className="text-[#767683] uppercase tracking-wider font-bold text-[9px]">
                              Dasar hukum
                            </dt>
                            <dd className="text-[#1b1c1a]">{cert.legalBasis}</dd>
                          </div>
                          <div>
                            <dt className="text-[#767683] uppercase tracking-wider font-bold text-[9px]">
                              Masa berlaku
                            </dt>
                            <dd className="text-[#1b1c1a]">
                              {new Date(cert.issuedAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                              {cert.expiresAt && (
                                <>
                                  {' — '}
                                  {new Date(cert.expiresAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </>
                              )}
                            </dd>
                          </div>
                        </dl>

                        {cert.checkedByPlatformAt && (
                          <p className="text-[10px] text-[#767683] mt-2.5 pt-2.5 border-t border-[#767683]/15">
                            Nomor ini dicocokkan oleh Ruang Canting pada{' '}
                            {new Date(cert.checkedByPlatformAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                            . Ruang Canting bukan penerbit sertifikat ini.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Karya yang buktinya sudah ditinjau */}
            <section>
              <h2 className="font-serif-garamond text-2xl font-bold text-[#000666] mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#a14000]" />
                Karya dengan Bukti Ditinjau
              </h2>

              {verifiedPacks.length === 0 ? (
                <p className="text-xs text-[#767683] italic">
                  Belum ada kain dari pengrajin ini yang buktinya selesai ditinjau.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {verifiedPacks.map((pack) => {
                    const motif = productsById.get(pack.productId);
                    const cover = pack.assets[0];
                    return (
                      <Link
                        key={pack.id}
                        to={ROUTES.market}
                        className="group block rounded-lg overflow-hidden border border-[#767683]/20 bg-white hover:border-[#000666]/40 transition-colors"
                      >
                        {cover && (
                          <div className="aspect-square overflow-hidden bg-[#efeeea]">
                            <img
                              src={cover.url}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-2.5">
                          <p className="text-xs font-bold text-[#1b1c1a] leading-snug line-clamp-2">
                            {motif?.name ?? pack.productId}
                          </p>
                          <p className="text-[10px] text-[#767683] mt-0.5">
                            {pack.assets.length} berkas bukti
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* ----------------------------------------------------- */}
          {/* Kanan: tangga naik tingkat                             */}
          {/* ----------------------------------------------------- */}
          <aside className="lg:col-span-1">
            {ladder && (
              <div className="bg-white border border-[#767683]/20 rounded-xl overflow-hidden sticky top-24">
                <div className="px-4 py-3.5 bg-[#000666] text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffe088]">
                    Tangga Naik Tingkat
                  </p>
                  <p className="text-sm font-bold mt-0.5">
                    {ladder.completedCount} dari {ladder.totalCount} langkah selesai
                  </p>
                  <div className="h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-[#ffe088] transition-all"
                      style={{
                        width: `${(ladder.completedCount / ladder.totalCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <ol className="divide-y divide-[#767683]/10">
                  {ladder.steps.map((step) => (
                    <li key={step.key} className="px-4 py-3 flex gap-3">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          step.done ? 'bg-[#dcfce7]' : 'bg-[#efeeea]'
                        }`}
                      >
                        {step.done ? (
                          <Check className="w-3 h-3 text-[#166534]" />
                        ) : (
                          <CircleDashed className="w-3 h-3 text-[#767683]" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold leading-snug ${
                            step.done ? 'text-[#767683] line-through' : 'text-[#1b1c1a]'
                          }`}
                        >
                          {step.labelId}
                        </p>
                        {!step.done && step.actionId && (
                          <p className="text-[11px] text-[#454652] leading-relaxed mt-1">
                            {step.actionId}
                          </p>
                        )}
                        {!step.done && step.costNoteId && (
                          <p className="text-[10px] text-[#a14000] font-semibold mt-1 flex items-center gap-1">
                            <Wallet className="w-3 h-3 shrink-0" />
                            {step.costNoteId}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="px-4 py-3 bg-[#f5f3ef] border-t border-[#767683]/15">
                  <p className="text-[10px] text-[#454652] leading-relaxed flex gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#a14000] shrink-0 mt-px" />
                    Batikmark mensyaratkan merek terdaftar, NIB, NPWP, dan akta. Syarat ini menutup
                    pintu bagi banyak pengrajin kecil yang keahliannya tidak diragukan. Ruang
                    Canting mendampingi pengurusannya, bukan menggantikan lembaganya.
                  </p>
                </div>
              </div>
            )}
          </aside>
        </div>

        {IS_DEMO_DATA && (
          <p className="text-[10px] text-[#854d0e] leading-relaxed flex gap-1.5 mt-8 pt-4 border-t border-[#767683]/15">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
            {DEMO_DATA_NOTICE}
          </p>
        )}
      </div>
    </div>
  );
};
