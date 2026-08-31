import { CartItem, Order } from '../types';
import { IMG } from '../assets/images';

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'cart-1',
    name: 'Parang Kencana Indigo',
    motifId: 'parang-rusak',
    technique: 'Tulis',
    fabricType: 'Premium Silk',
    priceIDR: 1250000,
    quantity: 1,
    imageUrl: IMG['cart-1'],
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
    imageUrl: IMG['cart-2'],
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
      imageUrl: IMG['item-demo-1'],
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
