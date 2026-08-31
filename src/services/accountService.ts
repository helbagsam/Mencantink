/**
 * PENDAFTARAN AKUN.
 *
 * ====================================================================
 * TIDAK ADA KATA SANDI DI SINI, DAN ITU DISENGAJA
 * ====================================================================
 * Aplikasi ini belum punya server yang bisa menyimpan kata sandi dengan aman.
 * Menampilkan kolom kata sandi yang isinya tidak pernah diperiksa — atau lebih
 * buruk, disimpan apa adanya di peramban — akan mengajari orang mengetikkan
 * kata sandi sungguhan ke tempat yang tidak mengamankannya. Itu kebiasaan yang
 * berbahaya di luar aplikasi ini juga.
 *
 * Jadi selama tahap peragaan, masuk cukup dengan alamat surel. Saat autentikasi
 * dipindah ke server nanti (mis. Supabase Auth), kata sandi atau tautan masuk
 * sekali pakai ditangani di sana, dan hanya berkas ini yang berubah.
 * ====================================================================
 *
 * UU PDP No. 27 Tahun 2022 — yang TIDAK disimpan di sini:
 * nomor KTP, foto KTP, dan NPWP. Dokumen identitas hanya diperlihatkan sekali
 * kepada petugas verifikasi, lalu yang dicatat cukup hasilnya. Menyimpan
 * salinannya di peramban berarti menyebar data pribadi tanpa perlu.
 */

import { newId, nowIso, readCollection, upsert } from './storage';
import { Role } from './sessionService';

export interface Account {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  roles: Role[];
  /** Terisi bila akun ini mendaftar sebagai pengrajin. */
  artisanId?: string;
  createdAt: string; // ISO 8601
  /** Persetujuan pemrosesan data pribadi, wajib menurut UU PDP. */
  consentAt: string; // ISO 8601
}

/** Data tambahan yang hanya diminta saat mendaftar sebagai pengrajin. */
export interface ArtisanRegistration {
  workshop: string;
  city: string;
  region: string;
  techniques: Array<'Tulis' | 'Cap' | 'Kombinasi'>;
  yearsOfPractice: number;
  bio: string;
  /** Nomor sertifikat kompetensi BNSP bila sudah punya. Boleh dikosongkan. */
  lspCertificateNumber?: string;
  /** Nomor Batikmark bila sudah punya. Boleh dikosongkan. */
  batikmarkNumber?: string;
  hasNib: boolean;
  hasNpwp: boolean;
  hasRegisteredTrademark: boolean;
  hasLegalEntity: boolean;
}

const ACCOUNTS = 'accounts';

export async function getAccounts(): Promise<Account[]> {
  return readCollection<Account>(ACCOUNTS, []);
}

export async function findAccountByEmail(email: string): Promise<Account | null> {
  const rows = await getAccounts();
  const bersih = email.trim().toLowerCase();
  return rows.find((a) => a.email.toLowerCase() === bersih) ?? null;
}

export interface RegisterInput {
  email: string;
  fullName: string;
  phone?: string;
  asArtisan: boolean;
  artisan?: ArtisanRegistration;
}

export type RegisterResult =
  | { ok: true; account: Account }
  | { ok: false; error: string };

export async function registerAccount(input: RegisterInput): Promise<RegisterResult> {
  const email = input.email.trim().toLowerCase();

  if (!email.includes('@') || email.length < 5) {
    return { ok: false, error: 'Alamat surel belum benar.' };
  }
  if (input.fullName.trim().length < 3) {
    return { ok: false, error: 'Nama lengkap belum diisi.' };
  }
  if (await findAccountByEmail(email)) {
    return { ok: false, error: 'Alamat surel ini sudah terdaftar. Silakan masuk.' };
  }
  if (input.asArtisan && !input.artisan) {
    return { ok: false, error: 'Data sanggar belum lengkap.' };
  }

  const account: Account = {
    id: newId(),
    email,
    fullName: input.fullName.trim(),
    phone: input.phone?.trim() || undefined,
    roles: input.asArtisan ? ['buyer', 'artisan'] : ['buyer'],
    artisanId: input.asArtisan ? `art-${newId().slice(0, 8)}` : undefined,
    createdAt: nowIso(),
    consentAt: nowIso(),
  };

  await upsert<Account>(ACCOUNTS, account, []);
  return { ok: true, account };
}
