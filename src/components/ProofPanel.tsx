import React, { useEffect, useState } from 'react';
import {
  Check,
  X as XIcon,
  Minus,
  Eye,
  Play,
  Loader2,
  Info,
  Sparkles,
  UserCheck,
  Landmark,
  Wallet,
  AlertTriangle,
} from 'lucide-react';
import {
  CRITERIA,
  CriterionResult,
  HERITAGE_MOTIF_NOTICE,
  PLATFORM_FEE_PCT,
  PROOF_KINDS,
  ProofAsset,
  calculatePayout,
} from '../domain/trust';
import { useProductTrust } from '../hooks/useProductTrust';
import { DEMO_DATA_NOTICE, IS_DEMO_DATA } from '../data/trustSeed';
import { formatPrice } from '../utils/currency';
import { Currency } from '../types';
import { TrustBadge } from './TrustBadge';

interface ProofPanelProps {
  productId: string;
  priceIDR?: number;
  currency?: Currency;
  /** Motif klasik memicu keterangan Ekspresi Budaya Tradisional. */
  isHeritageMotif?: boolean;
  fallbackArtisanId?: string;
}

const RESULT_STYLE: Record<
  CriterionResult,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  met: { icon: Check, color: '#166534', bg: '#dcfce7', label: 'Terpenuhi' },
  not_met: { icon: XIcon, color: '#9f1239', bg: '#ffe4e6', label: 'Tidak terpenuhi' },
  inconclusive: { icon: Minus, color: '#854d0e', bg: '#fef3c7', label: 'Tidak dapat dinilai' },
};

/**
 * PANEL BUKTI KEASLIAN — inti pembeda produk ini.
 *
 * Sertifikat menyuruh pembeli percaya pihak ketiga. Panel ini membuat pembeli
 * menilai dengan matanya sendiri, sambil diajari cara membacanya. Pembeli yang
 * belajar memeriksa sisi belakang kain jadi konsumen yang lebih cerdas
 * selamanya, bukan cuma di situs ini.
 */
