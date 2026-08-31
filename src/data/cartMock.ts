import { CartItem, Order } from '../types';
import { IMG } from '../assets/images';

/**
 * Isi keranjang dan pesanan contoh untuk peragaan.
 *
 * Berkas ini sebelumnya bertentangan dengan katalog di beberapa titik, dan
 * justru pada hal yang paling tidak boleh keliru di produk ini:
 *
 *   - Parang Rusak diatribusikan ke "Ibu Siti Rohmah" dan Mega Mendung ke
 *     "Pak Wijaya", dua nama yang tidak ada di daftar pengrajin mana pun.
 *     Pada platform yang seluruh alasan keberadaannya adalah supaya nama
 *     pembuat tidak hilang, salah atribusi adalah kesalahan paling merusak.
 *   - Mega Mendung tercatat teknik Cap di sini tetapi Tulis di katalog.
 *   - Daerahnya tertulis Pekalongan, padahal Mega Mendung dari Cirebon.
 *   - Pesanan contoh berpajak Rp 0, padahal checkout menerapkan PPN 11%,
 *     sehingga totalnya tidak mungkin dihasilkan alur checkout aplikasi ini.
 *
 * Semuanya kini disamakan dengan katalog dan daftar pengrajin.
 */

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'cart-1',
    name: 'Parang Rusak Barong',
    motifId: 'parang-rusak',
    technique: 'Tulis',
    fabricType: 'Sutra Primissima',
    priceIDR: 1250000,
    quantity: 1,
    imageUrl: IMG['motif-truntum'],
    artisanName: 'Mpu Harjo',
    region: 'Surakarta / Solo',
  },
  {
    id: 'cart-2',
    name: 'Mega Mendung Pesisir Cirebon',
    motifId: 'mega-mendung',
    technique: 'Tulis',
    fabricType: 'Katun Primissima',
    priceIDR: 750000,
    quantity: 1,
    imageUrl: IMG['motif-mega-mendung'],
    artisanName: 'Siti Rahmawati',
    region: 'Cirebon',
  },
];

/* Angka pesanan contoh dihitung dengan rumus yang sama persis dengan
   CheckoutView: subtotal + ongkir + PPN 11% dari (subtotal - diskon). */
const CONTOH_SUBTOTAL = 1250000;
const CONTOH_ONGKIR = 25000;
const CONTOH_PAJAK = Math.round(CONTOH_SUBTOTAL * 0.11);

export const INITIAL_ORDER_SAMPLE: Order = {
  id: 'BTK-8829104',
  createdAt: '12 Agustus 2026 • 09.42 WIB',
  items: [
    {
      id: 'item-demo-1',
      name: 'Parang Rusak Barong',
      motifId: 'parang-rusak',
      technique: 'Tulis',
      fabricType: 'Sutra Primissima',
      priceIDR: CONTOH_SUBTOTAL,
      quantity: 1,
      imageUrl: IMG['item-demo-1'],
      artisanName: 'Mpu Harjo',
      region: 'Surakarta / Solo',
    },
  ],
  subtotalIDR: CONTOH_SUBTOTAL,
  shippingCostIDR: CONTOH_ONGKIR,
  taxIDR: CONTOH_PAJAK,
  discountIDR: 0,
  totalIDR: CONTOH_SUBTOTAL + CONTOH_ONGKIR + CONTOH_PAJAK,
  shippingAddress: {
    fullName: 'Raden Mas Sukarno',
    address: 'Jl. Diponegoro No. 12, Menteng',
    city: 'Jakarta Pusat',
    postalCode: '10310',
    phone: '+62 812 3456 7890',
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
      timestamp: '14 Agustus 2026 • 14.22 WIB',
      description: 'Semarang Regional Logistics Hub - processing for final delivery route.',
      descriptionId: 'Hub Logistik Regional Semarang — pemrosesan rute pengiriman akhir.',
      completed: true,
    },
    {
      id: 'tl-2',
      title: 'Handed Over to Courier',
      titleId: 'Diserahkan ke Kurir',
      timestamp: '13 Agustus 2026 • 10.30 WIB',
      description: 'Package collected by Nusantara Express. Tracking ID: NX-9920331-BTK.',
      descriptionId: 'Paket diambil oleh Nusantara Express. Nomor resi: NX-9920331-BTK.',
      completed: true,
    },
    {
      id: 'tl-3',
      title: 'Cloth Inspection Completed',
      titleId: 'Pemeriksaan Kain Selesai',
      timestamp: '13 Agustus 2026 • 16.45 WIB',
      // Sebelumnya tertulis pengrajin "menyertifikasi" kainnya sendiri.
      // Pengrajin tidak boleh menjadi penilai keasliannya sendiri — itu
      // meniadakan seluruh gunanya verifikasi.
      description:
        'Cloth condition checked against the verified proof pack before dispatch by Sanggar Keraton.',
      descriptionId:
        'Kondisi kain dicocokkan dengan paket bukti yang telah ditinjau sebelum dikirim oleh Sanggar Keraton.',
      completed: true,
    },
    {
      id: 'tl-4',
      title: 'Order Placed & Payment Confirmed',
      titleId: 'Pesanan Dibuat & Pembayaran Dikonfirmasi',
      timestamp: '12 Agustus 2026 • 09.42 WIB',
      description: 'Payment confirmed via Bank Transfer BCA.',
      descriptionId: 'Pembayaran dikonfirmasi melalui Transfer Bank BCA.',
      completed: true,
    },
  ],
};
