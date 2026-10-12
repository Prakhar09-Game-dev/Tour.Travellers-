import React, { useState } from 'react';
import { X, CheckCircle, Car, Phone, User, Mail, ShieldAlert, Crosshair, RefreshCw } from 'lucide-react';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';
import type { FareEstimate, Vehicle, BookingEnquiry } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import { translations } from '../i18n/translations.js';
import { detectPhoneLocation } from '../utils/locationService.js';

interface BookingEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimate?: FareEstimate | null;
  selectedVehicle?: Vehicle | null;
  onBookingSubmitted: (enquiry: BookingEnquiry) => void;
  lang: Language;
}

export const BookingEnquiryModal: React.FC<BookingEnquiryModalProps> = ({
  isOpen,
  onClose,
  estimate,
  selectedVehicle,
  onBookingSubmitted,
  lang,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRecord, setSuccessRecord] = useState<BookingEnquiry | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const handleAttachGps = async () => {
    setIsDetectingGps(true);
    try {
      const res = await detectPhoneLocation();
      setSpecialRequirements(prev =>
        prev
          ? `${prev} | [Phone GPS Pickup: ${res.detectedName} (${res.landmarkDetail || ''})]`
          : `[Phone GPS Pickup: ${res.detectedName} (${res.landmarkDetail || ''})]`
      );
    } catch (err: any) {
      setError(err.message || 'Could not fetch GPS location');
    } finally {
      setIsDetectingGps(false);
    }
  };

  const vehicleName = estimate?.vehicleName || selectedVehicle?.name || 'Selected Fleet Cab';
  const vehicleId = estimate?.vehicleId || selectedVehicle?.id || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError(
        lang === 'hi'
          ? 'कृपया 6-9 से शुरू होने वाला 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें (उदा. 9876543210)।'
          : 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g. 9876543210).'
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        vehicleId,
        tripType: estimate?.tripType || 'one_way',
        pickup: estimate?.pickup || 'Lanka / Samneghat, Varanasi',
        destination: estimate?.destination || 'Varanasi',
        departureDate: estimate?.departureDate || new Date().toISOString().split('T')[0],
        departureTime: estimate?.departureTime || '09:00',
        returnDate: estimate?.returnDate,
        passengerCount: estimate?.passengerCount || 2,
        fareEstimateId: estimate?.id,
        estimatedTotal: estimate?.totalEstimatedFare,
        specialRequirements: specialRequirements.trim() || undefined,
      };

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking enquiry');
      }

      setSuccessRecord(data);
      onBookingSubmitted(data);
    } catch (err: any) {
      setError(err.message || 'Error saving enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-2xl border-t sm:border border-[#E8D5B5] shadow-2xl overflow-hidden max-h-[92dvh] sm:max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        {/* Mobile Drag / Sheet Grab Handle indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-[#821B25]">
          <div className="w-12 h-1 bg-white/40 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="bg-[#821B25] text-[#FFF9F0] px-5 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold text-[#E8D5B5] uppercase tracking-wider block">
              {t.brand}
            </span>
            <h3 id="booking-modal-title" className="font-heritage text-lg font-bold text-white">
              {successRecord ? t.bookingSuccessTitle : t.bookingModalTitle}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#FFF9F0]/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Watermark in background */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-8">
          <KashiVishwanathWatermark opacity={1} tint="gold" size={320} />
        </div>

        {successRecord ? (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center relative z-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="font-heritage text-2xl font-bold text-[#7C2D12]">
                {t.bookingSuccessTitle}
              </h4>
              <p className="text-xs sm:text-sm text-[#1C1917]/85 max-w-md mx-auto leading-relaxed">
                {lang === 'hi' ? (
                  <>
                    धन्यवाद, <strong className="text-[#D9531E]">{successRecord.customerName}</strong> जी। आपकी
                    बुकिंग पूछताछ दर्ज कर ली गई है। हमारी टीम आपसे मोबाइल नंबर
                    <strong className="text-[#D9531E]"> {successRecord.customerPhone}</strong> पर संपर्क करेगी।
                  </>
                ) : (
                  <>
                    Thank you, <strong className="text-[#D9531E]">{successRecord.customerName}</strong>. Our
                    Varanasi dispatch team has logged your booking enquiry. We will call you on
                    <strong className="text-[#D9531E]"> {successRecord.customerPhone}</strong> to confirm chauffeur
                    assignment and pickup point.
                  </>
                )}
              </p>

              {/* Serene Ganga Sunset Blessing Notice */}
              <div className="p-3 bg-gradient-to-r from-[#FFF9EE] via-[#F8ECD5] to-[#FFF9EE] border border-[#D4A373] rounded-xl text-xs text-[#7C2D12] font-semibold flex items-center justify-center gap-2">
                <span>🌅</span>
                <span>
                  {lang === 'hi'
                    ? 'शुभ यात्रा! आपकी बुकिंग की पुष्टि के साथ माँ गंगा के क्षितिज पर पावन संध्या सूर्यास्त एवं आरती का आशीर्वाद।'
                    : 'Shubh Yatra! As your booking is registered, the sun sets serenely over Mother Ganga with evening Aarti blessings.'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#FFF9F0] rounded-xl border border-[#E8D5B5] text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-[#292321]/60">{t.bookingRef}</span>
                <span className="font-bold text-[#821B25]">{successRecord.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#292321]/60">{t.vehicleLabel}</span>
                <span className="font-bold text-[#292321]">{successRecord.vehicleName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#292321]/60">{t.routeLabel}</span>
                <span className="font-bold text-[#292321]">
                  {successRecord.pickup} → {successRecord.destination}
                </span>
              </div>
              {successRecord.estimatedTotal && (
                <div className="flex justify-between pt-1 border-t border-[#E8D5B5]/60 font-bold text-[#821B25]">
                  <span>{t.estimatedTotalLabel}</span>
                  <span>₹{successRecord.estimatedTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href="tel:7651944600"
                className="flex-1 py-3 px-4 bg-[#821B25] hover:bg-[#B5222A] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>{t.callDispatchBtn} 7651944600</span>
              </a>

              <button
                onClick={onClose}
                className="py-3 px-4 bg-[#F3E8D5] hover:bg-[#E8D5B5] text-[#821B25] text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {t.closeWindow}
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 relative z-10">
            {/* Prefilled Summary Card */}
            <div className="p-4 bg-[#FFF9F0] rounded-xl border border-[#E8D5B5] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#821B25]" />
                  <span className="font-bold text-sm text-[#821B25]">{vehicleName}</span>
                </div>
                {estimate?.totalEstimatedFare && (
                  <span className="font-heritage text-sm font-bold text-[#821B25]">
                    ₹{estimate.totalEstimatedFare.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {estimate && (
                <div className="text-[11px] text-[#292321]/70 flex flex-wrap gap-x-4 gap-y-1">
                  <span>From: {estimate.pickup}</span>
                  <span>To: {estimate.destination}</span>
                  <span>Date: {estimate.departureDate}</span>
                  {estimate.id && <span>Estimate: #{estimate.id}</span>}
                </div>
              )}
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#292321] uppercase tracking-wider mb-1">
                  {t.fullNameRequired}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#821B25] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg text-sm text-[#292321] focus:outline-none focus:ring-2 focus:ring-[#821B25]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292321] uppercase tracking-wider mb-1">
                  {t.mobileRequired}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#821B25] absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg text-sm text-[#292321] focus:outline-none focus:ring-2 focus:ring-[#821B25]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292321] uppercase tracking-wider mb-1">
                  {t.emailOptional}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#821B25] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="e.g. yourname@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg text-sm text-[#292321] focus:outline-none focus:ring-2 focus:ring-[#821B25]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#292321] uppercase tracking-wider">
                    {t.specialInstructionsModal}
                  </label>
                  <button
                    type="button"
                    onClick={handleAttachGps}
                    disabled={isDetectingGps}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#821B25] hover:text-[#B5222A] bg-[#F3E8D5] hover:bg-[#E8D5B5] px-2 py-0.5 rounded-full transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isDetectingGps ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Crosshair className="w-3 h-3" />
                    )}
                    <span>{lang === 'hi' ? 'GPS स्थान जोड़ें' : 'Attach GPS'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={specialRequirements}
                  onChange={e => setSpecialRequirements(e.target.value)}
                  placeholder="e.g. Pickup from Hotel Ganges Grand Godowlia, flight arrival at 11:30 AM"
                  className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg text-xs text-[#292321] focus:outline-none focus:ring-2 focus:ring-[#821B25]"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Privacy Guarantee Note */}
            <p className="text-[11px] text-[#292321]/65 leading-relaxed bg-[#FFF9F0] p-2.5 rounded-lg border border-[#E8D5B5]/60">
              {lang === 'hi'
                ? '🔒 गोपनीयता सूचना: आपके विवरण केवल वाराणसी यात्रा समन्वय हेतु उपयोग किए जाते हैं। हम आपकी जानकारी कभी साझा नहीं करते।'
                : '🔒 Privacy Notice: Your contact and travel details will strictly be used by our Lanka dispatch office to coordinate your taxi. We never share customer data.'}
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 text-xs font-semibold text-[#292321]/70 hover:text-[#292321] cursor-pointer"
              >
                {t.cancelBtn}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="py-2.5 px-6 text-xs sm:text-sm font-bold text-white bg-[#B5222A] hover:bg-[#821B25] rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-75"
              >
                {loading ? t.submittingBtn : t.submitBookingBtn}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
