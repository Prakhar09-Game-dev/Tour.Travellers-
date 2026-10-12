import React, { useState } from 'react';
import {
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  MapPin,
  Sparkles,
  Camera,
  Maximize2,
  X,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { GangaAartiWatermark } from './GangaAartiWatermark.js';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';
import { GangaSunButton } from './GangaSunButton.js';
import type { TourPackage, PlacePhoto } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import { translations } from '../i18n/translations.js';

interface TourPackagesSectionProps {
  packages: TourPackage[];
  onSelectPackageForBooking: (pkg: TourPackage) => void;
  lang: Language;
}

export const TourPackagesSection: React.FC<TourPackagesSectionProps> = ({
  packages,
  onSelectPackageForBooking,
  lang,
}) => {
  const t = translations[lang];
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);
  // Track selected place photo index per package
  const [activePhotoIndex, setActivePhotoIndex] = useState<Record<string, number>>({});
  // Lightbox modal for full preview of places
  const [lightboxPhoto, setLightboxPhoto] = useState<{
    url: string;
    title: string;
    placeName: string;
    caption?: string;
  } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedPackageId(prev => (prev === id ? null : id));
  };

  const handleSelectPlacePhoto = (pkgId: string, index: number) => {
    setActivePhotoIndex(prev => ({ ...prev, [pkgId]: index }));
  };

  return (
    <section id="packages" className="relative py-12 sm:py-20 bg-[#FFFDF7]/90 backdrop-blur-md overflow-hidden">
      {/* Background Subtle Stamp Watermark 1: Ganga Aarti on right */}
      <div className="absolute right-4 top-12 pointer-events-none z-0 opacity-6">
        <GangaAartiWatermark opacity={1} tint="horizon" size={560} />
      </div>

      {/* Background Subtle Stamp Watermark 2: Kashi Vishwanath Temple on left */}
      <div className="absolute -left-20 bottom-8 pointer-events-none z-0 opacity-8">
        <KashiVishwanathWatermark opacity={1} tint="horizon" size={600} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header with mobile-optimized spacing */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3 px-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D9531E] uppercase tracking-widest bg-[#F8ECD5] px-3 py-1 rounded-full border border-[#D4A373]/50 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D9531E]" />
            <span>{t.packagesTag}</span>
          </div>
          <h2 className="font-heritage text-2xl sm:text-4xl lg:text-5xl font-bold text-[#7C2D12] tracking-tight">
            {t.packagesTitle}
          </h2>
          <p className="text-xs sm:text-base text-stone-700 leading-relaxed max-w-2xl mx-auto">
            {t.packagesDescription}
          </p>
        </div>

        {/* Packages Grid - Auto-adjusts cleanly from 1 column on mobile to 2 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          {packages.map(pkg => {
            const isExpanded = expandedPackageId === pkg.id;
            const currentPhotoIdx = activePhotoIndex[pkg.id] || 0;
            const photosList = pkg.placePhotos && pkg.placePhotos.length > 0
              ? pkg.placePhotos
              : [{ name: pkg.title, url: pkg.image, fallbackUrl: pkg.fallbackImage, caption: pkg.tagline }];
            
            const currentPhoto: PlacePhoto = photosList[currentPhotoIdx] || photosList[0];

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl sm:rounded-3xl border-2 border-[#D4A373]/40 overflow-hidden shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Hero Place Image with Internet Photo Loading & Place Selector */}
                  <div className="relative h-60 sm:h-72 bg-[#7C2D12] overflow-hidden group">
                    <img
                      src={currentPhoto.url}
                      alt={currentPhoto.name || pkg.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (currentPhoto.fallbackUrl && target.src !== currentPhoto.fallbackUrl) {
                          target.src = currentPhoto.fallbackUrl;
                        } else if (pkg.fallbackImage && target.src !== pkg.fallbackImage) {
                          target.src = pkg.fallbackImage;
                        }
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 sm:top-3 sm:left-4 flex items-center gap-2">
                      <div className="bg-[#FFFDF7]/95 backdrop-blur-xs text-[#7C2D12] px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 border border-[#D4A373]/30">
                        <Clock className="w-3.5 h-3.5 text-[#D9531E]" />
                        <span>{pkg.duration}</span>
                      </div>
                    </div>

                    {/* Enlarge / Full Place View Button */}
                    <button
                      onClick={() => setLightboxPhoto({
                        url: currentPhoto.url,
                        title: pkg.title,
                        placeName: currentPhoto.name,
                        caption: currentPhoto.caption
                      })}
                      className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-2 rounded-xl text-xs transition-colors cursor-pointer border border-white/20 flex items-center gap-1 shadow-sm"
                      title={lang === 'hi' ? 'स्थान की बड़ी फोटो देखें' : 'View High-Res Place Photo'}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px] font-semibold">{lang === 'hi' ? 'बड़ी फोटो' : 'HD View'}</span>
                    </button>

                    {/* Active Place Tag & Price Banner at bottom of Image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                      <div className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl border border-white/20 max-w-[65%]">
                        <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                          <Camera className="w-3 h-3 text-amber-400" />
                          <span>{lang === 'hi' ? 'दर्शनीय स्थल' : 'Featured Place'}</span>
                        </div>
                        <p className="text-xs font-bold truncate text-white leading-tight">
                          {currentPhoto.name}
                        </p>
                      </div>

                      {pkg.startingPrice && (
                        <div className="bg-white/95 backdrop-blur-xs text-[#7C2D12] px-3 py-1.5 rounded-xl text-xs font-black shadow-md border border-[#D4A373]/40 shrink-0">
                          {t.fromPrice} <span className="text-[#D9531E] text-sm">₹{pkg.startingPrice.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile & Desktop Place Photo Switcher Pills (Loaded from Internet) */}
                  {photosList.length > 1 && (
                    <div className="bg-[#FAF3E0] px-3.5 py-2.5 border-b border-[#D4A373]/30">
                      <div className="flex items-center justify-between text-[11px] text-stone-600 mb-1.5 font-medium">
                        <span className="flex items-center gap-1 text-[#7C2D12] font-bold">
                          <Compass className="w-3 h-3 text-[#D9531E]" />
                          <span>{lang === 'hi' ? 'यात्रा के प्रमुख स्थान फोटो:' : 'Places in this package:'}</span>
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {currentPhotoIdx + 1} / {photosList.length}
                        </span>
                      </div>
                      
                      {/* Interactive Horizontal Scrollable Thumbnail Strip */}
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 touch-pan-x">
                        {photosList.map((photo, pIdx) => {
                          const isSelected = pIdx === currentPhotoIdx;
                          return (
                            <button
                              key={pIdx}
                              onClick={() => handleSelectPlacePhoto(pkg.id, pIdx)}
                              className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                                isSelected
                                  ? 'bg-[#7C2D12] text-white border-[#7C2D12] shadow-xs'
                                  : 'bg-white text-stone-700 hover:bg-[#FFF9EE] border-stone-200'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-stone-300'}`} />
                              <span className="truncate max-w-[140px] sm:max-w-[180px]">{photo.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
                    <div>
                      <span className="text-xs font-bold text-[#D9531E] tracking-wider uppercase block mb-1">
                        {pkg.tagline}
                      </span>
                      <h3 className="font-heritage text-lg sm:text-xl font-bold text-[#7C2D12]">
                        {pkg.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Key Destinations Included - Thumb friendly wrap on mobile */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <span className="text-[11px] sm:text-xs font-bold text-stone-700 uppercase tracking-wide block">
                        {t.destinationsIncluded}
                      </span>
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {pkg.destinations.map((dest, i) => (
                          <span
                            key={i}
                            className="text-[11px] sm:text-xs font-medium bg-[#FFF9EE] text-[#7C2D12] border border-[#D4A373]/40 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3 text-[#D9531E] shrink-0" />
                            <span>{dest}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Expandable Inclusions / Exclusions */}
                    <div className="pt-1.5">
                      <button
                        onClick={() => toggleExpand(pkg.id)}
                        className="text-xs font-bold text-[#D9531E] hover:text-[#7C2D12] flex items-center gap-1 transition-colors cursor-pointer py-1"
                      >
                        <span>{isExpanded ? t.hideDetails : t.viewItineraryInclusions}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 p-3.5 sm:p-4 bg-[#FFF9EE] rounded-2xl border border-[#D4A373]/50 text-xs space-y-3 animate-in fade-in duration-200">
                          {pkg.itinerary && pkg.itinerary.length > 0 && (
                            <div>
                              <span className="font-bold text-[#7C2D12] block mb-1.5">
                                {lang === 'hi' ? 'यात्रा कार्यक्रम (Itinerary):' : 'Day Plan & Itinerary:'}
                              </span>
                              <ol className="list-decimal list-inside space-y-1 text-stone-700 leading-relaxed pl-1">
                                {pkg.itinerary.map((step, idx) => (
                                  <li key={idx} className="text-[11px] sm:text-xs">{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}

                          <div className="border-t border-stone-200/60 pt-2">
                            <span className="font-bold text-[#7C2D12] block mb-1">
                              {t.packageIncludes}
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-stone-700 pl-1">
                              {pkg.inclusions.map((inc, j) => (
                                <li key={j} className="text-[11px] sm:text-xs">{inc}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="border-t border-stone-200/60 pt-2">
                            <span className="font-bold text-[#7C2D12] block mb-1">
                              {t.packageExcludes}
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-stone-700 pl-1">
                              {pkg.exclusions.map((exc, k) => (
                                <li key={k} className="text-[11px] sm:text-xs">{exc}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action Button - Mobile friendly full-width touch button */}
                <div className="p-4 sm:p-6 pt-0">
                  <GangaSunButton
                    size="lg"
                    variant="primary"
                    className="w-full text-xs sm:text-sm shadow-md"
                    onClick={() => onSelectPackageForBooking(pkg)}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {t.bookPackageBtn}
                  </GangaSunButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full HD Place Photo Lightbox Modal */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-[#1C1917] rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 bg-black/60 border-b border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  {lightboxPhoto.title}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {lightboxPhoto.placeName}
                </h4>
              </div>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="flex-1 overflow-hidden bg-black flex items-center justify-center p-2">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.placeName}
                referrerPolicy="no-referrer"
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Modal Footer Caption */}
            {lightboxPhoto.caption && (
              <div className="p-3 bg-stone-900 border-t border-stone-800 text-stone-300 text-xs text-center">
                {lightboxPhoto.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
