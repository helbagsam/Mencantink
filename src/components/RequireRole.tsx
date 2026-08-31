import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Role } from '../services/sessionService';
import { useSession } from '../hooks/useSession';
import { ROUTES } from '../routes';

interface RequireRoleProps {
  /** Peran yang boleh membuka halaman ini. */
  allow: Role[];
  /** Keterangan singkat kenapa halaman ini tertutup. */
  reason: string;
  onOpenAuth: () => void;
  children: React.ReactNode;
}

/**
 * GERBANG HALAMAN TERTUTUP.
 *
 * Sebelum ini /portal terbuka untuk siapa pun, termasuk daftar pesanan yang
 * memuat nama dan kota pembeli. Pengunjung biasa tidak punya alasan sah untuk
 * melihat data pribadi pembeli orang lain, dan UU PDP No. 27 Tahun 2022
 * mensyaratkan pemrosesan data pribadi punya dasar dan tujuan yang jelas.
 *
 * Catatan penting: gerbang ini hanya menyembunyikan tampilan, bukan mengamankan
 * data — datanya masih ada di peramban. Pengamanan sesungguhnya baru ada
 * setelah data pindah ke server dengan pemeriksaan hak akses per permintaan.
 */
export const RequireRole: React.FC<RequireRoleProps> = ({
  allow,
  reason,
  onOpenAuth,
  children,
}) => {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center gap-2 text-sm text-[#767683]">
        <Loader2 className="w-5 h-5 animate-spin" />
        Memeriksa akses...
      </div>
    );
  }

  if (session && allow.includes(session.role)) {
    return <>{children}</>;
  }

  const sudahMasukTapiSalahPeran = Boolean(session);

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-lg mx-auto bg-white border border-[#767683]/20 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 bg-[#000666] text-white">
          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-[#ffe088]" />
          </div>
          <h1 className="font-serif-garamond text-2xl font-bold">
            {sudahMasukTapiSalahPeran ? 'Halaman ini bukan untuk peran Anda' : 'Khusus Pengguna Terdaftar'}
          </h1>
          <p className="text-xs text-white/80 mt-1.5 leading-relaxed">{reason}</p>
        </div>

        <div className="p-6 space-y-4">
          {sudahMasukTapiSalahPeran ? (
            <p className="text-xs text-[#454652] leading-relaxed">
              Anda masuk sebagai <strong>{session?.displayName}</strong> (
              {session?.role === 'artisan' ? 'pengrajin' : 'verifikator'}). Halaman ini hanya
              terbuka untuk{' '}
              {allow.map((r) => (r === 'artisan' ? 'pengrajin' : 'verifikator')).join(' dan ')}.
            </p>
          ) : (
            <p className="text-xs text-[#454652] leading-relaxed">
              Portal ini memuat data pesanan berikut nama dan kota pembeli. Data pribadi pembeli
              tidak ditampilkan kepada pengunjung umum, sesuai UU Pelindungan Data Pribadi No. 27
              Tahun 2022.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onOpenAuth}
              className="flex-1 py-3 px-4 bg-[#000666] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#1a237e] transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#ffe088]" />
              {sudahMasukTapiSalahPeran ? 'Ganti Akun' : 'Masuk sebagai Pengrajin'}
            </button>
            <Link
              to={ROUTES.home}
              className="py-3 px-4 border border-[#767683]/30 text-[#1b1c1a] rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#efeeea] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Beranda
            </Link>
          </div>

          <p className="text-[11px] text-[#767683] leading-relaxed pt-3 border-t border-[#767683]/15">
            Sekadar ingin melihat karya dan sertifikat pengrajin? Halaman{' '}
            <Link to={ROUTES.artisans} className="text-[#a14000] font-semibold hover:underline">
              Daftar Pengrajin
            </Link>{' '}
            terbuka untuk umum dan memang dirancang untuk itu.
          </p>
        </div>
      </div>
    </div>
  );
};
