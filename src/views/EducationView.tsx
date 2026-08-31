import React, { useState, useMemo } from 'react';
import { BatikMotif, NavTab } from '../types';
import { 
  BookOpen, 
  MapPin, 
  Sparkles, 
  Feather, 
  Clock, 
  Flame, 
  Layers, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  ShoppingCart
} from 'lucide-react';

interface EducationViewProps {
  motifs: BatikMotif[];
  onSelectMotif: (motif: BatikMotif) => void;
  onAddToCart?: (motif: BatikMotif) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const EducationView: React.FC<EducationViewProps> = ({
  motifs,
  onSelectMotif,
  onAddToCart,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Semua');
  const [selectedTechnique, setSelectedTechnique] = useState<string>('Semua');
  const [selectedType, setSelectedType] = useState<string>('Semua');

  const filteredMotifs = useMemo(() => {
    return motifs.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.ciriKhas && m.ciriKhas.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.originHistory && m.originHistory.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRegion =
        selectedRegion === 'Semua' || m.region.toLowerCase().includes(selectedRegion.toLowerCase());
      const matchesTechnique =
        selectedTechnique === 'Semua' || m.technique === selectedTechnique;
      const matchesType =
        selectedType === 'Semua' || m.motifType === selectedType;

      return matchesSearch && matchesRegion && matchesTechnique && matchesType;
    });
  }, [motifs, searchQuery, selectedRegion, selectedTechnique, selectedType]);

