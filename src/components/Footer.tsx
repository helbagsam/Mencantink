import React from 'react';
import { RotateCcw } from 'lucide-react';
import { NavTab } from '../types';
import { BatikLogo } from './BatikLogo';
import { resetAll } from '../services/storage';

interface FooterProps {
  onTabChange: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="bg-[#000666] text-white w-full py-12 px-6 md:px-16 mt-auto border-t border-[#1a237e]">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <div className="flex items-center gap-3">
            <BatikLogo size={36} />
            <span className="font-serif-garamond text-xl md:text-2xl text-white font-bold tracking-tight">
              RUANG CANTING
            </span>
          </div>
          <span className="text-xs text-[#bdc2ff] opacity-90 max-w-md">
            © 2026 Ruang Canting. Melestarikan Warisan Budaya Indonesia Melalui Karya Autentik & Berdaya.
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6 text-xs md:text-sm font-semibold uppercase tracking-wider text-[#bdc2ff]">
          <button 
            onClick={() => onTabChange('home')} 
            className="hover:text-white transition-colors hover:underline"
          >
            Beranda
          </button>
          <button 
            onClick={() => onTabChange('education')} 
            className="hover:text-white transition-colors hover:underline"
          >
            Edukasi Batik
          </button>
          <button 
            onClick={() => onTabChange('marketplace')} 
            className="hover:text-white transition-colors hover:underline"
          >
            Pasar Nusantara
          </button>
          <button
            onClick={() => onTabChange('heritage')}
            className="hover:text-white transition-colors hover:underline"
          >
            Warisan Budaya
          </button>
          {/* Halaman pengrajin sebelumnya tidak punya satu pun tautan menuju
              ke sana, padahal pengrajin adalah subjek utama produk ini. */}
          <button
            onClick={() => onTabChange('artisans')}
            className="hover:text-white transition-colors hover:underline"
          >
            Pengrajin
          </button>
          <button 
            onClick={() => onTabChange('community')} 
            className="hover:text-white transition-colors hover:underline"
          >
            Komunitas & Event
          </button>
          <button
            onClick={() => onTabChange('tracking')}
            className="hover:text-white transition-colors hover:underline text-[#ffe088]"
          >
            Pesanan Saya
          </button>
        </nav>

        {/* Mengembalikan seluruh data ke keadaan awal.
            Dipakai saat peragaan: setelah gladi bersih, satu klik untuk
            mengulang dari nol di depan penilai tanpa perlu membuka
            perkakas peramban. */}
        <div className="mt-8 pt-5 border-t border-white/10 text-center">
          <button
            onClick={async () => {
              const yakin = window.confirm(
                'Kembalikan seluruh data peragaan ke keadaan awal? Keranjang, pesanan, kain yang diunggah, dan hasil tinjauan akan dihapus.',
              );
              if (!yakin) return;
              await resetAll();
              window.location.href = '/';
            }}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#bdc2ff]/60 hover:text-[#ffe088] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Ulang Data Peragaan
          </button>
        </div>
      </div>
    </footer>
  );
};
