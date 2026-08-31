/**
 * Alamat halaman.
 *
 * Sebelumnya seluruh navigasi memakai satu useState<NavTab> di App, sehingga
 * aplikasi tidak punya URL sama sekali: tidak bisa dibagikan, tombol kembali
 * peramban tidak berfungsi, dan muat ulang selalu melempar ke beranda.
 *
 * Untuk peragaan di depan penilai, ini penting: kamu bisa membuka layar mana
 * pun langsung, dan penilai bisa menyusuri sendiri tanpa dipandu.
 */
export const ROUTES = {
  home: '/',
  market: '/pasar',
  artisans: '/pengrajin',
  artisanProfile: (slug: string) => `/pengrajin/${slug}`,
  learn: '/belajar',
  heritage: '/warisan',
  community: '/komunitas',
  portal: '/portal',
  verification: '/verifikasi',
  portalUpload: '/portal/unggah',
  cart: '/keranjang',
  checkout: '/checkout',
  orders: '/pesanan',
} as const;

/** Enam tautan utama. Sisanya dijangkau dari dalam halaman. */
export const PRIMARY_NAV: Array<{ to: string; label: string }> = [
  { to: ROUTES.home, label: 'Beranda' },
  { to: ROUTES.market, label: 'Pasar Nusantara' },
  { to: ROUTES.artisans, label: 'Pengrajin' },
  { to: ROUTES.learn, label: 'Belajar Batik' },
  { to: ROUTES.community, label: 'Komunitas' },
];
