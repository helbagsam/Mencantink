import React from 'react';
import { BatikMotif, Currency } from '../types';
import { X, MapPin, Tag, Landmark, BookOpen } from 'lucide-react';
import { ProofPanel } from './ProofPanel';
import { HERITAGE_MOTIF_IDS, PRODUCT_ARTISAN_MAP } from '../data/trustSeed';
import { useProductTrust } from '../hooks/useProductTrust';

interface MotifModalProps {
  motif: BatikMotif | null;
  onClose: () => void;
  onAddToCart?: (motif: BatikMotif) => void;
  currency?: Currency;
}

/**
 * Halaman detail kain.
 *
 * Di sini dulu ada tombol "Analisis AI" yang hasilnya ditampilkan sebagai
 * "Analisis Kurator AI". Tombol itu dihapus, bukan diperbaiki namanya.
 *
 * Alasannya: halaman ini dilihat pembeli, dan penilaian atas kain di halaman
 * ini sudah ada penanggung jawabnya — verifikator bernama dan bertanggal di
 * panel Bukti Keaslian tepat di bawah. Menambahkan "analisis" karangan mesin
 * di sebelahnya hanya mengaburkan siapa yang sebenarnya menilai, dan
 * memberikan kesan pendapat ahli yang independen pada teks yang sama sekali
 * bukan itu.
 *
 * Itu jenis kesalahan yang sama dengan lencana "98% Authenticity" dan
 * "Garansi 100% Asli" yang sudah dibuang dari aplikasi ini: sesuatu yang
 * belum terverifikasi didandani seolah-olah berwenang.
 *
 * Bantuan AI tetap ada, tetapi di tempat yang memang cocok — membantu
 * pengrajin menyusun kalimat jualan dari kata kuncinya sendiri di borang
 * unggah, bukan menilai kain di hadapan pembeli.
 */
export const MotifModal: React.FC<MotifModalProps> = ({
  motif,
  onClose,
  onAddToCart,
  currency = 'IDR',
}) => {
  const { trust } = useProductTrust(motif?.id, motif ? PRODUCT_ARTISAN_MAP[motif.id] : undefined);

  if (!motif) return null;

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

          </div>

          {/* Action buttons */}
          <div className="mt-6 pt-4 border-t border-[#767683]/15 flex flex-wrap gap-2">
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
