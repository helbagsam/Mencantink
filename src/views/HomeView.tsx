import React, { useEffect, useState } from 'react';
import { NavTab, EventItem } from '../types';
import { MOCK_EVENTS, CANTING_WORKSHOP_IMG, INITIAL_MOTIFS } from '../data/mockData';
import { getArtisans, getProofPacks } from '../services/trustService';
import { 
  Sparkles, 
  BookOpen, 
  Users, 
  Award, 
  Feather, 
  Flame, 
  Layers, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  ShoppingBag,
  Target,
  Compass,
  Heart,
  ChevronRight
} from 'lucide-react';

interface HomeViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onSelectEvent?: (event: EventItem) => void;
}

interface HomeStats {
  artisans: number;
  certified: number;
  verifiedProducts: number;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigateTab, onSelectEvent }) => {
  /* Statistik beranda dihitung dari data sungguhan, bukan ditulis mati.
     Kalau nanti ada seratus pengrajin, angkanya ikut naik sendiri — dan yang
     lebih penting, angkanya tidak akan pernah mengklaim lebih dari yang ada. */
  const [stats, setStats] = useState<HomeStats>({
    artisans: 0,
    certified: 0,
    verifiedProducts: 0,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([getArtisans(), getProofPacks()]).then(([artisans, packs]) => {
      if (cancelled) return;
      setStats({
        artisans: artisans.length,
        certified: artisans.filter((a) => a.certificates.length > 0).length,
        verifiedProducts: packs.filter((p) => p.status === 'verified').length,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full bg-white text-slate-800 min-h-screen pt-28 pb-20">
      {/* 1. HERO BANNER - ELEGANT CLEAN LIGHT CONTAINER WITH TRANSLUCENT OVERLAY */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50/70 via-white to-slate-50 border border-amber-200/70 p-8 md:p-14 shadow-lg">
          {/* Subtle Translucent Background Photo */}
          <div className="absolute inset-0 z-0">
            <img
              src={INITIAL_MOTIFS[0].imageUrl}
              alt="Motif Batik Nusantara Header"
              className="w-full h-full object-cover opacity-10 filter brightness-110 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-amber-50/80" />
            <div className="absolute inset-0 batik-pattern-overlay opacity-30" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 bg-[#a14000]/10 border border-[#a14000]/30 px-4 py-2 rounded-full text-[11px] font-bold text-[#a14000] uppercase tracking-widest shadow-sm">
                <Sparkles className="w-4 h-4 text-[#a14000]" />
                Wadah Resmi Pengrajin & Pelestari Batik Indonesia
              </div>

              <h1 className="font-serif-garamond text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.18] tracking-tight text-[#000666]">
                KOMUNITAS PENGRAJIN <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a14000] via-[#c85a17] to-[#d97706]">
                  BATIK NUSANTARA
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-light tracking-wide">
                Batik tulis kalah bersaing bukan karena mutunya, melainkan karena tidak punya cara membuktikan dirinya. Kami membuat bukti itu murah, sehingga pengrajin bisa menjual atas namanya sendiri.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
                <button
                  onClick={() => onNavigateTab('marketplace')}
                  className="bg-gradient-to-r from-[#c85a17] to-[#a14000] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-md hover:shadow-lg flex items-center gap-2.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Jelajahi Pasar Nusantara
                </button>

                <button
                  onClick={() => onNavigateTab('education')}
                  className="bg-white text-[#000666] hover:bg-slate-50 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2.5 border border-slate-300 shadow-sm"
                >
                  <BookOpen className="w-4 h-4 text-[#a14000]" />
                  Edukasi Batik Nusantara
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-amber-200/80 shadow-xl group bg-white p-2">
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={CANTING_WORKSHOP_IMG}
                    alt="Pengrajin Batik Tulis Nusantara"
                    className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000666]/90 via-[#000666]/30 to-transparent flex flex-col justify-end p-6">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-300" />
                      Dedikasi & Presisi Handal
                    </span>
                    <p className="font-serif-garamond text-xl font-bold text-white leading-snug">
                      "Satu goresan canting membawa doa, sejarah, dan martabat kebudayaan bangsa."
                    </p>
                    <p className="text-xs text-slate-200 mt-2 font-light">
                      — Maestro Batik Tulis Nusantara
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTIK KOMUNITAS - CLEAN WHITE CARDS */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        {/* Angka di sini dihitung dari data yang benar-benar ada di aplikasi.
            Versi sebelumnya menuliskan "12.500+ pengrajin tersertifikasi",
            "450+ motif", dan "100% perintang malam asli, bebas tekstil print"
            — padahal isinya enam pengrajin dan enam motif. Yang terakhir bahkan
            berupa jaminan keaslian, persis klaim yang dilarang UU Perlindungan
            Konsumen No. 8 Tahun 1999 dan bertentangan dengan keterangan di
            halaman produk sendiri. Angka nasional dipisahkan dan disebut
            sumbernya, supaya tidak tertukar dengan capaian platform. */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-8 text-center border border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="space-y-2 pt-4 md:pt-0">
            <p className="font-serif-garamond text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#000666] tracking-tight">
              {stats.artisans}
            </p>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Pengrajin Terdaftar</p>
            <p className="text-[11px] text-slate-500 leading-normal">
              {stats.certified} bersertifikat resmi negara
            </p>
          </div>

          <div className="space-y-2 pt-4 md:pt-0">
            <p className="font-serif-garamond text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#a14000] tracking-tight">
              {stats.verifiedProducts}
            </p>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Kain Berbukti Proses</p>
            <p className="text-[11px] text-slate-500 leading-normal">Sudah ditinjau verifikator bernama</p>
          </div>

          <div className="space-y-2 pt-4 md:pt-0">
            <p className="font-serif-garamond text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0284c7] tracking-tight">2</p>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Sertifikasi Negara</p>
            <p className="text-[11px] text-slate-500 leading-normal">
              Kompetensi BNSP &amp; Batikmark Kemenperin
            </p>
          </div>

          <div className="space-y-2 pt-4 md:pt-0">
            <p className="font-serif-garamond text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#059669] tracking-tight">
              ~6.000
            </p>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Unit Usaha Batik Nasional</p>
            <p className="text-[11px] text-slate-500 leading-normal">
              Di 11 provinsi — data Kemenperin, 2025
            </p>
          </div>
        </div>
      </section>

      {/* 3. VISI & MISI KOMUNITAS */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-[#a14000] uppercase tracking-widest block">
            Arah & Landasan Organisasi
          </span>
          <h2 className="font-serif-garamond text-3xl md:text-5xl font-bold text-[#000666] tracking-tight">
            Visi & Misi Komunitas Pengrajin Batik Nusantara
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-light">
            Menjadi wadah berdaya yang menaungi keberlanjutan para pembuat kain batik autentik, menjaga kesakralan warisan budaya UNESCO, serta meningkatkan taraf hidup pengrajin di seluruh penjuru tanah air.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Card VISI */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#000666] to-[#0f172a] text-white rounded-3xl p-8 md:p-10 flex flex-col justify-between border border-slate-700 shadow-xl relative overflow-hidden group">
            {/* Background Image overlay */}
            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <img
                src={INITIAL_MOTIFS[2].imageUrl}
                alt="Visi Batik"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000666] via-[#000666]/90 to-transparent" />
            </div>

            <div className="space-y-5 relative z-10">
              <div className="p-3.5 bg-amber-400 text-[#000666] rounded-2xl w-fit shadow-md">
                <Target className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
                Visi Utama
              </span>
              <h3 className="font-serif-garamond text-2xl md:text-3xl font-bold text-white leading-snug">
                Pelestarian Kebudayaan Batik yang Berdaya Saing Global & Berkelanjutan
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed font-light">
                Terwujudnya ekosistem batik Nusantara yang berintegritas, di mana setiap karya batik tulis, cap, dan kombinasi diakui nilai mahakaryanya, dihargai secara adil, serta terus diwariskan ke generasi muda tanpa kehilangan roh filosofinya.
              </p>
            </div>
            <div className="pt-6 border-t border-white/10 mt-8 relative z-10 flex items-center gap-2.5 text-xs text-amber-300 font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              Terakreditasi & Terverifikasi Nasional
            </div>
          </div>

          {/* Card MISI */}
          <div className="md:col-span-7 bg-slate-50 rounded-3xl p-8 md:p-10 border border-slate-200 shadow-lg flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[#c85a17] text-white rounded-2xl shadow-md">
                  <Compass className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#a14000] uppercase tracking-widest block">
                    Misi Strategis
                  </span>
                  <h3 className="font-serif-garamond text-2xl md:text-3xl font-bold text-[#000666]">
                    4 Pilar Gerakan Komunitas
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 hover:border-amber-300 transition-all shadow-sm">
                  <div className="flex items-center gap-2.5 text-[#000666] font-bold text-xs uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-[#000666] text-white flex items-center justify-center text-[10px] font-extrabold">1</span>
                    Edukasi & Literasi
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Mengedukasi publik untuk membedakan batik asli perintang malam dengan kain cetak (print), serta mengenalkan filosofi di balik tiap motif.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 hover:border-amber-300 transition-all shadow-sm">
                  <div className="flex items-center gap-2.5 text-[#a14000] font-bold text-xs uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-[#a14000] text-white flex items-center justify-center text-[10px] font-extrabold">2</span>
                    Pemberdayaan Ekonomi
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Membuka akses langsung antara pengrajin dengan kolektor dan pembeli melalui platform pasar transparan tanpa perantara tengkulak.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 hover:border-amber-300 transition-all shadow-sm">
                  <div className="flex items-center gap-2.5 text-[#0284c7] font-bold text-xs uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-[10px] font-extrabold">3</span>
                    Perlindungan HKI
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Mendampingi pendaftaran Hak Cipta dan Hak Kekayaan Intelektual untuk motif-motif tradisional serta ciptaan baru pengrajin daerah.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 hover:border-amber-300 transition-all shadow-sm">
                  <div className="flex items-center gap-2.5 text-[#059669] font-bold text-xs uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center text-[10px] font-extrabold">4</span>
                    Regenerasi Pengrajin
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Mencetak generasi pengrajin muda melalui pelatihan mencanting, penggunaan pewarna alami, dan pemanfaatan pemasaran digital.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEKNIK BATIK - CLEAN WHITE CARDS WITH CRISP DETAILS */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold text-[#a14000] uppercase tracking-widest block mb-2">
              Kenali Teknik Pembuatan Autentik
            </span>
            <h2 className="font-serif-garamond text-3xl md:text-5xl font-bold text-[#000666] tracking-tight">
              3 Metode Utama Batik Perintang Malam
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('heritage')}
            className="bg-[#000666] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#a14000] transition-all flex items-center gap-2 shadow-md shrink-0"
          >
            <BookOpen className="w-4 h-4 text-white" />
            Pelajari Jenis Batik Selengkapnya →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* BATIK TULIS CARD - SHAPE 1: CREST / SHIELD */}
          <div 
            className="relative overflow-hidden group bg-white border-2 border-slate-200 flex flex-col justify-between p-8 space-y-6 transition-all duration-300 hover:border-[#a14000] shadow-md hover:shadow-xl"
            style={{ borderRadius: '24px 24px 100px 48px' }}
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="p-3 bg-amber-100 text-[#a14000] rounded-2xl shadow-sm shrink-0">
                  <Feather className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-amber-50 text-[#a14000] border border-amber-200 whitespace-nowrap shrink-0">
                  100% Buatan Tangan
                </span>
              </div>

              <div 
                className="h-44 overflow-hidden relative border border-amber-200/80 my-2 shadow-inner"
                style={{ borderRadius: '18px 18px 80px 36px' }}
              >
                <img
                  src={INITIAL_MOTIFS[0].imageUrl}
                  alt="Batik Tulis - Parang Rusak Barong"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h3 className="font-serif-garamond text-2xl md:text-3xl font-bold text-[#000666]">
                Batik Tulis
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Dibuat secara manual menggoreskan lilin malam panas menggunakan pena tembaga (canting) di atas kain mori atau sutra. Setiap garis mencerminkan keunikan rasa dan ketelitian sang maestro.
              </p>
              <ul className="text-xs space-y-2.5 text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#a14000] shrink-0" /> Waktu pengerjaan: 3 hingga 12 bulan
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#a14000] shrink-0" /> Batik luar-dalam (nganji & nerusi)
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#a14000] shrink-0" /> Bernilai seni & investasi tinggi
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateTab('education')}
              className="w-full relative z-10 text-center py-3 border border-[#000666] text-[#000666] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#000666] hover:text-white transition-all shadow-sm"
            >
              Pelajari Edukasi Batik Tulis
            </button>
          </div>

          {/* BATIK CAP CARD - SHAPE 2: ASYMMETRIC PEBBLE / LEAF */}
          <div 
            className="relative overflow-hidden group bg-white border-2 border-slate-200 flex flex-col justify-between p-8 space-y-6 transition-all duration-300 hover:border-[#c85a17] shadow-md hover:shadow-xl"
            style={{ borderRadius: '60px 80px 40px 75px' }}
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="p-3 bg-orange-100 text-[#c85a17] rounded-2xl shadow-sm shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-orange-50 text-[#c85a17] border border-orange-200 whitespace-nowrap shrink-0">
                  Presisi Canting Cap
                </span>
              </div>

              <div 
                className="h-44 overflow-hidden relative border border-orange-200/80 my-2 shadow-inner"
                style={{ borderRadius: '45px 65px 30px 60px' }}
              >
                <img
                  src={INITIAL_MOTIFS[1].imageUrl}
                  alt="Batik Cap - Kawung Picis"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h3 className="font-serif-garamond text-2xl md:text-3xl font-bold text-[#000666]">
                Batik Cap
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Menggunakan stempel plat tembaga yang direkatkan cairan malam panas. Menghasilkan pola geometris yang rapi dan konsisten dengan tetap menjaga keaslian proses rintang lilin tradisional.
              </p>
              <ul className="text-xs space-y-2.5 text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c85a17] shrink-0" /> Waktu pengerjaan: 1 hingga 3 minggu
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c85a17] shrink-0" /> Plat tembaga buatan tangan pengrajin
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c85a17] shrink-0" /> Sangat cocok untuk busana harian
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateTab('education')}
              className="w-full relative z-10 text-center py-3 border border-[#c85a17] text-[#c85a17] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#c85a17] hover:text-white transition-all shadow-sm"
            >
              Pelajari Edukasi Batik Cap
            </button>
          </div>

          {/* BATIK KOMBINASI CARD - SHAPE 3: SOFT SQUIRCLE */}
          <div 
            className="relative overflow-hidden group bg-white border-2 border-slate-200 flex flex-col justify-between p-8 space-y-6 transition-all duration-300 hover:border-[#0284c7] shadow-md hover:shadow-xl"
            style={{ borderRadius: '36px 36px 36px 36px' }}
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="p-3 bg-sky-100 text-[#0284c7] rounded-2xl shadow-sm shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-sky-50 text-[#0284c7] border border-sky-200 whitespace-nowrap shrink-0">
                  Kombinasi Cap & Tulis
                </span>
              </div>

              <div 
                className="h-44 overflow-hidden relative border border-sky-200/80 my-2 shadow-inner"
                style={{ borderRadius: '28px' }}
              >
                <img
                  src={INITIAL_MOTIFS[3].imageUrl}
                  alt="Batik Kombinasi - Sekar Jagad"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h3 className="font-serif-garamond text-2xl md:text-3xl font-bold text-[#000666]">
                Batik Kombinasi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Perpaduan harmonis antara kepraktisan struktur motif cap dengan sentuhan ornamen isen-isen halus buatan tangan canting tulis. Ciri estetika kaya dan seimbang.
              </p>
              <ul className="text-xs space-y-2.5 text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0284c7] shrink-0" /> Waktu pengerjaan: 1 hingga 2 bulan
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0284c7] shrink-0" /> Kombinasi presisi & detail estetik
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0284c7] shrink-0" /> Pilihan favorit acara formal
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateTab('education')}
              className="w-full relative z-10 text-center py-3 border border-[#0284c7] text-[#0284c7] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#0284c7] hover:text-white transition-all shadow-sm"
            >
              Pelajari Batik Kombinasi
            </button>
          </div>
        </div>
      </section>

      {/* 5. AGENDA & EVENT BERJALAN KOMUNITAS - CLEAN LIGHT CARDS */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold text-[#a14000] uppercase tracking-widest block mb-2">
              Kalender Kegiatan & Festival
            </span>
            <h2 className="font-serif-garamond text-3xl md:text-5xl font-bold text-[#000666] tracking-tight">
              Agenda & Event Berjalan Komunitas
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('community')}
            className="text-xs font-bold text-[#000666] uppercase tracking-widest hover:underline flex items-center gap-1.5"
          >
            Lihat Semua Agenda Komunitas & Forum →
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {MOCK_EVENTS.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl hover:border-amber-300 transition-all flex flex-col sm:flex-row group"
            >
              <div className="w-full sm:w-2/5 h-52 sm:h-auto overflow-hidden relative shrink-0">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#c85a17] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {event.category}
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col justify-between space-y-4 w-full">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-[#a14000] font-bold uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    {event.date}
                  </div>
                  <h3 className="font-serif-garamond text-xl font-bold text-[#000666] leading-snug group-hover:text-[#a14000] transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-[#c85a17] shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-light pt-1">
                    {event.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    <b className="text-slate-800">{event.attendeesCount}</b> Peserta Terdaftar
                  </span>
                  <button
                    onClick={() => {
                      if (onSelectEvent) onSelectEvent(event);
                      onNavigateTab('community');
                    }}
                    className="bg-[#000666] text-white px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#a14000] transition-all shadow-sm"
                  >
                    Ikut Event
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BANNER GABUNG KOMUNITAS / PORTAL */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="relative bg-gradient-to-r from-[#000666] via-[#0f172a] to-[#1e3a8a] text-white p-10 md:p-14 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 z-0">
            <img
              src={INITIAL_MOTIFS[2].imageUrl}
              alt="Komunitas Batik Background"
              className="w-full h-full object-cover opacity-15 filter brightness-110 scale-105"
            />
          </div>

          <div className="space-y-4 text-center md:text-left max-w-2xl relative z-10">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
              Gabung Bersama Komunitas
            </span>
            <h2 className="font-serif-garamond text-3xl md:text-5xl font-bold text-white leading-tight">
              Apakah Anda Pengrajin Batik atau Pecinta Wastra Nusantara?
            </h2>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed font-light">
              Daftarkan diri Anda untuk terhubung dengan ribuan pengrajin, ikuti diskusi forum, dapatkan lisensi verifikasi batik, atau pasarkan karya batik terbaik Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto relative z-10">
            <button
              onClick={() => onNavigateTab('portal')}
              className="bg-amber-400 text-[#000666] px-8 py-4 rounded-full text-xs font-extrabold uppercase tracking-widest hover:bg-white transition-all shadow-lg text-center"
            >
              Portal Pengrajin
            </button>
            <button
              onClick={() => onNavigateTab('community')}
              className="bg-white/10 text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all text-center border border-white/20"
            >
              Forum Diskusi
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
