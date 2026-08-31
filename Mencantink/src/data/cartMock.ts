import { CartItem, Order } from '../types';

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'cart-1',
    name: 'Parang Kencana Indigo',
    motifId: 'parang-rusak',
    technique: 'Tulis',
    fabricType: 'Premium Silk',
    priceIDR: 1250000,
    quantity: 1,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs8fOe-Y-qpYnkUZT-q0e3Y1Rg7JKffw6-_Q1nXZJdjgFiqUgKPINrtbLKqIxnl1j9ZGF9mkCYYQyo1SVwgU9ksHT14x8-fXxlRs-PEDumB_kpygaN3IyLbCHJKJHZW1VdEjN4E9mXsYsrY2Mqxptrrbjx13VCkKFps7KKASCy8ToyKWaNuGjSB_Elx51M6AoCJeWPdE_UGEtmmIP4SlEQppcQYelk467IrShQLwniAQbj2NQy2bn3fw',
    artisanName: 'Ibu Siti Rohmah',
    region: 'Solo'
  },
  {
    id: 'cart-2',
    name: 'Megamendung Sunset',
    motifId: 'mega-mendung',
    technique: 'Cap',
    fabricType: 'Cotton Primissima',
    priceIDR: 650000,
    quantity: 1,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Dkmeau9t5BUIE8VU-Pi7PoiCysi07pJe7OxQ1WkAgxLuomtVIEaOXyV6XiYWpN0lZ_9KlaqqtFOHPIQMTfVuqkTXloT9QKieXIEW-CGGrfuDJ9PtWa7OYkFSPNpVdoyNE7KXX6Z5bVZDjuFVOfqlYMtDxs3Myi3R_3EaBOzP0azwbHjNXMLJrqI-VArhvH8sRzhC4-ASxjwwcW8ZNeJjlLMi1jfsckF-fFudwjAUP6xdsyrdHmcWXQ',
    artisanName: 'Pak Wijaya',
    region: 'Pekalongan'
  }
];

export const INITIAL_ORDER_SAMPLE: Order = {
  id: 'BTK-8829104',
  createdAt: 'October 28, 2024 • 09:42 AM WIB',
  items: [
    {
      id: 'item-demo-1',
      name: 'Hand-Drawn Batik Tulis - Royal Parang Motif',
      technique: 'Tulis',
      fabricType: 'Limited Edition Series',
      priceIDR: 1250000,
      quantity: 1,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC05gZsDpc1I5bKFYwySIHoPVfGWMYQLLKU6B05xZdMuRXGYL2PMD2Q5Nren_GPhW4XWC9bqrcCQ37lmg-iYDniiVlb6f0bXThICp53KPeThEH6Z_EmQhquHwYSdK9c4z72NbQbgcUe1Wzw7r156uO7h4bZvFyLHIT-fg_MogJbgSf6TUw-jxzhNSi2j7G8TdSh4FHpqxa40bTV6Dn1KiyH6c2ueH0IxcVSGrLmoxUpgCXBPxT0M62fyQ',
      artisanName: 'Ibu Wahyu',
      region: 'Surakarta'
    }
  ],
  subtotalIDR: 1250000,
  shippingCostIDR: 45000,
  taxIDR: 0,
  discountIDR: 0,
  totalIDR: 1295000,
  shippingAddress: {
    fullName: 'Raden Mas Sukarno',
    address: 'Jl. Diponegoro No. 12, Menteng',
    city: 'Jakarta Pusat',
    postalCode: '10310',
    phone: '+62 812 3456 7890'
  },
  shippingMethod: 'standard',
  paymentMethod: 'bank_transfer',
  paymentBank: 'BCA',
  status: 'shipped',
  trackingId: 'NX-9920331-BTK',
  timeline: [
    {
      id: 'tl-1',
      title: 'Package Arrived at Sorting Facility',
      titleId: 'Paket Tiba di Fasilitas Sortir',
      timestamp: 'October 28, 2024 • 14:22 PM',
      description: 'Semarang Regional Logistics Hub - Processing for final delivery route.',
      descriptionId: 'Hub Logistik Regional Semarang - Proses rute pengiriman akhir.',
      completed: true
    },
    {
      id: 'tl-2',
      title: 'Handed Over to Courier',
      titleId: 'Diserahkan ke Kurir',
      timestamp: 'October 28, 2024 • 10:30 AM',
      description: 'Package collected by Nusantara Express. Tracking ID: NX-9920331-BTK.',
      descriptionId: 'Paket diambil oleh Nusantara Express. ID Pelacakan: NX-9920331-BTK.',
      completed: true
    },
    {
      id: 'tl-3',
      title: 'Quality Inspection Completed',
      titleId: 'Pemeriksaan Kualitas Selesai',
      timestamp: 'October 26, 2024 • 16:45 PM',
      description: 'Master Artisan Bu Wahyu certified the wax-resist pattern integrity and dye consistency.',
      descriptionId: 'Master Artisan Bu Wahyu telah menyertifikasi integritas pola malam dan konsistensi pewarna.',
      completed: true
    },
    {
      id: 'tl-4',
      title: 'Order Placed & Verified',
      titleId: 'Pesanan Dibuat & Diverifikasi',
      timestamp: 'October 24, 2024 • 09:42 AM',
      description: 'Payment confirmed via Bank Transfer BCA.',
      descriptionId: 'Pembayaran dikonfirmasi melalui Transfer Bank BCA.',
      completed: true
    }
  ]
};
