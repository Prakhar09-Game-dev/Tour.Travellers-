import React from 'react';
import { ShieldCheck, Calculator, Compass, Sparkles, ChevronRight, Settings } from 'lucide-react';
import type { Language } from '../i18n/translations.js';

interface ThreeInfoMetricsBarsProps {
  onOpenBarInfo: (bar: 'fleet' | 'pricing' | 'yatra') => void;
  onOpenSettings: () => void;
  lang: Language;
}

export const ThreeInfoMetricsBars: React.FC<ThreeInfoMetricsBarsProps> = ({
  onOpenBarInfo,
  onOpenSettings,
  lang,
}) => {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-8 sm:mb-12">
      {/* 3 Prominent Information Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* BAR 1: Fleet Readiness */}
        <div
          onClick={() => onOpenBarInfo('fleet')}
          className="group relative rounded-2xl bg-gradient-to-br from-[#FFFDF7] to-[#FFF9F0] p-4 sm:p-5 border-2 border-[#C69A52]/40 hover:border-[#821B25] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-0.5"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#821B25]" />
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#821B25] text-amber-200 text-[10px] font-black flex items-center justify-center shrink-0">
                  1
                </span>
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#821B25]">
                  {lang === 'hi' ? 'बार १: वाहन बेड़ा' : 'BAR 1: FLEET DIRECTORY'}
                </span>
              </div>
              <h4 className="font-heritage text-base sm:text-lg font-bold text-[#292321] group-hover:text-[#821B25] transition-colors leading-snug">
                {lang === 'hi' ? '१००% पीली प्लेट कमर्शियल कैब्स' : '100% Commercial Fleet Verified'}
              </h4>
              <p className="text-xs text-[#292321]/75 leading-relaxed">
                {lang === 'hi'
                  ? 'Dzire, Ertiga, Innova, Tempo · Chilled AC · अनुभवी लंका ड्राइवर'
                  : 'Sedans, MPVs & Travellers · Chilled AC · Police Verified Chauffeurs'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#F3E8D5] group-hover:bg-[#821B25] text-[#821B25] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#C69A52]/20 flex items-center justify-between text-[11px] text-[#821B25] font-bold">
            <span>{lang === 'hi' ? 'विस्तृत विवरण देखें' : 'View Fleet Specs'}</span>
            <span className="text-[10px] bg-amber-100/80 px-2 py-0.5 rounded-md">
              {lang === 'hi' ? '५ वाहन मॉडल' : '5 Vehicle Models'}
            </span>
          </div>
        </div>

        {/* BAR 2: Transparent GPS Pricing Engine */}
        <div
          onClick={() => onOpenBarInfo('pricing')}
          className="group relative rounded-2xl bg-gradient-to-br from-[#FFFDF7] to-[#FFF9F0] p-4 sm:p-5 border-2 border-[#C69A52]/40 hover:border-[#821B25] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-0.5"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C69A52]" />
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C69A52] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  2
                </span>
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#821B25]">
                  {lang === 'hi' ? 'बार २: पारदर्शी दरें' : 'BAR 2: GPS RATE ENGINE'}
                </span>
              </div>
              <h4 className="font-heritage text-base sm:text-lg font-bold text-[#292321] group-hover:text-[#821B25] transition-colors leading-snug">
                {lang === 'hi' ? 'शून्य गुप्त शुल्क एवं सटीक जीपीएस' : '₹0 Hidden Fees & Live GPS'}
              </h4>
              <p className="text-xs text-[#292321]/75 leading-relaxed">
                {lang === 'hi'
                  ? 'पारदर्शी ₹/किमी दरें · ८० किमी लोकल पैकेज · स्पष्ट रात्रि व ड्राइवर भत्ता'
                  : 'Transparent per-km rate · 80km local package · Verified road distances'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#F3E8D5] group-hover:bg-[#821B25] text-[#821B25] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#C69A52]/20 flex items-center justify-between text-[11px] text-[#821B25] font-bold">
            <span>{lang === 'hi' ? 'रेट कार्ड नीति पढ़ें' : 'Rate Card Policies'}</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
              {lang === 'hi' ? '१००% पारदर्शी' : '100% Transparent'}
            </span>
          </div>
        </div>

        {/* BAR 3: Pilgrimage & Airport Concierge */}
        <div
          onClick={() => onOpenBarInfo('yatra')}
          className="group relative rounded-2xl bg-gradient-to-br from-[#FFFDF7] to-[#FFF9F0] p-4 sm:p-5 border-2 border-[#C69A52]/40 hover:border-[#821B25] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-0.5"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#B5222A]" />
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#B5222A] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  3
                </span>
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#821B25]">
                  {lang === 'hi' ? 'बार ३: तीर्थ व एयरपोर्ट' : 'BAR 3: PILGRIM CONCIERGE'}
                </span>
              </div>
              <h4 className="font-heritage text-base sm:text-lg font-bold text-[#292321] group-hover:text-[#821B25] transition-colors leading-snug">
                {lang === 'hi' ? 'काशी · प्रयाग · अयोध्या · एयरपोर्ट' : 'Kashi · Ayodhya · Prayagraj · Airport'}
              </h4>
              <p className="text-xs text-[#292321]/75 leading-relaxed">
                {lang === 'hi'
                  ? 'बाबतपुर एयरपोर्ट मीट-एंड-ग्रीट · वीआईपी दर्शन सहायता · २४/७ लंका कार्यालय'
                  : 'Babatpur VNS meet & greet · VIP Darshan guidance · 24/7 Lanka desk'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#F3E8D5] group-hover:bg-[#821B25] text-[#821B25] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#C69A52]/20 flex items-center justify-between text-[11px] text-[#821B25] font-bold">
            <span>{lang === 'hi' ? 'तीर्थ सर्किट विवरण' : 'Yatra Circuits & Transit'}</span>
            <span className="text-[10px] bg-red-100 text-[#821B25] px-2 py-0.5 rounded-md font-bold">
              {lang === 'hi' ? '२४/७ सेवा' : '24/7 Available'}
            </span>
          </div>
        </div>
      </div>

      {/* Website Quick Settings Bar Bar below */}
      <div className="mt-3 flex items-center justify-between bg-white/90 backdrop-blur-md rounded-xl p-2.5 sm:px-4 border border-[#C69A52]/30 shadow-2xs text-xs flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[#292321]">
          <span className="font-bold text-[#821B25] flex items-center gap-1">
            <span>⚙️ {lang === 'hi' ? 'वेबसाइट सेटिंग्स:' : 'Whole Website Settings:'}</span>
          </span>
          <span className="text-[11px] text-[#292321]/70 hidden sm:inline">
            {lang === 'hi'
              ? 'थीम, भाषा, फोन जीपीएस और स्क्रीन मोड एक क्लिक में बदलें'
              : 'Customize theme, language, phone GPS, and screen modes'}
          </span>
        </div>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F3E8D5] hover:bg-[#821B25] text-[#821B25] hover:text-white font-bold transition-all cursor-pointer shadow-2xs"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'वेबसाइट सेटिंग्स खोलें' : 'Open Website Settings'}</span>
        </button>
      </div>
    </section>
  );
};
