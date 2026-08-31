/**
 * MODEL KEPERCAYAAN — inti produk Ruang Canting.
 *
 * Dua sertifikasi resmi yang sudah ada di Indonesia, ditambah satu tingkat
 * masuk yang bisa dicapai UMKM hanya dengan HP:
 *
 *  1. Bukti Proses      -> ditinjau verifikator platform (tingkat masuk)
 *  2. Kompetensi BNSP   -> SKKNI No. 104 Tahun 2018, LSP BBKB (sertifikasi ORANG)
 *  3. Batikmark         -> Permenperin No. 74/M-IND/PER/9/2007 (sertifikasi PRODUK)
 *
 * Batikmark mensyaratkan merek terdaftar + NIB + NPWP + akta, yang tidak
 * dimiliki UMKM kecil. Karena itu tingkatnya disusun sebagai TANGGA yang bisa
 * dinaiki, bukan gerbang lulus/tidak lulus.
 */

/* ------------------------------------------------------------------ */
/* Tingkat kepercayaan pengrajin                                       */
/* ------------------------------------------------------------------ */

export type TrustTier =
  | 'registered' // terdaftar, belum ada bukti ditinjau
  | 'process_verified' // bukti proses sudah ditinjau verifikator
  | 'competency_certified' // pengrajin punya sertifikat kompetensi BNSP
  | 'batikmark_certified'; // produk sudah ber-Batikmark

export const TRUST_TIER_ORDER: TrustTier[] = [
  'registered',
  'process_verified',
  'competency_certified',
  'batikmark_certified',
];

export interface TrustTierMeta {
  tier: TrustTier;
  labelId: string;
  labelEn: string;
  /** Dasar pengakuannya — ini yang membuat badge bukan sekadar tulisan. */
  basisId: string;
  /** Siapa yang mengakui. Platform tidak boleh jadi penjamin tunggal. */
  issuer: string;
  /** Terjemahan awam: apa artinya buat pembeli. */
  meaningId: string;
  accent: string; // warna aksen badge
  onAccent: string; // warna teks di atas aksen
}

export const TRUST_TIERS: Record<TrustTier, TrustTierMeta> = {
  registered: {
    tier: 'registered',
    labelId: 'Terdaftar',
    labelEn: 'Registered',
    basisId: 'Identitas pengrajin sudah dicocokkan, bukti proses belum ditinjau.',
    issuer: 'Ruang Canting',
    meaningId:
      'Pengrajin ini nyata dan identitasnya sudah dicocokkan, tetapi kainnya belum diperiksa verifikator. Periksa sendiri bukti prosesnya sebelum membeli.',
    accent: '#767683',
    onAccent: '#ffffff',
  },
  process_verified: {
    tier: 'process_verified',
    labelId: 'Bukti Proses Terverifikasi',
    labelEn: 'Process Verified',
    basisId:
      'Foto tampak depan, tampak belakang, makro, remekan, dan video proses telah ditinjau verifikator manusia.',
    issuer: 'Verifikator Ruang Canting',
    meaningId:
      'Ada verifikator bernama yang sudah memeriksa bukti fisik kain ini dan menyatakan cirinya konsisten dengan teknik yang diklaim. Kamu bisa memeriksa buktinya sendiri di bawah.',
    accent: '#a14000',
    onAccent: '#ffffff',
  },
  competency_certified: {
    tier: 'competency_certified',
    labelId: 'Pengrajin Bersertifikat BNSP',
    labelEn: 'BNSP Certified Artisan',
    basisId:
      'Sertifikat kompetensi kerja berdasarkan SKKNI No. 104 Tahun 2018, diuji oleh LSP BBKB dan diterbitkan BNSP.',
    issuer: 'Badan Nasional Sertifikasi Profesi (BNSP)',
    meaningId:
      'Negara sudah menguji dan mengakui keahlian orang yang membuat kain ini. Sertifikat ini melekat pada pengrajinnya, bukan pada merek dagang.',
    accent: '#000666',
    onAccent: '#ffe088',
  },
  batikmark_certified: {
    tier: 'batikmark_certified',
    labelId: 'Produk Ber-Batikmark',
    labelEn: 'Batikmark Certified',
    basisId:
      'Batikmark "batik INDONESIA" sesuai Permenperin No. 74/M-IND/PER/9/2007. Sampel kain diuji langsung oleh BBSPJI Kerajinan dan Batik.',
    issuer: 'Kementerian Perindustrian RI',
    meaningId:
      'Sampel kainnya diambil petugas dan diuji di laboratorium negara. Ini pengakuan keaslian tertinggi yang tersedia di Indonesia.',
    accent: '#8a6d1f',
    onAccent: '#ffffff',
  },
};

