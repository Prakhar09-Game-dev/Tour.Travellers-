import React, { useState, useEffect } from 'react';
import { Phone, Shield, Menu, X, Globe, Sun, Camera, Smartphone, Monitor, User, Settings, Info } from 'lucide-react';
import { GangaSunButton } from './GangaSunButton.js';
import type { SunPhase } from './GangaRiverBackground.js';
import type { BusinessInfo, UserProfile } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import { translations } from '../i18n/translations.js';
import { useScreenMode } from '../hooks/useScreenMode.js';

interface NavbarProps {
  businessInfo: BusinessInfo;
  onNavigate: (sectionId: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  lang: Language;
  onToggleLang: () => void;
  sunPhase?: SunPhase;
  onCycleSunPhase?: () => void;
  screenViewMode?: 'auto' | 'mobile' | 'desktop';
  onToggleScreenViewMode?: () => void;
  currentUser?: UserProfile | null;
  onOpenLogin?: () => void;
  onOpenProfile?: () => void;
  onOpenThreeBarsDrawer?: (tab?: 'info' | 'settings') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  businessInfo,
  onNavigate,
  isAdminOpen,
  setIsAdminOpen,
  lang,
  onToggleLang,
  sunPhase,
  onCycleSunPhase,
  screenViewMode = 'auto',
  onToggleScreenViewMode,
  currentUser,
  onOpenLogin,
  onOpenProfile,
  onOpenThreeBarsDrawer,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile, isSmallMobile } = useScreenMode();
  const t = translations[lang];

  // Auto-close mobile menu when screen is resized/switched from mobile to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F0]/95 backdrop-blur-md border-b border-[#C69A52]/30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-20">
          {/* Zone 1: Single text element wordmark with Sun emblem */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('hero')}
              className="text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#821B25] flex items-center gap-2.5"
            >
              <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#821B25] via-[#B5222A] to-[#C69A52] flex items-center justify-center text-white shadow-xs group-hover:rotate-45 transition-transform duration-500">
                <Sun className="w-5 h-5 text-white" />
              </span>
              <div>
                <div className="font-heritage text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#821B25] group-hover:text-[#B5222A] transition-colors whitespace-nowrap leading-tight">
                  {t.brand}
                </div>
                <span className="text-[10px] text-[#821B25] font-bold tracking-widest uppercase block">
                  Lanka · Varanasi
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#292321]">
            <button
              onClick={() => handleNavClick('fleet')}
              className="hover:text-[#821B25] transition-colors whitespace-nowrap cursor-pointer hover:underline underline-offset-4 decoration-[#C69A52]"
            >
              {t.navFleet}
            </button>
            <button
              onClick={() => handleNavClick('calculator')}
              className="hover:text-[#821B25] transition-colors whitespace-nowrap cursor-pointer hover:underline underline-offset-4 decoration-[#C69A52]"
            >
              {t.navCalculator}
            </button>
            <button
              onClick={() => handleNavClick('packages')}
              className="hover:text-[#821B25] transition-colors whitespace-nowrap cursor-pointer hover:underline underline-offset-4 decoration-[#C69A52]"
            >
              {t.navPackages}
            </button>
            <button
              onClick={() => handleNavClick('heritage-gallery')}
              className="hover:text-[#821B25] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 hover:underline underline-offset-4 decoration-[#C69A52]"
            >
              <Camera className="w-3.5 h-3.5 text-[#821B25]" />
              <span>{lang === 'hi' ? 'गैलरी' : 'Gallery'}</span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="hover:text-[#821B25] transition-colors whitespace-nowrap cursor-pointer hover:underline underline-offset-4 decoration-[#C69A52]"
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="hover:text-[#821B25] transition-colors whitespace-nowrap cursor-pointer hover:underline underline-offset-4 decoration-[#C69A52]"
            >
              {t.navContact}
            </button>
          </nav>

