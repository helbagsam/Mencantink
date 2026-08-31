import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Upload,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Loader2,
  PackageCheck,
  AlertTriangle,
  Camera,
  Info,
  X,
} from 'lucide-react';
import { BatikMotif, NavTab } from '../types';
import {
  HERITAGE_MOTIF_NOTICE,
  PROOF_KINDS,
  ProofAsset,
  ProofKind,
  ProofPack,
  REQUIRED_PROOF_KINDS,
} from '../domain/trust';
import { saveProofPack } from '../services/trustService';
import { newId, nowIso } from '../services/storage';
import { useSession } from '../hooks/useSession';
import { ROUTES } from '../routes';

interface OnboardingViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onAddProductToCatalog: (newMotif: BatikMotif) => void;
}

/** Urutan tampil: yang wajib dulu, remekan opsional di akhir. */
const URUTAN_BUKTI: ProofKind[] = ['front', 'back', 'macro', 'process_video', 'crack'];

/**
 * Nama motif klasik yang termasuk Ekspresi Budaya Tradisional. Kalau pengrajin
 * memakai nama ini, keterangan hak cipta dimunculkan supaya tidak ada yang
 * mengira motifnya jadi milik pribadi setelah diunggah.
 */
const MOTIF_WARISAN = ['parang', 'kawung', 'truntum', 'megamendung', 'mega mendung', 'sekar jagad', 'sido', 'sidomukti'];

/**
 * Menyusutkan gambar sebelum disimpan.
 *
 * Foto kamera ponsel bisa 3-8 MB, sedangkan localStorage hanya sekitar 5 MB
 * untuk seluruh aplikasi. Tanpa penyusutan, mengunggah dua foto saja sudah
 * membuat penyimpanan penuh dan diam-diam gagal. Setelah data pindah ke
 * server, berkas aslinya yang disimpan dan fungsi ini tinggal dilepas.
 */
async function susutkanGambar(file: File, maksSisi = 1200, mutu = 0.72): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  if (!file.type.startsWith('image/')) return dataUrl;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });

  const skala = Math.min(1, maksSisi / Math.max(img.width, img.height));
  if (skala === 1 && dataUrl.length < 400_000) return dataUrl;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * skala);
  canvas.height = Math.round(img.height * skala);
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', mutu);
}

/**
 * UNGGAH KAIN BARU.
 *
 * Versi sebelumnya membiarkan pengrajin menerbitkan kain ke katalog tanpa satu
 * pun bukti, dan borangnya terisi awal "Parang Rusak Barong" lengkap dengan
 * filosofi karangan — motif warisan diklaim sebagai karya baru. Keduanya
 * bertentangan dengan dasar produk ini.
 *
 * Sekarang paket bukti wajib lengkap sebelum kain bisa dikirim, dan kain yang
 * dikirim masuk ke antrean tinjauan, bukan langsung terpajang di pasar.
 */
