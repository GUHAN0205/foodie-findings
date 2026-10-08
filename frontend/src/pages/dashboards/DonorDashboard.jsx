import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { foodApi, pickupApi, donationApi } from '../../services/api';
import { 
  PlusCircle, 
  UtensilsCrossed, 
  CheckCircle2, 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  XCircle,
  AlertCircle
} from 'lucide-react';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonorData = async () => {
    try {
      setLoading(true);
      const [listingsRes, requestsRes, donationsRes] = await Promise.all([
        foodApi.getMyDonorListings(),
        pickupApi.getDonorRequests(),
        donationApi.getMy()
      ]);
      setMyListings(listingsRes.data || []);
      setIncomingRequests(requestsRes.data || []);
      setDonations(donationsRes.data || []);
    } catch (err) {
      console.error("Failed to load donor data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      await pickupApi.acceptPickup(requestId);
      fetchDonorData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept pickup request");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await pickupApi.rejectPickup(requestId);
      fetchDonorData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject request");
    }
  };

  const handleCompletePickup = async (requestId) => {
    try {
      await pickupApi.completePickup(requestId);
      fetchDonorData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark as collected");
    }
  };

  const totalMealsShared = donations.reduce((acc, d) => acc + (d.servings || 0), 0);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e2d9cd] shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#e23744]">
            Food Donor Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] font-serif">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            Manage your surplus food listings and review volunteer pickup requests.
          </p>
        </div>
        <Link
          to="/share-food"
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#e23744] to-[#f97316] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center space-x-1.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Share New Surplus Food</span>
        </Link>
      </div>

      {/* Stats Cards (Section 27) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">🍱 Meals Shared</p>
          <p className="text-2xl font-black text-[#1e293b] mt-1">{totalMealsShared}</p>
          <p className="text-[10px] text-[#64748b]">Total servings rescued</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">🤝 Completed Donations</p>
          <p className="text-2xl font-black text-[#e23744] mt-1">{donations.length}</p>
          <p className="text-[10px] text-[#64748b]">Verified handoffs</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">♻️ Active Listings</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {myListings.filter(l => l.status === 'AVAILABLE' || l.status === 'EXPIRING_SOON' || l.status === 'PICKUP_REQUESTED').length}
          </p>
          <p className="text-[10px] text-[#64748b]">Awaiting or coordinating</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">❤️ People Reached</p>
          <p className="text-2xl font-black text-[#f97316] mt-1">{totalMealsShared}</p>
          <p className="text-[10px] text-[#64748b]">Direct meal impact</p>
        </div>
      </div>

      {/* Incoming Pickup Requests Section */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f1ede6] pb-3">
          <h2 className="text-lg font-bold text-[#1e293b]">
            Incoming Pickup Requests ({incomingRequests.filter(r => r.status === 'PENDING' || r.status === 'ACCEPTED').length})
          </h2>
          <span className="text-xs text-[#64748b]">
            Review and approve authorized collectors
          </span>
        </div>

        {incomingRequests.length === 0 ? (
          <p className="text-xs text-[#94a3b8] py-6 text-center">
            No pickup requests received yet. Active listings will appear here when volunteers request them.
          </p>
        ) : (
          <div className="space-y-3">
            {incomingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e2d9cd] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#1e293b]">{req.foodName}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white border border-[#e2d9cd]">
                      {req.servings} Servings
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#475569]">
                    Requested by: <strong>{req.requesterName}</strong> ({req.requesterRole})
                    {req.requesterPhone && ` • Phone: ${req.requesterPhone}`}
                  </p>

                  {req.volunteerNotes && (
                    <p className="text-xs text-[#64748b] italic">
                      “{req.volunteerNotes}”
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  {req.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleAcceptRequest(req.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        Accept & Unlock Address
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-3 py-1.5 bg-white border border-[#e2d9cd] text-[#64748b] hover:text-red-600 rounded-xl text-xs font-medium"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleCompletePickup(req.id)}
                      className="px-4 py-2 bg-gradient-to-r from-[#e23744] to-[#f97316] text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-95"
                    >
                      Confirm Food Collected ✅
                    </button>
                  )}

                  {req.status === 'COLLECTED' && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Donation Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Published Listings Section */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f1ede6] pb-3">
          <h2 className="text-lg font-bold text-[#1e293b]">My Published Listings ({myListings.length})</h2>
          <Link to="/share-food" className="text-xs font-bold text-[#e23744] hover:underline">
            + Add Another
          </Link>
        </div>

        {myListings.length === 0 ? (
          <p className="text-xs text-[#94a3b8] py-8 text-center">
            You haven't listed any surplus food yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myListings.map((listing) => (
              <div key={listing.id} className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e2d9cd] space-y-3">
                <div className="h-32 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={listing.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"}
                    alt={listing.foodName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    listing.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                    listing.status === 'EXPIRING_SOON' ? 'bg-amber-100 text-amber-800' :
                    listing.status === 'COLLECTED' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {listing.status}
                  </span>
                  <h4 className="font-bold text-sm text-[#1e293b] mt-1 line-clamp-1">{listing.foodName}</h4>
                  <p className="text-xs text-[#64748b]">{listing.servings} Servings • {listing.quantity}</p>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#e2d9cd]">
                  <span className="text-[#94a3b8]">
                    {listing.minutesRemaining !== null ? `${listing.minutesRemaining}m left` : 'Expired'}
                  </span>
                  <Link to={`/food/${listing.id}`} className="font-bold text-[#e23744] hover:underline">
                    View &gt;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DonorDashboard;
