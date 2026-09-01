/**
 * Bantuan menulis keterangan jualan — fungsi tanpa server untuk Vercel.
 *
 * ====================================================================
 * KENAPA BERKAS INI BERDIRI SENDIRI, DAN KENAPA .js BUKAN .ts
 * ====================================================================
 * Endpoint ini dua kali gagal di Vercel dengan FUNCTION_INVOCATION_FAILED:
 * fungsinya berhasil dibangun lalu jatuh saat dipanggil, sehingga kegagalannya
 * tidak muncul di catatan build.
 *
 * Dua penyebab yang sudah disingkirkan satu per satu:
 *   1. Paket @google/genai gagal dimuat. Diganti panggilan REST biasa —
 *      untuk satu permintaan sederhana, SDK tidak memberi keuntungan apa pun.
 *   2. Berkas ini mengimpor lib/ di luar folder api/, dan berkas .ts
 *      dikompilasi memakai tsconfig aplikasi yang disetel untuk peramban
 *      (moduleResolution "bundler", allowImportingTsExtensions, noEmit) —
 *      pengaturan yang tidak sah untuk keluaran Node.
 *
 * Karena itu seluruh isinya disatukan di satu berkas JavaScript polos: tidak
 * ada yang perlu dikompilasi, tidak ada yang perlu ditelusuri, tidak ada
 * impor yang bisa terlewat. Yang menghidupi peragaan lebih penting daripada
 * kerapian pemisahan berkas.
 *
 * Server pengembangan (server.ts) mengimpor generateListingDraft dari berkas
 * ini juga, supaya perintah ke model tidak pernah berbeda antara komputer
 * sendiri dan produksi.
 * ====================================================================
 *
 * BATAS YANG DISENGAJA: model TIDAK boleh mengarang filosofi motif, makna
 * simbol, atau asal-usul sejarah. Itu fakta budaya. Kalau model salah dan
 * kelirunya tampil di halaman produk, yang rusak justru kredibilitas yang
 * menjadi seluruh alasan keberadaan platform ini.
 */

const ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * @typedef {object} DraftInput
 * @property {string} [motifName]
 * @property {string} [technique]
 * @property {string} [region]
 * @property {string} [keywords]
 */

/**
 * @param {DraftInput} input
 * @returns {string}
 */
export function buildListingPrompt(input) {
  const { motifName, technique, region, keywords } = input;

  return `Anda membantu seorang pengrajin batik Indonesia menuliskan keterangan jualan untuk kainnya di sebuah lokapasar.

Keterangan yang diberikan pengrajin:
- Nama kain: ${motifName || '(belum diisi)'}
- Teknik: ${technique || '(belum diisi)'}
- Daerah: ${region || '(belum diisi)'}
- Kata kunci dari pengrajin: ${keywords || '(belum diisi)'}

ATURAN YANG WAJIB DIPATUHI:
1. Tulis dalam bahasa Indonesia yang wajar dan sederhana, bukan bahasa iklan yang berlebihan.
2. JANGAN mengarang filosofi motif, makna simbol, kisah sejarah, atau asal-usul keraton. Itu fakta budaya yang tidak boleh ditebak. Kalau pengrajin tidak menyebutkannya, jangan tulis.
3. JANGAN membuat klaim keaslian, jaminan mutu, atau kata seperti "dijamin asli", "100% autentik". Keaslian ditentukan verifikator, bukan tulisan penjual.
4. JANGAN menyebut angka atau kisaran harga.
5. Hanya rangkai ulang keterangan yang benar-benar diberikan di atas. Kalau keterangannya sedikit, tulisannya boleh pendek.
6. Panjang 2 sampai 3 kalimat saja.

Balas dengan JSON mentah tanpa blok markdown:
{
  "heritageDescription": "keterangan jualan 2-3 kalimat sesuai aturan di atas"
}`;
}

/**
 * @param {DraftInput} input
 * @param {string} apiKey
 * @returns {Promise<string>}
 */
export async function generateListingDraft(input, apiKey) {
  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildListingPrompt(input) }] }],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message ?? `Layanan AI menjawab ${res.status}.`);
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/**
 * Kunci Gemini dibaca dari peubah lingkungan di sisi server dan TIDAK PERNAH
 * dikirim ke peramban. Repositorinya publik, jadi kunci yang pernah masuk ke
 * kode sisi klien sama saja dengan kunci yang dibagikan ke semua orang.
 */
export default async function handler(req, res) {
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
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
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
