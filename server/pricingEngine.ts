import type { Vehicle, PricingSettings, FareEstimateRequest, FareEstimate } from '../src/types/index.js';

interface KnownRoute {
  keywordsA: string[];
  keywordsB: string[];
  distanceKm: number;
  durationText: string;
}

const KNOWN_ROUTES: KnownRoute[] = [
  {
    keywordsA: ['airport', 'babatpur', 'lal bahadur'],
    keywordsB: ['lanka', 'samneghat', 'bhu', 'hariom'],
    distanceKm: 32,
    durationText: '1 hr 10 min'
  },
  {
    keywordsA: ['airport', 'babatpur', 'lal bahadur'],
    keywordsB: ['cantt', 'junction', 'station', 'varanasi city', 'sigra'],
    distanceKm: 24,
    durationText: '50 min'
  },
  {
    keywordsA: ['airport', 'babatpur', 'lal bahadur'],
    keywordsB: ['dashashwamedh', 'ghat', 'assi', 'godowlia', 'kashi vishwanath'],
    distanceKm: 28,
    durationText: '1 hr'
  },
  {
    keywordsA: ['varanasi', 'kashi', 'cantt', 'lanka', 'junction'],
    keywordsB: ['sarnath', 'dhamek', 'deer park'],
    distanceKm: 14,
    durationText: '35 min'
  },
  {
    keywordsA: ['varanasi', 'kashi', 'cantt', 'lanka', 'samneghat'],
    keywordsB: ['prayagraj', 'allahabad', 'sangam', 'triveni'],
    distanceKm: 125,
    durationText: '2 hr 45 min'
  },
  {
    keywordsA: ['varanasi', 'kashi', 'cantt', 'lanka', 'samneghat'],
    keywordsB: ['ayodhya', 'ram mandir', 'ram janmabhoomi', 'faizabad'],
    distanceKm: 218,
    durationText: '4 hr 30 min'
  },
  {
    keywordsA: ['varanasi', 'kashi', 'cantt', 'lanka', 'samneghat'],
    keywordsB: ['bodh gaya', 'bodhgaya', 'mahabodhi'],
    distanceKm: 254,
    durationText: '5 hr 15 min'
  },
  {
    keywordsA: ['varanasi', 'kashi', 'cantt', 'lanka', 'samneghat'],
    keywordsB: ['gaya', 'vishnupad'],
    distanceKm: 245,
    durationText: '5 hr'
  },
  {
    keywordsA: ['varanasi', 'kashi', 'cantt', 'lanka', 'samneghat'],
    keywordsB: ['mirzapur', 'vindhyachal', 'ashtabhuja'],
    distanceKm: 68,
    durationText: '1 hr 45 min'
  },
  {
    keywordsA: ['varanasi', 'kashi', 'cantt', 'lanka', 'samneghat'],
    keywordsB: ['chunar', 'chunar fort'],
    distanceKm: 42,
    durationText: '1 hr 15 min'
  },
  {
    keywordsA: ['varanasi', 'kashi', 'cantt', 'lanka', 'samneghat'],
    keywordsB: ['chitrakoot', 'ramghat'],
    distanceKm: 260,
    durationText: '5 hr 45 min'
  },
  {
    keywordsA: ['varanasi', 'kashi', 'cantt', 'lanka', 'samneghat'],
    keywordsB: ['lucknow', 'charbagh', 'hazratganj'],
    distanceKm: 310,
    durationText: '5 hr 30 min'
  },
  {
    keywordsA: ['varanasi', 'kashi', 'cantt', 'lanka', 'samneghat'],
    keywordsB: ['gorakhpur', 'gorakhnath'],
    distanceKm: 205,
    durationText: '4 hr 15 min'
  },
  {
    keywordsA: ['varanasi', 'kashi', 'cantt', 'lanka', 'samneghat'],
    keywordsB: ['jaunpur', 'shahi qila'],
    distanceKm: 65,
    durationText: '1 hr 30 min'
  },
  {
    keywordsA: ['varanasi', 'kashi', 'cantt', 'lanka', 'samneghat'],
    keywordsB: ['sasaram', 'sher shah suri'],
    distanceKm: 125,
    durationText: '2 hr 45 min'
  },
  {
    keywordsA: ['varanasi', 'kashi', 'cantt', 'lanka', 'samneghat'],
    keywordsB: ['patna', 'danapur'],
    distanceKm: 250,
    durationText: '5 hr 30 min'
  }
];

