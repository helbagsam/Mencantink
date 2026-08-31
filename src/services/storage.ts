/**
 * LAPISAN PENYIMPANAN — satu-satunya tempat di seluruh aplikasi yang tahu
 * di mana data disimpan.
 *
 * ====================================================================
 * CARA PINDAH KE DATABASE NANTI
 * ====================================================================
 * Komponen tidak pernah memanggil localStorage langsung. Semuanya lewat
 * fungsi di file ini dan di services/*.ts. Untuk pindah ke Supabase:
 *
 *   1. Ganti isi readCollection/writeCollection di bawah dengan panggilan
 *      supabase.from(name).select() / .upsert()
 *   2. Selesai. Tidak ada satu pun komponen yang perlu diubah.
 *
 * Semua fungsi di sini sengaja dibuat async PADAHAL localStorage itu sinkron
 * dan tidak membutuhkannya. Alasannya: database diakses lewat jaringan. Kalau
 * fungsi-fungsi ini baru dibuat async nanti, setiap komponen yang memakainya
 * harus ditulis ulang. Dibuat async sekarang gratis, dan menghemat berhari-hari
 * pekerjaan nanti.
 *
 * Aturan bentuk data supaya impor ke Postgres nanti bersih:
 *   - id berupa UUID (lihat newId)
 *   - semua waktu berupa string ISO 8601 (lihat nowIso)
 *   - relasi berupa id, bukan objek bersarang
 * ====================================================================
 */

const PREFIX = 'batiknusantara';
const SCHEMA_VERSION = 1;

function keyFor(collection: string): string {
  return `${PREFIX}:v${SCHEMA_VERSION}:${collection}`;
}

/** Penanda bahwa data awal sudah pernah ditanam, supaya tidak menimpa perubahan pengguna. */
function seededKeyFor(collection: string): string {
  return `${keyFor(collection)}:seeded`;
}

/**
 * localStorage bisa melempar galat: mode penyamaran, kuota penuh, atau
 * peramban yang memblokir penyimpanan situs. Semua akses dibungkus supaya
 * aplikasi tetap jalan (dengan data awal) alih-alih layar putih saat demo.
 */
function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    // Kuota penuh biasanya karena foto base64. Jangan sampai menghentikan aplikasi.
    console.warn(`[storage] gagal menyimpan "${key}" — kemungkinan kuota penuh.`);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Operasi dasar koleksi                                               */
/* ------------------------------------------------------------------ */

export interface HasId {
  id: string;
}

/**
 * Membaca satu koleksi. Kalau belum pernah ada, data awal ditanam lebih dulu.
 * Data awal hanya ditanam SEKALI, sehingga penghapusan oleh pengguna tetap
 * bertahan setelah muat ulang halaman.
 */
export async function readCollection<T extends HasId>(
  collection: string,
  seed: T[] = [],
): Promise<T[]> {
  const raw = safeGet(keyFor(collection));

  if (raw === null) {
    const alreadySeeded = safeGet(seededKeyFor(collection)) === 'true';
    if (!alreadySeeded && seed.length > 0) {
      safeSet(keyFor(collection), JSON.stringify(seed));
      safeSet(seededKeyFor(collection), 'true');
      return structuredClone(seed);
    }
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    console.warn(`[storage] data "${collection}" rusak, memakai data awal.`);
    return structuredClone(seed);
  }
}

export async function writeCollection<T extends HasId>(
  collection: string,
  rows: T[],
): Promise<void> {
  safeSet(keyFor(collection), JSON.stringify(rows));
}

export async function findById<T extends HasId>(
  collection: string,
  id: string,
  seed: T[] = [],
): Promise<T | null> {
  const rows = await readCollection<T>(collection, seed);
  return rows.find((r) => r.id === id) ?? null;
}

/** Menyisipkan baris baru atau memperbarui yang sudah ada, berdasarkan id. */
export async function upsert<T extends HasId>(
  collection: string,
  row: T,
  seed: T[] = [],
): Promise<T> {
  const rows = await readCollection<T>(collection, seed);
  const index = rows.findIndex((r) => r.id === row.id);
  if (index >= 0) {
    rows[index] = row;
  } else {
    rows.unshift(row);
  }
  await writeCollection(collection, rows);
  return row;
}

export async function removeById<T extends HasId>(
  collection: string,
  id: string,
  seed: T[] = [],
): Promise<void> {
  const rows = await readCollection<T>(collection, seed);
  await writeCollection(
    collection,
    rows.filter((r) => r.id !== id),
  );
}

/** Membersihkan seluruh data aplikasi. Dipakai tombol "ulang demo". */
export async function resetAll(): Promise<void> {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(`${PREFIX}:`)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* diabaikan */
  }
}

/* ------------------------------------------------------------------ */
/* Pembantu bentuk data                                                */
/* ------------------------------------------------------------------ */

/** UUID, supaya id yang dibuat sekarang langsung cocok saat diimpor ke Postgres. */
export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Cadangan untuk peramban lama atau konteks non-https.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Waktu sekarang dalam ISO 8601 — format yang langsung diterima kolom timestamptz. */
export function nowIso(): string {
  return new Date().toISOString();
}
