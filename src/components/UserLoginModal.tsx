import React, { useState } from 'react';
import { X, User, Phone, Mail, Lock, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import type { UserProfile } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import { GangaSunButton } from './GangaSunButton.js';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, token: string) => void;
  lang: Language;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier) {
      setError(lang === 'hi' ? 'कृपया मोबाइल नंबर अथवा ईमेल दर्ज करें' : 'Please enter mobile number or email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('utt_user_token', data.token);
      localStorage.setItem('utt_user_profile', JSON.stringify(data.user));
      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError(lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError(lang === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          email: email.trim() || undefined,
          password: password || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('utt_user_token', data.token);
      localStorage.setItem('utt_user_profile', JSON.stringify(data.user));
      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoPhone: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: demoPhone, password: 'kashi2026' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo login failed');

      localStorage.setItem('utt_user_token', data.token);
      localStorage.setItem('utt_user_profile', JSON.stringify(data.user));
      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FFFDF7] rounded-3xl shadow-2xl border border-[#C69A52]/40 overflow-hidden">
        {/* Sacred Varanasi Watermark Decoration */}
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 pointer-events-none opacity-10">
          <KashiVishwanathWatermark opacity={1} tint="gold" size={320} />
        </div>

        {/* Modal Header */}
        <div className="relative z-10 bg-gradient-to-r from-[#821B25] via-[#9B212B] to-[#B5222A] text-white p-6 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#C69A52]/30 border border-[#C69A52]/60 flex items-center justify-center text-amber-200">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-heritage text-xl font-bold tracking-tight text-white">
                  {lang === 'hi' ? 'यात्री लॉगिन एवं खाता' : 'Yatri Passenger Login'}
                </h3>
                <p className="text-xs text-amber-200/90 font-medium">
                  {lang === 'hi'
                    ? 'उज्जवल टूर्स एवं ट्रैवल्स · लंका, वाराणसी'
                    : 'Ujjawal Tour & Travels · Lanka, Varanasi'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-black/20 rounded-xl">
            <button
              onClick={() => { setTab('login'); setError(null); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-[#821B25] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {lang === 'hi' ? 'लॉग इन (Sign In)' : 'Sign In'}
            </button>
            <button
              onClick={() => { setTab('register'); setError(null); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-[#821B25] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {lang === 'hi' ? 'नया खाता (Register)' : 'New Account'}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#292321] uppercase tracking-wider mb-1">
                  {lang === 'hi' ? 'मोबाइल नंबर अथवा ईमेल' : 'Mobile Number or Email'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#821B25] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={lang === 'hi' ? 'उदा. 7651944600 या email@example.com' : 'e.g. 7651944600 or email@example.com'}
                    className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-[#C69A52]/40 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#821B25] focus:border-[#821B25]"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#292321] uppercase tracking-wider">
                    {lang === 'hi' ? 'पासवर्ड (वैकल्पिक)' : 'Password (Optional for Demo)'}
                  </label>
                  <span className="text-[11px] text-[#821B25] hover:underline cursor-pointer">
                    {lang === 'hi' ? 'सहायता चाहिए?' : 'Need Help?'}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#821B25] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-[#C69A52]/40 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#821B25] focus:border-[#821B25]"
                  />
                </div>
              </div>

              <GangaSunButton
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? (lang === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Verifying...')
                  : (lang === 'hi' ? 'लॉग इन करें' : 'Sign In to Account')}
              </GangaSunButton>

              {/* Quick 1-Click Demo Login options for instant testing */}
              <div className="pt-2 border-t border-[#C69A52]/20 space-y-2">
                <p className="text-[11px] text-[#292321]/70 font-semibold text-center uppercase tracking-wider">
                  {lang === 'hi' ? '⚡ त्वरित 1-क्लिक टेस्ट लॉगिन' : '⚡ Quick 1-Click Test Login'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('7651944600')}
                    className="p-2 text-left rounded-xl border border-[#C69A52]/40 bg-[#FFF9F0] hover:bg-[#F3E8D5] text-[#821B25] transition-all cursor-pointer text-xs"
                  >
                    <div className="font-bold">Prakhar Pathak</div>
                    <div className="text-[10px] text-[#292321]/70">7651944600 · VIP Yatri</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('9811223344')}
                    className="p-2 text-left rounded-xl border border-[#C69A52]/40 bg-[#FFF9F0] hover:bg-[#F3E8D5] text-[#821B25] transition-all cursor-pointer text-xs"
                  >
                    <div className="font-bold">Pooja Pandey</div>
                    <div className="text-[10px] text-[#292321]/70">9811223344 · Silver Pilgrim</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#292321] uppercase tracking-wider mb-1">
                  {lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#821B25] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={lang === 'hi' ? 'उदा. राकेश कुमार शर्मा' : 'e.g. Rajesh Kumar'}
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-[#C69A52]/40 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#821B25]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292321] uppercase tracking-wider mb-1">
                  {lang === 'hi' ? 'मोबाइल नंबर (10 अंक) *' : 'Mobile Number (10 Digits) *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#821B25] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-[#C69A52]/40 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#821B25]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292321] uppercase tracking-wider mb-1">
                  {lang === 'hi' ? 'ईमेल पता (वैकल्पिक)' : 'Email Address (Optional)'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#821B25] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="yatri@example.com"
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-[#C69A52]/40 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#821B25]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292321] uppercase tracking-wider mb-1">
                  {lang === 'hi' ? 'पासवर्ड बनाएं' : 'Create Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#821B25] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-[#C69A52]/40 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#821B25]"
                  />
                </div>
              </div>

              <GangaSunButton
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                disabled={loading}
              >
                {loading
                  ? (lang === 'hi' ? 'खाता बनाया जा रहा है...' : 'Creating Account...')
                  : (lang === 'hi' ? 'नया खाता बनाएं एवं आगे बढ़ें' : 'Create Account & Continue')}
              </GangaSunButton>
            </form>
          )}

          {/* Trust badges */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-[#292321]/70 border-t border-[#C69A52]/20">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'hi' ? 'सुरक्षित एवं गोपनीय' : '100% Secure'}</span>
            </span>
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-[#821B25]" />
              <span>{lang === 'hi' ? 'लंका वाराणसी सहायता 24/7' : 'Lanka HQ 24/7 Desk'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
