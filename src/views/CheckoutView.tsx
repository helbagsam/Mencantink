import React, { useState } from 'react';
import { CartItem, Currency, NavTab, Order, OrderTimelineItem } from '../types';
import { formatPrice, formatPriceSecondary } from '../utils/currency';
import { Lock, ShieldCheck, Award, ArrowLeft, CheckCircle2, CreditCard, Landmark, QrCode, Smartphone, UserCircle2 } from 'lucide-react';
import { useSession } from '../hooks/useSession';

interface CheckoutViewProps {
  items: CartItem[];
  currency: Currency;
  discountIDR: number;
  onNavigateTab: (tab: NavTab) => void;
  onCompleteCheckout: (newOrder: Order) => void;
  onOpenAuth: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  currency,
  discountIDR,
  onNavigateTab,
  onCompleteCheckout,
  onOpenAuth,
}) => {
  const { session } = useSession();

  // Form State
  // Nama penerima diawali dari akun yang sedang masuk, supaya pesanan tidak
  // tampil atas nama orang lain di portal pengrajin. Tetap bisa diubah, karena
  // kain memang bisa dikirim ke orang lain.
  const [fullName, setFullName] = useState(session?.displayName ?? '');
  const [streetAddress, setStreetAddress] = useState('Jl. Diponegoro No. 12, Menteng');
  const [city, setCity] = useState('Jakarta Pusat');
  const [postalCode, setPostalCode] = useState('10310');
  const [phone, setPhone] = useState('+62 812 3456 7890');

  // Options
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'va' | 'card' | 'ewallet'>('bank_transfer');
  const [selectedBank, setSelectedBank] = useState<string>('BCA');

  const subtotalIDR = items.reduce((sum, item) => sum + item.priceIDR * item.quantity, 0);
  const shippingCostIDR = shippingMethod === 'express' ? 75000 : 25000;
  const taxIDR = Math.round((subtotalIDR - discountIDR) * 0.11);
  const totalIDR = Math.max(0, subtotalIDR + shippingCostIDR + taxIDR - discountIDR);

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `BTK-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const trackingCode = `NX-${Math.floor(1000000 + Math.random() * 9000000)}-BTK`;

      const now = new Date();
      const dateString = now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }) + ` • ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} WIB`;

      const initialTimeline: OrderTimelineItem[] = [
        {
          id: 'tl-1',
          title: 'Order Placed & Payment Confirmed',
          titleId: 'Pesanan Dibuat & Pembayaran Dikonfirmasi',
          timestamp: 'Just now',
          description: `Transaction verified via ${paymentMethod.toUpperCase()} (${paymentMethod === 'bank_transfer' ? selectedBank : 'Instant Confirmation'}).`,
          descriptionId: `Transaksi terverifikasi via ${paymentMethod.toUpperCase()}.`,
          completed: true,
        },
        {
          id: 'tl-2',
          title: 'Quality Inspection & Handover to Artisan',
          titleId: 'Inspeksi Kualitas & Penyerahan ke Artisan',
          timestamp: 'In Progress',
          description: 'Master Artisan preparing wax-resist pattern integrity certification.',
          descriptionId: 'Master Artisan menyiapkan sertifikasi integritas pola.',
          completed: false,
        },
      ];

      const newOrder: Order = {
        id: orderId,
        createdAt: dateString,
        // Pesanan diikat ke akun pemesannya, supaya nanti hanya muncul pada
        // pelacakan miliknya sendiri.
        buyerAccountId: session?.accountId,
        buyerName: session?.displayName ?? fullName,
        items: [...items],
        subtotalIDR,
        shippingCostIDR,
        taxIDR,
        discountIDR,
        totalIDR,
        shippingAddress: {
          fullName,
          address: streetAddress,
          city,
          postalCode,
          phone,
        },
        shippingMethod,
        paymentMethod,
        paymentBank: selectedBank,
        status: 'placed',
        trackingId: trackingCode,
        timeline: initialTimeline,
      };

      setIsProcessing(false);
      onCompleteCheckout(newOrder);
    }, 1200);
  };

  /* Pembeli harus masuk sebelum memesan. Tanpa identitas, pesanan tidak bisa
     dikaitkan kepada siapa pun: pembeli tidak dapat melacak miliknya sendiri,
     dan pengrajin tidak tahu pesanan itu untuk siapa. Menjelajah dan menaruh
     kain di keranjang tetap terbuka tanpa masuk. */
  if (!session) {
    return (
      <main className="max-w-lg mx-auto px-4 pt-32 pb-24">
        <div className="bg-white border border-[#767683]/20 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 bg-[#000666] text-white">
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <UserCircle2 className="w-5 h-5 text-[#ffe088]" />
            </div>
            <h1 className="font-serif-garamond text-2xl font-bold">Masuk untuk Memesan</h1>
            <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
              Pesanan perlu terhubung ke sebuah akun supaya Anda bisa melacaknya, dan supaya
              pengrajin tahu kepada siapa kainnya dikirim.
            </p>
          </div>
          <div className="p-6 space-y-3">
            <p className="text-xs text-[#454652] leading-relaxed">
              Isi keranjang Anda tetap tersimpan. Anda hanya perlu masuk sekali, lalu kembali ke
              halaman ini.
            </p>
            <button
              onClick={onOpenAuth}
              className="w-full py-3 bg-[#000666] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#1a237e] transition-colors"
            >
              Masuk sebagai Pembeli
            </button>
            <button
              onClick={() => onNavigateTab('cart')}
              className="w-full py-3 border border-[#767683]/30 text-[#1b1c1a] rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#efeeea] transition-colors"
            >
              Kembali ke Keranjang
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Back button & Header */}
      <div className="mb-8">
        <button
          onClick={() => onNavigateTab('cart')}
          className="text-xs font-bold text-[#a14000] hover:text-[#000666] transition-colors flex items-center gap-1 uppercase tracking-widest mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Keranjang / Back to Cart
        </button>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#767683]/20 pb-6">
          <div>
            <h1 className="font-serif-garamond text-3xl md:text-5xl font-bold text-[#000666]">
              Finalize Your Acquisition
            </h1>
            <p className="text-sm text-[#454652] mt-1 max-w-2xl">
              Lengkapi data di bawah untuk menyelesaikan pesanan. Nama pengrajin dan bukti prosesnya ikut tercatat pada pesanan Anda.
              <br />
              <span className="italic text-xs text-[#a14000] font-medium">
                (Karya warisan autentik yang dikurasi untuk pelestarian. Harap lengkapi detail di bawah untuk mengamankan pesanan Anda.)
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#f5f3ef] px-4 py-2 rounded-full border border-[#767683]/20 text-xs text-[#454652] font-semibold">
            <Lock className="w-3.5 h-3.5 text-[#735c00]" />
            <span>SECURE 256-BIT CHECKOUT</span>
          </div>
        </header>
      </div>

      <form onSubmit={handlePayNow} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Form Sections */}
        <div className="lg:col-span-7 space-y-10">
          {/* Section 1: Shipping Address */}
          <section className="bg-white p-6 md:p-8 rounded-xl border border-[#767683]/20 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#767683]/20 pb-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-[#000666] text-white flex items-center justify-center font-bold text-sm">
                1
              </span>
              <h2 className="font-serif-garamond text-2xl font-bold text-[#000666]">
                Shipping Address <span className="text-[#454652]/60 font-sans text-sm font-normal ml-2">/ Alamat Pengiriman</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#735c00] uppercase tracking-wider mb-1">
                  FULL NAME <span className="opacity-60">/ NAMA LENGKAP</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Raden Mas Sukarno"
                  className="w-full bg-[#fbf9f5] border-0 border-b border-[#767683] focus:ring-0 focus:border-[#000666] py-2 px-1 font-medium transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#735c00] uppercase tracking-wider mb-1">
                  STREET ADDRESS <span className="opacity-60">/ ALAMAT JALAN</span>
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Jl. Diponegoro No. 12, Menteng"
                  className="w-full bg-[#fbf9f5] border-0 border-b border-[#767683] focus:ring-0 focus:border-[#000666] py-2 px-1 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#735c00] uppercase tracking-wider mb-1">
                  CITY <span className="opacity-60">/ KOTA</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Jakarta Pusat"
                  className="w-full bg-[#fbf9f5] border-0 border-b border-[#767683] focus:ring-0 focus:border-[#000666] py-2 px-1 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#735c00] uppercase tracking-wider mb-1">
                  POSTAL CODE <span className="opacity-60">/ KODE POS</span>
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="10310"
                  className="w-full bg-[#fbf9f5] border-0 border-b border-[#767683] focus:ring-0 focus:border-[#000666] py-2 px-1 font-medium transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#735c00] uppercase tracking-wider mb-1">
                  PHONE NUMBER <span className="opacity-60">/ NOMOR TELEPON</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812 3456 7890"
                  className="w-full bg-[#fbf9f5] border-0 border-b border-[#767683] focus:ring-0 focus:border-[#000666] py-2 px-1 font-medium transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Shipping Method */}
          <section className="bg-white p-6 md:p-8 rounded-xl border border-[#767683]/20 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#767683]/20 pb-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-[#000666] text-white flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h2 className="font-serif-garamond text-2xl font-bold text-[#000666]">
                Shipping Method <span className="text-[#454652]/60 font-sans text-sm font-normal ml-2">/ Metode Pengiriman</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                onClick={() => setShippingMethod('standard')}
                className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-[#000666] bg-[#e0e0ff]/30 ring-1 ring-[#000666]'
                    : 'border-[#767683]/30 hover:bg-[#f5f3ef]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-[#000666] text-sm">
                    Standard Courier<br />
                    <span className="text-xs font-normal opacity-70">Kurir Standar</span>
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-[#a14000] text-sm block">Rp 25.000</span>
                    <span className="text-[10px] text-[#454652] opacity-70 font-mono">~$1.60 USD</span>
                  </div>
                </div>
                <p className="text-xs text-[#454652]">3-5 business days. Safe & insured delivery for heritage textiles.</p>
                <p className="text-[11px] italic text-[#454652]/70 mt-1">3-5 hari kerja. Pengiriman aman untuk tekstil warisan.</p>
              </label>

              <label
                onClick={() => setShippingMethod('express')}
                className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'border-[#000666] bg-[#e0e0ff]/30 ring-1 ring-[#000666]'
                    : 'border-[#767683]/30 hover:bg-[#f5f3ef]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-[#000666] text-sm">
                    Express Archive<br />
                    <span className="text-xs font-normal opacity-70">Arsip Kilat</span>
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-[#a14000] text-sm block">Rp 75.000</span>
                    <span className="text-[10px] text-[#454652] opacity-70 font-mono">~$4.80 USD</span>
                  </div>
                </div>
                <p className="text-xs text-[#454652]">Next day delivery. Temperature-controlled handling for fine batik.</p>
                <p className="text-[11px] italic text-[#454652]/70 mt-1">Pengiriman besok sampai. Penanganan khusus batik halus.</p>
              </label>
            </div>
          </section>

          {/* Section 3: Payment Method */}
          <section className="bg-white p-6 md:p-8 rounded-xl border border-[#767683]/20 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#767683]/20 pb-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-[#000666] text-white flex items-center justify-center font-bold text-sm">
                3
              </span>
              <h2 className="font-serif-garamond text-2xl font-bold text-[#000666]">
                Payment Method <span className="text-[#454652]/60 font-sans text-sm font-normal ml-2">/ Metode Pembayaran</span>
              </h2>
            </div>

            <div className="space-y-3">
              {/* Bank Transfer */}
              <label
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all gap-4 ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#000666] bg-[#e0e0ff]/30 ring-1 ring-[#000666]'
                    : 'border-[#767683]/30 hover:bg-[#f5f3ef]'
                }`}
              >
                <Landmark className="w-7 h-7 text-[#000666] shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-[#000666] text-sm">
                    Bank Transfer <span className="font-normal opacity-60 text-xs ml-2">/ Transfer Bank</span>
                  </p>
                  <p className="text-xs text-[#454652]">Verification within 24 hours / Verifikasi manual (BCA, Mandiri, BNI, BRI)</p>
                </div>
                <div className="flex gap-1.5">
                  {['BCA', 'Mandiri', 'BNI'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPaymentMethod('bank_transfer');
                        setSelectedBank(bank);
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-bold border ${
                        selectedBank === bank && paymentMethod === 'bank_transfer'
                          ? 'bg-[#000666] text-white border-[#000666]'
                          : 'bg-[#efeeea] text-[#454652] border-[#767683]/30'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </label>

              {/* Virtual Account / QRIS */}
              <label
                onClick={() => setPaymentMethod('va')}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all gap-4 ${
                  paymentMethod === 'va'
                    ? 'border-[#000666] bg-[#e0e0ff]/30 ring-1 ring-[#000666]'
                    : 'border-[#767683]/30 hover:bg-[#f5f3ef]'
                }`}
              >
                <QrCode className="w-7 h-7 text-[#000666] shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-[#000666] text-sm">
                    Virtual Account / QRIS <span className="font-normal opacity-60 text-xs ml-2">/ Akun Virtual</span>
                  </p>
                  <p className="text-xs text-[#454652]">Instant automated confirmation / Konfirmasi otomatis instan</p>
                </div>
              </label>

              {/* Credit Card */}
              <label
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all gap-4 ${
                  paymentMethod === 'card'
                    ? 'border-[#000666] bg-[#e0e0ff]/30 ring-1 ring-[#000666]'
                    : 'border-[#767683]/30 hover:bg-[#f5f3ef]'
                }`}
              >
                <CreditCard className="w-7 h-7 text-[#000666] shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-[#000666] text-sm">
                    Credit / Debit Card <span className="font-normal opacity-60 text-xs ml-2">/ Kartu Kredit/Debit</span>
                  </p>
                  <p className="text-xs text-[#454652]">Visa, Mastercard, AMEX accepted / Terima Visa, Mastercard, AMEX</p>
                </div>
              </label>

              {/* E-Wallet */}
              <label
                onClick={() => setPaymentMethod('ewallet')}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all gap-4 ${
                  paymentMethod === 'ewallet'
                    ? 'border-[#000666] bg-[#e0e0ff]/30 ring-1 ring-[#000666]'
                    : 'border-[#767683]/30 hover:bg-[#f5f3ef]'
                }`}
              >
                <Smartphone className="w-7 h-7 text-[#000666] shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-[#000666] text-sm">
                    E-Wallet <span className="font-normal opacity-60 text-xs ml-2">/ ShopeePay, GoPay, OVO, DANA</span>
                  </p>
                  <p className="text-xs text-[#454652]">Direct mobile app payment integration</p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Order Preview Sidebar */}
        <aside className="lg:col-span-5">
          <div className="bg-[#f5f3ef] p-6 md:p-8 border border-[#767683]/30 rounded-2xl sticky top-28 shadow-sm">
            <h3 className="font-serif-garamond text-2xl font-bold text-[#000666] mb-6">
              Order Preview <span className="text-[#454652]/60 font-sans text-sm font-normal ml-2">/ Pratinjau Pesanan</span>
            </h3>

            {/* Cart Items List Preview */}
            <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-[#767683]/20 last:border-0">
                  <div className="w-16 h-16 bg-[#e4e2de] shrink-0 rounded-lg overflow-hidden border border-[#767683]/20">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-xs">
                    <h4 className="font-bold text-[#000666] text-sm leading-tight">{item.name}</h4>
                    <p className="text-[#735c00] font-medium mt-0.5">{item.fabricType} ({item.quantity}x)</p>
                    <div className="mt-1 font-bold text-[#a14000]">
                      {formatPrice(item.priceIDR * item.quantity, currency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-3 border-t border-[#767683]/30 pt-4 mb-6 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-[#454652]">Subtotal</span>
                <div className="text-right">
                  <p className="font-bold text-[#1b1c1a]">{formatPrice(subtotalIDR, currency)}</p>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-[#454652]">Heritage Shipping ({shippingMethod === 'express' ? 'Kilat' : 'Standar'})</span>
                <div className="text-right">
                  <p className="font-bold text-[#1b1c1a]">{formatPrice(shippingCostIDR, currency)}</p>
                </div>
              </div>

              {discountIDR > 0 && (
                <div className="flex justify-between items-start text-[#a14000]">
                  <span>Member Discount</span>
                  <div className="text-right">
                    <p className="font-bold">- {formatPrice(discountIDR, currency)}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start">
                <span className="text-[#454652]">Preservation Tax (11%)</span>
                <div className="text-right">
                  <p className="font-bold text-[#1b1c1a]">{formatPrice(taxIDR, currency)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#000666]/20">
                <span className="font-serif-garamond text-xl font-bold text-[#000666]">Total</span>
                <div className="text-right">
                  <span className="font-serif-garamond text-2xl font-bold text-[#a14000]">
                    {formatPrice(totalIDR, currency)}
                  </span>
                  <p className="text-[11px] font-bold text-[#454652] opacity-75 font-sans">
                    {formatPriceSecondary(totalIDR, currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#000666] text-white py-4 rounded-xl font-bold text-base hover:bg-[#1a237e] transition-all transform active:scale-95 shadow-lg shadow-[#000666]/20 mb-6 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  Bayar Sekarang <span className="font-normal opacity-70 text-xs ml-1">/ Pay Now</span>
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#735c00]/20">
                <Award className="w-6 h-6 text-[#735c00] shrink-0" />
                <div>
                  <p className="uppercase font-bold text-[#735c00] tracking-wider text-[10px]">
                    UNESCO Authenticity <span className="font-normal opacity-70 text-[9px] ml-1">/ Keaslian UNESCO</span>
                  </p>
                  <p className="text-[#454652]">Guaranteed Intangible Heritage Certificate</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#000666]/20">
                <ShieldCheck className="w-6 h-6 text-[#000666] shrink-0" />
                <div>
                  <p className="uppercase font-bold text-[#000666] tracking-wider text-[10px]">
                    Secure Transaction <span className="font-normal opacity-70 text-[9px] ml-1">/ Transaksi Aman</span>
                  </p>
                  <p className="text-[#454652]">256-bit Encrypted Connection & Escrow Guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </main>
  );
};
