/**
 * Fungsi uji paling sederhana: tanpa impor apa pun.
 *
 * Gunanya memisahkan penyebab bila fungsi lain gagal. Kalau jalur ini hidup
 * sementara /api/gemini gagal, berarti masalahnya ada pada pustaka yang
 * dipanggil, bukan pada pengaturan fungsi tanpa server itu sendiri.
 */
export default function handler(
  _req: unknown,
  res: { status: (n: number) => { json: (b: unknown) => void } },
) {
  res.status(200).json({
    status: 'ok',
    app: 'Ruang Canting',
    geminiKeyTerpasang: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
  });
}
