import React from 'react';

const logoImgUrl = new URL('../assets/images/batik_logo_1785810298179.jpg', import.meta.url).href;

interface BatikLogoProps {
  className?: string;
  size?: number;
}

export const BatikLogo: React.FC<BatikLogoProps> = ({ className = "w-10 h-10", size = 40 }) => {
  return (
    <div 
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden bg-[#000666] border border-[#ffe088]/40 shadow-sm ${className}`}
    >
      <img
        src={logoImgUrl}
        alt="Logo Batik Nusantara"
        className="w-full h-full object-cover rounded-xl"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
