import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Minus,
  X as XIcon,
  Loader2,
  Inbox,
  Gavel,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  CONCLUSION_LABEL,
  CRITERIA,
  CriterionAssessment,
  CriterionKey,
  CriterionResult,
  PROOF_KINDS,
  ProofPack,
  VerificationConclusion,
  VerificationRecord,
  buildVerificationStatement,
  missingRequiredProof,
} from '../domain/trust';
import { Artisan } from '../domain/artisan';
import {
  getArtisans,
  getProofPacks,
  getVerifiers,
  recomputeArtisanTier,
  saveProofPack,
  saveVerification,
} from '../services/trustService';
import { newId, nowIso } from '../services/storage';
import { useSession } from '../hooks/useSession';
import { ROUTES } from '../routes';

const SEMUA_KRITERIA: CriterionKey[] = [
  'tembus_belakang',
  'ketidakteraturan_garis',
  'remekan_lilin',
  'isen_isen',
  'kesesuaian_video',
];

const PILIHAN_HASIL: Array<{ nilai: CriterionResult; label: string; warna: string; bg: string }> = [
  { nilai: 'met', label: 'Terpenuhi', warna: '#166534', bg: '#dcfce7' },
  { nilai: 'inconclusive', label: 'Tidak dapat dinilai', warna: '#854d0e', bg: '#fef3c7' },
  { nilai: 'not_met', label: 'Tidak terpenuhi', warna: '#9f1239', bg: '#ffe4e6' },
];

const PILIHAN_KESIMPULAN: VerificationConclusion[] = [
  'consistent_tulis',
  'consistent_cap',
  'consistent_kombinasi',
  'insufficient_evidence',
  'inconsistent',
];

/**
 * ANTREAN TINJAUAN VERIFIKATOR.
 *
 * Inilah sisi lain dari panel bukti: tempat keputusan itu benar-benar dibuat,
 * oleh manusia yang namanya tercatat pada hasilnya.
 *
 * Perhatikan apa yang tidak ada di sini: tidak ada tombol "setujui semua",
 * tidak ada nilai yang terisi otomatis, dan kesimpulan tidak bisa dikirim
 * sebelum seluruh kriteria dinilai satu per satu. Verifikasi yang bisa
 * diselesaikan dengan satu klik bukan verifikasi.
 */