export function calculateRoadDistance(
  pickupRaw: string,
  destRaw: string,
  tripType: string
): { distanceKm: number; durationText: string; isEstimatedRoute: boolean } {
  if (tripType === 'local_sightseeing') {
    return {
      distanceKm: 80,
      durationText: '8 Hours (Local Varanasi City & Ghats Package)',
      isEstimatedRoute: false
    };
  }

  const p = pickupRaw.toLowerCase().trim();
  const d = destRaw.toLowerCase().trim();

  // Check known road network routes
  for (const route of KNOWN_ROUTES) {
    const pMatchesA = route.keywordsA.some(k => p.includes(k));
    const dMatchesB = route.keywordsB.some(k => d.includes(k));

    const pMatchesB = route.keywordsB.some(k => p.includes(k));
    const dMatchesA = route.keywordsA.some(k => d.includes(k));

    if ((pMatchesA && dMatchesB) || (pMatchesB && dMatchesA)) {
      return {
        distanceKm: route.distanceKm,
        durationText: route.durationText,
        isEstimatedRoute: false
      };
    }
  }

  // Deterministic realistic road calculation based on character hash & route heuristics
  let seed = 0;
  for (let i = 0; i < p.length; i++) seed = (seed * 31 + p.charCodeAt(i)) % 10000;
  for (let i = 0; i < d.length; i++) seed = (seed * 37 + d.charCodeAt(i)) % 10000;

  // Base highway distance range between 45km and 280km for general queries
  const estimatedKm = 50 + (seed % 175);
  const hours = Math.floor(estimatedKm / 45);
  const minutes = Math.round(((estimatedKm % 45) / 45) * 60);

  return {
    distanceKm: estimatedKm,
    durationText: hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`,
    isEstimatedRoute: true
  };
}

export function computeFareEstimate(
  req: FareEstimateRequest,
  vehicle: Vehicle,
  settings: PricingSettings
): FareEstimate {
  const route = calculateRoadDistance(req.pickup, req.destination, req.tripType);
  const roadDistanceKm = route.distanceKm;

  let billableDistanceKm = roadDistanceKm;
  let driverAllowance = 0;

  if (req.tripType === 'round_trip') {
    // Round trip pricing: return factor applies (e.g. 2.0x road distance)
    const totalRoundKm = roadDistanceKm * settings.roundTripReturnFactor;
    billableDistanceKm = Math.max(totalRoundKm, settings.minimumOutstationKmPerDay);
    driverAllowance = vehicle.driverAllowancePerDay || settings.driverAllowancePerDay;
  } else if (req.tripType === 'local_sightseeing') {
    billableDistanceKm = Math.max(roadDistanceKm, settings.minimumLocalDistanceKm);
    driverAllowance = 0; // included in local 8hr
  } else {
    // One way
    billableDistanceKm = Math.max(roadDistanceKm, vehicle.minBillableKm);
    if (roadDistanceKm > 100) {
      driverAllowance = vehicle.driverAllowancePerDay || 200;
    }
  }

  // Base Fare
  const baseFare = vehicle.baseFare;

  // Distance charge
  const distanceCharge = Math.round(billableDistanceKm * vehicle.perKmRate);

  // Night charge calculation
  let nightCharge = 0;
  if (req.departureTime) {
    const hour = parseInt(req.departureTime.split(':')[0], 10);
    if (!isNaN(hour)) {
      if (
        hour >= settings.nightChargeApplicableHours.start ||
        hour < settings.nightChargeApplicableHours.end
      ) {
        nightCharge = vehicle.nightCharge || settings.standardNightCharge;
      }
    }
  }

  // Configurable ₹200 adjustment
  let adjustment200Amount = 0;
  let adjustment200Applied = false;
  let adjustment200Label = undefined;

  if (settings.enableExtraAdjustment200) {
    adjustment200Amount = settings.extraAdjustmentAmount || 200;
    adjustment200Applied = true;
    adjustment200Label = settings.extraAdjustmentLabel || 'Special Heritage Route Maintenance & Sanitization';
  }

  // Subtotal
  let calculatedSubtotal =
    baseFare +
    distanceCharge +
    driverAllowance +
    nightCharge +
    (adjustment200Applied ? adjustment200Amount : 0);

  // Apply vehicle minimum fare guarantee if applicable
  const totalEstimatedFare = Math.max(calculatedSubtotal, vehicle.minFare);

  const estimateId = `EST-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  return {
    id: estimateId,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    vehicleCategory: vehicle.category,
    vehicleImage: vehicle.image,
    pickup: req.pickup,
    destination: req.destination,
    tripType: req.tripType,
    departureDate: req.departureDate,
    departureTime: req.departureTime,
    returnDate: req.returnDate,
    passengerCount: req.passengerCount,
    roadDistanceKm,
    estimatedDuration: route.durationText,
    isEstimatedRoute: route.isEstimatedRoute,
    billableDistanceKm,
    baseFare,
    distanceCharge,
    driverAllowance,
    nightCharge,
    adjustment200Amount,
    adjustment200Applied,
    adjustment200Label,
    totalEstimatedFare,
    currency: 'INR',
    calculatedAt: new Date().toISOString(),
    validityHours: 48,
    exclusionsNote: 'State border permits, NHAI highway tolls, and monument parking charges are payable as per actual receipts unless explicitly quoted inclusive.'
  };
}
