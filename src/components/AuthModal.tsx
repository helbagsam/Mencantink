import React, { useState } from 'react';
import { X, ShieldCheck, LogOut, AlertTriangle, UserCheck, Eye } from 'lucide-react';
import { DEMO_ACCOUNTS, DemoAccount, ROLE_LABEL, signIn, signOut } from '../services/sessionService';
import { useSession } from '../hooks/useSession';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * MASUK KE PORTAL.
 *
 * Versi sebelumnya berupa borang surel dan kata sandi yang tidak memeriksa
 * apa pun: menekan tombol hanya memunculkan pesan "berhasil masuk" lewat
 * setTimeout, lalu tidak terjadi apa-apa. Borang kata sandi palsu itu
 * menyesatkan — ia mengajari orang memasukkan kata sandi sungguhan ke tempat
 * yang tidak mengamankannya.
 *
 * Diganti pemilih akun peragaan yang menyatakan dirinya apa adanya, dan yang
 * benar-benar membuat sesi sehingga gerbang halaman tertutup bekerja.
 */
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { session } = useSession();
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handlePilih = async (akun: DemoAccount) => {
    setBusy(true);
    await signIn({
      accountId: akun.accountId,
      roles: akun.roles,
      artisanId: akun.artisanId,
      displayName: akun.displayName,
    });
    setBusy(false);
    onClose();
  };

  const handleKeluar = async () => {
    setBusy(true);
    await signOut();
    setBusy(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#fbf9f5] border border-[#767683]/20 rounded-xl max-w-md w-full p-6 md:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#767683] hover:text-[#000666] hover:bg-[#efeeea] rounded-full"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#000666] text-white flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6 text-[#ffe088]" />
          </div>
          <h3 className="font-serif-garamond text-2xl font-bold text-[#000666]">
            Masuk ke Portal
          </h3>
          <p className="text-xs text-[#454652] mt-1 leading-relaxed">
            Portal pengrajin dan ruang verifikasi tertutup untuk umum karena memuat data pesanan
            dan data pribadi pembeli.
          </p>
        </div>

        {session ? (
          <div className="space-y-4">
            <div className="p-4 bg-[#e0e7ff] border border-[#000666]/25 rounded-lg">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#000666] mb-1">
                Sedang masuk sebagai
              </p>
              <p className="text-sm font-bold text-[#1b1c1a]">{session.displayName}</p>
              <p className="text-[11px] text-[#454652] mt-0.5">
                {session.roles.map((r) => ROLE_LABEL[r]).join(" · ")}
              </p>
            </div>

            <button
              onClick={handleKeluar}
              disabled={busy}
              className="w-full py-3 border border-[#a14000] text-[#a14000] rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#a14000] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>

            <p className="text-[11px] text-[#767683] text-center">
              Atau pilih akun lain di bawah.
            </p>
          </div>
        ) : null}

        <div className="space-y-2.5 mt-4">
          {DEMO_ACCOUNTS.map((akun) => {
            const aktif = session?.accountId === akun.accountId;
            return (
              <button
                key={akun.accountId}
                onClick={() => handlePilih(akun)}
                disabled={busy || aktif}
                className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                  aktif
                    ? 'bg-[#efeeea] border-[#767683]/30 cursor-default'
                    : 'bg-white border-[#767683]/25 hover:border-[#000666]/50 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {akun.roles.includes('artisan') ? (
                    <UserCheck className="w-4 h-4 text-[#a14000] shrink-0" />
                  ) : (
                    <Eye className="w-4 h-4 text-[#000666] shrink-0" />
                  )}
                  <span className="text-sm font-bold text-[#1b1c1a]">{akun.displayName}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#767683] ml-auto">
                    {akun.roles.map((r) => ROLE_LABEL[r]).join(" · ")}
                  </span>
                </div>
                <p className="text-[11px] text-[#454652] leading-relaxed">{akun.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-[#767683]/15">
          <p className="text-[10px] text-[#854d0e] leading-relaxed flex gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
            Ini pemilih akun untuk peragaan, bukan sistem masuk yang sebenarnya. Tidak ada kata
            sandi yang diperiksa dan sesinya hanya tersimpan di peramban ini. Autentikasi
            sungguhan dipasang bersamaan dengan pemindahan data ke server.
          </p>
        </div>
      </div>
    </div>
  );
};
