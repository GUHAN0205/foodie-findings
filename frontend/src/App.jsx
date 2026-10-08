import { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { LocationProvider, useLocation } from './context/LocationContext';
import { api } from './services/api';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LocationSection from './components/LocationSection';
import DiscoverySection from './components/DiscoverySection';
import ListingCard from './components/ListingCard';
import FoodDetailModal from './components/FoodDetailModal';
import PostFoodModal from './components/PostFoodModal';
import PickupMissionsView from './components/PickupMissionsView';
import ImpactDashboardView from './components/ImpactDashboardView';
import SafetyGuideModal from './components/SafetyGuideModal';
import AuthModal from './components/AuthModal';
import MapView from './components/MapView';
import Footer from './components/Footer';

import FoodIntroAnimation from './components/FoodIntroAnimation';

// Haversine distance helper
function getDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function FoodieApp() {
  const [introFinished, setIntroFinished] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDietary, setSelectedDietary] = useState('ALL');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState('expiry'); // 'expiry', 'servings', 'distance'
  const [selectedRadius, setSelectedRadius] = useState('all'); // '2', '5', '10', 'all'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  // Modals
  const [detailListing, setDetailListing] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  // Real Location from LocationContext
  const { coords, locationName, requestLocation } = useLocation();

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listings.getAll({
        query: searchQuery,
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        foodType: selectedDietary !== 'ALL' ? selectedDietary : undefined,
      });
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Listings fetch error:', err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedDietary]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Client-side filtering & sorting
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Urgent filter: availableUntil is within 2.5 hours
        if (urgentOnly) {
          if (!item.availableUntil) return false;
          const hoursLeft =
            (new Date(item.availableUntil) - new Date()) / (1000 * 60 * 60);
          if (hoursLeft <= 0 || hoursLeft > 2.5) return false;
        }

        // Radius filter: if coordinates available
        if (selectedRadius !== 'all' && coords && item.latitude && item.longitude) {
          const dist = getDistanceKm(
            coords.latitude,
            coords.longitude,
            item.latitude,
            item.longitude
          );
          if (dist !== null && dist > Number(selectedRadius)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance' && coords) {
          const distA = getDistanceKm(
            coords.latitude,
            coords.longitude,
            a.latitude,
            a.longitude
          );
          const distB = getDistanceKm(
            coords.latitude,
            coords.longitude,
            b.latitude,
            b.longitude
          );
          if (distA !== null && distB !== null) return distA - distB;
        }

        if (sortBy === 'servings') {
          return (b.servings || 0) - (a.servings || 0);
        }

        // Default: nearest expiry first
        return (
          new Date(a.availableUntil || '9999-12-31') -
          new Date(b.availableUntil || '9999-12-31')
        );
      });
  }, [listings, urgentOnly, selectedRadius, coords, sortBy]);

  const handleScrollToDiscovery = () => {
    const el = document.getElementById('discovery');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('feed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#181614] font-['Plus_Jakarta_Sans',sans-serif]">
      
      {!introFinished && <FoodIntroAnimation onComplete={() => setIntroFinished(true)} />}

      {/* Floating Modern Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'feed' && (
          <div>
            {/* Redesigned Hero Section */}
            <HeroSection
              onOpenPostModal={() => setIsPostModalOpen(true)}
              onFindFoodClick={handleScrollToDiscovery}
              activeCount={filteredListings.length}
            />

            {/* Location Experience Section */}
            <LocationSection
              selectedRadius={selectedRadius}
              setSelectedRadius={setSelectedRadius}
              viewMode={viewMode}
              setViewMode={setViewMode}
              listingsCount={filteredListings.length}
            />

            {/* Grid or Map Discovery Area */}
            {viewMode === 'map' ? (
              <div className="py-6">
                <MapView
                  listings={filteredListings}
                  userCoords={coords}
                  onSelectListing={(item) => setDetailListing(item)}
                  onClaimListing={(item) => setDetailListing(item)}
                  onOpenPostModal={() => setIsPostModalOpen(true)}
                />
              </div>
            ) : (
              <DiscoverySection
                listings={filteredListings}
                loading={loading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedDietary={selectedDietary}
                setSelectedDietary={setSelectedDietary}
                urgentOnly={urgentOnly}
                setUrgentOnly={setUrgentOnly}
                sortBy={sortBy}
                setSortBy={setSortBy}
                userCoords={coords}
                onSelectListing={(item) => setDetailListing(item)}
                onClaimListing={(item) => setDetailListing(item)}
                onOpenPostModal={() => setIsPostModalOpen(true)}
                onCheckLocation={requestLocation}
              />
            )}
          </div>
        )}

        {activeTab === 'map' && (
          <div className="pt-4">
            <MapView
              listings={listings}
              userCoords={coords}
              onSelectListing={(item) => setDetailListing(item)}
              onClaimListing={(item) => setDetailListing(item)}
              onOpenPostModal={() => setIsPostModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'pickups' && (
          <PickupMissionsView onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        )}

        {activeTab === 'impact' && <ImpactDashboardView />}
      </main>

      {/* Redesigned Footer */}
      <Footer
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        setActiveTab={setActiveTab}
      />

      {/* Modals */}
      {detailListing && (
        <FoodDetailModal
          listing={detailListing}
          onClose={() => setDetailListing(null)}
          onClaimSuccess={() => {
            fetchListings();
            setActiveTab('pickups');
          }}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {isPostModalOpen && (
        <PostFoodModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onCreated={() => {
            fetchListings();
            setActiveTab('feed');
          }}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {isSafetyModalOpen && (
        <SafetyGuideModal
          isOpen={isSafetyModalOpen}
          onClose={() => setIsSafetyModalOpen(false)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <LocationProvider>
          <FoodieApp />
        </LocationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
