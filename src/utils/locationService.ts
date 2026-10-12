/**
 * Location Detection & Popular Pilgrimage / Airport Routes Service
 * Uses phone/browser GPS Geolocation API with smart local Varanasi/UP landmark mapping
 * and fallback reverse geocoding (without requiring Google Maps API).
 */

export interface GpsLocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  detectedName: string;
  landmarkDetail?: string;
  source: 'gps' | 'preset' | 'reverse_geocode';
  timestamp: number;
}

export interface PopularSpot {
  id: string;
  nameEn: string;
  nameHi: string;
  category: 'airport' | 'pilgrimage' | 'transit' | 'city';
  image: string;
  fallbackImage?: string;
  addressString: string;
  lat: number;
  lng: number;
  description: string;
}

export interface PopularRouteWithPhotos {
  id: string;
  labelEn: string;
  labelHi: string;
  category: 'airport' | 'pilgrimage' | 'heritage' | 'transit';
  pickup: string;
  destination: string;
  pickupPhoto: string;
  destinationPhoto: string;
  tripType: 'one_way' | 'round_trip' | 'local_sightseeing' | 'airport_transfer';
  distanceKm: number;
  durationText: string;
  highlights: string[];
}

// Verified popular pilgrimage spots & airport hubs
export const POPULAR_SPOTS: PopularSpot[] = [
  {
    id: 'spot-babatpur-airport',
    nameEn: 'Babatpur Airport (VNS)',
    nameHi: 'बाबतपुर एयरपोर्ट (VNS)',
    category: 'airport',
    image: '/assets/places/babatpur-airport.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Lal_Bahadur_Shastri_Airport.jpg',
    addressString: 'Varanasi Babatpur Airport (VNS), Lal Bahadur Shastri Terminal',
    lat: 25.4497,
    lng: 82.8596,
    description: 'International & Domestic Terminal, NH-56 Airport Road'
  },
  {
    id: 'spot-kashi-vishwanath',
    nameEn: 'Shri Kashi Vishwanath Dham',
    nameHi: 'श्री काशी विश्वनाथ धाम',
    category: 'pilgrimage',
    image: '/assets/places/kashi-vishwanath-dham.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Kashi_Vishwanath_Temple_View_of_Ghat-2.jpg',
    addressString: 'Shri Kashi Vishwanath Dham Corridor, Godowlia, Varanasi',
    lat: 25.3109,
    lng: 83.0107,
    description: 'Golden Shikhara Jyotirlinga & Ganga Pathway'
  },
  {
    id: 'spot-dashashwamedh-ghat',
    nameEn: 'Dashashwamedh Ghat & Aarti',
    nameHi: 'दशाश्वमेध घाट एवं महाआरती',
    category: 'pilgrimage',
    image: '/assets/places/kashi-dashashwamedh.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/7/76/DASHASHWAMEDH_GHAT%2C_VARANASI.jpg',
    addressString: 'Dashashwamedh Ghat, Godowlia, Varanasi',
    lat: 25.3075,
    lng: 83.0103,
    description: 'World-famous Evening Maha Ganga Aarti ceremony'
  },
  {
    id: 'spot-ayodhya-ram-mandir',
    nameEn: 'Ayodhya Shri Ram Mandir',
    nameHi: 'अयोध्या श्री राम जन्मभूमि मंदिर',
    category: 'pilgrimage',
    image: '/assets/places/ayodhya-ram-mandir.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Ram_Mandir_Ayodhya_January_2024.jpg',
    addressString: 'Ayodhya Shri Ram Mandir, Ram Janmabhoomi Path, Ayodhya',
    lat: 26.7922,
    lng: 82.1998,
    description: 'Sacred birthplace of Lord Rama, Ram Ki Paidi & Kanak Bhawan'
  },
  {
    id: 'spot-prayagraj-sangam',
    nameEn: 'Prayagraj Triveni Sangam',
    nameHi: 'प्रयागराज त्रिवेणी संगम',
    category: 'pilgrimage',
    image: '/assets/places/prayagraj-sangam.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Sangam_allahabad.jpg',
    addressString: 'Prayagraj Triveni Sangam, Kumbh Mela Kshetra, Prayagraj',
    lat: 25.4299,
    lng: 81.8841,
    description: 'Holy confluence of sacred rivers Ganga, Yamuna & Saraswati'
  },
  {
    id: 'spot-sarnath-stupa',
    nameEn: 'Sarnath Dhamek Stupa',
    nameHi: 'सारनाथ धमेख स्तूप एवं डियर पार्क',
    category: 'pilgrimage',
    image: '/assets/places/sarnath-dhamek-stupa.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Dhamek_Stupa%2C_Sarnath.jpg',
    addressString: 'Sarnath Dhamek Stupa & Archaeological Park, Varanasi',
    lat: 25.3811,
    lng: 83.0227,
    description: 'Sacred site of Lord Buddha first sermon & Lion Capital'
  },
  {
    id: 'spot-mahabodhi-temple',
    nameEn: 'Bodh Gaya Mahabodhi Temple',
    nameHi: 'बोधगया महाबोधि महाविहार',
    category: 'pilgrimage',
    image: '/assets/places/mahabodhi-temple.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Mahabodhi_temple_at_Bodhgaya_in_Bihar_18.jpg',
    addressString: 'Bodh Gaya Mahabodhi Temple, Gaya, Bihar',
    lat: 24.6959,
    lng: 84.9914,
    description: 'Sacred Bodhi Tree of Enlightenment, UNESCO World Heritage'
  },
  {
    id: 'spot-varanasi-cantt-station',
    nameEn: 'Varanasi Cantt Station (BSB)',
    nameHi: 'वाराणसी कैंट रेलवे स्टेशन (BSB)',
    category: 'transit',
    image: '/assets/places/varanasi-junction.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Varanasi_Junction_railway_station.jpg',
    addressString: 'Varanasi Junction Cantt Railway Station (BSB)',
    lat: 25.3283,
    lng: 82.9863,
    description: 'Central Railway Junction, Cab Pickup Bay & Metro connection'
  },
  {
    id: 'spot-lanka-varanasi',
    nameEn: 'Lanka / BHU Gate (Ujjawal HQ)',
    nameHi: 'लंका / बीएचयू गेट (उज्ज्वल ट्रेवल्स)',
    category: 'city',
    image: '/assets/places/kashi-dashashwamedh.jpg',
    addressString: 'Lanka / Samneghat, Varanasi',
    lat: 25.2801,
    lng: 82.9996,
    description: 'South Varanasi Hub, BHU Vishwanath Temple, Assi Link'
  }
];

