import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Clock,
  Car,
  CheckCircle,
  AlertCircle,
  LogOut,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Plus,
  Bookmark,
  Award,
} from 'lucide-react';
import type { UserProfile, BookingEnquiry } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import { GangaSunButton } from './GangaSunButton.js';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onSelectAddressForTrip?: (address: string) => void;
  primaryPhone: string;
  lang: Language;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onUpdateUser,
  onSelectAddressForTrip,
  primaryPhone,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'trips' | 'saved' | 'details'>('trips');
  const [bookings, setBookings] = useState<BookingEnquiry[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadUserBookings();
    }
  }, [isOpen, user]);

  const loadUserBookings = async () => {
    const token = localStorage.getItem('utt_user_token');
    if (!token) return;
    setLoadingBookings(true);
    try {
      const res = await fetch('/api/user/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.warn('Could not load user bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  if (!isOpen || !user) return null;

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newAddress) return;
    setSavingAddress(true);
    try {
      const token = localStorage.getItem('utt_user_token');
      const updatedAddresses = [
        ...(user.savedAddresses || []),
        { id: `addr-${Date.now()}`, label: newLabel.trim(), address: newAddress.trim() },
      ];

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ savedAddresses: updatedAddresses }),
      });

      if (res.ok) {
        const data = await res.json();
        onUpdateUser(data.user);
        setNewLabel('');
        setNewAddress('');
      }
    } catch (err) {
      console.error('Error saving address:', err);
    } finally {
      setSavingAddress(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Booking confirmed':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          label: lang === 'hi' ? 'यात्रा कन्फर्म' : 'Confirmed',
        };
      case 'Completed':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          label: lang === 'hi' ? 'यात्रा पूर्ण' : 'Completed',
        };
      case 'Quotation sent':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          label: lang === 'hi' ? 'कोटेशन तैयार' : 'Quote Ready',
        };
      default:
        return {
          bg: 'bg-orange-100 text-orange-800 border-orange-300',
          label: lang === 'hi' ? 'समीक्षाधीन' : 'Under Review',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FFFDF7] rounded-3xl shadow-2xl border border-[#C69A52]/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Sacred Kashi Watermark */}
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 pointer-events-none opacity-8">
          <KashiVishwanathWatermark opacity={1} tint="gold" size={360} />
        </div>

        {/* Modal Header */}
        <div className="relative z-10 bg-gradient-to-r from-[#821B25] via-[#9B212B] to-[#B5222A] text-white p-5 sm:p-6 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-[#C69A52]/30 border-2 border-[#C69A52] flex items-center justify-center text-amber-100 text-xl font-bold shadow-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heritage text-lg sm:text-2xl font-bold text-white tracking-tight">
                    {user.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/40">
                    <Award className="w-3 h-3 text-amber-300" />
                    <span>{user.memberTier || 'Standard Yatri'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-amber-100/90 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-amber-200" />
                    <span>+91 {user.phone}</span>
                  </span>
                  {user.email && (
                    <span className="hidden sm:flex items-center gap-1">
                      <Mail className="w-3 h-3 text-amber-200" />
                      <span>{user.email}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onLogout}
                title={lang === 'hi' ? 'लॉग आउट करें' : 'Sign Out'}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'लॉग आउट' : 'Sign Out'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-5 grid grid-cols-3 p-1 bg-black/20 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('trips')}
              className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'trips'
                  ? 'bg-white text-[#821B25] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'मेरी यात्राएं' : 'My Bookings'}</span>
              {bookings.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#821B25] text-white">
                  {bookings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-white text-[#821B25] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सहेजे स्थान' : 'Saved Spots'}</span>
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'details'
                  ? 'bg-white text-[#821B25] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'प्रोफ़ाइल विवरण' : 'Profile Info'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="relative z-10 p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'trips' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#292321]">
                  {lang === 'hi' ? 'आपकी यात्रा पूछताछ एवं बुकिंग इतिहास' : 'Your Enquiries & Booking History'}
                </h4>
                <button
                  onClick={loadUserBookings}
                  className="flex items-center gap-1 text-xs text-[#821B25] font-semibold hover:underline cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingBookings ? 'animate-spin' : ''}`} />
                  <span>{lang === 'hi' ? 'रिफ्रेश' : 'Refresh'}</span>
                </button>
              </div>

              {loadingBookings ? (
                <div className="p-8 text-center text-xs text-[#292321]/70">
                  {lang === 'hi' ? 'बुकिंग लोड हो रही हैं...' : 'Loading trips...'}
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#C69A52]/30 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#F3E8D5] text-[#821B25] mx-auto flex items-center justify-center">
                    <Car className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-sm text-[#292321]">
                    {lang === 'hi' ? 'कोई सक्रिय बुकिंग दर्ज नहीं है' : 'No Bookings Logged Yet'}
                  </h5>
                  <p className="text-xs text-[#292321]/70 max-w-sm mx-auto">
                    {lang === 'hi'
                      ? 'फेयर कैलकुलेटर से अपनी पसंद की गाड़ी चुनें और अपनी यात्रा सहजता से बुक करें।'
                      : 'Choose your desired vehicle in the Fare Calculator and reserve your journey across Varanasi & beyond.'}
                  </p>
                  <GangaSunButton
                    size="sm"
                    variant="primary"
                    onClick={onClose}
                  >
                    {lang === 'hi' ? 'गाड़ी चुनें व किराया जांचें' : 'Check Fare & Book Now'}
                  </GangaSunButton>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map(b => {
                    const badge = getStatusBadge(b.status);
                    return (
                      <div
                        key={b.id}
                        className="p-4 rounded-2xl bg-white border border-[#C69A52]/30 hover:border-[#821B25]/50 transition-all shadow-xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#821B25] bg-[#F3E8D5] px-2 py-0.5 rounded-md">
                              {b.id}
                            </span>
                            <span className="text-xs font-bold text-[#292321]">
                              {b.vehicleName}
                            </span>
                          </div>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#292321]/80">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-stone-900">{lang === 'hi' ? 'पिकअप:' : 'Pickup:'}</span>{' '}
                              {b.pickup}
                            </div>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-stone-900">{lang === 'hi' ? 'ड्रॉप:' : 'Drop:'}</span>{' '}
                              {b.destination}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#292321]/70 pt-2 border-t border-stone-100 flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#821B25]" />
                              <span>{b.departureDate}</span>
                            </span>
                            {b.estimatedTotal && (
                              <span className="font-bold text-[#821B25]">
                                ₹{b.estimatedTotal.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          <a
                            href={`https://wa.me/91${primaryPhone}?text=${encodeURIComponent(
                              `Namaste Ujjawal Travels Lanka, regarding my booking ${b.id} (${b.vehicleName}) for ${b.pickup} to ${b.destination}. Please assist.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                          >
                            <MessageCircle className="w-3 h-3 text-emerald-600" />
                            <span>{lang === 'hi' ? 'व्हाट्सएप सहायता' : 'WhatsApp Support'}</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#292321]">
                {lang === 'hi' ? 'पसंदीदा एवं सहेजे गए स्थान' : 'Saved Locations & Quick Fill'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(user.savedAddresses || []).map(addr => (
                  <div
                    key={addr.id}
                    className="p-3 rounded-2xl bg-white border border-[#C69A52]/30 hover:border-[#821B25] transition-all flex items-start justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[#821B25] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{addr.label}</span>
                      </div>
                      <p className="text-xs text-[#292321]/80 leading-snug">
                        {addr.address}
                      </p>
                    </div>

                    {onSelectAddressForTrip && (
                      <button
                        onClick={() => {
                          onSelectAddressForTrip(addr.address);
                          onClose();
                        }}
                        className="shrink-0 px-2.5 py-1 rounded-lg bg-[#F3E8D5] hover:bg-[#C69A52]/40 text-[#821B25] text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        {lang === 'hi' ? 'किराया देखें' : 'Use'}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Address Form */}
              <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#C69A52]/40 space-y-3">
                <h5 className="text-xs font-bold text-[#821B25]">
                  {lang === 'hi' ? '+ नया स्थान सहेजें' : '+ Add New Saved Spot'}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <input
                      type="text"
                      value={newLabel}
                      onChange={e => setNewLabel(e.target.value)}
                      placeholder={lang === 'hi' ? 'नाम (उदा. होटल / घर)' : 'Label (e.g. Hotel / Office)'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#C69A52]/40 bg-white"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={newAddress}
                      onChange={e => setNewAddress(e.target.value)}
                      placeholder={lang === 'hi' ? 'सटीक पता या लैंडमार्क' : 'Full address or landmark'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#C69A52]/40 bg-white"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#821B25] hover:bg-[#B5222A] text-white transition-colors cursor-pointer"
                >
                  {savingAddress
                    ? (lang === 'hi' ? 'सहेजा जा रहा है...' : 'Saving...')
                    : (lang === 'hi' ? 'स्थान जोड़ें' : 'Save Location')}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#292321]">
                {lang === 'hi' ? 'व्यक्तिगत जानकारी एवं विशेषाधिकार' : 'Personal Details & Member Privileges'}
              </h4>

              <div className="p-4 rounded-2xl bg-white border border-[#C69A52]/30 space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-[#292321]/70">{lang === 'hi' ? 'सदस्यता स्तर:' : 'Membership Tier:'}</span>
                  <span className="font-bold text-[#821B25]">{user.memberTier || 'Standard Yatri'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-[#292321]/70">{lang === 'hi' ? 'पंजीकृत फोन:' : 'Registered Phone:'}</span>
                  <span className="font-bold text-[#292321]">+91 {user.phone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-[#292321]/70">{lang === 'hi' ? 'ईमेल:' : 'Email Address:'}</span>
                  <span className="font-semibold text-[#292321]">{user.email || 'Not added'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-[#292321]/70">{lang === 'hi' ? 'खाता निर्माण:' : 'Member Since:'}</span>
                  <span className="text-[#292321]">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#292321]/70">{lang === 'hi' ? 'विशेषाधिकार:' : 'Perks:'}</span>
                  <span className="text-emerald-700 font-semibold">
                    {lang === 'hi' ? 'प्राथमिकता पर लंका वाराणसी ड्राइवर आवंटन' : 'Priority Chauffeur Dispatch from Lanka HQ'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
