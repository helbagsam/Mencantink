import { BatikMotif, ReviewItem, EditorialArticle, ForumThread, EventItem } from '../types';
import { IMG } from '../assets/images';

export const ARTISAN_AVATAR = IMG['artisan_avatar'];

export const CANTING_WORKSHOP_IMG = IMG['canting_workshop_img'];

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
    imageUrl: IMG['parang-rusak'],
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
    imageUrl: IMG['motif-kawung'],
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
    imageUrl: IMG['motif-mega-mendung'],
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
    imageUrl: IMG['sekar-jagad'],
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
    imageUrl: IMG['motif-truntum'],
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
    imageUrl: IMG['motif-tiga-negeri'],
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
    imageUrl: IMG['canting_workshop_img'],
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
    imageUrl: IMG['event-2'],
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
    imageUrl: IMG['event-3'],
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
    imageUrl: IMG['event-4'],
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
    imageUrl: IMG['event-3'],
    readTime: '6 menit baca',
    summary: 'Proses fermentasi alami tanpa bahan kimia sintetis untuk menghasilkan warna biru indigo yang tahan lama.'
  },
  {
    id: 'a2',
    category: 'FILOSOFI SEJARAH',
    title: 'Evolusi Motif Kawung: Dari Keraton Abad ke-13 Hingga Era Busana Modern',
    imageUrl: IMG['event-4'],
    readTime: '8 menit baca',
    summary: 'Menelusuri perjalanan 800 tahun filosofi geometris empat arah angin yang melambangkan keadilan dan kesucian.'
  }
];

export const MOCK_FORUM_THREADS: ForumThread[] = [
  {
    id: 't1',
    authorName: 'Budi Santoso',
    authorAvatar: IMG['t1'],
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
        authorAvatar: IMG['r1-1'],
        timeAgo: '1 jam lalu',
        content: 'Ibu bisa menambahkan sedikit tetes tebu atau sirup gula kelapa saat aktivasi tong warna, lalu lakukan proses fiksasi dengan larutan tawas secara lembut!'
      }
    ]
  },
  {
    id: 't2',
    authorName: 'Siti Rahma',
    authorAvatar: IMG['r1-1'],
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
    authorAvatar: IMG['artisan_avatar'],
    timeAgo: '1 hari lalu',
    category: 'Tips Sertifikasi',
    title: 'Panduan persiapan portofolio untuk audit Sertifikasi Pengrajin Master Level III',
    content: "Bagi rekan-rekan yang akan mengajukan uji kompetensi sertifikasi maestro tahun ini, perhatikan kerapian garis 'ngrentex' dan ketepatan tembusan malam pada kedua sisi kain.",
    repliesCount: 19,
    viewsCount: 410
  }
];
