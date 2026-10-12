/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { HeroSection } from './components/HeroSection.js';
import { VehicleBrochureCarousel } from './components/VehicleBrochureCarousel.js';
import { DestinationQuickNav } from './components/DestinationQuickNav.js';
import { FareCalculator } from './components/FareCalculator.js';
import { TourPackagesSection } from './components/TourPackagesSection.js';
import { VaranasiHeritageGallery } from './components/VaranasiHeritageGallery.js';
import { AboutAndBenefits } from './components/AboutAndBenefits.js';
import { ContactSection } from './components/ContactSection.js';
import { Footer } from './components/Footer.js';
import { BookingEnquiryModal } from './components/BookingEnquiryModal.js';
import { VehicleSpecsModal } from './components/VehicleSpecsModal.js';
import { VehicleBrochureModal } from './components/VehicleBrochureModal.js';
import { WhatsAppChatBox } from './components/WhatsAppChatBox.js';
import { GangaRiverBackground, SunPhase } from './components/GangaRiverBackground.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { MobileBottomNav } from './components/MobileBottomNav.js';
import { ThreeBarsInfoDrawer } from './components/ThreeBarsInfoDrawer.js';
import { ThreeInfoMetricsBars } from './components/ThreeInfoMetricsBars.js';
import { UserLoginModal } from './components/UserLoginModal.js';
import { UserProfileModal } from './components/UserProfileModal.js';
import { useScreenMode } from './hooks/useScreenMode.js';

import type {
  Vehicle,
  PricingSettings,
  BusinessInfo,
  TourPackage,
  FareEstimate,
  BookingEnquiry,
  FareEstimateRequest,
  UserProfile,
} from './types/index.js';
import type { Language } from './i18n/translations.js';

