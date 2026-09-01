/**
 * Bantuan menulis keterangan jualan.
 *
 * Dipakai bersama oleh server pengembangan (server.ts) dan fungsi tanpa server
 * di Vercel (api/gemini/generate-description.ts), supaya keduanya tidak pernah
 * berbeda perintah.
 *
 * BATAS YANG DISENGAJA: model TIDAK boleh mengarang filosofi motif, makna
 * simbol, atau asal-usul sejarah. Itu fakta budaya. Kalau model salah dan
 * kelirunya tampil di halaman produk, yang rusak justru kredibilitas yang
 * menjadi seluruh alasan keberadaan platform ini. Model hanya merangkai
 * keterangan yang diberikan pengrajin sendiri menjadi kalimat yang enak dibaca.
 *
 * ====================================================================
 * KENAPA MEMANGGIL REST LANGSUNG, BUKAN MEMAKAI SDK
 * ====================================================================
 * Versi sebelumnya memakai paket @google/genai dan gagal di Vercel dengan
 * FUNCTION_INVOCATION_FAILED. Fungsinya berhasil dibangun lalu jatuh saat
 * dipanggil — yang jatuh adalah pemuatan pustakanya sendiri, sebelum satu baris
 * pun kode kita sempat berjalan, sehingga kegagalannya tidak muncul di catatan
 * build dan sulit dilacak.
 *
 * Panggilan REST dengan fetch bawaan Node menghapus seluruh kelas masalah itu:
 * tidak ada yang perlu dipaket, tidak ada beda ESM dan CommonJS, dan
 * perilakunya sama persis antara komputer sendiri dan Vercel. Untuk satu
 * panggilan sederhana, SDK memang tidak memberi keuntungan apa pun.
 * ====================================================================
 */

const ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export interface DraftInput {
  motifName?: string;
  technique?: string;
  region?: string;
  keywords?: string;
}

export function buildListingPrompt(input: DraftInput): string {
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

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
}

export async function generateListingDraft(
  input: DraftInput,
  apiKey: string,
): Promise<string> {
  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildListingPrompt(input) }] }],
    }),
  });

  const data = (await res.json()) as GeminiResponse;

  if (!res.ok) {
    throw new Error(data.error?.message ?? `Layanan AI menjawab ${res.status}.`);
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}
