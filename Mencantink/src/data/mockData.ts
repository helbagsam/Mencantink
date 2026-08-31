import { BatikMotif, ReviewItem, EditorialArticle, ForumThread, EventItem } from '../types';

export const LOGO_URL = "https://lh3.googleusercontent.com/aida/AP1WRLutrcq0z3FVIMVEYDo6ANzBXQ5z2BZ7KeqluDDtKpZcJLY4t7YdL6ighqd729zemG41tDnHLdstQe1iMV5LZkb6tF8F06XyR9xDEwqx_pkjTaiSeLP4XbE2NATIXbeKt3YPIx8OJiSvtFSmMIEgKpAQRnATCwCqND6ld-x6SxdKq86U8pVy459Vk_UbWI38JsUGcT1l3niPcYH5-tPTD-9wBw82xyByHuN2UPNJ3s6gh3Qb5-f0v5vyb6Y";

export const ARTISAN_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuC6GAZNx-92AGvmb5RF-2fC3Hqsre5AhVt_B88bMjkDziG2cemMFKUQ9wO_B7f2kzSmWx6tu9okfBEQFSPCTLprRLHSxMIga4e-qVt68jedfpkZNbwgdPoAqOVpx7uta6kXK5ttNKaG5VRmd-WQ-_uLnpkS120GloHY9vuSz0M3nSWMx5q6NUUkcALn1UMZrezFJVEQTPNAQXm7d_eTd4bLFc-dZnuNl8V_W2Bri-inNfrJQHBhvji-TA";

export const CANTING_WORKSHOP_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuAnoMuaApEiaZlq8IEsTw2uCxdqGIwYbJMnauYAIFvcEBgwNX2xY0h80ysPh7elfI2u4BvvJUyglU6FkMt6eWWw6uOSq7wd-qq9iGMBjlZlgVXYoJXLynGW3ce_4iHtSFXxHJS_3sj2vnTwDCjRzE9ad2z9mziy0flQg3DjtXrg1MTUKQYwSp1LmpquGjKdEvYOX6UQ5EotNHtLOp0OIVAY2JjJ0vicyKBQWK1w6F9YNXt-hhz-stWO0A";

