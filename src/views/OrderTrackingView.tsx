import React, { useState } from 'react';
import { Currency, NavTab, Order } from '../types';
import { formatPrice, formatPriceSecondary } from '../utils/currency';
import { Truck, CheckCircle2, Clock, MapPin, Phone, Mail, ArrowRight, BookOpen, RefreshCw } from 'lucide-react';

interface OrderTrackingViewProps {
  activeOrder: Order | null;
  currency: Currency;
  onNavigateTab: (tab: NavTab) => void;
  onUpdateOrderStatus?: (orderId: string, nextStatus: Order['status']) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  activeOrder,
  currency,
  onNavigateTab,
  onUpdateOrderStatus,
}) => {
  if (!activeOrder) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-center">
        <div className="bg-white border border-[#767683]/20 rounded-2xl p-12 max-w-lg mx-auto shadow-sm">
          <Truck className="w-12 h-12 text-[#a14000] mx-auto mb-4" />
          <h2 className="font-serif-garamond text-2xl font-bold text-[#000666] mb-2">
            Belum Ada Pesanan Aktif
          </h2>
          <p className="text-sm text-[#454652] mb-6">
            Anda belum melakukan transaksi. Silakan pilih kain batik dari katalog dan lakukan checkout untuk melacak status pesanan secara real-time.
          </p>
          <button
            onClick={() => onNavigateTab('catalog')}
            className="bg-[#000666] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#1a237e] transition-colors"
          >
            Lihat Katalog / Go to Catalog
          </button>
        </div>
      </main>
    );
  }

  const steps = [
    { key: 'placed', title: 'Order Placed', titleId: 'Pesanan Dibuat' },
    { key: 'crafting', title: 'Being Crafted', titleId: 'Sedang Dikerjakan' },
    { key: 'shipped', title: 'Shipped', titleId: 'Dikirim' },
    { key: 'delivered', title: 'Delivered', titleId: 'Sampai' },
  ];

  const getStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'placed': return 0;
      case 'crafting': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(activeOrder.status);

  const handleAdvanceStep = () => {
    if (!onUpdateOrderStatus) return;
    const orderStatuses: Order['status'][] = ['placed', 'crafting', 'shipped', 'delivered'];
    const nextIdx = Math.min(currentIndex + 1, orderStatuses.length - 1);
    onUpdateOrderStatus(activeOrder.id, orderStatuses[nextIdx]);
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Order Header */}
      <div className="mb-12 border-l-4 border-[#a14000] pl-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 mb-1">
          <p className="text-xs font-bold text-[#a14000] uppercase tracking-widest">Current Order Status</p>
          <span className="hidden sm:inline text-[#767683]">|</span>
          <p className="text-xs font-bold text-[#a14000] uppercase tracking-widest italic">Status Pesanan Saat Ini</p>
        </div>
        <h1 className="font-serif-garamond text-3xl md:text-5xl font-bold text-[#000666]">
          Order #{activeOrder.id}
        </h1>
        <p className="text-sm text-[#454652] opacity-80 mt-1">
          Placed on {activeOrder.createdAt}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tracking & Timeline */}
        <div className="lg:col-span-8 space-y-10">
          {/* Visual Progress Card */}
          <div className="bg-[#f5f3ef] p-6 md:p-8 rounded-xl border border-[#767683]/20 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-serif-garamond text-2xl font-bold text-[#000666]">Tracking Progress</h3>
                <p className="text-xs text-[#000666] opacity-70 uppercase tracking-widest italic">Perkembangan Pengiriman</p>
              </div>
              <button
                onClick={handleAdvanceStep}
                disabled={currentIndex === 3}
                className="bg-[#000666] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full hover:bg-[#1a237e] transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Advance Step (Simulasi)
              </button>
            </div>

            {/* Step Progress Line */}
            <div className="relative pt-4 pb-10">
              <div className="absolute top-[27px] left-0 w-full h-[2px] bg-[#c6c5d4]" />
              <div
                className="absolute top-[27px] left-0 h-[2px] bg-[#cba72f] transition-all duration-500"
                style={{ width: `${(currentIndex / 3) * 100}%` }}
              />

              <div className="relative flex justify-between">
                {steps.map((step, idx) => {
                  const isDone = idx <= currentIndex;
                  const isCurrent = idx === currentIndex;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center w-1/4">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mb-3 z-10 transition-all ${
                          isDone
                            ? 'bg-[#000666] text-white'
                            : 'bg-[#c6c5d4] text-white'
                        } ${isCurrent ? 'ring-4 ring-[#ffe088] animate-pulse' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <p className={`text-xs font-bold ${isDone ? 'text-[#000666]' : 'text-[#767683]'}`}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-[#454652] opacity-70 italic">{step.titleId}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Currently in Transit banner */}
            <div className="mt-2 p-4 bg-white rounded-lg border border-[#cba72f]/30 flex items-start gap-4">
              <Truck className="w-6 h-6 text-[#735c00] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
                  Status: {activeOrder.status === 'delivered' ? 'Selesai / Delivered' : 'In Transit / Dalam Perjalanan'}
                </p>
                <p className="text-xs text-[#454652] mt-1">
                  Package tracked with Courier ID: <span className="font-mono font-bold text-[#000666]">{activeOrder.trackingId}</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Timeline List */}
          <div className="bg-white p-6 md:p-8 rounded-xl border border-[#767683]/20 shadow-sm">
            <h3 className="font-serif-garamond text-2xl font-bold text-[#000666] mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#a14000]" /> Order Timeline / <span className="italic font-normal opacity-60 text-base">Linimasa Pesanan</span>
            </h3>

            <div className="space-y-6 relative border-l-2 border-[#c6c5d4] ml-3 pl-6">
              {activeOrder.timeline.map((item) => (
                <div key={item.id} className="relative">
                  <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ${item.completed ? 'bg-[#000666]' : 'bg-[#c6c5d4]'}`} />
                  <p className="text-xs font-bold text-[#000666] mb-0.5">
                    {item.title} / <span className="italic font-normal text-[#454652]">{item.titleId}</span>
                  </p>
                  <p className="text-[11px] text-[#767683] font-medium">{item.timestamp}</p>
                  <p className="text-xs text-[#1b1c1a] mt-1">{item.description}</p>
                  <p className="text-[11px] italic text-[#454652] mt-0.5">{item.descriptionId}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Heritage Story & Support */}
        <div className="lg:col-span-4 space-y-6">
          {/* Heritage Story Card */}
          <div className="bg-[#000666] text-white rounded-xl overflow-hidden shadow-sm flex flex-col p-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ffe088] uppercase tracking-wider mb-3">
              <BookOpen className="w-4 h-4" /> The Heritage Story / Cerita Warisan
            </div>
            <h4 className="font-serif-garamond text-2xl font-bold text-white mb-2">
              Sido Mukti & Parang Heritage
            </h4>
            <p className="text-xs text-[#e0e0ff] leading-relaxed mb-3">
              The Parang and Sido Mukti motifs, traditionally worn by nobility and bridegrooms, symbolize a lifelong journey of noble status, resilience, and enduring wisdom.
            </p>
            <p className="text-[11px] italic text-white/70 leading-relaxed border-l border-white/20 pl-3">
              Melambangkan harapan akan kehidupan yang penuh kemakmuran, kebahagiaan, dan derajat yang mulia bagi pemiliknya.
            </p>
          </div>

          {/* Support Contact Card */}
          <div className="bg-[#f5f3ef] border border-[#767683]/20 p-6 rounded-xl space-y-4">
            <h4 className="font-serif-garamond text-xl font-bold text-[#000666]">
              Need Assistance? / <span className="italic font-normal text-xs opacity-60">Butuh Bantuan?</span>
            </h4>
            <p className="text-xs text-[#454652]">Our heritage consultants are available to assist with your order.</p>

            <div className="space-y-2 text-xs">
              <a
                href="tel:+62215550123"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#767683]/20 hover:border-[#000666] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#a14000]" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#767683]">Call Center</p>
                  <p className="font-bold text-[#000666]">+62 (21) 555-0123</p>
                </div>
              </a>

              <a
                href="mailto:support@batikassociation.id"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#767683]/20 hover:border-[#000666] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#a14000]" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#767683]">Email Support</p>
                  <p className="font-bold text-[#000666]">concierge@batikassociation.id</p>
                </div>
              </a>
            </div>
          </div>

          {/* Order Summary Mini */}
          <div className="bg-white p-6 rounded-xl border border-[#767683]/20 space-y-3 text-xs">
            <h4 className="font-bold text-[#767683] uppercase tracking-widest text-[10px]">Order Summary</h4>
            <div className="flex justify-between">
              <span className="text-[#454652]">Subtotal</span>
              <span className="font-bold text-[#000666]">{formatPrice(activeOrder.subtotalIDR, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#454652]">Shipping</span>
              <span className="font-bold text-[#000666]">{formatPrice(activeOrder.shippingCostIDR, currency)}</span>
            </div>
            <div className="border-t border-[#767683]/20 pt-2 flex justify-between items-center text-sm">
              <span className="font-bold text-[#000666]">Total Paid</span>
              <div className="text-right">
                <p className="font-serif-garamond text-xl font-bold text-[#a14000]">
                  {formatPrice(activeOrder.totalIDR, currency)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
