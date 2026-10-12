export interface Vehicle {
  id: string;
  name: string; // e.g. "Maruti Suzuki Dzire"
  category: 'Sedan' | 'MPV' | 'Family' | 'Tempo Traveller' | 'Premium';
  image: string; // primary image (internet photo URL or local)
  fallbackImage?: string; // fallback image if network drops
  registrationPlate?: string; // e.g. "DZIRE"
  seatingCapacity: number; // e.g. 4
  luggageCapacity: string; // e.g. "2 Large Bags + 1 Small"
  acAvailable: boolean;
  carrierAvailable: boolean;
  baseFare: number; // in INR
  perKmRate: number; // in INR
  minBillableKm: number; // e.g. 80
  minFare: number;
  driverAllowancePerDay: number;
  nightCharge: number;
  isVerified: boolean;
  isActive: boolean;
  description: string;
  amenities: string[];
  applicableTrips: ('one_way' | 'round_trip' | 'local_sightseeing' | 'airport_transfer')[];
  verifiedNote?: string;
}

export interface PricingSettings {
  id: string;
  enableExtraAdjustment200: boolean;
  extraAdjustmentLabel: string; // e.g. "Special Heritage Route Maintenance & Sanitization"
  extraAdjustmentAmount: number; // 200
  nightChargeApplicableHours: { start: number; end: number }; // 22 to 6
  standardNightCharge: number; // 250
  driverAllowancePerDay: number; // 300
  minimumLocalHours: number; // 8
  minimumLocalDistanceKm: number; // 80
  minimumOutstationKmPerDay: number; // 250
  roundTripReturnFactor: number; // 2.0 (standard return mileage)
  tollsIncludedByDefault: boolean;
  updatedAt: string;
}

export interface FareEstimateRequest {
  vehicleId: string;
  pickup: string;
  destination: string;
  tripType: 'one_way' | 'round_trip' | 'local_sightseeing' | 'airport_transfer';
  departureDate: string;
  departureTime?: string;
  returnDate?: string;
  passengerCount: number;
  specialRequirements?: string;
}

export interface FareEstimate {
  id: string; // e.g. "EST-84920"
  vehicleId: string;
  vehicleName: string;
  vehicleCategory: string;
  vehicleImage: string;
  pickup: string;
  destination: string;
  tripType: 'one_way' | 'round_trip' | 'local_sightseeing' | 'airport_transfer';
  departureDate: string;
  departureTime?: string;
  returnDate?: string;
  passengerCount: number;
  roadDistanceKm: number;
  estimatedDuration: string;
  isEstimatedRoute?: boolean;
  billableDistanceKm: number;
  baseFare: number;
  distanceCharge: number;
  driverAllowance: number;
  nightCharge: number;
  adjustment200Amount: number;
  adjustment200Applied: boolean;
  adjustment200Label?: string;
  totalEstimatedFare: number;
  currency: string;
  calculatedAt: string;
  validityHours: number;
  exclusionsNote: string;
}

export type EnquiryStatus =
  | 'New enquiry'
  | 'Under review'
  | 'Quotation sent'
  | 'Customer accepted'
  | 'Booking confirmed'
  | 'Completed'
  | 'Cancelled';

export interface BookingEnquiry {
  id: string; // e.g. "UTT-94812"
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  vehicleId: string;
  vehicleName: string;
  tripType: 'one_way' | 'round_trip' | 'local_sightseeing' | 'airport_transfer';
  pickup: string;
  destination: string;
  departureDate: string;
  departureTime?: string;
  returnDate?: string;
  passengerCount: number;
  fareEstimateId?: string;
  estimatedTotal?: number;
  agreedPrice?: number;
  specialRequirements?: string;
  status: EnquiryStatus;
  staffNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  location: string;
  landmarks: string;
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
  workingHours: string;
  bookingPolicy: string;
}

export interface PlacePhoto {
  name: string;
  url: string;
  fallbackUrl?: string;
  caption?: string;
}

export interface TourPackage {
  id: string;
  title: string;
  tagline: string;
  duration: string;
  destinations: string[];
  startingPrice?: number;
  image: string; // primary internet photo URL
  fallbackImage?: string; // local fallback image
  placePhotos?: PlacePhoto[]; // multiple photos of the tour destinations from internet
  description: string;
  itinerary: string[];
  inclusions: string[];
  exclusions: string[];
}

export interface UserAddress {
  id: string;
  label: string; // e.g. "Home", "Hotel", "Kashi Vishwanath"
  address: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'user' | 'vip' | 'admin';
  memberTier: 'Standard Yatri' | 'Silver Pilgrim' | 'Gold VIP Yatri';
  savedAddresses?: UserAddress[];
  passwordHash?: string;
  createdAt: string;
}

export interface WebsiteSettings {
  themeMode: 'sunrise' | 'midday' | 'sunset' | 'night';
  language: 'en' | 'hi';
  autoGpsDetection: boolean;
  interactiveGoogleMaps: boolean;
  soundEffects: boolean;
  screenMode: 'auto' | 'mobile' | 'desktop';
  compactView: boolean;
  defaultLandmark: string;
}

export interface VehicleTripFilterState {
  tripType: 'all' | 'one_way' | 'round_trip' | 'local_sightseeing' | 'airport_transfer';
  minSeats: number; // 0 (any), 4, 6, 7, 12
  category: 'all' | 'Sedan' | 'MPV' | 'Tempo Traveller';
  budgetTier: 'all' | 'economy' | 'mid' | 'premium';
  hasCarrierOnly: boolean;
  searchQuery: string;
  sortBy: 'price_asc' | 'seats_desc' | 'popular';
}
