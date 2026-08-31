/**
 * Kurs acuan rupiah ke dolar AS.
 *
 * Ditulis tetap dan sengaja disebut sebagai perkiraan. Sebelumnya ada dua
 * angka berbeda di dalam aplikasi ini — 15.600 di berkas ini dan 15.500 di
 * halaman Pasar Nusantara — sehingga kain yang sama menampilkan harga dolar
 * yang berbeda tergantung halaman mana yang dibuka pembeli.
 *
 * Untuk transaksi sungguhan, kurs harus diambil dari sumber resmi saat
 * pembayaran dibuat dan dikunci pada pesanan, bukan dihitung ulang di layar.
 */
export const IDR_PER_USD = 15600;

export function formatPrice(amountInIDR: number, currency: 'IDR' | 'USD' = 'IDR'): string {
  if (currency === 'USD') {
    const usdValue = amountInIDR / IDR_PER_USD;
    return `$ ${usdValue.toFixed(2)} USD`;
  }
  return `Rp ${amountInIDR.toLocaleString('id-ID')}`;
}

export function formatPriceSecondary(amountInIDR: number, currency: 'IDR' | 'USD' = 'IDR'): string {
  if (currency === 'USD') {
    return `Rp ${amountInIDR.toLocaleString('id-ID')}`;
  }
  const usdValue = amountInIDR / IDR_PER_USD;
  return `~$${usdValue.toFixed(2)} USD`;
}