  const uniqueRegions = ['Semua', 'Solo', 'Yogyakarta', 'Cirebon', 'Pekalongan', 'Lasem'];
  const uniqueTechniques = ['Semua', 'Tulis', 'Cap', 'Kombinasi'];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12 bg-white text-slate-800 min-h-screen">
      {/* 1. HERO HEADER SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-[#a14000] uppercase tracking-widest inline-flex items-center justify-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
          <BookOpen className="w-4 h-4 text-[#a14000]" />
          Ensiklopedi & Edukasi Batik Nusantara
        </span>
        <h1 className="font-serif-garamond text-4xl sm:text-5xl font-bold text-[#000666] leading-tight">
          Edukasi Macam-Macam Jenis Batik Nusantara
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
          Pelajari tempat asal, ciri khas visual, latar sejarah sakral, serta tahapan prosedur proses pembuatan kain batik autentik perintang malam dari berbagai penjuru Indonesia.
        </p>
      </section>

      {/* 2. INFOGRAFIS: TAHAPAN PROSES PEMBUATAN BATIK AUTENTIK */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-[#a14000] uppercase tracking-widest block">
              Prosedur Autentik UNESCO
            </span>
            <h2 className="font-serif-garamond text-2xl font-bold text-[#000666]">
              5 Tahap Utama Pembuatan Kain Batik Asli
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#000666] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            Perintang Lilin Malam Panas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
            <span className="w-7 h-7 bg-[#000666] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <h3 className="font-serif-garamond text-base font-bold text-[#000666]">Nganji & Ketel</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-light">Pembersihan kain katun/sutra dengan pati alami agar pori-pori kain siap menyerap malam.</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
            <span className="w-7 h-7 bg-[#000666] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <h3 className="font-serif-garamond text-base font-bold text-[#000666]">Nglowong (Nyanting)</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-light">Menggoreskan cairan malam panas menggunakan canting corong bambu sesuai outline motif.</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
            <span className="w-7 h-7 bg-[#000666] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <h3 className="font-serif-garamond text-base font-bold text-[#000666]">Isen-Isen</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-light">Pengisian ornamen detail (titik cecek, garis sisik) di dalam ruang batas motif utama.</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
            <span className="w-7 h-7 bg-[#000666] text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
            <h3 className="font-serif-garamond text-base font-bold text-[#000666]">Medel / Nyolet</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-light">Pencelupan ke larutan pewarna alami (Soga kayu/Indigofera) atau kuasan warna nyolet.</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-sm">
            <span className="w-7 h-7 bg-[#000666] text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
            <h3 className="font-serif-garamond text-base font-bold text-[#000666]">Lorot (Pelarutan)</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-light">Penggodokan kain dalam air mendidih untuk melarutkan seluruh perintang malam lilin.</p>
          </div>
        </div>
      </section>

      {/* 3. SEARCH & FILTER BAR */}
      <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="w-full lg:w-1/2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari motif batik, tempat asal, ciri khas, sejarah..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#000666]"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <span className="text-xs font-bold text-[#000666] uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter Edukasi:
            </span>

            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="border border-slate-300 bg-white text-slate-800 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#000666]"
            >
              {uniqueRegions.map((r) => (
                <option key={r} value={r}>
                  Wilayah: {r}
                </option>
              ))}
            </select>

            {/* Technique Filter */}
            <select
              value={selectedTechnique}
              onChange={(e) => setSelectedTechnique(e.target.value)}
              className="border border-slate-300 bg-white text-slate-800 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#000666]"
            >
              {uniqueTechniques.map((t) => (
                <option key={t} value={t}>
                  Teknik: {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 4. EDUCATIONAL CARDS ARCHIVE GRID */}
      <section className="space-y-8">
        <div className="flex justify-between items-center text-xs text-slate-600">
          <span>Menampilkan <b>{filteredMotifs.length}</b> Ensiklopedi Motif Batik Nusantara</span>
          <button
            onClick={() => onNavigateTab('marketplace')}
            className="font-bold text-[#a14000] hover:underline flex items-center gap-1 uppercase tracking-wider text-[11px]"
          >
            Beli Kain di Pasar Nusantara →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredMotifs.map((motif) => (
            <article
              key={motif.id}
              onClick={() => onSelectMotif(motif)}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header Image + Badges */}
                <div className="h-64 relative overflow-hidden bg-slate-100">
                  <img
                    src={motif.imageUrl}
                    alt={motif.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className="px-3 py-1 bg-[#000666] text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {motif.region}
                    </span>
                    <span className="px-3 py-1 bg-white/90 text-slate-800 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-200 backdrop-blur-md shadow-sm">
                      Batik {motif.technique}
                    </span>
                  </div>
                </div>

                {/* Educational Content */}
                <div className="p-6 md:p-8 space-y-5">
                  <div>
                    <span className="text-[10px] font-bold text-[#a14000] uppercase tracking-widest block mb-1">
                      Kategori {motif.motifType}
                    </span>
                    <h2 className="font-serif-garamond text-2xl font-bold text-[#000666] group-hover:text-[#a14000] transition-colors">
                      {motif.name}
                    </h2>
                  </div>

                  {/* Tempat Asal & Ciri Khas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="space-y-1">
                      <span className="font-bold text-[#000666] uppercase tracking-wider flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-[#a14000]" /> Tempat Asal:
                      </span>
                      <p className="text-slate-700">{motif.region}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-[#000666] uppercase tracking-wider flex items-center gap-1 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-[#a14000]" /> Ciri Khas Visual:
                      </span>
                      <p className="text-slate-700 line-clamp-2">{motif.ciriKhas || motif.description}</p>
                    </div>
                  </div>

                  {/* Sejarah & Latar Belakang */}
                  <div className="space-y-1.5 text-xs">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider">Sejarah & Origin:</h4>
                    <p className="text-slate-600 leading-relaxed line-clamp-3 font-light">
                      {motif.originHistory}
                    </p>
                  </div>

                  {/* Ringkasan Proses Pembuatan */}
                  {motif.prosesPembuatan && (
                    <div className="space-y-1.5 text-xs pt-3 border-t border-slate-100">
                      <h4 className="font-bold text-[#a14000] uppercase tracking-wider">Langkah Proses Pembuatan:</h4>
                      <ul className="space-y-1 text-slate-600 font-light">
                        {motif.prosesPembuatan.slice(0, 3).map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#a14000] font-bold">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                <button
                  onClick={() => onSelectMotif(motif)}
                  className="text-xs font-bold text-[#000666] uppercase tracking-wider hover:underline flex items-center gap-1"
                >
                  Baca Eksplorasi Lengkap <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAddToCart) onAddToCart(motif);
                    onNavigateTab('cart');
                  }}
                  className="bg-gradient-to-r from-[#c85a17] to-[#a14000] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Pesan Kain Ini
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
