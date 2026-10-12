import React from 'react';
import {
  Filter,
  Users,
  Car,
  DollarSign,
  Briefcase,
  Search,
  X,
  Sparkles,
  ArrowUpDown,
  Plane,
  Compass,
} from 'lucide-react';
import type { Vehicle, VehicleTripFilterState } from '../types/index.js';
import type { Language } from '../i18n/translations.js';

interface VehicleTripFilterBarProps {
  filter: VehicleTripFilterState;
  onFilterChange: (updated: VehicleTripFilterState) => void;
  onResetFilters: () => void;
  totalVehiclesCount: number;
  filteredVehiclesCount: number;
  lang: Language;
}

export const VehicleTripFilterBar: React.FC<VehicleTripFilterBarProps> = ({
  filter,
  onFilterChange,
  onResetFilters,
  totalVehiclesCount,
  filteredVehiclesCount,
  lang,
}) => {
  const isFiltered =
    filter.tripType !== 'all' ||
    filter.minSeats > 0 ||
    filter.category !== 'all' ||
    filter.budgetTier !== 'all' ||
    filter.hasCarrierOnly ||
    filter.searchQuery.trim().length > 0 ||
    filter.sortBy !== 'popular';

  const quickPills = [
    {
      id: 'all',
      labelHi: 'सभी वाहन',
      labelEn: 'All Vehicles',
      active: !isFiltered,
      onClick: onResetFilters,
    },
    {
      id: 'airport',
      labelHi: '✈️ एयरपोर्ट ट्रांसफर',
      labelEn: '✈️ Airport Transfers',
      active: filter.tripType === 'airport_transfer',
      onClick: () =>
        onFilterChange({
          ...filter,
          tripType: filter.tripType === 'airport_transfer' ? 'all' : 'airport_transfer',
        }),
    },
    {
      id: 'family',
      labelHi: '👨‍👩‍👧‍👦 बड़ा परिवार (६+ सीटें)',
      labelEn: '👨‍👩‍👧‍👦 Big Family (6+ Pax)',
      active: filter.minSeats === 6,
      onClick: () =>
        onFilterChange({
          ...filter,
          minSeats: filter.minSeats === 6 ? 0 : 6,
        }),
    },
    {
      id: 'budget',
      labelHi: '💰 किफायती बजट (≤₹१२/किमी)',
      labelEn: '💰 Budget Friendly (≤₹12/km)',
      active: filter.budgetTier === 'economy',
      onClick: () =>
        onFilterChange({
          ...filter,
          budgetTier: filter.budgetTier === 'economy' ? 'all' : 'economy',
        }),
    },
    {
      id: 'carrier',
      labelHi: '🧳 भारी सामान / रूफ कैरियर',
      labelEn: '🧳 Heavy Luggage / Roof Carrier',
      active: filter.hasCarrierOnly,
      onClick: () =>
        onFilterChange({
          ...filter,
          hasCarrierOnly: !filter.hasCarrierOnly,
        }),
    },
    {
      id: 'yatra',
      labelHi: '🛕 तीर्थ यात्रा (लोकल/आउटस्टेशन)',
      labelEn: '🛕 Pilgrimage Yatra Friendly',
      active: filter.tripType === 'round_trip',
      onClick: () =>
        onFilterChange({
          ...filter,
          tripType: filter.tripType === 'round_trip' ? 'all' : 'round_trip',
        }),
    },
  ];

  return (
    <div className="w-full bg-[#FFFDF7] rounded-3xl border border-[#C69A52]/40 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Top Header: Title + Results Count + Clear */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#821B25] text-amber-200 flex items-center justify-center shadow-2xs">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-heritage text-sm sm:text-base font-bold text-[#821B25]">
              {lang === 'hi' ? 'वाहन एवं यात्रा फ़िल्टर' : 'Filter Vehicle Trips'}
            </h3>
            <p className="text-[11px] text-[#292321]/70">
              {lang === 'hi'
                ? 'अपनी यात्रा, सीटों की संख्या और बजट के अनुसार उपयुक्त वाहन चुनें'
                : 'Filter out the best vehicle by trip type, passenger seats & budget'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F3E8D5] text-[#821B25] border border-[#C69A52]/30">
            {lang === 'hi'
              ? `${totalVehiclesCount} में से ${filteredVehiclesCount} वाहन उपलब्ध`
              : `${filteredVehiclesCount} of ${totalVehiclesCount} Vehicles Available`}
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 1-Tap Quick Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {quickPills.map(p => (
          <button
            key={p.id}
            onClick={p.onClick}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
              p.active
                ? 'bg-[#821B25] text-white border-[#821B25] shadow-xs'
                : 'bg-white hover:bg-[#F3E8D5] text-[#292321] border-[#C69A52]/30'
            }`}
          >
            {lang === 'hi' ? p.labelHi : p.labelEn}
          </button>
        ))}
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-[#C69A52]/20">
        {/* Filter 1: Trip Type */}
        <div>
          <label className="block text-[11px] font-bold text-[#292321] uppercase tracking-wider mb-1">
            {lang === 'hi' ? 'यात्रा प्रकार (Trip Type)' : 'Trip Type'}
          </label>
          <select
            value={filter.tripType}
            onChange={e =>
              onFilterChange({
                ...filter,
                tripType: e.target.value as any,
              })
            }
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#C69A52]/40 bg-white text-[#292321] focus:ring-2 focus:ring-[#821B25] focus:outline-hidden"
          >
            <option value="all">{lang === 'hi' ? 'सभी यात्रा प्रकार' : 'All Trip Types'}</option>
            <option value="one_way">{lang === 'hi' ? 'एकतरफा यात्रा (One-Way)' : 'One-Way Drop'}</option>
            <option value="round_trip">{lang === 'hi' ? 'आउटस्टेशन राउंड ट्रिप' : 'Round-Trip Outstation'}</option>
            <option value="local_sightseeing">{lang === 'hi' ? 'लोकल काशी दर्शन (8h/80km)' : 'Local Sightseeing (8h/80km)'}</option>
            <option value="airport_transfer">{lang === 'hi' ? 'बाबतपुर एयरपोर्ट ट्रांसफर' : 'Babatpur Airport Transfer'}</option>
          </select>
        </div>

        {/* Filter 2: Seating Capacity */}
        <div>
          <label className="block text-[11px] font-bold text-[#292321] uppercase tracking-wider mb-1">
            {lang === 'hi' ? 'यात्री सीटें (Passenger Seats)' : 'Min Passenger Seats'}
          </label>
          <select
            value={filter.minSeats}
            onChange={e =>
              onFilterChange({
                ...filter,
                minSeats: Number(e.target.value),
              })
            }
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#C69A52]/40 bg-white text-[#292321] focus:ring-2 focus:ring-[#821B25] focus:outline-hidden"
          >
            <option value="0">{lang === 'hi' ? 'कोई भी क्षमता (Any Seats)' : 'Any Seating Capacity'}</option>
            <option value="4">{lang === 'hi' ? '४ सीटें (Sedan - Dzire/Zest)' : '4 Seats (Sedan - Dzire/Zest)'}</option>
            <option value="6">{lang === 'hi' ? '६-७ सीटें (MPV - Ertiga/Innova)' : '6-7 Seats (MPV - Ertiga/Innova)'}</option>
            <option value="12">{lang === 'hi' ? '१२+ सीटें (Tempo Traveller)' : '12+ Seats (Group Tempo Traveller)'}</option>
          </select>
        </div>

        {/* Filter 3: Vehicle Class */}
        <div>
          <label className="block text-[11px] font-bold text-[#292321] uppercase tracking-wider mb-1">
            {lang === 'hi' ? 'वाहन श्रेणी (Category)' : 'Vehicle Category'}
          </label>
          <select
            value={filter.category}
            onChange={e =>
              onFilterChange({
                ...filter,
                category: e.target.value as any,
              })
            }
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#C69A52]/40 bg-white text-[#292321] focus:ring-2 focus:ring-[#821B25] focus:outline-hidden"
          >
            <option value="all">{lang === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}</option>
            <option value="Sedan">{lang === 'hi' ? 'सेडान (Sedan)' : 'Sedan (Dzire, Zest)'}</option>
            <option value="MPV">{lang === 'hi' ? 'एम०पी०वी० (Ertiga, Innova)' : 'MPV (Ertiga, Innova)'}</option>
            <option value="Tempo Traveller">{lang === 'hi' ? 'टेम्पो ट्रैवलर (Tempo Traveller)' : 'Tempo Traveller'}</option>
          </select>
        </div>

        {/* Filter 4: Sort Order */}
        <div>
          <label className="block text-[11px] font-bold text-[#292321] uppercase tracking-wider mb-1">
            {lang === 'hi' ? 'क्रमबद्ध करें (Sort By)' : 'Sort By'}
          </label>
          <select
            value={filter.sortBy}
            onChange={e =>
              onFilterChange({
                ...filter,
                sortBy: e.target.value as any,
              })
            }
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#C69A52]/40 bg-white text-[#292321] focus:ring-2 focus:ring-[#821B25] focus:outline-hidden"
          >
            <option value="popular">{lang === 'hi' ? 'लोकप्रियता / अनुशंसित' : 'Most Popular & Recommended'}</option>
            <option value="price_asc">{lang === 'hi' ? 'किराया: कम से अधिक (₹/km)' : 'Rate: Low to High (₹/km)'}</option>
            <option value="seats_desc">{lang === 'hi' ? 'सीटें: अधिक से कम' : 'Seating: High to Low'}</option>
          </select>
        </div>
      </div>

      {/* Keyword Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#821B25] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filter.searchQuery}
          onChange={e =>
            onFilterChange({
              ...filter,
              searchQuery: e.target.value,
            })
          }
          placeholder={
            lang === 'hi'
              ? 'वाहन का नाम या सुविधा खोजें (उदा. Ertiga, Innova, AC, Carrier)...'
              : 'Search vehicle by name or feature (e.g. Dzire, Ertiga, Innova, AC, Carrier)...'
          }
          className="w-full pl-10 pr-9 py-2 text-xs rounded-xl border border-[#C69A52]/30 bg-white text-[#292321] focus:ring-2 focus:ring-[#821B25] focus:outline-hidden"
        />
        {filter.searchQuery && (
          <button
            onClick={() => onFilterChange({ ...filter, searchQuery: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