export const ProofPanel: React.FC<ProofPanelProps> = (props) => {
  const { productId, priceIDR, isHeritageMotif = false, fallbackArtisanId } = props;
  const currency: Currency = props.currency ?? 'IDR';

  const { trust, loading } = useProductTrust(productId, fallbackArtisanId);
  const [activeAsset, setActiveAsset] = useState<ProofAsset | null>(null);

  /* Berkas pertama dipilih otomatis begitu datanya tiba. */
  useEffect(() => {
    setActiveAsset(trust?.proofPack?.assets[0] ?? null);
  }, [trust]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-6 text-xs text-[#767683]">
        <Loader2 className="w-4 h-4 animate-spin" />
        Memuat bukti keaslian...
      </div>
    );
  }

  if (!trust) return null;

  const { proofPack, verification, verifier, secondVerifier, artisan, missingProof } = trust;
  const isVerified = proofPack?.status === 'verified' && Boolean(verification);

  return (
    <section className="bg-white border border-[#767683]/20 rounded-xl overflow-hidden">
      {/* ---------------------------------------------------------- */}
      {/* Kepala panel                                                */}
      {/* ---------------------------------------------------------- */}
      <header className="px-5 py-4 border-b border-[#767683]/15 bg-[#f5f3ef] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-serif-garamond text-xl font-bold text-[#000666] flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#a14000]" />
            Bukti Keaslian
          </h3>
          <p className="text-[11px] text-[#454652] mt-0.5">
            Periksa sendiri. Di bawah dijelaskan apa yang harus dilihat.
          </p>
        </div>
        <TrustBadge tier={trust.tier} size="lg" showIssuer />
      </header>

      {/* ---------------------------------------------------------- */}
      {/* Belum ada bukti                                             */}
      {/* ---------------------------------------------------------- */}
      {!proofPack && (
        <div className="p-5">
          <div className="flex gap-3 p-4 bg-[#fef3c7] border border-[#854d0e]/25 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-[#854d0e] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#854d0e] uppercase tracking-wider">
                Belum ada bukti proses yang ditinjau
              </p>
              <p className="text-xs text-[#454652] mt-1.5 leading-relaxed">
                Pengrajin ini sudah terdaftar, tetapi belum mengunggah paket bukti untuk kain ini,
                atau buktinya belum selesai ditinjau verifikator. Pertimbangkan hal ini sebelum
                membeli, dan silakan minta bukti langsung kepada pengrajin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* Bukti masih ditinjau                                        */}
      {/* ---------------------------------------------------------- */}
      {proofPack && !isVerified && (
        <div className="px-5 pt-5">
          <div className="flex gap-3 p-4 bg-[#e0e7ff] border border-[#000666]/25 rounded-lg">
            <Loader2 className="w-5 h-5 text-[#000666] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#000666] uppercase tracking-wider">
                Sedang ditinjau verifikator
              </p>
              <p className="text-xs text-[#454652] mt-1.5 leading-relaxed">
                Bukti sudah diunggah dan sedang diperiksa manusia.
                {missingProof.length > 0 && (
                  <>
                    {' '}
                    Masih menunggu:{' '}
                    <strong>
                      {missingProof.map((k) => PROOF_KINDS[k].labelId).join(', ')}
                    </strong>
                    .
                  </>
                )}{' '}
                Hasil tinjauan ditampilkan di sini setelah selesai.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* Berkas bukti                                                */}
      {/* ---------------------------------------------------------- */}
      {proofPack && proofPack.assets.length > 0 && activeAsset && (
        <div className="p-5 grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Gambar terpilih */}
          <div className="lg:col-span-3">
            <div className="relative rounded-lg overflow-hidden border border-[#767683]/20 bg-[#efeeea] aspect-[4/3]">
              <img
                src={activeAsset.url}
                alt={PROOF_KINDS[activeAsset.kind].labelId}
                className="w-full h-full object-cover"
              />

              {activeAsset.kind === 'process_video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-6 h-6 text-[#000666] ml-0.5" />
                  </div>
                </div>
              )}

              {activeAsset.placeholder && (
                <span className="absolute top-2 left-2 bg-[#854d0e] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                  Gambar contoh
                </span>
              )}
            </div>

            {activeAsset.note && (
              <p className="text-[11px] text-[#454652] italic mt-2 leading-relaxed">
                Catatan pengrajin: {activeAsset.note}
              </p>
            )}
          </div>

          {/* Daftar jenis bukti + penjelasan */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {proofPack.assets.map((asset) => {
                const isActive = asset.id === activeAsset.id;
                return (
                  <button
                    key={asset.id}
                    onClick={() => setActiveAsset(asset)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      isActive
                        ? 'bg-[#000666] text-white border-[#000666]'
                        : 'bg-white text-[#454652] border-[#767683]/25 hover:border-[#000666]/40'
                    }`}
                  >
                    {PROOF_KINDS[asset.kind].labelId}
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 bg-[#f5f3ef] rounded-lg border border-[#767683]/15 space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#a14000] mb-1">
                  Apa yang harus dilihat
                </p>
                <p className="text-xs text-[#1b1c1a] leading-relaxed">
                  {PROOF_KINDS[activeAsset.kind].whatToLookForId}
                </p>
              </div>
              <div className="pt-2.5 border-t border-[#767683]/15">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#a14000] mb-1">
                  Kenapa ini penting
                </p>
                <p className="text-xs text-[#454652] leading-relaxed">
                  {PROOF_KINDS[activeAsset.kind].whyItMattersId}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* Hasil penilaian verifikator                                 */}
      {/* ---------------------------------------------------------- */}
      {verification && (
        <div className="px-5 pb-5 space-y-4">
          <div className="border border-[#767683]/20 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-[#f5f3ef] border-b border-[#767683]/15">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#000666]">
                Hasil pemeriksaan kriteria
              </p>
            </div>
            <ul className="divide-y divide-[#767683]/10">
              {verification.assessments.map((a) => {
                const meta = CRITERIA[a.criterion];
                const style = RESULT_STYLE[a.result];
                const Icon = style.icon;
                return (
                  <li key={a.criterion} className="px-4 py-3 flex items-start gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: style.bg }}
                    >
                      <Icon className="w-3 h-3" style={{ color: style.color }} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1b1c1a]">
                        {meta.labelId}
                        <span
                          className="ml-2 text-[9px] font-bold uppercase tracking-wider"
                          style={{ color: style.color }}
                        >
                          {style.label}
                        </span>
                      </p>
                      <p className="text-[11px] text-[#767683] leading-relaxed mt-0.5">
                        {a.note ?? meta.descriptionId}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Siapa yang meninjau — pertaruhan nama */}
          {verifier && (
            <div className="p-4 bg-[#000666] rounded-lg text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffe088] mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Ditinjau oleh
              </p>
              <div className="flex items-start gap-3">
                {verifier.avatarUrl && (
                  <img
                    src={verifier.avatarUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-[#ffe088]/40 shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold">{verifier.name}</p>
                  <p className="text-[11px] text-white/70">
                    {verifier.role} · {verifier.affiliation}
                  </p>
                  {secondVerifier && (
                    <p className="text-[11px] text-[#ffe088] mt-1.5">
                      Ditinjau ulang oleh {secondVerifier.name} — kain bernilai tinggi diperiksa dua
                      verifikator.
                    </p>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-white/85 leading-relaxed mt-3 pt-3 border-t border-white/15">
                {verification.statement}
              </p>
            </div>
          )}

          {/* Batas peran AI */}
          {proofPack?.aiPrecheck && (
            <div className="p-3.5 bg-[#f5f3ef] border border-[#767683]/20 rounded-lg">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a14000] mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Pra-periksa otomatis
              </p>
              <ul className="space-y-1">
                {proofPack.aiPrecheck.notesForReviewer.map((note, i) => (
                  <li key={i} className="text-[11px] text-[#454652] leading-relaxed flex gap-1.5">
                    <span className="text-[#a14000]">·</span>
                    {note}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-[#767683] italic mt-2 pt-2 border-t border-[#767683]/15 leading-relaxed">
                Pemeriksaan otomatis hanya menyaring kelengkapan dan kualitas berkas, lalu menandai
                hal yang perlu diperhatikan. Keputusan keaslian sepenuhnya di tangan verifikator
                manusia yang namanya tercatat di atas.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* Transparansi bagi hasil                                     */}
      {/* ---------------------------------------------------------- */}
      {priceIDR && priceIDR > 0 && artisan && (
        <div className="px-5 pb-5">
          <div className="p-4 rounded-lg border border-[#a14000]/25 bg-[#a14000]/5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#a14000] mb-2 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" />
              Ke mana uangnya pergi
            </p>
            {(() => {
              const payout = calculatePayout(priceIDR);
              return (
                <>
                  <div className="flex items-end justify-between gap-3 mb-2">
                    <div>
                      <p className="text-[11px] text-[#454652]">
                        {artisan.name} menerima
                      </p>
                      <p className="font-serif-garamond text-2xl font-bold text-[#000666]">
                        {formatPrice(payout.artisanReceivesIDR, currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-[#454652]">Biaya platform</p>
                      <p className="text-sm font-bold text-[#767683]">
                        {formatPrice(payout.platformFeeIDR, currency)}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-[#767683]/20 flex">
                    <div
                      className="bg-[#a14000]"
                      style={{ width: `${payout.artisanSharePct}%` }}
                    />
                    <div className="bg-[#767683]" style={{ width: `${PLATFORM_FEE_PCT}%` }} />
                  </div>
                  <p className="text-[11px] text-[#454652] leading-relaxed mt-2">
                    <strong>{payout.artisanSharePct}%</strong> langsung ke pengrajin. Angka ini
                    ditampilkan terbuka justru karena itu pembedanya — pedagang perantara yang
                    membeli kain polosan lalu menempelkan mereknya sendiri tidak pernah
                    menyebutkan berapa yang mereka ambil.
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* Keterangan hukum                                            */}
      {/* ---------------------------------------------------------- */}
      <footer className="px-5 py-4 bg-[#f5f3ef] border-t border-[#767683]/15 space-y-2">
        {isHeritageMotif && (
          <p className="text-[10px] text-[#454652] leading-relaxed flex gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-[#a14000] shrink-0 mt-px" />
            {HERITAGE_MOTIF_NOTICE}
          </p>
        )}
        <p className="text-[10px] text-[#767683] leading-relaxed flex gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
          Ruang Canting tidak menyatakan jaminan keaslian. Yang ditampilkan adalah hasil
          pemeriksaan bukti oleh verifikator bernama pada tanggal tertentu, berikut dasar
          penilaiannya, supaya kamu bisa menilai sendiri.
        </p>
        {IS_DEMO_DATA && (
          <p className="text-[10px] text-[#854d0e] leading-relaxed flex gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
            {DEMO_DATA_NOTICE}
          </p>
        )}
      </footer>
    </section>
  );
};
