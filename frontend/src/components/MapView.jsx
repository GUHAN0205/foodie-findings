import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
  Clock,
  MapPin,
  ChevronRight,
  PlusCircle,
  Search,
  Compass,
  X,
  Activity,
  Filter,
} from 'lucide-react';

// Complete India Bounding & Default Coordinates
const INDIA_DEFAULT_CENTER = [22.9734, 78.6569]; // Geographic center of India
const INDIA_DEFAULT_ZOOM = 5; // Shows complete Indian territory including borders and islands

// Major Indian Hub Presets (100% Indian Territory)
const INDIAN_HUBS = [
  { id: 'india', name: '🇮🇳 Complete India', lat: 22.9734, lon: 78.6569, zoom: 5 },
  { id: 'delhi', name: 'Delhi NCR', lat: 28.6139, lon: 77.2090, zoom: 11 },
  { id: 'mumbai', name: 'Mumbai', lat: 19.0760, lon: 72.8777, zoom: 11 },
  { id: 'bengaluru', name: 'Bengaluru', lat: 12.9716, lon: 77.5946, zoom: 11 },
  { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lon: 78.4867, zoom: 11 },
  { id: 'pune', name: 'Pune', lat: 18.5204, lon: 73.8567, zoom: 11 },
  { id: 'kolkata', name: 'Kolkata', lat: 22.5726, lon: 88.3639, zoom: 11 },
  { id: 'chennai', name: 'Chennai', lat: 13.0827, lon: 80.2707, zoom: 11 },
  { id: 'ahmedabad', name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, zoom: 11 },
  { id: 'jaipur', name: 'Jaipur', lat: 26.9124, lon: 75.7873, zoom: 11 },
];