// Initial verified tour packages with real internet place photos
const defaultInitialTourPackages: TourPackage[] = [
  {
    id: 'kashi-darshan-heritage',
    title: 'Kashi Vishwanath & Sacred Ghats Darshan',
    tagline: 'Varanasi City & Evening Ganga Aarti Tour',
    duration: 'Full Day (8 Hours / 80 Km)',
    destinations: [
      'Kashi Vishwanath Corridor',
      'Annapurna Mandir',
      'Kaal Bhairav',
      'Dashashwamedh Evening Aarti',
      'Sankat Mochan',
      'Durga Mandir',
      'BHU Vishwanath'
    ],
    startingPrice: 2200,
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/76/DASHASHWAMEDH_GHAT%2C_VARANASI.jpg',
    fallbackImage: '/assets/places/kashi-dashashwamedh.jpg',
    placePhotos: [
      {
        name: 'Dashashwamedh Ghat Ganga Aarti',
        url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/DASHASHWAMEDH_GHAT%2C_VARANASI.jpg',
        fallbackUrl: '/assets/places/kashi-dashashwamedh.jpg',
        caption: 'Grand Maha Ganga Aarti celebration at evening twilight'
      },
      {
        name: 'Shri Kashi Vishwanath Dham Corridor',
        url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Kashi_Vishwanath_Temple_View_of_Ghat-2.jpg',
        fallbackUrl: '/assets/places/kashi-vishwanath-dham.jpg',
        caption: 'Historic temple gateway along the sacred Ganga steps'
      },
      {
        name: 'Manikarnika Sacred Ghat',
        url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Manikarnika_ghat_varanasi.jpg',
        fallbackUrl: '/assets/places/manikarnika-ghat.jpg',
        caption: 'Ancient river ghat and eternal sacred spiritual heritage'
      }
    ],
    description: 'Complete spiritual immersion in ancient Kashi with hassle-free pickup and drop. Watch the world-renowned Ganga Aarti from Dashashwamedh Ghat.',
    itinerary: [
      'Morning pickup from hotel or Varanasi Junction',
      'VIP Darshan facilitation at Shri Kashi Vishwanath Dham',
      'Kaal Bhairav Mandir, Sankat Mochan & Durga Kund',
      'New Vishwanath Temple inside green Banaras Hindu University campus',
      'Evening seating at Dashashwamedh Ghat for the grand Ganga Aarti ceremony',
      'Return drop to your hotel or station'
    ],
    inclusions: [
      'Dedicated AC Chauffeur Driven Vehicle',
      'Parking fees at major temple parking lots',
      'Driver allowance',
      'Complimentary bottled mineral water'
    ],
    exclusions: [
      'Boat rental charges on river Ganga',
      'Temple special VIP entry tickets (if opted by customer)',
      'Food & personal expenditures'
    ]
  },
  {
    id: 'sarnath-buddhist-circuit',
    title: 'Sarnath Buddhist Pilgrimage & Museum Tour',
    tagline: 'Where Lord Buddha Gave His First Sermon',
    duration: 'Half Day (5 Hours / 40 Km)',
    destinations: [
      'Dhamek Stupa',
      'Mulagandha Kuti Vihar',
      'Archaeological Museum',
      'Chaukhandi Stupa',
      'Tibetan Temple',
      'Thai Temple & Giant Buddha'
    ],
    startingPrice: 1600,
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Dhamek_Stupa%2C_Sarnath.jpg',
    fallbackImage: '/assets/places/sarnath-dhamek-stupa.jpg',
    placePhotos: [
      {
        name: 'Dhamek Stupa Sarnath',
        url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Dhamek_Stupa%2C_Sarnath.jpg',
        fallbackUrl: '/assets/places/sarnath-dhamek-stupa.jpg',
        caption: 'Colossal 5th-century cylindrical stupa marking first sermon'
      },
      {
        name: 'Ancient Buddhist Settlement',
        url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Dhamek_Stupa_and_ancient_Buddhist_settlement_%282025%29.jpg',
        fallbackUrl: '/assets/places/sarnath-dhamek-stupa.jpg',
        caption: 'Deer park monasteries, stupa base, and historical ASI grounds'
      },
      {
        name: 'Deer Park Monasteries',
        url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Monastery_around_Dhamek_stupa%2C_Sarnath.jpg',
        fallbackUrl: '/assets/places/sarnath-dhamek-stupa.jpg',
        caption: 'Serene park sanctuary where the Dhammacakkappavattana Sutta was spoken'
      }
    ],
    description: 'Serene excursion to historic Sarnath (Isipatana), located 10 km north-east of Varanasi. Explore centuries of Buddhist heritage and the Ashoka Pillar capital.',
    itinerary: [
      'Pickup from Varanasi hotel',
      'Visit Dhamek Stupa and Deer Park (Mrigadava)',
      'Mulagandha Kuti Vihar with Japanese fresco murals',
      'Sarnath Archaeological Museum (housing the Lion Capital of Ashoka)',
      'Giant 80-foot Buddha statue at Thai Temple',
      'Return to Varanasi'
    ],
    inclusions: [
      'AC Cab with fuel',
      'Toll and parking',
      'Chauffeur services'
    ],
    exclusions: [
      'Museum and monument entry passes (as per ASI rates)'
    ]
  },
  {
    id: 'prayagraj-sangam-darshan',
    title: 'Prayagraj Triveni Sangam Sacred Day Trip',
    tagline: 'Holy Confluence of Ganga, Yamuna & Saraswati',
    duration: 'Full Day Outstation (260 Km Round Trip)',
    destinations: [
      'Triveni Sangam',
      'Alopi Devi Shaktipeeth',
      'Bade Hanuman Ji Mandir',
      'Anand Bhavan',
      'Chandra Shekhar Azad Park'
    ],
    startingPrice: 3800,
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Triveni_sangam_prayagraj.jpg',
    fallbackImage: '/assets/places/prayagraj-sangam.jpg',
    placePhotos: [
      {
        name: 'Triveni Sangam Confluence',
        url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Triveni_sangam_prayagraj.jpg',
        fallbackUrl: '/assets/places/prayagraj-sangam.jpg',
        caption: 'Sacred meeting point where Yamuna merges into Ganga'
      },
      {
        name: 'Pilgrim Boats on Sangam',
        url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Triveni_Sangam_Prayagraj.jpg',
        fallbackUrl: '/assets/places/sangam-confluence.jpg',
        caption: 'Traditional wooden boats taking devotees for holy snan'
      },
      {
        name: 'Sacred Prayagraj Waters',
        url: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Wooden_boat_on_the_Ganges_at_Triveni_Sangam%2C_Prayagraj%2C_India.jpg',
        fallbackUrl: '/assets/places/prayagraj-sangam.jpg',
        caption: 'Serene expanse across the legendary confluence ghats'
      }
    ],
    description: 'Comfortable highway day trip along NH-19 from Varanasi to Prayagraj. Perform sacred holy snan at the confluence and receive blessings at the reclining Hanuman temple.',
    itinerary: [
      '06:00 AM departure from Varanasi via 6-lane NH-19 expressway',
      '08:45 AM arrival at Prayagraj Sangam Ghats for holy bath & boat ride',
      'Visit Bade Hanuman Ji (sleeping posture shrine) and Akshayavat',
      'Visit Alopi Devi (sacred Shaktipeeth)',
      'Brief stop at historic Anand Bhavan',
      'Evening return journey back to Varanasi'
    ],
    inclusions: [
      'Round trip highway travel with AC cab',
      'Toll tax receipts included in package rate',
      'Driver allowance'
    ],
    exclusions: [
      'Boating fares to Triveni Sangam midpoint point',
      'Personal pooja / purohit dakshina'
    ]
  },
  {
    id: 'ayodhya-ram-mandir-yatra',
    title: 'Ayodhya Shri Ram Janmabhoomi Darshan',
    tagline: 'Divine Journey to the Holy City of Shri Ram',
    duration: 'Full Day or 2-Day Option (440 Km Round Trip)',
    destinations: [
      'Shri Ram Janmabhoomi Mandir',
      'Hanuman Garhi',
      'Kanak Bhavan',
      'Saryu River Ghats',
      'Surya Kund'
    ],
    startingPrice: 5900,
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Ayodhya_Ram_Mandir_Inauguration_Day_Picture.jpg',
    fallbackImage: '/assets/places/ayodhya-ram-mandir.jpg',
    placePhotos: [
      {
        name: 'Shri Ram Janmabhoomi Mandir',
        url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Ayodhya_Ram_Mandir_Inauguration_Day_Picture.jpg',
        fallbackUrl: '/assets/places/ayodhya-ram-mandir.jpg',
        caption: 'Grand Nagara architecture of the new Ram Mandir in Ayodhya Dham'
      },
      {
        name: 'Temple Mandapa & Shikhara',
        url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Shri_Ram_Janambhoomi_Mandir_Mandapa_and_Sikhara.jpg',
        fallbackUrl: '/assets/places/ayodhya-mandapa.jpg',
        caption: 'Intricate pink sandstone carvings of the holy sanctum'
      },
      {
        name: 'Ayodhya Dham Complex',
        url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Ram_Janmbhoomi_Mandir%2C_Ayodhya_Dham.jpg',
        fallbackUrl: '/assets/places/ayodhya-ram-mandir.jpg',
        caption: 'Sacred vista of the Ram Janmabhoomi temple grounds'
      }
    ],
    description: 'Direct air-conditioned taxi service from Varanasi to Ayodhya Dham. Experience the grandeur of the new Ram Mandir and serene evening dip at Saryu ghats.',
    itinerary: [
      'Early morning departure from Varanasi',
      'Expressway transit via Sultanpur / Akbarpur',
      'Darshan at Shri Hanuman Garhi temple',
      'Sacred Darshan at Shri Ram Janmabhoomi complex',
      'Visit Kanak Bhavan and Dashrath Mahal',
      'Evening Aarti at Ram Ki Paidi / Saryu River',
      'Return to Varanasi'
    ],
    inclusions: [
      'Commercial vehicle permit',
      'Experienced highway chauffeur',
      'Tolls and driver day allowance'
    ],
    exclusions: [
      'Temple prasad offerings',
      'Hotel stay if 2-day option selected'
    ]
  }
];

