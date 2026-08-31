import React from 'react';
import { IMG } from '../assets/images';

interface BatikLogoProps {
  className?: string;
  size?: number;
}

/**
 * Lambang Ruang Canting.
 *
 * Gambarnya memuat canting yang meneteskan malam, cap tembaga, dan susunan
 * motif batik — ketiganya alat dan hasil yang jadi pokok bahasan situs ini.
 * Warnanya kebetulan sudah sewarna dengan tema: nila tua, terakota, dan emas.
 *
 * Berkas aslinya 1,1 MB dan itu terlalu berat untuk gambar yang muncul paling
 * pertama di layar. Disimpan ulang sebagai PNG 512 piksel menjadi sekitar
 * 98 KB, karena logo yang lambat termuat adalah kesan pertama yang buruk —
 * apalagi saat peragaan dengan jaringan seadanya.
 */
export const BatikLogo: React.FC<BatikLogoProps> = ({ className = '', size = 40 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden bg-white ${className}`}
    >
      <img
        src={IMG['logo-ruang-canting']}
        alt="Lambang Ruang Canting"
        className="w-full h-full object-contain"
      />
    </div>
  );
};
