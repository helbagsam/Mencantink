import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Truck, Globe, UserCheck } from 'lucide-react';
import { Currency } from '../types';
import { PRIMARY_NAV, ROUTES } from '../routes';
import { BatikLogo } from './BatikLogo';
import { useSession } from '../hooks/useSession';

interface NavigationProps {
  onOpenAuth: () => void;
  cartCount?: number;
  currency?: Currency;
  onCurrencyChange?: (c: Currency) => void;
}

/**
 * Navigasi utama.
 *
 * Sebelumnya ada dua belas tab, dua di antaranya menampilkan halaman yang sama
 * persis dan satu tidak bisa diakses sama sekali. Padahal syarat yang diminta
 * adalah sistem sesederhana mungkin, terutama bagi pengrajin UMKM.
 *
 * Sekarang tinggal lima tautan utama. Keranjang, pesanan, dan portal pengrajin
 * dipindah ke sisi kanan sebagai perkakas, bukan tujuan penjelajahan. Halaman
 * Pengrajin justru dinaikkan menjadi tautan utama karena di situlah inti
 * gagasan produk ini.
 */
export const Navigation: React.FC<NavigationProps> = ({
  onOpenAuth,
  cartCount = 0,
  currency = 'IDR',
  onCurrencyChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { session } = useSession();

  const isPortal = location.pathname.startsWith(ROUTES.portal);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-all duration-200 py-1.5 px-2.5 rounded-lg focus:outline-none whitespace-nowrap text-[11px] xl:text-xs ${
      isActive
        ? 'text-[#000666] font-bold border-b-2 border-[#000666] bg-slate-50/80'
        : 'text-slate-600 hover:text-[#000666] hover:bg-slate-50/50'
    }`;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 fixed top-0 w-full z-50 transition-all duration-300 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center gap-2">
        {/* Merek */}
        <Link to={ROUTES.home} className="flex items-center gap-2.5 text-left group shrink-0">
          <BatikLogo size={38} className="group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="font-serif-garamond text-base sm:text-lg md:text-xl font-bold text-[#000666] tracking-wide leading-none whitespace-nowrap">
              BATIK NUSANTARA
            </span>
            <span className="text-[8px] sm:text-[9px] font-sans tracking-widest text-[#a14000] uppercase font-bold mt-1 whitespace-nowrap">
              Komunitas Pengrajin Batik Indonesia
            </span>
          </div>
        </Link>

        {/* Tautan utama */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-sans uppercase tracking-wider font-semibold">
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === ROUTES.home} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Perkakas di kanan */}
        <div className="flex items-center gap-2 xl:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1.5 text-xs font-bold text-slate-700 shrink-0">
            <Globe className="w-3.5 h-3.5 text-[#a14000] shrink-0" />
            <select
              value={currency}
              onChange={(e) => onCurrencyChange?.(e.target.value as Currency)}
              className="bg-transparent border-none text-[11px] font-bold uppercase cursor-pointer focus:ring-0 p-0 pr-1 text-slate-800"
              aria-label="Pilih mata uang"
            >
              <option value="IDR">ID | IDR</option>
              <option value="USD">EN | USD</option>
            </select>
          </div>

          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-1 gap-1 shrink-0">
            <NavLink
              to={ROUTES.cart}
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-full relative transition-all flex items-center gap-1.5 text-xs font-bold whitespace-nowrap shrink-0 ${
                  isActive ? 'bg-[#000666] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
                }`
              }
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline text-[11px] xl:text-xs">Keranjang</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 bg-[#c85a17] text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                  {cartCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to={ROUTES.orders}
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-full relative transition-all flex items-center gap-1.5 text-xs font-bold whitespace-nowrap shrink-0 ${
                  isActive ? 'bg-[#c85a17] text-white shadow-sm' : 'text-[#a14000] hover:bg-slate-200'
                }`
              }
              title="Pesanan Saya & Lacak Pengiriman"
            >
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline text-[11px] xl:text-xs">Pesanan Saya</span>
            </NavLink>
          </div>

          <Link
            to={ROUTES.portal}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm whitespace-nowrap shrink-0 border ${
              isPortal
                ? 'bg-[#000666] text-white border-[#000666]'
                : 'border-[#000666] text-[#000666] hover:bg-[#000666] hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Portal Pengrajin
          </Link>

          <button
            onClick={onOpenAuth}
            className={`hidden 2xl:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-sm whitespace-nowrap shrink-0 border ${
              session
                ? 'bg-[#a14000] text-white border-[#a14000]'
                : 'border-[#a14000] text-[#a14000] hover:bg-[#a14000] hover:text-white'
            }`}
            title={session ? 'Kelola sesi' : 'Masuk ke portal'}
          >
            {session ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                {session.displayName.split(' ')[0]}
              </>
            ) : (
              'Masuk'
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-800 rounded-md focus:outline-none hover:bg-slate-100 ml-1"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Laci menu di layar kecil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-2 shadow-xl">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-xs font-bold">
            <span className="text-slate-600 uppercase tracking-wider">Mata Uang</span>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange?.(e.target.value as Currency)}
              className="bg-slate-100 border border-slate-200 text-slate-800 rounded-md text-xs py-1 px-2 font-bold focus:ring-0"
              aria-label="Pilih mata uang"
            >
              <option value="IDR">ID | IDR (Rp)</option>
              <option value="USD">EN | USD ($)</option>
            </select>
          </div>

          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.home}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `w-full block text-left py-2.5 px-3 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all ${
                  isActive ? 'bg-[#000666] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to={ROUTES.portal}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center border border-[#000666] text-[#000666] rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#000666] hover:text-white transition-all"
            >
              Portal Pengrajin
            </Link>
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center border border-[#a14000] text-[#a14000] rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#a14000] hover:text-white transition-all"
            >
              {session ? `Keluar / Ganti Akun (${session.displayName})` : 'Masuk'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
