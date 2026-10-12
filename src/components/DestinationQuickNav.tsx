import React from 'react';
import { MapPin, ArrowRight, Clock, Sparkles, Navigation } from 'lucide-react';
import { GangaSunButton } from './GangaSunButton.js';
import type { Language } from '../i18n/translations.js';

interface DestinationQuickNavProps {
  onSelectDestination: (dest: { pickup: string; destination: string; tripType: string }) => void;
  lang?: Language;
}

interface NavDestination {
  id: string;
  titleEn: string;
  titleHi: string;
  tagEn: string;
  tagHi: string;
  distance: string;
  duration: string;
  startingPrice: number;
  image: string;
  pickup: string;
  destination: string;
  tripType: 'one_way' | 'round_trip' | 'local_sightseeing' | 'airport_transfer';
}

const NAV_DESTINATIONS: NavDestination[] = [
  {
    id: 'kashi-vishwanath',
    titleEn: 'Kashi Vishwanath Corridor & Ganga Aarti',
    titleHi: 'श्री काशी विश्वनाथ धाम एवं महा गंगा आरती',
    tagEn: 'Varanasi City Tour',
    tagHi: 'काशी नगर दर्शन',
    distance: '80 km included',
    duration: 'Full Day (8 Hours)',
    startingPrice: 2200,
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/76/DASHASHWAMEDH_GHAT%2C_VARANASI.jpg',
    pickup: 'Lanka / Samneghat, Varanasi',
    destination: 'Varanasi Local Sightseeing (Kashi Dham & Sarnath)',
    tripType: 'local_sightseeing',
  },
  {
    id: 'ayodhya-mandir',
    titleEn: 'Ayodhya Shri Ram Janmabhoomi Mandir',
    titleHi: 'अयोध्या श्री राम जन्मभूमि भव्य दर्शन',
    tagEn: 'Outstation Pilgrimage',
    tagHi: 'धार्मिक यात्रा',
    distance: '218 km each way',
    duration: '4 hr 30 min highway',
    startingPrice: 5900,
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Ayodhya_Ram_Mandir_Inauguration_Day_Picture.jpg',
    pickup: 'Lanka, Varanasi',
    destination: 'Ayodhya Shri Ram Mandir',
    tripType: 'round_trip',
  },
  {
    id: 'prayagraj-sangam',
    titleEn: 'Prayagraj Triveni Sangam Confluence',
    titleHi: 'प्रयागराज त्रिवेणी संगम पावन स्नान',
    tagEn: 'Sacred Confluence Snan',
    tagHi: 'पवित्र संगम यात्रा',
    distance: '125 km each way',
    duration: '2 hr 45 min highway',
    startingPrice: 3800,
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Triveni_sangam_prayagraj.jpg',
    pickup: 'Lanka, Varanasi',
    destination: 'Prayagraj Triveni Sangam',
    tripType: 'round_trip',
  },
  {
    id: 'sarnath-stupa',
    titleEn: 'Sarnath Dhamek Stupa & Deer Park',
    titleHi: 'सारनाथ धमेख स्तूप एवं बौद्ध परिपथ',
    tagEn: 'Buddhist Heritage',
    tagHi: 'बौद्ध तीर्थ',
    distance: '14 km from city',
    duration: 'Half Day (5 Hours)',
    startingPrice: 1600,
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Dhamek_Stupa%2C_Sarnath.jpg',
    pickup: 'Lanka / Samneghat, Varanasi',
    destination: 'Sarnath Buddhist Heritage',
    tripType: 'local_sightseeing',
  },
  {
    id: 'airport-vns',
    titleEn: 'Varanasi Babatpur Airport (VNS)',
    titleHi: 'बाबतपुर एयरपोर्ट वीआईपी ट्रांसफर',
    tagEn: 'Airport Express Transfer',
    tagHi: 'एयरपोर्ट कैब',
    distance: '32 km express',
    duration: '1 hr 10 min transit',
    startingPrice: 850,
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Maruti_Suzuki_Dzire_VXi_VVT_%28front%29.JPG',
    pickup: 'Varanasi Babatpur Airport (VNS)',
    destination: 'Lanka / Samneghat, Varanasi',
    tripType: 'airport_transfer',
  },
  {
    id: 'highway-innova',
    titleEn: 'Toyota Innova (Roof Luggage Carrier Spec)',
    titleHi: 'टोयोटा इनोवा (रूफ कैरियर सहित)',
    tagEn: 'Family Highway Fleet',
    tagHi: 'फैमिली टूरिंग',
    distance: '7 Seater + Carrier',
    duration: 'Outstation Express',
    startingPrice: 2800,
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/2024_Toyota_Innova_2.8_V_in_White_Pearl_Crystal_Shine%2C_front_left.jpg',
    pickup: 'Lanka, Varanasi',
    destination: 'Ayodhya Shri Ram Mandir',
    tripType: 'round_trip',
  },
];

