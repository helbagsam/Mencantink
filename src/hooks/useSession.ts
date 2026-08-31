import { useEffect, useState } from 'react';
import { Session, getSession, onSessionChange } from '../services/sessionService';

/**
 * Membaca sesi yang sedang aktif dan ikut berubah ketika pengguna masuk
 * atau keluar, tanpa perlu memuat ulang halaman.
 */
export function useSession(): { session: Session | null; loading: boolean } {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const muat = async () => {
      const s = await getSession();
      if (!cancelled) {
        setSession(s);
        setLoading(false);
      }
    };

    void muat();
    const lepas = onSessionChange(() => void muat());

    return () => {
      cancelled = true;
      lepas();
    };
  }, []);

  return { session, loading };
}
