import React, { useState } from 'react';
import { BatikMotif, Currency } from '../types';
import { X, Sparkles, MapPin, Tag, Landmark, Loader2, BookOpen } from 'lucide-react';
import { ProofPanel } from './ProofPanel';
import { HERITAGE_MOTIF_IDS, PRODUCT_ARTISAN_MAP } from '../data/trustSeed';
import { useProductTrust } from '../hooks/useProductTrust';

interface MotifModalProps {
  motif: BatikMotif | null;
  onClose: () => void;
  onAddToCart?: (motif: BatikMotif) => void;
  currency?: Currency;
}

export const MotifModal: React.FC<MotifModalProps> = ({
  motif,
  onClose,
  onAddToCart,
  currency = 'IDR',
}) => {
  const { trust } = useProductTrust(motif?.id, motif ? PRODUCT_ARTISAN_MAP[motif.id] : undefined);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!motif) return null;

  const handleAskGemini = async () => {
    setLoadingAi(true);
    setAiInsight(null);
    try {
      const res = await fetch('/api/gemini/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motifName: motif.name,
          technique: motif.technique,
          region: motif.region,
          keywords: `${motif.motifType}, ${motif.tags.join(', ')}`,
        }),
      });

      const data = await res.json();
      if (data.result) {
        try {
          const parsed = JSON.parse(data.result);
          setAiInsight(parsed.heritageDescription || data.result);
        } catch {
          setAiInsight(data.result);
        }
      } else {
        setAiInsight('Unable to generate AI response. Please verify API key.');
      }
    } catch (err: any) {
      setAiInsight('Error fetching curator insight.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#fbf9f5] border border-[#767683]/20 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#fbf9f5]/80 hover:bg-[#e4e2de] rounded-full text-[#1b1c1a] transition-colors border border-[#767683]/20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Baris atas: gambar dan keterangan motif */}
        <div className="flex flex-col md:flex-row">

        {/* Motif Image */}
        <div className="w-full md:w-1/2 min-h-[280px] bg-[#e4e2de] relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-[#767683]/15">
          <img
            src={motif.imageUrl}
            alt={motif.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="bg-[#fbf9f5]/90 border border-[#000666]/20 text-[#000666] text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
              {motif.region}
            </span>
            <span className="bg-[#a14000] text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {motif.technique}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#a14000]">
                {motif.motifType} Motif
              </span>
              <h2 className="font-serif-garamond text-3xl font-bold text-[#000666] mt-0.5">
                {motif.name}
              </h2>
            </div>

            <p className="text-sm text-[#454652] leading-relaxed">
              {motif.description}
            </p>

            {/* Philosophy Box */}
            <div className="bg-[#f5f3ef] border border-[#767683]/15 rounded-lg p-4 space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#000666] flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#a14000]" /> Filosofi Motif
              </h4>
              <p className="text-xs text-[#1b1c1a] italic leading-relaxed">
                "{motif.philosophy}"
              </p>
            </div>

            {/* Historical Context */}
            {motif.originHistory && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#767683] flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5" /> Asal Usul & Catatan Sejarah
                </h4>
                <p className="text-xs text-[#454652]">
                  {motif.originHistory}
                </p>
              </div>
            )}

            {/* Estimated Price */}
            {motif.priceEstimate && (
              <div className="pt-2 border-t border-[#767683]/15 flex justify-between items-center text-xs">
                <span className="text-[#767683] uppercase tracking-wider">Perkiraan Nilai Galeri:</span>
                <span className="font-bold text-[#000666] font-serif-garamond text-sm">{motif.priceEstimate}</span>
              </div>
            )}

            {/* AI Curator Insights */}
            {aiInsight && (
              <div className="bg-[#e0e0ff]/40 border border-[#000666]/20 rounded-lg p-3 text-xs text-[#000666] space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#a14000]" /> Analisis Kurator AI
                </div>
                <p>{aiInsight}</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-6 pt-4 border-t border-[#767683]/15 flex flex-wrap gap-2">
            <button
              onClick={handleAskGemini}
              disabled={loadingAi}
              className="flex-1 py-2.5 px-3 bg-[#000666] text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#1a237e] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              {loadingAi ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#ffe088]" />
                  Analisis AI
                </>
              )}
            </button>
            {/* Kain tanpa bukti yang sudah ditinjau tidak dijual. Aturannya
                dipusatkan di trustService supaya tombol ini dan panel bukti di
                bawah mustahil berbeda pendapat. */}
            {onAddToCart &&
              (trust?.purchasable ? (
                <button
                  onClick={() => {
                    onAddToCart(motif);
                    onClose();
                  }}
                  className="py-2.5 px-4 bg-[#a14000] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#7b2f00] transition-colors shadow-sm"
                >
                  + Beli Kain Ini
                </button>
              ) : (
                <button
                  disabled
                  title={trust?.blockReason}
                  className="py-2.5 px-4 bg-[#efeeea] text-[#767683] border border-[#767683]/25 rounded-lg text-xs font-bold uppercase tracking-wider cursor-not-allowed"
                >
                  Belum Dapat Dibeli
                </button>
              ))}
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-[#767683]/30 text-[#1b1c1a] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#efeeea] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
        </div>

        {/* Bukti Keaslian — inti pembeda produk ini, diberi lebar penuh karena
            di sinilah pembeli menilai sendiri sebelum memutuskan membeli. */}
        <div className="p-4 md:p-6 border-t border-[#767683]/15 bg-[#efeeea]/40">
          <ProofPanel
            productId={motif.id}
            priceIDR={motif.priceIDR}
            currency={currency}
            isHeritageMotif={HERITAGE_MOTIF_IDS.has(motif.id)}
            fallbackArtisanId={PRODUCT_ARTISAN_MAP[motif.id]}
          />
        </div>
      </div>
    </div>
  );
};
