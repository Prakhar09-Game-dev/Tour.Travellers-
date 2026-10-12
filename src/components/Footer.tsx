import React from 'react';
import { Phone, MapPin, Mail, ShieldCheck, Sun, Camera, Heart } from 'lucide-react';
import { GangaAartiWatermark } from './GangaAartiWatermark.js';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';
import type { BusinessInfo } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import { translations } from '../i18n/translations.js';

interface FooterProps {
  businessInfo: BusinessInfo;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({
  businessInfo,
  onNavigate,
  onOpenAdmin,
  lang,
}) => {
  const t = translations[lang];

  return (
    <footer className="relative bg-[#29130D] text-[#FFFDF7] pt-16 pb-12 overflow-hidden border-t-2 border-[#D9531E]">
      {/* Background Subtle Stamp Watermark 1: Ganga Aarti on right */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-8">
        <GangaAartiWatermark opacity={1} tint="gold" size={480} />
      </div>

      {/* Background Subtle Stamp Watermark 2: Kashi Vishwanath on left */}
      <div className="absolute left-0 top-0 pointer-events-none opacity-8">
        <KashiVishwanathWatermark opacity={1} tint="gold" size={480} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D9531E] to-[#F59E0B] flex items-center justify-center text-white">
                <Sun className="w-4 h-4 text-white" />
              </span>
              <h3 className="font-heritage text-2xl font-bold text-white tracking-wide">
                {t.brand}
              </h3>
            </div>
            <p className="font-heritage text-xs text-amber-200 italic">
              “{businessInfo.tagline}”
            </p>
            <p className="text-xs text-[#FFFDF7]/70 leading-relaxed">
              {lang === 'hi'
                ? 'वाराणसी के लंका क्षेत्र से संचालित प्रतिष्ठित कार रेंटल, धार्मिक यात्रा एवं बाहरी कैब सेवा। पारदर्शी दरें एवं समर्पित स्थानीय चालक।'
                : 'Premier car rental, outstation cab booking, and Kashi pilgrimage services based in Hariom Nagar, Samneghat, Lanka, Varanasi. Transparent billing and dedicated local chauffeurs.'}
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-heritage text-sm font-bold text-[#F59E0B] uppercase tracking-wider">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs text-[#FFFDF7]/80">
              <li>
                <button
                  onClick={() => onNavigate('hero')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  {lang === 'hi' ? 'मुख्य पृष्ठ (होम)' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('fleet')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  {t.navFleet} (Dzire, Zest, Innova, Ertiga, Traveller)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  {t.navCalculator}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('packages')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  {t.navPackages}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('heritage-gallery')}
                  className="hover:text-amber-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Camera className="w-3 h-3 text-[#D9531E]" />
                  <span>{lang === 'hi' ? 'धरोहर एवं संदर्भ गैलरी' : 'Heritage & Reference Gallery'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  {t.navAbout}
                </button>
              </li>
            </ul>
          </div>

          {/* Address & Booking Office */}
          <div className="space-y-3">
            <h4 className="font-heritage text-sm font-bold text-[#F59E0B] uppercase tracking-wider">
              {t.officeAddress}
            </h4>
            <div className="space-y-2.5 text-xs text-[#FFFDF7]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D9531E] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {businessInfo.location}
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 pl-6.5 leading-snug">
                {businessInfo.landmarks}
              </p>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D9531E] shrink-0" />
                <a
                  href={`mailto:${businessInfo.email}`}
                  className="hover:text-white transition-colors truncate"
                >
                  {businessInfo.email}
                </a>
              </div>
            </div>
          </div>

          {/* 24x7 Direct Phone Dispatch */}
          <div className="space-y-3">
            <h4 className="font-heritage text-sm font-bold text-[#F59E0B] uppercase tracking-wider">
              {t.dispatchLines}
            </h4>
            <div className="space-y-2">
              <a
                href={`tel:${businessInfo.primaryPhone}`}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D9531E]" />
                  <span className="text-xs font-bold text-white group-hover:text-amber-200">
                    +91 {businessInfo.primaryPhone}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">24x7 Active</span>
              </a>

              <a
                href={`tel:${businessInfo.secondaryPhone}`}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D9531E]" />
                  <span className="text-xs font-bold text-white group-hover:text-amber-200">
                    +91 {businessInfo.secondaryPhone}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">Support</span>
              </a>
            </div>

            <p className="text-[11px] text-stone-400 pt-1">
              {businessInfo.workingHours}
            </p>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFFDF7]/60">
          <div>
            © {new Date().getFullYear()} {businessInfo.name}. All rights reserved. Registered Lanka, Varanasi Tour &amp; Travel Operator.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-stone-400 hover:text-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D9531E]" />
              <span>{t.adminPortal}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
