export function formatPrice(amountInIDR: number, currency: 'IDR' | 'USD' = 'IDR'): string {
  if (currency === 'USD') {
    const usdValue = amountInIDR / 15600;
    return `$ ${usdValue.toFixed(2)} USD`;
  }
  return `Rp ${amountInIDR.toLocaleString('id-ID')}`;
}

export function formatPriceSecondary(amountInIDR: number, currency: 'IDR' | 'USD' = 'IDR'): string {
  if (currency === 'USD') {
    return `Rp ${amountInIDR.toLocaleString('id-ID')}`;
  }
  const usdValue = amountInIDR / 15600;
  return `~$${usdValue.toFixed(2)} USD`;
}
