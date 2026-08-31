import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Info,
  Loader2,
  ShoppingBag,
  UserCheck,
} from 'lucide-react';
import { ArtisanRegistration, registerAccount } from '../services/accountService';
import { signIn } from '../services/sessionService';
import { saveArtisan } from '../services/trustService';
import { Artisan, EMPTY_BUSINESS } from '../domain/artisan';
import { Certificate } from '../domain/trust';
import { newId, nowIso } from '../services/storage';
import { IMG } from '../assets/images';
import { ROUTES } from '../routes';

type Peran = 'buyer' | 'artisan' | null;

const TEKNIK: Array<'Tulis' | 'Cap' | 'Kombinasi'> = ['Tulis', 'Cap', 'Kombinasi'];

/**
 * PENDAFTARAN.
 *
 * Dua borang dengan panjang yang sengaja berbeda jauh.
 *
 * Pembeli hanya dimintai tiga hal. Setiap kolom tambahan pada borang pembeli
 * adalah orang yang batal mendaftar, dan tidak ada gunanya menanyakan hal yang
 * tidak dipakai.
 *
 * Pengrajin dimintai lebih banyak, tetapi setiap pertanyaan disertai alasannya:
 * data itulah yang nanti dicocokkan verifikator, dan yang menentukan di anak
 * tangga mana ia berdiri. Yang TIDAK ditanyakan juga disengaja — nomor KTP dan
 * NPWP tidak diminta di sini, karena dokumen identitas cukup diperlihatkan
 * sekali kepada petugas dan tidak perlu disimpan (UU PDP No. 27 Tahun 2022).
 */
