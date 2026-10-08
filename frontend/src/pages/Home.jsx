import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { foodApi, impactApi } from '../services/api';
import FoodCard from '../components/FoodCard';
import { 
  UtensilsCrossed, 
  MapPin, 
  Heart, 
  Users, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Building2,
  CalendarCheck
} from 'lucide-react';

const Home = () => {
  const { coords, locationName, requestLocation } = useLocation();
  const [nearbyPreview, setNearbyPreview] = useState([]);
  const [impactStats, setImpactStats] = useState(null);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoadingListings(true);
        const params = coords ? { lat: coords.latitude, lon: coords.longitude, radiusKm: 25 } : {};
        const [listingsRes, impactRes] = await Promise.all([
          foodApi.getListings(params),
          impactApi.getStats()
        ]);
        setNearbyPreview((listingsRes.data || []).slice(0, 3));
        setImpactStats(impactRes.data || null);
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoadingListings(false);
      }
    };
    loadHomeData();
  }, [coords]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-12">
        {/* Subtle decorative food-inspired blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-100/50 via-rose-100/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#e23744]/10 border border-[#e23744]/20 text-[#e23744] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Fake Data • 100% Real Surplus Redistribution</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1e293b] font-serif leading-[1.15] tracking-tight">
                “Good Food Should Find a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e23744] to-[#f97316]">Good Home.”</span>
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Turn surplus food into meaningful meals. Foodie Findings connects extra food from weddings, marriages, hostels, colleges, and corporate events with verified nearby volunteers and shelters that can put it to immediate good use.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/find-food"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#e23744] to-[#f97316] text-white font-bold text-base shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
                >
                  <span>Find Surplus Food</span>
                  <span className="text-lg">🍱</span>
                </Link>
                <Link
                  to="/share-food"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-[#1e293b] hover:text-[#e23744] font-bold text-base border-2 border-[#e2d9cd] hover:border-[#e23744] shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>Share Extra Food</span>
                  <span className="text-lg">🤝</span>
                </Link>
              </div>

              {/* Real location bar preview */}
              <div className="pt-4 flex items-center justify-center lg:justify-start text-xs text-[#64748b] space-x-2">
                <MapPin className="w-4 h-4 text-[#e23744]" />
                <span>
                  {coords ? `Browsing around: ${locationName || 'Real GPS Active'}` : 'Detecting your location helps calculate exact distances'}
                </span>
                {!coords && (
                  <button
                    onClick={requestLocation}
                    className="text-[#e23744] font-bold underline hover:opacity-80"
                  >
                    Enable Location
                  </button>
                )}
              </div>
            </div>

            {/* Right Hero Visual (Foodie Community Artwork) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                
                {/* Main Card */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl border border-[#e2d9cd] relative z-10 space-y-5">
                  <div className="relative h-56 rounded-2xl overflow-hidden shadow-inner">
                    <img
                      src="https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80"
                      alt="Catering surplus"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                      <div className="text-white">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-600 rounded">
                          Live Banquet Surplus
                        </span>
                        <h4 className="font-bold text-base mt-1">Wedding Feast Biryani & Sides</h4>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#475569] bg-[#faf7f2] p-3 rounded-xl">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-[#f97316]" />
                      <span className="font-bold text-[#1e293b]">65 Servings</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-emerald-700">Freshly Cooked</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-[#e23744]" />
                      <span className="font-bold text-[#1e293b]">1.2 km away</span>
                    </div>
                  </div>

                  {/* Flow indicator */}
                  <div className="text-[11px] font-medium text-[#64748b] text-center bg-amber-50 text-amber-800 p-2.5 rounded-xl border border-amber-200/60 flex items-center justify-center space-x-2">
                    <span>Surplus Banquet</span>
                    <span>→</span>
                    <span className="font-bold text-[#e23744]">Foodie Findings</span>
                    <span>→</span>
                    <span>Nearby Shelter</span>
                  </div>
                </div>

                {/* Floating Badge 1: Community Heart */}
                <div className="absolute -top-6 -right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-[#e2d9cd] flex items-center space-x-2.5 z-20 animate-bounce duration-1000">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-[#e23744] flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94a3b8] font-bold uppercase">Meals Rescued</p>
                    <p className="text-sm font-black text-[#1e293b]">
                      {impactStats?.totalMealsRescued ? `${impactStats.totalMealsRescued}+` : 'Real-Time'}
                    </p>
                  </div>
                </div>

                {/* Floating Badge 2: Verified Pin */}
                <div className="absolute -bottom-6 -left-4 bg-white p-3.5 rounded-2xl shadow-xl border border-[#e2d9cd] flex items-center space-x-2.5 z-20">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#16a34a] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94a3b8] font-bold uppercase">Verified Network</p>
                    <p className="text-sm font-black text-[#1e293b]">
                      {impactStats?.verifiedOrganizationsCount ? `${impactStats.verifiedOrganizationsCount} NGOs` : 'Active'}
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. QUICK ACTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <Link
            to="/share-food"
            className="group p-6 rounded-3xl bg-white border border-[#e2d9cd] hover:border-[#e23744] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#e23744] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-4">
              🍱
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1e293b] group-hover:text-[#e23744] transition-colors">
                Share Extra Food
              </h3>
              <p className="text-xs text-[#64748b] mt-1">
                Post surplus from weddings, caterers, hostels, or family functions.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-[#e23744]">
              <span>List surplus</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/find-food"
            className="group p-6 rounded-3xl bg-white border border-[#e2d9cd] hover:border-[#f97316] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#f97316] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-4">
              🔎
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1e293b] group-hover:text-[#f97316] transition-colors">
                Find Surplus Food
              </h3>
              <p className="text-xs text-[#64748b] mt-1">
                Explore real verified surplus food ready for immediate collection.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-[#f97316]">
              <span>Explore map</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/register?role=VOLUNTEER"
            className="group p-6 rounded-3xl bg-white border border-[#e2d9cd] hover:border-[#16a34a] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16a34a] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-4">
              🤝
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1e293b] group-hover:text-[#16a34a] transition-colors">
                Become a Volunteer
              </h3>
              <p className="text-xs text-[#64748b] mt-1">
                Transport edible food from donors to nearby community shelters.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-[#16a34a]">
              <span>Join community</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/register?role=NGO"
            className="group p-6 rounded-3xl bg-white border border-[#e2d9cd] hover:border-sky-500 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-4">
              🏢
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1e293b] group-hover:text-sky-600 transition-colors">
                Register Organization
              </h3>
              <p className="text-xs text-[#64748b] mt-1">
                Get verified as an authorized shelter or NGO kitchen to receive meal batches.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-sky-600">
              <span>Get badge</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="bg-white py-16 border-y border-[#e2d9cd]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#e23744]">
              Simplicity & Authenticity
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e293b] font-serif">
              How Foodie Findings Works
            </h2>
            <p className="text-sm sm:text-base text-[#64748b]">
              A direct, real-world coordination pipeline from event surplus to people who need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-[#faf7f2] p-6 rounded-3xl border border-[#e2d9cd] space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-[#e23744] text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h3 className="text-lg font-bold text-[#1e293b]">Surplus Food Reported</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                A wedding hall, restaurant, hostel, or event host publishes edible surplus with servings, prep time, and expiration window.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#faf7f2] p-6 rounded-3xl border border-[#e2d9cd] space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-[#f97316] text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h3 className="text-lg font-bold text-[#1e293b]">Real Nearby Discovery</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Volunteers and shelters within range receive alerts and view precise Haversine distance from their real location.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#faf7f2] p-6 rounded-3xl border border-[#e2d9cd] space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h3 className="text-lg font-bold text-[#1e293b]">Pickup Coordination</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Donor approves the pickup request. Exact pickup address and direct contact information are securely unlocked.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#faf7f2] p-6 rounded-3xl border border-[#e2d9cd] space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h3 className="text-lg font-bold text-[#1e293b]">Redistribution & Impact</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Food reaches hungry people safely. The donation is marked complete and recorded directly into live impact statistics.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. NEARBY SURPLUS FOOD PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#e23744] uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              <span>Live Available Surplus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b] font-serif">
              Surplus Meals Ready for Pickup
            </h2>
          </div>
          <Link
            to="/find-food"
            className="mt-4 sm:mt-0 flex items-center text-sm font-bold text-[#e23744] hover:text-[#cb202d]"
          >
            <span>View all listings on map</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loadingListings ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white rounded-3xl border border-[#e2d9cd] animate-pulse"></div>
            ))}
          </div>
        ) : nearbyPreview.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nearbyPreview.map((listing) => (
              <FoodCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#e2d9cd] p-8 max-w-xl mx-auto">
            <span className="text-4xl">🍽️</span>
            <h3 className="text-lg font-bold text-[#1e293b] mt-3 font-serif">
              No surplus food reported in this radius right now
            </h3>
            <p className="text-xs text-[#64748b] mt-1 max-w-sm mx-auto">
              Foodie Findings never invents fake listings to appear full. Check back soon or list surplus from your event.
            </p>
            <div className="mt-4">
              <Link
                to="/share-food"
                className="inline-block px-5 py-2.5 text-xs font-bold bg-[#e23744] text-white rounded-xl"
              >
                Share Extra Food Now
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 5. WHY FOOD RESCUE MATTERS */}
      <section className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white py-16 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f97316]">
              Real-World Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-serif">
              Why Surplus Food Redistribution Matters
            </h2>
            <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
              Every day, tons of fresh, edible, banquet-quality food are discarded after weddings, college festivals, hostel dinners, and corporate parties — not because the food has gone bad, but simply because there was no fast, trusted way to coordinate with people who could collect it.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-[#e2e8f0]">Preserves nutritional dignity for families and shelters</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-[#e2e8f0]">Prevents methane emissions from decomposing landfill organic waste</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-[#e2e8f0]">Protects donor privacy while enabling verified handoffs</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-[#e2e8f0]">Calculates true geographical distances with zero fake pins</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-6">
            <h3 className="font-bold text-lg text-white">Live Platform Impact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-[#94a3b8]">Meals Rescued</p>
                <p className="text-2xl font-black text-[#f97316] mt-1">
                  {impactStats?.totalMealsRescued || 0}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-[#94a3b8]">Food Saved (kg)</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  {impactStats?.totalFoodWeightKg || 0}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-[#94a3b8]">Verified NGOs</p>
                <p className="text-2xl font-black text-sky-400 mt-1">
                  {impactStats?.verifiedOrganizationsCount || 0}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-[#94a3b8]">Active Listings</p>
                <p className="text-2xl font-black text-rose-400 mt-1">
                  {impactStats?.activeListingsCount || 0}
                </p>
              </div>
            </div>
            <Link
              to="/impact"
              className="block w-full py-2.5 text-center text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              Explore Full Impact Report →
            </Link>
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-[#e23744] via-[#ea580c] to-[#f97316] text-white rounded-3xl p-8 sm:p-14 shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif">
            “Don't let surplus food become waste when it can become someone's meal.”
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto">
            Whether you are hosting a wedding, running a hostel dining hall, or want to volunteer with your vehicle, you can make a tangible difference today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/share-food"
              className="px-8 py-3.5 bg-white text-[#e23744] font-bold text-sm rounded-2xl shadow-lg hover:scale-105 transition-all"
            >
              Share Food Now 🍱
            </Link>
            <Link
              to="/find-food"
              className="px-8 py-3.5 bg-black/20 hover:bg-black/30 text-white font-bold text-sm rounded-2xl border border-white/30 backdrop-blur-md transition-all"
            >
              Find Surplus Food 🔎
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