// Initial fallback state matching prompt verified vehicles
const defaultInitialVehicles: Vehicle[] = [
  {
    id: 'maruti-suzuki-dzire',
    name: 'Maruti Suzuki Dzire',
    category: 'Sedan',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Maruti_Suzuki_Dzire_VXi_VVT_%28front%29.JPG',
    fallbackImage: '/assets/vehicles/internet/maruti-suzuki-dzire.jpg',
    registrationPlate: 'DZIRE',
    seatingCapacity: 4,
    luggageCapacity: '2 Large Suitcases + Handbags',
    acAvailable: true,
    carrierAvailable: false,
    baseFare: 800,
    perKmRate: 12,
    minBillableKm: 80,
    minFare: 1500,
    driverAllowancePerDay: 300,
    nightCharge: 250,
    isVerified: true,
    isActive: true,
    description: 'Crisp white commercial sedan featuring the DZIRE registration plate. Smooth riding comfort for Varanasi city tours, airport transfers, and one-way outstation trips.',
    amenities: ['Chilled Air Conditioning', 'Ample Legroom', 'Mobile Charging Ports', 'Bottled Mineral Water', 'Sanitized Interior'],
    applicableTrips: ['one_way', 'round_trip', 'local_sightseeing', 'airport_transfer'],
    verifiedNote: 'Verified vehicle image: White sedan with DZIRE on front number plate.'
  },
  {
    id: 'tata-zest',
    name: 'Tata Zest',
    category: 'Sedan',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Salon_de_l%27auto_de_Gen%C3%A8ve_2014_-_20140305_-_Tata_Zest.jpg',
    fallbackImage: '/assets/vehicles/internet/tata-zest.jpg',
    registrationPlate: 'ZEST',
    seatingCapacity: 4,
    luggageCapacity: '2 Large Suitcases',
    acAvailable: true,
    carrierAvailable: false,
    baseFare: 750,
    perKmRate: 11.5,
    minBillableKm: 80,
    minFare: 1400,
    driverAllowancePerDay: 300,
    nightCharge: 250,
    isVerified: true,
    isActive: true,
    description: 'Dependable white compact sedan displaying the ZEST registration plate. Economical, comfortable, and well-suited for city pickup, ghat transfers, and short intercity routes.',
    amenities: ['Chilled AC', 'Padded Comfort Seats', 'Audio System', 'USB Charging', 'Clean Headrests'],
    applicableTrips: ['one_way', 'round_trip', 'local_sightseeing', 'airport_transfer'],
    verifiedNote: 'Verified vehicle image: White sedan with ZEST on front number plate.'
  },
  {
    id: 'maruti-suzuki-ertiga',
    name: 'Maruti Suzuki Ertiga',
    category: 'MPV',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/2024_Suzuki_Ertiga_1.5_GLX_Hybrid_in_Snow_White_Pearl%2C_front_right%2C_06-16-2024.jpg',
    fallbackImage: '/assets/vehicles/internet/maruti-suzuki-ertiga.jpg',
    registrationPlate: 'ERTIGA',
    seatingCapacity: 6,
    luggageCapacity: '3-4 Trolley Bags',
    acAvailable: true,
    carrierAvailable: false,
    baseFare: 1200,
    perKmRate: 15,
    minBillableKm: 80,
    minFare: 2200,
    driverAllowancePerDay: 350,
    nightCharge: 250,
    isVerified: true,
    isActive: true,
    description: 'Spacious white MPV displaying the ERTIGA number plate. Ideal for family pilgrimages to Kashi Vishwanath, Sarnath, and outstation trips to Prayagraj or Ayodhya.',
    amenities: ['Dual Row Air Conditioning', 'Flexible Foldable Rear Seats', 'Cup Holders & Device Chargers', 'Clean Fabric Upholstery', 'Professional Chauffeur'],
    applicableTrips: ['one_way', 'round_trip', 'local_sightseeing', 'airport_transfer'],
    verifiedNote: 'Verified vehicle image: White MPV with ERTIGA on front number plate.'
  },
  {
    id: 'toyota-innova',
    name: 'Toyota Innova',
    category: 'MPV',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/2024_Toyota_Innova_2.8_V_in_White_Pearl_Crystal_Shine%2C_front_left.jpg',
    fallbackImage: '/assets/vehicles/internet/toyota-innova.jpg',
    registrationPlate: 'PY01CZ5038',
    seatingCapacity: 7,
    luggageCapacity: '5-6 Large Bags (With Roof Carrier Rack)',
    acAvailable: true,
    carrierAvailable: true,
    baseFare: 1600,
    perKmRate: 18,
    minBillableKm: 80,
    minFare: 2800,
    driverAllowancePerDay: 400,
    nightCharge: 300,
    isVerified: true,
    isActive: true,
    description: 'Verified white Toyota MPV fitted with a sturdy roof-mounted luggage carrier rack and commercial yellow plate PY01CZ5038. Highest passenger comfort on long distance highway road journeys to Ayodhya & Prayagraj.',
    amenities: ['Roof Luggage Carrier Rack', 'Front & Rear Powerful Dual AC', 'Plush Captain/Bench Seating', 'Smooth Suspension', 'First Aid Kit'],
    applicableTrips: ['one_way', 'round_trip', 'local_sightseeing', 'airport_transfer'],
    verifiedNote: 'Verified vehicle image: White Toyota MPV with roof carrier. Model designated as Toyota Innova pending specific variant confirmation.'
  },
  {
    id: 'force-traveller',
    name: 'Force Tempo Traveller',
    category: 'Tempo Traveller',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Force_Traveller_Luxury.jpg',
    fallbackImage: '/assets/vehicles/internet/force-traveller.jpg',
    registrationPlate: 'TRAVELLER',
    seatingCapacity: 13,
    luggageCapacity: '12+ Bags + Roof Rack',
    acAvailable: true,
    carrierAvailable: true,
    baseFare: 2500,
    perKmRate: 24,
    minBillableKm: 150,
    minFare: 4800,
    driverAllowancePerDay: 500,
    nightCharge: 400,
    isVerified: true,
    isActive: true,
    description: 'Provisional group transport vehicle for extended family pilgrimages, Buddhist circuit tours, and bulk luggage transfers. High roof standing room with individual AC blowers.',
    amenities: ['Pushback Reclining Seats', 'High Roof Standing Room', 'Full AC with Individual Vents', 'Ample Luggage Boot & Carrier', 'PA System'],
    applicableTrips: ['one_way', 'round_trip', 'local_sightseeing'],
    verifiedNote: 'Group coach fleet entry with full passenger amenities.'
  }
];

