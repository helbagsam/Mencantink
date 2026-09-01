import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { generateListingDraft } from './lib/gemini';

dotenv.config();

/**
 * Server untuk pengembangan di komputer sendiri.
 *
 * Di Vercel berkas ini tidak dipakai: di sana keluaran Vite disajikan sebagai
 * berkas statis dan jalur /api ditangani fungsi tanpa server di folder api/.
 * Keduanya memanggil lib/gemini.ts yang sama, supaya perintah ke model tidak
 * pernah berbeda antara pengembangan dan produksi.
 */
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  app.post('/api/gemini/generate-description', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY belum disetel di berkas .env.',
      });
    }

    try {
      const { motifName, technique, region, keywords } = req.body ?? {};
      const text = await generateListingDraft({ motifName, technique, region, keywords }, apiKey);
      res.json({ result: text });
    } catch (err) {
      const pesan = err instanceof Error ? err.message : 'Gagal menghubungi layanan AI.';
      console.error('Gemini API Error:', pesan);
      res.status(500).json({ error: pesan });
    }
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'Ruang Canting' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Semua alamat lain dikembalikan ke index.html supaya routing di sisi
    // peramban tetap bekerja saat halaman dimuat ulang atau dibuka langsung.
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ruang Canting berjalan di http://localhost:${PORT}`);
  });
}

startServer();
