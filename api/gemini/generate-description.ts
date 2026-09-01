import { generateListingDraft } from '../../lib/gemini';

/**
 * Fungsi tanpa server untuk Vercel.
 *
 * Kunci Gemini dibaca dari peubah lingkungan di sisi server dan TIDAK PERNAH
 * dikirim ke peramban. Ini penting karena repositorinya publik: kunci yang
 * pernah masuk ke kode sisi klien berarti kunci yang bocor ke semua orang.
 * Setel GEMINI_API_KEY lewat pengaturan proyek di Vercel, bukan di dalam repo.
 */

interface VercelRequest {
  method?: string;
  body?: unknown;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Gunakan metode POST.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(400).json({
      error:
        'GEMINI_API_KEY belum disetel. Tambahkan di Settings > Environment Variables pada proyek Vercel.',
    });
    return;
  }

  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as
      | Record<string, string>
      | undefined;

    const text = await generateListingDraft(
      {
        motifName: body?.motifName,
        technique: body?.technique,
        region: body?.region,
        keywords: body?.keywords,
      },
      apiKey,
    );

    res.status(200).json({ result: text });
  } catch (err) {
    const pesan = err instanceof Error ? err.message : 'Gagal menghubungi layanan AI.';
    console.error('Gemini API Error:', pesan);
    res.status(500).json({ error: pesan });
  }
}
