import React from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Users,
  Briefcase,
  Snowflake,
  ShieldCheck,
  Fuel,
  Compass,
  MessageCircle,
  Calculator,
  Award,
  Sparkles,
} from 'lucide-react';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';
import { GangaSunButton } from './GangaSunButton.js';
import type { Vehicle } from '../types/index.js';
import type { Language } from '../i18n/translations.js';

interface VehicleBrochureModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSelectForFare: (vehicle: Vehicle) => void;
  primaryPhone?: string;
  lang?: Language;
}

export const VehicleBrochureModal: React.FC<VehicleBrochureModalProps> = ({
  vehicle,
  onClose,
  onSelectForFare,
  primaryPhone = '7651944600',
  lang = 'en',
}) => {
  if (!vehicle) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppEnquiry = () => {
    const text = encodeURIComponent(
      lang === 'hi'
        ? `नमस्ते! मुझे उज्ज्वल टूर एंड ट्रैवेल्स की ${vehicle.name} (${vehicle.registrationPlate || vehicle.category}) के संबंध में बुकिंग पूछताछ करनी है।`
        : `Hello! I would like to enquire about booking the ${vehicle.name} (${vehicle.registrationPlate || vehicle.category}) with Ujjawal Tour & Travels Varanasi.`
    );
    const link = document.createElement('a');
    link.href = `https://wa.me/91${primaryPhone.replace(/\D/g, '')}?text=${text}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-[#FFFDF7] rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-[#D9531E]/30 shadow-2xl overflow-hidden max-h-[92dvh] sm:max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        {/* Mobile Grab Handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-[#7C2D12]">
          <div className="w-12 h-1 bg-white/40 rounded-full" />
        </div>

        {/* Brochure Header Banner (Horizon Sunrise Theme) */}
        <div className="bg-gradient-to-r from-[#7C2D12] via-[#D9531E] to-[#EA580C] text-white px-4 sm:px-8 py-3.5 sm:py-5 flex items-center justify-between shrink-0 border-b border-[#F59E0B]/30">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center text-[#FEF08A] font-bold">
              ★
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase bg-[#FEF08A]/20 text-[#FEF08A] px-2 py-0.5 rounded">
                  {lang === 'hi' ? 'आधिकारिक वाहन विवरणिका' : 'OFFICIAL FLEET BROCHURE'}
                </span>
                <span className="text-white/60 text-xs">·</span>
                <span className="text-xs text-amber-200 font-semibold">{vehicle.category}</span>
              </div>
              <h2 className="font-heritage text-xl sm:text-3xl font-bold text-white tracking-tight">
                {vehicle.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
              title="Print or Save PDF Brochure"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
              title="Close Brochure"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Brochure Content */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto flex-1 relative">
          {/* Authentic Kashi Vishwanath Watermark in Background */}
          <div className="absolute right-4 bottom-4 pointer-events-none opacity-8 z-0">
            <KashiVishwanathWatermark opacity={1} tint="horizon" size={480} />
          </div>

          <div className="relative z-10 space-y-8">
            {/* Top Showcase: Large Photo & Verified Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Vehicle Photo Frame */}
              <div className="lg:col-span-7 relative bg-gradient-to-b from-[#F8ECD5]/60 to-[#FFF9EE] rounded-2xl border-2 border-[#D4A373]/40 p-4 sm:p-6 flex items-center justify-center min-h-[220px] sm:min-h-[260px] overflow-hidden shadow-inner">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
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
                  className="w-full max-h-64 object-contain transition-transform duration-300 hover:scale-102"
                />

                {/* Registration Plate Tag */}
                {vehicle.registrationPlate && (
                  <div className="absolute bottom-3 left-3 bg-white/95 border-2 border-[#1C1917]/70 rounded-md px-3 py-1 text-xs font-mono font-black text-[#1C1917] shadow-sm tracking-wider flex items-center gap-1.5">
                    <span className="text-[10px] text-blue-700 font-bold">IND</span>
                    <span>{vehicle.registrationPlate}</span>
                  </div>
                )}

                {/* Verified Reference Seal */}
                <div className="absolute top-3 right-3 bg-[#FFFDF7]/95 border border-[#D9531E] rounded-lg px-2.5 py-1 text-xs font-bold text-[#7C2D12] flex items-center gap-1.5 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                  <span>{lang === 'hi' ? 'सत्यापित बेड़ा वाहन' : 'Verified Fleet Model'}</span>
                </div>
              </div>

              {/* Key Highlights & Tagline */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#D9531E] uppercase tracking-wider block">
                    {lang === 'hi' ? 'वाराणसी एवं धार्मिक यात्रा हेतु विशेष' : 'Designed for Kashi & Highway Pilgrimage'}
                  </span>
                  <p className="text-sm text-[#1C1917]/85 leading-relaxed font-medium">
                    {vehicle.description}
                  </p>
                </div>

                {/* Verified Audit Note */}
                {vehicle.verifiedNote && (
                  <div className="p-3 bg-[#FFF9EE] rounded-xl border border-[#D4A373] text-xs text-[#7C2D12] flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#D9531E]" />
                    <p className="leading-relaxed">
                      <strong>{lang === 'hi' ? 'सत्यापन नोट:' : 'Audit Verification:'}</strong>{' '}
                      {vehicle.verifiedNote}
                    </p>
                  </div>
                )}

                {/* Quick Tariff Summary Box */}
                <div className="bg-gradient-to-br from-[#7C2D12] to-[#D9531E] text-white p-4 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs text-amber-200">
                    <span>{lang === 'hi' ? 'मानक दर' : 'Standard Tariff'}</span>
                    <span className="font-bold">₹{vehicle.perKmRate}/km</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold">{lang === 'hi' ? 'न्यूनतम स्थानीय किराया:' : 'Min. Base Fare:'}</span>
                    <span className="text-2xl font-black text-[#FEF08A]">₹{vehicle.minFare.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-[11px] text-white/80 border-t border-white/20 pt-1.5 flex justify-between">
                    <span>{lang === 'hi' ? 'चालक भत्ता:' : 'Driver Allowance:'} ₹{vehicle.driverAllowancePerDay}/दिन</span>
                    <span>{lang === 'hi' ? 'रात्रि शुल्क:' : 'Night Charge:'} ₹{vehicle.nightCharge}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive Technical Specifications Table */}
            <div>
              <h3 className="font-heritage text-lg font-bold text-[#7C2D12] mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D9531E]" />
                <span>{lang === 'hi' ? 'विस्तृत तकनीकी विशिष्टताएं' : 'Complete Technical Specifications'}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-white rounded-xl border border-[#D4A373]/50 shadow-xs">
                  <div className="flex items-center gap-2 text-[#D9531E] mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase">{lang === 'hi' ? 'यात्री क्षमता' : 'Capacity'}</span>
                  </div>
                  <p className="text-sm font-bold text-[#1C1917]">{vehicle.seatingCapacity} Passengers</p>
                  <p className="text-[10px] text-stone-600">{lang === 'hi' ? 'आरामदायक पुशबैक सीटिंग' : 'Chauffeur + Passengers'}</p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#D4A373]/50 shadow-xs">
                  <div className="flex items-center gap-2 text-[#D9531E] mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase">{lang === 'hi' ? 'सामान क्षमता' : 'Luggage'}</span>
                  </div>
                  <p className="text-sm font-bold text-[#1C1917]">
                    {vehicle.carrierAvailable ? 'Roof Rack + Boot' : 'Spacious Boot'}
                  </p>
                  <p className="text-[10px] text-stone-600">{vehicle.luggageCapacity}</p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#D4A373]/50 shadow-xs">
                  <div className="flex items-center gap-2 text-[#D9531E] mb-1">
                    <Snowflake className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase">{lang === 'hi' ? 'वातानुकूलन' : 'AC Climate'}</span>
                  </div>
                  <p className="text-sm font-bold text-[#1C1917]">
                    {vehicle.acAvailable ? 'Chilled Multi-Zone AC' : 'Standard'}
                  </p>
                  <p className="text-[10px] text-stone-600">{lang === 'hi' ? 'गर्मियों में भी ठंडी हवा' : 'Front & Rear Dual Blowers'}</p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#D4A373]/50 shadow-xs">
                  <div className="flex items-center gap-2 text-[#D9531E] mb-1">
                    <Fuel className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase">{lang === 'hi' ? 'ईंधन एवं सुरक्षा' : 'Safety & Fuel'}</span>
                  </div>
                  <p className="text-sm font-bold text-[#1C1917]">BS6 Eco-Compliant</p>
                  <p className="text-[10px] text-stone-600">GPS Live Tracked</p>
                </div>
              </div>
            </div>

            {/* In-Cabin Amenities & Sanitization */}
            <div>
              <h3 className="font-heritage text-lg font-bold text-[#7C2D12] mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F59E0B]" />
                <span>{lang === 'hi' ? 'निःशुल्क सुविधाएं एवं आराम' : 'Complimentary In-Cabin Amenities'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {vehicle.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white rounded-xl border border-[#D4A373]/40 flex items-center gap-2 text-xs font-semibold text-[#1C1917] shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D9531E] shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Suited Pilgrimage & Outstation Routes */}
            <div>
              <h3 className="font-heritage text-lg font-bold text-[#7C2D12] mb-3 flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#0E7490]" />
                <span>{lang === 'hi' ? 'अनुशंसित यात्रा मार्ग' : 'Recommended Journeys for this Vehicle'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#F0FDF4] border border-emerald-300 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-900">
                    {lang === 'hi' ? '🛕 काशी दर्शन एवं स्थानीय यात्रा' : '🛕 Varanasi Heritage & Ghats'}
                  </div>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    {lang === 'hi'
                      ? 'काशी विश्वनाथ कॉरिडोर, अस्सी घाट, बीएचयू एवं सारनाथ की संकरी गलियों में सुगम आवागमन।'
                      : 'Smooth maneuvering through Lanka, Dashashwamedh Ghat, BHU & Sarnath city routes.'}
                  </p>
                </div>

                <div className="p-3 bg-[#FEFCE8] border border-amber-300 rounded-xl space-y-1">
                  <div className="font-bold text-amber-900">
                    {lang === 'hi' ? '✈️ एयरपोर्ट वीआईपी ट्रांसफर' : '✈️ Babatpur Airport Transfers'}
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    {lang === 'hi'
                      ? 'बाबतपुर हवाई अड्डा (VNS) से लंका, गोदौलिया अथवा कैंट स्टेशन हेतु समयबद्ध पिकअप।'
                      : 'Punctual express highway pickup with ample luggage room for domestic & international tourists.'}
                  </p>
                </div>

                <div className="p-3 bg-[#FFF7ED] border border-orange-300 rounded-xl space-y-1">
                  <div className="font-bold text-orange-900">
                    {lang === 'hi' ? '🚩 प्रयागराज, अयोध्या एवं गया' : '🚩 Outstation Pilgrimage Express'}
                  </div>
                  <p className="text-orange-800 text-[11px] leading-relaxed">
                    {lang === 'hi'
                      ? 'अयोध्या राम मंदिर, प्रयागराज संगम एवं बोधगया बौद्ध परिपथ हेतु सर्वोत्तम राजमार्ग कम्फर्ट।'
                      : 'Comfortable long-haul suspension for highway pilgrimage to Ayodhya, Prayagraj & Gaya.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Chauffeur Guarantee Strip */}
            <div className="p-4 bg-gradient-to-r from-[#FFF9EE] to-[#F8ECD5] rounded-2xl border border-[#D4A373] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7C2D12] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  UTT
                </div>
                <div className="text-xs">
                  <div className="font-bold text-[#7C2D12]">
                    {lang === 'hi' ? 'प्रशिक्षित एवं सत्यापित स्थानीय चालक' : 'Uniformed, Police-Verified Varanasi Chauffeur'}
                  </div>
                  <p className="text-stone-600">
                    {lang === 'hi'
                      ? 'स्थानिक घाटों, मंदिर समय-सारिणी एवं सुरक्षित राजमार्गों का पूर्ण ज्ञान।'
                      : 'Fluent in Hindi & local routes with polite decorum and temple darshan guidance.'}
                  </p>
                </div>
              </div>

              <div className="text-xs text-[#D9531E] font-bold shrink-0">
                ⭐ 4.9/5 Chauffeur Rating
              </div>
            </div>
          </div>
        </div>

        {/* Brochure Footer Actions */}
        <div className="bg-[#FFF9EE] border-t border-[#D4A373]/40 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="text-xs text-stone-600">
            <span className="font-bold text-[#7C2D12]">Ujjawal Tour &amp; Travels</span> · Lanka, Varanasi
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleWhatsAppEnquiry}
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{lang === 'hi' ? 'व्हाट्सएप पूछताछ' : 'WhatsApp Enquiry'}</span>
            </button>

            <GangaSunButton
              size="md"
              variant="primary"
              onClick={() => {
                onSelectForFare(vehicle);
                onClose();
              }}
              icon={<Calculator className="w-4 h-4" />}
            >
              {lang === 'hi' ? 'इस गाड़ी से किराया निकालें' : 'Calculate Fare for This Car'}
            </GangaSunButton>
          </div>
        </div>
      </div>
    </div>
  );
};
