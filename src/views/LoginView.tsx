import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Eye, Loader2, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { findAccountByEmail } from '../services/accountService';
import { DEMO_ACCOUNTS, ROLE_LABEL, signIn } from '../services/sessionService';
import { ROUTES } from '../routes';

/**
 * MASUK.
 *
 * Selama tahap peragaan, masuk cukup dengan alamat surel. Alasan lengkapnya
 * ada di services/accountService.ts: aplikasi ini belum punya server yang bisa
 * menyimpan kata sandi dengan aman, dan kolom kata sandi yang tidak pernah
 * diperiksa lebih berbahaya daripada tidak ada sama sekali.
 *
 * Akun peragaan disediakan terpisah di bawah, supaya saat memperagakan alur
 * jual-beli tidak perlu mendaftar dari nol setiap kali.
 */
export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [galat, setGalat] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);

  const handleMasuk = async () => {
    setSibuk(true);
    setGalat(null);

    const akun = await findAccountByEmail(email);
    if (!akun) {
      setGalat('Alamat surel ini belum terdaftar.');
      setSibuk(false);
      return;
    }

    await signIn({
      accountId: akun.id,
      roles: akun.roles,
      artisanId: akun.artisanId,
      displayName: akun.fullName,
    });
    navigate(akun.roles.includes('artisan') ? ROUTES.portal : ROUTES.market);
  };

  return (
    <div className="pt-28 pb-24 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-[#767683]/20 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 bg-[#000666] text-white">
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-[#ffe088]" />
            </div>
            <h1 className="font-serif-garamond text-2xl font-bold">Masuk</h1>
            <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
              Masukkan alamat surel yang Anda pakai saat mendaftar.
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a14000] mb-1">
                Alamat Surel
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleMasuk();
                }}
                placeholder="nama@surel.com"
                className="w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#000666]"
              />
            </div>

            {galat && (
              <div className="p-3 bg-[#ffe4e6] border border-[#9f1239]/25 rounded-lg flex gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#9f1239] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#9f1239]">{galat}</p>
                  <Link
                    to={ROUTES.register}
                    className="text-xs text-[#9f1239] font-bold underline mt-1 inline-block"
                  >
                    Daftar sekarang
                  </Link>
                </div>
              </div>
            )}

            <button
              onClick={() => void handleMasuk()}
              disabled={!email.includes('@') || sibuk}
              className="w-full py-3 bg-[#000666] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#1a237e] transition-colors disabled:bg-[#efeeea] disabled:text-[#767683] disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sibuk ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Memeriksa...
                </>
              ) : (
                'Masuk'
              )}
            </button>

            <p className="text-xs text-[#454652] text-center">
              Belum punya akun?{' '}
              <Link to={ROUTES.register} className="text-[#a14000] font-bold hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Akun peragaan */}
        <div className="mt-6 bg-[#f5f3ef] border border-[#767683]/20 rounded-xl p-5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#a14000] mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Akun Peragaan
          </h2>
          <p className="text-[11px] text-[#454652] leading-relaxed mb-3">
            Untuk memperagakan alur jual-beli tanpa mendaftar dari nol.
          </p>

          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((akun) => (
              <button
                key={akun.accountId}
                onClick={async () => {
                  await signIn({
                    accountId: akun.accountId,
                    roles: akun.roles,
                    artisanId: akun.artisanId,
                    displayName: akun.displayName,
                  });
                  navigate(
                    akun.roles.includes('verifier')
                      ? ROUTES.verification
                      : akun.roles.includes('artisan')
                        ? ROUTES.portal
                        : ROUTES.market,
                  );
                }}
                className="w-full text-left p-3 bg-white border border-[#767683]/25 rounded-lg hover:border-[#000666]/50 transition-all"
              >
                <div className="flex items-center gap-2">
                  {akun.roles.includes('verifier') ? (
                    <Eye className="w-4 h-4 text-[#000666] shrink-0" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-[#a14000] shrink-0" />
                  )}
                  <span className="text-xs font-bold text-[#1b1c1a]">{akun.displayName}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#767683] ml-auto">
                    {akun.roles.map((r) => ROLE_LABEL[r]).join(' · ')}
                  </span>
                </div>
                <p className="text-[11px] text-[#454652] leading-relaxed mt-1">
                  {akun.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-[#854d0e] leading-relaxed flex gap-1.5 mt-5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
          Ini belum autentikasi sungguhan. Tidak ada kata sandi yang diperiksa dan sesinya hanya
          tersimpan di peramban ini, sehingga bisa dipalsukan. Autentikasi di sisi server dipasang
          bersamaan dengan pemindahan data ke basis data.
        </p>
      </div>
    </div>
  );
};