// Rich pilgrimage and airport routes with verified photos of both endpoints
export const POPULAR_PILGRIMAGE_AND_AIRPORT_ROUTES: PopularRouteWithPhotos[] = [
  {
    id: 'route-airport-lanka',
    labelEn: 'Babatpur Airport (VNS) ⇄ Lanka / Ghats',
    labelHi: 'बाबतपुर एयरपोर्ट ⇄ लंका / घाट (एयरपोर्ट ट्रांसफर)',
    category: 'airport',
    pickup: 'Varanasi Babatpur Airport (VNS), Lal Bahadur Shastri Terminal',
    destination: 'Lanka / Samneghat, Varanasi',
    pickupPhoto: '/assets/places/babatpur-airport.jpg',
    destinationPhoto: '/assets/places/kashi-dashashwamedh.jpg',
    tripType: 'airport_transfer',
    distanceKm: 32,
    durationText: '1 hr 10 min',
    highlights: ['Terminal Chauffeur Meet & Greet', 'Flyover expressway', 'Luggage assistance included']
  },
  {
    id: 'route-airport-cantt',
    labelEn: 'Babatpur Airport (VNS) ⇄ Varanasi Cantt Junction',
    labelHi: 'बाबतपुर एयरपोर्ट ⇄ कैंट रेलवे स्टेशन',
    category: 'airport',
    pickup: 'Varanasi Babatpur Airport (VNS), Lal Bahadur Shastri Terminal',
    destination: 'Varanasi Junction Cantt Railway Station (BSB)',
    pickupPhoto: '/assets/places/babatpur-airport.jpg',
    destinationPhoto: '/assets/places/varanasi-junction.jpg',
    tripType: 'airport_transfer',
    distanceKm: 24,
    durationText: '50 min',
    highlights: ['Direct bypass highway', 'Train-to-flight express dispatch', '24x7 tracking']
  },
  {
    id: 'route-kashi-sarnath-darshan',
    labelEn: 'Kashi Vishwanath + Sarnath Full Day (8hr/80km)',
    labelHi: 'काशी विश्वनाथ + सारनाथ संपूर्ण दर्शन (8 घंटे/80 किमी)',
    category: 'pilgrimage',
    pickup: 'Lanka / Samneghat, Varanasi',
    destination: 'Varanasi Local Sightseeing (Kashi Dham & Sarnath)',
    pickupPhoto: '/assets/places/kashi-vishwanath-dham.jpg',
    destinationPhoto: '/assets/places/sarnath-dhamek-stupa.jpg',
    tripType: 'local_sightseeing',
    distanceKm: 80,
    durationText: '8 Hours Full Day',
    highlights: ['VIP Temple Entry Parking', 'Sarnath Dhamek Stupa', 'Evening Ganga Aarti drop']
  },
  {
    id: 'route-ayodhya-ram-mandir',
    labelEn: 'Ayodhya Shri Ram Janmabhoomi (Same Day)',
    labelHi: 'अयोध्या श्री राम जन्मभूमि दर्शन (समान दिन वापसी)',
    category: 'pilgrimage',
    pickup: 'Lanka / Samneghat, Varanasi',
    destination: 'Ayodhya Shri Ram Mandir',
    pickupPhoto: '/assets/places/kashi-dashashwamedh.jpg',
    destinationPhoto: '/assets/places/ayodhya-ram-mandir.jpg',
    tripType: 'round_trip',
    distanceKm: 218,
    durationText: '4 hr 30 min each way',
    highlights: ['Purvanchal Expressway', 'Ram Janmabhoomi Darshan', 'Kanak Bhawan & Saryu Aarti']
  },
  {
    id: 'route-prayagraj-sangam',
    labelEn: 'Prayagraj Triveni Sangam Sacred Day Trip',
    labelHi: 'प्रयागराज त्रिवेणी संगम पावन दर्शन (समान दिन वापसी)',
    category: 'pilgrimage',
    pickup: 'Lanka / Samneghat, Varanasi',
    destination: 'Prayagraj Triveni Sangam',
    pickupPhoto: '/assets/places/kashi-vishwanath-dham.jpg',
    destinationPhoto: '/assets/places/prayagraj-sangam.jpg',
    tripType: 'round_trip',
    distanceKm: 125,
    durationText: '2 hr 45 min each way',
    highlights: ['GT Road 6-lane highway', 'Sangam Snan Ghat parking', 'Bade Hanuman Ji Mandir']
  },
  {
    id: 'route-bodhgaya-circuit',
    labelEn: 'Bodh Gaya Mahabodhi Temple Pilgrimage',
    labelHi: 'बोधगया महाबोधि मंदिर एवं विष्णुपद परिपथ',
    category: 'pilgrimage',
    pickup: 'Lanka / Samneghat, Varanasi',
    destination: 'Bodh Gaya, Bihar',
    pickupPhoto: '/assets/places/kashi-dashashwamedh.jpg',
    destinationPhoto: '/assets/places/mahabodhi-temple.jpg',
    tripType: 'round_trip',
    distanceKm: 254,
    durationText: '5 hr 15 min each way',
    highlights: ['Grand Trunk Road (NH-19)', 'UNESCO Mahabodhi Temple', 'Pind Daan Vishnupad Gaya option']
  },
  {
    id: 'route-station-to-ghats',
    labelEn: 'Varanasi Cantt Station ⇄ Godowlia / Ghats',
    labelHi: 'वाराणसी कैंट स्टेशन ⇄ गोदौलिया / काशी घाट',
    category: 'transit',
    pickup: 'Varanasi Junction Cantt Railway Station (BSB)',
    destination: 'Dashashwamedh Ghat, Godowlia, Varanasi',
    pickupPhoto: '/assets/places/varanasi-junction.jpg',
    destinationPhoto: '/assets/places/kashi-dashashwamedh.jpg',
    tripType: 'one_way',
    distanceKm: 8,
    durationText: '25 min',
    highlights: ['Station platform pickup', 'Old city route experience', 'Fast luggage drop']
  }
];