export const DestinationQuickNav: React.FC<DestinationQuickNavProps> = ({
  onSelectDestination,
  lang = 'en',
}) => {
  return (
    <section className="relative py-12 bg-gradient-to-b from-[#FFF9F0]/95 to-[#F3E8D5]/90 backdrop-blur-md border-b border-[#C69A52]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#821B25] uppercase tracking-wider bg-[#F3E8D5] px-2.5 py-1 rounded-md mb-1 border border-[#C69A52]/40">
              <Navigation className="w-3.5 h-3.5 text-[#B5222A]" />
              <span>{lang === 'hi' ? 'त्वरित फोटो नेविगेशन' : 'Visual Route Navigation'}</span>
            </div>
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-[#821B25]">
              {lang === 'hi' ? 'लोकप्रिय गंतव्य चुनें एवं तुरंत किराया जानें' : 'Tap Any Photo to Navigate & Calculate Fare'}
            </h2>
          </div>
          <p className="text-xs text-[#292321]/75 max-w-sm">
            {lang === 'hi'
              ? 'किसी भी तस्वीर पर क्लिक करें—कैलकुलेटर स्वतः उस मार्ग और दूरी को सेट कर देगा।'
              : 'Click any destination photo to instantly populate the route into the fare calculator.'}
          </p>
        </div>

        {/* 6 Responsive Photo Navigation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {NAV_DESTINATIONS.map(item => (
            <div
              key={item.id}
              onClick={() =>
                onSelectDestination({
                  pickup: item.pickup,
                  destination: item.destination,
                  tripType: item.tripType,
                })
              }
              className="group bg-white rounded-2xl border border-[#C69A52]/40 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-28 sm:h-32 bg-stone-900 overflow-hidden">
                  <img
                    src={item.image}
                    alt={lang === 'hi' ? item.titleHi : item.titleEn}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    onError={e => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = '/assets/varanasi/varanasi-ganga-aarti.png';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-2 left-2 bg-[#FFF9F0]/95 text-[#821B25] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                    {lang === 'hi' ? item.tagHi : item.tagEn}
                  </div>

                  <div className="absolute bottom-1.5 left-2 right-2 text-white text-[10px] flex items-center justify-between font-semibold">
                    <span className="text-[#F3E8D5]">{item.distance}</span>
                    <span className="text-stone-300 text-[9px]">From ₹{item.startingPrice}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-2.5 space-y-1">
                  <h3 className="font-heritage text-xs font-bold text-[#821B25] group-hover:text-[#B5222A] transition-colors line-clamp-2 leading-snug">
                    {lang === 'hi' ? item.titleHi : item.titleEn}
                  </h3>
                  <p className="text-[10px] text-stone-500 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-[#B5222A]" />
                    <span>{item.duration}</span>
                  </p>
                </div>
              </div>

              {/* Action bar */}
              <div className="p-2 pt-1 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold text-[#821B25] group-hover:text-[#B5222A]">
                <span>{lang === 'hi' ? 'किराया निकालें' : 'Select Route'}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