export const VerificationQueueView: React.FC = () => {
  const { session } = useSession();

  const [packs, setPacks] = useState<ProofPack[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [aktif, setAktif] = useState<ProofPack | null>(null);
  const [penilaian, setPenilaian] = useState<Partial<Record<CriterionKey, CriterionResult>>>({});
  const [catatan, setCatatan] = useState<Partial<Record<CriterionKey, string>>>({});
  const [kesimpulan, setKesimpulan] = useState<VerificationConclusion | null>(null);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);

  const muat = useCallback(async () => {
    const [semuaPack, semuaArtisan] = await Promise.all([getProofPacks(), getArtisans()]);
    setPacks(semuaPack.filter((p) => p.status === 'submitted' || p.status === 'under_review'));
    setArtisans(semuaArtisan);
    setLoading(false);
  }, []);

  useEffect(() => {
    void muat();
  }, [muat]);

  const pilihPack = (pack: ProofPack) => {
    setAktif(pack);
    setPenilaian({});
    setCatatan({});
    setKesimpulan(null);
    setPesan(null);
  };

  const semuaDinilai = SEMUA_KRITERIA.every((k) => penilaian[k]);

  /* Bukti wajib yang belum diunggah. Selama masih ada yang kurang, kain tidak
     boleh diluluskan — satu-satunya kesimpulan yang tersedia adalah bahwa
     buktinya belum memadai. Tanpa aturan ini, verifikator bisa meloloskan kain
     yang berkas wajibnya belum lengkap, dan pra-periksa yang sudah menandainya
     jadi tidak ada gunanya. */
  const buktiKurang = aktif ? missingRequiredProof(aktif) : [];
  const bolehDiluluskan = buktiKurang.length === 0;
  const kesimpulanMeluluskan =
    kesimpulan !== null && kesimpulan !== 'insufficient_evidence' && kesimpulan !== 'inconsistent';
  const kesimpulanSah = kesimpulan !== null && (bolehDiluluskan || !kesimpulanMeluluskan);
  const bolehKirim = Boolean(aktif && semuaDinilai && kesimpulanSah && !menyimpan);

  const handleKirimHasil = async () => {
    if (!aktif || !kesimpulan || !session) return;
    setMenyimpan(true);

    const verifiers = await getVerifiers();
    const verifier =
      verifiers.find((v) => v.name === session.displayName) ?? verifiers[0];

    const assessments: CriterionAssessment[] = SEMUA_KRITERIA.map((k) => ({
      criterion: k,
      result: penilaian[k] as CriterionResult,
      note: catatan[k]?.trim() || undefined,
    }));

    const reviewedAt = nowIso();
    const record: VerificationRecord = {
      id: newId(),
      proofPackId: aktif.id,
      verifierId: verifier.id,
      reviewedAt,
      assessments,
      conclusion: kesimpulan,
      statement: buildVerificationStatement(verifier, reviewedAt, kesimpulan),
    };

    await saveVerification(record);

    /* Hasil yang menyatakan bukti belum memadai tidak meloloskan kain.
       Kainnya kembali ke pengrajin untuk dilengkapi, bukan diam-diam lolos. */
    const lolos = kesimpulan !== 'insufficient_evidence' && kesimpulan !== 'inconsistent';
    await saveProofPack({
      ...aktif,
      status: lolos ? 'verified' : 'needs_revision',
    });

    /* Tingkat pengrajin dihitung ulang dari bukti yang kini tercatat. */
    await recomputeArtisanTier(aktif.artisanId);

    setPesan(
      lolos
        ? 'Hasil tinjauan tersimpan. Kain ini sekarang boleh dijual dan buktinya tampil di halaman produk.'
        : 'Hasil tinjauan tersimpan. Kain dikembalikan ke pengrajin untuk dilengkapi dan tetap tidak dijual.',
    );
    setAktif(null);
    setMenyimpan(false);
    await muat();
  };

  const namaPengrajin = (id: string) =>
    artisans.find((a) => a.id === id)?.name ?? 'Pengrajin tidak dikenal';

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center gap-2 text-sm text-[#767683]">
        <Loader2 className="w-5 h-5 animate-spin" />
        Memuat antrean...
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <header className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#000666]/10 text-[#000666] rounded-full text-xs font-bold uppercase tracking-widest mb-3">
          <Gavel className="w-4 h-4" /> Ruang Verifikasi
        </div>
        <h1 className="font-serif-garamond text-3xl md:text-4xl font-bold text-[#000666]">
          Antrean Tinjauan Bukti
        </h1>
        <p className="text-sm text-[#454652] mt-2 max-w-2xl leading-relaxed">
          Anda meninjau sebagai <strong>{session?.displayName}</strong>. Nama Anda akan tercantum
          pada hasil tinjauan dan terlihat oleh pembeli — itulah yang membuat penilaian ini
          bernilai.
        </p>
      </header>

      {pesan && (
        <div className="p-4 bg-[#dcfce7] border border-[#166534]/30 rounded-lg mb-6 flex gap-3">
          <Check className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" />
          <p className="text-xs text-[#166534] leading-relaxed">{pesan}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daftar antrean */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#a14000]">
            Menunggu ditinjau ({packs.length})
          </h2>

          {packs.length === 0 ? (
            <div className="p-5 bg-white border border-dashed border-[#767683]/30 rounded-lg text-center">
              <Inbox className="w-8 h-8 text-[#767683] mx-auto mb-2" />
              <p className="text-xs text-[#767683] leading-relaxed">
                Tidak ada bukti yang menunggu. Kain baru yang diunggah pengrajin akan muncul di
                sini.
              </p>
            </div>
          ) : (
            packs.map((pack) => (
              <button
                key={pack.id}
                onClick={() => pilihPack(pack)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                  aktif?.id === pack.id
                    ? 'bg-[#000666] text-white border-[#000666]'
                    : 'bg-white border-[#767683]/25 hover:border-[#000666]/50'
                }`}
              >
                <p className="text-xs font-bold">{pack.productId}</p>
                <p
                  className={`text-[11px] mt-0.5 ${
                    aktif?.id === pack.id ? 'text-white/75' : 'text-[#454652]'
                  }`}
                >
                  {namaPengrajin(pack.artisanId)} · {pack.assets.length} berkas
                </p>
              </button>
            ))
          )}
        </div>

        {/* Panel penilaian */}
        <div className="lg:col-span-2">
          {!aktif ? (
            <div className="p-8 bg-white border border-[#767683]/20 rounded-xl text-center">
              <p className="text-sm text-[#767683]">
                Pilih satu kain di sebelah kiri untuk mulai meninjau buktinya.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-[#767683]/20 rounded-xl overflow-hidden">
              {/* Berkas bukti */}
              <div className="p-5 border-b border-[#767683]/15">
                <h3 className="font-serif-garamond text-xl font-bold text-[#000666] mb-3">
                  Bukti dari {namaPengrajin(aktif.artisanId)}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {aktif.assets.map((a) => (
                    <figure key={a.id} className="space-y-1">
                      <img
                        src={a.url}
                        alt={PROOF_KINDS[a.kind].labelId}
                        className="w-full aspect-square object-cover rounded border border-[#767683]/20"
                      />
                      <figcaption className="text-[10px] font-bold uppercase tracking-wider text-[#454652]">
                        {PROOF_KINDS[a.kind].labelId}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              {/* Penilaian kriteria */}
              <div className="p-5 space-y-4 border-b border-[#767683]/15">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#a14000]">
                  Nilai setiap kriteria
                </h4>

                {SEMUA_KRITERIA.map((k) => {
                  const meta = CRITERIA[k];
                  return (
                    <div key={k} className="pb-3 border-b border-[#767683]/10 last:border-0">
                      <p className="text-xs font-bold text-[#1b1c1a]">{meta.labelId}</p>
                      <p className="text-[11px] text-[#767683] leading-relaxed mb-2">
                        {meta.descriptionId}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {PILIHAN_HASIL.map((p) => {
                          const aktifP = penilaian[k] === p.nilai;
                          const Ikon =
                            p.nilai === 'met' ? Check : p.nilai === 'not_met' ? XIcon : Minus;
                          return (
                            <button
                              key={p.nilai}
                              onClick={() => setPenilaian((prev) => ({ ...prev, [k]: p.nilai }))}
                              className="px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1"
                              style={
                                aktifP
                                  ? { backgroundColor: p.bg, color: p.warna, borderColor: p.warna }
                                  : {
                                      backgroundColor: '#fff',
                                      color: '#767683',
                                      borderColor: '#76768340',
                                    }
                              }
                            >
                              <Ikon className="w-3 h-3" />
                              {p.label}
                            </button>
                          );
                        })}
                      </div>

                      <input
                        value={catatan[k] ?? ''}
                        onChange={(e) => setCatatan((prev) => ({ ...prev, [k]: e.target.value }))}
                        placeholder="Catatan (opsional) — ditampilkan ke pembeli"
                        className="w-full bg-[#f5f3ef] border border-[#767683]/25 rounded px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-[#000666]"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Kesimpulan */}
              <div className="p-5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#a14000] mb-2">
                  Kesimpulan
                </h4>
                {!bolehDiluluskan && (
                  <div className="flex gap-3 p-3.5 bg-[#fef3c7] border border-[#854d0e]/25 rounded-lg mb-3">
                    <AlertTriangle className="w-5 h-5 text-[#854d0e] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#454652] leading-relaxed">
                      Bukti wajib belum lengkap — kurang{' '}
                      <strong>{buktiKurang.map((k) => PROOF_KINDS[k].labelId).join(', ')}</strong>.
                      Kain tidak dapat diluluskan sebelum berkasnya lengkap. Pilihan yang tersedia
                      hanya menyatakan bukti belum memadai, sehingga kain dikembalikan ke pengrajin.
                    </p>
                  </div>
                )}

                <div className="space-y-1.5 mb-4">
                  {PILIHAN_KESIMPULAN.map((c) => {
                    const meluluskan = c !== 'insufficient_evidence' && c !== 'inconsistent';
                    const terkunci = meluluskan && !bolehDiluluskan;
                    return (
                      <label
                        key={c}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-colors ${
                          terkunci
                            ? 'border-[#767683]/20 bg-[#efeeea] cursor-not-allowed opacity-55'
                            : kesimpulan === c
                              ? 'border-[#000666] bg-[#e0e7ff] cursor-pointer'
                              : 'border-[#767683]/25 hover:border-[#000666]/40 cursor-pointer'
                        }`}
                      >
                        <input
                          type="radio"
                          name="kesimpulan"
                          disabled={terkunci}
                          checked={kesimpulan === c}
                          onChange={() => setKesimpulan(c)}
                          className="mt-0.5"
                        />
                        <span className="text-xs text-[#1b1c1a]">
                          {CONCLUSION_LABEL[c]}
                          {terkunci && (
                            <span className="block text-[10px] text-[#767683] mt-0.5">
                              Terkunci sampai bukti wajib lengkap
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {!semuaDinilai && (
                  <p className="text-[11px] text-[#854d0e] leading-relaxed mb-3 flex gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
                    Seluruh kriteria harus dinilai lebih dulu. Tidak ada jalan pintas menyetujui
                    tanpa memeriksa.
                  </p>
                )}

                <button
                  onClick={() => void handleKirimHasil()}
                  disabled={!bolehKirim}
                  className="w-full py-3 bg-[#000666] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#1a237e] transition-colors disabled:bg-[#efeeea] disabled:text-[#767683] disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {menyimpan ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    <>
                      <Gavel className="w-4 h-4" /> Simpan Hasil Tinjauan
                    </>
                  )}
                </button>

                <p className="text-[10px] text-[#767683] leading-relaxed mt-3 flex gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
                  Hasil tinjauan beserta nama Anda akan tampil di halaman kain ini dan dapat dibaca
                  siapa pun. Kain baru boleh dijual setelah hasilnya tersimpan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-[11px] text-[#767683] mt-8 pt-4 border-t border-[#767683]/15">
        Kembali ke{' '}
        <Link to={ROUTES.artisans} className="text-[#a14000] font-semibold hover:underline">
          Daftar Pengrajin
        </Link>
        .
      </p>
    </div>
  );
};
