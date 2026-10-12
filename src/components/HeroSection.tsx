import React from 'react';
import { Phone, MapPin, Compass, ArrowRight, ShieldCheck, Sun, Sparkles } from 'lucide-react';
import { GangaAartiWatermark } from './GangaAartiWatermark.js';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';
import { GangaRiverBackground, SunPhase } from './GangaRiverBackground.js';
import { GangaSunButton } from './GangaSunButton.js';
import { GangaWaveDivider } from './GangaWaveDivider.js';
import type { BusinessInfo } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import { translations } from '../i18n/translations.js';

interface HeroSectionProps {
  businessInfo: BusinessInfo;
  onPlanJourney: () => void;
  onExploreFleet: () => void;
  onOpenGallery?: () => void;
  sunPhase: SunPhase;
  onCycleSunPhase?: () => void;
  lang: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  businessInfo,
  onPlanJourney,
  onExploreFleet,
  onOpenGallery,
  sunPhase,
  onCycleSunPhase,
  lang,
}) => {
  const t = translations[lang];

  return (
    <section className="relative overflow-hidden bg-[#2D0A0E] text-[#FFFDF7] pt-16 sm:pt-24 lg:pt-28 pb-14 sm:pb-20">
      {/* Living River Ganga & Flowing Boats Animated Background */}
      <div className="absolute inset-0 z-0">
        <GangaRiverBackground
          sunPhase={sunPhase}
          onCycleSunPhase={onCycleSunPhase}
          className="w-full h-full"
        />
        {/* Soft Contrast Gradient Scrim to ensure complete legibility of text */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/35 pointer-events-none" />
      </div>

      {/* Signature Brand Element 1: Authentic Kashi Vishwanath Watermark on Top Left */}
      <div className="absolute -left-20 -top-16 lg:left-4 lg:-top-10 z-0 pointer-events-none">
        <KashiVishwanathWatermark opacity={0.14} tint="gold" size={600} showFramingArch={true} />
      </div>

      {/* Signature Brand Element 2: Stamp-Style Ganga Aarti Watermark on Right */}
      <div className="absolute -right-20 -bottom-20 lg:right-4 lg:bottom-4 z-0 pointer-events-none">
        <GangaAartiWatermark opacity={0.12} tint="gold" size={540} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Regional trust marker & Sun Phase Status Tag */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#FEF08A] tracking-wide flex-wrap">
              <span className="p-1 rounded-full bg-[#FEF08A]/20">
                <MapPin className="w-4 h-4 text-[#FEF08A] shrink-0" />
              </span>
              <span>{t.trustTag}</span>
              <span aria-hidden="true" className="text-[#F59E0B]">·</span>
              <span>{t.chauffeurTag}</span>

              {/* Sun Phase Real-time indicator */}
              <span className="ml-auto sm:ml-2 px-2.5 py-0.5 rounded-full bg-white/15 text-[#FEF08A] text-xs font-bold border border-white/20">
                {sunPhase === 'dawn' && '🌅 Dawn Ushakaal'}
                {sunPhase === 'rising' && '☀️ Morning Sunrise'}
                {sunPhase === 'day' && '🌞 Radiant Day'}
                {sunPhase === 'sunset' && '🌇 Sunset Aarti'}
              </span>
            </div>

            {/* Headline with Radiant Golden Horizon Accent */}
            <h1 className="font-heritage text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance leading-tight drop-shadow-md">
              {t.heroHeadline1}{' '}
              <span className="bg-gradient-to-r from-[#FEF08A] via-[#FBBF24] to-[#F59E0B] bg-clip-text text-transparent">
                {t.heroHeadline2}
              </span>
            </h1>

            {/* Supporting Headline */}
            <p className="font-heritage text-lg sm:text-xl lg:text-2xl text-[#F8ECD5] font-semibold drop-shadow-sm">
              {t.heroSubheading}
            </p>

            {/* Supporting Description */}
            <p className="text-sm sm:text-base lg:text-lg text-[#FFFDF7]/90 max-w-2xl leading-relaxed drop-shadow-sm">
              {t.heroDescription}
            </p>

            {/* CTAs featuring the Sun & River Ganga Button Theme */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <GangaSunButton
                onClick={onPlanJourney}
                size="lg"
                variant="primary"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                {t.planJourneyBtn}
              </GangaSunButton>

              <button
                onClick={onExploreFleet}
                className="px-6 py-3.5 text-sm sm:text-base font-bold text-white border-2 border-[#C69A52] hover:bg-white/10 active:scale-98 transition-all rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
              >
                <span>{t.exploreFleetBtn}</span>
              </button>

              {onOpenGallery && (
                <button
                  onClick={onOpenGallery}
                  className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-amber-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-[#FEF08A]" />
                  <span>{lang === 'hi' ? 'काशी संदर्भ गैलरी देखें' : 'View Authentic Photos'}</span>
                </button>
              )}
            </div>

            {/* Clickable Phone Numbers Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-6 border-t border-white/20 text-xs sm:text-sm text-[#F8ECD5]">
              <span className="font-semibold text-white/80">{t.directBooking}</span>
              <a
                href={`tel:${businessInfo.primaryPhone}`}
                className="flex items-center gap-2 font-bold text-white hover:text-[#FEF08A] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#F59E0B]" />
                <span>+91 {businessInfo.primaryPhone}</span>
              </a>
              <span className="text-white/40">/</span>
              <a
                href={`tel:${businessInfo.secondaryPhone}`}
                className="flex items-center gap-2 font-bold text-white hover:text-[#FEF08A] transition-colors"
              >
                <span>+91 {businessInfo.secondaryPhone}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Authentic Verified Service Card */}
          <div className="lg:col-span-4 bg-black/40 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#F59E0B]/30 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/20">
              <span className="text-xs font-bold text-[#FEF08A] uppercase tracking-wider flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{t.verifiedServicesBadge}</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-300">● 24x7 Ready</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-heritage text-lg font-bold text-white">
                {t.reliableCabHire}
              </h3>
              <p className="text-xs text-[#FFFDF7]/80 leading-relaxed">
                Hariom Nagar, Samneghat, Lanka based commercial cab dispatch for temple darshan, river ghats, and highway pilgrimage.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-[#F8ECD5]">
              <li className="flex items-start gap-2">
                <span className="text-[#FEF08A] mt-0.5 font-bold">✓</span>
                <span>{t.serviceBullet1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FEF08A] mt-0.5 font-bold">✓</span>
                <span>{t.serviceBullet2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FEF08A] mt-0.5 font-bold">✓</span>
                <span>{t.serviceBullet3}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FEF08A] mt-0.5 font-bold">✓</span>
                <span>{t.serviceBullet4}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FEF08A] mt-0.5 font-bold">✓</span>
                <span>{t.serviceBullet5}</span>
              </li>
            </ul>

            <GangaSunButton
              onClick={onPlanJourney}
              variant="primary"
              size="md"
              className="w-full mt-2"
            >
              {t.calcInstantFareBtn}
            </GangaSunButton>
          </div>
        </div>
      </div>

      {/* Undulating River Ganga Wave Divider at Bottom of Hero */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none">
        <GangaWaveDivider fillColor="#FFFDF7" />
      </div>
    </section>
  );
};
