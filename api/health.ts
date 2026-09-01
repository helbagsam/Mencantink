/**
 * Fungsi uji sederhana.
 *
 * Sempat dipakai untuk memastikan integrasi Supabase menyuntikkan peubah
 * lingkungannya. Daftar itu sudah dilepas kembali: jalur ini terbuka untuk
 * umum, dan menyebut peubah apa saja yang terpasang di sebuah proyek adalah
 * informasi yang tidak perlu dibagikan.
 *
 * Nilai peubah tidak pernah dikembalikan dari sini dalam keadaan apa pun.
 */
export default function handler(
  _req: unknown,
  res: { status: (n: number) => { json: (b: unknown) => void } },
) {
  res.status(200).json({
    status: 'ok',
    app: 'Ruang Canting',
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    geminiSiap: Boolean(process.env.GEMINI_API_KEY),
  });
}
