import fs from 'fs';
import path from 'path';
import type { Vehicle, PricingSettings, BookingEnquiry, FareEstimate, BusinessInfo, TourPackage, UserProfile } from '../src/types/index.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  vehicles: Vehicle[];
  pricingSettings: PricingSettings;
  enquiries: BookingEnquiry[];
  fareEstimates: FareEstimate[];
  businessInfo: BusinessInfo;
  tourPackages: TourPackage[];
  users: UserProfile[];
}

const defaultUsers: UserProfile[] = [
  {
    id: 'usr_prakhar_demo',
    name: 'Prakhar Pathak',
    phone: '7651944600',
    email: 'prakhar4272pathak@gmail.com',
    role: 'user',
    memberTier: 'Gold VIP Yatri',
    savedAddresses: [
      { id: 'addr_1', label: 'Home / Lanka', address: 'Opposite BHU Gate, Lanka, Varanasi' },
      { id: 'addr_2', label: 'Airport', address: 'Lal Bahadur Shastri Airport, Babatpur, Varanasi' },
      { id: 'addr_3', label: 'Darshan', address: 'Shri Kashi Vishwanath Dham Gate 4, Varanasi' }
    ],
    createdAt: '2026-10-10T10:00:00.000Z'
  },
  {
    id: 'usr_pooja_demo',
    name: 'Pooja Pandey',
    phone: '9811223344',
    email: 'pooja.pandey@example.com',
    role: 'user',
    memberTier: 'Silver Pilgrim',
    savedAddresses: [
      { id: 'addr_4', label: 'Hotel', address: 'Assi Ghat, Shivala, Varanasi' }
    ],
    createdAt: '2026-10-11T12:00:00.000Z'
  }
];

const defaultVehicles: Vehicle[] = [
  {
    id: 'maruti-suzuki-dzire',
    name: 'Maruti Suzuki Dzire',
    category: 'Sedan',
    image: '/assets/vehicles/maruti-suzuki-dzire.png',
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
    id: 'maruti-suzuki-ertiga',
    name: 'Maruti Suzuki Ertiga',
    category: 'MPV',
    image: '/assets/vehicles/maruti-suzuki-ertiga.png',
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
    image: '/assets/vehicles/toyota-innova-reference.png',
    registrationPlate: 'INNOVA',
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
    description: 'Verified white Toyota MPV fitted with a sturdy roof-mounted luggage carrier rack and genuine Toyota badge. Highest passenger comfort on long distance road journeys.',
    amenities: ['Roof Luggage Carrier Rack', 'Front & Rear Powerful Dual AC', 'Plush Captain/Bench Seating', 'Smooth Suspension', 'First Aid Kit'],
    applicableTrips: ['one_way', 'round_trip', 'local_sightseeing', 'airport_transfer'],
    verifiedNote: 'Verified vehicle image: White Toyota MPV with roof carrier. Model designated as Toyota Innova pending specific variant confirmation.'
  },
  {
    id: 'tata-zest',
    name: 'Tata Zest',
    category: 'Sedan',
    image: '/assets/vehicles/tata-zest.png',
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
    id: 'force-traveller',
    name: 'Force Tempo Traveller',
    category: 'Tempo Traveller',
    image: '/assets/vehicles/force-traveller.png',
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
    isVerified: false,
    isActive: true,
    description: 'Provisional group transport vehicle for extended family pilgrimages, Buddhist circuit tours, and bulk luggage transfers. Confirm availability with office.',
    amenities: ['Pushback Reclining Seats', 'High Roof Standing Room', 'Full AC with Individual Vents', 'Ample Luggage Boot & Carrier', 'PA System'],
    applicableTrips: ['one_way', 'round_trip', 'local_sightseeing'],
    verifiedNote: 'Provisional fleet entry — specifications and seat layout subject to business confirmation.'
  }
];