const initialBusinessInfo: BusinessInfo = {
  name: 'Ujjawal Tour & Travels',
  tagline: 'Travel More, Worry Less.',
  location: 'Hariom Nagar, Samneghat, Lanka, Varanasi, Uttar Pradesh, India',
  landmarks: 'Near Banaras Hindu University (BHU) South Campus & Samneghat Ganga Bridge',
  primaryPhone: '7651944600',
  secondaryPhone: '8934045614',
  email: 'ujjawal.travels.varanasi@gmail.com',
  workingHours: '24 Hours / 7 Days Service Available',
  bookingPolicy: 'Advance reservation recommended for Kashi Darshan and Outstation Pilgrimages. Toll charges, state road taxes, and parking fees payable as per actuals unless quoted inclusive.'
};

const initialPricingSettings: PricingSettings = {
  id: 'global-settings',
  enableExtraAdjustment200: true,
  extraAdjustmentLabel: 'Special Heritage Zone Maintenance & Sanitization Allowance',
  extraAdjustmentAmount: 200,
  nightChargeApplicableHours: { start: 22, end: 6 },
  standardNightCharge: 250,
  driverAllowancePerDay: 300,
  minimumLocalHours: 8,
  minimumLocalDistanceKm: 80,
  minimumOutstationKmPerDay: 250,
  roundTripReturnFactor: 2.0,
  tollsIncludedByDefault: false,
  updatedAt: new Date().toISOString()
};

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('utt_lang') as Language) || 'en';
  });

  const handleToggleLang = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('utt_lang', next);
      return next;
    });
  };

  const [vehicles, setVehicles] = useState<Vehicle[]>(defaultInitialVehicles);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings>(initialPricingSettings);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(initialBusinessInfo);
  const [tourPackages, setTourPackages] = useState<TourPackage[]>(defaultInitialTourPackages);

  // Screen Mode & Auto-Adjustment Engine
  const { isMobile, isTablet, isDesktop } = useScreenMode();
  const [screenViewMode, setScreenViewMode] = useState<'auto' | 'mobile' | 'desktop'>('auto');

  const handleToggleScreenViewMode = () => {
    setScreenViewMode(prev => (prev === 'mobile' ? 'auto' : 'mobile'));
  };

  const isMobileFramed = screenViewMode === 'mobile' && !isMobile;

  // Selected vehicle sync
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('maruti-suzuki-dzire');

  // Modals & Drawers
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeEstimate, setActiveEstimate] = useState<FareEstimate | null>(null);
  const [specsModalVehicle, setSpecsModalVehicle] = useState<Vehicle | null>(null);
  const [brochureModalVehicle, setBrochureModalVehicle] = useState<Vehicle | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const cached = localStorage.getItem('utt_user_profile');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isUserLoginOpen, setIsUserLoginOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  // 3-Bars Info Hub & Whole Website Settings State
  const [isThreeBarsDrawerOpen, setIsThreeBarsDrawerOpen] = useState(false);
  const [threeBarsInitialTab, setThreeBarsInitialTab] = useState<'info' | 'settings'>('info');

  const [autoGpsEnabled, setAutoGpsEnabled] = useState<boolean>(() => {
    const cached = localStorage.getItem('utt_auto_gps');
    return cached !== null ? cached === 'true' : true;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const cached = localStorage.getItem('utt_sound_effects');
    return cached !== null ? cached === 'true' : true;
  });

  const [defaultLandmark, setDefaultLandmark] = useState<string>(() => {
    return localStorage.getItem('utt_default_landmark') || 'Lanka, Varanasi (BHU Gate)';
  });

  // Verify existing user session from token
  useEffect(() => {
    const token = localStorage.getItem('utt_user_token');
    if (token) {
      fetch('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data?.user) {
            setCurrentUser(data.user);
            localStorage.setItem('utt_user_profile', JSON.stringify(data.user));
          } else {
            localStorage.removeItem('utt_user_token');
            localStorage.removeItem('utt_user_profile');
            setCurrentUser(null);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLoginSuccess = (user: UserProfile, token: string) => {
    setCurrentUser(user);
    setIsUserLoginOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('utt_user_token');
    localStorage.removeItem('utt_user_profile');
    setCurrentUser(null);
    setIsUserProfileOpen(false);
  };

  const handleOpenThreeBars = (tab: 'info' | 'settings' = 'info') => {
    setThreeBarsInitialTab(tab);
    setIsThreeBarsDrawerOpen(true);
  };

  const handleToggleAutoGps = (enabled: boolean) => {
    setAutoGpsEnabled(enabled);
    localStorage.setItem('utt_auto_gps', String(enabled));
  };

  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('utt_sound_effects', String(enabled));
  };

  const handleChangeDefaultLandmark = (lm: string) => {
    setDefaultLandmark(lm);
    localStorage.setItem('utt_default_landmark', lm);
  };

  // River Ganga Sun Cycle: 'dawn' on load -> 'rising' -> 'day'; and 'sunset' when booking completes!
  const [sunPhase, setSunPhase] = useState<SunPhase>('dawn');

  // Trigger natural sunrise progression when user opens the app
  useEffect(() => {
    const riseTimer = setTimeout(() => {
      setSunPhase('rising');
    }, 1800);

    const dayTimer = setTimeout(() => {
      setSunPhase('day');
    }, 6000);

    return () => {
      clearTimeout(riseTimer);
      clearTimeout(dayTimer);
    };
  }, []);

  const handleCycleSunPhase = () => {
    setSunPhase(prev => {
      if (prev === 'dawn') return 'rising';
      if (prev === 'rising') return 'day';
      if (prev === 'day') return 'sunset';
      return 'dawn';
    });
  };

  // Load server data
  const loadData = async () => {
    try {
      const [resFleet, resPricing, resBiz, resPkg] = await Promise.all([
        fetch('/api/fleet'),
        fetch('/api/pricing-settings'),
        fetch('/api/business-info'),
        fetch('/api/packages'),
      ]);

      if (resFleet.ok) {
        const fleetData = await resFleet.json();
        if (fleetData.length > 0) setVehicles(fleetData);
      }
      if (resPricing.ok) {
        const pricingData = await resPricing.json();
        setPricingSettings(pricingData);
      }
      if (resBiz.ok) {
        const bizData = await resBiz.json();
        setBusinessInfo(bizData);
      }
      if (resPkg.ok) {
        const pkgData = await resPkg.json();
        setTourPackages(pkgData);
      }
    } catch (err) {
      console.warn('Backend loading error, continuing with client state:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // When a vehicle is selected in the carousel
  const handleSelectVehicleFromCarousel = (vehicle: Vehicle) => {
    setSelectedVehicleId(vehicle.id);
    handleNavigate('calculator');
  };

  // When customer clicks "Proceed to Booking" from Fare Calculator
  const handleProceedToBooking = (estimate: FareEstimate) => {
    setActiveEstimate(estimate);
    setSelectedVehicleId(estimate.vehicleId);
    setIsBookingOpen(true);
  };

  // When customer requests custom quote
  const handleRequestCustomQuote = (req: Partial<FareEstimateRequest>) => {
    const matchedVehicle = vehicles.find(v => v.id === req.vehicleId);
    setActiveEstimate({
      id: `QUO-${Date.now().toString().slice(-5)}`,
      vehicleId: req.vehicleId || selectedVehicleId,
      vehicleName: matchedVehicle?.name || 'Custom Vehicle Request',
      vehicleCategory: matchedVehicle?.category || 'Custom',
      vehicleImage: matchedVehicle?.image || '/assets/vehicles/maruti-suzuki-dzire.png',
      pickup: req.pickup || 'Varanasi',
      destination: req.destination || 'Destination',
      tripType: req.tripType || 'one_way',
      departureDate: req.departureDate || new Date().toISOString().split('T')[0],
      departureTime: req.departureTime,
      passengerCount: req.passengerCount || 2,
      roadDistanceKm: 0,
      estimatedDuration: 'Custom Quote Required',
      billableDistanceKm: 0,
      baseFare: 0,
      distanceCharge: 0,
      driverAllowance: 0,
      nightCharge: 0,
      adjustment200Amount: 0,
      adjustment200Applied: false,
      totalEstimatedFare: 0,
      currency: 'INR',
      calculatedAt: new Date().toISOString(),
      validityHours: 48,
      exclusionsNote: 'Quotation will be confirmed by booking desk after checking route feasibility.'
    });
    setIsBookingOpen(true);
  };

  const handleSelectPackageForBooking = (pkg: TourPackage) => {
    setActiveEstimate({
      id: `PKG-${Date.now().toString().slice(-5)}`,
      vehicleId: selectedVehicleId,
      vehicleName: vehicles.find(v => v.id === selectedVehicleId)?.name || 'Sedan / MPV',
      vehicleCategory: 'Tour Package',
      vehicleImage: '/assets/vehicles/maruti-suzuki-ertiga.png',
      pickup: 'Varanasi Hotel / Station',
      destination: pkg.title,
      tripType: 'local_sightseeing',
      departureDate: new Date().toISOString().split('T')[0],
      departureTime: '08:00',
      passengerCount: 4,
      roadDistanceKm: 80,
      estimatedDuration: pkg.duration,
      billableDistanceKm: 80,
      baseFare: pkg.startingPrice || 2200,
      distanceCharge: 0,
      driverAllowance: 0,
      nightCharge: 0,
      adjustment200Amount: 0,
      adjustment200Applied: false,
      totalEstimatedFare: pkg.startingPrice || 2200,
      currency: 'INR',
      calculatedAt: new Date().toISOString(),
      validityHours: 48,
      exclusionsNote: 'Package includes AC cab with chauffeur. Excludes monument/boat entry passes.'
    });
    setIsBookingOpen(true);
  };

  const handlePlanTripToDestination = (destName: string) => {
    handleNavigate('calculator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-[#1C1917] selection:bg-[#D9531E] selection:text-white relative overflow-x-hidden w-full max-w-full">
      {/* Living River Ganga Flowing in the Background with Boats & Sun Cycle across Entire App */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <GangaRiverBackground
          sunPhase={sunPhase}
          onCycleSunPhase={handleCycleSunPhase}
          isFixed={true}
          className="w-full h-full"
        />
      </div>

      {/* Floating 1-Click WhatsApp Chat Box */}
      <WhatsAppChatBox primaryPhone={businessInfo.primaryPhone} lang={lang} />

      {/* Navigation Top Bar Contract */}
      <Navbar
        businessInfo={businessInfo}
        onNavigate={handleNavigate}
        isAdminOpen={isAdminOpen}
        setIsAdminOpen={setIsAdminOpen}
        lang={lang}
        onToggleLang={handleToggleLang}
        sunPhase={sunPhase}
        onCycleSunPhase={handleCycleSunPhase}
        screenViewMode={screenViewMode}
        onToggleScreenViewMode={handleToggleScreenViewMode}
        currentUser={currentUser}
        onOpenLogin={() => setIsUserLoginOpen(true)}
        onOpenProfile={() => setIsUserProfileOpen(true)}
        onOpenThreeBarsDrawer={handleOpenThreeBars}
      />

      <div className={isMobileFramed ? 'max-w-[430px] mx-auto my-4 rounded-[42px] border-[10px] border-[#292321] shadow-[0_25px_70px_rgba(0,0,0,0.4)] overflow-hidden bg-[#FFFDF7] relative ring-1 ring-white/20' : 'w-full'}>
        {/* Simulated Mobile Status Notch when in PC Mobile Frame mode */}
        {isMobileFramed && (
          <div className="bg-[#292321] text-white/90 px-6 py-2 flex items-center justify-between text-[11px] font-mono shrink-0 select-none">
            <span className="font-bold">9:41</span>
            <div className="w-20 h-4 bg-black rounded-full" />
            <span className="flex items-center gap-1.5 text-[10px]">5G 88%</span>
          </div>
        )}

        <main className="flex-1 relative z-10 pb-16 md:pb-0">
          {/* Section 1: Hero Section (Horizon Theme + Authentic Kashi Vishwanath Watermark) */}
          <div id="hero">
            <HeroSection
              businessInfo={businessInfo}
              onPlanJourney={() => handleNavigate('calculator')}
              onExploreFleet={() => handleNavigate('fleet')}
              onOpenGallery={() => handleNavigate('heritage-gallery')}
              sunPhase={sunPhase}
              onCycleSunPhase={handleCycleSunPhase}
              lang={lang}
            />
          </div>

          {/* Section 1.5: 3-BARS FOR EVERY INFO & QUICK ACCESS STRIP */}
          <ThreeInfoMetricsBars
            onOpenBarInfo={bar => {
              handleOpenThreeBars('info');
            }}
            onOpenSettings={() => {
              handleOpenThreeBars('settings');
            }}
            lang={lang}
          />

          {/* Section 2: Visual Photo Destination Quick-Nav for Easy Navigation */}
          <DestinationQuickNav
            onSelectDestination={dest => {
              handleNavigate('calculator');
            }}
            lang={lang}
          />

          {/* Section 3: Overlapping Swipeable Vehicle Brochure Carousel */}
          <VehicleBrochureCarousel
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={handleSelectVehicleFromCarousel}
            onOpenSpecs={veh => setSpecsModalVehicle(veh)}
            onOpenBrochure={veh => setBrochureModalVehicle(veh)}
            lang={lang}
          />

          {/* Section 3: High-Efficiency Trip Fare Calculator */}
          <FareCalculator
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicleId={id => setSelectedVehicleId(id)}
            onProceedToBooking={handleProceedToBooking}
            onRequestCustomQuote={handleRequestCustomQuote}
            pricingSettings={pricingSettings}
            primaryPhone={businessInfo.primaryPhone}
            lang={lang}
            onDirectBookingConfirmed={() => {
              // When user confirms booking via WhatsApp, trigger the Sunset phase!
              setSunPhase('sunset');
            }}
          />

          {/* Section 4: Authentic Tour Packages */}
          <TourPackagesSection
            packages={tourPackages}
            onSelectPackageForBooking={handleSelectPackageForBooking}
            lang={lang}
          />

          {/* Section 5: Authentic Varanasi & Pilgrimage Photo Gallery */}
          <VaranasiHeritageGallery
            onPlanTripToDestination={handlePlanTripToDestination}
            lang={lang}
          />

          {/* Section 6: Why Travel With Us & About */}
          <AboutAndBenefits
            businessInfo={businessInfo}
            onScrollToCalculator={() => handleNavigate('calculator')}
            lang={lang}
          />

          {/* Section 7: Contact Section */}
          <ContactSection businessInfo={businessInfo} lang={lang} />
        </main>

        {/* Footer */}
        <Footer
          businessInfo={businessInfo}
          onNavigate={handleNavigate}
          onOpenAdmin={() => setIsAdminOpen(true)}
          lang={lang}
        />
      </div>

      {/* Mobile Bottom Thumb Navigation (Auto-activates on Mobile screens) */}
      <MobileBottomNav
        onNavigate={handleNavigate}
        primaryPhone={businessInfo.primaryPhone}
        lang={lang}
        onOpenThreeBarsDrawer={() => handleOpenThreeBars('info')}
      />

      {/* Celebratory Sunset Aarti Banner when Sun Sets upon Booking Completion */}
      {sunPhase === 'sunset' && (
        <aside
          aria-label="Sunset Aarti Notification"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] bg-gradient-to-r from-[#2B090E]/95 via-[#7C2D12]/95 to-[#2B090E]/95 text-white p-3.5 rounded-2xl shadow-2xl border border-[#F59E0B]/50 backdrop-blur-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌇</span>
            <div>
              <p className="text-xs font-bold text-[#FEF08A] leading-tight">
                {lang === 'hi' ? 'शुभ यात्रा! संध्या आरती एवं सूर्यास्त दर्शन' : 'Shubh Yatra! Sacred Evening Aarti Commences'}
              </p>
              <p className="text-[11px] text-amber-100/85 leading-tight">
                {lang === 'hi'
                  ? 'आपकी बुकिंग दर्ज होने पर माँ गंगा के क्षितिज पर संध्या सूर्यास्त व पावन दीपदान।'
                  : 'As your booking is logged, the sun sets gracefully over Mother Ganga with floating diyas.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCycleSunPhase}
            className="shrink-0 px-2.5 py-1 text-[11px] font-bold bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors cursor-pointer"
            title="Cycle Sun Time: Dawn → Sunrise → Day → Sunset"
          >
            {lang === 'hi' ? 'समय बदलें ↺' : 'Cycle Time ↺'}
          </button>
        </aside>
      )}

      {/* Booking Enquiry Modal */}
      <BookingEnquiryModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        estimate={activeEstimate}
        selectedVehicle={vehicles.find(v => v.id === selectedVehicleId)}
        onBookingSubmitted={enq => {
          console.log('Enquiry confirmed:', enq);
          // When someone completes the booking, the sun gracefully sets over Mother Ganga!
          setSunPhase('sunset');
        }}
        lang={lang}
      />

      {/* Full Vehicle Brochure Modal for EVERY Car in the Fleet */}
      <VehicleBrochureModal
        vehicle={brochureModalVehicle}
        onClose={() => setBrochureModalVehicle(null)}
        onSelectForFare={veh => {
          setSelectedVehicleId(veh.id);
          handleNavigate('calculator');
        }}
        primaryPhone={businessInfo.primaryPhone}
        lang={lang}
      />

      {/* Technical Specifications Modal (Quick Specs fallback) */}
      <VehicleSpecsModal
        vehicle={specsModalVehicle}
        onClose={() => setSpecsModalVehicle(null)}
        onSelectForFare={veh => {
          setSelectedVehicleId(veh.id);
          handleNavigate('calculator');
        }}
        lang={lang}
      />

      {/* Admin Management Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        vehicles={vehicles}
        pricingSettings={pricingSettings}
        businessInfo={businessInfo}
        onRefreshData={loadData}
        lang={lang}
      />

      {/* 3-Bars Info Hub & Whole Website Settings Drawer */}
      <ThreeBarsInfoDrawer
        isOpen={isThreeBarsDrawerOpen}
        onClose={() => setIsThreeBarsDrawerOpen(false)}
        businessInfo={businessInfo}
        vehicles={vehicles}
        pricingSettings={pricingSettings}
        lang={lang}
        onToggleLang={handleToggleLang}
        sunPhase={sunPhase}
        onSelectSunPhase={ph => setSunPhase(ph)}
        autoGpsEnabled={autoGpsEnabled}
        onToggleAutoGps={handleToggleAutoGps}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        screenViewMode={screenViewMode}
        onToggleScreenViewMode={handleToggleScreenViewMode}
        onNavigateSection={handleNavigate}
        onOpenSpecsModal={veh => setSpecsModalVehicle(veh)}
        defaultLandmark={defaultLandmark}
        onChangeDefaultLandmark={handleChangeDefaultLandmark}
        initialTab={threeBarsInitialTab}
      />

      {/* Passenger User Login / Registration Modal */}
      <UserLoginModal
        isOpen={isUserLoginOpen}
        onClose={() => setIsUserLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />

      {/* Passenger User Profile & Trips Hub Modal */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        user={currentUser}
        onLogout={handleLogout}
        onUpdateUser={updated => setCurrentUser(updated)}
        onSelectAddressForTrip={address => {
          handleNavigate('calculator');
        }}
        primaryPhone={businessInfo.primaryPhone}
        lang={lang}
      />
    </div>
  );
}
