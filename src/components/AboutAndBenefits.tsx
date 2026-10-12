import React from 'react';
import { Compass, MapPin, Phone, Car, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { GangaAartiWatermark } from './GangaAartiWatermark.js';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';
import { GangaSunButton } from './GangaSunButton.js';
import type { BusinessInfo } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import { translations } from '../i18n/translations.js';

interface AboutAndBenefitsProps {
  businessInfo: BusinessInfo;
  onScrollToCalculator: () => void;
  lang: Language;
}

export const AboutAndBenefits: React.FC<AboutAndBenefitsProps> = ({
  businessInfo,
  onScrollToCalculator,
  lang,
}) => {
  const t = translations[lang];

  return (
    <section id="about" className="relative py-16 sm:py-24 bg-[#FFF9EE]/90 backdrop-blur-md overflow-hidden border-t border-[#D4A373]/30">
      {/* Background Subtle Stamp Watermark 1: Center Ganga Aarti */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-5">
        <GangaAartiWatermark opacity={1} tint="horizon" size={680} />
      </div>

      {/* Background Subtle Stamp Watermark 2: Kashi Vishwanath on right */}
      <div className="absolute right-0 top-12 pointer-events-none z-0 opacity-7">
        <KashiVishwanathWatermark opacity={1} tint="horizon" size={540} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Why Travel With Us */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D9531E] uppercase tracking-widest bg-[#F8ECD5] px-3 py-1 rounded-full border border-[#D4A373]/50">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D9531E]" />
              <span>{t.trustTag2}</span>
            </div>
            <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-[#7C2D12] tracking-tight">
              {t.whyTitle}
            </h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {t.whyDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl border border-[#D4A373]/50 p-7 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF9EE] to-[#F8ECD5] border border-[#D9531E]/40 flex items-center justify-center text-[#D9531E]">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-heritage text-lg font-bold text-[#7C2D12]">
                {t.benefit1Title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t.benefit1Desc}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-[#D4A373]/50 p-7 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF9EE] to-[#F8ECD5] border border-[#D9531E]/40 flex items-center justify-center text-[#D9531E]">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-heritage text-lg font-bold text-[#7C2D12]">
                {t.benefit2Title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t.benefit2Desc}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-[#D4A373]/50 p-7 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF9EE] to-[#F8ECD5] border border-[#D9531E]/40 flex items-center justify-center text-[#D9531E]">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-heritage text-lg font-bold text-[#7C2D12]">
                {t.benefit3Title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t.benefit3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* About Ujjawal Tour & Travels Feature Box */}
        <div className="bg-gradient-to-r from-[#7C2D12] via-[#9A3412] to-[#D9531E] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-4 bottom-4 pointer-events-none opacity-10">
            <KashiVishwanathWatermark opacity={1} tint="ivory" size={420} />
          </div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-200 tracking-wider uppercase block">
                {t.aboutTag}
              </span>
              <h2 className="font-heritage text-2xl sm:text-4xl font-bold tracking-tight">
                {businessInfo.name}
              </h2>
              <p className="font-heritage text-base sm:text-lg text-[#FEF08A] italic">
                “{businessInfo.tagline}”
              </p>
            </div>

            <p className="text-xs sm:text-sm sm:leading-relaxed text-[#FFFDF7]/90">
              {t.aboutParagraph}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <GangaSunButton
                size="md"
                variant="primary"
                onClick={onScrollToCalculator}
              >
                {t.calcFareNow}
              </GangaSunButton>

              <a
                href={`tel:${businessInfo.primaryPhone}`}
                className="px-5 py-2.5 rounded-xl border border-white/40 hover:bg-white/10 text-xs sm:text-sm font-bold text-white transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#FEF08A]" />
                <span>Call Lanka Dispatch</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