export function tierRank(tier: TrustTier): number {
  return TRUST_TIER_ORDER.indexOf(tier);
}

export function isAtLeast(tier: TrustTier, minimum: TrustTier): boolean {
  return tierRank(tier) >= tierRank(minimum);
}

/* ------------------------------------------------------------------ */
/* Sertifikat resmi                                                    */
/* ------------------------------------------------------------------ */

export type CertificateKind = 'lsp_bnsp' | 'batikmark';

/** Klaster skema LSP BBKB, semuanya mengacu SKKNI No. 104 Tahun 2018. */
export const LSP_SCHEMES = [
  'Perancangan Motif Kain Batik',
  'Pembuatan Kain Batik Tulis',
  'Pembuatan Kain Batik Cap',
  'Pewarnaan Batik dengan Zat Warna Sintetis',
  'Pewarnaan Batik dengan Warna Alam',
] as const;

export type LspScheme = (typeof LSP_SCHEMES)[number];

/**
 * Warna logo Batikmark menandakan jenis batiknya.
 *
 * CATATAN HUKUM: logo Batikmark adalah Hak Cipta terdaftar milik Kemenperin
 * (No. 034100, 5 Juni 2007). Aplikasi ini hanya MENYEBUT nomor sertifikat,
 * tidak menampilkan logonya, sampai ada izin penggunaan resmi.
 */
export const BATIKMARK_VARIANT: Record<'Tulis' | 'Cap' | 'Kombinasi', string> = {
  Tulis: 'Emas',
  Cap: 'Putih',
  Kombinasi: 'Perak',
};

export interface Certificate {
  id: string;
  kind: CertificateKind;
  /** Nomor sertifikat sebagaimana tertera pada dokumen aslinya. */
  number: string;
  /** Untuk LSP: klaster skemanya. Untuk Batikmark: jenis batiknya. */
  scheme?: string;
  issuer: string;
  legalBasis: string;
  issuedAt: string; // ISO 8601
  expiresAt?: string; // ISO 8601
  /** Kapan platform mencocokkan nomor ini ke dokumen fisik atau pangkalan data. */
  checkedByPlatformAt?: string;
}

export function isCertificateExpired(cert: Certificate, now = new Date()): boolean {
  if (!cert.expiresAt) return false;
  return new Date(cert.expiresAt).getTime() < now.getTime();
}

/* ------------------------------------------------------------------ */
/* Bukti proses                                                        */
/* ------------------------------------------------------------------ */

export type ProofKind = 'front' | 'back' | 'macro' | 'crack' | 'process_video';

export interface ProofKindMeta {
  kind: ProofKind;
  labelId: string;
  /** Apa yang harus dilihat pembeli. Ini bagian edukasinya. */
  whatToLookForId: string;
  /** Kenapa ini sulit dipalsukan penjual kain print. */
  whyItMattersId: string;
  required: boolean;
}

export const PROOF_KINDS: Record<ProofKind, ProofKindMeta> = {
  front: {
    kind: 'front',
    labelId: 'Tampak Depan',
    whatToLookForId:
      'Lihat keseluruhan komposisi motif dan warnanya. Ini acuan untuk membandingkan dengan sisi belakang.',
    whyItMattersId: 'Jadi pembanding. Tanpa foto depan, foto belakang tidak bisa dinilai.',
    required: true,
  },
  back: {
    kind: 'back',
    labelId: 'Tampak Belakang',
    whatToLookForId:
      'Pada batik tulis dan cap, malam menembus kain sehingga motif di sisi belakang hampir sejelas sisi depan. Pada kain print, sisi belakang pucat atau nyaris polos.',
    whyItMattersId:
      'Pembeda paling telak dan paling mudah dinilai orang awam. Kain print tidak bisa memalsukannya karena pewarnaannya memang hanya menempel di permukaan.',
    required: true,
  },
  macro: {
    kind: 'macro',
    labelId: 'Foto Makro Garis',
    whatToLookForId:
      'Garis batik tulis selalu sedikit tidak rata dan tebal-tipisnya berubah, karena digambar tangan dengan canting. Garis print sempurna, tajam, dan berulang persis.',
    whyItMattersId: 'Ketidaksempurnaan justru buktinya. Mesin tidak bisa berpura-pura ragu-ragu.',
    required: true,
  },
  crack: {
    kind: 'crack',
    labelId: 'Remekan (Retak Lilin)',
    whatToLookForId:
      'Garis-garis halus tak beraturan tempat warna merembes lewat retakan malam saat proses pewarnaan.',
    whyItMattersId:
      'Remekan hanya muncul dari proses malam yang sungguhan. Motif print yang meniru remekan akan berulang polanya.',
    required: false,
  },
  process_video: {
    kind: 'process_video',
    labelId: 'Video Proses',
    whatToLookForId:
      'Video pendek pengrajin sedang mencanting atau mengecap kain ini, memperlihatkan tangan dan alatnya.',
    whyItMattersId:
      'Menghubungkan kain dengan orang yang membuatnya. Inilah yang tidak bisa diberikan pedagang white label.',
    required: true,
  },
};

