/**
 * SESI DAN PERAN PENGGUNA.
 *
 * ====================================================================
 * PERINGATAN: INI BUKAN AUTENTIKASI SUNGGUHAN
 * ====================================================================
 * Tidak ada kata sandi yang diperiksa, tidak ada token, tidak ada server yang
 * memutuskan. Sesi hanya tersimpan di peramban dan bisa dipalsukan siapa pun
 * yang paham perkakas peramban. Gantilah dengan autentikasi di sisi server
 * (mis. Supabase Auth) sebelum platform dipakai bertransaksi sungguhan.
 * ====================================================================
 *
 * SATU AKUN, BEBERAPA PERAN.
 *
 * Peran di sini bukan jenis akun yang terpisah, melainkan kemampuan yang
 * menempel pada satu identitas. Alasannya sederhana: seorang pengrajin juga
 * bisa membeli kain pengrajin lain. Kalau tiap peran dibuat akun sendiri,
 * satu orang harus punya dua akun — dan yang paling dirugikan justru UMKM
 * kecil yang ingin dipermudah.
 *
 * Karena itu setiap pengguna yang masuk selalu memiliki peran 'buyer', dan
 * sebagian menambahnya dengan 'artisan' atau 'verifier'.
 */

import { readCollection, nowIso, writeCollection } from './storage';

export type Role = 'buyer' | 'artisan' | 'verifier';

export const ROLE_LABEL: Record<Role, string> = {
  buyer: 'Pembeli',
  artisan: 'Pengrajin',
  verifier: 'Verifikator',
};

export interface Session {
  id: string;
  /** Selalu memuat 'buyer'. Peran lain bersifat tambahan. */
  roles: Role[];
  /** Pengrajin yang diwakili, bila punya peran 'artisan'. */
  artisanId?: string;
  displayName: string;
  /** Dipakai mengaitkan pesanan ke pemesannya. */
  accountId: string;
  signedInAt: string; // ISO 8601
}

const SESSION = 'session';

export async function getSession(): Promise<Session | null> {
  const rows = await readCollection<Session>(SESSION, []);
  return rows[0] ?? null;
}

export function hasRole(session: Session | null, role: Role): boolean {
  return Boolean(session?.roles.includes(role));
}

export async function signIn(input: {
  accountId: string;
  roles: Role[];
  artisanId?: string;
  displayName: string;
}): Promise<Session> {
  const session: Session = {
    id: 'sesi-aktif',
    accountId: input.accountId,
    // Siapa pun yang masuk otomatis bisa membeli.
    roles: Array.from(new Set<Role>(['buyer', ...input.roles])),
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

export interface DemoAccount {
  accountId: string;
  displayName: string;
  roles: Role[];
  artisanId?: string;
  description: string;
}

/**
 * Akun untuk peragaan, ditampilkan terbuka di layar masuk supaya jelas bahwa
 * ini peragaan dan bukan sistem masuk yang sebenarnya.
 *
 * Perhatikan bahwa Siti Rahmawati berperan pengrajin sekaligus pembeli. Itu
 * bukan kebetulan: dia dipakai memperagakan bahwa satu orang bisa menjual
 * karyanya sendiri dan membeli karya orang lain dengan akun yang sama.
 */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    accountId: 'akun-pembeli-1',
    displayName: 'Rani Kusuma',
    roles: ['buyer'],
    description:
      'Pembeli. Hanya bisa menjelajah, membeli, dan melacak pesanannya sendiri.',
  },
  {
    accountId: 'akun-siti',
    displayName: 'Siti Rahmawati',
    roles: ['artisan'],
    artisanId: 'art-trusmi',
    description:
      'Pengrajin bersertifikat BNSP, tertahan di syarat merek terdaftar. Bisa juga membeli kain pengrajin lain.',
  },
  {
    accountId: 'akun-wahyu',
    displayName: 'Wahyu Setianingsih',
    roles: ['artisan'],
    artisanId: 'art-wahyu',
    description: 'Pengrajin rumahan, baru sampai tingkat bukti proses terverifikasi.',
  },
  {
    accountId: 'akun-nur',
    displayName: 'Nur Cahyani',
    roles: ['verifier'],
    description: 'Verifikator. Meninjau paket bukti yang masuk dan memutuskan hasilnya.',
  },
];
