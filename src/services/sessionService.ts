/**
 * SESI PENGGUNA.
 *
 * ====================================================================
 * PERINGATAN: INI BUKAN AUTENTIKASI SUNGGUHAN
 * ====================================================================
 * Tidak ada kata sandi yang diperiksa, tidak ada token, tidak ada server
 * yang memutuskan. Sesi hanya disimpan di peramban dan siapa pun yang paham
 * peramban bisa memalsukannya.
 *
 * Gunanya di tahap ini ada dua, dan keduanya nyata:
 *   1. Menutup halaman yang seharusnya tidak terbuka untuk umum. Sebelum ini
 *      siapa pun bisa membuka /portal dan membaca nama serta kota pembeli
 *      dari daftar pesanan — pemrosesan data pribadi tanpa dasar yang sah
 *      menurut UU PDP No. 27 Tahun 2022.
 *   2. Membuat peran pengguna menjadi nyata di dalam kode, sehingga saat
 *      autentikasi sungguhan dipasang nanti, yang berubah hanya isi berkas
 *      ini — bukan setiap halaman.
 *
 * Sebelum platform dipakai bertransaksi sungguhan, ganti dengan autentikasi
 * di sisi server (mis. Supabase Auth) dan pemeriksaan hak akses per data.
 * ====================================================================
 */

import { readCollection, nowIso, writeCollection } from './storage';

export type Role = 'artisan' | 'verifier';

export interface Session {
  id: string;
  role: Role;
  /** Pengrajin yang diwakili sesi ini. Kosong untuk verifikator. */
  artisanId?: string;
  displayName: string;
  signedInAt: string; // ISO 8601
}

const SESSION = 'session';

/** Hanya ada satu sesi aktif pada satu waktu di peramban ini. */
export async function getSession(): Promise<Session | null> {
  const rows = await readCollection<Session>(SESSION, []);
  return rows[0] ?? null;
}

export async function signIn(input: {
  role: Role;
  artisanId?: string;
  displayName: string;
}): Promise<Session> {
  const session: Session = {
    id: 'sesi-aktif',
    role: input.role,
    artisanId: input.artisanId,
    displayName: input.displayName,
    signedInAt: nowIso(),
  };
  await writeCollection<Session>(SESSION, [session]);
  notify();
  return session;
}

export async function signOut(): Promise<void> {
  await writeCollection<Session>(SESSION, []);
  notify();
}

/* ------------------------------------------------------------------ */
/* Pemberitahuan perubahan sesi                                        */
/* ------------------------------------------------------------------ */

/**
 * Komponen perlu tahu ketika sesi berubah tanpa harus memuat ulang halaman.
 * Dipakai oleh hook useSession di komponen.
 */
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function onSessionChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ------------------------------------------------------------------ */
/* Akun peragaan                                                       */
/* ------------------------------------------------------------------ */

/**
 * Akun yang bisa dipilih saat peragaan. Ditampilkan terbuka di layar masuk
 * supaya jelas bahwa ini peragaan, bukan sistem masuk yang sebenarnya.
 */
export const DEMO_ACCOUNTS: Array<{
  role: Role;
  artisanId?: string;
  displayName: string;
  description: string;
}> = [
  {
    role: 'artisan',
    artisanId: 'art-trusmi',
    displayName: 'Siti Rahmawati',
    description:
      'Pengrajin bersertifikat kompetensi BNSP, tertahan di syarat merek terdaftar untuk Batikmark.',
  },
  {
    role: 'artisan',
    artisanId: 'art-wahyu',
    displayName: 'Wahyu Setianingsih',
    description: 'Pengrajin rumahan, baru sampai tingkat bukti proses terverifikasi.',
  },
  {
    role: 'verifier',
    displayName: 'Nur Cahyani',
    description: 'Verifikator. Meninjau paket bukti yang masuk dan memutuskan hasilnya.',
  },
];