// Custom Food Rescue Marker Icon using Leaflet DivIcon
function createFoodMarkerIcon(category, foodType) {
  const getEmoji = () => {
    switch (category) {
      case 'Bakery': return '🥐';
      case 'Cooked Meals':
      case 'Meals': return '🍛';
      case 'Fresh Produce':
      case 'Produce': return '🥬';
      case 'Fruits': return '🍎';
      case 'Dairy': return '🥛';
      case 'Packaged': return '📦';
      default: return '🍱';
    }
  };

  const bgColor =
    foodType === 'VEGAN'
      ? '#16A34A'
      : foodType === 'VEGETARIAN'
      ? '#F59E0B'
      : '#E03E26';

  return L.divIcon({
    className: 'custom-food-marker',
    html: `
      <div style="
        background: ${bgColor};
        width: 42px;
        height: 42px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 8px 18px rgba(0,0,0,0.28);
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      " class="hover:scale-115">
        <span style="
          transform: rotate(45deg);
          font-size: 19px;
          user-select: none;
        ">${getEmoji()}</span>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
  });
}

// User location marker with glowing radar animation
function createUserMarkerIcon() {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="position: relative; width: 28px; height: 28px;">
        <div style="
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          background: rgba(22, 163, 74, 0.3);
          animation: pulseRadar 2s infinite;
        "></div>
        <div style="
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #16A34A;
          border: 3.5px solid white;
          box-shadow: 0 4px 12px rgba(22,163,74,0.45);
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -20],
  });
}

// Map event listener for Zoom & Move updates (enabling Zoom-Based Rendering)
function MapStateSynchronizer({ onZoomChange, targetFlyTo, onFlyComplete }) {
  const map = useMap();

  useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
    moveend: () => {
      onZoomChange(map.getZoom());
    },
  });

  useEffect(() => {
    if (targetFlyTo) {
      if (targetFlyTo.bounds) {
        map.fitBounds(targetFlyTo.bounds, {
          padding: [40, 40],
          maxZoom: targetFlyTo.maxZoom || 12,
        });
      } else if (targetFlyTo.lat && targetFlyTo.lon) {
        map.flyTo([targetFlyTo.lat, targetFlyTo.lon], targetFlyTo.zoom || 11, {
          duration: 1.1,
          easeLinearity: 0.25,
        });
      }
      if (onFlyComplete) onFlyComplete();
    }
  }, [targetFlyTo, map, onFlyComplete]);

  return null;
}

export default function MapView({
  listings = [],
  userCoords = null,
  onSelectListing,
  onClaimListing,
  onOpenPostModal,
}) {
  // Map View & Zoom Tracking
  const [zoomLevel, setZoomLevel] = useState(INDIA_DEFAULT_ZOOM);
  const [targetFlyTo, setTargetFlyTo] = useState(null);
  const [selectedHub, setSelectedHub] = useState('india');

  // Hierarchical Geographic Data
  const [statesGeoJson, setStatesGeoJson] = useState(null);
  const [districtsByState, setDistrictsByState] = useState(null);
  const [stateDistrictCounts, setStateDistrictCounts] = useState({});
  const [districtsCatalog, setDistrictsCatalog] = useState([]);

  // Active Hierarchical Selections
  // INDIA -> STATE -> DISTRICT
  const [activeState, setActiveState] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);
  const [selectedDistrictModal, setSelectedDistrictModal] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dietaryFilter, setDietaryFilter] = useState('ALL');

  // Layer Toggles
  const [showStateBorders, setShowStateBorders] = useState(true);
  const [showDistrictBorders, setShowDistrictBorders] = useState(true);

  // Geolocation locating state
  const [isLocating, setIsLocating] = useState(false);

  // Load Administrative Boundary Datasets asynchronously
  useEffect(() => {
    Promise.all([
      fetch('/data/india_states_simplified.json').then((r) => (r.ok ? r.json() : null)),
      fetch('/data/india_districts_by_state.json').then((r) => (r.ok ? r.json() : null)),
      fetch('/data/india_state_district_counts.json').then((r) => (r.ok ? r.json() : {})),
      fetch('/data/india_districts_catalog.json').then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([states, districts, counts, catalog]) => {
        if (states) setStatesGeoJson(states);
        if (districts) setDistrictsByState(districts);
        if (counts) setStateDistrictCounts(counts);
        if (catalog) setDistrictsCatalog(catalog);
      })
      .catch((err) => {
        console.warn('Error loading India boundary data:', err);
      });
  }, []);

  // Filter listings based on internal map filter pills
  const mapFilteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (!item.latitude || !item.longitude) return false;
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
      if (dietaryFilter !== 'ALL' && item.foodType !== dietaryFilter) return false;
      return true;
    });
  }, [listings, categoryFilter, dietaryFilter]);

  // Autocomplete matching for State, District or Food Listing search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase().trim();

    // 1. States matching
    const stateMatches = (statesGeoJson?.features || [])
      .filter((f) => f.properties?.name?.toLowerCase().includes(q))
      .slice(0, 3)
      .map((f) => ({
        type: 'state',
        name: f.properties.name,
        stateName: f.properties.name,
        districtCount: stateDistrictCounts[f.properties.name] || 'Multiple',
      }));

    // 2. Districts matching
    const districtMatches = districtsCatalog
      .filter((d) => d.district.toLowerCase().includes(q) || d.state.toLowerCase().includes(q))
      .slice(0, 5)
      .map((d) => ({
        type: 'district',
        name: d.district,
        stateName: d.state,
        lat: d.lat,
        lon: d.lon,
      }));

    // 3. Food Listings matching
    const listingMatches = mapFilteredListings
      .filter((l) =>
        (l.foodName || '').toLowerCase().includes(q) ||
        (l.pickupLocation || '').toLowerCase().includes(q) ||
        (l.approximateArea || '').toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((l) => ({
        type: 'listing',
        name: l.foodName,
        stateName: l.approximateArea || l.pickupLocation,
        listing: l,
        lat: l.latitude,
        lon: l.longitude,
      }));

    return [...stateMatches, ...districtMatches, ...listingMatches].slice(0, 9);
  }, [searchQuery, statesGeoJson, districtsCatalog, stateDistrictCounts, mapFilteredListings]);

  // Handle Hub Shortcut
  const handleSelectHub = (hub) => {
    setSelectedHub(hub.id);
    setSearchQuery('');
    setIsSearchDropdownOpen(false);
    if (hub.id === 'india') {
      setActiveState(null);
      setActiveDistrict(null);
    }
    setTargetFlyTo({ lat: hub.lat, lon: hub.lon, zoom: hub.zoom });
  };

  // "Locate Me" functionality
  const handleLocateMe = useCallback(() => {
    if (userCoords && userCoords.latitude && userCoords.longitude) {
      setSelectedHub('user');
      setTargetFlyTo({
        lat: userCoords.latitude,
        lon: userCoords.longitude,
        zoom: 13,
      });
      return;
    }

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setSelectedHub('user');
        setTargetFlyTo({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          zoom: 13,
        });
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation failed:', err);
        // Fallback to Delhi NCR if location permission denied
        setTargetFlyTo({ lat: 28.6139, lon: 77.2090, zoom: 11 });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [userCoords]);

  // Handle Search Result Selection
  const handleSelectSearchResult = (res) => {
    setIsSearchDropdownOpen(false);
    setSearchQuery(res.name);

    if (res.type === 'state') {
      setActiveState(res.name);
      setActiveDistrict(null);
      setSelectedHub(res.name);

      // Find state bounds from statesGeoJson
      const feature = statesGeoJson?.features?.find((f) => f.properties?.name === res.name);
      if (feature) {
        const geoLayer = L.geoJSON(feature);
        setTargetFlyTo({ bounds: geoLayer.getBounds(), maxZoom: 8 });
      }
    } else if (res.type === 'district') {
      setActiveState(res.stateName);
      setActiveDistrict({ name: res.name, state: res.stateName, lat: res.lat, lon: res.lon });
      setSelectedHub(res.name);
      setTargetFlyTo({ lat: res.lat, lon: res.lon, zoom: 11 });
    } else if (res.type === 'listing') {
      setSelectedHub(res.name);
      setTargetFlyTo({ lat: res.lat, lon: res.lon, zoom: 14 });
      if (onSelectListing && res.listing) {
        onSelectListing(res.listing);
      }
    }
  };

  // Reset to Complete India
  const handleResetToIndia = () => {
    setActiveState(null);
    setActiveDistrict(null);
    setSelectedHub('india');
    setSearchQuery('');
    setTargetFlyTo({ lat: INDIA_DEFAULT_CENTER[0], lon: INDIA_DEFAULT_CENTER[1], zoom: INDIA_DEFAULT_ZOOM });
  };

  // State Boundary Styling (Level 1)
  const getStateStyle = (feature) => {
    const isSelected = activeState && activeState.toLowerCase() === feature.properties.name?.toLowerCase();
    return {
      fillColor: isSelected ? '#E03E26' : '#FAF5EB',
      weight: isSelected ? 2.5 : 1.5,
      opacity: 0.8,
      color: '#E03E26',
      dashArray: isSelected ? '' : '3, 4',
      fillOpacity: isSelected ? 0.22 : 0.08,
    };
  };

  // On Each State Feature Interaction
  const onEachStateFeature = (feature, layer) => {
    const stateName = feature.properties?.name || 'State';
    const districtCount = stateDistrictCounts[stateName] || 'Multiple';
    
    // Count listings in this state
    const stateListings = mapFilteredListings.filter((l) => {
      const txt = `${l.pickupLocation || ''} ${l.approximateArea || ''}`.toLowerCase();
      return txt.includes(stateName.toLowerCase());
    });

    layer.bindTooltip(
      `
      <div style="font-family:'Plus Jakarta Sans',sans-serif; min-width: 140px;">
        <p style="font-weight:900; font-size:12px; margin:0 0 2px 0; color:#E03E26;">🏛️ ${stateName}</p>
        <p style="font-size:10px; margin:0; color:#524c47;">📍 <strong>${districtCount}</strong> Districts</p>
        <p style="font-size:10px; margin:0; color:#16A34A; font-weight:bold;">🍲 ${stateListings.length} Rescue Batches</p>
      </div>
      `,
      { sticky: true, className: 'state-map-tooltip' }
    );

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 2.5,
          color: '#E03E26',
          fillOpacity: 0.25,
          fillColor: '#E03E26',
        });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(getStateStyle(feature));
      },
      click: (e) => {
        setActiveState(stateName);
        setActiveDistrict(null);
        setSelectedHub(stateName);
        const map = e.target._map;
        if (map && e.target.getBounds) {
          map.fitBounds(e.target.getBounds(), { padding: [30, 30], maxZoom: 8 });
        }
      },
    });
  };

  // District Boundary Styling (Level 2)
  const getDistrictStyle = (feature) => {
    const isSelected = activeDistrict && activeDistrict.name?.toLowerCase() === feature.properties.district?.toLowerCase();
    return {
      fillColor: isSelected ? '#15803D' : '#FEF3C7',
      weight: isSelected ? 2.5 : 1.2,
      opacity: 0.85,
      color: isSelected ? '#15803D' : '#D97706',
      dashArray: '2, 3',
      fillOpacity: isSelected ? 0.3 : 0.08,
    };
  };

  // On Each District Feature Interaction
  const onEachDistrictFeature = (feature, layer) => {
    const distName = feature.properties?.district || 'District';
    const stateName = feature.properties?.state || activeState || 'State';

    // Find listings in or near this district
    const matchingListings = mapFilteredListings.filter((l) => {
      const txt = `${l.pickupLocation || ''} ${l.approximateArea || ''}`.toLowerCase();
      return txt.includes(distName.toLowerCase()) || txt.includes(stateName.toLowerCase());
    });

    layer.bindTooltip(
      `
      <div style="font-family:'Plus Jakarta Sans',sans-serif; min-width: 130px;">
        <p style="font-weight:800; font-size:11px; margin:0 0 2px 0; color:#181614;">📍 ${distName}</p>
        <p style="font-size:10px; margin:0; color:#645F5B;">${stateName}</p>
        <p style="font-size:10px; margin:0; color:#15803D; font-weight:bold;">${matchingListings.length} Surplus Near Here</p>
      </div>
      `,
      { sticky: true, className: 'state-map-tooltip' }
    );

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 2.2,
          color: '#15803D',
          fillOpacity: 0.25,
          fillColor: '#16A34A',
        });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(getDistrictStyle(feature));
      },
      click: (e) => {
        const distInfo = {
          name: distName,
          state: stateName,
          listings: matchingListings,
          activeDonors: Math.max(1, matchingListings.length * 2),
          mealsSavedToday: matchingListings.reduce((sum, item) => sum + (item.servings || 0), 120),
          status: matchingListings.length > 0 ? 'Active Food Rescue Live' : 'Volunteer Patrol Active',
        };
        setActiveDistrict(distInfo);
        setSelectedDistrictModal(distInfo);

        const map = e.target._map;
        if (map && e.target.getBounds) {
          map.fitBounds(e.target.getBounds(), { padding: [25, 25], maxZoom: 12 });
        }
      },
    });
  };

  // Compile active district features based on zoom & selected state
  const activeDistrictFeatures = useMemo(() => {
    if (!districtsByState) return [];

    // If an active state is selected, prioritize rendering that state's districts
    if (activeState && districtsByState[activeState]) {
      return districtsByState[activeState];
    }

    // At medium-to-high zoom (>= 7), if no single state selected, render districts
    if (zoomLevel >= 7) {
      // Gather visible or top state districts (e.g. major populated states for performance)
      const features = [];
      const keys = Object.keys(districtsByState);
      for (const k of keys) {
        features.push(...districtsByState[k]);
      }
      return features;
    }

    return [];
  }, [districtsByState, activeState, zoomLevel]);

  // Time remaining helper
  const formatTimeRemaining = (availableUntil) => {
    if (!availableUntil) return null;
    const diff = (new Date(availableUntil) - new Date()) / (1000 * 60 * 60);
    if (diff <= 0) return 'Expired';
    if (diff < 1) return `${Math.round(diff * 60)}m left`;
    return `${diff.toFixed(1)}h left`;
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-4">
      
      {/* Top Breadcrumb & Hierarchy Status Banner */}
      <div className="bg-[#FAF5EB] border border-[#EDE3D5] rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-black text-[#8C827A] uppercase tracking-wider text-[10px]">
            Map Hierarchy:
          </span>

          <button
            onClick={handleResetToIndia}
            className={`font-black flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
              !activeState
                ? 'bg-[#E03E26] text-white shadow-xs'
                : 'text-[#181614] hover:bg-[#EDE3D5]'
            }`}
          >
            <span>🇮🇳 India</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-[#8C827A]" />

          <span className={`font-bold px-2.5 py-1 rounded-full ${
            activeState
              ? 'bg-[#181614] text-white'
              : 'text-[#8C827A] italic'
          }`}>
            {activeState ? activeState : 'All States + UTs (35)'}
          </span>

          {activeState && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C827A]" />
              <span className={`font-bold px-2.5 py-1 rounded-full ${
                activeDistrict
                  ? 'bg-[#15803D] text-white'
                  : 'bg-white border border-[#EDE3D5] text-[#15803D]'
              }`}>
                {activeDistrict ? activeDistrict.name : `${stateDistrictCounts[activeState] || ''} Districts Available`}
              </span>
            </>
          )}

          <ChevronRight className="w-3.5 h-3.5 text-[#8C827A]" />

          <span className="font-extrabold text-[#E03E26] bg-white border border-[#EDE3D5] px-2.5 py-1 rounded-full flex items-center gap-1">
            <span>🍲 {mapFilteredListings.length} Food Rescue Points</span>
          </span>
        </div>

        {/* Zoom Level Indicator */}
        <div className="flex items-center gap-2 text-[11px] text-[#645F5B]">
          <span className="font-bold">Zoom: {zoomLevel}</span>
          <span className="px-2 py-0.5 rounded-full bg-white border border-[#EDE3D5] text-[10px] font-extrabold text-[#181614]">
            {zoomLevel <= 6 ? 'India Overview (States)' : zoomLevel <= 9 ? 'District Boundaries' : 'Food Rescue Pins'}
          </span>
        </div>
      </div>

      {/* Main Header with Search & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#181614] font-['Outfit'] flex items-center gap-2">
            <span>Food Surplus Redistribution Map</span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
              Survey of India Administrative Dataset
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#645F5B] mt-1">
            Explore 35 States & Union Territories, 594 Districts, and real-time community food donations across India.
          </p>
        </div>

        {/* Action Controls & Locate Me */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Locate Me Button */}
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#166534] shadow-warm-sm active:scale-95 transition-all cursor-pointer"
            title="Detect GPS location and zoom map"
          >
            <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting...' : 'Locate Me (GPS)'}</span>
          </button>

          {/* Reset India View */}
          <button
            onClick={handleResetToIndia}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[#181614] bg-white border border-[#EDE3D5] hover:bg-[#FAF5EB] shadow-xs transition-colors cursor-pointer"
          >
            <span>🇮🇳 Full India View</span>
          </button>

          {/* Layer toggles */}
          <div className="flex items-center bg-white border border-[#EDE3D5] rounded-full p-1 shadow-xs text-xs">
            <button
              onClick={() => setShowStateBorders(!showStateBorders)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                showStateBorders
                  ? 'bg-[#E03E26] text-white'
                  : 'text-[#645F5B] hover:text-[#181614]'
              }`}
            >
              States
            </button>
            <button
              onClick={() => setShowDistrictBorders(!showDistrictBorders)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                showDistrictBorders
                  ? 'bg-[#D97706] text-white'
                  : 'text-[#645F5B] hover:text-[#181614]'
              }`}
            >
              Districts
            </button>
          </div>
        </div>
      </div>

      {/* Indian Metro Hub Presets & Unified Search Bar */}
      <div className="bg-white rounded-2xl border-2 border-[#EDE3D5] p-3 sm:p-4 shadow-warm-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Hub pills (100% Indian Hubs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#8C827A] mr-1 shrink-0 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#E03E26]" />
            <span>Hubs:</span>
          </span>

          {INDIAN_HUBS.map((hub) => (
            <button
              key={hub.id}
              onClick={() => handleSelectHub(hub)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedHub === hub.id
                  ? 'bg-[#181614] text-white shadow-xs'
                  : 'bg-[#F5EFEB] text-[#645F5B] hover:bg-[#EADFCF]'
              }`}
            >
              {hub.name}
            </button>
          ))}
        </div>

        {/* State & District Search Bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#8C827A] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => setIsSearchDropdownOpen(true)}
              placeholder="Search State or District (e.g. Pune, Jaipur)..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#FAF5EB] border border-[#EDE3D5] rounded-full text-[#181614] placeholder-[#8C827A] focus:outline-none focus:ring-2 focus:ring-[#E03E26]/40 focus:border-[#E03E26]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchDropdownOpen(false);
                }}
                className="absolute right-2.5 p-1 rounded-full text-[#8C827A] hover:text-[#181614]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchDropdownOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#EDE3D5] rounded-2xl shadow-warm-md z-[1000] overflow-hidden max-h-64 overflow-y-auto">
              {searchResults.map((res, idx) => (
                <button
                  key={`${res.type}-${res.name}-${idx}`}
                  onClick={() => handleSelectSearchResult(res)}
                  className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-[#FAF5EB] transition-colors flex items-center justify-between border-b border-[#FAF5EB] last:border-0"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm">
                      {res.type === 'state' ? '🏛️' : res.type === 'district' ? '📍' : '🍲'}
                    </span>
                    <div>
                      <p className="font-extrabold text-[#181614] truncate">{res.name}</p>
                      <p className="text-[10px] text-[#645F5B]">
                        {res.type === 'state'
                          ? `${res.districtCount} Districts in State`
                          : res.type === 'district'
                          ? `District in ${res.stateName}`
                          : res.stateName}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                    res.type === 'state'
                      ? 'bg-[#FEE2E2] text-[#B91C1C]'
                      : res.type === 'district'
                      ? 'bg-[#FEF3C7] text-[#B45309]'
                      : 'bg-[#DCFCE7] text-[#15803D]'
                  }`}>
                    {res.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Category & Dietary Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white rounded-2xl border border-[#EDE3D5] p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-[#8C827A] uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#E03E26]" />
            <span>Category:</span>
          </span>
          {['ALL', 'Cooked Meals', 'Bakery', 'Fresh Produce', 'Packaged'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#E03E26] text-white shadow-xs'
                  : 'bg-[#FAF5EB] border border-[#EDE3D5] text-[#645F5B] hover:text-[#181614]'
              }`}
            >
              {cat === 'ALL' ? 'All Types' : cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#FAF5EB] border border-[#EDE3D5] p-1 rounded-full text-xs">
            {['ALL', 'VEGETARIAN', 'VEGAN', 'NON_VEGETARIAN'].map((diet) => (
              <button
                key={diet}
                onClick={() => setDietaryFilter(diet)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  dietaryFilter === diet
                    ? 'bg-[#181614] text-white shadow-xs'
                    : 'text-[#645F5B] hover:text-[#181614]'
                }`}
              >
                {diet === 'ALL' ? 'All Diets' : diet === 'NON_VEGETARIAN' ? 'Non-Veg' : diet === 'VEGETARIAN' ? 'Veg' : 'Vegan'}
              </button>
            ))}
          </div>

          {onOpenPostModal && (
            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#E03E26] to-[#F26419] hover:from-[#C8321C] hover:to-[#E04F36] shadow-warm-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Share Surplus Food</span>
            </button>
          )}
        </div>
      </div>

      {/* Active State / District Selection Bar */}
      {activeState && (
        <div className="bg-gradient-to-r from-[#FAF5EB] via-white to-[#FAF5EB] border-2 border-[#E03E26]/30 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-warm-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E03E26]/10 text-[#E03E26] flex items-center justify-center text-lg font-black shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-[#181614] font-['Outfit']">
                  {activeState}
                </h3>
                <span className="text-[11px] font-extrabold bg-[#E03E26] text-white px-2 py-0.5 rounded-full">
                  {stateDistrictCounts[activeState] || 'All'} Districts
                </span>
              </div>
              <p className="text-xs text-[#645F5B] mt-0.5">
                District boundaries active. Click any district polygon below to inspect volunteer activity and available batches.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveState(null);
                setActiveDistrict(null);
              }}
              className="px-3 py-1.5 rounded-full bg-[#F5EFEB] hover:bg-[#EADFCF] text-xs font-bold text-[#181614] transition-colors cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Main Map Container */}
      <div className="h-[640px] w-full rounded-[32px_14px_32px_14px] overflow-hidden border-2 border-[#EDE3D5] shadow-warm-md relative z-10">
        
        <MapContainer
          center={INDIA_DEFAULT_CENTER}
          zoom={INDIA_DEFAULT_ZOOM}
          minZoom={4}
          maxZoom={18}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          {/* Synchronizer for Zoom-based Rendering */}
          <MapStateSynchronizer
            onZoomChange={(newZoom) => setZoomLevel(newZoom)}
            targetFlyTo={targetFlyTo}
            onFlyComplete={() => setTargetFlyTo(null)}
          />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Level 1: Indian State Boundaries */}
          {showStateBorders && statesGeoJson && (
            <GeoJSON
              key={`states-layer-${activeState || 'all'}-${zoomLevel <= 6 ? 'visible' : 'dim'}`}
              data={statesGeoJson}
              style={getStateStyle}
              onEachFeature={onEachStateFeature}
            />
          )}

          {/* Level 2: Indian District Boundaries (Visible on State Selection or Medium Zoom >= 7) */}
          {showDistrictBorders && (activeState || zoomLevel >= 7) && activeDistrictFeatures.length > 0 && (
            <GeoJSON
              key={`districts-layer-${activeState || 'zoom'}-${activeDistrictFeatures.length}`}
              data={{ type: 'FeatureCollection', features: activeDistrictFeatures }}
              style={getDistrictStyle}
              onEachFeature={onEachDistrictFeature}
            />
          )}

          {/* User Location Radar Marker */}
          {userCoords && userCoords.latitude && userCoords.longitude && (
            <Marker
              position={[userCoords.latitude, userCoords.longitude]}
              icon={createUserMarkerIcon()}
            >
              <Popup>
                <div className="p-2 text-center space-y-1">
                  <p className="text-xs font-black text-[#16A34A] flex items-center justify-center gap-1">
                    <span>📍 Your Live Location</span>
                  </p>
                  <p className="text-[10px] text-stone-500">Live GPS Coordinates Active</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Level 3: Food Rescue Location Markers */}
          {mapFilteredListings.map((item) => {
            if (!item.latitude || !item.longitude) return null;

            const timeLeft = formatTimeRemaining(item.availableUntil);

            return (
              <Marker
                key={item.id}
                position={[item.latitude, item.longitude]}
                icon={createFoodMarkerIcon(item.category, item.foodType)}
              >
                <Popup className="food-map-popup">
                  <div className="p-1 max-w-[270px] space-y-2">
                    <div className="relative">
                      <img
                        src={
                          item.imageUrl ||
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={item.foodName}
                        className="w-full h-32 object-cover rounded-xl border border-[#EDE3D5]"
                      />
                      {timeLeft && (
                        <span className="absolute top-2 right-2 text-[10px] font-black bg-black/75 text-white px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-amber-400" />
                          <span>{timeLeft}</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FAF5EB] text-[#E03E26] border border-[#EDE3D5]">
                          {item.category || 'Surplus'}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          item.foodType === 'VEGAN'
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : item.foodType === 'VEGETARIAN'
                            ? 'bg-[#FEF3C7] text-[#B45309]'
                            : 'bg-[#FEE2E2] text-[#B91C1C]'
                        }`}>
                          {item.foodType === 'NON_VEGETARIAN' ? 'Non-Veg' : item.foodType || 'Veg'}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-[#181614] mt-1.5 font-['Outfit'] line-clamp-1 leading-snug">
                        {item.foodName}
                      </h4>
                      <p className="text-xs text-[#645F5B] mt-0.5">
                        🍱 <strong>{item.servings}</strong> portions • {item.quantity}
                      </p>
                    </div>

                    <div className="text-[11px] text-[#8C827A] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E03E26] shrink-0" />
                      <span className="truncate">{item.approximateArea || item.pickupLocation || 'Local donor'}</span>
                    </div>

                    <div className="pt-1 flex gap-2">
                      <button
                        onClick={() => onSelectListing && onSelectListing(item)}
                        className="flex-1 py-1.5 px-3 rounded-full text-xs font-bold text-[#181614] bg-[#F5EFEB] hover:bg-[#EADFCF] transition-colors cursor-pointer text-center"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => onClaimListing && onClaimListing(item)}
                        className="flex-1 py-1.5 px-3 rounded-full text-xs font-black text-white bg-[#E03E26] hover:bg-[#C8321C] transition-colors cursor-pointer text-center shadow-warm-sm"
                      >
                        Claim Rescue
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Interactive District Details Card if Selected */}
        {selectedDistrictModal && (
          <div className="absolute top-4 left-4 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 border-2 border-[#EDE3D5] shadow-warm-md z-[500] space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  District Profile
                </span>
                <h3 className="text-lg font-black text-[#181614] font-['Outfit'] mt-1">
                  {selectedDistrictModal.name}
                </h3>
                <p className="text-xs text-[#645F5B]">
                  State: <strong>{selectedDistrictModal.state}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedDistrictModal(null)}
                className="p-1 rounded-full text-[#8C827A] hover:text-[#181614] hover:bg-[#FAF5EB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF5EB] border border-[#EDE3D5]">
                <p className="text-[10px] text-[#8C827A] font-bold">Food Batches</p>
                <p className="text-sm font-black text-[#E03E26] mt-0.5">
                  {selectedDistrictModal.listings?.length || 0} Available
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF5EB] border border-[#EDE3D5]">
                <p className="text-[10px] text-[#8C827A] font-bold">Active Donors</p>
                <p className="text-sm font-black text-[#16A34A] mt-0.5">
                  {selectedDistrictModal.activeDonors || 4} Verified
                </p>
              </div>
            </div>

            <div className="text-xs text-[#645F5B] flex items-center gap-1.5 bg-[#FAF5EB] p-2 rounded-xl">
              <Activity className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
              <span>Rescue Activity: <strong>{selectedDistrictModal.status}</strong></span>
            </div>

            {selectedDistrictModal.listings && selectedDistrictModal.listings.length > 0 ? (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-extrabold text-[#181614]">Available Rescue Batches:</p>
                {selectedDistrictModal.listings.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-xl bg-white border border-[#EDE3D5] flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-[#181614] truncate mr-2">{item.foodName}</span>
                    <button
                      onClick={() => onClaimListing && onClaimListing(item)}
                      className="px-2.5 py-1 rounded-full text-[10px] font-black text-white bg-[#E03E26] hover:bg-[#C8321C] shrink-0"
                    >
                      Claim
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-1">
                <p className="text-[11px] text-[#8C827A]">
                  No active pickups right in this district center.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
