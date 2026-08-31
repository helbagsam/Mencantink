import React, { useState, useMemo } from 'react';
import { BatikMotif } from '../types';
import { Search, ChevronDown, ArrowRight, Sparkles, Filter } from 'lucide-react';

interface CatalogViewProps {
  motifs: BatikMotif[];
  onSelectMotif: (motif: BatikMotif) => void;
  onAddToCart?: (motif: BatikMotif) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ motifs, onSelectMotif, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedTechnique, setSelectedTechnique] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const filteredMotifs = useMemo(() => {
    return motifs.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRegion = selectedRegion === 'All' || m.region === selectedRegion;
      const matchesTechnique = selectedTechnique === 'All' || m.technique === selectedTechnique;
      const matchesType = selectedType === 'All' || m.motifType === selectedType;

      return matchesSearch && matchesRegion && matchesTechnique && matchesType;
    });
  }, [motifs, searchQuery, selectedRegion, selectedTechnique, selectedType]);

  const uniqueRegions = ['All', 'Central Java', 'Yogyakarta', 'Cirebon', 'Solo', 'Pekalongan'];
  const uniqueTechniques = ['All', 'Tulis', 'Cap', 'Kombinasi'];
  const uniqueTypes = ['All', 'Geometris', 'Non-Geometris', 'Abstract / Floral'];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-28 pb-20">
      {/* Header Section */}
      <section className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="font-serif-garamond text-4xl md:text-5xl font-bold text-[#000666] mb-4">
          Motif Archive
        </h1>
        <p className="text-base md:text-lg text-[#454652] leading-relaxed">
          Explore a curated collection of traditional and contemporary batik patterns, cataloging the rich visual language of Indonesian textile heritage.
        </p>
      </section>

      {/* Search & Filter Bar */}
      <section className="mb-12 border border-[#767683]/15 bg-[#ffffff] p-6 rounded-xl shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          {/* Search Input */}
          <div className="w-full lg:w-1/3 relative">
            <Search className="w-4 h-4 absolute left-0 bottom-3 text-[#767683]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search motifs..."
              className="w-full pl-7 pb-2 bg-transparent border-0 border-b border-[#000666]/30 focus:ring-0 focus:border-[#000666] text-sm text-[#1b1c1a] placeholder:text-[#767683] transition-colors"
            />
          </div>

          {/* Filter Dropdowns / Chips */}
          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
            <span className="text-xs font-bold text-[#a14000] uppercase tracking-widest mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>

            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="border border-[#767683]/30 bg-[#fbf9f5] text-[#454652] px-4 py-1.5 rounded-full text-xs font-semibold hover:border-[#000666] transition-all focus:outline-none"
            >
              {uniqueRegions.map((r) => (
                <option key={r} value={r}>
                  Region: {r}
                </option>
              ))}
            </select>

            {/* Technique Filter */}
            <select
              value={selectedTechnique}
              onChange={(e) => setSelectedTechnique(e.target.value)}
              className="border border-[#767683]/30 bg-[#fbf9f5] text-[#454652] px-4 py-1.5 rounded-full text-xs font-semibold hover:border-[#000666] transition-all focus:outline-none"
            >
              {uniqueTechniques.map((t) => (
                <option key={t} value={t}>
                  Technique: {t}
                </option>
              ))}
            </select>

            {/* Motif Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-[#767683]/30 bg-[#fbf9f5] text-[#454652] px-4 py-1.5 rounded-full text-xs font-semibold hover:border-[#000666] transition-all focus:outline-none"
            >
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  Type: {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grid Gallery */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMotifs.slice(0, visibleCount).map((motif, index) => {
          // Make Card 1 (Parang) span 2 cols on lg screens like in the prompt screenshot!
          const isLargeFeatured = index === 0 && motif.id === 'parang-rusak';
          const isWideCard = index === 3 && motif.id === 'sekar-jagad';

          if (isLargeFeatured) {
            return (
              <article
                key={motif.id}
                onClick={() => onSelectMotif(motif)}
                className="group relative overflow-hidden border border-[#000666]/15 bg-white rounded-xl flex flex-col lg:col-span-2 lg:flex-row shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="batik-overlay-pattern absolute inset-0 pointer-events-none text-[#000666]" />
                <div className="w-full lg:w-1/2 h-64 lg:h-auto overflow-hidden relative">
                  <img
                    src={motif.imageUrl}
                    alt={motif.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center w-full lg:w-1/2 relative z-10 bg-white/90">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="bg-[#f5f3ef] border border-[#000666]/20 text-[#000666] px-3 py-1 rounded-full text-xs font-semibold">
                      {motif.region}
                    </span>
                    <span className="bg-[#f5f3ef] border border-[#000666]/20 text-[#000666] px-3 py-1 rounded-full text-xs font-semibold">
                      {motif.technique}
                    </span>
                  </div>
                  <h2 className="font-serif-garamond text-3xl font-bold text-[#000666] mb-3">
                    {motif.name}
                  </h2>
                  <p className="text-sm text-[#454652] mb-6 leading-relaxed">
                    {motif.description}
                  </p>
                  <div className="inline-flex items-center gap-2 border-b border-[#a14000] pb-1 text-[#a14000] text-xs font-bold uppercase tracking-widest w-fit group-hover:text-[#000666] group-hover:border-[#000666] transition-colors">
                    Examine Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            );
          }

          if (isWideCard) {
            return (
              <article
                key={motif.id}
                onClick={() => onSelectMotif(motif)}
                className="group relative overflow-hidden border border-[#000666]/15 bg-white rounded-xl flex flex-col md:flex-row lg:col-span-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="batik-overlay-pattern absolute inset-0 pointer-events-none text-[#000666]" />
                <div className="w-full md:w-1/2 lg:w-2/5 h-64 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-[#000666]/10">
                  <img
                    src={motif.imageUrl}
                    alt={motif.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center w-full md:w-1/2 lg:w-3/5 relative z-10">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="bg-[#fbf9f5] border border-[#000666]/10 text-[#000666] px-2.5 py-0.5 rounded-md text-[11px] font-semibold">
                      {motif.region}
                    </span>
                    <span className="bg-[#fbf9f5] border border-[#000666]/10 text-[#000666] px-2.5 py-0.5 rounded-md text-[11px] font-semibold">
                      {motif.motifType}
                    </span>
                  </div>
                  <h3 className="font-serif-garamond text-2xl font-bold text-[#000666] mb-2">
                    {motif.name}
                  </h3>
                  <p className="text-sm text-[#454652] mb-6 leading-relaxed line-clamp-3">
                    {motif.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-[#000666] text-xs font-bold uppercase tracking-widest w-fit group-hover:text-[#a14000] transition-colors">
                    View Archive Entry <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            );
          }

          // Standard Card
          return (
            <article
              key={motif.id}
              onClick={() => onSelectMotif(motif)}
              className="group relative overflow-hidden border border-[#000666]/15 bg-white rounded-xl flex flex-col shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="batik-overlay-pattern absolute inset-0 pointer-events-none text-[#000666]" />
              <div className="w-full h-56 overflow-hidden border-b border-[#000666]/10">
                <img
                  src={motif.imageUrl}
                  alt={motif.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow relative z-10">
                <div className="flex gap-2 mb-3">
                  <span className="bg-[#fbf9f5] border border-[#000666]/10 text-[#000666] px-2 py-0.5 rounded-md text-[11px] font-semibold">
                    {motif.region}
                  </span>
                  <span className="bg-[#fbf9f5] border border-[#000666]/10 text-[#000666] px-2 py-0.5 rounded-md text-[11px] font-semibold">
                    {motif.technique}
                  </span>
                </div>
                <h3 className="font-serif-garamond text-2xl font-bold text-[#000666] mb-2">
                  {motif.name}
                </h3>
                <p className="text-sm text-[#454652] mb-6 flex-grow line-clamp-3 leading-relaxed">
                  {motif.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMotif(motif);
                    }}
                    className="flex-1 border border-[#767683]/40 text-[#454652] py-2.5 rounded-md text-[11px] font-bold uppercase tracking-wider hover:border-[#000666] hover:text-[#000666] transition-colors"
                  >
                    Detail
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddToCart) onAddToCart(motif);
                    }}
                    className="flex-1 bg-[#a14000] text-white py-2.5 rounded-md text-[11px] font-bold uppercase tracking-wider hover:bg-[#7b2f00] transition-colors shadow-sm"
                  >
                    + Keranjang
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Load More Button */}
      {visibleCount < filteredMotifs.length && (
        <div className="mt-16 text-center border-t border-[#767683]/15 pt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="bg-transparent border border-[#767683]/40 text-[#454652] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:border-[#000666] hover:text-[#000666] transition-all"
          >
            Load More Patterns
          </button>
        </div>
      )}
    </div>
  );
};
