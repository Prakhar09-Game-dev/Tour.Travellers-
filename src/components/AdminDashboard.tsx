import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LogOut,
  LayoutDashboard,
  Car,
  Receipt,
  Users,
  Settings,
  Edit,
  Save,
  CheckCircle,
  AlertCircle,
  Phone,
  RefreshCw,
  Plus,
  Search
} from 'lucide-react';
import type { Vehicle, PricingSettings, BookingEnquiry, BusinessInfo, EnquiryStatus } from '../types/index.js';
import type { Language } from '../i18n/translations.js';
import { translations } from '../i18n/translations.js';
import { KashiVishwanathWatermark } from './KashiVishwanathWatermark.js';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  pricingSettings: PricingSettings;
  businessInfo: BusinessInfo;
  onRefreshData: () => void;
  lang?: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  vehicles,
  pricingSettings,
  businessInfo,
  onRefreshData,
  lang = 'en',
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Helper: authenticated fetch with bearer token
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('utt_admin_token') || '';
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      setIsAuthenticated(false);
      localStorage.removeItem('utt_admin_token');
      localStorage.removeItem('utt_admin_auth');
      setAuthError('Administrative session expired. Please log in again.');
    }
    return res;
  };

  // Verify session on mount
  useEffect(() => {
    const token = localStorage.getItem('utt_admin_token');
    if (token) {
      fetch('/api/auth/verify', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('utt_admin_token');
            localStorage.removeItem('utt_admin_auth');
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    }
  }, []);

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'fleet' | 'pricing' | 'business'>('overview');

  // Enquiries State
  const [enquiries, setEnquiries] = useState<BookingEnquiry[]>([]);
  const [enquiryFilterStatus, setEnquiryFilterStatus] = useState<string>('all');
  const [enquirySearch, setEnquirySearch] = useState<string>('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<BookingEnquiry | null>(null);

  // Fleet Edit State
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Pricing Edit State
  const [currentPricing, setCurrentPricing] = useState<PricingSettings>(pricingSettings);

  // Business Info Edit State
  const [currentBusiness, setCurrentBusiness] = useState<BusinessInfo>(businessInfo);

  // Stats State
  const [stats, setStats] = useState({
    totalEnquiries: 0,
    newEnquiries: 0,
    pendingQuotes: 0,
    confirmedBookings: 0,
    completedTrips: 0,
    activeVehicles: 0,
    totalEstimates: 0,
  });

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      if (data.token) {
        localStorage.setItem('utt_admin_token', data.token);
        localStorage.setItem('utt_admin_auth', 'true');
        setIsAuthenticated(true);
        setPassword('');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Invalid administrator credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('utt_admin_token');
    localStorage.removeItem('utt_admin_auth');
  };

  const loadEnquiriesAndStats = async () => {
    try {
      const [resEnq, resStats] = await Promise.all([
        fetchWithAuth('/api/enquiries'),
        fetchWithAuth('/api/stats'),
      ]);
      if (resEnq.ok) {
        const enqData = await resEnq.json();
        setEnquiries(enqData);
      }
      if (resStats.ok) {
        const statsData = await resStats.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadEnquiriesAndStats();
      setCurrentPricing(pricingSettings);
      setCurrentBusiness(businessInfo);
    }
  }, [isAuthenticated, pricingSettings, businessInfo]);

  // Update Enquiry Status
  const handleUpdateEnquiry = async (
    id: string,
    status: EnquiryStatus,
    staffNotes?: string,
    agreedPrice?: number
  ) => {
    setSaving(true);
    try {
      const res = await fetchWithAuth(`/api/enquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, staffNotes, agreedPrice }),
      });
      if (res.ok) {
        const updated = await res.json();
        setEnquiries(prev => prev.map(e => (e.id === id ? updated : e)));
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(updated);
        }
        setSaveMessage('Enquiry updated successfully');
        loadEnquiriesAndStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Update Vehicle
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    setSaving(true);
    try {
      const res = await fetchWithAuth(`/api/fleet/${editingVehicle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingVehicle),
      });
      if (res.ok) {
        setSaveMessage(`Vehicle ${editingVehicle.name} updated.`);
        setEditingVehicle(null);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Update Pricing Settings
  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchWithAuth('/api/pricing-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPricing),
      });
      if (res.ok) {
        setSaveMessage('Pricing rules & ₹200 adjustment settings saved.');
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Update Business Info
  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchWithAuth('/api/business-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentBusiness),
      });
      if (res.ok) {
        setSaveMessage('Business contact and location details saved.');
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl border border-[#E8D5B5] shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Top Bar */}
        <div className="bg-[#821B25] text-[#FFF9F0] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="font-heritage text-lg sm:text-xl font-bold text-white">
              Ujjawal Tour &amp; Travels — Management Dashboard
            </h3>
            <span className="hidden sm:inline bg-[#C69A52] text-[#821B25] text-[10px] font-bold px-2 py-0.5 rounded">
              Varanasi Dispatch
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-[#E8D5B5] hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-[#FFF9F0]/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto my-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF9F0] border border-[#C69A52] flex items-center justify-center text-[#821B25]">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="font-heritage text-2xl font-bold text-[#821B25]">
                Administrator Login
              </h4>
              <p className="text-xs text-[#292321]/70">
                Sign in to manage booking enquiries, vehicles, and tariff rules.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-[#292321] uppercase mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg text-sm text-[#292321] focus:outline-none focus:ring-2 focus:ring-[#821B25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292321] uppercase mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg text-sm text-[#292321] focus:outline-none focus:ring-2 focus:ring-[#821B25]"
                />
              </div>

              {authError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#B5222A] hover:bg-[#821B25] rounded-lg shadow-md transition-all cursor-pointer"
              >
                Authenticate &amp; Access
              </button>

              <p className="text-[11px] text-center text-[#292321]/50">
                🔒 Authorized administrative personnel only. Sessions are cryptographically signed.
              </p>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard Body */
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-56 bg-[#FFF9F0] border-r border-[#E8D5B5] p-3 flex md:flex-col gap-1 shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#821B25] text-white shadow-xs'
                    : 'text-[#292321] hover:bg-[#F3E8D5]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Overview &amp; KPIs</span>
              </button>

              <button
                onClick={() => setActiveTab('enquiries')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'enquiries'
                    ? 'bg-[#821B25] text-white shadow-xs'
                    : 'text-[#292321] hover:bg-[#F3E8D5]'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Enquiries ({enquiries.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('fleet')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'fleet'
                    ? 'bg-[#821B25] text-white shadow-xs'
                    : 'text-[#292321] hover:bg-[#F3E8D5]'
                }`}
              >
                <Car className="w-4 h-4 shrink-0" />
                <span>Fleet Management</span>
              </button>

              <button
                onClick={() => setActiveTab('pricing')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'pricing'
                    ? 'bg-[#821B25] text-white shadow-xs'
                    : 'text-[#292321] hover:bg-[#F3E8D5]'
                }`}
              >
                <Receipt className="w-4 h-4 shrink-0" />
                <span>Tariff &amp; ₹200 Charge</span>
              </button>

              <button
                onClick={() => setActiveTab('business')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'business'
                    ? 'bg-[#821B25] text-white shadow-xs'
                    : 'text-[#292321] hover:bg-[#F3E8D5]'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Business Info</span>
              </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-white">
              {saveMessage && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg flex items-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4" />
                  <span>{saveMessage}</span>
                </div>
              )}

              {/* TAB 1: OVERVIEW & KPIS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heritage text-xl font-bold text-[#821B25]">
                        Operational Overview
                      </h4>
                      <p className="text-xs text-[#292321]/70">
                        Real-time metrics backed by stored database records.
                      </p>
                    </div>

                    <button
                      onClick={loadEnquiriesAndStats}
                      className="p-2 text-xs font-semibold text-[#821B25] bg-[#FFF9F0] hover:bg-[#F3E8D5] rounded-lg border border-[#E8D5B5] flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {/* KPI Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-[#FFF9F0] rounded-xl border border-[#E8D5B5]">
                      <span className="text-[10px] font-bold text-[#821B25] uppercase">Total Enquiries</span>
                      <span className="text-2xl font-bold text-[#292321] block mt-1">{stats.totalEnquiries}</span>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-800 uppercase">New Enquiries</span>
                      <span className="text-2xl font-bold text-amber-900 block mt-1">{stats.newEnquiries}</span>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <span className="text-[10px] font-bold text-blue-800 uppercase">Pending Quotes</span>
                      <span className="text-2xl font-bold text-blue-900 block mt-1">{stats.pendingQuotes}</span>
                    </div>

                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">Confirmed Bookings</span>
                      <span className="text-2xl font-bold text-emerald-900 block mt-1">{stats.confirmedBookings}</span>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <span className="text-[10px] font-bold text-purple-800 uppercase">Completed Trips</span>
                      <span className="text-2xl font-bold text-purple-900 block mt-1">{stats.completedTrips}</span>
                    </div>

                    <div className="p-4 bg-[#FFF9F0] rounded-xl border border-[#E8D5B5]">
                      <span className="text-[10px] font-bold text-[#821B25] uppercase">Active Fleet</span>
                      <span className="text-2xl font-bold text-[#292321] block mt-1">{stats.activeVehicles} Cabs</span>
                    </div>

                    <div className="p-4 bg-[#FFF9F0] rounded-xl border border-[#E8D5B5]">
                      <span className="text-[10px] font-bold text-[#821B25] uppercase">Fare Estimates Run</span>
                      <span className="text-2xl font-bold text-[#292321] block mt-1">{stats.totalEstimates}</span>
                    </div>
                  </div>

                  {/* Recent Enquiries Preview */}
                  <div className="bg-white rounded-xl border border-[#E8D5B5] p-5 space-y-3">
                    <h5 className="font-heritage text-base font-bold text-[#821B25]">
                      Recent Customer Enquiries
                    </h5>
                    {enquiries.length === 0 ? (
                      <p className="text-xs text-[#292321]/60">No booking enquiries logged yet.</p>
                    ) : (
                      <div className="divide-y divide-[#E8D5B5]/60 text-xs">
                        {enquiries.slice(0, 5).map(e => (
                          <div key={e.id} className="py-2.5 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-[#292321] block">{e.customerName} ({e.customerPhone})</span>
                              <span className="text-[#292321]/70">{e.pickup} → {e.destination} · {e.vehicleName}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF9F0] text-[#821B25] border border-[#E8D5B5]">
                              {e.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ENQUIRIES MANAGEMENT */}
              {activeTab === 'enquiries' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h4 className="font-heritage text-xl font-bold text-[#821B25]">
                      Customer Booking Enquiries
                    </h4>

                    {/* Filter and Search */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-48">
                        <Search className="w-3.5 h-3.5 text-[#292321]/40 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          placeholder="Search name, phone..."
                          value={enquirySearch}
                          onChange={e => setEnquirySearch(e.target.value)}
                          className="w-full pl-8 pr-2 py-1.5 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg text-xs"
                        />
                      </div>

                      <select
                        value={enquiryFilterStatus}
                        onChange={e => setEnquiryFilterStatus(e.target.value)}
                        className="py-1.5 px-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg text-xs"
                      >
                        <option value="all">All Statuses</option>
                        <option value="New enquiry">New enquiry</option>
                        <option value="Under review">Under review</option>
                        <option value="Quotation sent">Quotation sent</option>
                        <option value="Customer accepted">Customer accepted</option>
                        <option value="Booking confirmed">Booking confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Enquiries Table */}
                  <div className="border border-[#E8D5B5] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FFF9F0] border-b border-[#E8D5B5] text-[#821B25] font-bold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="p-3">Ref ID</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Route &amp; Vehicle</th>
                            <th className="p-3">Departure</th>
                            <th className="p-3">Estimate</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8D5B5]/60">
                          {enquiries
                            .filter(e => {
                              if (enquiryFilterStatus !== 'all' && e.status !== enquiryFilterStatus) return false;
                              if (enquirySearch) {
                                const q = enquirySearch.toLowerCase();
                                return (
                                  e.customerName.toLowerCase().includes(q) ||
                                  e.customerPhone.includes(q) ||
                                  e.id.toLowerCase().includes(q)
                                );
                              }
                              return true;
                            })
                            .map(enq => (
                              <tr key={enq.id} className="hover:bg-[#FFF9F0]/50">
                                <td className="p-3 font-bold text-[#821B25] whitespace-nowrap">{enq.id}</td>
                                <td className="p-3">
                                  <div className="font-bold text-[#292321]">{enq.customerName}</div>
                                  <a href={`tel:${enq.customerPhone}`} className="text-[#821B25] hover:underline flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    <span>{enq.customerPhone}</span>
                                  </a>
                                </td>
                                <td className="p-3">
                                  <div className="font-semibold text-[#292321]">{enq.vehicleName}</div>
                                  <div className="text-[11px] text-[#292321]/70">{enq.pickup} → {enq.destination}</div>
                                </td>
                                <td className="p-3 whitespace-nowrap">{enq.departureDate}</td>
                                <td className="p-3 whitespace-nowrap font-bold">
                                  {enq.estimatedTotal ? `₹${enq.estimatedTotal.toLocaleString('en-IN')}` : 'Custom Quote'}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <select
                                    value={enq.status}
                                    onChange={e => handleUpdateEnquiry(enq.id, e.target.value as EnquiryStatus, enq.staffNotes, enq.agreedPrice)}
                                    className="py-1 px-2 text-[11px] font-bold rounded border border-[#E8D5B5] bg-white text-[#821B25]"
                                  >
                                    <option value="New enquiry">New enquiry</option>
                                    <option value="Under review">Under review</option>
                                    <option value="Quotation sent">Quotation sent</option>
                                    <option value="Customer accepted">Customer accepted</option>
                                    <option value="Booking confirmed">Booking confirmed</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <button
                                    onClick={() => setSelectedEnquiry(enq)}
                                    className="text-xs font-bold text-[#821B25] hover:underline"
                                  >
                                    View Full Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Selected Enquiry Details Modal / Drawer */}
                  {selectedEnquiry && (
                    <div className="mt-4 p-5 bg-[#FFF9F0] rounded-xl border border-[#C69A52] space-y-4 text-xs">
                      <div className="flex items-center justify-between">
                        <h5 className="font-heritage text-base font-bold text-[#821B25]">
                          Enquiry #{selectedEnquiry.id} — Full Details
                        </h5>
                        <button onClick={() => setSelectedEnquiry(null)} className="text-[#821B25] font-bold text-xs">
                          Close Details
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-[#E8D5B5]">
                        <div>
                          <span className="text-[#292321]/60 block">Customer Name</span>
                          <span className="font-bold text-[#292321]">{selectedEnquiry.customerName}</span>
                        </div>
                        <div>
                          <span className="text-[#292321]/60 block">Phone</span>
                          <a href={`tel:${selectedEnquiry.customerPhone}`} className="font-bold text-[#821B25]">
                            {selectedEnquiry.customerPhone}
                          </a>
                        </div>
                        <div>
                          <span className="text-[#292321]/60 block">Vehicle</span>
                          <span className="font-bold text-[#292321]">{selectedEnquiry.vehicleName}</span>
                        </div>
                        <div>
                          <span className="text-[#292321]/60 block">Passengers</span>
                          <span className="font-bold text-[#292321]">{selectedEnquiry.passengerCount}</span>
                        </div>
                      </div>

                      {selectedEnquiry.specialRequirements && (
                        <div className="p-3 bg-white rounded-lg border border-[#E8D5B5]">
                          <span className="font-bold text-[#821B25] block mb-1">Customer Special Instructions:</span>
                          <p className="text-[#292321]/80">{selectedEnquiry.specialRequirements}</p>
                        </div>
                      )}

                      {/* Staff Notes & Agreed Price Form */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-[#292321] mb-1">
                            Agreed Final Quotation Price (₹)
                          </label>
                          <input
                            type="number"
                            value={selectedEnquiry.agreedPrice || ''}
                            onChange={e => setSelectedEnquiry({ ...selectedEnquiry, agreedPrice: Number(e.target.value) })}
                            placeholder="e.g. 2400"
                            className="w-full px-3 py-1.5 bg-white border border-[#E8D5B5] rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#292321] mb-1">
                            Internal Staff Dispatch Notes
                          </label>
                          <input
                            type="text"
                            value={selectedEnquiry.staffNotes || ''}
                            onChange={e => setSelectedEnquiry({ ...selectedEnquiry, staffNotes: e.target.value })}
                            placeholder="e.g. Driver Ramesh assigned, UP65-AB-1234"
                            className="w-full px-3 py-1.5 bg-white border border-[#E8D5B5] rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => handleUpdateEnquiry(
                            selectedEnquiry.id,
                            selectedEnquiry.status,
                            selectedEnquiry.staffNotes,
                            selectedEnquiry.agreedPrice
                          )}
                          disabled={saving}
                          className="py-1.5 px-4 bg-[#821B25] text-white font-bold rounded-lg cursor-pointer"
                        >
                          {saving ? 'Saving...' : 'Save Notes & Agreed Fare'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: FLEET MANAGEMENT */}
              {activeTab === 'fleet' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heritage text-xl font-bold text-[#821B25]">
                        Fleet Vehicle Management
                      </h4>
                      <p className="text-xs text-[#292321]/70">
                        Edit tariffs, seating capacities, and verified image paths for the fleet.
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Edit Form Modal / Box */}
                  {editingVehicle && (
                    <form onSubmit={handleSaveVehicle} className="p-5 bg-[#FFF9F0] rounded-xl border-2 border-[#821B25] space-y-4 text-xs">
                      <div className="flex items-center justify-between">
                        <h5 className="font-heritage text-base font-bold text-[#821B25]">
                          Editing {editingVehicle.name}
                        </h5>
                        <button
                          type="button"
                          onClick={() => setEditingVehicle(null)}
                          className="text-[#821B25] font-bold"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold mb-1">Vehicle Name *</label>
                          <input
                            type="text"
                            required
                            value={editingVehicle.name}
                            onChange={e => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#E8D5B5] rounded"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Category</label>
                          <select
                            value={editingVehicle.category}
                            onChange={e => setEditingVehicle({ ...editingVehicle, category: e.target.value as any })}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#E8D5B5] rounded"
                          >
                            <option value="Sedan">Sedan</option>
                            <option value="MPV">MPV</option>
                            <option value="Tempo Traveller">Tempo Traveller</option>
                            <option value="Premium">Premium</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Registration Plate Text</label>
                          <input
                            type="text"
                            value={editingVehicle.registrationPlate || ''}
                            onChange={e => setEditingVehicle({ ...editingVehicle, registrationPlate: e.target.value })}
                            placeholder="e.g. DZIRE / ERTIGA"
                            className="w-full px-2.5 py-1.5 bg-white border border-[#E8D5B5] rounded"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Image Path Asset *</label>
                          <input
                            type="text"
                            required
                            value={editingVehicle.image}
                            onChange={e => setEditingVehicle({ ...editingVehicle, image: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#E8D5B5] rounded"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Per-Kilometer Rate (₹) *</label>
                          <input
                            type="number"
                            required
                            step="0.5"
                            value={editingVehicle.perKmRate}
                            onChange={e => setEditingVehicle({ ...editingVehicle, perKmRate: Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#E8D5B5] rounded"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Base Booking Fare (₹) *</label>
                          <input
                            type="number"
                            required
                            value={editingVehicle.baseFare}
                            onChange={e => setEditingVehicle({ ...editingVehicle, baseFare: Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#E8D5B5] rounded"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Seating Capacity</label>
                          <input
                            type="number"
                            value={editingVehicle.seatingCapacity}
                            onChange={e => setEditingVehicle({ ...editingVehicle, seatingCapacity: Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#E8D5B5] rounded"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Driver Allowance (₹/day)</label>
                          <input
                            type="number"
                            value={editingVehicle.driverAllowancePerDay}
                            onChange={e => setEditingVehicle({ ...editingVehicle, driverAllowancePerDay: Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#E8D5B5] rounded"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Night Charge (₹)</label>
                          <input
                            type="number"
                            value={editingVehicle.nightCharge}
                            onChange={e => setEditingVehicle({ ...editingVehicle, nightCharge: Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#E8D5B5] rounded"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={editingVehicle.description}
                          onChange={e => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#E8D5B5] rounded"
                        />
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingVehicle.isActive}
                            onChange={e => setEditingVehicle({ ...editingVehicle, isActive: e.target.checked })}
                          />
                          <span className="font-bold">Active in Booking System</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingVehicle.isVerified}
                            onChange={e => setEditingVehicle({ ...editingVehicle, isVerified: e.target.checked })}
                          />
                          <span className="font-bold">Verified Reference Vehicle</span>
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="py-2 px-5 bg-[#821B25] text-white font-bold rounded-lg cursor-pointer"
                        >
                          {saving ? 'Saving...' : 'Save Vehicle Changes'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Vehicles List Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vehicles.map(veh => (
                      <div
                        key={veh.id}
                        className="p-4 bg-[#FFF9F0] rounded-xl border border-[#E8D5B5] flex gap-4 items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 bg-white rounded border border-[#E8D5B5] p-1 shrink-0 overflow-hidden">
                            <img
                              src={veh.image}
                              alt={veh.name}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              onError={e => {
                                const target = e.currentTarget as HTMLImageElement;
                                if (veh.fallbackImage && target.src !== veh.fallbackImage) {
                                  target.src = veh.fallbackImage;
                                } else {
                                  target.src = '/assets/vehicles/maruti-suzuki-dzire.png';
                                }
                              }}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="text-xs">
                            <span className="font-bold text-[#292321] block">{veh.name}</span>
                            <span className="text-[#821B25] font-semibold">
                              ₹{veh.perKmRate}/km · Base ₹{veh.baseFare}
                            </span>
                            <span className="text-[10px] text-[#292321]/60 block">
                              Plate: {veh.registrationPlate || 'N/A'} · Status: {veh.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setEditingVehicle(veh)}
                          className="p-2 bg-white hover:bg-[#F3E8D5] text-[#821B25] rounded-lg border border-[#E8D5B5] flex items-center gap-1 text-xs font-bold cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PRICING & CONFIGURABLE ₹200 CHARGE */}
              {activeTab === 'pricing' && (
                <form onSubmit={handleSavePricing} className="space-y-6 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heritage text-xl font-bold text-[#821B25]">
                        Pricing Rules &amp; ₹200 Adjustment Settings
                      </h4>
                      <p className="text-[#292321]/70">
                        Configure road calculation allowances and the business-configurable ₹200 adjustment.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="py-2 px-5 bg-[#821B25] text-white font-bold rounded-lg cursor-pointer"
                    >
                      {saving ? 'Saving...' : 'Save Pricing Settings'}
                    </button>
                  </div>

                  {/* Configurable ₹200 Adjustment Panel */}
                  <div className="p-5 bg-[#FFF9F0] rounded-xl border-2 border-[#C69A52] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="enable200"
                          checked={currentPricing.enableExtraAdjustment200}
                          onChange={e => setCurrentPricing({ ...currentPricing, enableExtraAdjustment200: e.target.checked })}
                          className="w-4 h-4 text-[#821B25]"
                        />
                        <label htmlFor="enable200" className="font-heritage text-sm font-bold text-[#821B25] cursor-pointer">
                          Enable ₹200 Additional Adjustment Charge
                        </label>
                      </div>

                      <span className="text-[10px] bg-[#821B25] text-white px-2 py-0.5 rounded font-bold">
                        {currentPricing.enableExtraAdjustment200 ? 'Active on all Estimates' : 'Disabled'}
                      </span>
                    </div>

                    <p className="text-[#292321]/80 leading-relaxed">
                      As mandated in the specification, this ₹200 adjustment is applied strictly once per eligible trip
                      estimate and clearly itemized on the customer breakdown.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold mb-1">Adjustment Amount (₹)</label>
                        <input
                          type="number"
                          value={currentPricing.extraAdjustmentAmount}
                          onChange={e => setCurrentPricing({ ...currentPricing, extraAdjustmentAmount: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-white border border-[#E8D5B5] rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Customer Itemized Label</label>
                        <input
                          type="text"
                          value={currentPricing.extraAdjustmentLabel}
                          onChange={e => setCurrentPricing({ ...currentPricing, extraAdjustmentLabel: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#E8D5B5] rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* General Pricing Parameters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-[#E8D5B5] rounded-xl space-y-2">
                      <label className="block font-bold">Round Trip Return Mileage Factor</label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentPricing.roundTripReturnFactor}
                        onChange={e => setCurrentPricing({ ...currentPricing, roundTripReturnFactor: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg"
                      />
                      <span className="text-[10px] text-[#292321]/60">Default 2.0 (calculates round trip return mileage)</span>
                    </div>

                    <div className="p-4 bg-white border border-[#E8D5B5] rounded-xl space-y-2">
                      <label className="block font-bold">Minimum Outstation Billable Km / Day</label>
                      <input
                        type="number"
                        value={currentPricing.minimumOutstationKmPerDay}
                        onChange={e => setCurrentPricing({ ...currentPricing, minimumOutstationKmPerDay: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg"
                      />
                      <span className="text-[10px] text-[#292321]/60">Standard highway baseline (e.g. 250 km)</span>
                    </div>

                    <div className="p-4 bg-white border border-[#E8D5B5] rounded-xl space-y-2">
                      <label className="block font-bold">Standard Night Charge (₹)</label>
                      <input
                        type="number"
                        value={currentPricing.standardNightCharge}
                        onChange={e => setCurrentPricing({ ...currentPricing, standardNightCharge: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg"
                      />
                      <span className="text-[10px] text-[#292321]/60">Applied for pickups between 22:00 and 06:00</span>
                    </div>

                    <div className="p-4 bg-white border border-[#E8D5B5] rounded-xl space-y-2">
                      <label className="block font-bold">Standard Driver Outstation Allowance (₹/day)</label>
                      <input
                        type="number"
                        value={currentPricing.driverAllowancePerDay}
                        onChange={e => setCurrentPricing({ ...currentPricing, driverAllowancePerDay: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 5: BUSINESS INFO */}
              {activeTab === 'business' && (
                <form onSubmit={handleSaveBusiness} className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heritage text-xl font-bold text-[#821B25]">
                        Business Contact Information
                      </h4>
                      <p className="text-[#292321]/70">
                        Editable verified contact details and policy copy.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="py-2 px-5 bg-[#821B25] text-white font-bold rounded-lg cursor-pointer"
                    >
                      {saving ? 'Saving...' : 'Save Business Info'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1">Business Name</label>
                      <input
                        type="text"
                        value={currentBusiness.name}
                        onChange={e => setCurrentBusiness({ ...currentBusiness, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Tagline</label>
                      <input
                        type="text"
                        value={currentBusiness.tagline}
                        onChange={e => setCurrentBusiness({ ...currentBusiness, tagline: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Primary Contact Phone</label>
                      <input
                        type="text"
                        value={currentBusiness.primaryPhone}
                        onChange={e => setCurrentBusiness({ ...currentBusiness, primaryPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Secondary Contact Phone</label>
                      <input
                        type="text"
                        value={currentBusiness.secondaryPhone}
                        onChange={e => setCurrentBusiness({ ...currentBusiness, secondaryPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1">Physical Location Address</label>
                      <input
                        type="text"
                        value={currentBusiness.location}
                        onChange={e => setCurrentBusiness({ ...currentBusiness, location: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1">Landmarks</label>
                      <input
                        type="text"
                        value={currentBusiness.landmarks}
                        onChange={e => setCurrentBusiness({ ...currentBusiness, landmarks: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1">Booking Policy &amp; Terms Note</label>
                      <textarea
                        rows={3}
                        value={currentBusiness.bookingPolicy}
                        onChange={e => setCurrentBusiness({ ...currentBusiness, bookingPolicy: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FFF9F0] border border-[#E8D5B5] rounded-lg"
                      />
                    </div>
                  </div>
                </form>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};
