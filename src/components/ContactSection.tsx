import React, { useState } from 'react';
import { Phone, MapPin, Mail, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { GangaAartiWatermark } from './GangaAartiWatermark.js';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';
import { GangaSunButton } from './GangaSunButton.js';
import type { BusinessInfo } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import { translations } from '../i18n/translations.js';

interface ContactSectionProps {
  businessInfo: BusinessInfo;
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ businessInfo, lang }) => {
  const t = translations[lang];
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setLoading(true);
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          specialRequirements: `Contact inquiry message: ${message}`,
          pickup: 'Varanasi',
          destination: 'General Inquiry',
          tripType: 'one_way',
          passengerCount: 1,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(
      lang === 'hi'
        ? 'नमस्ते! मुझे उज्ज्वल टूर एंड ट्रैवेल्स से यात्रा परामर्श एवं कैब बुकिंग सहायता चाहिए।'
        : 'Hello! I need travel advice and cab booking assistance from Ujjawal Tour & Travels Varanasi.'
    );
    const link = document.createElement('a');
    link.href = `https://wa.me/91${businessInfo.primaryPhone.replace(/\D/g, '')}?text=${text}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  return (
    <section id="contact" className="relative py-16 sm:py-24 bg-[#FFF9EE]/92 backdrop-blur-md overflow-hidden border-t border-[#D4A373]/30">
      {/* Background Subtle Stamp Watermark 1: Sepia Ganga Aarti on right */}
      <div className="absolute right-4 bottom-4 pointer-events-none z-0 opacity-7">
        <GangaAartiWatermark opacity={1} tint="horizon" size={480} />
      </div>

      {/* Background Subtle Stamp Watermark 2: Kashi Vishwanath on left */}
      <div className="absolute left-6 top-8 pointer-events-none z-0 opacity-8">
        <KashiVishwanathWatermark opacity={1} tint="horizon" size={500} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D9531E] uppercase tracking-widest bg-[#F8ECD5] px-3 py-1 rounded-full border border-[#D4A373]/50">
            <span>{t.contactTag}</span>
          </div>
          <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-[#7C2D12] tracking-tight">
            {t.contactTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            {t.contactDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#D4A373]/50 p-6 sm:p-8 shadow-md space-y-6">
            <h3 className="font-heritage text-xl font-bold text-[#7C2D12]">
              {t.officeDispatchInfo}
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF9EE] border border-[#D9531E]/40 flex items-center justify-center text-[#D9531E] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1C1917] block mb-0.5">
                    {lang === 'hi' ? 'कार्यालय का पता' : 'Office Address'}
                  </span>
                  <p className="leading-relaxed">{businessInfo.location}</p>
                  <p className="text-xs text-[#D9531E] font-medium mt-1">
                    {businessInfo.landmarks}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF9EE] border border-[#D9531E]/40 flex items-center justify-center text-[#D9531E] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1C1917] block mb-0.5">
                    {lang === 'hi' ? 'हेल्पलाइन नंबर' : 'Helpline Numbers'}
                  </span>
                  <a
                    href={`tel:${businessInfo.primaryPhone}`}
                    className="font-bold text-[#D9531E] hover:underline block"
                  >
                    +91 {businessInfo.primaryPhone}
                  </a>
                  <a
                    href={`tel:${businessInfo.secondaryPhone}`}
                    className="font-bold text-[#D9531E] hover:underline block"
                  >
                    +91 {businessInfo.secondaryPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF9EE] border border-[#D9531E]/40 flex items-center justify-center text-[#D9531E] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1C1917] block mb-0.5">
                    {lang === 'hi' ? 'ईमेल संपर्क' : 'Email Dispatch'}
                  </span>
                  <a
                    href={`mailto:${businessInfo.email}`}
                    className="text-[#D9531E] hover:underline"
                  >
                    {businessInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF9EE] border border-[#D9531E]/40 flex items-center justify-center text-[#D9531E] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1C1917] block mb-0.5">
                    {lang === 'hi' ? 'कार्य समय' : 'Operating Hours'}
                  </span>
                  <p className="font-semibold text-emerald-800">{businessInfo.workingHours}</p>
                </div>
              </div>
            </div>

            {/* Quick 1-Click WhatsApp Button */}
            <div className="pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={handleWhatsAppContact}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{lang === 'hi' ? 'सीधा व्हाट्सएप पर चैट करें (1-क्लिक)' : 'Direct WhatsApp Chat (1-Click)'}</span>
              </button>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#D4A373]/50 p-6 sm:p-8 shadow-md">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F0FDF4] border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heritage text-2xl font-bold text-[#7C2D12]">
                  {t.messageSentTitle}
                </h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  {t.messageSentDesc}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="px-6 py-2.5 bg-[#FFF9EE] text-[#D9531E] border border-[#D4A373] text-xs font-bold rounded-xl hover:bg-[#F8ECD5] transition-colors cursor-pointer"
                >
                  {t.sendAnotherMessage}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heritage text-xl font-bold text-[#7C2D12]">
                  {t.sendDirectEnquiry}
                </h3>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.yourName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full bg-[#FFFDF7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#D9531E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.phoneWhatsapp} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-[#FFFDF7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#D9531E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.journeyRequirementMessage}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us your travel dates, vehicle preference, or pilgrimage itinerary..."
                    className="w-full bg-[#FFFDF7] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#D9531E]"
                  />
                </div>

                <GangaSunButton
                  type="submit"
                  size="lg"
                  variant="primary"
                  disabled={loading}
                  className="w-full"
                  icon={<Send className="w-4 h-4" />}
                >
                  {loading ? 'Sending...' : t.sendEnquiryBtn}
                </GangaSunButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
