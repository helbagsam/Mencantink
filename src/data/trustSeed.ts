import { IMG } from '../assets/images';
import { Artisan } from '../domain/artisan';
import {
  ProofPack,
  VerificationRecord,
  Verifier,
  buildVerificationStatement,
} from '../domain/trust';

/**
 * DATA AWAL UNTUK DEMO.
 *
 * Seluruh nama pengrajin, nama verifikator, dan nomor sertifikat di berkas ini
 * adalah CONTOH, bukan orang dan dokumen sungguhan. Menampilkan nomor sertifikat
 * karangan seolah-olah asli akan menjadi klaim menyesatkan menurut UU
 * Perlindungan Konsumen No. 8 Tahun 1999 — persis kesalahan yang produk ini
 * dibuat untuk melawan.
 *
 * Karena itu antarmuka selalu menampilkan penanda data contoh, dan setiap
 * berkas bukti ditandai placeholder: true. Ganti seluruhnya dengan data
 * lapangan sebelum platform ini dipakai bertransaksi sungguhan.
 */
export const IS_DEMO_DATA = true;

export const DEMO_DATA_NOTICE =
  'Data pada halaman ini adalah contoh untuk keperluan peragaan. Nama pengrajin, nama verifikator, dan nomor sertifikat belum merujuk pada orang dan dokumen sungguhan.';

/* ------------------------------------------------------------------ */
/* Verifikator                                                         */
/* ------------------------------------------------------------------ */

export const SEED_VERIFIERS: Verifier[] = [
  {
    id: 'ver-nur',
    name: 'Nur Cahyani',
    role: 'Pegiat Batik dan Kurator',
    affiliation: 'Komunitas Batik Tulis Lasem',
    avatarUrl: IMG['r1-1'],
  },
  {
    id: 'ver-wignyo',
    name: 'Wignyo Prasetyo',
    role: 'Asesor Kompetensi',
    affiliation: 'Lembaga Sertifikasi Profesi bidang batik',
    credential: 'Nomor registrasi asesor (contoh)',
    avatarUrl: IMG['artisan_avatar'],
  },
];

/* ------------------------------------------------------------------ */
/* Pengrajin                                                           */
/* ------------------------------------------------------------------ */

/**
 * Enam pengrajin sengaja ditempatkan pada tingkat yang berbeda-beda supaya
 * tangganya terlihat. Yang paling penting untuk dipahami adalah art-trusmi:
 * pengrajinnya bersertifikat kompetensi negara, keahliannya sudah diuji, tetapi
 * produknya tidak bisa memperoleh Batikmark semata-mata karena tidak punya
 * merek terdaftar. Di situlah letak ketimpangannya.
 *
 * Satu pengrajin sengaja dibiarkan pada tingkat "registered" tanpa verifikasi.
 * Sistem yang meloloskan semua orang bukan sistem verifikasi.
 */
