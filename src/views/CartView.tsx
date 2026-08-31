import React, { useState } from 'react';
import { CartItem, Currency, NavTab } from '../types';
import { formatPrice, formatPriceSecondary } from '../utils/currency';
import { Trash2, ShieldCheck, ArrowRight, Tag, Info, ShoppingBag } from 'lucide-react';

interface CartViewProps {
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  discountIDR: number;
  onApplyDiscount: (code: string) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onNavigateTab,
  discountIDR,
  onApplyDiscount,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(discountIDR > 0);
  const [promoMsg, setPromoMsg] = useState('');

  const subtotalIDR = items.reduce((sum, item) => sum + item.priceIDR * item.quantity, 0);
  const shippingEstIDR = items.length > 0 ? 45000 : 0;
  const grandTotalIDR = Math.max(0, subtotalIDR + shippingEstIDR - discountIDR);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    if (promoInput.trim().toUpperCase() === 'KODEHERITAGE' || promoInput.trim().toUpperCase() === 'BATIK200') {
      onApplyDiscount(200000);
      setPromoApplied(true);
      setPromoMsg('Kode Promo berhasil dipasang! (Diskon Rp 200.000)');
    } else {
      setPromoMsg('Kode promo tidak valid. Gunakan: KODEHERITAGE');
    }
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#a14000] mb-2">
          <ShoppingBag className="w-4 h-4" />
          <span>E-Commerce Cart System</span>
        </div>
        <h1 className="font-serif-garamond text-3xl md:text-5xl font-bold text-[#000666]">
          Keranjang Belanja <span className="opacity-40 font-normal text-2xl md:text-3xl">/ Shopping Cart</span>
        </h1>
        <p className="text-sm md:text-base text-[#454652] italic mt-2">
          {items.length > 0 ? (
            <>Terdapat {items.length} mahakarya pilihan Anda — <span className="not-italic text-xs font-semibold text-[#000666]">{items.length} curated masterpieces in your cart</span></>
          ) : (
            'Keranjang Anda masih kosong / Your shopping cart is currently empty'
          )}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-[#ffffff] border border-[#767683]/20 rounded-2xl p-12 text-center max-w-xl mx-auto my-8 shadow-sm">
          <div className="w-16 h-16 bg-[#efeeea] rounded-full flex items-center justify-center mx-auto mb-4 text-[#000666]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif-garamond text-2xl font-bold text-[#000666] mb-2">Belum Ada Kain di Keranjang</h2>
          <p className="text-sm text-[#454652] mb-6">
            Jelajahi koleksi batik tulis dan batik cap autentik dari para maestro pengrajin nusantara.
          </p>
          <button
            onClick={() => onNavigateTab('catalog')}
            className="bg-[#000666] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#1a237e] transition-colors inline-flex items-center gap-2"
          >
            Jelajahi Pasar / Explore Catalog <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative bg-[#f5f3ef] p-5 md:p-6 rounded-xl border border-[#767683]/20 hover:border-[#000666]/40 transition-all duration-300 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row gap-5 relative z-10">
                  <div className="w-full sm:w-32 h-36 flex-shrink-0 bg-[#e4e2de] rounded-lg overflow-hidden border border-[#767683]/15">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-serif-garamond text-xl md:text-2xl font-bold text-[#1b1c1a] leading-snug">
                            {item.name}
                          </h3>
                          {item.artisanName && (
                            <p className="text-xs text-[#735c00] font-semibold mt-0.5">
                              Pengrajin: {item.artisanName} {item.region ? `(${item.region})` : ''}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#767683] hover:text-[#ba1a1a] transition-colors p-1"
                          title="Hapus / Remove"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-[#efeeea] px-3 py-0.5 rounded-full text-xs font-semibold text-[#000666] border border-[#000666]/20">
                          {item.technique === 'Tulis' ? 'Batik Tulis' : item.technique}
                        </span>
                        <span className="bg-[#ffffff] px-3 py-0.5 rounded-full text-xs font-medium text-[#735c00] border border-[#735c00]/30 italic">
                          {item.fabricType}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-4 pt-3 border-t border-[#767683]/15">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#767683]/30 rounded-full px-2 py-0.5 bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-[#454652] hover:text-[#000666] font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 font-sans font-bold text-sm text-[#1b1c1a]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#454652] hover:text-[#000666] font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Price Display */}
                      <div className="text-right">
                        <p className="font-serif-garamond text-xl md:text-2xl font-bold text-[#000666]">
                          {formatPrice(item.priceIDR * item.quantity, currency)}
                        </p>
                        <p className="text-[11px] text-[#454652] opacity-75 font-sans">
                          {formatPriceSecondary(item.priceIDR * item.quantity, currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Catatan Warisan Budaya Box */}
            <div className="p-6 md:p-8 border border-[#cba72f] bg-[#fbf9f5] rounded-xl relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#ffe088]/40 rounded-full text-[#735c00] shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif-garamond text-xl font-bold text-[#735c00] mb-2 italic">
                    Catatan Warisan Budaya — <span className="not-italic text-sm text-[#1b1c1a]">Catatan Warisan Budaya</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#454652] leading-relaxed">
                    <p>
                      Setiap pembelian mahakarya ini merupakan kontribusi langsung bagi keberlangsungan hidup para perajin tradisional di Pekalongan, Solo, dan Yogyakarta. Anda turut menjaga napas teknik canting dan cap yang diakui UNESCO.
                    </p>
                    <p className="border-l border-[#767683]/20 pl-4 italic">
                      Setiap pembelian di sini langsung sampai ke pengrajinnya, bukan ke pedagang perantara yang menempelkan mereknya sendiri. Rincian bagi hasilnya bisa Anda lihat terbuka di halaman tiap produk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#eae8e4] p-6 md:p-8 rounded-xl border border-[#767683]/30 shadow-sm sticky top-28">
              <h2 className="font-serif-garamond text-2xl font-bold text-[#000666] mb-6 border-b border-[#767683]/20 pb-4">
                Ringkasan Pesanan / <span className="text-base opacity-70">Ringkasan Pesanan</span>
              </h2>

              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[#454652] block">Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} Item)</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-50 block">Subtotal</span>
                  </div>
                  <div className="text-right font-semibold text-[#1b1c1a]">
                    <span>{formatPrice(subtotalIDR, currency)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[#454652] block">Estimasi Pengiriman</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-50 block">Est. Shipping</span>
                  </div>
                  <div className="text-right font-semibold text-[#1b1c1a]">
                    <span>{formatPrice(shippingEstIDR, currency)}</span>
                  </div>
                </div>

                {discountIDR > 0 && (
                  <div className="flex justify-between items-start text-[#a14000]">
                    <div>
                      <span className="font-medium block">Potongan Keanggotaan</span>
                      <span className="text-[10px] uppercase tracking-wider opacity-60 block">Member Discount</span>
                    </div>
                    <div className="text-right font-bold">
                      <span>- {formatPrice(discountIDR, currency)}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-[#767683]/30 flex justify-between items-center">
                  <div>
                    <span className="font-serif-garamond text-xl font-bold text-[#1b1c1a] block">Total Biaya</span>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-[#454652] opacity-70 block">
                      Grand Total
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif-garamond text-2xl font-bold text-[#000666] block">
                      {formatPrice(grandTotalIDR, currency)}
                    </span>
                    <span className="text-xs text-[#454652] block opacity-75">
                      {formatPriceSecondary(grandTotalIDR, currency)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('checkout')}
                className="w-full bg-[#000666] text-white py-4 rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#1a237e] transition-all shadow-lg shadow-[#000666]/20 mb-6 flex items-center justify-center gap-2"
              >
                Proses ke Pembayaran — <span className="opacity-70">Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 text-[#454652] border-t border-[#767683]/20 pt-4">
                <ShieldCheck className="w-5 h-5 text-[#735c00] shrink-0" />
                <p className="text-[11px] leading-tight italic">
                  Transaksi Terenkripsi & Sertifikat Keaslian. <br />
                  <span className="not-italic opacity-70">Encrypted Transaction & Authenticity Certificates.</span>
                </p>
              </div>
            </div>

            {/* Promo Code Card */}
            <div className="p-5 border border-[#767683]/20 rounded-xl bg-white shadow-sm">
              <label className="block text-xs font-bold text-[#a14000] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Masukkan Kode Promo / <span className="opacity-60">Promo Code</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="KODEHERITAGE"
                  className="flex-grow bg-[#fbf9f5] border border-[#767683]/30 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-[#000666]"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-[#a14000] text-white font-sans text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-[#7b2f00] transition-colors shrink-0"
                >
                  Gunakan
                </button>
              </div>
              {promoMsg && (
                <p className={`text-[11px] mt-2 font-medium ${promoApplied ? 'text-green-700' : 'text-[#ba1a1a]'}`}>
                  {promoMsg}
                </p>
              )}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
};
