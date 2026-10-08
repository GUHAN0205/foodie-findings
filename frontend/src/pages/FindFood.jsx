import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { foodApi } from '../services/api';
import FoodCard from '../components/FoodCard';
import MapComponent from '../components/MapComponent';
import EmptyState from '../components/EmptyState';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Map as MapIcon, 
  Grid, 
  Sparkles, 
  Clock, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const FindFood = () => {
  const { coords, locationName, status, errorMsg, requestLocation, setManualLocation } = useLocation();
  const { user } = useAuth();

  const [listings, setListings] = useState([]);
  const [smartMatches, setSmartMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [showSmartMatch, setShowSmartMatch] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [foodType, setFoodType] = useState('ALL');
  const [eventType, setEventType] = useState('ALL');
  const [radiusKm, setRadiusKm] = useState(25);
  const [expiringOnly, setExpiringOnly] = useState(false);

  // Manual location modal state
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [customLat, setCustomLat] = useState('12.9716');
  const [customLon, setCustomLon] = useState('77.5946');
  const [customName, setCustomName] = useState('Bangalore Center');

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: search.trim() || undefined,
        category: category !== 'ALL' ? category : undefined,
        foodType: foodType !== 'ALL' ? foodType : undefined,
        eventType: eventType !== 'ALL' ? eventType : undefined,
        radiusKm: radiusKm || undefined,
      };

      if (coords && coords.latitude && coords.longitude) {
        params.lat = coords.latitude;
        params.lon = coords.longitude;
      }

      if (showSmartMatch) {
        const matchRes = await foodApi.getMatching(coords ? { lat: coords.latitude, lon: coords.longitude } : {});
        const matchedList = (matchRes.data || []).map(m => ({
          ...m.listing,
          matchScore: m.matchScore,
          matchReason: m.matchReason
        }));
        setListings(matchedList);
      } else {
        const res = await foodApi.getListings(params);
        let list = res.data || [];
        if (expiringOnly) {
          list = list.filter(l => l.isExpiringSoon || (l.minutesRemaining && l.minutesRemaining <= 90));
        }
        setListings(list);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  }, [coords, search, category, foodType, eventType, radiusKm, expiringOnly, showSmartMatch]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleManualLocationSubmit = (e) => {
    e.preventDefault();
    setManualLocation(parseFloat(customLat), parseFloat(customLon), customName);
    setManualModalOpen(false);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('ALL');
    setFoodType('ALL');
    setEventType('ALL');
    setRadiusKm(25);
    setExpiringOnly(false);
    setShowSmartMatch(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e2d9cd] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#e23744] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-World Geospatial Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1e293b] font-serif">
            Find Food Near You
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1">
            Discover verified edible surplus from weddings, caterers, and events sorted by real distance.
          </p>
        </div>

        {/* View Toggle & Smart Match */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Smart Match Toggle */}
          <button
            onClick={() => setShowSmartMatch(!showSmartMatch)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              showSmartMatch
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'bg-white border border-[#e2d9cd] text-[#475569] hover:border-emerald-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended for You</span>
          </button>

          {/* Grid vs Map Toggle */}
          <div className="flex items-center bg-white border border-[#e2d9cd] rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                viewMode === 'grid' ? 'bg-[#e23744] text-white shadow-xs' : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                viewMode === 'map' ? 'bg-[#e23744] text-white shadow-xs' : 'text-[#64748b] hover:text-[#1e293b]'
              }`}
              title="Map View"
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* GPS Location Banner */}
      {!coords && status === 'denied' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-800 text-xs">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">📍 Location access is required to discover surplus food near you.</p>
              <p className="text-amber-700">We do not guess locations. Allow browser GPS access or pick a location manually.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={requestLocation}
              className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors"
            >
              Retry GPS
            </button>
            <button
              onClick={() => setManualModalOpen(true)}
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg font-bold hover:bg-amber-100 transition-colors"
            >
              Choose Manually
            </button>
          </div>
        </div>
      )}

      {/* Active Location Info Bar */}
      <div className="flex flex-wrap items-center justify-between bg-white p-3.5 rounded-2xl border border-[#e2d9cd] text-xs text-[#475569]">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-[#e23744]" />
          <span>Active Origin:</span>
          <span className="font-bold text-[#1e293b]">
            {coords ? (locationName || `GPS (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`) : 'Location not set'}
          </span>
        </div>
        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          <button
            onClick={() => setManualModalOpen(true)}
            className="text-[#e23744] font-bold hover:underline"
          >
            Change Location
          </button>
          <span>•</span>
          <button
            onClick={fetchListings}
            className="flex items-center space-x-1 text-[#475569] hover:text-[#1e293b]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food name, description, neighborhood, or event..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#e23744]"
          />
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {/* Category */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#94a3b8] mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#faf7f2] border border-[#e2d9cd] rounded-xl focus:outline-none focus:border-[#e23744]"
            >
              <option value="ALL">All Categories</option>
              <option value="Cooked Meals">Cooked Meals</option>
              <option value="Bakery & Breads">Bakery & Breads</option>
              <option value="Produce & Groceries">Produce & Groceries</option>
              <option value="Dairy & Sweets">Dairy & Sweets</option>
              <option value="Packaged & Canned">Packaged & Canned</option>
            </select>
          </div>

          {/* Dietary */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#94a3b8] mb-1">Dietary</label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#faf7f2] border border-[#e2d9cd] rounded-xl focus:outline-none focus:border-[#e23744]"
            >
              <option value="ALL">All Dietary</option>
              <option value="VEGETARIAN">Vegetarian 🟢</option>
              <option value="NON_VEGETARIAN">Non-Veg 🔴</option>
              <option value="VEGAN">Vegan 🌱</option>
            </select>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#94a3b8] mb-1">Source Event</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#faf7f2] border border-[#e2d9cd] rounded-xl focus:outline-none focus:border-[#e23744]"
            >
              <option value="ALL">All Events</option>
              <option value="Wedding">Wedding</option>
              <option value="Hostel">Hostel</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Birthday">Birthday</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Festival">Festival</option>
            </select>
          </div>

          {/* Radius */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold uppercase text-[#94a3b8] mb-1">Radius</label>
              <span className="text-[10px] font-bold text-[#e23744]">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-[#e23744] cursor-pointer"
            />
          </div>

          {/* Urgency */}
          <div className="flex items-end">
            <button
              onClick={() => setExpiringOnly(!expiringOnly)}
              className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                expiringOnly
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-[#faf7f2] border border-[#e2d9cd] text-[#64748b] hover:border-amber-500'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Expiring Soon</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Content Area: Map or Grid */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <MapComponent
            listings={listings}
            userCoords={coords}
            height="560px"
          />
          <div className="text-xs text-[#64748b] flex items-center justify-between px-2">
            <span>Showing {listings.length} verified listings on map.</span>
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                <span>Available</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span>Expiring Soon</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                <span>Your Location</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-white rounded-3xl border border-[#e2d9cd] animate-pulse"></div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <FoodCard key={item.id} listing={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Looks like the plate is empty! 🍽️"
              message={`No verified surplus-food listings were found within ${radiusKm} km. Foodie Findings never fabricates fake listings to appear full.`}
              onReset={resetFilters}
            />
          )}
        </div>
      )}

      {/* Manual Location Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#e2d9cd]">
            <h3 className="text-base font-bold text-[#1e293b] mb-1">Set Location Manually</h3>
            <p className="text-xs text-[#64748b] mb-4">
              Enter your real geographical coordinates or select a common area.
            </p>

            {/* Quick Presets */}
            <div className="space-y-1.5 mb-4">
              <p className="text-[10px] font-bold uppercase text-[#94a3b8]">Quick Presets</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => { setCustomLat('12.9716'); setCustomLon('77.5946'); setCustomName('Bangalore (MG Road)'); }}
                  className="px-2.5 py-1 text-xs bg-[#faf7f2] border border-[#e2d9cd] rounded-lg hover:border-[#e23744]"
                >
                  Bangalore (MG Road)
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomLat('12.9784'); setCustomLon('77.6408'); setCustomName('Indiranagar'); }}
                  className="px-2.5 py-1 text-xs bg-[#faf7f2] border border-[#e2d9cd] rounded-lg hover:border-[#e23744]"
                >
                  Indiranagar
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomLat('19.0760'); setCustomLon('72.8777'); setCustomName('Mumbai (Bandra)'); }}
                  className="px-2.5 py-1 text-xs bg-[#faf7f2] border border-[#e2d9cd] rounded-lg hover:border-[#e23744]"
                >
                  Mumbai
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomLat('28.6139'); setCustomLon('77.2090'); setCustomName('New Delhi'); }}
                  className="px-2.5 py-1 text-xs bg-[#faf7f2] border border-[#e2d9cd] rounded-lg hover:border-[#e23744]"
                >
                  New Delhi
                </button>
              </div>
            </div>

            <form onSubmit={handleManualLocationSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#475569] mb-1">Location Label</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#faf7f2] border border-[#e2d9cd] rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#faf7f2] border border-[#e2d9cd] rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={customLon}
                    onChange={(e) => setCustomLon(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#faf7f2] border border-[#e2d9cd] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-[#475569] border border-[#e2d9cd] rounded-xl hover:bg-[#faf7f2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#e23744] hover:bg-[#cb202d] rounded-xl shadow-xs"
                >
                  Set Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FindFood;
