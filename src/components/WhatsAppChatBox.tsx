import React, { useState } from 'react';
import { MessageCircle, X, Send, CheckCircle2, Shield, PhoneCall } from 'lucide-react';
import type { Language } from '../i18n/translations.js';

interface WhatsAppChatBoxProps {
  primaryPhone?: string;
  lang?: Language;
}

export const WhatsAppChatBox: React.FC<WhatsAppChatBoxProps> = ({
  primaryPhone = '7651944600',
  lang = 'en',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Clean phone number for WhatsApp wa.me link
  const cleanPhone = `91${primaryPhone.replace(/\D/g, '')}`;

  const quickPrompts = [
    {
      labelEn: '🛕 Kashi Darshan & Aarti Cab',
      labelHi: '🛕 काशी दर्शन एवं आरती कैब',
      textEn: 'Namaste! I would like to book a cab for Kashi Vishwanath Dham and Evening Ganga Aarti.',
      textHi: 'नमस्ते! मुझे श्री काशी विश्वनाथ धाम एवं शाम की गंगा आरती हेतु कैब बुक करनी है।',
    },
    {
      labelEn: '✈️ Airport Babatpur Transfer',
      labelHi: '✈️ बाबतपुर एयरपोर्ट पिकअप/ड्रॉप',
      textEn: 'Namaste! I need a pickup/drop for Varanasi Babatpur Airport (VNS) to Lanka / Ghats.',
      textHi: 'नमस्ते! मुझे वाराणसी बाबतपुर एयरपोर्ट (VNS) से लंका/घाट हेतु कैब चाहिए।',
    },
    {
      labelEn: '🚩 Ayodhya / Sangam Outstation',
      labelHi: '🚩 अयोध्या / प्रयागराज संगम यात्रा',
      textEn: 'Namaste! Please share cab package rates for Ayodhya Ram Mandir / Prayagraj Triveni Sangam.',
      textHi: 'नमस्ते! कृपया अयोध्या राम मंदिर / प्रयागराज त्रिवेणी संगम यात्रा हेतु कैब पैकेज बताएं।',
    },
    {
      labelEn: '🚗 Dzire / Ertiga / Innova Rate',
      labelHi: '🚗 डिजायर / अर्टिगा / इनोवा दरें',
      textEn: 'Namaste! What is the availability and per-km tariff for Maruti Dzire / Ertiga / Toyota Innova?',
      textHi: 'नमस्ते! मारुति डिजायर / अर्टिगा / टोयोटा इनोवा की उपलब्धता एवं दरें क्या हैं?',
    },
  ];

  const handleSendToWhatsApp = (customText?: string) => {
    const textToSend = customText || message || (lang === 'hi'
      ? 'नमस्ते! मुझे उज्ज्वल टूर एंड ट्रैवेल्स से कैब बुकिंग हेतु जानकारी चाहिए।'
      : 'Hello! I would like to enquire about cab booking with Ujjawal Tour & Travels Varanasi.');

    const encoded = encodeURIComponent(textToSend.trim());
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const handleQuickPromptClick = (p: typeof quickPrompts[0]) => {
    const promptText = lang === 'hi' ? p.textHi : p.textEn;
    handleSendToWhatsApp(promptText);
  };

  return (
    <>
      {/* Floating Trigger Button on Bottom-Right (raised on mobile to avoid covering mobile bottom nav) */}
      <div className="fixed bottom-16 sm:bottom-5 right-3 sm:right-5 z-40 flex items-center">
        {/* Animated Water Ripple Pulse Around the Button */}
        <span
          className="absolute -inset-2 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"
          aria-hidden="true"
        />
        <span
          className="absolute -inset-3.5 rounded-full bg-[#F59E0B] opacity-25 animate-pulse pointer-events-none"
          aria-hidden="true"
        />

        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/80 select-none group"
          title="Chat on WhatsApp with Ujjawal Tour & Travels"
          aria-label="Open WhatsApp Chat Box"
        >
          {/* Official WhatsApp icon */}
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white shrink-0 group-hover:rotate-12 transition-transform duration-300" />
          
          <span className="hidden sm:inline-block text-xs sm:text-sm font-semibold tracking-wide pr-1">
            {lang === 'hi' ? 'व्हाट्सएप चैट' : 'Chat on WhatsApp'}
          </span>

          {/* Online green indicator badge */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FEF08A] border-2 border-[#128C7E] rounded-full" />
        </button>
      </div>

      {/* Interactive WhatsApp Chat Popup Dialog */}
      {isOpen && (
        <div className="fixed bottom-16 sm:bottom-20 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[380px] max-w-[420px] max-h-[85dvh] bg-white rounded-2xl shadow-2xl border border-[#D9531E]/20 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Profile Avatar with Kashi Emblem */}
              <div className="relative w-11 h-11 rounded-full bg-[#128C7E] border-2 border-[#F59E0B] flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-xl">🛕</span>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border border-white rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm tracking-wide leading-tight">
                    Ujjawal Tour &amp; Travels
                  </h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]" />
                </div>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span>🟢 Online</span>
                  <span>·</span>
                  <span>Lanka, Varanasi</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader: Trust Bar */}
          <div className="bg-[#FFF9EE] border-b border-[#F8ECD5] px-3.5 py-1.5 text-[11px] text-[#7C2D12] flex items-center justify-between">
            <span className="flex items-center gap-1 font-semibold">
              <Shield className="w-3.5 h-3.5 text-[#D9531E]" />
              {lang === 'hi' ? '24/7 तुरंत जवाब' : 'Typically replies in 2 mins'}
            </span>
            <a
              href={`tel:${primaryPhone}`}
              className="text-[#D9531E] font-bold hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              {primaryPhone}
            </a>
          </div>

          {/* Chat Conversation Body */}
          <div className="p-4 bg-[#E5DDD5]/40 space-y-3 max-h-[340px] overflow-y-auto text-xs">
            {/* Incoming Greeting Bubble */}
            <div className="bg-white rounded-xl rounded-tl-xs p-3.5 shadow-xs border border-stone-200/60 max-w-[90%] text-[#1C1917] space-y-1.5">
              <div className="font-bold text-[#075E54] text-[11px]">
                Ujjawal Tour &amp; Travels Varanasi
              </div>
              <p className="leading-relaxed text-[12.5px]">
                {lang === 'hi'
                  ? 'नमस्ते! 🙏 उज्ज्वल टूर एंड ट्रैवेल्स, लंका (वाराणसी) में आपका स्वागत है। काशी दर्शन, गंगा आरती, एयरपोर्ट एवं आउटस्टेशन यात्रा हेतु आप नीचे से विकल्प चुन सकते हैं या सीधा संदेश भेज सकते हैं।'
                  : 'Namaste! 🙏 Welcome to Ujjawal Tour & Travels, Lanka, Varanasi. How can we help you plan your Varanasi temple darshan, Ganga Aarti, or outstation trip today?'}
              </p>
              <span className="block text-[9px] text-stone-600 text-right">
                {lang === 'hi' ? 'अभी' : 'Just now'} ✓✓
              </span>
            </div>

            {/* Quick 1-Click Action Chips */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold text-[#7C2D12] uppercase tracking-wider">
                {lang === 'hi' ? '⚡ त्वरित 1-क्लिक विकल्प:' : '⚡ Quick 1-Click Inquiry:'}
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPromptClick(p)}
                    className="w-full text-left px-3 py-2 bg-white hover:bg-[#F0FDF4] active:bg-[#DCFCE7] text-[#1C1917] hover:text-[#075E54] border border-[#CBD5E1] hover:border-[#25D366] rounded-xl text-xs font-semibold transition-all shadow-2xs flex items-center justify-between group cursor-pointer"
                  >
                    <span>{lang === 'hi' ? p.labelHi : p.labelEn}</span>
                    <span className="text-[10px] text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      {lang === 'hi' ? 'भेजें →' : 'Send →'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-white border-t border-stone-200 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendToWhatsApp();
                  }
                }}
                placeholder={
                  lang === 'hi'
                    ? 'अपनी यात्रा या कैब के बारे में लिखें...'
                    : 'Type your cab or tour query...'
                }
                className="flex-1 bg-stone-100 border border-stone-300 rounded-full px-3.5 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#25D366] focus:bg-white transition-all"
              />

              <button
                onClick={() => handleSendToWhatsApp()}
                className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20BD5A] active:scale-95 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform cursor-pointer"
                title="Send on WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Direct 1-Click WhatsApp Button */}
            <button
              onClick={() => handleSendToWhatsApp()}
              className="w-full py-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BD5A] hover:to-[#075E54] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>{lang === 'hi' ? 'व्हाट्सएप पर 1-क्लिक में बातचीत शुरू करें' : 'Start 1-Click WhatsApp Chat'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
