import { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  Map as MapIcon,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function LocationSection({
  selectedRadius,
  setSelectedRadius,
  viewMode,
  setViewMode,
  listingsCount = 0,
}) {
  const { coords, locationName, status, requestLocation, setManualLocation, hasLocation } = useLocation();

  const radiusOptions = [
    { id: '2', label: 'Within 2 km', desc: 'Walking distance' },
    { id: '5', label: 'Within 5 km', desc: 'Short bike ride' },
    { id: '10', label: 'Within 10 km', desc: 'Community area' },
    { id: 'all', label: 'All Food', desc: 'Entire city network' },
  ];

  const cityShortcuts = [
    { label: 'Delhi NCR', lat: 28.6139, lon: 77.2090 },
    { label: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { label: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
    { label: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
    { label: 'Pune', lat: 18.5204, lon: 73.8567 },
    { label: 'Kolkata', lat: 22.5726, lon: 88.3639 },
    { label: 'Chennai', lat: 13.0827, lon: 80.2707 },
  ];

  return (
    <section className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EB] to-[#FFFDF9] border-y border-[#EDE3D5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#E03E26]/10 text-[#E03E26] flex items-center justify-center">
                <MapPin className="w-4 h-4 stroke-[2.5]" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#181614] font-['Outfit']">
                Food Around You
              </h2>
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                Live Radius
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#645F5B] mt-1">
              Real-time surplus mapping with verified pickup locations and live proximity calculation.
            </p>
          </div>

          {/* View Mode Switcher: Cards Grid vs Interactive Map */}
          <div className="flex items-center bg-white border border-[#EDE3D5] p-1 rounded-full shadow-warm-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#181614] text-white shadow-xs'
                  : 'text-[#645F5B] hover:text-[#181614]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Food Cards</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#E03E26] text-white shadow-xs'
                  : 'text-[#645F5B] hover:text-[#181614]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Live Map</span>
            </button>
          </div>
        </div>

        {/* Location Status Bar & Controls */}
        <div className="bg-white rounded-[24px_10px_24px_10px] border-2 border-[#EDE3D5] p-4 sm:p-5 shadow-warm-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Left: Location Detection Status */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#F5EFEB] shrink-0">
              {hasLocation && (
                <span className="pulse-radar-ring absolute inset-0 rounded-full bg-[#16A34A] opacity-75"></span>
              )}
              <Navigation
                className={`w-5 h-5 ${
                  hasLocation ? 'text-[#16A34A]' : 'text-[#8C827A]'
                }`}
              />
            </div>

            <div>
              {hasLocation ? (
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-extrabold text-[#181614]">
                      📍 {locationName || 'Current Location Detected'}
                    </p>
                    <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#645F5B] mt-0.5">
                    Showing real surplus distances from your exact coordinates.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-bold text-[#181614]">
                    📍 Location access not yet enabled
                  </p>
                  <p className="text-xs text-[#8C827A] mt-0.5">
                    Allow location access to calculate exact walking & pickup distances.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Middle: Radius Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A] mr-1">
              Radius:
            </span>
            {radiusOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedRadius(opt.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedRadius === opt.id
                    ? 'bg-[#181614] text-white shadow-xs'
                    : 'bg-[#F5EFEB] text-[#645F5B] hover:bg-[#EADFCF]'
                }`}
                title={opt.desc}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Right: Location Action Button */}
          <div>
            {hasLocation ? (
              <button
                onClick={requestLocation}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#181614] bg-[#F5EFEB] hover:bg-[#EADFCF] transition-colors cursor-pointer"
              >
                <span>🔄 Update Location</span>
              </button>
            ) : (
              <button
                onClick={requestLocation}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-[#E03E26] to-[#F26419] hover:from-[#C8321C] hover:to-[#E04F36] active:scale-95 shadow-warm-sm transition-all cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Allow Location Access</span>
              </button>
            )}
          </div>

        </div>

        {/* Quick City Location Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-bold text-[#8C827A] uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#E03E26]" />
            <span>Switch Hub:</span>
          </span>
          {cityShortcuts.map((city) => {
            const isSelected = locationName && locationName.toLowerCase().includes(city.label.toLowerCase());
            return (
              <button
                key={city.label}
                onClick={() => setManualLocation(city.lat, city.lon, city.label)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E03E26] text-white shadow-xs font-bold'
                    : 'bg-white border border-[#EDE3D5] text-[#645F5B] hover:text-[#181614] hover:border-[#E03E26]/50'
                }`}
              >
                {city.label}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
