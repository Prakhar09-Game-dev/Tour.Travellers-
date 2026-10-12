import React, { useState } from 'react';
import {
  X,
  Menu,
  Car,
  Calculator,
  Compass,
  Phone,
  Settings,
  Globe,
  Sun,
  MapPin,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  CheckCircle,
  Volume2,
  VolumeX,
  RefreshCw,
  Bell,
  Smartphone,
  Monitor,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import type { BusinessInfo, Vehicle, PricingSettings } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import type { SunPhase } from './GangaRiverBackground.js';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';

interface ThreeBarsInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  businessInfo: BusinessInfo;
  vehicles: Vehicle[];
  pricingSettings: PricingSettings;
  lang: Language;
  onToggleLang: () => void;
  sunPhase?: SunPhase;
  onSelectSunPhase?: (phase: SunPhase) => void;
  autoGpsEnabled: boolean;
  onToggleAutoGps: (enabled: boolean) => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  screenViewMode?: 'auto' | 'mobile' | 'desktop';
  onToggleScreenViewMode?: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenSpecsModal?: (veh: Vehicle) => void;
  defaultLandmark: string;
  onChangeDefaultLandmark: (landmark: string) => void;
  initialTab?: 'info' | 'settings' | 'bar1' | 'bar2' | 'bar3';
}

