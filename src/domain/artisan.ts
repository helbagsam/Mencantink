import { Certificate, TrustTier, isCertificateExpired, tierRank } from './trust';

/**
 * PENGRAJIN — subjek utama platform ini.
 *
 * Perhatikan apa yang TIDAK ada di sini: nomor KTP, foto KTP, NPWP.
 * UU PDP No. 27 Tahun 2022 membatasi pemrosesan data pribadi pada tujuan yang
 * dinyatakan. Dokumen identitas dipakai sekali untuk pencocokan, lalu yang
 * disimpan hanya HASILNYA (identityCheckedAt), bukan dokumennya. Halaman publik
 * tidak boleh menampilkan dokumen identitas siapa pun.
 */
export interface Artisan {
  id: string;
  slug: string;
  name: string;
  workshop: string;
  city: string;
  region: string;
  avatarUrl: string;
  coverUrl?: string;
  bio: string;
  specialties: string[];
  techniques: Array<'Tulis' | 'Cap' | 'Kombinasi'>;
  tier: TrustTier;
  certificates: Certificate[];
  joinedAt: string; // ISO 8601
  /** Kapan identitas dicocokkan. Dokumennya sendiri tidak disimpan. */
  identityCheckedAt?: string;
  yearsOfPractice?: number;
  /** Status badan usaha — menentukan kelayakan Batikmark. */
  business: BusinessStatus;
}

/**
 * Syarat administratif Batikmark: merek terdaftar, NIB, NPWP, akta.
 * Inilah tembok yang menahan UMKM kecil, dan inilah yang platform bantu bongkar.
 */
export interface BusinessStatus {
  hasNib: boolean;
  hasNpwp: boolean;
  hasRegisteredTrademark: boolean;
  hasLegalEntity: boolean;
}

export const EMPTY_BUSINESS: BusinessStatus = {
  hasNib: false,
  hasNpwp: false,
  hasRegisteredTrademark: false,
  hasLegalEntity: false,
};

/* ------------------------------------------------------------------ */
/* Tangga naik tingkat                                                 */
/* ------------------------------------------------------------------ */

export interface LadderStep {
  key: string;
  labelId: string;
  done: boolean;
  /** Apa yang harus dilakukan kalau belum. Harus bisa langsung dikerjakan. */
  actionId?: string;
  /** Biaya resmi bila ada, supaya pengrajin tidak kaget. */
  costNoteId?: string;
}

export interface LadderProgress {
  currentTier: TrustTier;
  nextTier: TrustTier | null;
  steps: LadderStep[];
  completedCount: number;
  totalCount: number;
}

/**
 * Menghitung apa yang kurang untuk naik ke tingkat berikutnya.
 *
 * Ini bukan sekadar tampilan. Inilah daftar pekerjaan yang dijanjikan platform
 * ke pemberi dana: "menaikkan N pengrajin dari nol sertifikat ke sertifikat
 * kompetensi BNSP dalam 12 bulan" adalah langkah-langkah di bawah ini.
 */