export const INITIAL_MOTIFS: BatikMotif[] = [
  {
    id: 'parang-rusak',
    name: 'Parang Rusak Barong',
    region: 'Surakarta / Solo',
    technique: 'Tulis',
    motifType: 'Geometris',
    featured: true,
    priceEstimate: 'Rp 950.000 - 1.450.000',
    priceIDR: 1250000,
    artisanName: 'Mpu Harjo & Sanggar Keraton',
    description: 'Secara historis diperuntukkan bagi bangsawan keraton, motif Parang Rusak melambangkan semangat pantang menyerah bak ombak samudera menghantam karang.',
    philosophy: 'Garis miring diagonal berbentuk huruf "S" mewakili perjuangan tanpa putus, ketahanan mental, dan kepemimpinan luhur yang memecah batas kemampuan manusia.',
    originHistory: 'Diciptakan pada era Kesultanan Mataram oleh Sultan Agung Hanyokrokusumo saat bertapa di Pantai Selatan. Dikenakan secara sakral oleh raja dan pangeran keraton.',
    ciriKhas: 'Bentuk garis "S" bersambung tanpa putus dengan aksen pedang gurdo, menggunakan pewarna alami soga kecokelatan yang pekat dan tembus ke dua sisi kain.',
    prosesPembuatan: [
      'Nganji & Ketel: Pencucian kain primissima dengan pati kanji alami agar malam meresap sempurna.',
      'Nglowong: Goresan perintang canting tulis tangan untuk mengunci garis utama pola Parang Barong.',
      'Nerezi & Nerusi: Mencanting ulang di sisi balik kain agar detail tembus presisi.',
      'Medel & Nyolet: Pewarnaan dasar dengan celupan nilon soga keemasan dan nilon biru nira.',
      'Lorot: Pelarutan lilin malam panas dalam tungku air mendidih.'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX_y3oJ3HcJuocq2ScPpXDjTQoPYzshWHAkGhANRXCweUilKICt_MqYtxQyqX19YhPKyz0qk7o5OmCCAHCsmkZ9AvyHTzubCTXCor4TKy3B1iuAr-LVmz1u-BkYY7EZb76gS1vsnGT8cKTV_n-nuQGpKvuCp3yiOnBJSWprA2ke8jQ4xuivuZiUQXb7jwwqTMkitfKUtsbL4c2-uhm4f3P0qUS4WtSOLtGyKXzrHRvP3zpwe_fRO3cFQ',
    tags: ['Warisan Keraton', 'Batik Tulis Halus', 'Pewarna Soga Alami']
  },
  {
    id: 'kawung',
    name: 'Kawung Picis Klasik',
    region: 'Yogyakarta',
    technique: 'Cap',
    motifType: 'Geometris',
    priceEstimate: 'Rp 400.000 - 650.000',
    priceIDR: 450000,
    artisanName: 'Koperasi Mekar Jaya Yogya',
    description: 'Mewakili irisan buah aren atau bunga teratai, motif Kawung melambangkan kesucian, netralitas, dan asal-usul kehidupan manusia dalam filosofi Jawa.',
    philosophy: 'Empat bentuk elips yang terhubung dalam lingkaran mencerminkan empat penjuru mata angin dan hati sebagai pusat kearifan, melambangkan keadilan dan kejujuran.',
    originHistory: 'Salah satu motif tertua di tanah Jawa, terdokumentasi pada ukiran relief candi Jawa Tengah sejak abad ke-13.',
    ciriKhas: 'Komposisi geometris empat lingkaran bersinggungan simetris sempurna, menggunakan kombinasi warna krem, terracotta, dan cokelat tanah.',
    prosesPembuatan: [
      'Pengecapkan Tembaga: Menekan stempel plat tembaga celup malam panas secara simultan.',
      'Pencelupan Soga: Pencelupan berulang dalam ekstrak kayu tinggi & kulit kayu mahoni.',
      'Pelorotan: Penggodokan kain untuk melarutkan sarang malam.'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcjBuoHj5JxcD5cVCnNj7SFVeTQghlfFsZTaHA3w0Kn0HEngK4wmznwQeOngXAGTiVqDRFGOrx6CPgbWf2gGjEq6U_cdm2rDs0kz256FBLbLJKcGJQyqkwCJPHhpOsEyymVBbX8IG3_8wgwM2dxuQ1EMJkcIL1O5C86QTqfE125BNH59CmlKzBVyqmyrSCV0FgdfcC5zZSns5wveTsl5e6AhIn-dQBdR0KmI8LjAm8Cpq7KwJBA0MuoQ',
    tags: ['Geometris Klasik', 'Pewarna Terracotta', 'Batik Cap']
  },
  {
    id: 'mega-mendung',
    name: 'Mega Mendung Pesisir Cirebon',
    region: 'Cirebon',
    technique: 'Tulis',
    motifType: 'Non-Geometris',
    priceEstimate: 'Rp 650.000 - 950.000',
    priceIDR: 750000,
    artisanName: 'Studio Khas Trusmi Cirebon',
    description: 'Terpengaruh oleh akulturasi seni keramik Tionghoa, pola awan berlapis ini melambangkan kesabaran, kepala dingin, serta awan pembawa hujan kesuburan.',
    philosophy: 'Tujuh gradasi warna awan mencerminkan tujuh lapisan langit dalam kosmologi tradisional, mengajarkan manusia untuk tetap tenang di bawah tekanan.',
    originHistory: 'Lahir di Cirebon dari perpaduan budaya Islam Jawa dan pedagang Tionghoa pada era Keraton Kasepuhan dan Sunan Gunung Jati.',
    ciriKhas: 'Bentuk awan lancip bergradasi 5 hingga 7 tingkat warna dari biru tua indigo hingga putih jernih.',
    prosesPembuatan: [
      'Goresan Canting Halus: Menggambar lengkungan awan berulang dengan ketebalan beragam.',
      'Nyolet Gradasi: Kuasan tangan dengan pewarna indigo pekat bertahap dari tua ke muda.',
      'Fiksasi Tawas: Penguncian warna alami dengan tawas agar tahan puluhan tahun.'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJNv-CkG02wb__4R3TBFI9oJtL1Z0L58Bjjcb2evf3t0b2HxIsQNO8rNzplKW4QgoEksVBbWmE8g2epcnC-cQ8LTPwT2tteVv1mLfS9IflvPb7DIAb5h-4gbaWKK9ryLT3K53K-Rpg-UVwfJozUQIx-i_p-vcFZclaxX_pMDNfNbFUiILIE5MH7zW8mbVe4hlX4F-S_xh2M6f7ZnYeLdCZ07l2IwS6LN3R0GDoY6draTPT9HS-wWNxzg',
    tags: ['Batik Pesisir', 'Nila Alami', 'Gradasi 7 Warna']
  },
  {
    id: 'sekar-jagad',
    name: 'Sekar Jagad Kencana',
    region: 'Surakarta / Solo',
    technique: 'Kombinasi',
    motifType: 'Abstract / Floral',
    priceEstimate: 'Rp 1.100.000 - 1.450.000',
    priceIDR: 1350000,
    artisanName: 'Maestro Batik Danar Solo',
    description: 'Sekar Jagad bermakna "Bunga Sejagat" atau peta keindahan alam semesta. Memadukan keunikan ragam ornamen dengan keindahan garis canting dan cap.',
    philosophy: 'Harmoni dari keberagaman motif yang berdampingan anggun dalam satu helai kain, melambangkan kedamaian dan keindahan persatuan.',
    originHistory: 'Dikembangkan oleh maestro pengrajin Surakarta untuk menampilkan penguasaan berbagai teknik batik dalam satu karya seni.',
    ciriKhas: 'Bentuk kumpulan pulau-pulau kecil bercorak ornamen bunga, burung, dan geometris yang menyatu harmonis.',
    prosesPembuatan: [
      'Pembuatan Rangka Cap: Mengatur layout kumpulan fragmen pulau motif.',
      'Isen-Isen Canting Tulis: Pengisian detail mikroskopis cecek dan flora menggunakan canting 0.5mm.',
      'Pewarnaan Ganda: Pencelupan warna soga khas Solo dan perintangan lorot bertahap.'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD--gzP5SqSv7xTUMNQKqnyB8M1UkgoS-H3Uh6G5Wqz4T9ibWpu6KwUQPBSPkBK3aSG3BnLkeZTz_5o7yRzC-FaO8guUDs2egiPESt8qqszv1h3iEvzI-IDxcvSszcL2p_KDGgLz9hDjeirOqjy_v0gEvMgcS1Z_h2tixKzvWFvyjfMQkCEzap9dRJ30BkER9cWhYWrq0qDUEug8_69Gwtgbo0sDkHyG_bZESNJloE1WVsNakpcuoSLfg',
    tags: ['Mahakarya', 'Batik Kombinasi', 'Multimotif']
  },
  {
    id: 'truntum',
    name: 'Truntum Garuda Klasik',
    region: 'Surakarta / Solo',
    technique: 'Tulis',
    motifType: 'Geometris',
    priceEstimate: 'Rp 550.000 - 850.000',
    priceIDR: 600000,
    artisanName: 'Griyo Batik Bu Wahyu',
    description: 'Bermotif kuntum bintang tajam yang melambangkan cinta yang bersemi kembali. Tradisional dipakaikan untuk orang tua pengantin.',
    philosophy: 'Cinta kasih orang tua yang tulus, selalu menuntun dan menerangi jalan kehidupan anak-anaknya bak bintang di malam gelap.',
    originHistory: 'Diciptakan oleh Kanjeng Ratu Kencana (Permaisuri Sunan Pakubuwana IV) sebagai simbol ketulusan cinta yang tumbuh kembali.',
    ciriKhas: 'Bintang-bintang kecil latar gelap dengan aksen garuda miring dan pewarna kayu tengar alami.',
    prosesPembuatan: [
      'Nganji & Nyanting Truntum: Pembuatan titik-titik bintang halus berulang ribuan kali.',
      'Pencelupan Soga Pekat: Perendaman dalam bak soga keraton.',
      'Lorot & Pengeringan Angin: Dikeringkan di bawah naungan pohon tanpa sinar matahari langsung.'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRlXRZERAHCO47gsX5LilXwnTIQ7t5Nm7VQJ7w-0pf6fBeBq6-QRVeeAbMODVw6Ri4e23HrWjWe2-Ko1SOLhcl8820Zn38eA23zDaQYUMWKHOKF00zI5zDJo7EqDWBmNyUuZR6Gfp1yVhsnoHWjEBohakD8XQVb2WdPJXF5T94kslg5Hh60cltQMjoIFYLzo26lZgZp7UxnCqw44MVKPO0WeWr3C1rKGiBAgJI15GZmRt-N7tT2FhwcQ',
    tags: ['Simbol Cinta', 'Tulis Canting', 'Solo Keraton']
  },
  {
    id: 'tiga-negeri',
    name: 'Batik Tiga Negeri Lasem',
    region: 'Lasem & Pekalongan',
    technique: 'Tulis',
    motifType: 'Satwa & Alam',
    priceEstimate: 'Rp 1.200.000 - 1.500.000',
    priceIDR: 1450000,
    artisanName: 'Koleksi Legenda Lasem & Solo',
    description: 'Batik legendaris yang diproses di 3 kota berbeda: Merah darah ayam di Lasem, Biru nira di Pekalongan, dan Cokelat soga di Solo.',
    philosophy: 'Simbol akulturasi 3 kebudayaan (Tionghoa, Jawa pesisir, dan Jawa keraton) yang bersatu dalam kedamaian dan toleransi.',
    originHistory: 'Dibuat sejak abad ke-19 dengan melintasi sungai dan pesisir utara Jawa demi mendapatkan air dan mineral pewarna khas tiap daerah.',
    ciriKhas: 'Tiga warna kontras yang sangat kaya: Merah Bang-bangan, Biru Nila, dan Cokelat Soga dengan motif burung Hong dan tanaman Jawa.',
    prosesPembuatan: [
      'Pewarnaan Tahap 1 (Lasem): Lorot & celup merah akar mengkudu.',
      'Pewarnaan Tahap 2 (Pekalongan): Canting tutup & celup nila biru.',
      'Pewarnaan Tahap 3 (Solo): Canting ulang & celup soga kayu mahoni.'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnoMuaApEiaZlq8IEsTw2uCxdqGIwYbJMnauYAIFvcEBgwNX2xY0h80ysPh7elfI2u4BvvJUyglU6FkMt6eWWw6uOSq7wd-qq9iGMBjlZlgVXYoJXLynGW3ce_4iHtSFXxHJS_3sj2vnTwDCjRzE9ad2z9mziy0flQg3DjtXrg1MTUKQYwSp1LmpquGjKdEvYOX6UQ5EotNHtLOp0OIVAY2JjJ0vicyKBQWK1w6F9YNXt-hhz-stWO0A',
    tags: ['Tiga Negeri', 'Koleksi Langka', 'Akulturasi Budaya']
  }
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'event-1',
    title: 'Festival Batik Nusantara 2026: Mahakarya Keraton & Pesisir',
    category: 'Festival',
    date: '15 - 18 Agustus 2026',
    time: '09.00 - 21.00 WIB',
    location: 'Jakarta Convention Center (JCC), Hall A',
    organizer: 'Komunitas Pengrajin Batik Nusantara',
    description: 'Pameran akbar batik terbesar tahun ini! Menampilkan lebih dari 500 kain mahakarya koleksi langka dari pengrajin master Solo, Yogyakarta, Pekalongan, Cirebon, hingga Lasem.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnoMuaApEiaZlq8IEsTw2uCxdqGIwYbJMnauYAIFvcEBgwNX2xY0h80ysPh7elfI2u4BvvJUyglU6FkMt6eWWw6uOSq7wd-qq9iGMBjlZlgVXYoJXLynGW3ce_4iHtSFXxHJS_3sj2vnTwDCjRzE9ad2z9mziy0flQg3DjtXrg1MTUKQYwSp1LmpquGjKdEvYOX6UQ5EotNHtLOp0OIVAY2JjJ0vicyKBQWK1w6F9YNXt-hhz-stWO0A',
    attendeesCount: 420,
    isRegistered: false
  },
  {
    id: 'event-2',
    title: 'Workshop Intensive: Teknik Canting Tulis & Fermentasi Nila Alami',
    category: 'Workshop',
    date: '24 - 25 Agustus 2026',
    time: '09.30 - 16.00 WIB',
    location: 'Solo Artisan Hub & Studio Canting, Surakarta',
    organizer: 'Sanggar Batik Bu Wahyu & Komunitas Batik',
    description: 'Pelatihan praktik langsung bersama Maestro Batik Solo. Peserta belajar meracik larutan pewarna daun Indigofera tinctoria dan memegang canting dengan benar.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_WzzrF-5vFlVWTSm6Ov5X4bMFarAJSb0hTd21SCtULXZlka28O8KNlwBokGCK8CsRfddSGMrsZT9nDKUPByI6FSfeULtn7i9RhPl8FGT4rrtreZpzkLpoiQ5zmC9384D21J_Gm3NZhvw7MCDkcUd6EzgmGVaF-fhwhIjv3HSCi541H-IPz9RT4VMKjZXX86yeO1zOd2kfdIbIIfRJbDjNvIUi2Bwhw5WFSMMVBkJeB16VNGML_egyyA',
    attendeesCount: 85,
    isRegistered: true
  },
  {
    id: 'event-3',
    title: 'Webinar Nasional: Perlindungan HKI Motif Tradisional & Digitalisasi Pasar',
    category: 'Webinar',
    date: '5 September 2026',
    time: '13.30 - 16.00 WIB',
    location: 'Online via Zoom & YouTube Live',
    organizer: 'Tim Legal & Digital Komunitas Pengrajin Batik',
    description: 'Diskusi interaktif bersama pakar hukum Hak Kekayaan Intelektual (HKI) dan konsultan e-commerce tentang cara mendaftarkan hak cipta motif batik serta pemasaran global.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB-3vFXpqhGwtNV3YchBc1NpJZByc7PEnkF0ZK_NmhCg_yT3CofTfAVuzwLHixM78lKjjYvd4X7Se5J1d09ahLw9MAZktYg93MD0Yb0lt-S3Uw0LW3shcu7CCaTV2Spc-5HK_pkmBVeDyPSduhgvLAVIjhsJ5KeRb1_aazj6qG5a5XyyhqLdRHwdGvYplqE5Ds8IMQAHnvS-mEFJlPaWBUxt0SeenWoPHeboq1se1yuDasaQRSjXQZDw',
    attendeesCount: 310,
    isRegistered: false
  },
  {
    id: 'event-4',
    title: 'Lomba Desain Motif Batik Pesisir Kontemporer 2026',
    category: 'Lomba',
    date: '1 - 30 September 2026',
    time: 'Batas Pengiriman 30 Sep 2026',
    location: 'Pekalongan Heritage Center & Online',
    organizer: 'Komunitas Pengrajin Batik Nusantara',
    description: 'Kompetisi kreasi motif baru bagi pengrajin muda dan desainer tekstil. Total hadiah Rp 50.000.000 beserta sertifikat lisensi nasional.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-ayvcFI_l8V7UeLJVoAJ5MeH_cj4ai64MqsMrG1JLmMNFQbDREJiON0xVvVlJGoX27_1kWU832YrlV2exS-CfFnQ7lyfqFdcjR-8GVaer2GWxU_dkfa10XMTu0SOmoEvNZywtwIHsNNuQQVQr4n4AlWx6q8iDBtAUNcSgBaFYQo72lKWYkAB5TF6Z7xjybNx0iPfeR2k1q2NgOxspRGZfHVxHnT5uJBz2z3IiwRjwk4rK04bovr46_A',
    attendeesCount: 195,
    isRegistered: false
  }
];

export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 'r1',
    itemName: 'Canting Tembaga Asli Solo',
    rating: 5.0,
    reviewText: '"Aliran malam sangat lancar dan konstan, menahan panas dengan stabil untuk proses mencanting tulisan halus."',
    reviewerName: 'Pak Budi S.',
    reviewerRole: 'Pengrajin Cirebon'
  },
  {
    id: 'r2',
    itemName: 'Pasta Pewarna Nila Indigofera',
    rating: 4.8,
    reviewText: '"Warna biru yang dihasilkan sangat pekat dan alami. Ramah lingkungan dan disukai pembeli ekspor."',
    reviewerName: 'Ibu Ayu M.',
    reviewerRole: 'Pengrajin Pekalongan'
  }
];

export const MOCK_ARTICLES: EditorialArticle[] = [
  {
    id: 'a1',
    category: 'TEKNIK PEWARNAAN',
    title: 'Panduan Praktis Fermentasi Nila Alami Indigofera untuk Warna Biru Pekat',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB-3vFXpqhGwtNV3YchBc1NpJZByc7PEnkF0ZK_NmhCg_yT3CofTfAVuzwLHixM78lKjjYvd4X7Se5J1d09ahLw9MAZktYg93MD0Yb0lt-S3Uw0LW3shcu7CCaTV2Spc-5HK_pkmBVeDyPSduhgvLAVIjhsJ5KeRb1_aazj6qG5a5XyyhqLdRHwdGvYplqE5Ds8IMQAHnvS-mEFJlPaWBUxt0SeenWoPHeboq1se1yuDasaQRSjXQZDw',
    readTime: '6 menit baca',
    summary: 'Proses fermentasi alami tanpa bahan kimia sintetis untuk menghasilkan warna biru indigo yang tahan lama.'
  },
  {
    id: 'a2',
    category: 'FILOSOFI SEJARAH',
    title: 'Evolusi Motif Kawung: Dari Keraton Abad ke-13 Hingga Era Busana Modern',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-ayvcFI_l8V7UeLJVoAJ5MeH_cj4ai64MqsMrG1JLmMNFQbDREJiON0xVvVlJGoX27_1kWU832YrlV2exS-CfFnQ7lyfqFdcjR-8GVaer2GWxU_dkfa10XMTu0SOmoEvNZywtwIHsNNuQQVQr4n4AlWx6q8iDBtAUNcSgBaFYQo72lKWYkAB5TF6Z7xjybNx0iPfeR2k1q2NgOxspRGZfHVxHnT5uJBz2z3IiwRjwk4rK04bovr46_A',
    readTime: '8 menit baca',
    summary: 'Menelusuri perjalanan 800 tahun filosofi geometris empat arah angin yang melambangkan keadilan dan kesucian.'
  }
];

export const MOCK_FORUM_THREADS: ForumThread[] = [
  {
    id: 't1',
    authorName: 'Budi Santoso',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO51DnmqemYNYQmx9pzMzzsCGw2i6vWCIRK_J7JusGE-Rx_nszm2yK2O7cMRpCaEgSeMRPmGr0krEEF3c5ZhmkKpUwsgyZTyq1rod_0PsKurCkkKhLphAs6NR7QD1lmyoUCKzSh9EgK8C89vXiKPqbupsj98Y0xhXXR2Qs9hgcd7n9GYclM09nzg4qBN4jBLyYjnoJGU0GiV8VMHdaQAYiTq6-gbBPjNc5Kol_nod30GUCrUNoQ2uucw',
    timeAgo: '2 jam lalu',
    category: 'Teknik Pewarnaan Alami',
    title: 'Resep racikan fermentasi Indigofera agar hasil warna tidak mudah luntur',
    content: "Halo rekan-rekan pengrajin! Saya mengalami sedikit kendala intensitas warna indigo setelah pencucian akhir. Apakah ada racikan gula jawa atau kapur sirih tertentu yang paling efektif mengunci warna?",
    repliesCount: 14,
    viewsCount: 256,
    replies: [
      {
        id: 'r1-1',
        authorName: 'Siti Rahma',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCji4KidvXNRZI4BbxqH5nAbxeVR-yCXSp2X2pY5klwGOZcJcL1tUGMOFqzA_tLYSok5gbyQ_uZ6iDAUNCftfSjPQSxYlTo1fGhHHJWA8MSbDcapDAW2sEg-AurPHfvmYbSKzLZiI2wD_fc1imiBVzCvfu_ykCOXyJj-r1ZgNBQCmdz_G9ydH91F7uKkjKDbnTh3Xh6DNNvNYFl6Hc2fijFdBcxR3g3ZjHhuiLiL9gVbllzBBCwBG10GQ',
        timeAgo: '1 jam lalu',
        content: 'Ibu bisa menambahkan sedikit tetes tebu atau sirup gula kelapa saat aktivasi tong warna, lalu lakukan proses fiksasi dengan larutan tawas secara lembut!'
      }
    ]
  },
  {
    id: 't2',
    authorName: 'Siti Rahma',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCji4KidvXNRZI4BbxqH5nAbxeVR-yCXSp2X2pY5klwGOZcJcL1tUGMOFqzA_tLYSok5gbyQ_uZ6iDAUNCftfSjPQSxYlTo1fGhHHJWA8MSbDcapDAW2sEg-AurPHfvmYbSKzLZiI2wD_fc1imiBVzCvfu_ykCOXyJj-r1ZgNBQCmdz_G9ydH91F7uKkjKDbnTh3Xh6DNNvNYFl6Hc2fijFdBcxR3g3ZjHhuiLiL9gVbllzBBCwBG10GQ',
    timeAgo: '5 jam lalu',
    category: 'Filosofi Motif',
    title: 'Pengembangan filosofi motif Truntum untuk busana kerja profesional',
    content: "Motif Truntum bermakna cinta yang tumbuh kembali. Saya sedang mencoba menggabungkan ornamen Truntum pada pola busana kerja tanpa mengurangi kesakralan filosofi aslinya.",
    repliesCount: 32,
    viewsCount: 890
  },
  {
    id: 't3',
    authorName: 'Suryo Handoko',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6GAZNx-92AGvmb5RF-2fC3Hqsre5AhVt_B88bMjkDziG2cemMFKUQ9wO_B7f2kzSmWx6tu9okfBEQFSPCTLprRLHSxMIga4e-qVt68jedfpkZNbwgdPoAqOVpx7uta6kXK5ttNKaG5VRmd-WQ-_uLnpkS120GloHY9vuSz0M3nSWMx5q6NUUkcALn1UMZrezFJVEQTPNAQXm7d_eTd4bLFc-dZnuNl8V_W2Bri-inNfrJQHBhvji-TA',
    timeAgo: '1 hari lalu',
    category: 'Tips Sertifikasi',
    title: 'Panduan persiapan portofolio untuk audit Sertifikasi Pengrajin Master Level III',
    content: "Bagi rekan-rekan yang akan mengajukan uji kompetensi sertifikasi maestro tahun ini, perhatikan kerapian garis 'ngrentex' dan ketepatan tembusan malam pada kedua sisi kain.",
    repliesCount: 19,
    viewsCount: 410
  }
];