export const ThreeBarsInfoDrawer: React.FC<ThreeBarsInfoDrawerProps> = ({
  isOpen,
  onClose,
  businessInfo,
  vehicles,
  pricingSettings,
  lang,
  onToggleLang,
  sunPhase = 'rising',
  onSelectSunPhase,
  autoGpsEnabled,
  onToggleAutoGps,
  soundEnabled,
  onToggleSound,
  screenViewMode = 'auto',
  onToggleScreenViewMode,
  onNavigateSection,
  onOpenSpecsModal,
  defaultLandmark,
  onChangeDefaultLandmark,
  initialTab = 'info',
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'info' | 'settings'>('info');
  const [expandedBar, setExpandedBar] = useState<'fleet' | 'pricing' | 'yatra' | 'about' | 'safety' | 'faq'>('fleet');

  if (!isOpen) return null;

  const handleBarClick = (bar: 'fleet' | 'pricing' | 'yatra' | 'about' | 'safety' | 'faq', sectionId?: string) => {
    setExpandedBar(bar);
    if (sectionId) {
      onNavigateSection(sectionId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl sm:max-w-2xl bg-[#FFFDF7] h-full shadow-2xl border-l border-[#C69A52]/40 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Background Sacred Kashi Watermark */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-8">
          <KashiVishwanathWatermark opacity={1} tint="gold" size={480} />
        </div>

        {/* Drawer Header with 3 Bars Symbol */}
        <div className="relative z-10 bg-gradient-to-r from-[#821B25] via-[#9B212B] to-[#B5222A] text-white p-5 sm:p-6 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C69A52]/30 border border-[#C69A52] flex items-center justify-center text-amber-100 shadow-xs">
                {/* Visual 3 Bars Emblem */}
                <div className="flex flex-col gap-1 w-5">
                  <span className="h-0.5 w-full bg-white rounded-full"></span>
                  <span className="h-0.5 w-full bg-amber-300 rounded-full"></span>
                  <span className="h-0.5 w-full bg-white rounded-full"></span>
                </div>
              </div>
              <div>
                <h3 className="font-heritage text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>{lang === 'hi' ? '३-बार संपूर्ण जानकारी व वेबसाइट सेटिंग्स' : '3-Bars Info Hub & Website Settings'}</span>
                </h3>
                <p className="text-xs text-amber-200/90 font-medium">
                  {lang === 'hi' ? 'उज्जवल टूर्स एवं ट्रैवल्स · लंका, वाराणसी' : 'Ujjawal Tour & Travels · Lanka, Varanasi'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Top Switcher: All Info vs Website Settings */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-black/20 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveMainTab('info')}
              className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeMainTab === 'info'
                  ? 'bg-white text-[#821B25] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? '📋 ३-बार सम्पूर्ण जानकारी' : '📋 3-Bars Info Hub'}</span>
            </button>
            <button
              onClick={() => setActiveMainTab('settings')}
              className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeMainTab === 'settings'
                  ? 'bg-white text-[#821B25] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? '⚙️ संपूर्ण वेबसाइट सेटिंग्स' : '⚙️ Website Settings'}</span>
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {activeMainTab === 'info' ? (
            <div className="space-y-4">
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-[#292321] space-y-1">
                <span className="font-bold text-[#821B25] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B5222A]" />
                  <span>{lang === 'hi' ? '३-बार जानकारी प्रणाली:' : '3-Bars Complete Knowledge Base:'}</span>
                </span>
                <p className="text-[11px] text-[#292321]/80">
                  {lang === 'hi'
                    ? 'प्रत्येक बार पर टैप करके वाहन बेड़ा, पारदर्शी किराया नीति और तीर्थ यात्रा लॉजिस्टिक्स की संपूर्ण जानकारी प्राप्त करें।'
                    : 'Tap any bar below for verified vehicle fleet specs, transparent rate card policies, and Varanasi pilgrimage travel logistics.'}
                </p>
              </div>

              {/* BAR 1: FLEET DIRECTORY */}
              <div className="rounded-2xl border border-[#C69A52]/40 bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => setExpandedBar(prev => (prev === 'fleet' ? 'fleet' : 'fleet'))}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FFF9F0] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#821B25] text-amber-200 font-bold flex items-center justify-center text-xs shadow-2xs">
                      1
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#821B25]">
                        {lang === 'hi' ? 'बार १: वाणिज्यिक वाहन बेड़ा एवं विनिर्देश' : 'Bar 1: Commercial Fleet & Vehicle Directory'}
                      </div>
                      <div className="text-[11px] text-[#292321]/70">
                        {vehicles.length} {lang === 'hi' ? 'सत्यापित वाहन · पीली नंबर प्लेट · एसी युक्त' : 'Verified Cabs · Commercial Plates · Chauffeur-Driven'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-[#821B25] transition-transform ${expandedBar === 'fleet' ? 'rotate-90' : ''}`} />
                </button>

                {expandedBar === 'fleet' && (
                  <div className="p-4 pt-0 border-t border-[#C69A52]/20 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
                      {vehicles.map(v => (
                        <div
                          key={v.id}
                          className="p-3 rounded-xl bg-[#FFFDF7] border border-[#C69A52]/30 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#292321]">{v.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3E8D5] text-[#821B25]">
                              ₹{v.perKmRate}/km
                            </span>
                          </div>
                          <div className="text-[11px] text-[#292321]/70">
                            👥 {v.seatingCapacity} {lang === 'hi' ? 'सीटें' : 'Seats'} · 🧳 {v.luggageCapacity}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-medium">
                            ✓ {v.acAvailable ? (lang === 'hi' ? 'चिल्ड एसी' : 'Chilled AC') : 'Non-AC'} · {v.carrierAvailable ? (lang === 'hi' ? 'रूफ कैरियर' : 'Roof Carrier') : (lang === 'hi' ? 'बूट स्पेस' : 'Boot Space')}
                          </div>
                          {onOpenSpecsModal && (
                            <button
                              onClick={() => { onOpenSpecsModal(v); onClose(); }}
                              className="text-[11px] font-bold text-[#821B25] hover:underline cursor-pointer block pt-1"
                            >
                              {lang === 'hi' ? 'पूर्ण विवरण देखें →' : 'View Full Specs →'}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => { onNavigateSection('fleet'); onClose(); }}
                      className="w-full py-2 text-xs font-bold rounded-xl bg-[#F3E8D5] hover:bg-[#C69A52]/30 text-[#821B25] transition-colors cursor-pointer text-center"
                    >
                      {lang === 'hi' ? 'मुख्य पृष्ठ पर सभी वाहन देखें →' : 'Browse All Vehicles on Page →'}
                    </button>
                  </div>
                )}
              </div>

              {/* BAR 2: RATE CARD & PRICING RULES */}
              <div className="rounded-2xl border border-[#C69A52]/40 bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => setExpandedBar(prev => (prev === 'pricing' ? 'fleet' : 'pricing'))}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FFF9F0] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#C69A52] text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                      2
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#821B25]">
                        {lang === 'hi' ? 'बार २: पारदर्शी किराया नीति एवं रेट कार्ड' : 'Bar 2: Transparent Rate Card & Pricing Policy'}
                      </div>
                      <div className="text-[11px] text-[#292321]/70">
                        {lang === 'hi' ? 'शून्य गुप्त शुल्क · वास्तविक किलोमीटर गणना' : '₹0 Hidden Fees · True Road Mileage · Fixed Allowances'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-[#821B25] transition-transform ${expandedBar === 'pricing' ? 'rotate-90' : ''}`} />
                </button>

                {expandedBar === 'pricing' && (
                  <div className="p-4 pt-0 border-t border-[#C69A52]/20 space-y-3">
                    <div className="pt-3 space-y-2 text-xs text-[#292321]">
                      <div className="flex justify-between py-1.5 border-b border-stone-100">
                        <span>{lang === 'hi' ? 'स्थानीय वाराणसी न्यूनतम सीमा:' : 'Local Varanasi Package Minimum:'}</span>
                        <span className="font-bold text-[#821B25]">
                          {pricingSettings.minimumLocalHours} {lang === 'hi' ? 'घंटे' : 'Hrs'} / {pricingSettings.minimumLocalDistanceKm} km
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-stone-100">
                        <span>{lang === 'hi' ? 'आउटस्टेशन न्यूनतम दूरी प्रति दिन:' : 'Outstation Minimum per Day:'}</span>
                        <span className="font-bold text-[#821B25]">{pricingSettings.minimumOutstationKmPerDay} km</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-stone-100">
                        <span>{lang === 'hi' ? 'रात्रि शुल्क (रात १० से सुबह ६):' : 'Night Charge (10 PM to 6 AM):'}</span>
                        <span className="font-bold text-[#821B25]">₹{pricingSettings.standardNightCharge}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-stone-100">
                        <span>{lang === 'hi' ? 'ड्राइवर दैनिक भत्ता (आउटस्टेशन):' : 'Driver Allowance (Outstation):'}</span>
                        <span className="font-bold text-[#821B25]">₹{pricingSettings.driverAllowancePerDay}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span>{lang === 'hi' ? 'टोल टैक्स एवं पार्किंग:' : 'Tolls & Parking:'}</span>
                        <span className="font-bold text-emerald-700">{lang === 'hi' ? 'वास्तविक रसीद अनुसार' : 'At Actual Slips / Fastag'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { onNavigateSection('calculator'); onClose(); }}
                      className="w-full py-2 text-xs font-bold rounded-xl bg-[#821B25] hover:bg-[#B5222A] text-white transition-colors cursor-pointer text-center"
                    >
                      {lang === 'hi' ? 'फेयर कैलकुलेटर खोलें →' : 'Open Fare Calculator →'}
                    </button>
                  </div>
                )}
              </div>

              {/* BAR 3: PILGRIMAGE CIRCUITS & AIRPORT ROUTES */}
              <div className="rounded-2xl border border-[#C69A52]/40 bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => setExpandedBar(prev => (prev === 'yatra' ? 'fleet' : 'yatra'))}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FFF9F0] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#B5222A] text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                      3
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#821B25]">
                        {lang === 'hi' ? 'बार ३: तीर्थ यात्रा सर्किट एवं एयरपोर्ट लॉजिस्टिक्स' : 'Bar 3: Pilgrimage Yatra Circuits & Airport Transit'}
                      </div>
                      <div className="text-[11px] text-[#292321]/70">
                        {lang === 'hi' ? 'काशी · सारनाथ · अयोध्या · प्रयागराज संगम · बोधगया' : 'Kashi · Sarnath · Ayodhya · Prayagraj · Bodh Gaya · VNS'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-[#821B25] transition-transform ${expandedBar === 'yatra' ? 'rotate-90' : ''}`} />
                </button>

                {expandedBar === 'yatra' && (
                  <div className="p-4 pt-0 border-t border-[#C69A52]/20 space-y-3">
                    <div className="pt-3 space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#FFFDF7] border border-[#C69A52]/20">
                        <div className="font-bold text-[#821B25]">✈️ {lang === 'hi' ? 'बाबतपुर एयरपोर्ट (VNS) ट्रांसफर' : 'Babatpur Airport (VNS) Transfer'}</div>
                        <div className="text-[11px] text-[#292321]/70">
                          26 km · 45 {lang === 'hi' ? 'मिनट' : 'mins'} · {lang === 'hi' ? 'फ्लाइट आगमन पर नेम-बोर्ड के साथ स्वागत' : 'Flight Meet & Greet with Name-board at Arrival Gate'}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FFFDF7] border border-[#C69A52]/20">
                        <div className="font-bold text-[#821B25]">🛕 {lang === 'hi' ? 'काशी-अयोध्या-प्रयागराज महात्रिवेणी सर्किट' : 'Kashi-Ayodhya-Prayagraj Sangam Yatra'}</div>
                        <div className="text-[11px] text-[#292321]/70">
                          {lang === 'hi' ? '३ दिवसीय पवित्र संगम स्नान व श्रीराम जन्मभूमि दर्शन' : '3-Day Holy Sangam Holy Snan & Ram Janmabhoomi Darshan'}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FFFDF7] border border-[#C69A52]/20">
                        <div className="font-bold text-[#821B25]">☸️ {lang === 'hi' ? 'सारनाथ बौद्ध तीर्थ यात्रा' : 'Sarnath Buddhist Circuit'}</div>
                        <div className="text-[11px] text-[#292321]/70">
                          12 km · {lang === 'hi' ? 'धमेख स्तूप, अशोक स्तंभ, हिरण पार्क' : 'Dhamek Stupa, Ashoka Pillar, Deer Park'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => { onNavigateSection('packages'); onClose(); }}
                      className="w-full py-2 text-xs font-bold rounded-xl bg-[#F3E8D5] hover:bg-[#C69A52]/30 text-[#821B25] transition-colors cursor-pointer text-center"
                    >
                      {lang === 'hi' ? 'सभी तीर्थ पैकेज देखें →' : 'View Pilgrimage Packages →'}
                    </button>
                  </div>
                )}
              </div>

              {/* Additional Information Sections */}
              <div className="pt-2 border-t border-[#C69A52]/20 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#292321]/80">
                  {lang === 'hi' ? 'कार्यालय एवं सुरक्षा दिशानिर्देश' : 'Headquarters & Safety Guidelines'}
                </h4>

                <div className="p-3.5 rounded-2xl bg-white border border-[#C69A52]/30 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#821B25] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#292321]">{businessInfo.name}</div>
                      <div className="text-[11px] text-[#292321]/80">{businessInfo.location} · {businessInfo.landmarks}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-stone-100 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'hi' ? '१००% वाणिज्यिक परमिट, अनुभवी स्थानीय ड्राइवर' : '100% Commercial Permits & Police-Verified Drivers'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* SETTINGS OF THE WHOLE WEBSITE */
            <div className="space-y-5">
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-[#292321] space-y-1">
                <span className="font-bold text-[#821B25] flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-[#B5222A]" />
                  <span>{lang === 'hi' ? 'संपूर्ण वेबसाइट नियंत्रण एवं सेटिंग्स:' : 'Whole Website Preferences & Controls:'}</span>
                </span>
                <p className="text-[11px] text-[#292321]/80">
                  {lang === 'hi'
                    ? 'यहाँ से भाषा, सूर्य एवं गंगा का वातावरण, जीपीएस ऑटो-डिटेक्शन, ध्वनि और प्रदर्शन मोड नियंत्रित करें।'
                    : 'Configure language, Ganga sun atmosphere, GPS auto-detection, audio feedback, and screen modes.'}
                </p>
              </div>

              {/* Setting 1: Language */}
              <div className="p-4 rounded-2xl bg-white border border-[#C69A52]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#821B25]" />
                    <span className="font-bold text-xs text-[#292321]">
                      {lang === 'hi' ? 'वेबसाइट की भाषा' : 'Website Language'}
                    </span>
                  </div>
                  <button
                    onClick={onToggleLang}
                    className="px-3 py-1 text-xs font-bold rounded-lg border border-[#821B25] bg-[#FFF9F0] text-[#821B25] hover:bg-[#821B25] hover:text-white transition-all cursor-pointer"
                  >
                    {lang === 'en' ? 'हिन्दी में बदलें (Hindi)' : 'Switch to English'}
                  </button>
                </div>
                <p className="text-[11px] text-[#292321]/70">
                  {lang === 'hi' ? 'वर्तमान में हिन्दी चयनित है।' : 'Currently viewing in English.'}
                </p>
              </div>

              {/* Setting 2: Sun Phase Atmosphere */}
              <div className="p-4 rounded-2xl bg-white border border-[#C69A52]/30 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#821B25]" />
                  <span className="font-bold text-xs text-[#292321]">
                    {lang === 'hi' ? 'माँ गंगा एवं क्षितिज का समय (वातावरण)' : 'Ganga Horizon & Sun Atmosphere'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                  {[
                    { id: 'dawn', labelHi: '🌅 भोर (Dawn)', labelEn: '🌅 Dawn' },
                    { id: 'rising', labelHi: '☀️ सूर्योदय (Sunrise)', labelEn: '☀️ Sunrise' },
                    { id: 'day', labelHi: '🌞 दोपहर (Midday)', labelEn: '🌞 Midday' },
                    { id: 'sunset', labelHi: '🌇 संध्या (Sunset)', labelEn: '🌇 Sunset' },
                  ].map(ph => (
                    <button
                      key={ph.id}
                      onClick={() => onSelectSunPhase && onSelectSunPhase(ph.id as SunPhase)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        sunPhase === ph.id
                          ? 'border-[#821B25] bg-[#821B25] text-white font-bold shadow-xs'
                          : 'border-[#C69A52]/30 bg-[#FFFDF7] text-[#292321] hover:bg-[#F3E8D5]'
                      }`}
                    >
                      {lang === 'hi' ? ph.labelHi : ph.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Setting 3: Phone GPS Auto Detection */}
              <div className="p-4 rounded-2xl bg-white border border-[#C69A52]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#821B25]" />
                    <div>
                      <div className="font-bold text-xs text-[#292321]">
                        {lang === 'hi' ? 'फोन जीपीएस ऑटो-डिटेक्शन' : 'Phone GPS Auto-Detection'}
                      </div>
                      <div className="text-[11px] text-[#292321]/70">
                        {lang === 'hi' ? 'कैलकुलेटर में ऑटोमेटिक वर्तमान स्थान भरना' : 'Auto-detect coordinates for pickup location'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleAutoGps(!autoGpsEnabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      autoGpsEnabled ? 'bg-emerald-600 justify-end' : 'bg-stone-300 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-xs block" />
                  </button>
                </div>
              </div>

              {/* Setting 4: Default Pickup Landmark */}
              <div className="p-4 rounded-2xl bg-white border border-[#C69A52]/30 space-y-2">
                <div className="font-bold text-xs text-[#292321]">
                  {lang === 'hi' ? 'डिफ़ॉल्ट पिकअप केंद्र' : 'Default City Landmark'}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Lanka, Varanasi (BHU Gate)',
                    'Varanasi Cantt Railway Station',
                    'Assi Ghat, Varanasi',
                    'Babatpur Airport (VNS)',
                  ].map(lm => (
                    <button
                      key={lm}
                      onClick={() => onChangeDefaultLandmark(lm)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        defaultLandmark === lm
                          ? 'border-[#821B25] bg-[#F3E8D5] text-[#821B25] font-bold'
                          : 'border-stone-200 bg-white text-[#292321]/80 hover:bg-stone-50'
                      }`}
                    >
                      {lm}
                    </button>
                  ))}
                </div>
              </div>

              {/* Setting 5: Sound Effects */}
              <div className="p-4 rounded-2xl bg-white border border-[#C69A52]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-stone-400" />
                    )}
                    <div>
                      <div className="font-bold text-xs text-[#292321]">
                        {lang === 'hi' ? 'मंदिर शंख एवं बुकिंग ध्वनि प्रभाव' : 'Temple Chime & Booking Sound'}
                      </div>
                      <div className="text-[11px] text-[#292321]/70">
                        {lang === 'hi' ? 'बुकिंग कन्फर्म होने पर मधुर घंटी व शंख ध्वनि' : 'Sacred chime on enquiry confirmation'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleSound(!soundEnabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      soundEnabled ? 'bg-emerald-600 justify-end' : 'bg-stone-300 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-xs block" />
                  </button>
                </div>
              </div>

              {/* Setting 6: Screen Frame Mode */}
              {onToggleScreenViewMode && (
                <div className="p-4 rounded-2xl bg-white border border-[#C69A52]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {screenViewMode === 'mobile' ? (
                        <Smartphone className="w-4 h-4 text-[#821B25]" />
                      ) : (
                        <Monitor className="w-4 h-4 text-[#821B25]" />
                      )}
                      <div>
                        <div className="font-bold text-xs text-[#292321]">
                          {lang === 'hi' ? 'स्क्रीन प्रदर्शन मोड' : 'Screen Viewport Mode'}
                        </div>
                        <div className="text-[11px] text-[#292321]/70">
                          {screenViewMode === 'mobile'
                            ? (lang === 'hi' ? 'मोबाइल फोन फ्रेम सक्रिय है' : 'Mobile phone simulation active')
                            : (lang === 'hi' ? 'पूर्ण पीसी / डेस्कटॉप स्क्रीन' : 'Full desktop widescreen')}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={onToggleScreenViewMode}
                      className="px-3 py-1 text-xs font-bold rounded-lg border border-[#C69A52] bg-[#FFF9F0] text-[#821B25] hover:bg-[#F3E8D5] transition-colors cursor-pointer"
                    >
                      {screenViewMode === 'mobile' ? 'Switch to PC' : 'Switch to Mobile'}
                    </button>
                  </div>
                </div>
              )}

              {/* Setting 7: Reset Preferences */}
              <div className="pt-2 border-t border-[#C69A52]/20">
                <button
                  onClick={() => {
                    localStorage.removeItem('utt_filters');
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'वेबसाइट प्राथमिकताएं रीसेट करें' : 'Reset Website Preferences to Default'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Sticky Footer */}
        <div className="relative z-10 p-4 bg-[#FFF9F0] border-t border-[#C69A52]/30 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-[#292321]/80">
            <span className="font-bold text-[#821B25]">Lanka Varanasi Office:</span> +91 {businessInfo.primaryPhone}
          </div>
          <a
            href={`tel:${businessInfo.primaryPhone}`}
            className="px-3.5 py-1.5 rounded-xl bg-[#821B25] hover:bg-[#B5222A] text-white text-xs font-bold transition-colors"
          >
            {lang === 'hi' ? 'कॉल करें' : 'Call Desk'}
          </a>
        </div>
      </div>
    </div>
  );
};