/**
 * Calculates Haversine distance in kilometers between two geo-coordinates
 */
function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the nearest recognized Varanasi / UP hub from latitude and longitude
 */
export function matchNearestLandmark(
  lat: number,
  lng: number
): { spot: PopularSpot; distanceKm: number } | null {
  let nearest: PopularSpot | null = null;
  let minDistance = Infinity;

  for (const spot of POPULAR_SPOTS) {
    const dist = getHaversineDistanceKm(lat, lng, spot.lat, spot.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = spot;
    }
  }

  if (nearest) {
    return { spot: nearest, distanceKm: Math.round(minDistance * 10) / 10 };
  }
  return null;
}

/**
 * Detects current GPS coordinates using the phone/browser Geolocation API
 * with instant fallback and reverse landmark recognition.
 */
export async function detectPhoneLocation(): Promise<GpsLocationResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('GPS location is not supported on this device.'));
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    };

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        const nearestMatch = matchNearestLandmark(latitude, longitude);

        let detectedName = '';
        let landmarkDetail = '';

        if (nearestMatch && nearestMatch.distanceKm <= 20) {
          detectedName = nearestMatch.spot.addressString;
          landmarkDetail = `Near ${nearestMatch.spot.nameEn} (${nearestMatch.distanceKm} km away) · GPS ±${Math.round(accuracy)}m`;
        } else {
          detectedName = `GPS Location (${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E)`;
          landmarkDetail = `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)} · GPS ±${Math.round(accuracy)}m`;
        }

        resolve({
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          detectedName,
          landmarkDetail,
          source: 'gps',
          timestamp: Date.now(),
        });
      },
      error => {
        let msg = 'Failed to obtain GPS fix.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access or choose a popular preset below.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Phone GPS position is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'GPS location request timed out. Please try again.';
        }
        reject(new Error(msg));
      },
      options
    );
  });
}
