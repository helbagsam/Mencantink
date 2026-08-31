import React, { useState, useMemo } from 'react';
import { BatikMotif, Currency, NavTab } from '../types';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  SlidersHorizontal, 
  UserCheck, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Eye,
  Truck
} from 'lucide-react';

interface PasarNusantaraViewProps {
  motifs: BatikMotif[];
  currency: Currency;
  onAddToCart: (motif: BatikMotif) => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectMotifDetail: (motif: BatikMotif) => void;
}

export const PasarNusantaraView: React.FC<PasarNusantaraViewProps> = ({
  motifs,
  currency,
  onAddToCart,
  onNavigateTab,
  onSelectMotifDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedMotifTypes, setSelectedMotifTypes] = useState<string[]>([]);
  const [maxPriceIDR, setMaxPriceIDR] = useState<number>(1500000);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'artisan'>('newest');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const formatPrice = (priceInIDR: number) => {
    if (currency === 'USD') {
      const usd = Math.round(priceInIDR / 15500);
      return `$${usd.toLocaleString()}`;
    }
    return `Rp ${priceInIDR.toLocaleString('id-ID')}`;
  };

  const toggleTechnique = (tech: string) => {
    setSelectedTechniques((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const toggleRegion = (reg: string) => {
    setSelectedRegions((prev) =>
      prev.includes(reg) ? prev.filter((r) => r !== reg) : [...prev, reg]
    );
  };

  const toggleMotifType = (type: string) => {
    setSelectedMotifTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBuyNow = (motif: BatikMotif, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(motif);
    onNavigateTab('cart');
  };

  const filteredProducts = useMemo(() => {
    let result = motifs.filter((item) => {
      const price = item.priceIDR || 750000;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.artisanName && item.artisanName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTechnique =
        selectedTechniques.length === 0 || selectedTechniques.includes(item.technique);

      const matchesRegion =
        selectedRegions.length === 0 ||
        selectedRegions.some((r) => item.region.toLowerCase().includes(r.toLowerCase()));

      const matchesMotifType =
        selectedMotifTypes.length === 0 || selectedMotifTypes.includes(item.motifType);

      const matchesPrice = price <= maxPriceIDR;

      return matchesSearch && matchesTechnique && matchesRegion && matchesMotifType && matchesPrice;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.priceIDR || 0) - (b.priceIDR || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.priceIDR || 0) - (a.priceIDR || 0));
    } else if (sortBy === 'artisan') {
      result.sort((a, b) => (a.artisanName || '').localeCompare(b.artisanName || ''));
    }

    return result;
  }, [motifs, searchQuery, selectedTechniques, selectedRegions, selectedMotifTypes, maxPriceIDR, sortBy]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-8">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-[#000666] text-white p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 shadow-md border border-[#ffe088]/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#ffe088] text-[#000666] rounded-lg shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#ffe088] uppercase tracking-wider block">
              Garansi Batik Autentik 100% Sertifikasi Pengrajin
            </span>
            <p className="text-[#bdc2ff] opacity-90">
              Setiap helai kain dilengkapi sertifikat keaslian perintang malam alami dari Komunitas Pengrajin Batik.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('tracking')}
          className="bg-[#a14000] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#7b2f00] transition-colors shrink-0 flex items-center gap-1.5"
        >
          <Truck className="w-4 h-4" />
          Lacak Pesanan Saya
        </button>
      </div>

      {/* 2. MARKETPLACE TITLE & HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#767683]/15 pb-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-bold text-[#a14000] uppercase tracking-widest block">
            E-Commerce Batik Autentik Indonesia
          </span>
          <h1 className="font-serif-garamond text-3xl sm:text-4xl font-bold text-[#000666]">
            Pasar Nusantara
          </h1>
          <p className="text-xs sm:text-sm text-[#454652] leading-relaxed">
            Pusat jual-beli kain batik tulis, cap, dan kombinasi langsung dari sanggar pengrajin master di Solo, Yogyakarta, Pekalongan, Cirebon, dan Lasem.
          </p>
        </div>

        {/* Search Bar & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#767683]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kain batik, pengrajin..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#767683]/30 rounded-lg text-xs text-[#1b1c1a] focus:outline-none focus:border-[#000666]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#000666] shrink-0 uppercase">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#767683]/30 text-[#1b1c1a] text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-[#000666] cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="price-asc">Harga: Rendah ke Tinggi</option>
              <option value="price-desc">Harga: Tinggi ke Rendah</option>
              <option value="artisan">Nama Pengrajin</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. MAIN GRID & SIDEBAR FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (1 Col) */}
        <aside className="space-y-6 bg-white border border-[#767683]/15 p-6 rounded-xl shadow-xs self-start">
          <div className="flex justify-between items-center border-b border-[#767683]/15 pb-3">
            <h3 className="font-serif-garamond text-xl font-bold text-[#000666] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#a14000]" />
              Filter Produk
            </h3>
            {(selectedTechniques.length > 0 || selectedRegions.length > 0 || selectedMotifTypes.length > 0 || maxPriceIDR < 1500000) && (
              <button
                onClick={() => {
                  setSelectedTechniques([]);
                  setSelectedRegions([]);
                  setSelectedMotifTypes([]);
                  setMaxPriceIDR(1500000);
                }}
                className="text-[11px] font-bold text-[#a14000] hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Technique Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#000666] uppercase tracking-wider">Teknik Pembuatan</h4>
            <div className="space-y-2">
              {['Tulis', 'Cap', 'Kombinasi'].map((tech) => (
                <label key={tech} className="flex items-center gap-2.5 text-xs text-[#1b1c1a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTechniques.includes(tech)}
                    onChange={() => toggleTechnique(tech)}
                    className="rounded border-[#767683]/40 text-[#000666] focus:ring-[#000666]"
                  />
                  <span>Batik {tech}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Region Filter */}
          <div className="space-y-3 border-t border-[#767683]/15 pt-4">
            <h4 className="text-xs font-bold text-[#000666] uppercase tracking-wider">Wilayah / Origin</h4>
            <div className="space-y-2">
              {['Solo', 'Yogyakarta', 'Pekalongan', 'Cirebon', 'Lasem'].map((reg) => (
                <label key={reg} className="flex items-center gap-2.5 text-xs text-[#1b1c1a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRegions.includes(reg)}
                    onChange={() => toggleRegion(reg)}
                    className="rounded border-[#767683]/40 text-[#000666] focus:ring-[#000666]"
                  />
                  <span>{reg}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Motif Type Filter */}
          <div className="space-y-3 border-t border-[#767683]/15 pt-4">
            <h4 className="text-xs font-bold text-[#000666] uppercase tracking-wider">Kategori Motif</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Geometris', 'Non-Geometris', 'Abstract / Floral', 'Satwa & Alam'].map((type) => {
                const isSelected = selectedMotifTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleMotifType(type)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                      isSelected
                        ? 'bg-[#000666] text-white'
                        : 'bg-[#efeeea] text-[#454652] hover:bg-[#000666]/10'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-3 border-t border-[#767683]/15 pt-4">
            <div className="flex justify-between items-center text-xs font-bold text-[#000666]">
              <span>Maksimal Harga:</span>
              <span className="text-[#a14000]">{formatPrice(maxPriceIDR)}</span>
            </div>
            <input
              type="range"
              min={400000}
              max={1500000}
              step={50000}
              value={maxPriceIDR}
              onChange={(e) => setMaxPriceIDR(Number(e.target.value))}
              className="w-full accent-[#000666] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#767683]">
              <span>Rp 400rb</span>
              <span>Rp 1,5jt</span>
            </div>
          </div>
        </aside>

        {/* Product Cards Grid (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center text-xs text-[#767683]">
            <span>Menampilkan <b>{filteredProducts.length}</b> produk batik autentik</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#767683]/15 rounded-xl p-12 text-center space-y-4">
              <p className="text-sm text-[#454652]">Tidak ada produk yang cocok dengan kombinasi filter Anda.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTechniques([]);
                  setSelectedRegions([]);
                  setSelectedMotifTypes([]);
                  setMaxPriceIDR(1500000);
                }}
                className="bg-[#000666] text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#1a237e]"
              >
                Tampilkan Semua Produk
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((motif) => {
                const price = motif.priceIDR || 750000;
                const isFav = !!favorites[motif.id];

                return (
                  <article
                    key={motif.id}
                    onClick={() => onSelectMotifDetail(motif)}
                    className="group bg-white border border-[#767683]/15 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#000666]/30 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="w-full h-56 relative overflow-hidden bg-[#efeeea]">
                        <img
                          src={motif.imageUrl}
                          alt={motif.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          <span className="px-2.5 py-0.5 bg-[#000666] text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-xs">
                            Batik {motif.technique}
                          </span>
                          <span className="px-2.5 py-0.5 bg-white/90 text-[#000666] text-[10px] font-bold uppercase tracking-wider rounded border border-[#000666]/20 shadow-xs backdrop-blur-xs">
                            {motif.region}
                          </span>
                        </div>

                        {/* Favorite Heart Button */}
                        <button
                          onClick={(e) => toggleFavorite(motif.id, e)}
                          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-[#000666] hover:text-[#a14000] shadow-xs backdrop-blur-xs transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-[#a14000] text-[#a14000]' : ''}`} />
                        </button>
                      </div>

                      {/* Content details */}
                      <div className="p-5 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-serif-garamond text-lg font-bold text-[#000666] leading-snug group-hover:text-[#a14000] transition-colors line-clamp-1">
                            {motif.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-[#767683]">
                          <UserCheck className="w-3.5 h-3.5 text-[#a14000]" />
                          <span className="truncate">{motif.artisanName || 'Sanggar Pengrajin Nusantara'}</span>
                        </div>

                        <p className="text-xs text-[#454652] line-clamp-2 leading-relaxed">
                          {motif.description}
                        </p>

                        <div className="pt-2 border-t border-[#767683]/15 flex items-baseline justify-between">
                          <span className="text-xs text-[#767683]">Harga Pas:</span>
                          <span className="font-serif-garamond text-xl font-bold text-[#000666]">
                            {formatPrice(price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="p-5 pt-0 grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(motif);
                        }}
                        className="w-full border border-[#000666] text-[#000666] py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#000666]/5 transition-colors flex items-center justify-center gap-1"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        + Keranjang
                      </button>
                      <button
                        onClick={(e) => handleBuyNow(motif, e)}
                        className="w-full bg-[#a14000] text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#7b2f00] transition-colors shadow-xs"
                      >
                        Beli Sekarang
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
