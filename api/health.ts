/**
 * Fungsi uji dan diagnostik.
 *
 * ====================================================================
 * HANYA MELAPORKAN ADA ATAU TIDAK, TIDAK PERNAH NILAINYA
 * ====================================================================
 * Jalur ini terbuka untuk umum. Yang dikembalikan hanya boolean: apakah
 * sebuah peubah lingkungan terisi. Nilainya tidak pernah ikut, karena
 * SUPABASE_SERVICE_ROLE_KEY dan sejenisnya memberi akses penuh ke basis data
 * dan melewati seluruh aturan keamanan baris. Satu kali bocor berarti
 * seluruh isi basis data terbuka.
 *
 * Diagnostik ini dipasang untuk memastikan integrasi Supabase benar-benar
 * menyuntikkan peubahnya. Setelah selesai dipakai, sebaiknya dilepas —
 * daftar nama peubah yang terpasang tetap informasi yang tidak perlu
 * dibagikan ke publik.
 * ====================================================================
 */

const PEUBAH_DIPERIKSA = [
  // Gemini
  'GEMINI_API_KEY',
  'GEMINI_MODEL',
  // Supabase — pustaka klien
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_JWT_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  // Supabase — sambungan Postgres langsung
  'POSTGRES_URL',
  'POSTGRES_URL_NON_POOLING',
  'POSTGRES_PRISMA_URL',
  'POSTGRES_HOST',
  'POSTGRES_DATABASE',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
] as const;

export default function handler(
  _req: unknown,
  res: { status: (n: number) => { json: (b: unknown) => void } },
) {
  const terpasang: Record<string, boolean> = {};
  for (const nama of PEUBAH_DIPERIKSA) {
    terpasang[nama] = Boolean(process.env[nama]);
  }

  res.status(200).json({
    status: 'ok',
    app: 'Ruang Canting',
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    /** Hanya ada atau tidak. Nilainya tidak pernah dikirim. */
    peubahLingkungan: terpasang,
  });
}