          {/* Zone 3: Primary Action + Language Toggle + Live Sun Phase pill */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Sun Phase Indicator & Interactive Switcher */}
            {sunPhase && onCycleSunPhase && (
              <button
                onClick={onCycleSunPhase}
                title="Click to cycle Sun & Ganga Time: Dawn → Sunrise → Day → Sunset"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-[#C69A52]/50 bg-[#F3E8D5] text-[#821B25] hover:border-[#821B25] transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
              >
                <span>
                  {sunPhase === 'dawn' && '🌅 Dawn'}
                  {sunPhase === 'rising' && '☀️ Sunrise'}
                  {sunPhase === 'day' && '🌞 Midday'}
                  {sunPhase === 'sunset' && '🌇 Sunset'}
                </span>
                <span className="text-[10px] text-[#821B25] bg-white/60 px-1 py-0.2 rounded font-extrabold">
                  ↺
                </span>
              </button>
            )}

            {/* Bilingual Switch Button */}
            <button
              onClick={onToggleLang}
              title={lang === 'en' ? 'Switch to Hindi (हिन्दी)' : 'अंग्रेजी में देखें (English)'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-[#C69A52]/60 bg-white text-[#821B25] hover:bg-[#F3E8D5] transition-all cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-[#821B25]" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Mobile / PC Screen-Oriented Viewport Switcher */}
            {onToggleScreenViewMode && (
              <button
                onClick={onToggleScreenViewMode}
                title={
                  screenViewMode === 'mobile'
                    ? 'Switch to PC Desktop Screen Mode'
                    : 'Switch to Mobile Screen Phone Frame'
                }
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-[#C69A52]/60 bg-[#FFFDF7] text-[#821B25] hover:bg-[#F3E8D5] transition-all cursor-pointer whitespace-nowrap shadow-2xs"
              >
                {screenViewMode === 'mobile' ? (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-[#821B25]" />
                    <span>PC View</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-[#821B25]" />
                    <span>Mobile Screen</span>
                  </>
                )}
              </button>
            )}

            {/* 3-BARS INFO HUB BUTTON */}
            {onOpenThreeBarsDrawer && (
              <button
                onClick={() => onOpenThreeBarsDrawer('info')}
                title={lang === 'hi' ? '३-बार सम्पूर्ण जानकारी खोलें' : 'Open 3-Bars Complete Info Hub'}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-[#821B25] bg-gradient-to-r from-[#FFFDF7] to-[#F3E8D5] text-[#821B25] hover:bg-[#821B25] hover:text-white transition-all cursor-pointer shadow-xs hover:scale-102"
              >
                <div className="flex flex-col gap-0.5 w-3.5">
                  <span className="h-0.5 w-full bg-[#821B25] rounded-full" />
                  <span className="h-0.5 w-full bg-[#C69A52] rounded-full" />
                  <span className="h-0.5 w-full bg-[#821B25] rounded-full" />
                </div>
                <span className="font-extrabold">{lang === 'hi' ? '३-बार' : '3-Bars'}</span>
              </button>
            )}

            {/* WEBSITE SETTINGS BUTTON */}
            {onOpenThreeBarsDrawer && (
              <button
                onClick={() => onOpenThreeBarsDrawer('settings')}
                title={lang === 'hi' ? 'संपूर्ण वेबसाइट सेटिंग्स' : 'Whole Website Settings'}
                className="hidden sm:flex p-1.5 rounded-xl border border-[#C69A52]/60 bg-white hover:bg-[#F3E8D5] text-[#821B25] transition-colors cursor-pointer shadow-2xs"
              >
                <Settings className="w-4 h-4 text-[#821B25]" />
              </button>
            )}

            {/* PASSENGER USER LOGIN / PROFILE */}
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                title={lang === 'hi' ? 'यात्री खाता व बुकिंग इतिहास' : 'Passenger Account & Trips'}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[#C69A52] bg-[#FFF9F0] hover:bg-[#F3E8D5] text-[#821B25] transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-[#821B25] text-amber-200 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold max-w-[70px] sm:max-w-[100px] truncate">{currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#C69A52] bg-white hover:bg-[#F3E8D5] text-[#821B25] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <User className="w-3.5 h-3.5 text-[#821B25]" />
                <span>{lang === 'hi' ? 'लॉगिन' : 'Login'}</span>
              </button>
            )}

            <a
              href={`tel:${businessInfo.primaryPhone}`}
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-[#821B25] hover:text-[#B5222A] py-2 px-3 rounded-lg bg-[#F3E8D5]/70 hover:bg-[#F3E8D5] transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#821B25]" />
              <span>+91 {businessInfo.primaryPhone}</span>
            </a>

            <GangaSunButton
              size="sm"
              variant="primary"
              onClick={() => handleNavClick('calculator')}
              className="hidden sm:inline-flex"
            >
              {t.bookJourneyBtn}
            </GangaSunButton>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:text-[#7C2D12] hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#C69A52]/30 space-y-3 animate-in slide-in-from-top-2 duration-150">
            {/* Quick 3-Bars & Settings row in mobile menu */}
            <div className="grid grid-cols-2 gap-2">
              {onOpenThreeBarsDrawer && (
                <button
                  onClick={() => {
                    onOpenThreeBarsDrawer('info');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#FFFDF7] to-[#F3E8D5] border-2 border-[#821B25] text-[#821B25] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5 w-3.5">
                    <span className="h-0.5 w-full bg-[#821B25] rounded-full" />
                    <span className="h-0.5 w-full bg-[#C69A52] rounded-full" />
                    <span className="h-0.5 w-full bg-[#821B25] rounded-full" />
                  </div>
                  <span>{lang === 'hi' ? '३-बार संपूर्ण जानकारी' : '3-Bars Info Hub'}</span>
                </button>
              )}
              {onOpenThreeBarsDrawer && (
                <button
                  onClick={() => {
                    onOpenThreeBarsDrawer('settings');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-white border border-[#C69A52]/50 text-[#821B25] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#821B25]" />
                  <span>{lang === 'hi' ? 'वेबसाइट सेटिंग्स' : 'Site Settings'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
              <button
                onClick={() => handleNavClick('fleet')}
                className="p-2.5 text-left rounded-lg bg-white hover:bg-[#F3E8D5] text-[#821B25]"
              >
                {t.navFleet}
              </button>
              <button
                onClick={() => handleNavClick('calculator')}
                className="p-2.5 text-left rounded-lg bg-white hover:bg-[#F3E8D5] text-[#821B25]"
              >
                {t.navCalculator}
              </button>
              <button
                onClick={() => handleNavClick('packages')}
                className="p-2.5 text-left rounded-lg bg-white hover:bg-[#F3E8D5] text-[#821B25]"
              >
                {t.navPackages}
              </button>
              <button
                onClick={() => handleNavClick('heritage-gallery')}
                className="p-2.5 text-left rounded-lg bg-white hover:bg-[#F3E8D5] text-[#821B25]"
              >
                {lang === 'hi' ? 'धरोहर गैलरी' : 'Heritage Gallery'}
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="p-2.5 text-left rounded-lg bg-white hover:bg-[#F3E8D5] text-[#821B25]"
              >
                {t.navAbout}
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="p-2.5 text-left rounded-lg bg-white hover:bg-[#F3E8D5] text-[#821B25]"
              >
                {t.navContact}
              </button>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`tel:${businessInfo.primaryPhone}`}
                className="py-2.5 px-4 rounded-xl bg-[#F3E8D5] text-[#821B25] text-xs font-bold flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#821B25]" />
                <span>Call +91 {businessInfo.primaryPhone}</span>
              </a>

              <GangaSunButton
                size="md"
                variant="primary"
                onClick={() => handleNavClick('calculator')}
                className="w-full"
              >
                {t.bookJourneyBtn}
              </GangaSunButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