export const REQUIRED_PROOF_KINDS: ProofKind[] = (
  Object.values(PROOF_KINDS) as ProofKindMeta[]
)
  .filter((m) => m.required)
  .map((m) => m.kind);

export interface ProofAsset {
  id: string;
  kind: ProofKind;
  /** URL berkas. Sekarang aset lokal; nanti URL storage. */
  url: string;
  mimeType: string;
  capturedAt: string; // ISO 8601
  note?: string;
  /**
   * Menandai berkas contoh untuk keperluan demo, bukan bukti dari pengrajin
   * sungguhan. Ditampilkan terbuka di antarmuka. Platform yang menyembunyikan
   * mana yang contoh dan mana yang asli sudah kehilangan alasan keberadaannya.
   */
  placeholder?: boolean;
}

export type ProofPackStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'needs_revision';

export interface ProofPack {
  id: string;
  productId: string;
  artisanId: string;
  assets: ProofAsset[];
  status: ProofPackStatus;
  submittedAt?: string; // ISO 8601
  aiPrecheck?: AiPrecheck;
}

export function missingRequiredProof(pack: ProofPack): ProofKind[] {
  const present = new Set(pack.assets.map((a) => a.kind));
  return REQUIRED_PROOF_KINDS.filter((k) => !present.has(k));
}

/* ------------------------------------------------------------------ */
/* Pra-periksa AI                                                      */
/* ------------------------------------------------------------------ */

/**
 * BATAS TEGAS: AI hanya menyaring kelengkapan dan kualitas berkas, lalu
 * menandai hal yang perlu diperhatikan. AI TIDAK PERNAH memutuskan keaslian.
 * Keputusan selalu di tangan verifikator manusia yang namanya tercatat.
 *
 * Alasannya bukan teknis tapi tanggung jawab: kalau satu kain palsu lolos,
 * yang harus bisa dimintai pertanggungjawaban adalah manusia, bukan model.
 */
export interface AiPrecheck {
  checkedAt: string; // ISO 8601
  completeness: 'complete' | 'incomplete';
  missingKinds: ProofKind[];
  /** Catatan untuk perhatian verifikator, bukan vonis. */
  notesForReviewer: string[];
  model: string;
}

/* ------------------------------------------------------------------ */
/* Verifikator dan hasil tinjauan                                      */
/* ------------------------------------------------------------------ */

export interface Verifier {
  id: string;
  name: string;
  /** mis. Pegiat Batik, Asesor Kompetensi, Kurator */
  role: string;
  affiliation: string;
  /** Nomor registrasi asesor bila ada. */
  credential?: string;
  avatarUrl?: string;
}

export type CriterionKey =
  | 'tembus_belakang'
  | 'ketidakteraturan_garis'
  | 'remekan_lilin'
  | 'isen_isen'
  | 'kesesuaian_video';

export interface CriterionMeta {
  key: CriterionKey;
  labelId: string;
  descriptionId: string;
}

export const CRITERIA: Record<CriterionKey, CriterionMeta> = {
  tembus_belakang: {
    key: 'tembus_belakang',
    labelId: 'Tembus ke Belakang',
    descriptionId:
      'Motif pada sisi belakang kain terlihat jelas, menandakan malam menembus serat kain.',
  },
  ketidakteraturan_garis: {
    key: 'ketidakteraturan_garis',
    labelId: 'Ketidakteraturan Garis',
    descriptionId:
      'Tebal-tipis garis berubah secara alami sebagaimana goresan canting tangan.',
  },
  remekan_lilin: {
    key: 'remekan_lilin',
    labelId: 'Remekan Lilin',
    descriptionId: 'Retakan malam tampak acak dan tidak berulang polanya.',
  },
  isen_isen: {
    key: 'isen_isen',
    labelId: 'Isen-isen',
    descriptionId: 'Isian ornamen dikerjakan satu per satu dengan variasi antar bidang.',
  },
  kesesuaian_video: {
    key: 'kesesuaian_video',
    labelId: 'Kesesuaian Video Proses',
    descriptionId: 'Kain pada video proses cocok dengan kain pada foto produk.',
  },
};