export function computeLadder(
  artisan: Artisan,
  opts: { verifiedProofPackCount: number },
): LadderProgress {
  const now = new Date();
  const activeCerts = artisan.certificates.filter((c) => !isCertificateExpired(c, now));
  const hasLsp = activeCerts.some((c) => c.kind === 'lsp_bnsp');
  const hasBatikmark = activeCerts.some((c) => c.kind === 'batikmark');

  const currentTier = artisan.tier;
  const nextTier: TrustTier | null =
    currentTier === 'batikmark_certified'
      ? null
      : currentTier === 'competency_certified'
        ? 'batikmark_certified'
        : currentTier === 'process_verified'
          ? 'competency_certified'
          : 'process_verified';

  const steps: LadderStep[] = [];

  // Tingkat 1 -> 2: bukti proses ditinjau
  steps.push({
    key: 'identity',
    labelId: 'Identitas pengrajin dicocokkan',
    done: Boolean(artisan.identityCheckedAt),
    actionId: 'Tunjukkan dokumen identitas sekali kepada petugas verifikasi.',
  });
  steps.push({
    key: 'proof',
    labelId: 'Minimal satu paket bukti proses lolos tinjauan',
    done: opts.verifiedProofPackCount > 0,
    actionId: 'Unggah foto tampak depan, tampak belakang, makro, dan video proses.',
    costNoteId: 'Gratis. Cukup pakai kamera HP.',
  });

  // Tingkat 2 -> 3: kompetensi BNSP
  steps.push({
    key: 'lsp_training',
    labelId: 'Mengikuti pelatihan berbasis kompetensi',
    done: hasLsp,
    actionId: 'Daftar pelatihan skema batik di LSP BBKB atau lembaga pelatihan mitra.',
  });
  steps.push({
    key: 'lsp_cert',
    labelId: 'Sertifikat kompetensi BNSP (SKKNI No. 104 Tahun 2018)',
    done: hasLsp,
    actionId: 'Ikuti uji kompetensi. Sertifikat melekat pada orangnya, tidak butuh badan usaha.',
    costNoteId: 'Sering dibiayai program pemerintah daerah atau Dekranasda.',
  });

  // Tingkat 3 -> 4: syarat administratif Batikmark
  steps.push({
    key: 'nib',
    labelId: 'Nomor Induk Berusaha (NIB)',
    done: artisan.business.hasNib,
    actionId: 'Didaftarkan lewat sistem OSS. Platform mendampingi pengurusannya.',
    costNoteId: 'Tidak dipungut biaya.',
  });
  steps.push({
    key: 'npwp',
    labelId: 'NPWP',
    done: artisan.business.hasNpwp,
    actionId: 'Didaftarkan di kantor pajak atau daring.',
    costNoteId: 'Tidak dipungut biaya.',
  });
  steps.push({
    key: 'trademark',
    labelId: 'Sertifikat merek terdaftar',
    done: artisan.business.hasRegisteredTrademark,
    actionId: 'Didaftarkan ke DJKI. Inilah penghalang terbesar bagi UMKM kecil.',
    costNoteId: 'Berbayar, ada tarif khusus UMKM. Platform mendampingi pengurusannya.',
  });
  steps.push({
    key: 'batikmark',
    labelId: 'Sertifikat Batikmark (Permenperin No. 74/M-IND/PER/9/2007)',
    done: hasBatikmark,
    actionId:
      'Ajukan ke BBSPJI Kerajinan dan Batik. Petugas mengambil sampel kain di lokasi untuk diuji.',
    costNoteId: 'Berbayar berupa PNBP.',
  });

  return {
    currentTier,
    nextTier,
    steps,
    completedCount: steps.filter((s) => s.done).length,
    totalCount: steps.length,
  };
}

/**
 * Menentukan tingkat berdasarkan bukti yang benar-benar ada.
 *
 * Tingkat TIDAK BOLEH disetel manual. Dia selalu hasil hitungan dari sertifikat
 * dan tinjauan yang tercatat — supaya tidak bisa jadi sekadar tulisan seperti
 * badge "98% Authenticity" di versi lama.
 */
export function deriveTier(
  artisan: Pick<Artisan, 'certificates' | 'identityCheckedAt'>,
  opts: { verifiedProofPackCount: number },
  now = new Date(),
): TrustTier {
  const activeCerts = artisan.certificates.filter((c) => !isCertificateExpired(c, now));
  if (activeCerts.some((c) => c.kind === 'batikmark')) return 'batikmark_certified';
  if (activeCerts.some((c) => c.kind === 'lsp_bnsp')) return 'competency_certified';
  if (opts.verifiedProofPackCount > 0 && artisan.identityCheckedAt) return 'process_verified';
  return 'registered';
}

export function sortByTierDesc(a: Artisan, b: Artisan): number {
  return tierRank(b.tier) - tierRank(a.tier);
}
