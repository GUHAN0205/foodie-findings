import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { foodApi, pickupApi } from '../services/api';
import ReportModal from '../components/ReportModal';
import { 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  Unlock,
  ShieldAlert,
  Sparkles,
  Heart
} from 'lucide-react';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { coords } = useLocation();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pickup Request Modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [volunteerNotes, setVolunteerNotes] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Report Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const params = coords ? { lat: coords.latitude, lon: coords.longitude } : {};
        const res = await foodApi.getListingById(id, params);
        setListing(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load food listing details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, coords]);

  const handlePickupSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSubmittingRequest(true);
      await pickupApi.requestPickup({
        foodListingId: listing.id,
        volunteerNotes: volunteerNotes.trim() || undefined,
      });
      setRequestSuccess(true);
      // Reload listing details to update status
      const params = coords ? { lat: coords.latitude, lon: coords.longitude } : {};
      const res = await foodApi.getListingById(id, params);
      setListing(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit pickup request");
    } finally {
      setSubmittingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#e23744] border-t-transparent animate-spin mx-auto"></div>
        <p className="text-sm text-[#64748b]">Verifying real surplus listing coordinates...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4 bg-white rounded-3xl border border-[#e2d9cd] p-8 my-10">
        <span className="text-4xl">🍽️</span>
        <h2 className="text-xl font-bold text-[#1e293b] font-serif">Food Listing Not Found</h2>
        <p className="text-xs text-[#64748b]">
          {error || "This meal has either reached its destination or is no longer active."}
        </p>
        <Link
          to="/find-food"
          className="inline-block px-5 py-2.5 text-xs font-bold text-white bg-[#e23744] rounded-xl"
        >
          Discover Available Surplus
        </Link>
      </div>
    );
  }

  const isExpiring = listing.isExpiringSoon || (listing.minutesRemaining && listing.minutesRemaining <= 60);
  const isDonorOwner = user && listing.donorId === user.id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-xs font-bold text-[#64748b] hover:text-[#1e293b] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to listings</span>
        </button>

        <button
          onClick={() => setReportModalOpen(true)}
          className="flex items-center space-x-1 text-xs text-[#94a3b8] hover:text-red-600 transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Report Listing</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Food Image & Photos */}
        <div className="lg:col-span-7 space-y-5">
          <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-[#e2d9cd] bg-[#f1ede6]">
            <img
              src={listing.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&q=80"}
              alt={listing.foodName}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-black/60 backdrop-blur-md text-white">
                {listing.category}
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/95 backdrop-blur-md text-[#1e293b]">
                {listing.foodType === 'VEGETARIAN' ? '🟢 Vegetarian' : (listing.foodType === 'VEGAN' ? '🌱 Vegan' : '🔴 Non-Vegetarian')}
              </span>
            </div>

            {listing.formattedDistance && (
              <div className="absolute bottom-4 left-4">
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-[#1e293b] shadow-lg">
                  <MapPin className="w-4 h-4 text-[#e23744] mr-1.5" />
                  {listing.formattedDistance} from you
                </span>
              </div>
            )}

            {isExpiring && (
              <div className="absolute top-4 right-4 animate-pulse">
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-lg">
                  <Clock className="w-4 h-4 mr-1.5" />
                  Expiring Soon!
                </span>
              </div>
            )}
          </div>

          {/* Description & Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-5">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                Surplus Food Overview
              </h2>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] font-serif">
                {listing.foodName}
              </h1>
              {listing.eventType && (
                <p className="text-xs text-[#e23744] font-semibold mt-1">
                  Generated from: {listing.eventType}
                </p>
              )}
            </div>

            {listing.description && (
              <p className="text-sm text-[#475569] leading-relaxed">
                {listing.description}
              </p>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-y border-[#f1ede6]">
              <div className="bg-[#faf7f2] p-3 rounded-2xl">
                <p className="text-[10px] text-[#94a3b8] uppercase font-bold">Estimated Servings</p>
                <p className="text-base font-black text-[#1e293b] mt-0.5">{listing.servings} people</p>
              </div>
              <div className="bg-[#faf7f2] p-3 rounded-2xl">
                <p className="text-[10px] text-[#94a3b8] uppercase font-bold">Total Quantity</p>
                <p className="text-base font-black text-[#1e293b] mt-0.5 truncate">{listing.quantity}</p>
              </div>
              <div className="bg-[#faf7f2] p-3 rounded-2xl col-span-2 sm:col-span-1">
                <p className="text-[10px] text-[#94a3b8] uppercase font-bold">Status</p>
                <p className="text-base font-black text-emerald-600 mt-0.5">{listing.status}</p>
              </div>
            </div>

            {/* Storage & Allergens */}
            <div className="space-y-3 text-xs">
              {listing.storageCondition && (
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-[#1e293b] shrink-0">Storage Condition:</span>
                  <span className="text-[#64748b]">{listing.storageCondition}</span>
                </div>
              )}
              {listing.allergens && (
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-[#1e293b] shrink-0">Allergens:</span>
                  <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{listing.allergens}</span>
                </div>
              )}
              {listing.specialInstructions && (
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-[#1e293b] shrink-0">Special Instructions:</span>
                  <span className="text-[#64748b]">{listing.specialInstructions}</span>
                </div>
              )}
            </div>

            {/* Mandatory Food Safety Disclaimer (Section 20 & 22) */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start space-x-3 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Food Safety Notice:</strong> Only accept food that is safe and suitable for redistribution. Please follow applicable local food safety handling and temperature guidelines upon collection.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Pickup Coordination & Donor Card */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pickup Action Box */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e2d9cd] shadow-md space-y-6">
            
            {/* Expiry Window Countdown */}
            <div className="space-y-1 bg-[#faf7f2] p-4 rounded-2xl border border-[#e2d9cd]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#475569]">Available Window</span>
                <span className="font-bold text-[#e23744]">
                  {listing.minutesRemaining !== null ? `${listing.minutesRemaining} mins left` : 'Active'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Valid until {listing.availableUntil ? new Date(listing.availableUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Expiry'}
              </p>
            </div>

            {/* Privacy-gated Location Box (Section 24) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1e293b]">Pickup Location</span>
                {listing.isAuthorizedForPickup ? (
                  <span className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    <Unlock className="w-3 h-3 mr-1" />
                    Unlocked
                  </span>
                ) : (
                  <span className="flex items-center text-[11px] font-bold text-[#64748b] bg-gray-100 px-2 py-0.5 rounded-lg">
                    <Lock className="w-3 h-3 mr-1" />
                    Privacy Protected
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#e2d9cd] text-xs text-[#475569] space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-[#e23744] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#1e293b]">{listing.approximateArea}</p>
                    <p className="text-[11px] text-[#64748b] mt-0.5">
                      {listing.pickupLocation}
                    </p>
                  </div>
                </div>

                {listing.isAuthorizedForPickup && listing.donorPhone && (
                  <div className="pt-2 border-t border-[#e2d9cd] flex items-center space-x-2 text-emerald-700 font-bold">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Contact Donor: {listing.donorPhone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Request CTA Button / Status Display */}
            <div>
              {isDonorOwner ? (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center text-xs text-blue-800 space-y-2">
                  <p className="font-bold">You are the donor of this listing.</p>
                  <Link
                    to="/dashboard"
                    className="inline-block px-4 py-2 font-bold text-white bg-blue-600 rounded-xl"
                  >
                    View Incoming Requests in Dashboard
                  </Link>
                </div>
              ) : listing.currentUserRequestStatus ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-900 space-y-1">
                  <p className="font-bold">
                    Request Status: {listing.currentUserRequestStatus}
                  </p>
                  <p className="text-[11px]">
                    {listing.currentUserRequestStatus === 'ACCEPTED'
                      ? "Your pickup request was accepted! Donor address is unlocked above."
                      : "Your request is awaiting donor confirmation."}
                  </p>
                </div>
              ) : listing.status !== 'AVAILABLE' && listing.status !== 'EXPIRING_SOON' ? (
                <div className="p-4 rounded-2xl bg-gray-100 text-center text-xs text-[#64748b] font-bold">
                  This listing is currently {listing.status}.
                </div>
              ) : (
                <button
                  onClick={() => setRequestModalOpen(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#e23744] to-[#f97316] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Request Pickup</span>
                  <span className="text-base">🤝</span>
                </button>
              )}
            </div>

          </div>

          {/* Donor Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              Published By
            </h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#e23744]/10 text-[#e23744] flex items-center justify-center font-bold text-base">
                {listing.donorName ? listing.donorName[0] : 'D'}
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-bold text-sm text-[#1e293b]">{listing.donorName}</h4>
                  {listing.donorVerified && (
                    <ShieldCheck className="w-4 h-4 text-[#16a34a]" title="Verified Donor" />
                  )}
                </div>
                <p className="text-xs text-[#64748b]">Food Donor Community Member</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Pickup Request Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e2d9cd] space-y-5 animate-in fade-in zoom-in-95">
            
            {requestSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                  🎉
                </div>
                <h3 className="text-lg font-bold text-[#1e293b]">Pickup Request Sent! 🤝</h3>
                <p className="text-xs text-[#64748b]">
                  We have notified {listing.donorName}. Once they accept, the exact pickup address will appear on this page and in your dashboard.
                </p>
                <button
                  onClick={() => { setRequestSuccess(false); setRequestModalOpen(false); }}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#e23744] rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handlePickupSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1e293b]">Confirm Pickup Request</h3>
                  <p className="text-xs text-[#64748b]">
                    Requesting {listing.servings} servings of "{listing.foodName}"
                  </p>
                </div>

                <div className="p-3 bg-[#faf7f2] rounded-2xl border border-[#e2d9cd] text-xs text-[#475569] space-y-1">
                  <p><strong>Approx. Location:</strong> {listing.approximateArea}</p>
                  <p><strong>Available until:</strong> {new Date(listing.availableUntil).toLocaleTimeString()}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">
                    Volunteer / Organization Notes
                  </label>
                  <textarea
                    value={volunteerNotes}
                    onChange={(e) => setVolunteerNotes(e.target.value)}
                    rows={3}
                    placeholder="e.g. ETA 30 mins, collecting via hatchback car with thermal crate..."
                    className="w-full px-3 py-2 text-xs bg-[#faf7f2] border border-[#e2d9cd] rounded-xl focus:outline-none focus:border-[#e23744]"
                  ></textarea>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(false)}
                    className="flex-1 py-2.5 text-xs font-bold text-[#475569] border border-[#e2d9cd] rounded-xl hover:bg-[#faf7f2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingRequest}
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-[#e23744] hover:bg-[#cb202d] rounded-xl shadow-md disabled:opacity-50"
                  >
                    {submittingRequest ? 'Sending...' : 'Send Request 🤝'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        listingId={listing.id}
        foodName={listing.foodName}
      />

    </div>
  );
};

export default FoodDetails;