const defaultPricingSettings: PricingSettings = {
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

const defaultBusinessInfo: BusinessInfo = {
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

const defaultTourPackages: TourPackage[] = [
  {
    id: 'kashi-darshan-heritage',
    title: 'Kashi Vishwanath & Sacred Ghats Darshan',
    tagline: 'Varanasi City & Evening Ganga Aarti Tour',
    duration: 'Full Day (8 Hours / 80 Km)',
    destinations: ['Kashi Vishwanath Corridor', 'Annapurna Mandir', 'Kaal Bhairav', 'Dashashwamedh Evening Aarti', 'Sankat Mochan', 'Durga Mandir', 'BHU Vishwanath'],
    startingPrice: 2200,
    image: '/assets/varanasi/kashi-vishwanath-corridor.png',
    description: 'Complete spiritual immersion in ancient Kashi with hassle-free pickup and drop. Watch the world-renowned Ganga Aarti from Dashashwamedh Ghat.',
    itinerary: [
      'Morning pickup from hotel or Varanasi Junction',
      'VIP Darshan facilitation at Shri Kashi Vishwanath Dham',
      'Kaal Bhairav Mandir, Sankat Mochan & Durga Kund',
      'New Vishwanath Temple inside green Banaras Hindu University campus',
      'Evening seating at Dashashwamedh Ghat for the grand Ganga Aarti ceremony',
      'Return drop to your hotel or station'
    ],
    inclusions: ['Dedicated AC Chauffeur Driven Vehicle', 'Parking fees at major temple parking lots', 'Driver allowance', 'Complimentary bottled mineral water'],
    exclusions: ['Boat rental charges on river Ganga', 'Temple special VIP entry tickets (if opted by customer)', 'Food & personal expenditures']
  },
  {
    id: 'sarnath-buddhist-circuit',
    title: 'Sarnath Buddhist Pilgrimage & Museum Tour',
    tagline: 'Where Lord Buddha Gave His First Sermon',
    duration: 'Half Day (5 Hours / 40 Km)',
    destinations: ['Dhamek Stupa', 'Mulagandha Kuti Vihar', 'Archaeological Museum', 'Chaukhandi Stupa', 'Tibetan Temple', 'Thai Temple & Giant Buddha'],
    startingPrice: 1600,
    image: '/assets/varanasi/sarnath-dhamek-stupa.png',
    description: 'Serene excursion to historic Sarnath (Isipatana), located 10 km north-east of Varanasi. Explore centuries of Buddhist heritage and the Ashoka Pillar capital.',
    itinerary: [
      'Pickup from Varanasi hotel',
      'Visit Dhamek Stupa and Deer Park (Mrigadava)',
      'Mulagandha Kuti Vihar with Japanese fresco murals',
      'Sarnath Archaeological Museum (housing the Lion Capital of Ashoka)',
      'Giant 80-foot Buddha statue at Thai Temple',
      'Return to Varanasi'
    ],
    inclusions: ['AC Cab with fuel', 'Toll and parking', 'Chauffeur services'],
    exclusions: ['Museum and monument entry passes (as per ASI rates)']
  },
  {
    id: 'prayagraj-sangam-darshan',
    title: 'Prayagraj Triveni Sangam Sacred Day Trip',
    tagline: 'Holy Confluence of Ganga, Yamuna & Saraswati',
    duration: 'Full Day Outstation (260 Km Round Trip)',
    destinations: ['Triveni Sangam', 'Alopi Devi Shaktipeeth', 'Bade Hanuman Ji Mandir', 'Anand Bhavan', 'Chandra Shekhar Azad Park'],
    startingPrice: 3800,
    image: '/assets/varanasi/prayagraj-triveni-sangam.png',
    description: 'Comfortable highway day trip along NH-19 from Varanasi to Prayagraj. Perform sacred holy snan at the confluence and receive blessings at the reclining Hanuman temple.',
    itinerary: [
      '06:00 AM departure from Varanasi via 6-lane NH-19 expressway',
      '08:45 AM arrival at Prayagraj Sangam Ghats for holy bath & boat ride',
      'Visit Bade Hanuman Ji (sleeping posture shrine) and Akshayavat',
      'Visit Alopi Devi (sacred Shaktipeeth)',
      'Brief stop at historic Anand Bhavan',
      'Evening return journey back to Varanasi'
    ],
    inclusions: ['Round trip highway travel with AC cab', 'Toll tax receipts included in package rate', 'Driver allowance'],
    exclusions: ['Boating fares to Triveni Sangam midpoint point', 'Personal pooja / purohit dakshina']
  },
  {
    id: 'ayodhya-ram-mandir-yatra',
    title: 'Ayodhya Shri Ram Janmabhoomi Darshan',
    tagline: 'Divine Journey to the Holy City of Shri Ram',
    duration: 'Full Day or 2-Day Option (440 Km Round Trip)',
    destinations: ['Shri Ram Janmabhoomi Mandir', 'Hanuman Garhi', 'Kanak Bhavan', 'Saryu River Ghats', 'Surya Kund'],
    startingPrice: 5900,
    image: '/assets/varanasi/ayodhya-ram-mandir.png',
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
    inclusions: ['Commercial vehicle permit', 'Experienced highway chauffeur', 'Tolls and driver day allowance'],
    exclusions: ['Temple prasad offerings', 'Hotel stay if 2-day option selected']
  }
];

function ensureDataFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      vehicles: defaultVehicles,
      pricingSettings: defaultPricingSettings,
      enquiries: [],
      fareEstimates: [],
      businessInfo: defaultBusinessInfo,
      tourPackages: defaultTourPackages,
      users: defaultUsers
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Ensure all 4 verified reference vehicles exist in DB
    const vehicleMap = new Map<string, Vehicle>(
      (parsed.vehicles || []).map((v: Vehicle) => [v.id, v] as [string, Vehicle])
    );
    defaultVehicles.forEach(dv => {
      if (!vehicleMap.has(dv.id)) {
        vehicleMap.set(dv.id, dv);
      } else {
        // Ensure image path is updated to verified path if empty
        const cur = vehicleMap.get(dv.id)!;
        if (!cur.image || cur.image.includes('placeholder')) {
          cur.image = dv.image;
        }
      }
    });

    const updated: DatabaseSchema = {
      vehicles: Array.from(vehicleMap.values()),
      pricingSettings: parsed.pricingSettings || defaultPricingSettings,
      enquiries: parsed.enquiries || [],
      fareEstimates: parsed.fareEstimates || [],
      businessInfo: parsed.businessInfo || defaultBusinessInfo,
      tourPackages: parsed.tourPackages || defaultTourPackages,
      users: (parsed.users && parsed.users.length > 0) ? parsed.users : defaultUsers
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (err) {
    console.error('Error reading db.json, recreating with defaults:', err);
    const initialData: DatabaseSchema = {
      vehicles: defaultVehicles,
      pricingSettings: defaultPricingSettings,
      enquiries: [],
      fareEstimates: [],
      businessInfo: defaultBusinessInfo,
      tourPackages: defaultTourPackages,
      users: defaultUsers
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

export function getDb(): DatabaseSchema {
  return ensureDataFile();
}

export function saveDb(data: DatabaseSchema): void {
  ensureDataFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
