import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { pickupApi, foodApi, donationApi } from '../../services/api';
import confetti from 'canvas-confetti';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const { coords } = useLocation();

  const [myRequests, setMyRequests] = useState([]);
  const [nearbyListings, setNearbyListings] = useState([]);
  const [completedDonations, setCompletedDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteerData = async () => {
    try {
      setLoading(true);
      const params = coords ? { lat: coords.latitude, lon: coords.longitude, radiusKm: 20 } : {};
      const [requestsRes, nearbyRes, donationsRes] = await Promise.all([
        pickupApi.getMyRequests(),
        foodApi.getListings(params),
        donationApi.getMy()
      ]);
      setMyRequests(requestsRes.data || []);
      setNearbyListings((nearbyRes.data || []).slice(0, 4));
      setCompletedDonations(donationsRes.data || []);
    } catch (err) {
      console.error("Failed to load volunteer data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteerData();
  }, [coords]);

  const handleCompleteDelivery = async (requestId) => {
    try {
      await pickupApi.completePickup(requestId);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      fetchVolunteerData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete pickup");
    }
  };

  const totalMealsDelivered = completedDonations.reduce((acc, d) => acc + (d.servings || 0), 0);
  const activeAssignedPickups = myRequests.filter(r => r.status === 'ACCEPTED');

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2d9cd] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#f97316]">
            Volunteer Rescue Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] font-serif">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            Track your active collections, view unlocked donor directions, and monitor your impact.
          </p>
        </div>
        <Link
          to="/find-food"
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#e23744] to-[#f97316] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center space-x-1.5 shrink-0"
        >
          <span>Discover Food Ready for Rescue</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">🍱 Meals Delivered</p>
          <p className="text-2xl font-black text-[#1e293b] mt-1">{totalMealsDelivered}</p>
          <p className="text-[10px] text-[#64748b]">To local shelters & people</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">🚚 Completed Pickups</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{completedDonations.length}</p>
          <p className="text-[10px] text-[#64748b]">Successful transports</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">📍 Active Assigned</p>
          <p className="text-2xl font-black text-[#f97316] mt-1">{activeAssignedPickups.length}</p>
          <p className="text-[10px] text-[#64748b]">Ready for collection</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">⭐ Community Rank</p>
          <p className="text-2xl font-black text-blue-600 mt-1">Food Champion</p>
          <p className="text-[10px] text-[#64748b]">Active verified volunteer</p>
        </div>
      </div>

      {/* Active Assigned Pickups (UNLOCKED ADDRESS & PHONE) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-emerald-500/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#f1ede6] pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              🚚
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1e293b]">
                Active Accepted Pickups ({activeAssignedPickups.length})
              </h2>
              <p className="text-xs text-[#64748b]">The donor approved your request. Full address and phone unlocked.</p>
            </div>
          </div>
        </div>

        {activeAssignedPickups.length === 0 ? (
          <p className="text-xs text-[#94a3b8] py-4 text-center">
            No active pickups currently waiting. Explore the surplus map to request food collection.
          </p>
        ) : (
          <div className="space-y-4">
            {activeAssignedPickups.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Collection Authorized
                    </span>
                    <h3 className="text-lg font-bold text-[#1e293b] mt-1">{req.foodName}</h3>
                    <p className="text-xs text-[#64748b]">{req.servings} Servings • Qty: {req.quantity}</p>
                  </div>
                  <button
                    onClick={() => handleCompleteDelivery(req.id)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Collected & Delivered 🎉</span>
                  </button>
                </div>

                {/* Unlocked Donor Details Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white rounded-xl border border-emerald-200 text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-[#1e293b] flex items-center">
                      <MapPin className="w-3.5 h-3.5 text-[#e23744] mr-1" />
                      Unlocked Pickup Address:
                    </p>
                    <p className="text-[#475569]">{req.pickupLocation}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${req.latitude},${req.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#e23744] font-bold hover:underline inline-flex items-center pt-1"
                    >
                      <span>Open in Navigation</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-[#1e293b] flex items-center">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                      Donor Contact Handoff:
                    </p>
                    <p className="text-[#475569]">Donor: {req.donorName}</p>
                    {req.donorPhone && (
                      <p className="font-bold text-emerald-700">Phone: {req.donorPhone}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#1e293b] border-b border-[#f1ede6] pb-3">
          My Sent Requests Awaiting Approval
        </h2>
        {myRequests.filter(r => r.status === 'PENDING').length === 0 ? (
          <p className="text-xs text-[#94a3b8] py-4 text-center">
            No pending requests currently waiting for donor review.
          </p>
        ) : (
          <div className="space-y-3">
            {myRequests.filter(r => r.status === 'PENDING').map((r) => (
              <div key={r.id} className="p-3.5 rounded-xl bg-[#faf7f2] border border-[#e2d9cd] flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#1e293b]">{r.foodName}</p>
                  <p className="text-[#64748b]">Donor: {r.donorName} • {r.servings} servings</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg">
                  Pending Donor Confirmation
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nearby Surplus Preview */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f1ede6] pb-3">
          <h2 className="text-base font-bold text-[#1e293b]">Nearby Surplus Ready for Pickup</h2>
          <Link to="/find-food" className="text-xs font-bold text-[#e23744] hover:underline">
            View All Map Results &gt;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nearbyListings.map((l) => (
            <div key={l.id} className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#e2d9cd] flex items-center space-x-3">
              <img
                src={l.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"}
                alt={l.foodName}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-[#1e293b] truncate">{l.foodName}</h4>
                <p className="text-[11px] text-[#64748b]">{l.servings} Servings • {l.formattedDistance || 'Nearby'}</p>
                <Link to={`/food/${l.id}`} className="text-xs font-bold text-[#e23744] hover:underline">
                  View & Request &gt;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default VolunteerDashboard;
