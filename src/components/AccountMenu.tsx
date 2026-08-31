import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Gavel, LogOut, Truck, UserCheck, UserCircle2, Users } from 'lucide-react';
import { ROLE_LABEL, signOut } from '../services/sessionService';
import { useSession } from '../hooks/useSession';
import { ROUTES } from '../routes';

interface AccountMenuProps {
  onOpenAuth: () => void;
}

/** Inisial nama, dipakai sebagai avatar sederhana. */
function inisial(nama: string): string {
  return nama
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase();
}

/**
 * MENU AKUN.
 *
 * Sebelumnya navigasi hanya punya tombol "Masuk" yang tidak berubah apa pun
 * setelah pengguna masuk: tidak ada tanda sedang masuk sebagai siapa, tidak
 * ada cara keluar selain membuka kembali layar masuk, dan tidak ada petunjuk
 * halaman mana yang terbuka untuk peran yang dimiliki.
 *
 * Menu ini menampilkan identitas dan peran yang sedang dipakai, lalu hanya
 * menawarkan halaman yang memang boleh dibuka peran tersebut.
 */
export const AccountMenu: React.FC<AccountMenuProps> = ({ onOpenAuth }) => {
  const { session } = useSession();
  const [terbuka, setTerbuka] = useState(false);
  const wadah = useRef<HTMLDivElement>(null);

  /* Menutup menu saat mengeklik di luar atau menekan Escape. */
  useEffect(() => {
    if (!terbuka) return;

    const klikLuar = (e: MouseEvent) => {
      if (wadah.current && !wadah.current.contains(e.target as Node)) setTerbuka(false);
    };
    const tekanEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTerbuka(false);
    };

    document.addEventListener('mousedown', klikLuar);
    document.addEventListener('keydown', tekanEsc);
    return () => {
      document.removeEventListener('mousedown', klikLuar);
      document.removeEventListener('keydown', tekanEsc);
    };
  }, [terbuka]);

  if (!session) {
    return (
      <button
        onClick={onOpenAuth}
        className="flex items-center gap-1.5 border border-[#a14000] text-[#a14000] px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-[#a14000] hover:text-white transition-all shadow-sm whitespace-nowrap shrink-0"
      >
        <UserCircle2 className="w-4 h-4" />
        <span className="hidden sm:inline">Masuk</span>
      </button>
    );
  }

  const punya = (r: 'artisan' | 'verifier') => session.roles.includes(r);

  return (
    <div className="relative shrink-0" ref={wadah}>
      <button
        onClick={() => setTerbuka((v) => !v)}
        aria-expanded={terbuka}
        aria-haspopup="menu"
        className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border transition-all ${
          terbuka
            ? 'bg-[#000666] border-[#000666] text-white'
            : 'bg-white border-[#767683]/30 text-[#1b1c1a] hover:border-[#000666]/50'
        }`}
        title={`Masuk sebagai ${session.displayName}`}
      >
        <span className="w-7 h-7 rounded-full bg-[#a14000] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
          {inisial(session.displayName)}
        </span>
        <span className="hidden md:inline text-[11px] font-bold max-w-[110px] truncate">
          {session.displayName.split(' ')[0]}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform ${terbuka ? 'rotate-180' : ''}`}
        />
      </button>

      {terbuka && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#767683]/25 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in"
        >
          {/* Identitas */}
          <div className="px-4 py-3 bg-[#f5f3ef] border-b border-[#767683]/15">
            <p className="text-sm font-bold text-[#000666] leading-tight">{session.displayName}</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {session.roles.map((r) => (
                <span
                  key={r}
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#000666]/10 text-[#000666]"
                >
                  {ROLE_LABEL[r]}
                </span>
              ))}
            </div>
          </div>

          {/* Halaman yang boleh dibuka peran ini */}
          <nav className="py-1.5">
            <Link
              to={ROUTES.orders}
              onClick={() => setTerbuka(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#454652] hover:bg-[#efeeea] hover:text-[#000666] transition-colors"
            >
              <Truck className="w-4 h-4 shrink-0 text-[#a14000]" />
              Pesanan Saya
            </Link>

            {punya('artisan') && (
              <Link
                to={ROUTES.portal}
                onClick={() => setTerbuka(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#454652] hover:bg-[#efeeea] hover:text-[#000666] transition-colors"
              >
                <UserCheck className="w-4 h-4 shrink-0 text-[#a14000]" />
                Portal Pengrajin
              </Link>
            )}

            {punya('verifier') && (
              <Link
                to={ROUTES.verification}
                onClick={() => setTerbuka(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#454652] hover:bg-[#efeeea] hover:text-[#000666] transition-colors"
              >
                <Gavel className="w-4 h-4 shrink-0 text-[#a14000]" />
                Ruang Verifikasi
              </Link>
            )}

            <button
              onClick={() => {
                setTerbuka(false);
                onOpenAuth();
              }}
              className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#454652] hover:bg-[#efeeea] hover:text-[#000666] transition-colors"
            >
              <Users className="w-4 h-4 shrink-0 text-[#a14000]" />
              Ganti Akun
            </button>
          </nav>

          <div className="border-t border-[#767683]/15">
            <button
              onClick={async () => {
                setTerbuka(false);
                await signOut();
              }}
              className="w-full text-left flex items-center gap-2.5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#9f1239] hover:bg-[#ffe4e6] transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
