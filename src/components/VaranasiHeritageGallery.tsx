import React, { useState } from 'react';
import { Camera, MapPin, ArrowRight, Eye, Sparkles, X, Compass, Car } from 'lucide-react';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';
import { GangaSunButton } from './GangaSunButton.js';
import type { Language } from '../i18n/translations.js';

interface GalleryItem {
  id: string;
  titleEn: string;
  titleHi: string;
  category: 'Spiritual Heritage' | 'Sacred Confluence' | 'Fleet Reference' | 'Ganga River Life';
  location: string;
  image: string;
  descriptionEn: string;
  descriptionHi: string;
  tag: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'kashi-golden-shikhara',
    titleEn: 'Shri Kashi Vishwanath Golden Shikhara & Ghat',
    titleHi: 'श्री काशी विश्वनाथ स्वर्ण शिखर एवं पावन घाट',
    category: 'Spiritual Heritage',
    location: 'Kashi Vishwanath Dham, Varanasi',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Kashi_Vishwanath_Temple_View_of_Ghat-2.jpg',
    descriptionEn: 'Authentic golden spire of Kashi Vishwanath Jyotirlinga and newly restored river Ganga corridor ghat gateway.',
    descriptionHi: 'माँ गंगा के तट से दिखाई देता श्री काशी विश्वनाथ ज्योतिर्लिंग का जगमगाता स्वर्ण शिखर एवं भव्य कॉरिडोर।',
    tag: 'Authentic Spiritual Heritage',
  },
  {
    id: 'ganga-horizon-sunset',
    titleEn: 'Varanasi Horizon & Sacred Ganga Ghats',
    titleHi: 'गंगा नदी पर सूर्योदय का स्वर्णिम क्षितिज',
    category: 'Ganga River Life',
    location: 'Sacred River Ganga, Varanasi',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Folk_Culture_of_Varanasi-_Ghats%2C_Streets%2C_and_Temples-042.jpg',
    descriptionEn: 'The golden horizon sun over the holy river Ganga, casting radiant reflections across traditional wooden boats moored along ancient steps.',
    descriptionHi: 'माँ गंगा के क्षितिज पर उदय होता स्वर्णिम सूर्य, शांत जल में तैरती पारंपरिक नावें और जल पर बिखरी सुनहरी आभा।',
    tag: 'Living River Life',
  },
  {
    id: 'ganga-aarti-flames',
    titleEn: 'Maha Ganga Aarti at Dashashwamedh Ghat',
    titleHi: 'दशाश्वमेध घाट की भव्य महा गंगा आरती',
    category: 'Spiritual Heritage',
    location: 'Dashashwamedh Ghat, Varanasi',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/76/DASHASHWAMEDH_GHAT%2C_VARANASI.jpg',
    descriptionEn: 'Sacred evening ritual of priests wielding towering multi-tiered brass oil deepams against the night sky, surrounded by thousands of devout pilgrims.',
    descriptionHi: 'हजारों श्रद्धालुओं के समक्ष पुजारियों द्वारा विशाल बहुमंजिला पीतल दीपों से की जाने वाली पावन संध्या आरती।',
    tag: 'Daily Evening Darshan',
  },
  {
    id: 'historic-ghats-skyline',
    titleEn: 'Ancient Varanasi River Ghats & Palaces',
    titleHi: 'काशी के ऐतिहासिक घाट एवं मणिकर्णिका',
    category: 'Ganga River Life',
    location: 'Manikarnika & Assi Stretch, Varanasi',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Manikarnika_ghat_varanasi.jpg',
    descriptionEn: 'Centuries-old sandstone ghats, temple spires, and stone bathing steps rising grandly from the sacred waters of the Ganges.',
    descriptionHi: 'गंगा के पावन तट पर सदियों से खड़े लाल बलुआ पत्थर के राजसी महल, मंदिर शिखर और पवित्र स्नान की सीढ़ियां।',
    tag: 'Heritage Skyline',
  },
  {
    id: 'prayagraj-triveni-sangam',
    titleEn: 'Prayagraj Triveni Sangam Confluence',
    titleHi: 'प्रयागराज त्रिवेणी संगम का पावन मिलन',
    category: 'Sacred Confluence',
    location: 'Triveni Sangam, Prayagraj',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Triveni_sangam_prayagraj.jpg',
    descriptionEn: 'Distinct holy confluence where the deep greenish Yamuna waters merge into the silt-rich golden Ganga amidst vast pilgrim congregations.',
    descriptionHi: 'गहरे हरे यमुना जल और सुनहरे गंगा प्रवाह का अलौकिक मिलन, जहां लाखों तीर्थयात्री पवित्र डुबकी लगाते हैं।',
    tag: 'Outstation Day Tour',
  },
  {
    id: 'ayodhya-ram-mandir',
    titleEn: 'Ayodhya Shri Ram Janmabhoomi Mandir',
    titleHi: 'अयोध्या श्री राम जन्मभूमि भव्य मंदिर',
    category: 'Spiritual Heritage',
    location: 'Ram Janmabhoomi, Ayodhya',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Ayodhya_Ram_Mandir_Inauguration_Day_Picture.jpg',
    descriptionEn: 'The majestic pink Bansi Paharpur sandstone Ram Mandir in Ayodhya Dham with elevated sanctum and carved shikhara.',
    descriptionHi: 'अयोध्या धाम में नवनिर्मित अलौकिक श्री राम जन्मभूमि भव्य मंदिर एवं पावन परिक्रमा मार्ग।',
    tag: 'Top Highway Pilgrimage',
  },
  {
    id: 'sarnath-dhamek-stupa',
    titleEn: 'Sarnath Dhamek Stupa & Deer Park',
    titleHi: 'सारनाथ धमेख स्तूप एवं हिरण उद्यान',
    category: 'Spiritual Heritage',
    location: 'Sarnath, Varanasi',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Dhamek_Stupa%2C_Sarnath.jpg',
    descriptionEn: 'The monumental 5th-century Gupta-era cylindrical stone stupa marking Lord Buddha’s first sermon, surrounded by tranquil deer park lawns.',
    descriptionHi: 'भगवान बुद्ध के प्रथम उपदेश स्थल पर स्थित गुप्तकालीन धमेख स्तूप एवं शांतिपूर्ण हरियाली भरा उद्यान।',
    tag: 'Buddhist Circuit',
  },
  {
    id: 'innova-crysta-tourer',
    titleEn: 'Toyota Innova Crysta with Roof Luggage Carrier',
    titleHi: 'टोयोटा इनोवा क्रिस्टा (रूफ कैरियर सहित)',
    category: 'Fleet Reference',
    location: 'Ujjawal Tour & Travels Lanka Fleet',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/2024_Toyota_Innova_2.8_V_in_White_Pearl_Crystal_Shine%2C_front_left.jpg',
    descriptionEn: 'Verified crisp white Toyota Innova fitted with an aerodynamic roof luggage carrier rack and commercial yellow plate for outstation family highway journeys.',
    descriptionHi: 'छत पर लगे मजबूत सामान कैरियर और एयर कंडीशनिंग से लैस प्रमाणित श्वेत इनोवा, लंबी यात्राओं हेतु आदर्श।',
    tag: 'Highway Touring Spec',
  },
];

