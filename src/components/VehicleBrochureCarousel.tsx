import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Briefcase,
  Snowflake,
  CheckCircle2,
  Calculator,
  FileText,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { GangaAartiWatermark } from './GangaAartiWatermark.js';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';
import { GangaSunButton } from './GangaSunButton.js';
import { VehicleTripFilterBar } from './VehicleTripFilterBar.js';
import type { Vehicle, VehicleTripFilterState } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import { translations } from '../i18n/translations.js';
import { useScreenMode } from '../hooks/useScreenMode.js';

interface VehicleBrochureCarouselProps {
  vehicles: Vehicle[];
  selectedVehicleId: string;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenSpecs: (vehicle: Vehicle) => void;
  onOpenBrochure?: (vehicle: Vehicle) => void;
  lang: Language;
}

const defaultFilterState: VehicleTripFilterState = {
  tripType: 'all',
  minSeats: 0,
  category: 'all',
  budgetTier: 'all',
  hasCarrierOnly: false,
  searchQuery: '',
  sortBy: 'popular',
};

export const VehicleBrochureCarousel: React.FC<VehicleBrochureCarouselProps> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  onOpenSpecs,
  onOpenBrochure,
  lang,
}) => {
  const t = translations[lang];
  const { isMobile, isSmallMobile } = useScreenMode();
  const [filter, setFilter] = useState<VehicleTripFilterState>(defaultFilterState);

  // Multi-criteria filtering logic
  const activeVehicles = useMemo(() => {
    let list = vehicles.filter(v => v.isActive);

    if (filter.tripType !== 'all') {
      list = list.filter(v => v.applicableTrips?.includes(filter.tripType as any));
    }
    if (filter.minSeats > 0) {
      list = list.filter(v => v.seatingCapacity >= filter.minSeats);
    }
    if (filter.category !== 'all') {
      list = list.filter(v => v.category === filter.category);
    }
    if (filter.budgetTier === 'economy') {
      list = list.filter(v => (v.perKmRate || 0) <= 12);
    } else if (filter.budgetTier === 'mid') {
      list = list.filter(v => (v.perKmRate || 0) > 12 && (v.perKmRate || 0) <= 18);
    } else if (filter.budgetTier === 'premium') {
      list = list.filter(v => (v.perKmRate || 0) > 18);
    }
    if (filter.hasCarrierOnly) {
      list = list.filter(v => v.carrierAvailable);
    }
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      list = list.filter(
        v =>
          v.name.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.description?.toLowerCase().includes(q) ||
          v.amenities?.some(a => a.toLowerCase().includes(q))
      );
    }
    if (filter.sortBy === 'price_asc') {
      list = [...list].sort((a, b) => (a.perKmRate || 0) - (b.perKmRate || 0));
    } else if (filter.sortBy === 'seats_desc') {
      list = [...list].sort((a, b) => b.seatingCapacity - a.seatingCapacity);
    }

    return list;
  }, [vehicles, filter]);

  // Find current index matching selectedVehicleId, default to 0
  const initialIndex = Math.max(
    0,
    activeVehicles.findIndex(v => v.id === selectedVehicleId)
  );

  const [activeIndex, setActiveIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
  const touchStartXRef = useRef<number | null>(null);

  // Keep activeIndex synchronized when selectedVehicleId changes or filters adjust list
  useEffect(() => {
    const idx = activeVehicles.findIndex(v => v.id === selectedVehicleId);
    if (idx !== -1) {
      setActiveIndex(idx);
    } else if (activeVehicles.length > 0 && activeIndex >= activeVehicles.length) {
      setActiveIndex(0);
    }
  }, [selectedVehicleId, activeVehicles]);

  const activeVehicle = activeVehicles[activeIndex] || activeVehicles[0];

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? activeVehicles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === activeVehicles.length - 1 ? 0 : prev + 1));
  };

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
    if (activeVehicles[index]) {
      onSelectVehicle(activeVehicles[index]);
    }
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  return (
    <section id="fleet" className="relative py-14 sm:py-20 lg:py-24 bg-[#FFF9F0]/95 backdrop-blur-md overflow-hidden">
      {/* Background Subtle Stamp Watermark 1: Ganga Aarti on right */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 pointer-events-none z-0 opacity-8">
        <GangaAartiWatermark opacity={1} tint="crimson" size={600} />
      </div>

      {/* Background Subtle Stamp Watermark 2: Kashi Vishwanath Temple on left */}
      <div className="absolute -left-24 top-1/3 -translate-y-1/2 pointer-events-none z-0 opacity-8">
        <KashiVishwanathWatermark opacity={1} tint="gold" size={560} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#821B25] uppercase tracking-wider bg-[#F3E8D5] px-3.5 py-1 rounded-md border border-[#C69A52]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#B5222A]" />
            <span>{t.fleetHeaderTag}</span>
          </div>
          <h2 className="font-heritage text-2xl sm:text-4xl lg:text-5xl font-bold text-[#821B25] tracking-tight text-balance">
            {t.chooseYourRide}
          </h2>
          <p className="text-xs sm:text-base text-[#292321]/80 leading-relaxed max-w-2xl mx-auto">
            {t.carouselDescription}
          </p>
        </div>

        {/* TRIP & VEHICLE FILTERS FOR EASE OF USER */}
        <VehicleTripFilterBar
          filter={filter}
          onFilterChange={setFilter}
          onResetFilters={() => setFilter(defaultFilterState)}
          totalVehiclesCount={vehicles.filter(v => v.isActive).length}
          filteredVehiclesCount={activeVehicles.length}
          lang={lang}
        />

        {activeVehicles.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-[#C69A52]/40 shadow-xs space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#F3E8D5] text-[#821B25] flex items-center justify-center mx-auto text-2xl">
              🚕
            </div>
            <h3 className="font-heritage text-lg font-bold text-[#292321]">
              {lang === 'hi' ? 'कोई वाहन फ़िल्टर से मेल नहीं खाता' : 'No Vehicles Match Your Current Filters'}
            </h3>
            <p className="text-xs text-[#292321]/70 leading-relaxed">
              {lang === 'hi'
                ? 'कृपया फ़िल्टर रीसेट करें अथवा लंका वाराणसी कार्यालय से कस्टम कोटेशन का अनुरोध करें।'
                : 'Please reset the filters to see all available vehicles or contact our Lanka office for a custom fleet quotation.'}
            </p>
            <button
              onClick={() => setFilter(defaultFilterState)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#821B25] hover:bg-[#B5222A] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सभी फ़िल्टर रीसेट करें' : 'Reset All Filters'}</span>
            </button>
          </div>
        ) : (
          /* RESPONSIVE BROCHURE DECK (Auto-adjusts between PC 3D deck and Mobile focal card) */
          <div
            className="relative min-h-[510px] sm:min-h-[580px] md:min-h-[620px] flex items-center justify-center overflow-hidden sm:overflow-visible"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
          {activeVehicles.map((vehicle, index) => {
            const offset = index - activeIndex;
            let normalizedOffset = offset;
            if (offset > activeVehicles.length / 2) normalizedOffset = offset - activeVehicles.length;
            if (offset < -activeVehicles.length / 2) normalizedOffset = offset + activeVehicles.length;

            const isCurrent = normalizedOffset === 0;
            const isPrev = normalizedOffset === -1;
            const isNext = normalizedOffset === 1;
            const isVisible = isMobile ? Math.abs(normalizedOffset) <= 1 : Math.abs(normalizedOffset) <= 2;

            if (!isVisible) return null;

            let translateX = '0%';
            let scale = 1;
            let zIndex = 30;
            let opacity = 1;

            if (isMobile) {
              // Mobile screen auto-adjustment: single card focal point without sideways spill
              if (isCurrent) {
                translateX = '0%';
                scale = 1;
                zIndex = 30;
                opacity = 1;
              } else if (isNext) {
                translateX = '105%';
                scale = 0.92;
                zIndex = 10;
                opacity = 0;
              } else if (isPrev) {
                translateX = '-105%';
                scale = 0.92;
                zIndex = 10;
                opacity = 0;
              }
            } else {
              // PC screen auto-adjustment: 3D overlapping brochure deck
              if (isCurrent) {
                translateX = '0%';
                scale = 1;
                zIndex = 30;
                opacity = 1;
              } else if (isNext) {
                translateX = '32%';
                scale = 0.88;
                zIndex = 20;
                opacity = 0.75;
              } else if (isPrev) {
                translateX = '-32%';
                scale = 0.88;
                zIndex = 20;
                opacity = 0.75;
              } else if (normalizedOffset === 2) {
                translateX = '58%';
                scale = 0.76;
                zIndex = 10;
                opacity = 0.45;
              } else if (normalizedOffset === -2) {
                translateX = '-58%';
                scale = 0.76;
                zIndex = 10;
                opacity = 0.45;
              }
            }

            return (
              <div
                key={vehicle.id}
                onClick={() => handleCardClick(index)}
                style={{
                  transform: `translateX(${translateX}) scale(${scale})`,
                  zIndex,
                  opacity,
                  pointerEvents: isMobile && !isCurrent ? 'none' : 'auto',
                }}
                className={`absolute w-[calc(100vw-36px)] sm:w-full max-w-[360px] sm:max-w-[480px] md:max-w-[560px] transition-all duration-350 ease-out cursor-pointer ${
                  isCurrent ? 'cursor-default ring-2 ring-[#821B25] shadow-2xl' : 'hover:opacity-90'
                }`}
              >
                {/* Vehicle Brochure Card */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-[#C69A52]/40 overflow-hidden shadow-xl flex flex-col">
                  {/* Card Header Banner (Deep Crimson Theme) */}
                  <div className="bg-gradient-to-r from-[#821B25] via-[#B5222A] to-[#821B25] text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#F3E8D5] uppercase tracking-wider block">
                        {vehicle.category}
                      </span>
                      <h3 className="font-heritage text-base sm:text-xl font-bold text-white tracking-wide truncate max-w-[190px] sm:max-w-none">
                        {vehicle.name}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#F3E8D5] block uppercase">{t.startingAt}</span>
                      <span className="font-heritage text-sm sm:text-lg font-black text-white">
                        ₹{vehicle.minFare.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Image Frame (object-fit: contain on ivory background) */}
                  <div className="relative bg-[#FFF9F0] h-48 sm:h-64 flex items-center justify-center p-3 sm:p-4 border-b border-[#C69A52]/30 overflow-hidden">
                    {/* Subtle Kashi Vishwanath Watermark inside frame */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-6">
                      <KashiVishwanathWatermark opacity={1} tint="gold" size={260} />
                    </div>

                    <img
                      src={vehicle.image}
                      alt={`${vehicle.name} - Ujjawal Tour & Travels fleet`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      onError={e => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (vehicle.fallbackImage && target.src !== vehicle.fallbackImage) {
                          target.src = vehicle.fallbackImage;
                        } else {
                          target.src = '/assets/vehicles/maruti-suzuki-dzire.png';
                        }
                      }}
                      className="w-full h-full object-contain object-center z-10 transition-transform duration-300 hover:scale-102"
                    />

                    {/* Verified Plate Pill indicator */}
                    {vehicle.registrationPlate && (
                      <div className="absolute bottom-2.5 left-3 sm:left-4 z-20 bg-white/95 backdrop-blur-xs border border-stone-300 rounded px-2 py-0.5 text-[10px] sm:text-[11px] font-mono font-bold text-[#292321] shadow-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#821B25]" />
                        <span>{t.plate}: {vehicle.registrationPlate}</span>
                      </div>
                    )}

                    {vehicle.isVerified && (
                      <div className="absolute top-2.5 right-3 sm:right-4 z-20 bg-[#FFF9F0] border border-[#C69A52] rounded-md px-2 py-0.5 text-[10px] font-bold text-[#821B25] flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.verifiedBadge}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content & Specifications */}
                  <div className="p-4 sm:p-6 bg-white space-y-3.5 sm:space-y-4">
                    {/* Key Specs unboxed text */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-2 px-2.5 sm:px-3 bg-[#FFF9F0] rounded-xl border border-[#C69A52]/40 text-center text-xs">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#821B25] mb-0.5 sm:mb-1" />
                        <span className="font-bold text-[#292321] text-[11px] sm:text-xs">
                          {vehicle.seatingCapacity} {t.passengers}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-[#292321]/60">{t.seating}</span>
                      </div>

                      <div className="flex flex-col items-center justify-center border-x border-[#C69A52]/40">
                        <Briefcase className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#821B25] mb-0.5 sm:mb-1" />
                        <span className="font-bold text-[#292321] text-[11px] sm:text-xs truncate max-w-[80px] sm:max-w-none">
                          {vehicle.carrierAvailable ? t.roofCarrier : t.bootSpace}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-[#292321]/60">{t.luggage}</span>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <Snowflake className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#821B25] mb-0.5 sm:mb-1" />
                        <span className="font-bold text-[#292321] text-[11px] sm:text-xs">₹{vehicle.perKmRate}/km</span>
                        <span className="text-[9px] sm:text-[10px] text-[#292321]/60">{t.tariffRate}</span>
                      </div>
                    </div>

                    {/* Brief description */}
                    <p className="text-xs sm:text-sm text-[#292321]/75 line-clamp-2 leading-relaxed">
                      {vehicle.description}
                    </p>

                    {/* Action Buttons: Select & Full Brochure */}
                    <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-2.5">
                      <GangaSunButton
                        onClick={e => {
                          e.stopPropagation();
                          onSelectVehicle(vehicle);
                        }}
                        size="md"
                        variant={vehicle.id === selectedVehicleId ? 'primary' : 'secondary'}
                        className="flex-1 text-xs sm:text-sm"
                        icon={<Calculator className="w-4 h-4" />}
                      >
                        {vehicle.id === selectedVehicleId ? t.selectedInCalcBtn : t.selectVehicleBtn}
                      </GangaSunButton>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (onOpenBrochure) {
                            onOpenBrochure(vehicle);
                          } else {
                            onOpenSpecs(vehicle);
                          }
                        }}
                        className="px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold text-[#821B25] bg-[#FFF9F0] hover:bg-[#F3E8D5] border border-[#C69A52] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        title="Open Full Brochure Sheet"
                      >
                        <FileText className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#821B25]" />
                        <span>{lang === 'hi' ? 'विवरणिका' : 'Full Brochure'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Controls: Left & Right Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-1 sm:left-4 z-40 p-2.5 sm:p-3 rounded-full bg-white/95 hover:bg-white text-[#821B25] hover:text-[#B5222A] border border-[#C69A52] shadow-lg transition-transform active:scale-90 cursor-pointer"
            aria-label="Previous vehicle"
          >
            <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-1 sm:right-4 z-40 p-2.5 sm:p-3 rounded-full bg-white/95 hover:bg-white text-[#821B25] hover:text-[#B5222A] border border-[#C69A52] shadow-lg transition-transform active:scale-90 cursor-pointer"
            aria-label="Next vehicle"
          >
            <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </div>
      )}

      {/* Indicator Dots & Mobile Swipe Hint */}
      {activeVehicles.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-2 pt-2">
          <div className="flex items-center gap-2">
            {activeVehicles.map((v, i) => (
              <button
                key={v.id}
                onClick={() => handleCardClick(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === activeIndex ? 'w-8 bg-[#821B25]' : 'w-2 bg-[#C69A52]/40 hover:bg-[#C69A52]'
                }`}
                aria-label={`Go to vehicle ${i + 1}`}
              />
            ))}
          </div>
          {isMobile && (
            <span className="text-[11px] text-[#292321]/60">
              {lang === 'hi' ? '👈 स्वाइप करके अन्य वाहन देखें 👉' : '👈 Swipe to explore fleet vehicles 👉'}
            </span>
          )}
        </div>
      )}
      </div>
    </section>
  );
};
