import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  Calculator,
  ArrowRight,
  Receipt,
  Sparkles,
  MessageCircle,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  Navigation,
  Crosshair,
  Plane,
  Flame,
  Train,
  Check,
  Compass,
} from 'lucide-react';
import { GangaAartiWatermark } from './GangaAartiWatermark.js';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';
import type { Vehicle, FareEstimateRequest, FareEstimate, PricingSettings } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import { translations } from '../i18n/translations.js';
import {
  detectPhoneLocation,
  POPULAR_SPOTS,
  POPULAR_PILGRIMAGE_AND_AIRPORT_ROUTES,
  PopularSpot,
  PopularRouteWithPhotos,
  GpsLocationResult,
} from '../utils/locationService.js';
import { GoogleRouteMap } from './GoogleRouteMap.js';

interface FareCalculatorProps {
  vehicles: Vehicle[];
  selectedVehicleId: string;
  onSelectVehicleId: (id: string) => void;
  onProceedToBooking: (estimate: FareEstimate) => void;
  onRequestCustomQuote: (details: Partial<FareEstimateRequest>) => void;
  pricingSettings?: PricingSettings;
  primaryPhone?: string;
  lang: Language;
  onDirectBookingConfirmed?: () => void;
}

export const FareCalculator: React.FC<FareCalculatorProps> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicleId,
  onProceedToBooking,
  onRequestCustomQuote,
  pricingSettings,
  primaryPhone = '7651944600',
  lang,
  onDirectBookingConfirmed,
}) => {
  const t = translations[lang];
  const activeVehicles = useMemo(() => vehicles.filter(v => v.isActive), [vehicles]);

  // Form State
  const [pickup, setPickup] = useState('Lanka / Samneghat, Varanasi');
  const [destination, setDestination] = useState('Ayodhya Shri Ram Mandir');
  const [tripType, setTripType] = useState<'one_way' | 'round_trip' | 'local_sightseeing' | 'airport_transfer'>('round_trip');
  const [departureDate, setDepartureDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [departureTime, setDepartureTime] = useState('07:00');
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [passengerCount, setPassengerCount] = useState(4);
  const [specialRequirements, setSpecialRequirements] = useState('');

  // GPS Auto-Detection State
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsTargetField, setGpsTargetField] = useState<'pickup' | 'destination'>('pickup');
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [lastGpsResult, setLastGpsResult] = useState<GpsLocationResult | null>(null);
  const [showGoogleMap, setShowGoogleMap] = useState<boolean>(true);

  // Popular spot category filter
  const [activeSpotCategory, setActiveSpotCategory] = useState<'all' | 'airport' | 'pilgrimage' | 'transit'>('all');

  // Field validation errors
  const [validationErrors, setValidationErrors] = useState<{
    pickup?: string;
    destination?: string;
  }>({});

  // Server-side estimate state (sole calculation source)
  const [serverEstimate, setServerEstimate] = useState<FareEstimate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [requiresCustomQuote, setRequiresCustomQuote] = useState<boolean>(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Selected vehicle object
  const currentVehicle = useMemo(() => {
    return activeVehicles.find(v => v.id === selectedVehicleId) || activeVehicles[0] || vehicles[0];
  }, [activeVehicles, selectedVehicleId, vehicles]);

  // Quick lookup route match for highlight
  const matchedQuickRoute = useMemo(() => {
    const p = pickup.toLowerCase();
    const d = destination.toLowerCase();
    return POPULAR_PILGRIMAGE_AND_AIRPORT_ROUTES.find(
      r =>
        (p.includes('airport') && r.id === 'route-airport-lanka') ||
        (d.includes('ayodhya') && r.id === 'route-ayodhya-ram-mandir') ||
        ((d.includes('prayagraj') || d.includes('sangam')) && r.id === 'route-prayagraj-sangam') ||
        (d.includes('bodh') && r.id === 'route-bodhgaya-circuit') ||
        (tripType === 'local_sightseeing' && r.id === 'route-kashi-sarnath-darshan') ||
        (d.includes('cantt') && r.id === 'route-airport-cantt')
    );
  }, [pickup, destination, tripType]);

  // Filtered popular spots
  const filteredSpots = useMemo(() => {
    if (activeSpotCategory === 'all') return POPULAR_SPOTS;
    return POPULAR_SPOTS.filter(s => s.category === activeSpotCategory);
  }, [activeSpotCategory]);

  // Find images matching current pickup and destination for visual route preview
  const pickupPhotoInfo = useMemo(() => {
    const p = pickup.toLowerCase();
    const match = POPULAR_SPOTS.find(
      s =>
        p.includes(s.nameEn.toLowerCase()) ||
        s.addressString.toLowerCase().includes(p) ||
        (p.includes('airport') && s.category === 'airport') ||
        (p.includes('lanka') && s.id === 'spot-lanka-varanasi') ||
        (p.includes('cantt') && s.id === 'spot-varanasi-cantt-station') ||
        (p.includes('kashi') && s.id === 'spot-kashi-vishwanath') ||
        (p.includes('dashashwamedh') && s.id === 'spot-dashashwamedh-ghat')
    );
    return match || POPULAR_SPOTS[8] || POPULAR_SPOTS[0]; // fallback to Lanka or Airport
  }, [pickup]);

  const destinationPhotoInfo = useMemo(() => {
    const d = destination.toLowerCase();
    const match = POPULAR_SPOTS.find(
      s =>
        d.includes(s.nameEn.toLowerCase()) ||
        s.addressString.toLowerCase().includes(d) ||
        (d.includes('ayodhya') && s.id === 'spot-ayodhya-ram-mandir') ||
        ((d.includes('sangam') || d.includes('prayagraj')) && s.id === 'spot-prayagraj-sangam') ||
        (d.includes('sarnath') && s.id === 'spot-sarnath-stupa') ||
        (d.includes('bodh') && s.id === 'spot-mahabodhi-temple') ||
        (d.includes('airport') && s.id === 'spot-babatpur-airport') ||
        (d.includes('kashi') && s.id === 'spot-kashi-vishwanath')
    );
    return match || POPULAR_SPOTS[3] || POPULAR_SPOTS[1]; // fallback to Ayodhya or Kashi
  }, [destination]);

  // Fetch estimate from server-side endpoint POST /api/fare-estimates
  const fetchServerEstimate = async () => {
    const errors: { pickup?: string; destination?: string } = {};
    if (!pickup.trim()) {
      errors.pickup = lang === 'hi' ? 'कृपया पिकअप स्थान दर्ज करें।' : 'Pickup location is required.';
    }
    if (tripType !== 'local_sightseeing' && !destination.trim()) {
      errors.destination = lang === 'hi' ? 'कृपया गंतव्य स्थान दर्ज करें।' : 'Destination is required.';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setServerEstimate(null);
      setIsLoading(false);
      return;
    }

    if (!currentVehicle || !currentVehicle.isActive) {
      setApiError(
        lang === 'hi'
          ? 'चयनित वाहन वर्तमान में अनुपलब्ध है। कृपया कोई अन्य वाहन चुनें।'
          : 'Selected vehicle is currently unavailable. Please select another vehicle or request a custom quote.'
      );
      setServerEstimate(null);
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setRequiresCustomQuote(false);

    try {
      const payload: FareEstimateRequest = {
        vehicleId: currentVehicle.id,
        pickup: pickup.trim(),
        destination:
          tripType === 'local_sightseeing'
            ? 'Varanasi Local Sightseeing (Kashi Dham & Sarnath)'
            : destination.trim(),
        tripType,
        departureDate,
        departureTime,
        returnDate: tripType === 'round_trip' ? returnDate : undefined,
        passengerCount,
        specialRequirements: specialRequirements.trim() || undefined,
      };

      const res = await fetch('/api/fare-estimates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requiresCustomQuote) {
          setRequiresCustomQuote(true);
        }
        throw new Error(data.error || 'Failed to compute trip fare');
      }

      setServerEstimate(data);
    } catch (err: any) {
      setApiError(err.message || 'Error communicating with pricing engine');
      setServerEstimate(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced effect whenever parameters change
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchServerEstimate();
    }, 280);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    pickup,
    destination,
    tripType,
    departureDate,
    departureTime,
    returnDate,
    passengerCount,
    selectedVehicleId,
    currentVehicle?.id,
  ]);

  // Handle GPS Auto-Detection Trigger
  const handleAutoDetectLocation = async (field: 'pickup' | 'destination') => {
    setIsDetectingGps(true);
    setGpsTargetField(field);
    setGpsError(null);
    setGpsStatusMessage(lang === 'hi' ? 'फोन GPS से स्थान ट्रैक किया जा रहा है...' : 'Acquiring GPS fix from device...');

    try {
      const result = await detectPhoneLocation();
      setLastGpsResult(result);

      if (field === 'pickup') {
        setPickup(result.detectedName);
      } else {
        setDestination(result.detectedName);
      }

      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
      setGpsStatusMessage(
        lang === 'hi'
          ? `📍 GPS द्वारा पहचाना गया: ${result.landmarkDetail || result.detectedName}`
          : `📍 GPS detected: ${result.landmarkDetail || result.detectedName}`
      );
    } catch (err: any) {
      setGpsError(err.message || 'GPS location error');
      setGpsStatusMessage(null);
    } finally {
      setIsDetectingGps(false);
    }
  };

  // Preset location handler (for 1-tap fast testing or fallback)
  const handleApplyPresetSpot = (spot: PopularSpot, field: 'pickup' | 'destination') => {
    if (field === 'pickup') {
      setPickup(spot.addressString);
      setValidationErrors(prev => ({ ...prev, pickup: undefined }));
    } else {
      setDestination(spot.addressString);
      setValidationErrors(prev => ({ ...prev, destination: undefined }));
    }
    setGpsStatusMessage(
      lang === 'hi'
        ? `✓ ${field === 'pickup' ? 'पिकअप' : 'गंतव्य'} निर्धारित: ${spot.nameHi}`
        : `✓ Set as ${field === 'pickup' ? 'Pickup' : 'Drop'}: ${spot.nameEn}`
    );
  };

  // Handle Quick Route click
  const handleSelectQuickRoute = (qr: PopularRouteWithPhotos) => {
    setPickup(qr.pickup);
    setDestination(qr.destination);
    setTripType(qr.tripType);
    setValidationErrors({});
    setGpsStatusMessage(
      lang === 'hi'
        ? `मार्ग चुना गया: ${qr.labelHi}`
        : `Selected route: ${qr.labelEn}`
    );
  };

  // 1-Click WhatsApp Booking
  const handleDirectWhatsAppBooking = () => {
    if (onDirectBookingConfirmed) {
      onDirectBookingConfirmed();
    }

    const vehName = serverEstimate?.vehicleName || currentVehicle.name;
    const estFare = serverEstimate
      ? `₹${serverEstimate.totalEstimatedFare.toLocaleString('en-IN')}`
      : 'To be confirmed';
    const distText = serverEstimate ? `${serverEstimate.billableDistanceKm} km billable` : '';

    const text = encodeURIComponent(
      lang === 'hi'
        ? `नमस्ते! मुझे उज्ज्वल टूर एंड ट्रैवेल्स (वाराणसी) से कैब बुक करनी है:
• गाड़ी: ${vehName} (${currentVehicle.category})
• पिकअप: ${pickup}
• गंतव्य: ${tripType === 'local_sightseeing' ? 'वाराणसी स्थानीय दर्शन' : destination}
• यात्रा प्रकार: ${tripType === 'round_trip' ? 'राउंड ट्रिप (वापसी सहित)' : tripType}
• तारीख: ${departureDate} (${departureTime})
• कुल अनुमानित किराया: ${estFare} ${distText ? `(${distText})` : ''}
कृपया गाड़ी की उपलब्धता एवं बुकिंग की पुष्टि करें।`
        : `Hello! I would like to book a cab with Ujjawal Tour & Travels (Varanasi):
• Vehicle: ${vehName} (${currentVehicle.category})
• Pickup: ${pickup}
• Destination: ${tripType === 'local_sightseeing' ? 'Varanasi Local Sightseeing' : destination}
• Trip Type: ${tripType === 'round_trip' ? 'Round Trip' : tripType}
• Date: ${departureDate} at ${departureTime}
• Estimated Fare: ${estFare} ${distText ? `(${distText})` : ''}
Please confirm availability and dispatch.`
    );

    const cleanNumber = primaryPhone.replace(/\D/g, '') || '7651944600';
    const url = `https://wa.me/91${cleanNumber}?text=${text}`;

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const handleCustomQuoteClick = () => {
    onRequestCustomQuote({
      vehicleId: currentVehicle.id,
      pickup,
      destination,
      tripType,
      departureDate,
      departureTime,
      passengerCount,
      specialRequirements,
    });
  };

  return (
    <section
      id="calculator"
      className="relative py-12 sm:py-20 bg-[#FFF9F0]/95 backdrop-blur-md overflow-hidden border-t border-[#C69A52]/30"
    >
      {/* Background Engraved Ganga Aarti Stamp Watermark */}
      <div className="absolute left-2 bottom-4 pointer-events-none opacity-8 z-0">
        <GangaAartiWatermark opacity={1} tint="crimson" size={540} />
      </div>
      <div className="absolute right-0 top-1/4 pointer-events-none opacity-6 z-0">
        <KashiVishwanathWatermark opacity={1} tint="gold" size={580} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#821B25] uppercase tracking-wider bg-[#F3E8D5] px-3.5 py-1 rounded-md border border-[#C69A52]/40">
            <Calculator className="w-3.5 h-3.5 text-[#821B25]" />
            <span>{lang === 'hi' ? 'सर्वर-सत्यापित किराया कैलकुलेटर' : 'Server-Verified Fare Calculator'}</span>
          </div>

          <h2 className="font-heritage text-2xl sm:text-4xl lg:text-5xl font-bold text-[#821B25] tracking-tight">
            {t.calcTitle}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#292321]/85 leading-relaxed">
            {lang === 'hi'
              ? 'फोन GPS द्वारा स्वचालित पिकअप पहचान, तीर्थ एवं एयरपोर्ट मार्गों की वास्तविक तस्वीरें तथा आधिकारिक टैरिफ गणना।'
              : 'Phone GPS auto-location detection, verified pilgrimage and airport route photos, and transparent road tariffs.'}
          </p>
        </div>

        {/* 1. POPULAR PILGRIMAGE & AIRPORT ROUTES WITH VERIFIED PHOTOS */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-[#821B25]">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#B5222A]" />
              {lang === 'hi' ? 'लोकप्रिय तीर्थ एवं एयरपोर्ट मार्ग (फोटो सहित):' : 'Popular Pilgrimage & Airport Routes (With Photos):'}
            </span>
            <span className="text-[#292321]/60 text-[11px] font-normal">
              {lang === 'hi' ? '1-टैप में पिकअप और ड्रॉप स्वतः भरें' : '1-Tap to auto-fill pickup & drop'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {POPULAR_PILGRIMAGE_AND_AIRPORT_ROUTES.map(qr => {
              const isSelected = matchedQuickRoute?.id === qr.id;
              return (
                <button
                  key={qr.id}
                  type="button"
                  onClick={() => handleSelectQuickRoute(qr)}
                  className={`p-3 rounded-2xl text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between overflow-hidden group focus-visible:outline-2 focus-visible:outline-[#821B25] ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#821B25] via-[#9E1B26] to-[#B5222A] text-white border-transparent shadow-lg ring-2 ring-[#C69A52]'
                      : 'bg-white hover:bg-[#FFFDF7] text-[#292321] border-[#C69A52]/40 hover:border-[#821B25] shadow-xs hover:-translate-y-0.5'
                  }`}
                >
                  {/* Endpoint photos preview */}
                  <div className="relative h-24 w-full rounded-xl overflow-hidden mb-2.5 bg-stone-900 shrink-0 flex">
                    {/* Pickup photo */}
                    <div className="relative w-1/2 h-full border-r border-white/20 overflow-hidden">
                      <img
                        src={qr.pickupPhoto}
                        alt="Pickup point"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={e => {
                          e.currentTarget.src = '/assets/places/kashi-dashashwamedh.jpg';
                        }}
                      />
                      <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white bg-black/70 px-1 py-0.5 rounded shadow">
                        📍 Pickup
                      </span>
                    </div>

                    {/* Destination photo */}
                    <div className="relative w-1/2 h-full overflow-hidden">
                      <img
                        src={qr.destinationPhoto}
                        alt="Destination point"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={e => {
                          e.currentTarget.src = '/assets/places/ayodhya-ram-mandir.jpg';
                        }}
                      />
                      <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-white bg-black/70 px-1 py-0.5 rounded shadow">
                        🏁 Drop
                      </span>
                    </div>

                    {/* Category pill on top */}
                    <div className="absolute top-1.5 left-2 flex items-center gap-1 bg-black/70 text-[#F3E8D5] text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      {qr.category === 'airport' && <Plane className="w-3 h-3 text-[#FBBF24]" />}
                      {qr.category === 'pilgrimage' && <Flame className="w-3 h-3 text-[#F87171]" />}
                      {qr.category === 'transit' && <Train className="w-3 h-3 text-[#60A5FA]" />}
                      <span>
                        {qr.category === 'airport'
                          ? 'Airport'
                          : qr.category === 'pilgrimage'
                          ? 'Pilgrimage'
                          : 'Transit'}
                      </span>
                    </div>

                    {/* Distance Badge */}
                    <span className="absolute top-1.5 right-2 text-[10px] font-bold text-white bg-[#821B25]/90 px-1.5 py-0.5 rounded shadow">
                      ~{qr.distanceKm} km
                    </span>
                  </div>

                  {/* Route Label & Highlights */}
                  <div className="px-0.5 space-y-1">
                    <div
                      className={`text-xs font-bold leading-snug line-clamp-2 ${
                        isSelected ? 'text-white' : 'text-[#821B25]'
                      }`}
                    >
                      {lang === 'hi' ? qr.labelHi : qr.labelEn}
                    </div>

                    <div
                      className={`text-[11px] font-medium flex items-center justify-between ${
                        isSelected ? 'text-[#F3E8D5]' : 'text-[#292321]/70'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{qr.durationText}</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          isSelected ? 'text-white' : 'text-[#B5222A]'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : 'Select →'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. POPULAR PILGRIMAGE & AIRPORT SPOTS PHOTO STRIP (QUICK PICKUP & DROP PICKER) */}
        <div className="bg-white rounded-2xl border border-[#C69A52]/40 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#821B25] text-white">
                <Navigation className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#821B25]">
                  {lang === 'hi'
                    ? 'तीर्थ स्थल एवं एयरपोर्ट फोटो पिकर (पिकअप या ड्रॉप चुनें):'
                    : 'Pilgrimage & Airport Spots Photo Bar (Set as Pickup or Drop):'}
                </h3>
                <span className="text-[10px] text-[#292321]/60">
                  {lang === 'hi'
                    ? 'तस्वीर देखें और सीधे अपने पिकअप या ड्रॉप स्थान में जोड़ें'
                    : 'Tap photo to set location directly into the calculator'}
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-[11px]">
              {(
                [
                  { id: 'all', label: 'All Spots' },
                  { id: 'airport', label: '✈️ Airport' },
                  { id: 'pilgrimage', label: '🛕 Pilgrimage' },
                  { id: 'transit', label: '🚆 Rail Hub' },
                ] as const
              ).map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveSpotCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeSpotCategory === cat.id
                      ? 'bg-[#821B25] text-white shadow-xs'
                      : 'bg-[#F3E8D5]/60 hover:bg-[#F3E8D5] text-[#821B25]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal touch-friendly scrollable card grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredSpots.map(spot => (
              <div
                key={spot.id}
                className="bg-[#FFFDF7] rounded-xl border border-[#C69A52]/30 p-2.5 flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div className="relative h-20 w-full rounded-lg overflow-hidden mb-2 bg-stone-900 shrink-0">
                  <img
                    src={spot.image}
                    alt={spot.nameEn}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={e => {
                      if (spot.fallbackImage) {
                        e.currentTarget.src = spot.fallbackImage;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-1 left-1.5 text-[10px] font-bold text-white drop-shadow">
                    {lang === 'hi' ? spot.nameHi : spot.nameEn}
                  </span>
                </div>

                <p className="text-[10px] text-[#292321]/70 line-clamp-1 mb-2">
                  {spot.description}
                </p>

                {/* Dual action buttons: Set as Pickup or Set as Drop */}
                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSpot(spot, 'pickup')}
                    className="py-1 px-1.5 bg-[#821B25] hover:bg-[#B5222A] text-white rounded text-[10px] font-bold transition-colors cursor-pointer text-center"
                    title={`Set ${spot.nameEn} as Pickup`}
                  >
                    📍 Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSpot(spot, 'destination')}
                    className="py-1 px-1.5 bg-[#F3E8D5] hover:bg-[#E8D5B5] text-[#821B25] rounded text-[10px] font-bold transition-colors cursor-pointer text-center"
                    title={`Set ${spot.nameEn} as Drop`}
                  >
                    🏁 Drop
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE FLEET VEHICLE SELECTION BAR */}
        <div className="bg-white rounded-2xl border border-[#C69A52]/40 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#821B25]">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Car className="w-4 h-4 text-[#B5222A]" />
              {lang === 'hi' ? 'वाहन चुनें (वास्तविक बेड़ा):' : 'Select Vehicle from Fleet:'}
            </span>
            <span className="text-[11px] text-[#821B25] font-semibold bg-[#F3E8D5] px-2.5 py-0.5 rounded">
              {activeVehicles.length} {lang === 'hi' ? 'सत्यापित वाहन उपलब्ध' : 'Active Vehicles Available'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {activeVehicles.map(veh => {
              const isSelected = veh.id === currentVehicle.id;

              return (
                <button
                  key={veh.id}
                  type="button"
                  onClick={() => onSelectVehicleId(veh.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-[#821B25] ${
                    isSelected
                      ? 'bg-[#FFF9F0] border-[#821B25] shadow-md ring-2 ring-[#821B25]/20 scale-101'
                      : 'bg-white border-[#C69A52]/30 hover:border-[#821B25] hover:bg-[#FFF9F0]/50 shadow-2xs'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute -top-2 right-2 bg-[#821B25] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                      ✓ Selected
                    </span>
                  )}

                  <div className="relative h-16 w-full bg-white rounded-lg p-1 mb-2 flex items-center justify-center overflow-hidden border border-stone-100 shrink-0">
                    <img
                      src={veh.image}
                      alt={veh.name}
                      loading="lazy"
                      onError={e => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (veh.fallbackImage && target.src !== veh.fallbackImage) {
                          target.src = veh.fallbackImage;
                        } else {
                          target.src = '/assets/vehicles/maruti-suzuki-dzire.png';
                        }
                      }}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#292321] truncate leading-tight">{veh.name}</div>
                    <div className="text-[10px] text-[#292321]/60 mb-1">
                      {veh.category} · {veh.seatingCapacity} {t.passengers}
                    </div>
                    <div className="flex items-baseline justify-between pt-1 border-t border-stone-200">
                      <span className="text-[10px] text-[#821B25] font-bold">₹{veh.perKmRate}/km</span>
                      <span className="text-[11px] font-medium text-[#292321]/70">Min ₹{veh.minFare}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. VISUAL ROUTE SUMMARY BANNER (PICKUP PHOTO → DROP PHOTO) */}
        <div className="bg-[#FFFDF7] rounded-2xl border-2 border-[#C69A52]/40 p-3 sm:p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Pickup endpoint */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#821B25]/20 shadow-xs">
                <img
                  src={pickupPhotoInfo.image}
                  alt={pickupPhotoInfo.nameEn}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.currentTarget.src = '/assets/places/kashi-dashashwamedh.jpg';
                  }}
                />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-[#821B25] uppercase tracking-wider block">
                  📍 Pickup Origin
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#292321] line-clamp-1">
                  {pickup}
                </span>
              </div>
            </div>

            {/* Road Transit Indicator */}
            <div className="flex items-center gap-2 text-xs font-bold text-[#821B25] bg-[#F3E8D5] px-3 py-1.5 rounded-full shrink-0">
              <span>{tripType === 'round_trip' ? '⇄ Round Trip' : '→ One Way'}</span>
              {serverEstimate && (
                <span className="bg-[#821B25] text-white px-2 py-0.5 rounded-full text-[10px]">
                  {serverEstimate.roadDistanceKm} km
                </span>
              )}
            </div>

            {/* Destination endpoint */}
            <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-end">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold text-[#821B25] uppercase tracking-wider block">
                  🏁 Drop Destination
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#292321] line-clamp-1">
                  {tripType === 'local_sightseeing'
                    ? 'Varanasi Local Sightseeing'
                    : destination}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#821B25]/20 shadow-xs">
                <img
                  src={destinationPhotoInfo.image}
                  alt={destinationPhotoInfo.nameEn}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.currentTarget.src = '/assets/places/ayodhya-ram-mandir.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3.5 INTERACTIVE GOOGLE MAPS & LIVE GPS ROUTE VIEWER */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#821B25]">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Navigation className="w-4 h-4 text-[#B5222A]" />
              {lang === 'hi' ? 'गूगल मैप्स लाइव मार्ग एवं GPS:' : 'Google Maps Live Route & Phone GPS:'}
            </span>
            <button
              type="button"
              onClick={() => setShowGoogleMap(prev => !prev)}
              className="text-[11px] font-bold text-[#821B25] hover:text-[#B5222A] bg-[#F3E8D5] px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1"
            >
              {showGoogleMap
                ? (lang === 'hi' ? '▲ मैप छुपाएं' : '▲ Collapse Map')
                : (lang === 'hi' ? '▼ गूगल मैप्स देखें' : '▼ View Live Google Map')}
            </button>
          </div>

          {showGoogleMap && (
            <GoogleRouteMap
              pickup={pickup}
              destination={tripType === 'local_sightseeing' ? 'Varanasi Local Sightseeing' : destination}
              userLocation={lastGpsResult}
              onDetectGps={() => handleAutoDetectLocation('pickup')}
              isDetectingGps={isDetectingGps}
              onSelectSpot={(spot, field) => handleApplyPresetSpot(spot, field)}
              lang={lang}
            />
          )}
        </div>

        {/* 4. MAIN DUAL PANEL: CONTROLS & SERVER-SIDE ESTIMATE SLIP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: FORM INPUTS WITH PHONE GPS AUTO LOCATION DETECTION */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#C69A52]/40 p-5 sm:p-7 shadow-xs space-y-6">
            {/* Trip Type Segmented Control */}
            <div>
              <label className="block text-xs font-bold text-[#821B25] uppercase tracking-wider mb-2">
                {t.tripCategory}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-[#F3E8D5]/70 rounded-xl border border-[#C69A52]/30">
                {[
                  { key: 'one_way', label: t.oneWay },
                  { key: 'round_trip', label: t.roundTrip },
                  { key: 'local_sightseeing', label: t.local8hr },
                  { key: 'airport_transfer', label: t.airportDrop },
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTripType(item.key as any)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#821B25] ${
                      tripType === item.key
                        ? 'bg-[#821B25] text-white shadow-xs'
                        : 'text-[#292321] hover:text-[#821B25] hover:bg-white/70'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Selection & Trip Fleet Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#821B25] uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'वाहन चुनें (वाणिज्यिक बेड़ा):' : 'Select Vehicle for Trip:'}</span>
                </label>
                <span className="text-[11px] text-[#292321]/70 font-semibold">
                  {currentVehicle.seatingCapacity} {lang === 'hi' ? 'सीटें' : 'Seats'} · ₹{currentVehicle.perKmRate}/km
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {vehicles.filter(v => v.isActive).map(v => {
                  const isSelected = v.id === selectedVehicleId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => onSelectVehicleId(v.id)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'border-[#821B25] bg-[#821B25] text-white shadow-xs'
                          : 'border-[#C69A52]/40 bg-[#FFFDF7] text-[#292321] hover:bg-[#F3E8D5]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/30 shrink-0">
                        <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold truncate leading-tight">{v.name}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-amber-200' : 'text-[#821B25] font-semibold'}`}>
                          ₹{v.perKmRate}/km · {v.seatingCapacity}s
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GPS Status Banner */}
            {(gpsStatusMessage || isDetectingGps || gpsError) && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 transition-all ${
                  gpsError
                    ? 'bg-rose-50 border border-rose-200 text-rose-800'
                    : isDetectingGps
                    ? 'bg-amber-50 border border-amber-200 text-amber-900 animate-pulse'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isDetectingGps ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-700" />
                  ) : gpsError ? (
                    <AlertCircle className="w-4 h-4 text-rose-700" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  )}
                  <span className="font-medium">{gpsStatusMessage || gpsError}</span>
                </div>

                {gpsError && (
                  <button
                    type="button"
                    onClick={() => handleAutoDetectLocation(gpsTargetField)}
                    className="px-2 py-1 bg-rose-700 text-white rounded text-[10px] font-bold hover:bg-rose-800 transition-colors"
                  >
                    Retry GPS
                  </button>
                )}
              </div>
            )}

            {/* Pickup & Destination Inputs with Dedicated GPS Auto-Detect Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pickup location with Phone GPS */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="calc-pickup-input"
                    className="text-xs font-bold text-[#292321] flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#B5222A]" />
                    <span>{t.pickupLocation}</span>
                  </label>

                  {/* Auto-Detect Phone GPS Button */}
                  <button
                    type="button"
                    onClick={() => handleAutoDetectLocation('pickup')}
                    disabled={isDetectingGps}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#821B25] hover:text-[#B5222A] bg-[#F3E8D5] hover:bg-[#E8D5B5] px-2 py-0.5 rounded-full transition-all cursor-pointer disabled:opacity-50"
                    title="Auto-detect current location using phone GPS"
                  >
                    <Crosshair className={`w-3 h-3 ${isDetectingGps ? 'animate-spin' : ''}`} />
                    <span>{lang === 'hi' ? 'GPS पहचानें' : 'GPS Auto-Detect'}</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="calc-pickup-input"
                    type="text"
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                    placeholder={t.pickupPlaceholder}
                    className={`w-full bg-[#FFF9F0] border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#292321] focus:outline-none focus:border-[#821B25] focus:ring-1 focus:ring-[#821B25] transition-all ${
                      validationErrors.pickup ? 'border-red-500 bg-red-50/30' : 'border-[#C69A52]/40'
                    }`}
                  />
                </div>

                {validationErrors.pickup && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{validationErrors.pickup}</span>
                  </p>
                )}

                {/* Quick Presets for Pickup */}
                <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto text-[10px] text-[#821B25]">
                  <span className="text-[#292321]/50 whitespace-nowrap">Quick:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSpot(POPULAR_SPOTS[0], 'pickup')}
                    className="px-1.5 py-0.5 bg-stone-100 hover:bg-[#F3E8D5] rounded whitespace-nowrap font-medium"
                  >
                    ✈️ Airport VNS
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSpot(POPULAR_SPOTS[7], 'pickup')}
                    className="px-1.5 py-0.5 bg-stone-100 hover:bg-[#F3E8D5] rounded whitespace-nowrap font-medium"
                  >
                    🚆 Cantt Station
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetSpot(POPULAR_SPOTS[8], 'pickup')}
                    className="px-1.5 py-0.5 bg-stone-100 hover:bg-[#F3E8D5] rounded whitespace-nowrap font-medium"
                  >
                    📍 Lanka / BHU
                  </button>
                </div>
              </div>

              {/* Destination location with Phone GPS / Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="calc-dest-input"
                    className="text-xs font-bold text-[#292321] flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#B5222A]" />
                    <span>{t.destinationLocation}</span>
                  </label>

                  {/* Auto-Detect Drop GPS Button */}
                  {tripType !== 'local_sightseeing' && (
                    <button
                      type="button"
                      onClick={() => handleAutoDetectLocation('destination')}
                      disabled={isDetectingGps}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#821B25] hover:text-[#B5222A] bg-[#F3E8D5] hover:bg-[#E8D5B5] px-2 py-0.5 rounded-full transition-all cursor-pointer disabled:opacity-50"
                      title="Auto-detect destination location using phone GPS"
                    >
                      <Crosshair className={`w-3 h-3 ${isDetectingGps ? 'animate-spin' : ''}`} />
                      <span>{lang === 'hi' ? 'GPS पहचानें' : 'GPS Auto-Detect'}</span>
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    id="calc-dest-input"
                    type="text"
                    value={destination}
                    disabled={tripType === 'local_sightseeing'}
                    onChange={e => setDestination(e.target.value)}
                    placeholder={
                      tripType === 'local_sightseeing'
                        ? 'Varanasi Local Sightseeing'
                        : t.destinationPlaceholder
                    }
                    className={`w-full bg-[#FFF9F0] border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#292321] focus:outline-none focus:border-[#821B25] focus:ring-1 focus:ring-[#821B25] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                      validationErrors.destination ? 'border-red-500 bg-red-50/30' : 'border-[#C69A52]/40'
                    }`}
                  />
                </div>

                {validationErrors.destination && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{validationErrors.destination}</span>
                  </p>
                )}

                {/* Quick Presets for Drop */}
                {tripType !== 'local_sightseeing' && (
                  <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto text-[10px] text-[#821B25]">
                    <span className="text-[#292321]/50 whitespace-nowrap">Quick:</span>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetSpot(POPULAR_SPOTS[3], 'destination')}
                      className="px-1.5 py-0.5 bg-stone-100 hover:bg-[#F3E8D5] rounded whitespace-nowrap font-medium"
                    >
                      🚩 Ayodhya Mandir
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetSpot(POPULAR_SPOTS[4], 'destination')}
                      className="px-1.5 py-0.5 bg-stone-100 hover:bg-[#F3E8D5] rounded whitespace-nowrap font-medium"
                    >
                      🌊 Sangam Prayagraj
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetSpot(POPULAR_SPOTS[1], 'destination')}
                      className="px-1.5 py-0.5 bg-stone-100 hover:bg-[#F3E8D5] rounded whitespace-nowrap font-medium"
                    >
                      🛕 Kashi Dham
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Date & Time Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="calc-dep-date"
                  className="block text-xs font-bold text-[#292321] mb-1.5 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#B5222A]" />
                  <span>{t.departureDate}</span>
                </label>
                <input
                  id="calc-dep-date"
                  type="date"
                  value={departureDate}
                  onChange={e => setDepartureDate(e.target.value)}
                  className="w-full bg-[#FFF9F0] border border-[#C69A52]/40 rounded-lg px-3 py-2 text-xs text-[#292321] focus:outline-none focus:border-[#821B25]"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-dep-time"
                  className="block text-xs font-bold text-[#292321] mb-1.5 flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-[#B5222A]" />
                  <span>{t.pickupTime}</span>
                </label>
                <input
                  id="calc-dep-time"
                  type="time"
                  value={departureTime}
                  onChange={e => setDepartureTime(e.target.value)}
                  className="w-full bg-[#FFF9F0] border border-[#C69A52]/40 rounded-lg px-3 py-2 text-xs text-[#292321] focus:outline-none focus:border-[#821B25]"
                />
              </div>

              {tripType === 'round_trip' ? (
                <div>
                  <label
                    htmlFor="calc-ret-date"
                    className="block text-xs font-bold text-[#292321] mb-1.5 flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#B5222A]" />
                    <span>{t.returnDate}</span>
                  </label>
                  <input
                    id="calc-ret-date"
                    type="date"
                    value={returnDate}
                    onChange={e => setReturnDate(e.target.value)}
                    className="w-full bg-[#FFF9F0] border border-[#C69A52]/40 rounded-lg px-3 py-2 text-xs text-[#292321] focus:outline-none focus:border-[#821B25]"
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="calc-pax-count"
                    className="block text-xs font-bold text-[#292321] mb-1.5 flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-[#B5222A]" />
                    <span>{t.passengerCount}</span>
                  </label>
                  <select
                    id="calc-pax-count"
                    value={passengerCount}
                    onChange={e => setPassengerCount(Number(e.target.value))}
                    className="w-full bg-[#FFF9F0] border border-[#C69A52]/40 rounded-lg px-3 py-2 text-xs text-[#292321] focus:outline-none focus:border-[#821B25]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(n => (
                      <option key={n} value={n}>
                        {n} {t.passengers}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Special Request or Luggage Note */}
            <div>
              <label htmlFor="calc-special-req" className="block text-xs font-bold text-[#292321] mb-1.5">
                {t.optionalNotes}
              </label>
              <input
                id="calc-special-req"
                type="text"
                value={specialRequirements}
                onChange={e => setSpecialRequirements(e.target.value)}
                placeholder={t.optionalNotesPlaceholder}
                className="w-full bg-[#FFF9F0] border border-[#C69A52]/40 rounded-lg px-3.5 py-2 text-xs text-[#292321] focus:outline-none focus:border-[#821B25]"
              />
            </div>
          </div>

          {/* RIGHT: LIVE ITEMIZED FARE SLIP FROM SERVER */}
          <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-[#821B25]/20 p-5 sm:p-7 shadow-lg space-y-5 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#C69A52]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#821B25] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heritage text-lg font-bold text-[#821B25] leading-tight">
                    {lang === 'hi' ? 'सर्वर-आधिकारिक किराया पर्ची' : 'Official Fare Slip'}
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    ● Real-Time Calculation
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#292321]/60 block">{t.selectedInCalcBtn}</span>
                <span className="text-xs font-bold text-[#821B25]">{currentVehicle.name}</span>
              </div>
            </div>

            {/* State 1: Loading */}
            {isLoading && (
              <div className="py-12 text-center space-y-3" role="status" aria-live="polite">
                <RefreshCw className="w-8 h-8 text-[#821B25] animate-spin mx-auto" />
                <p className="text-xs font-semibold text-[#292321]/80">
                  {lang === 'hi'
                    ? 'सर्वर से वाराणसी टैरिफ की गणना की जा रही है...'
                    : 'Calculating route tariff with Varanasi pricing engine...'}
                </p>
              </div>
            )}

            {/* State 2: Error or Requires Custom Quote */}
            {!isLoading && apiError && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-3">
                <div className="flex items-start gap-2 text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">{apiError}</p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={fetchServerEstimate}
                    className="px-3 py-1.5 bg-[#821B25] text-white rounded-lg font-bold text-[11px] hover:bg-[#B5222A] transition-colors cursor-pointer"
                  >
                    {lang === 'hi' ? 'पुनः प्रयास करें' : 'Retry Calculation'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCustomQuoteClick}
                    className="px-3 py-1.5 bg-white border border-[#C69A52] text-[#821B25] rounded-lg font-bold text-[11px] hover:bg-[#F3E8D5] transition-colors cursor-pointer"
                  >
                    {lang === 'hi' ? 'कस्टम कोटेशन मांगें' : 'Request Custom Quote'}
                  </button>
                </div>
              </div>
            )}

            {/* State 3: Server Estimate Ready */}
            {!isLoading && serverEstimate && (
              <>
                {/* Route Distance Banner */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#FFF9F0] rounded-xl border border-[#C69A52]/30 text-xs">
                  <div>
                    <span className="text-[10px] text-[#292321]/60 block">
                      {serverEstimate.isEstimatedRoute
                        ? lang === 'hi'
                          ? 'अनुमानित सड़क दूरी'
                          : 'Configured Route Est.'
                        : lang === 'hi'
                        ? 'सत्यापित सड़क दूरी'
                        : 'Road Network Distance'}
                    </span>
                    <span className="font-bold text-[#292321]">
                      ~{serverEstimate.roadDistanceKm} km{' '}
                      {tripType === 'round_trip' ? (lang === 'hi' ? 'एक तरफ' : 'each way') : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#292321]/60 block">{t.estimatedDriveDuration}</span>
                    <span className="font-bold text-[#292321]">{serverEstimate.estimatedDuration}</span>
                  </div>
                </div>

                {/* Itemized Calculation Lines */}
                <div className="space-y-2 text-xs border-y border-stone-200 py-3">
                  <div className="flex justify-between text-[#292321]/80">
                    <span>{t.baseTariffBookingFee}</span>
                    <span className="font-semibold text-[#292321]">₹{serverEstimate.baseFare}</span>
                  </div>

                  <div className="flex justify-between text-[#292321]/80">
                    <span>
                      {t.distanceBilling} ({serverEstimate.billableDistanceKm} km @ ₹{currentVehicle.perKmRate}/km)
                    </span>
                    <span className="font-semibold text-[#292321]">
                      ₹{serverEstimate.distanceCharge.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {serverEstimate.driverAllowance > 0 && (
                    <div className="flex justify-between text-[#292321]/80">
                      <span>{t.driverHighwayAllowance}</span>
                      <span className="font-semibold text-[#292321]">₹{serverEstimate.driverAllowance}</span>
                    </div>
                  )}

                  {serverEstimate.nightCharge > 0 && (
                    <div className="flex justify-between text-[#B5222A] font-semibold">
                      <span>{t.nightPickupAllowance} (22:00 - 06:00)</span>
                      <span>+₹{serverEstimate.nightCharge}</span>
                    </div>
                  )}

                  {serverEstimate.adjustment200Applied && (
                    <div className="flex justify-between text-[#292321]/80">
                      <span className="text-[11px]">{serverEstimate.adjustment200Label}</span>
                      <span className="font-semibold text-[#292321]">₹{serverEstimate.adjustment200Amount}</span>
                    </div>
                  )}
                </div>

                {/* Total Estimated Fare Callout Box */}
                <div className="p-4 bg-gradient-to-r from-[#821B25] to-[#B5222A] text-white rounded-xl shadow-md space-y-1">
                  <span className="text-xs font-bold text-[#F3E8D5] block uppercase tracking-wider">
                    {t.totalEstimatedFare}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      ₹{serverEstimate.totalEstimatedFare.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#F3E8D5] font-medium">All vehicle taxes inc.</span>
                  </div>
                </div>

                {/* Exclusions Notice */}
                <div className="space-y-1 text-[11px] text-[#292321]/70 leading-relaxed border-t border-stone-200 pt-2.5">
                  <p className="flex items-start gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#821B25] shrink-0 mt-0.5" />
                    <span>{serverEstimate.exclusionsNote}</span>
                  </p>
                </div>

                {/* Action CTAs */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onProceedToBooking(serverEstimate)}
                    className="w-full py-3.5 px-6 bg-[#B5222A] hover:bg-[#821B25] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#821B25]"
                  >
                    <span>{t.proceedBookingBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectWhatsAppBooking}
                    className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs sm:text-sm font-bold rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#25D366]"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>
                      {lang === 'hi' ? 'व्हाट्सएप पर 1-क्लिक में पुष्टि करें' : 'Confirm on WhatsApp with 1 Click'}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