export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onNavigateTab,
  onAddProductToCatalog,
}) => {
  const { session } = useSession();

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [technique, setTechnique] = useState<'Tulis' | 'Cap'>('Tulis');
  const [region, setRegion] = useState('');

  const [bukti, setBukti] = useState<Partial<Record<ProofKind, ProofAsset>>>({});
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [mengirim, setMengirim] = useState(false);
  const [selesai, setSelesai] = useState<{ nama: string } | null>(null);

  const buktiKurang = useMemo(
    () => REQUIRED_PROOF_KINDS.filter((k) => !bukti[k]),
    [bukti],
  );

  const namaMengandungMotifWarisan = useMemo(() => {
    const n = productName.toLowerCase();
    return MOTIF_WARISAN.some((m) => n.includes(m));
  }, [productName]);

  const bolehKirim =
    productName.trim().length > 2 &&
    region.trim().length > 1 &&
    price.trim().length > 0 &&
    buktiKurang.length === 0 &&
    !mengirim;

  const handleBerkas = async (kind: ProofKind, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await susutkanGambar(file);
    setBukti((prev) => ({
      ...prev,
      [kind]: {
        id: newId(),
        kind,
        url,
        mimeType: file.type || 'image/jpeg',
        capturedAt: nowIso(),
      },
    }));
  };

  const hapusBukti = (kind: ProofKind) => {
    setBukti((prev) => {
      const next = { ...prev };
      delete next[kind];
      return next;
    });
  };

  /**
   * AI membantu menyusun deskripsi jualan dari kata kunci pengrajin.
   *
   * Perhatikan yang TIDAK dilakukan di sini: AI tidak lagi diminta mengarang
   * filosofi dan sejarah motif. Filosofi batik adalah fakta budaya; kalau
   * dikarang model lalu keliru, yang rusak justru kredibilitas yang menjadi
   * seluruh jualan platform ini. Menyusun kalimat jualan dari keterangan yang
   * diberikan pengrajin sendiri adalah pekerjaan yang memang cocok untuk AI,
   * dan menjawab hambatan nyata: banyak pengrajin tidak sempat menulis.
   */
  const handleBantuTulis = async () => {
    setGeneratingAi(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motifName: productName || 'Kain batik',
          technique,
          region: region || 'Indonesia',
          keywords: keywords || 'kain batik buatan tangan',
        }),
      });
      const data = await res.json();
      if (data.error) {
        setAiError('Bantuan tulis belum tersedia. Silakan tulis manual dulu.');
        return;
      }
      if (data.result) {
        try {
          const parsed = JSON.parse(data.result);
          setDescription(parsed.heritageDescription || data.result);
        } catch {
          setDescription(data.result);
        }
      }
    } catch {
      setAiError('Bantuan tulis gagal dihubungi. Silakan tulis manual dulu.');
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleKirim = async () => {
    if (!bolehKirim || !session?.artisanId) return;
    setMengirim(true);

    const productId = `kain-${newId().slice(0, 8)}`;
    const daftarBukti = URUTAN_BUKTI.map((k) => bukti[k]).filter((b): b is ProofAsset => Boolean(b));

    const pack: ProofPack = {
      id: newId(),
      productId,
      artisanId: session.artisanId,
      assets: daftarBukti,
      status: 'submitted',
      submittedAt: nowIso(),
      aiPrecheck: {
        checkedAt: nowIso(),
        completeness: 'complete',
        missingKinds: [],
        notesForReviewer: [
          'Seluruh berkas wajib terlampir.',
          'Pemeriksaan ini hanya menilai kelengkapan berkas, bukan keaslian kain.',
        ],
        model: 'pemeriksa kelengkapan',
      },
    };

    await saveProofPack(pack);

    const hargaAngka = parseInt(price.replace(/[^0-9]/g, ''), 10);

    const motifBaru: BatikMotif = {
      id: productId,
      name: productName.trim(),
      region: region.trim(),
      technique,
      motifType: 'Non-Geometris',
      description: description.trim() || 'Belum ada keterangan dari pengrajin.',
      // Filosofi dan sejarah sengaja dikosongkan. Keduanya fakta budaya yang
      // tidak boleh diisi otomatis oleh sistem maupun dikarang model.
      philosophy: '',
      originHistory: '',
      imageUrl: bukti.front?.url ?? '',
      priceIDR: isNaN(hargaAngka) ? undefined : hargaAngka,
      priceEstimate: price.trim() ? `Rp ${price.trim()}` : undefined,
      artisanName: session.displayName,
      tags: [technique, region.trim()].filter(Boolean),
    };

    onAddProductToCatalog(motifBaru);
    setSelesai({ nama: motifBaru.name });
    setMengirim(false);
  };

  /* ---------------------------------------------------------------- */
  /* Layar setelah terkirim                                            */
  /* ---------------------------------------------------------------- */
  if (selesai) {
    return (
      <div className="w-full min-h-screen bg-[#fbf9f5] pt-28 pb-20 px-4 flex items-start justify-center">
        <div className="max-w-lg w-full bg-white border border-[#767683]/20 rounded-xl p-7 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#e0e7ff] flex items-center justify-center mx-auto mb-4">
            <PackageCheck className="w-7 h-7 text-[#000666]" />
          </div>
          <h2 className="font-serif-garamond text-2xl font-bold text-[#000666] mb-2">
            Terkirim ke antrean tinjauan
          </h2>
          <p className="text-xs text-[#454652] leading-relaxed mb-5">
            <strong>{selesai.nama}</strong> sudah masuk beserta paket buktinya. Kain ini belum
            dijual di Pasar Nusantara sampai verifikator selesai memeriksa buktinya. Itu memang
            aturannya, dan itu pula yang membuat kain berbukti di sini bernilai.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to={ROUTES.verification}
              className="flex-1 py-3 bg-[#000666] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#1a237e] transition-colors"
            >
              Lihat Antrean Tinjauan
            </Link>
            <button
              onClick={() => onNavigateTab('portal')}
              className="flex-1 py-3 border border-[#767683]/30 text-[#1b1c1a] rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#efeeea] transition-colors"
            >
              Kembali ke Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Borang                                                            */
  /* ---------------------------------------------------------------- */
  return (
    <div className="w-full min-h-screen bg-[#fbf9f5] pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => onNavigateTab('portal')}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#a14000] hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Portal Pengrajin
        </button>

        <h1 className="font-serif-garamond text-3xl md:text-4xl font-bold text-[#000666] mb-2">
          Unggah Kain Baru
        </h1>
        <p className="text-sm text-[#454652] leading-relaxed mb-8 max-w-2xl">
          Isi keterangan kain, lalu lampirkan bukti prosesnya. Kain tidak akan tampil di Pasar
          Nusantara sebelum buktinya ditinjau verifikator.
        </p>

        {/* ---------------------------------------------------------- */}
        {/* Bagian 1: keterangan kain                                   */}
        {/* ---------------------------------------------------------- */}
        <section className="bg-white border border-[#767683]/20 rounded-xl p-6 mb-5">
          <h2 className="font-serif-garamond text-xl font-bold text-[#000666] mb-4">
            1. Keterangan Kain
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a14000] mb-1">
                Nama Kain
              </label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="mis. Parang Sogan garapan sendiri"
                className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#000666]"
              />
              {namaMengandungMotifWarisan && (
                <p className="text-[11px] text-[#854d0e] leading-relaxed mt-2 flex gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
                  {HERITAGE_MOTIF_NOTICE}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a14000] mb-1">
                Teknik
              </label>
              <select
                value={technique}
                onChange={(e) => setTechnique(e.target.value as 'Tulis' | 'Cap')}
                className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#000666]"
              >
                <option value="Tulis">Batik Tulis</option>
                <option value="Cap">Batik Cap</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a14000] mb-1">
                Daerah
              </label>
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="mis. Cirebon"
                className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#000666]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a14000] mb-1">
                Harga (Rupiah)
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="numeric"
                placeholder="mis. 850000"
                className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#000666]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a14000] mb-1">
                Kata Kunci
              </label>
              <input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="mis. sutra, pewarna indigo alami"
                className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#000666]"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a14000]">
                  Keterangan Jualan
                </label>
                <button
                  onClick={handleBantuTulis}
                  disabled={generatingAi || !productName.trim()}
                  className="text-[10px] font-bold uppercase tracking-wider text-[#000666] hover:underline flex items-center gap-1 disabled:opacity-40 disabled:no-underline"
                >
                  {generatingAi ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" /> Menyusun...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" /> Bantu tuliskan
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Ceritakan kainnya dengan kalimat Anda sendiri. Atau isi kata kunci di atas, lalu tekan Bantu tuliskan."
                className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-sm leading-relaxed focus:outline-none focus:border-[#000666]"
              />
              {aiError && <p className="text-[11px] text-[#9f1239] mt-1">{aiError}</p>}
              <p className="text-[10px] text-[#767683] leading-relaxed mt-1.5">
                Bantuan tulis hanya menyusun kalimat jualan dari kata kunci Anda. Filosofi dan
                sejarah motif tidak diisi otomatis, karena itu fakta budaya yang tidak boleh
                dikarang sistem.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Bagian 2: bukti proses                                      */}
        {/* ---------------------------------------------------------- */}
        <section className="bg-white border border-[#767683]/20 rounded-xl p-6 mb-5">
          <h2 className="font-serif-garamond text-xl font-bold text-[#000666] mb-1">
            2. Bukti Proses
          </h2>
          <p className="text-xs text-[#454652] leading-relaxed mb-4">
            Cukup pakai kamera ponsel. Bukti inilah yang membuat kain Anda bisa dijual atas nama
            Anda sendiri, tanpa harus lewat pedagang perantara.
          </p>

          <div className="space-y-3">
            {URUTAN_BUKTI.map((kind) => {
              const meta = PROOF_KINDS[kind];
              const terisi = bukti[kind];
              return (
                <div
                  key={kind}
                  className={`rounded-lg border p-3.5 transition-colors ${
                    terisi ? 'border-[#166534]/30 bg-[#dcfce7]/30' : 'border-[#767683]/25 bg-[#f5f3ef]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {terisi ? (
                      <img
                        src={terisi.url}
                        alt=""
                        className="w-16 h-16 rounded object-cover border border-[#767683]/20 shrink-0"
                      />
                    ) : (
                      <span className="w-16 h-16 rounded bg-white border border-dashed border-[#767683]/40 flex items-center justify-center shrink-0">
                        <Camera className="w-5 h-5 text-[#767683]" />
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#1b1c1a] flex items-center gap-1.5 flex-wrap">
                        {meta.labelId}
                        {meta.required ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#9f1239]">
                            Wajib
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#767683]">
                            Opsional
                          </span>
                        )}
                        {terisi && <Check className="w-3.5 h-3.5 text-[#166534]" />}
                      </p>
                      <p className="text-[11px] text-[#454652] leading-relaxed mt-0.5">
                        {meta.whatToLookForId}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#767683]/30 rounded text-[10px] font-bold uppercase tracking-wider text-[#000666] hover:border-[#000666]">
                          <Upload className="w-3 h-3" />
                          {terisi ? 'Ganti' : 'Pilih Berkas'}
                          <input
                            type="file"
                            accept={kind === 'process_video' ? 'image/*,video/*' : 'image/*'}
                            onChange={(e) => void handleBerkas(kind, e)}
                            className="hidden"
                          />
                        </label>
                        {terisi && (
                          <button
                            onClick={() => hapusBukti(kind)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#9f1239] hover:underline"
                          >
                            <X className="w-3 h-3" />
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Kirim                                                       */}
        {/* ---------------------------------------------------------- */}
        <section className="bg-white border border-[#767683]/20 rounded-xl p-6">
          {buktiKurang.length > 0 && (
            <div className="flex gap-3 p-3.5 bg-[#fef3c7] border border-[#854d0e]/25 rounded-lg mb-4">
              <AlertTriangle className="w-5 h-5 text-[#854d0e] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#854d0e] uppercase tracking-wider">
                  Bukti belum lengkap
                </p>
                <p className="text-xs text-[#454652] mt-1 leading-relaxed">
                  Masih kurang: <strong>{buktiKurang.map((k) => PROOF_KINDS[k].labelId).join(', ')}</strong>.
                  Kain tidak bisa dikirim sebelum bukti wajib lengkap — itu aturan yang sama untuk
                  semua pengrajin, termasuk yang sudah bersertifikat.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => void handleKirim()}
            disabled={!bolehKirim}
            className="w-full py-3.5 bg-[#000666] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#1a237e] transition-colors disabled:bg-[#efeeea] disabled:text-[#767683] disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {mengirim ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Mengirim...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> Kirim untuk Ditinjau
              </>
            )}
          </button>

          <p className="text-[10px] text-[#767683] leading-relaxed mt-3 text-center">
            Setelah dikirim, kain masuk antrean verifikator. Kain baru tampil di Pasar Nusantara
            setelah buktinya selesai ditinjau.
          </p>
        </section>
      </div>
    </div>
  );
};