interface VaranasiHeritageGalleryProps {
  onPlanTripToDestination: (destName: string) => void;
  lang?: Language;
}

export const VaranasiHeritageGallery: React.FC<VaranasiHeritageGalleryProps> = ({
  onPlanTripToDestination,
  lang = 'en',
}) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Spiritual Heritage', 'Ganga River Life', 'Sacred Confluence', 'Fleet Reference'];

  const filteredItems =
    activeCategory === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="heritage-gallery" className="relative py-16 sm:py-24 bg-[#FFFDF7]/90 backdrop-blur-md overflow-hidden border-t border-[#D4A373]/30">
      {/* Background Watermark */}
      <div className="absolute left-0 bottom-0 pointer-events-none opacity-6 z-0">
        <KashiVishwanathWatermark opacity={1} tint="horizon" size={540} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D9531E] uppercase tracking-widest bg-[#F8ECD5] px-3 py-1 rounded-full border border-[#D4A373]/50">
            <Camera className="w-3.5 h-3.5 text-[#D9531E]" />
            <span>{lang === 'hi' ? 'प्रामाणिक संदर्भ छवियां एवं काशी धरोहर' : 'Authentic References & Varanasi Heritage'}</span>
          </div>

          <h2 className="font-heritage text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7C2D12] tracking-tight">
            {lang === 'hi' ? 'काशी, संगम एवं अयोध्या की जीवंत झलकियां' : 'Authentic Photographic Glimpses of Varanasi'}
          </h2>

          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            {lang === 'hi'
              ? 'हमारे बेड़े और यात्रा पैकेजों को प्रेरित करने वाली प्रामाणिक संदर्भ छवियां — श्री काशी विश्वनाथ के स्वर्ण शिखर से लेकर माँ गंगा के स्वर्णिम क्षितिज तक।'
              : 'The real photographs that inspire our journeys and fleet — from the golden spire of Shri Kashi Vishwanath to the sunrise horizon over the sacred Ganges.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#D9531E] to-[#EA580C] text-white shadow-sm'
                  : 'bg-white text-stone-700 hover:text-[#7C2D12] border border-[#D4A373]/40 hover:bg-[#FFF9EE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-white rounded-2xl border border-[#D4A373]/40 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
            >
              <div>
                {/* Image Container with Horizon Overlay */}
                <div className="relative h-48 bg-[#7C2D12] overflow-hidden">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  {/* Tag badge */}
                  <div className="absolute top-3 left-3 bg-[#FFFDF7]/95 backdrop-blur-xs text-[#7C2D12] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {item.tag}
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-semibold text-[11px] text-amber-200">
                      <MapPin className="w-3 h-3 text-[#F59E0B]" />
                      <span className="truncate">{item.location}</span>
                    </span>
                    <span className="p-1 rounded-full bg-white/20 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-heritage text-base font-bold text-[#7C2D12] group-hover:text-[#D9531E] transition-colors line-clamp-1">
                    {lang === 'hi' ? item.titleHi : item.titleEn}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {lang === 'hi' ? item.descriptionHi : item.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <div className="px-4 pb-4 pt-1 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#D9531E] group-hover:text-[#FF6A00]">
                <span>{lang === 'hi' ? 'विवरण देखें एवं यात्रा प्लान करें' : 'View Details & Plan Trip'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Photo Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-[#D9531E]/40 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
            <div className="relative h-72 sm:h-80 bg-stone-900 overflow-hidden shrink-0">
              <img
                src={selectedItem.image}
                alt={selectedItem.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs font-bold text-[#FEF08A] uppercase tracking-wider block mb-1">
                  {selectedItem.tag} · {selectedItem.location}
                </span>
                <h3 className="font-heritage text-2xl font-bold">
                  {lang === 'hi' ? selectedItem.titleHi : selectedItem.titleEn}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <p className="text-sm text-stone-700 leading-relaxed font-medium">
                {lang === 'hi' ? selectedItem.descriptionHi : selectedItem.descriptionEn}
              </p>

              <div className="p-4 bg-[#FFF9EE] rounded-2xl border border-[#D4A373] text-xs text-[#7C2D12] space-y-1">
                <div className="font-bold">
                  {lang === 'hi' ? 'उज्ज्वल टूर एंड ट्रैवेल्स कैब सुविधा:' : 'Ujjawal Tour & Travels Cab Access:'}
                </div>
                <p>
                  {lang === 'hi'
                    ? 'हमारे ड्राइवर आपको सीधे निकटतम ड्रॉप पॉइंट तक ले जाते हैं और समयबद्ध वापसी सुनिश्चित करते हैं।'
                    : 'Our verified fleet and experienced chauffeurs provide comfortable pick-up and drop directly to entry gates with no parking hassle.'}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  {lang === 'hi' ? 'बंद करें' : 'Close'}
                </button>

                <GangaSunButton
                  size="md"
                  onClick={() => {
                    const dest = selectedItem.titleEn.split(' ')[0] || 'Varanasi';
                    onPlanTripToDestination(dest);
                    setSelectedItem(null);
                  }}
                  icon={<Compass className="w-4 h-4" />}
                >
                  {lang === 'hi' ? 'इस गंतव्य हेतु कैब किराया निकालें' : 'Calculate Cab Fare for this Destination'}
                </GangaSunButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
