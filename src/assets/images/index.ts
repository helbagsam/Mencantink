/**
 * Gambar lokal.
 *
 * Sebelumnya semua gambar diambil dari URL lh3.googleusercontent.com hasil
 * generate AI Studio. URL semacam itu bisa mati kapan saja tanpa peringatan —
 * satu di antaranya memang sudah mati (HTTP 403) saat berkas ini dibuat.
 * Gambar yang mati saat presentasi berarti kotak kosong di depan juri, jadi
 * semuanya disalin ke dalam repo.
 *
 * Vite mengubah new URL(..., import.meta.url) menjadi jalur ber-hash saat
 * build, sehingga aman dipakai di produksi.
 */

export const IMG = {
  'artisan_avatar': new URL('./artisan_avatar.jpg', import.meta.url).href,
  'canting_workshop_img': new URL('./canting_workshop_img.jpg', import.meta.url).href,
  'parang-rusak': new URL('./parang-rusak.jpg', import.meta.url).href,
  'kawung': new URL('./kawung.jpg', import.meta.url).href,
  'mega-mendung': new URL('./mega-mendung.jpg', import.meta.url).href,
  'sekar-jagad': new URL('./sekar-jagad.jpg', import.meta.url).href,
  'truntum': new URL('./truntum.jpg', import.meta.url).href,
  'event-2': new URL('./event-2.jpg', import.meta.url).href,
  'event-3': new URL('./event-3.jpg', import.meta.url).href,
  'event-4': new URL('./event-4.jpg', import.meta.url).href,
  't1': new URL('./t1.jpg', import.meta.url).href,
  'r1-1': new URL('./r1-1.jpg', import.meta.url).href,
  'cart-1': new URL('./cart-1.jpg', import.meta.url).href,
  'cart-2': new URL('./cart-2.jpg', import.meta.url).href,
  'item-demo-1': new URL('./item-demo-1.jpg', import.meta.url).href,
  'motif-mega-mendung': new URL('./motif-mega-mendung.jpg', import.meta.url).href,
  'motif-kawung': new URL('./motif-kawung.png', import.meta.url).href,
  'motif-truntum': new URL('./motif-truntum.jpg', import.meta.url).href,
  'motif-tiga-negeri': new URL('./motif-tiga-negeri.webp', import.meta.url).href,
} as const;

export type ImgKey = keyof typeof IMG;
