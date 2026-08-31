import React from 'react';
import { NavTab } from '../types';
import { ARTISAN_AVATAR, CANTING_WORKSHOP_IMG } from '../data/mockData';
import { MapPin, Award, CheckCircle2, ShieldCheck, Mail, Sparkles } from 'lucide-react';

interface ArtisansViewProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const ArtisansView: React.FC<ArtisansViewProps> = ({ onNavigateTab }) => {
  const artisans = [
    {
      id: 'art-1',
      name: 'Master Budi Santoso',
      workshop: 'Sanggar Batik Parang Barong',
      region: 'Surakarta (Solo), Central Java',
      specialty: 'High-end Royal Sogan Tulis Batik',
      level: 'Master Artisan Level III',
      score: '98% Authenticity',
      avatar: ARTISAN_AVATAR,
      bio: 'Over 35 years practicing traditional wax-resist canting work, specializing in royal Mataram court patterns.',
    },
    {
      id: 'art-2',
      name: 'Ibu Siti Rahmawati',
      workshop: 'Studio Megamendung Pesisiran',
      region: 'Cirebon, West Java',
      specialty: '7-Layer Natural Indigo Megamendung',
      level: 'Master Artisan Level II',
      score: '96% Authenticity',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCji4KidvXNRZI4BbxqH5nAbxeVR-yCXSp2X2pY5klwGOZcJcL1tUGMOFqzA_tLYSok5gbyQ_uZ6iDAUNCftfSjPQSxYlTo1fGhHHJWA8MSbDcapDAW2sEg-AurPHfvmYbSKzLZiI2wD_fc1imiBVzCvfu_ykCOXyJj-r1ZgNBQCmdz_G9ydH91F7uKkjKDbnTh3Xh6DNNvNYFl6Hc2fijFdBcxR3g3ZjHhuiLiL9gVbllzBBCwBG10GQ',
      bio: 'Pioneer of organic fermentation vat dyeing in Cirebon, preserving coastal maritime trade motifs.',
    },
    {
      id: 'art-3',
      name: 'Pak Suryo Handoko',
      workshop: 'Koleksi Batik Kawung Krajan',
      region: 'Yogyakarta',
      specialty: 'Geometric Cap & Copper Stamp Casting',
      level: 'Master Artisan Level III',
      score: '99% Authenticity',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO51DnmqemYNYQmx9pzMzzsCGw2i6vWCIRK_J7JusGE-Rx_nszm2yK2O7cMRpCaEgSeMRPmGr0krEEF3c5ZhmkKpUwsgyZTyq1rod_0PsKurCkkKhLphAs6NR7QD1lmyoUCKzSh9EgK8C89vXiKPqbupsj98Y0xhXXR2Qs9hgcd7n9GYclM09nzg4qBN4jBLyYjnoJGU0GiV8VMHdaQAYiTq6-gbBPjNc5Kol_nod30GUCrUNoQ2uucw',
      bio: 'Custom copper stamp maker and geometric batik preserver collaborating with global heritage museums.',
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#a14000]/10 text-[#a14000] rounded-full text-xs font-bold uppercase tracking-widest mb-3">
          <ShieldCheck className="w-4 h-4" /> Official Certified Registry
        </div>
        <h1 className="font-serif-garamond text-4xl md:text-5xl font-bold text-[#000666] mb-4">
          Certified Master Craftsmen
        </h1>
        <p className="text-base text-[#454652] leading-relaxed">
          Discover vetted Javanese batik masters certified by the Indonesian Batik Craftsmen Association. Every artisan adheres to traditional non-synthetic wax standards.
        </p>
      </section>

      {/* Artisans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {artisans.map((art) => (
          <div
            key={art.id}
            className="bg-white border border-[#000666]/15 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={art.avatar}
                  alt={art.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#a14000]"
                />
                <div>
                  <h3 className="font-serif-garamond text-xl font-bold text-[#000666]">
                    {art.name}
                  </h3>
                  <p className="text-xs text-[#a14000] font-bold uppercase tracking-wider">
                    {art.workshop}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs mb-4">
                <p className="text-[#454652] flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#000666]" /> {art.region}
                </p>
                <p className="text-[#454652] flex items-center gap-1.5 font-medium">
                  <Award className="w-3.5 h-3.5 text-[#000666]" /> {art.level}
                </p>
                <p className="text-[#000666] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#a14000]" /> {art.score}
                </p>
              </div>

              <p className="text-xs text-[#454652] leading-relaxed italic border-t border-[#767683]/15 pt-3">
                "{art.bio}"
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('portal')}
              className="mt-6 w-full py-2.5 bg-[#000666] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#1a237e] transition-colors flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              Commission Artisan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