export type CriterionResult = 'met' | 'not_met' | 'inconclusive';

export interface CriterionAssessment {
  criterion: CriterionKey;
  result: CriterionResult;
  note?: string;
}

/**
 * Kesimpulan sengaja ditulis sebagai "konsisten dengan", bukan "dijamin asli".
 *
 * DASAR HUKUM: UU Perlindungan Konsumen No. 8 Tahun 1999 melarang klaim yang
 * menyesatkan. Platform tidak berada di lokasi produksi, jadi yang jujur
 * dinyatakan adalah hasil pemeriksaan bukti, bukan jaminan atas fakta yang
 * tidak disaksikan sendiri. Ini sekaligus melindungi verifikatornya.
 */
export type VerificationConclusion =
  | 'consistent_tulis'
  | 'consistent_cap'
  | 'consistent_kombinasi'
  | 'insufficient_evidence'
  | 'inconsistent';

export const CONCLUSION_LABEL: Record<VerificationConclusion, string> = {
  consistent_tulis: 'Konsisten dengan ciri batik tulis',
  consistent_cap: 'Konsisten dengan ciri batik cap',
  consistent_kombinasi: 'Konsisten dengan ciri batik kombinasi tulis dan cap',
  insufficient_evidence: 'Bukti belum memadai untuk disimpulkan',
  inconsistent: 'Tidak konsisten dengan teknik yang diklaim',
};

export interface VerificationRecord {
  id: string;
  proofPackId: string;
  verifierId: string;
  reviewedAt: string; // ISO 8601
  assessments: CriterionAssessment[];
  conclusion: VerificationConclusion;
  /** Kalimat yang ditampilkan ke pembeli. Selalu berbasis prosedur. */
  statement: string;
  /** Verifikator kedua untuk produk bernilai tinggi. */
  secondReviewerId?: string;
}

/**
 * Menyusun kalimat klaim yang aman: menyebut siapa, kapan, dan atas dasar apa.
 * Tidak pernah menyatakan jaminan.
 */
export function buildVerificationStatement(
  verifier: Verifier,
  reviewedAt: string,
  conclusion: VerificationConclusion,
): string {
  const tanggal = new Date(reviewedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return `Bukti proses ditinjau oleh ${verifier.name} (${verifier.role}, ${verifier.affiliation}) pada ${tanggal}. Hasil pemeriksaan: ${CONCLUSION_LABEL[conclusion].toLowerCase()}.`;
}

/* ------------------------------------------------------------------ */
/* Ekspresi Budaya Tradisional                                         */
/* ------------------------------------------------------------------ */

/**
 * Motif klasik seperti Parang, Kawung, dan Truntum adalah Ekspresi Budaya
 * Tradisional. UU Hak Cipta No. 28 Tahun 2014 Pasal 38 menempatkan hak ciptanya
 * pada negara, jadi tidak boleh ada satu pengrajin pun yang mengklaimnya secara
 * eksklusif di platform ini. Yang diakui miliknya adalah karya turunan dan
 * penggarapannya.
 */
export const HERITAGE_MOTIF_NOTICE =
  'Motif ini merupakan Ekspresi Budaya Tradisional milik bersama bangsa Indonesia (UU Hak Cipta No. 28 Tahun 2014). Tidak ada pihak yang boleh mengklaimnya secara eksklusif. Yang diakui sebagai karya pengrajin adalah penggarapan dan hasil kainnya.';

/* ------------------------------------------------------------------ */
/* Transparansi bagi hasil                                             */
/* ------------------------------------------------------------------ */

/**
 * Komisi platform, ditampilkan terbuka di setiap halaman produk.
 * Angkanya kecil dan diumumkan justru karena itu pembedanya: tengkulak
 * white label mengambil selisih ratusan persen dan tidak pernah menyebutkannya.
 */
export const PLATFORM_FEE_PCT = 5;

export interface PayoutBreakdown {
  totalIDR: number;
  platformFeeIDR: number;
  artisanReceivesIDR: number;
  artisanSharePct: number;
}

export function calculatePayout(totalIDR: number): PayoutBreakdown {
  const platformFeeIDR = Math.round((totalIDR * PLATFORM_FEE_PCT) / 100);
  return {
    totalIDR,
    platformFeeIDR,
    artisanReceivesIDR: totalIDR - platformFeeIDR,
    artisanSharePct: 100 - PLATFORM_FEE_PCT,
  };
}