export const RegisterView: React.FC = () => {
  const navigate = useNavigate();

  const [peran, setPeran] = useState<Peran>(null);
  const [mengirim, setMengirim] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);

  // Data dasar
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [setuju, setSetuju] = useState(false);

  // Data pengrajin
  const [workshop, setWorkshop] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [techniques, setTechniques] = useState<Array<'Tulis' | 'Cap' | 'Kombinasi'>>([]);
  const [years, setYears] = useState('');
  const [bio, setBio] = useState('');
  const [lspNumber, setLspNumber] = useState('');
  const [batikmarkNumber, setBatikmarkNumber] = useState('');
  const [hasNib, setHasNib] = useState(false);
  const [hasNpwp, setHasNpwp] = useState(false);
  const [hasMerek, setHasMerek] = useState(false);
  const [hasBadanUsaha, setHasBadanUsaha] = useState(false);

  const dasarLengkap = fullName.trim().length > 2 && email.includes('@') && setuju;
  const pengrajinLengkap =
    workshop.trim().length > 2 && city.trim().length > 1 && techniques.length > 0;
  const bolehKirim =
    dasarLengkap && (peran === 'buyer' || pengrajinLengkap) && !mengirim;

  const toggleTeknik = (t: 'Tulis' | 'Cap' | 'Kombinasi') =>
    setTechniques((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const handleDaftar = async () => {
    if (!bolehKirim || !peran) return;
    setMengirim(true);
    setGalat(null);

    const dataPengrajin: ArtisanRegistration | undefined =
      peran === 'artisan'
        ? {
            workshop: workshop.trim(),
            city: city.trim(),
            region: region.trim() || city.trim(),
            techniques,
            yearsOfPractice: parseInt(years, 10) || 0,
            bio: bio.trim(),
            lspCertificateNumber: lspNumber.trim() || undefined,
            batikmarkNumber: batikmarkNumber.trim() || undefined,
            hasNib,
            hasNpwp,
            hasRegisteredTrademark: hasMerek,
            hasLegalEntity: hasBadanUsaha,
          }
        : undefined;

    const hasil = await registerAccount({
      email,
      fullName,
      phone,
      asArtisan: peran === 'artisan',
      artisan: dataPengrajin,
    });

    if (!hasil.ok) {
      setGalat(hasil.error);
      setMengirim(false);
      return;
    }

    /* Pengrajin baru langsung muncul di Daftar Pengrajin, apa adanya, pada
       tingkat "Terdaftar". Nomor sertifikat yang diisi sendiri dicatat tetapi
       BELUM dianggap sah — kolom checkedByPlatformAt sengaja dikosongkan
       sampai ada petugas yang mencocokkannya dengan dokumen aslinya. */
    if (peran === 'artisan' && hasil.account.artisanId && dataPengrajin) {
      const sertifikat: Certificate[] = [];
      if (dataPengrajin.lspCertificateNumber) {
        sertifikat.push({
          id: newId(),
          kind: 'lsp_bnsp',
          number: dataPengrajin.lspCertificateNumber,
          issuer: 'Badan Nasional Sertifikasi Profesi',
          legalBasis: 'SKKNI No. 104 Tahun 2018',
          issuedAt: nowIso(),
        });
      }
      if (dataPengrajin.batikmarkNumber) {
        sertifikat.push({
          id: newId(),
          kind: 'batikmark',
          number: dataPengrajin.batikmarkNumber,
          issuer: 'Kementerian Perindustrian RI',
          legalBasis: 'Permenperin No. 74/M-IND/PER/9/2007',
          issuedAt: nowIso(),
        });
      }

      const artisanBaru: Artisan = {
        id: hasil.account.artisanId,
        slug: hasil.account.fullName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
        name: hasil.account.fullName,
        workshop: dataPengrajin.workshop,
        city: dataPengrajin.city,
        region: dataPengrajin.region,
        avatarUrl: IMG['artisan_avatar'],
        bio: dataPengrajin.bio || 'Pengrajin baru bergabung.',
        specialties: dataPengrajin.techniques.map((t) => `Batik ${t}`),
        techniques: dataPengrajin.techniques,
        // Tingkat selalu dihitung dari bukti, tidak pernah diberikan cuma-cuma
        // saat mendaftar. Pendatang baru berdiri di anak tangga paling bawah.
        tier: 'registered',
        certificates: sertifikat,
        joinedAt: nowIso(),
        yearsOfPractice: dataPengrajin.yearsOfPractice || undefined,
        business: {
          ...EMPTY_BUSINESS,
          hasNib: dataPengrajin.hasNib,
          hasNpwp: dataPengrajin.hasNpwp,
          hasRegisteredTrademark: dataPengrajin.hasRegisteredTrademark,
          hasLegalEntity: dataPengrajin.hasLegalEntity,
        },
      };
      await saveArtisan(artisanBaru);
    }

    await signIn({
      accountId: hasil.account.id,
      roles: hasil.account.roles,
      artisanId: hasil.account.artisanId,
      displayName: hasil.account.fullName,
    });

    navigate(peran === 'artisan' ? ROUTES.portal : ROUTES.market);
  };

  /* ---------------------------------------------------------------- */
  /* Pilih peran                                                       */
  /* ---------------------------------------------------------------- */
  if (!peran) {
    return (
      <div className="pt-28 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif-garamond text-3xl md:text-4xl font-bold text-[#000666] mb-2">
            Bergabung dengan Ruang Canting
          </h1>
          <p className="text-sm text-[#454652] leading-relaxed mb-8">
            Pilih dulu Anda datang sebagai apa. Pilihan ini bisa ditambah nanti — pengrajin
            otomatis juga bisa membeli kain pengrajin lain dengan akun yang sama.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setPeran('buyer')}
              className="text-left p-5 bg-white border border-[#767683]/25 rounded-xl hover:border-[#000666]/50 hover:shadow-md transition-all"
            >
              <ShoppingBag className="w-7 h-7 text-[#a14000] mb-3" />
              <h2 className="font-serif-garamond text-xl font-bold text-[#000666] mb-1">
                Saya Pembeli
              </h2>
              <p className="text-xs text-[#454652] leading-relaxed">
                Ingin membeli kain batik langsung dari pengrajinnya. Cukup tiga isian.
              </p>
            </button>

            <button
              onClick={() => setPeran('artisan')}
              className="text-left p-5 bg-white border border-[#767683]/25 rounded-xl hover:border-[#000666]/50 hover:shadow-md transition-all"
            >
              <UserCheck className="w-7 h-7 text-[#a14000] mb-3" />
              <h2 className="font-serif-garamond text-xl font-bold text-[#000666] mb-1">
                Saya Pengrajin
              </h2>
              <p className="text-xs text-[#454652] leading-relaxed">
                Ingin menjual kain atas nama sendiri. Isiannya lebih panjang karena datanya
                dipakai verifikator.
              </p>
            </button>
          </div>

          <p className="text-xs text-[#454652] mt-6">
            Sudah punya akun?{' '}
            <Link to={ROUTES.login} className="text-[#a14000] font-bold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Borang                                                            */
  /* ---------------------------------------------------------------- */
  const labelKelas = 'block text-[10px] font-bold uppercase tracking-widest text-[#a14000] mb-1';
  const inputKelas =
    'w-full bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#000666]';

  return (
    <div className="pt-28 pb-24 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setPeran(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#a14000] hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Ganti pilihan
        </button>

        <h1 className="font-serif-garamond text-3xl font-bold text-[#000666] mb-1">
          {peran === 'buyer' ? 'Daftar sebagai Pembeli' : 'Daftar sebagai Pengrajin'}
        </h1>
        <p className="text-sm text-[#454652] leading-relaxed mb-6">
          {peran === 'buyer'
            ? 'Tiga isian saja. Sisanya diminta hanya saat Anda memesan.'
            : 'Isian berikut yang nanti dicocokkan verifikator dan menentukan tingkat Anda. Yang belum ada boleh dikosongkan — justru itu yang akan kami bantu urus.'}
        </p>

        {/* Data dasar */}
        <section className="bg-white border border-[#767683]/20 rounded-xl p-5 mb-4 space-y-4">
          <h2 className="font-serif-garamond text-lg font-bold text-[#000666]">Data Diri</h2>

          <div>
            <label className={labelKelas}>Nama Lengkap</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={peran === 'artisan' ? 'Nama Anda, bukan nama sanggar' : 'Nama lengkap'}
              className={inputKelas}
            />
            {peran === 'artisan' && (
              <p className="text-[10px] text-[#767683] mt-1 leading-relaxed">
                Nama inilah yang tampil pada kain Anda. Di tempat lain nama pembuat sering hilang
                diganti merek pedagang — di sini tidak.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelKelas}>Alamat Surel</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@surel.com"
                className={inputKelas}
              />
            </div>
            <div>
              <label className={labelKelas}>
                Nomor HP <span className="text-[#767683] normal-case">(opsional)</span>
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xx"
                className={inputKelas}
              />
            </div>
          </div>
        </section>

        {/* Data pengrajin */}
        {peran === 'artisan' && (
          <>
            <section className="bg-white border border-[#767683]/20 rounded-xl p-5 mb-4 space-y-4">
              <h2 className="font-serif-garamond text-lg font-bold text-[#000666]">
                Sanggar dan Keahlian
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelKelas}>Nama Sanggar</label>
                  <input
                    value={workshop}
                    onChange={(e) => setWorkshop(e.target.value)}
                    placeholder="mis. Griyo Batik Bu Wahyu"
                    className={inputKelas}
                  />
                </div>
                <div>
                  <label className={labelKelas}>Kota</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="mis. Cirebon"
                    className={inputKelas}
                  />
                </div>
                <div>
                  <label className={labelKelas}>Provinsi</label>
                  <input
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="mis. Jawa Barat"
                    className={inputKelas}
                  />
                </div>
                <div>
                  <label className={labelKelas}>Lama Menekuni (tahun)</label>
                  <input
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    inputMode="numeric"
                    placeholder="mis. 9"
                    className={inputKelas}
                  />
                </div>
              </div>

              <div>
                <label className={labelKelas}>Teknik yang Dikerjakan</label>
                <div className="flex flex-wrap gap-2">
                  {TEKNIK.map((t) => {
                    const aktif = techniques.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTeknik(t)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all ${
                          aktif
                            ? 'bg-[#000666] text-white border-[#000666]'
                            : 'bg-white text-[#454652] border-[#767683]/30 hover:border-[#000666]/50'
                        }`}
                      >
                        {aktif && <Check className="w-3 h-3 inline mr-1" />}
                        Batik {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className={labelKelas}>
                  Ceritakan Singkat <span className="text-[#767683] normal-case">(opsional)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Sejak kapan membatik, motif andalan, cara mewarnai."
                  className={inputKelas}
                />
              </div>
            </section>

            <section className="bg-white border border-[#767683]/20 rounded-xl p-5 mb-4 space-y-4">
              <div>
                <h2 className="font-serif-garamond text-lg font-bold text-[#000666]">
                  Sertifikat dan Legalitas
                </h2>
                <p className="text-xs text-[#454652] leading-relaxed mt-1">
                  Semuanya boleh kosong. Justru yang kosong itulah yang akan kami dampingi
                  pengurusannya, dan yang menentukan langkah Anda di tangga naik tingkat.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelKelas}>Nomor Sertifikat Kompetensi BNSP</label>
                  <input
                    value={lspNumber}
                    onChange={(e) => setLspNumber(e.target.value)}
                    placeholder="Kosongkan bila belum punya"
                    className={inputKelas}
                  />
                </div>
                <div>
                  <label className={labelKelas}>Nomor Batikmark</label>
                  <input
                    value={batikmarkNumber}
                    onChange={(e) => setBatikmarkNumber(e.target.value)}
                    placeholder="Kosongkan bila belum punya"
                    className={inputKelas}
                  />
                </div>
              </div>

              <div className="p-3 bg-[#fef3c7] border border-[#854d0e]/25 rounded-lg flex gap-2.5">
                <Info className="w-4 h-4 text-[#854d0e] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#454652] leading-relaxed">
                  Nomor yang Anda isi sendiri belum langsung berlaku. Nomor itu baru diakui setelah
                  dicocokkan petugas dengan dokumen aslinya — kalau tidak, siapa pun bisa mengetik
                  nomor karangan dan lencananya kembali tidak bermakna.
                </p>
              </div>

              <div>
                <label className={labelKelas}>Yang Sudah Anda Miliki</label>
                <div className="space-y-2">
                  {[
                    { nilai: hasNib, set: setHasNib, label: 'NIB (Nomor Induk Berusaha)', catatan: 'Gratis lewat OSS' },
                    { nilai: hasNpwp, set: setHasNpwp, label: 'NPWP', catatan: 'Gratis' },
                    { nilai: hasMerek, set: setHasMerek, label: 'Sertifikat merek terdaftar', catatan: 'Berbayar, syarat wajib Batikmark' },
                    { nilai: hasBadanUsaha, set: setHasBadanUsaha, label: 'Badan usaha / akta', catatan: 'Bisa berupa koperasi' },
                  ].map((b) => (
                    <label
                      key={b.label}
                      className="flex items-start gap-2.5 p-2.5 bg-[#f5f3ef] border border-[#767683]/20 rounded-lg cursor-pointer hover:border-[#000666]/40"
                    >
                      <input
                        type="checkbox"
                        checked={b.nilai}
                        onChange={(e) => b.set(e.target.checked)}
                        className="mt-0.5"
                      />
                      <span className="text-xs text-[#1b1c1a]">
                        {b.label}
                        <span className="block text-[10px] text-[#767683] mt-0.5">{b.catatan}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Persetujuan */}
        <section className="bg-white border border-[#767683]/20 rounded-xl p-5 mb-4">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={setuju}
              onChange={(e) => setSetuju(e.target.checked)}
              className="mt-0.5 shrink-0"
            />
            <span className="text-xs text-[#454652] leading-relaxed">
              Saya menyetujui pemrosesan data pribadi saya sebatas untuk keperluan{' '}
              {peran === 'artisan'
                ? 'verifikasi kepengrajinan, penayangan karya, dan pengiriman pesanan'
                : 'pemesanan dan pengiriman'}
              , sesuai UU Pelindungan Data Pribadi No. 27 Tahun 2022. Persetujuan ini dapat saya
              tarik sewaktu-waktu.
            </span>
          </label>
        </section>

        {galat && (
          <div className="p-3.5 bg-[#ffe4e6] border border-[#9f1239]/25 rounded-lg mb-4 flex gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#9f1239] shrink-0 mt-0.5" />
            <p className="text-xs text-[#9f1239]">{galat}</p>
          </div>
        )}

        <button
          onClick={() => void handleDaftar()}
          disabled={!bolehKirim}
          className="w-full py-3.5 bg-[#000666] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#1a237e] transition-colors disabled:bg-[#efeeea] disabled:text-[#767683] disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {mengirim ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Mendaftarkan...
            </>
          ) : (
            'Buat Akun'
          )}
        </button>

        <div className="mt-5 pt-4 border-t border-[#767683]/15">
          <p className="text-[10px] text-[#854d0e] leading-relaxed flex gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
            Tidak ada kolom kata sandi, dan itu disengaja. Aplikasi ini belum punya server yang bisa
            menyimpan kata sandi dengan aman, jadi selama tahap peragaan masuk cukup dengan alamat
            surel. Kolom kata sandi yang isinya tidak pernah diperiksa hanya akan mengajari orang
            mengetikkan kata sandi sungguhan ke tempat yang tidak mengamankannya.
          </p>
        </div>
      </div>
    </div>
  );
};
