import React from 'react';
import { X, CheckCircle, Users, Briefcase, Snowflake, ShieldCheck, Car, Calculator } from 'lucide-react';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';
import type { Vehicle } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import { translations } from '../i18n/translations.js';

interface VehicleSpecsModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSelectForFare: (vehicle: Vehicle) => void;
  lang: Language;
}

export const VehicleSpecsModal: React.FC<VehicleSpecsModalProps> = ({
  vehicle,
  onClose,
  onSelectForFare,
  lang,
}) => {
  if (!vehicle) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl border-t sm:border border-[#E8D5B5] shadow-2xl overflow-hidden max-h-[92dvh] sm:max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        {/* Mobile Grab Handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-[#821B25]">
          <div className="w-12 h-1 bg-white/40 rounded-full" />
        </div>

        {/* Header */}
        <div className="bg-[#821B25] text-[#FFF9F0] px-5 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold text-[#E8D5B5] uppercase tracking-wider block">
              {t.specsHeader}
            </span>
            <h3 className="font-heritage text-xl font-bold text-white">
              {vehicle.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#FFF9F0]/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Kashi Vishwanath Watermark in background */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-8">
          <KashiVishwanathWatermark opacity={1} tint="gold" size={380} />
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 relative z-10">
          {/* Large Image Frame (object-fit: contain on ivory background) */}
          <div className="relative bg-[#FFF9F0] h-64 rounded-xl border border-[#E8D5B5] p-4 flex items-center justify-center overflow-hidden">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={e => {
                const target = e.currentTarget as HTMLImageElement;
                if (vehicle.fallbackImage && target.src !== vehicle.fallbackImage) {
                  target.src = vehicle.fallbackImage;
                } else {
                  target.src = '/assets/vehicles/maruti-suzuki-dzire.png';
                }
              }}
              className="w-full h-full object-contain"
            />

            {vehicle.registrationPlate && (
              <div className="absolute bottom-3 left-3 bg-white/95 border border-[#292321]/30 rounded px-2.5 py-0.5 text-xs font-bold text-[#292321] shadow-xs">
                {t.plate}: {vehicle.registrationPlate}
              </div>
            )}

            {vehicle.isVerified && (
              <div className="absolute top-3 right-3 bg-[#FFF9F0] border border-[#C69A52] rounded-md px-2.5 py-1 text-xs font-bold text-[#821B25] flex items-center gap-1 shadow-xs">
                <CheckCircle className="w-3.5 h-3.5 text-[#B5222A]" />
                <span>{t.verifiedReferenceImage}</span>
              </div>
            )}
          </div>

          {/* Verification Audit Note */}
          {vehicle.verifiedNote && (
            <div className="p-3 bg-[#FFF9F0] rounded-xl border border-[#C69A52]/40 text-xs text-[#821B25] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#C69A52]" />
              <p className="leading-relaxed">
                <strong>{t.verificationAuditNote}</strong> {vehicle.verifiedNote}
              </p>
            </div>
          )}

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#FFF9F0] rounded-xl border border-[#E8D5B5]/60 text-center">
              <Users className="w-4 h-4 text-[#821B25] mx-auto mb-1" />
              <span className="block text-xs font-bold text-[#292321]">{vehicle.seatingCapacity} {t.passengers}</span>
              <span className="text-[10px] text-[#292321]/60">{t.seatingCapacity}</span>
            </div>

            <div className="p-3 bg-[#FFF9F0] rounded-xl border border-[#E8D5B5]/60 text-center">
              <Briefcase className="w-4 h-4 text-[#821B25] mx-auto mb-1" />
              <span className="block text-xs font-bold text-[#292321]">{vehicle.carrierAvailable ? t.roofCarrier : t.bootSpace}</span>
              <span className="text-[10px] text-[#292321]/60">{t.luggageSpace}</span>
            </div>

            <div className="p-3 bg-[#FFF9F0] rounded-xl border border-[#E8D5B5]/60 text-center">
              <Snowflake className="w-4 h-4 text-[#821B25] mx-auto mb-1" />
              <span className="block text-xs font-bold text-[#292321]">₹{vehicle.perKmRate} / km</span>
              <span className="text-[10px] text-[#292321]/60">{t.perKmTariff}</span>
            </div>

            <div className="p-3 bg-[#FFF9F0] rounded-xl border border-[#E8D5B5]/60 text-center">
              <Car className="w-4 h-4 text-[#821B25] mx-auto mb-1" />
              <span className="block text-xs font-bold text-[#292321]">₹{vehicle.baseFare}</span>
              <span className="text-[10px] text-[#292321]/60">{t.baseBookingFare}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-[#292321] uppercase tracking-wider mb-1.5">
              {t.vehicleOverview}
            </h4>
            <p className="text-xs sm:text-sm text-[#292321]/80 leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="text-xs font-bold text-[#292321] uppercase tracking-wider mb-2">
              {t.amenitiesTitle}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {vehicle.amenities.map(a => (
                <div key={a} className="flex items-center gap-2 text-xs text-[#292321]/90">
                  <span className="text-[#C69A52] font-bold">✓</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E8D5B5]/60">
            <button
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-semibold text-[#292321]/70 hover:text-[#292321] cursor-pointer"
            >
              {t.closeBtn}
            </button>

            <button
              onClick={() => {
                onSelectForFare(vehicle);
                onClose();
              }}
              className="py-2.5 px-6 text-xs sm:text-sm font-bold text-white bg-[#B5222A] hover:bg-[#821B25] rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>{t.selectInCalculatorBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