export const SEED_ARTISANS: Artisan[] = [
  {
    id: 'art-harjo',
    slug: 'mpu-harjo',
    name: 'Mpu Harjo',
    workshop: 'Sanggar Keraton',
    city: 'Surakarta',
    region: 'Jawa Tengah',
    avatarUrl: IMG['artisan_avatar'],
    coverUrl: IMG['canting_workshop_img'],
    bio: 'Menekuni batik tulis pola keraton selama lebih dari tiga dasawarsa, dengan perhatian khusus pada pewarnaan soga alami.',
    specialties: ['Pola Keraton', 'Soga Alami', 'Canting Halus'],
    techniques: ['Tulis'],
    tier: 'batikmark_certified',
    yearsOfPractice: 35,
    joinedAt: '2024-02-11T00:00:00.000Z',
    identityCheckedAt: '2024-02-14T00:00:00.000Z',
    business: {
      hasNib: true,
      hasNpwp: true,
      hasRegisteredTrademark: true,
      hasLegalEntity: true,
    },
    certificates: [
      {
        id: 'cert-harjo-lsp',
        kind: 'lsp_bnsp',
        number: 'Nomor sertifikat kompetensi (contoh)',
        scheme: 'Pembuatan Kain Batik Tulis',
        issuer: 'Badan Nasional Sertifikasi Profesi',
        legalBasis: 'SKKNI No. 104 Tahun 2018',
        issuedAt: '2023-08-01T00:00:00.000Z',
        expiresAt: '2026-08-01T00:00:00.000Z',
        checkedByPlatformAt: '2024-02-20T00:00:00.000Z',
      },
      {
        id: 'cert-harjo-bm',
        kind: 'batikmark',
        number: 'Nomor Batikmark (contoh)',
        scheme: 'Batik Tulis',
        issuer: 'Kementerian Perindustrian RI',
        legalBasis: 'Permenperin No. 74/M-IND/PER/9/2007',
        issuedAt: '2024-01-15T00:00:00.000Z',
        expiresAt: '2027-01-15T00:00:00.000Z',
        checkedByPlatformAt: '2024-02-20T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'art-trusmi',
    slug: 'siti-rahmawati',
    name: 'Siti Rahmawati',
    workshop: 'Studio Khas Trusmi',
    city: 'Cirebon',
    region: 'Jawa Barat',
    avatarUrl: IMG['event-3'],
    coverUrl: IMG['mega-mendung'],
    bio: 'Perintis pewarnaan indigo fermentasi di Trusmi, menjaga motif pesisiran yang lahir dari jalur perdagangan laut.',
    specialties: ['Megamendung', 'Indigo Fermentasi', 'Motif Pesisir'],
    techniques: ['Tulis'],
    tier: 'competency_certified',
    yearsOfPractice: 22,
    joinedAt: '2024-03-05T00:00:00.000Z',
    identityCheckedAt: '2024-03-09T00:00:00.000Z',
    // Inilah tembok itu: keahliannya diakui negara, tetapi tanpa merek
    // terdaftar produknya tidak akan pernah bisa memperoleh Batikmark.
    business: {
      hasNib: true,
      hasNpwp: false,
      hasRegisteredTrademark: false,
      hasLegalEntity: false,
    },
    certificates: [
      {
        id: 'cert-trusmi-lsp',
        kind: 'lsp_bnsp',
        number: 'Nomor sertifikat kompetensi (contoh)',
        scheme: 'Pewarnaan Batik dengan Warna Alam',
        issuer: 'Badan Nasional Sertifikasi Profesi',
        legalBasis: 'SKKNI No. 104 Tahun 2018',
        issuedAt: '2024-05-20T00:00:00.000Z',
        expiresAt: '2027-05-20T00:00:00.000Z',
        checkedByPlatformAt: '2024-06-01T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'art-danar',
    slug: 'danar-sekarjagad',
    name: 'Danar Wibisono',
    workshop: 'Maestro Batik Danar',
    city: 'Surakarta',
    region: 'Jawa Tengah',
    avatarUrl: IMG['event-4'],
    coverUrl: IMG['sekar-jagad'],
    bio: 'Menggarap batik kombinasi tulis dan cap, menggabungkan ketepatan cap tembaga dengan isen-isen tangan.',
    specialties: ['Kombinasi Tulis dan Cap', 'Sekar Jagad'],
    techniques: ['Kombinasi', 'Cap'],
    tier: 'competency_certified',
    yearsOfPractice: 18,
    joinedAt: '2024-04-18T00:00:00.000Z',
    identityCheckedAt: '2024-04-22T00:00:00.000Z',
    business: {
      hasNib: true,
      hasNpwp: true,
      hasRegisteredTrademark: false,
      hasLegalEntity: true,
    },
    certificates: [
      {
        id: 'cert-danar-lsp',
        kind: 'lsp_bnsp',
        number: 'Nomor sertifikat kompetensi (contoh)',
        scheme: 'Pembuatan Kain Batik Cap',
        issuer: 'Badan Nasional Sertifikasi Profesi',
        legalBasis: 'SKKNI No. 104 Tahun 2018',
        issuedAt: '2024-02-10T00:00:00.000Z',
        expiresAt: '2027-02-10T00:00:00.000Z',
        checkedByPlatformAt: '2024-04-25T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'art-wahyu',
    slug: 'griyo-bu-wahyu',
    name: 'Wahyu Setianingsih',
    workshop: 'Griyo Batik Bu Wahyu',
    city: 'Surakarta',
    region: 'Jawa Tengah',
    avatarUrl: IMG['t1'],
    coverUrl: IMG['truntum'],
    bio: 'Membatik tulis di rumah bersama empat tetangga. Motif Truntum jadi andalan karena maknanya soal cinta yang tumbuh kembali.',
    specialties: ['Truntum', 'Batik Rumahan'],
    techniques: ['Tulis'],
    tier: 'process_verified',
    yearsOfPractice: 9,
    joinedAt: '2025-01-20T00:00:00.000Z',
    identityCheckedAt: '2025-01-24T00:00:00.000Z',
    business: {
      hasNib: false,
      hasNpwp: false,
      hasRegisteredTrademark: false,
      hasLegalEntity: false,
    },
    certificates: [],
  },
  {
    id: 'art-mekar',
    slug: 'koperasi-mekar-jaya',
    name: 'Koperasi Mekar Jaya',
    workshop: 'Koperasi Mekar Jaya',
    city: 'Yogyakarta',
    region: 'DI Yogyakarta',
    avatarUrl: IMG['event-2'],
    coverUrl: IMG['kawung'],
    bio: 'Koperasi berisi 24 pembatik cap yang berbagi satu set cap tembaga dan satu tungku pelorodan.',
    specialties: ['Batik Cap', 'Kawung', 'Produksi Bersama'],
    techniques: ['Cap'],
    tier: 'process_verified',
    yearsOfPractice: 12,
    joinedAt: '2025-02-14T00:00:00.000Z',
    identityCheckedAt: '2025-02-18T00:00:00.000Z',
    business: {
      hasNib: true,
      hasNpwp: false,
      hasRegisteredTrademark: false,
      hasLegalEntity: true,
    },
    certificates: [],
  },
  {
    id: 'art-lasem',
    slug: 'legenda-lasem',
    name: 'Koleksi Legenda Lasem',
    workshop: 'Koleksi Legenda Lasem',
    city: 'Lasem',
    region: 'Jawa Tengah',
    avatarUrl: IMG['r1-1'],
    bio: 'Baru bergabung. Menggarap batik tiga negeri dengan pewarnaan bertahap antar daerah.',
    specialties: ['Tiga Negeri', 'Pewarnaan Bertahap'],
    techniques: ['Tulis'],
    // Sengaja belum diverifikasi. Tingkat ini pun ditampilkan apa adanya
    // kepada pembeli, lengkap dengan peringatan untuk memeriksa sendiri.
    tier: 'registered',
    joinedAt: '2026-08-02T00:00:00.000Z',
    business: {
      hasNib: false,
      hasNpwp: false,
      hasRegisteredTrademark: false,
      hasLegalEntity: false,
    },
    certificates: [],
  },
];

/* ------------------------------------------------------------------ */
/* Paket bukti proses                                                  */
/* ------------------------------------------------------------------ */

/** Setiap berkas ditandai placeholder karena ini gambar contoh, bukan bukti asli. */
function demoAsset(
  id: string,
  kind: ProofPack['assets'][number]['kind'],
  url: string,
  capturedAt: string,
  note?: string,
) {
  return {
    id,
    kind,
    url,
    mimeType: kind === 'process_video' ? 'video/mp4' : 'image/jpeg',
    capturedAt,
    note,
    placeholder: true,
  };
}

export const SEED_PROOF_PACKS: ProofPack[] = [
  {
    id: 'pp-parang',
    productId: 'parang-rusak',
    artisanId: 'art-harjo',
    status: 'verified',
    submittedAt: '2025-11-04T02:10:00.000Z',
    assets: [
      demoAsset('pa-1', 'front', IMG['parang-rusak'], '2025-11-03T08:00:00.000Z'),
      demoAsset(
        'pa-2',
        'back',
        IMG['sekar-jagad'],
        '2025-11-03T08:04:00.000Z',
        'Motif pada sisi belakang terbaca jelas, malam menembus serat kain.',
      ),
      demoAsset(
        'pa-3',
        'macro',
        IMG['truntum'],
        '2025-11-03T08:09:00.000Z',
        'Tebal-tipis garis berubah, khas goresan canting tangan.',
      ),
      demoAsset('pa-4', 'crack', IMG['mega-mendung'], '2025-11-03T08:12:00.000Z'),
      demoAsset(
        'pa-5',
        'process_video',
        IMG['canting_workshop_img'],
        '2025-11-03T08:20:00.000Z',
        'Video proses mencanting. Berkas video sungguhan diisi saat pendataan lapangan.',
      ),
    ],
    aiPrecheck: {
      checkedAt: '2025-11-04T02:11:00.000Z',
      completeness: 'complete',
      missingKinds: [],
      notesForReviewer: [
        'Seluruh berkas wajib tersedia dan cukup tajam untuk ditinjau.',
        'Pencahayaan foto makro agak rendah, mohon diperhatikan saat menilai ketidakteraturan garis.',
      ],
      model: 'gemini-2.5-flash',
    },
  },
  {
    id: 'pp-megamendung',
    productId: 'mega-mendung',
    artisanId: 'art-trusmi',
    status: 'verified',
    submittedAt: '2025-12-12T03:30:00.000Z',
    assets: [
      demoAsset('pm-1', 'front', IMG['mega-mendung'], '2025-12-11T09:00:00.000Z'),
      demoAsset('pm-2', 'back', IMG['kawung'], '2025-12-11T09:05:00.000Z'),
      demoAsset('pm-3', 'macro', IMG['parang-rusak'], '2025-12-11T09:11:00.000Z'),
      demoAsset('pm-4', 'process_video', IMG['canting_workshop_img'], '2025-12-11T09:25:00.000Z'),
    ],
    aiPrecheck: {
      checkedAt: '2025-12-12T03:31:00.000Z',
      completeness: 'complete',
      missingKinds: [],
      notesForReviewer: ['Foto remekan belum diunggah, sifatnya opsional.'],
      model: 'gemini-2.5-flash',
    },
  },
  {
    id: 'pp-truntum',
    productId: 'truntum',
    artisanId: 'art-wahyu',
    status: 'verified',
    submittedAt: '2026-03-08T06:00:00.000Z',
    assets: [
      demoAsset('pt-1', 'front', IMG['truntum'], '2026-03-07T10:00:00.000Z'),
      demoAsset('pt-2', 'back', IMG['item-demo-1'], '2026-03-07T10:03:00.000Z'),
      demoAsset('pt-3', 'macro', IMG['cart-2'], '2026-03-07T10:08:00.000Z'),
      demoAsset('pt-4', 'process_video', IMG['canting_workshop_img'], '2026-03-07T10:15:00.000Z'),
    ],
    aiPrecheck: {
      checkedAt: '2026-03-08T06:01:00.000Z',
      completeness: 'complete',
      missingKinds: [],
      notesForReviewer: ['Berkas lengkap. Tidak ada catatan khusus.'],
      model: 'gemini-2.5-flash',
    },
  },
  {
    id: 'pp-kawung',
    productId: 'kawung',
    artisanId: 'art-mekar',
    status: 'verified',
    submittedAt: '2026-04-19T04:00:00.000Z',
    assets: [
      demoAsset('pk-1', 'front', IMG['kawung'], '2026-04-18T11:00:00.000Z'),
      demoAsset('pk-2', 'back', IMG['cart-1'], '2026-04-18T11:04:00.000Z'),
      demoAsset(
        'pk-3',
        'macro',
        IMG['event-2'],
        '2026-04-18T11:09:00.000Z',
        'Pengulangan bidang cap terlihat rapi dan konsisten, wajar untuk batik cap.',
      ),
      demoAsset('pk-4', 'process_video', IMG['canting_workshop_img'], '2026-04-18T11:20:00.000Z'),
    ],
    aiPrecheck: {
      checkedAt: '2026-04-19T04:01:00.000Z',
      completeness: 'complete',
      missingKinds: [],
      notesForReviewer: [
        'Pola berulang terdeteksi. Untuk batik cap hal ini wajar, bukan penanda kain print. Mohon dinilai verifikator.',
      ],
      model: 'gemini-2.5-flash',
    },
  },
  {
    id: 'pp-sekarjagad',
    productId: 'sekar-jagad',
    artisanId: 'art-danar',
    status: 'under_review',
    submittedAt: '2026-08-24T02:00:00.000Z',
    assets: [
      demoAsset('ps-1', 'front', IMG['sekar-jagad'], '2026-08-23T09:00:00.000Z'),
      demoAsset('ps-2', 'back', IMG['event-4'], '2026-08-23T09:05:00.000Z'),
    ],
    aiPrecheck: {
      checkedAt: '2026-08-24T02:01:00.000Z',
      completeness: 'incomplete',
      missingKinds: ['macro', 'process_video'],
      notesForReviewer: [
        'Foto makro dan video proses belum diunggah. Belum bisa ditinjau sampai lengkap.',
      ],
      model: 'gemini-2.5-flash',
    },
  },
];

/* ------------------------------------------------------------------ */
/* Catatan hasil tinjauan                                              */
/* ------------------------------------------------------------------ */

const nur = SEED_VERIFIERS[0];
const wignyo = SEED_VERIFIERS[1];

export const SEED_VERIFICATIONS: VerificationRecord[] = [
  {
    id: 'vr-parang',
    proofPackId: 'pp-parang',
    verifierId: nur.id,
    secondReviewerId: wignyo.id, // produk bernilai tinggi, ditinjau dua orang
    reviewedAt: '2025-11-06T07:30:00.000Z',
    conclusion: 'consistent_tulis',
    statement: buildVerificationStatement(nur, '2025-11-06T07:30:00.000Z', 'consistent_tulis'),
    assessments: [
      { criterion: 'tembus_belakang', result: 'met', note: 'Motif sisi belakang terbaca hampir sejelas sisi depan.' },
      { criterion: 'ketidakteraturan_garis', result: 'met', note: 'Lebar garis berubah wajar sepanjang goresan.' },
      { criterion: 'remekan_lilin', result: 'met' },
      { criterion: 'isen_isen', result: 'met', note: 'Isian berbeda-beda antar bidang, bukan hasil salinan.' },
      { criterion: 'kesesuaian_video', result: 'met' },
    ],
  },
  {
    id: 'vr-megamendung',
    proofPackId: 'pp-megamendung',
    verifierId: nur.id,
    reviewedAt: '2025-12-15T08:00:00.000Z',
    conclusion: 'consistent_tulis',
    statement: buildVerificationStatement(nur, '2025-12-15T08:00:00.000Z', 'consistent_tulis'),
    assessments: [
      { criterion: 'tembus_belakang', result: 'met' },
      { criterion: 'ketidakteraturan_garis', result: 'met' },
      { criterion: 'remekan_lilin', result: 'inconclusive', note: 'Foto remekan tidak diunggah, tidak dapat dinilai.' },
      { criterion: 'isen_isen', result: 'met' },
      { criterion: 'kesesuaian_video', result: 'met' },
    ],
  },
  {
    id: 'vr-truntum',
    proofPackId: 'pp-truntum',
    verifierId: wignyo.id,
    reviewedAt: '2026-03-11T05:00:00.000Z',
    conclusion: 'consistent_tulis',
    statement: buildVerificationStatement(wignyo, '2026-03-11T05:00:00.000Z', 'consistent_tulis'),
    assessments: [
      { criterion: 'tembus_belakang', result: 'met' },
      { criterion: 'ketidakteraturan_garis', result: 'met' },
      { criterion: 'remekan_lilin', result: 'inconclusive' },
      { criterion: 'isen_isen', result: 'met' },
      { criterion: 'kesesuaian_video', result: 'met' },
    ],
  },
  {
    id: 'vr-kawung',
    proofPackId: 'pp-kawung',
    verifierId: wignyo.id,
    reviewedAt: '2026-04-22T06:00:00.000Z',
    conclusion: 'consistent_cap',
    statement: buildVerificationStatement(wignyo, '2026-04-22T06:00:00.000Z', 'consistent_cap'),
    assessments: [
      { criterion: 'tembus_belakang', result: 'met', note: 'Malam menembus, sesuai ciri batik cap.' },
      {
        criterion: 'ketidakteraturan_garis',
        result: 'not_met',
        note: 'Garis rapi dan berulang. Wajar untuk batik cap, dan memang tidak diklaim sebagai batik tulis.',
      },
      { criterion: 'remekan_lilin', result: 'met' },
      { criterion: 'isen_isen', result: 'inconclusive' },
      { criterion: 'kesesuaian_video', result: 'met' },
    ],
  },
];

/** Peta cepat produk ke pengrajin, dipakai saat menyusun katalog. */
export const PRODUCT_ARTISAN_MAP: Record<string, string> = {
  'parang-rusak': 'art-harjo',
  'mega-mendung': 'art-trusmi',
  'sekar-jagad': 'art-danar',
  truntum: 'art-wahyu',
  kawung: 'art-mekar',
  'tiga-negeri': 'art-lasem',
};

/**
 * Motif klasik yang termasuk Ekspresi Budaya Tradisional. Halaman produknya
 * wajib menampilkan keterangan bahwa motif ini milik bersama dan tidak boleh
 * diklaim eksklusif oleh siapa pun (UU Hak Cipta No. 28 Tahun 2014 Pasal 38).
 */
export const HERITAGE_MOTIF_IDS = new Set([
  'parang-rusak',
  'kawung',
  'mega-mendung',
  'sekar-jagad',
  'truntum',
  'tiga-negeri',
]);
