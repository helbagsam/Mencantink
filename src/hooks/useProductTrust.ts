import { useEffect, useState } from 'react';
import { ProductTrustSummary, getProductTrust } from '../services/trustService';

/**
 * Membaca status kepercayaan sebuah kain.
 *
 * Dipakai bersama oleh panel bukti dan tombol beli supaya keduanya tidak
 * mungkin berbeda pendapat: mustahil ada keadaan di mana panel menyatakan
 * bukti belum ditinjau sementara tombol belinya tetap menyala.
 */
export function useProductTrust(
  productId: string | undefined,
  fallbackArtisanId?: string,
): { trust: ProductTrustSummary | null; loading: boolean; reload: () => void } {
  const [trust, setTrust] = useState<ProductTrustSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!productId) {
      setTrust(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getProductTrust(productId, fallbackArtisanId).then((hasil) => {
      if (cancelled) return;
      setTrust(hasil);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [productId, fallbackArtisanId, nonce]);

  return { trust, loading, reload: () => setNonce((n) => n + 1) };
}
