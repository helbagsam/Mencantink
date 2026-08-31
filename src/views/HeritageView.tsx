import React, { useState } from 'react';
import { NavTab } from '../types';
import { MOCK_ARTICLES } from '../data/mockData';
import { 
  BookOpen, 
  Sparkles, 
  Feather, 
  Flame, 
  Layers, 
  ArrowRight, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Search,
  Compass
} from 'lucide-react';

interface HeritageViewProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const HeritageView: React.FC<HeritageViewProps> = ({ onNavigateTab }) => {
  const [activeTechniqueTab, setActiveTechniqueTab] = useState<'all' | 'tulis' | 'cap' | 'kombinasi'>('all');

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-16">
      {/* 1. HERO HEADER */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-[#a14000] uppercase tracking-widest block">
          Warisan Budaya Takbenda UNESCO
        </span>
        <h1 className="font-serif-garamond text-4xl sm:text-5xl font-bold text-[#000666] leading-tight">
          Pusat Edukasi & Filosofi Batik Nusantara
        </h1>
        <p className="text-sm sm:text-base text-[#454652] leading-relaxed">
          Batik bukan sekadar kain bermotif; batik adalah manuskrip kehidupan yang digoreskan dengan cairan malam panas, pewarna alami tanah dan tumbuhan, serta filosofi luhur bangsa Indonesia.
        </p>
      </section>

      {/* 2. TEKNIK PEMBUATAN BATIK (TULIS, CAP, KOMBINASI) */}
      <section className="bg-white rounded-2xl border border-[#000666]/15 p-8 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#767683]/15 pb-6">
          <div>
            <span className="text-xs font-bold text-[#a14000] uppercase tracking-widest block">
              Prosedur & Pembuatan
            </span>
            <h2 className="font-serif-garamond text-3xl font-bold text-[#000666]">
              3 Jenis Teknik Pembuatan Batik Autentik
            </h2>
          </div>
          <div className="flex bg-[#efeeea] p-1 rounded-full text-xs font-bold">
            <button
              onClick={() => setActiveTechniqueTab('all')}
              className={`px-4 py-1.5 rounded-full uppercase tracking-wider transition-colors ${
                activeTechniqueTab === 'all' ? 'bg-[#000666] text-white' : 'text-[#454652] hover:text-[#000666]'
              }`}
            >
              Semua Teknik
            </button>
            <button
              onClick={() => setActiveTechniqueTab('tulis')}
              className={`px-4 py-1.5 rounded-full uppercase tracking-wider transition-colors ${
                activeTechniqueTab === 'tulis' ? 'bg-[#000666] text-white' : 'text-[#454652] hover:text-[#000666]'
              }`}
            >
              Tulis
            </button>
            <button
              onClick={() => setActiveTechniqueTab('cap')}
              className={`px-4 py-1.5 rounded-full uppercase tracking-wider transition-colors ${
                activeTechniqueTab === 'cap' ? 'bg-[#000666] text-white' : 'text-[#454652] hover:text-[#000666]'
              }`}
            >
              Cap
            </button>
            <button
              onClick={() => setActiveTechniqueTab('kombinasi')}
              className={`px-4 py-1.5 rounded-full uppercase tracking-wider transition-colors ${
                activeTechniqueTab === 'kombinasi' ? 'bg-[#000666] text-white' : 'text-[#454652] hover:text-[#000666]'
              }`}
            >
              Kombinasi
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* BATIK TULIS */}
          {(activeTechniqueTab === 'all' || activeTechniqueTab === 'tulis') && (
            <div className="bg-[#fbf9f5] border border-[#000666]/10 rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#000666] text-white rounded-lg">
                  <Feather className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#a14000] uppercase tracking-wider">Metode Tangan 100%</span>
                  <h3 className="font-serif-garamond text-xl font-bold text-[#000666]">Batik Tulis</h3>
                </div>
              </div>
              <p className="text-xs text-[#454652] leading-relaxed">
                Digoreskan garis demi garis menggunakan corong canting bambu berisi cairan malam (lilin panas). Dikerjakan dengan proses pencantingan dua sisi kain (<i>nganji</i> dan <i>nerusi</i>).
              </p>
              <div className="space-y-2 text-xs font-medium text-[#1b1c1a] pt-2 border-t border-[#767683]/15">
                <p className="flex items-center gap-2">✓ Durasi pengerjaan: 3 hingga 12 bulan</p>
                <p className="flex items-center gap-2">✓ Setiap helai kain unik dan tiada duanya</p>
                <p className="flex items-center gap-2">✓ Memiliki kualitas investasi koleksi mahakarya</p>
              </div>
            </div>
          )}

          {/* BATIK CAP */}
          {(activeTechniqueTab === 'all' || activeTechniqueTab === 'cap') && (
            <div className="bg-[#fbf9f5] border border-[#a14000]/20 rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#a14000] text-white rounded-lg">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#000666] uppercase tracking-wider">Stempel Tembaga</span>
                  <h3 className="font-serif-garamond text-xl font-bold text-[#000666]">Batik Cap</h3>
                </div>
              </div>
              <p className="text-xs text-[#454652] leading-relaxed">
                Dibuat dengan menekan stempel plat tembaga buatan tangan yang dicelupkan ke cairan malam panas di atas kain. Menghasilkan pola geometris presisi tinggi dan rapi.
              </p>
              <div className="space-y-2 text-xs font-medium text-[#1b1c1a] pt-2 border-t border-[#767683]/15">
                <p className="flex items-center gap-2">✓ Durasi pengerjaan: 1 hingga 3 minggu</p>
                <p className="flex items-center gap-2">✓ Tetap menggunakan perintang malam asli</p>
                <p className="flex items-center gap-2">✓ Sangat ideal untuk busana seragam & harian</p>
              </div>
            </div>
          )}

          {/* BATIK KOMBINASI */}
          {(activeTechniqueTab === 'all' || activeTechniqueTab === 'kombinasi') && (
            <div className="bg-[#fbf9f5] border border-[#735c00]/20 rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#735c00] text-white rounded-lg">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#735c00] uppercase tracking-wider">Cap & Canting</span>
                  <h3 className="font-serif-garamond text-xl font-bold text-[#000666]">Batik Kombinasi</h3>
                </div>
              </div>
              <p className="text-xs text-[#454652] leading-relaxed">
                Memadukan rangka pola cap yang rapi dengan ornamen isen-isen halus yang digoreskan manual menggunakan canting tulis tangan.
              </p>
              <div className="space-y-2 text-xs font-medium text-[#1b1c1a] pt-2 border-t border-[#767683]/15">
                <p className="flex items-center gap-2">✓ Durasi pengerjaan: 1 hingga 2 bulan</p>
                <p className="flex items-center gap-2">✓ Keanggunan struktur cap + kehalusan tulis</p>
                <p className="flex items-center gap-2">✓ Tampilan eksklusif dengan harga terjangkau</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. KATEGORI & RAGAM BATIK NUSANTARA (PEDALAMAN, PESISIR, KONTEMPORER) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#a14000] uppercase tracking-widest block">
            Pengelompokan Wilayah & Gaya Motif
          </span>
          <h2 className="font-serif-garamond text-3xl font-bold text-[#000666]">
            Klasifikasi Ragam Batik Nusantara
          </h2>
          <p className="text-xs text-[#454652]">
            Setiap wilayah memiliki kekhasan warna, garis, serta filosofi yang dipengaruhi lingkungan geografis dan nilai kebudayaan lokal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* BATIK PEDALAMAN / KERATON */}
          <div className="bg-white rounded-2xl border border-[#000666]/15 p-7 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-[#000666]/10 text-[#000666] rounded-full text-[10px] font-bold uppercase tracking-wider">
                Gagrak Keraton Solo & Yogya
              </span>
              <h3 className="font-serif-garamond text-2xl font-bold text-[#000666]">
                Batik Pedalaman
              </h3>
              <p className="text-xs text-[#454652] leading-relaxed">
                Tumbuh dan berkembang di lingkungan keraton Jawa. Warna didominasi warna tanah Soga (cokelat keemasan), Nila (biru tua), dan Krem.
              </p>

              <div className="pt-2 space-y-2">
                <p className="text-xs font-bold text-[#a14000]">Motif Utama:</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-[#efeeea] text-[#1b1c1a] text-[11px] px-2.5 py-1 rounded-md font-medium">Parang Rusak</span>
                  <span className="bg-[#efeeea] text-[#1b1c1a] text-[11px] px-2.5 py-1 rounded-md font-medium">Kawung</span>
                  <span className="bg-[#efeeea] text-[#1b1c1a] text-[11px] px-2.5 py-1 rounded-md font-medium">Sido Mukti</span>
                  <span className="bg-[#efeeea] text-[#1b1c1a] text-[11px] px-2.5 py-1 rounded-md font-medium">Truntum</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-bold text-[#a14000]">Filosofi:</p>
                <p className="text-xs text-[#454652]">
                  Sikap kepemimpinan, keluhuran budi, tata krama, serta doa spiritual keselamatan hidup.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('catalog')}
              className="w-full text-center py-2 bg-[#000666] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#1a237e] transition-colors"
            >
              Lihat Motif Pedalaman
            </button>
          </div>

          {/* BATIK PESISIR */}
          <div className="bg-white rounded-2xl border border-[#a14000]/20 p-7 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-[#a14000]/10 text-[#a14000] rounded-full text-[10px] font-bold uppercase tracking-wider">
                Pekalongan, Cirebon, Lasem, Madura
              </span>
              <h3 className="font-serif-garamond text-2xl font-bold text-[#000666]">
                Batik Pesisir
              </h3>
              <p className="text-xs text-[#454652] leading-relaxed">
                Lahir di wilayah pesisir utara Jawa dengan akulturasi budaya Tionghoa, Belanda, dan Arab. Kaya akan warna-warni cerah dan tegas.
              </p>

              <div className="pt-2 space-y-2">
                <p className="text-xs font-bold text-[#a14000]">Motif Utama:</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-[#efeeea] text-[#1b1c1a] text-[11px] px-2.5 py-1 rounded-md font-medium">Megamendung</span>
                  <span className="bg-[#efeeea] text-[#1b1c1a] text-[11px] px-2.5 py-1 rounded-md font-medium">Sekar Jagad</span>
                  <span className="bg-[#efeeea] text-[#1b1c1a] text-[11px] px-2.5 py-1 rounded-md font-medium">Lokcan</span>
                  <span className="bg-[#efeeea] text-[#1b1c1a] text-[11px] px-2.5 py-1 rounded-md font-medium">Tiga Negeri</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-bold text-[#a14000]">Filosofi:</p>
                <p className="text-xs text-[#454652]">
                  Kebebasan ekspresi, keterbukaan budaya, keharharmonisan pesisir, dan semangat keterbukaan.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('catalog')}
              className="w-full text-center py-2 bg-[#a14000] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#7b2f00] transition-colors"
            >
              Lihat Motif Pesisir
            </button>
          </div>

          {/* BATIK KONTEMPORER & KREASI BARU */}
          <div className="bg-white rounded-2xl border border-[#735c00]/20 p-7 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-[#735c00]/10 text-[#735c00] rounded-full text-[10px] font-bold uppercase tracking-wider">
                Pengembangan Modern Nusantara
              </span>
              <h3 className="font-serif-garamond text-2xl font-bold text-[#000666]">
                Batik Kontemporer
              </h3>
              <p className="text-xs text-[#454652] leading-relaxed">
                Inovasi motif bebas tanpa meninggalkan aturan dasar perintang malam. Mencakup pengembangan Batik Papua, Batik Bali, dan Batik Kalimantan.
              </p>

              <div className="pt-2 space-y-2">
                <p className="text-xs font-bold text-[#a14000]">Motif Utama:</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-[#efeeea] text-[#1b1c1a] text-[11px] px-2.5 py-1 rounded-md font-medium">Cenderawasih Papua</span>
                  <span className="bg-[#efeeea] text-[#1b1c1a] text-[11px] px-2.5 py-1 rounded-md font-medium">Abstrak Modern</span>
                  <span className="bg-[#efeeea] text-[#1b1c1a] text-[11px] px-2.5 py-1 rounded-md font-medium">Flora Kalimantan</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-bold text-[#a14000]">Filosofi:</p>
                <p className="text-xs text-[#454652]">
                  Kreativitas generasi muda, identitas lokal daerah, dan fleksibilitas busana era digital.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('catalog')}
              className="w-full text-center py-2 bg-[#735c00] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#4e3d00] transition-colors"
            >
              Lihat Motif Kontemporer
            </button>
          </div>
        </div>
      </section>

      {/* 4. EDUKASI: CARA MEMBEDAKAN BATIK ASLI VS KAIN PRINT */}
      <section className="bg-[#000666] text-white rounded-2xl p-8 sm:p-10 shadow-lg space-y-6 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#ffe088] text-[#000666] rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#ffe088] uppercase tracking-widest block">
              Panduan Penting Konsumen
            </span>
            <h2 className="font-serif-garamond text-2xl sm:text-3xl font-bold text-white">
              Cara Membedakan Batik Asli dengan Kain Print (Cetak Pabrik)
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#bdc2ff] leading-relaxed max-w-3xl">
          Batik adalah proses perintangan warna menggunakan malam panas. Kain bermotif batik hasil cetak mesin pabrik (print) tidak tergolong batik autentik menurut standar UNESCO dan Kementerian Perindustrian.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-white/10 border border-white/20 rounded-xl p-5 space-y-2">
            <h4 className="text-xs font-bold text-[#ffe088] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 1. Tembusan Sisi Kain
            </h4>
            <p className="text-xs text-[#bdc2ff] leading-relaxed">
              <b>Batik Asli:</b> Warna dan motif tembus terang hingga ke bagian belakang kain karena lilin dan celupan pewarna meresap sempurna.<br/>
              <b>Kain Print:</b> Bagian belakang kain tampak pudar atau berwarna putih pucat.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-xl p-5 space-y-2">
            <h4 className="text-xs font-bold text-[#ffe088] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 2. Aroma Khas Malam
            </h4>
            <p className="text-xs text-[#bdc2ff] leading-relaxed">
              <b>Batik Asli:</b> Menyimpan aroma wangi alami lilin malam dan bahan pewarna herbal/soga.<br/>
              <b>Kain Print:</b> Beraroma tinta kimia atau bahan tekstil pabrikan.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-xl p-5 space-y-2">
            <h4 className="text-xs font-bold text-[#ffe088] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 3. Keunikan Garis
            </h4>
            <p className="text-xs text-[#bdc2ff] leading-relaxed">
              <b>Batik Asli:</b> Memiliki retakan lilin alami (cecek) dan variasi mikroskopis garis canting yang manis.<br/>
              <b>Kain Print:</b> Pola sangat simetris kaku tanpa ada variasi buatan tangan.
            </p>
          </div>
        </div>
      </section>

      {/* 5. ARTIKEL ESSAY WARISAN */}
      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-[#767683]/15 pb-4">
          <div>
            <span className="text-xs font-bold text-[#a14000] uppercase tracking-widest block">
              Publikasi & Artikel
            </span>
            <h2 className="font-serif-garamond text-3xl font-bold text-[#000666]">
              Artikel & Essay Sejarah Batik
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('catalog')}
            className="text-xs font-bold text-[#a14000] uppercase tracking-wider hover:underline"
          >
            Jelajahi Katalog Motif →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_ARTICLES.map((article) => (
            <article
              key={article.id}
              className="bg-white border border-[#767683]/15 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row group cursor-pointer"
              onClick={() => onNavigateTab('catalog')}
            >
              <div className="w-full md:w-1/2 h-48 md:h-auto overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#a14000] uppercase tracking-widest block">
                    {article.category} • {article.readTime}
                  </span>
                  <h3 className="font-serif-garamond text-lg font-bold text-[#000666] leading-snug group-hover:text-[#a14000] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#454652] leading-relaxed">
                    {article.summary}
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-[#000666] flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-2">
                  Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
