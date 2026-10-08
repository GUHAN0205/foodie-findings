import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { organizationApi, pickupApi, foodApi, donationApi } from '../../services/api';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const NGODashboard = () => {
  const { user } = useAuth();
  const [orgProfile, setOrgProfile] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit capacity state
  const [capacity, setCapacity] = useState(150);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchNgoData = async () => {
    try {
      setLoading(true);
      const [orgRes, reqRes, donRes] = await Promise.all([
        organizationApi.getMy().catch(() => ({ data: null })),
        pickupApi.getMyRequests(),
        donationApi.getMy()
      ]);
      setOrgProfile(orgRes.data);
      if (orgRes.data?.capacity) {
        setCapacity(orgRes.data.capacity);
      }
      setMyRequests(reqRes.data || []);
      setDonations(donRes.data || []);
    } catch (err) {
      console.error("Failed to load NGO data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgoData();
  }, []);

  const handleUpdateCapacity = async (e) => {
    e.preventDefault();
    if (!orgProfile) return;
    try {
      setIsUpdating(true);
      const updated = {
        ...orgProfile,
        capacity: Number(capacity)
      };
      const res = await organizationApi.updateMy(updated);
      setOrgProfile(res.data);
      alert("Organization redistribution capacity updated successfully!");
    } catch (e) {
      alert("Failed to update capacity");
    } finally {
      setIsUpdating(false);
    }
  };

  const isVerified = orgProfile?.verificationStatus === 'VERIFIED';
  const totalMealsReceived = donations.reduce((acc, d) => acc + (d.servings || 0), 0);

  return (
    <div className="space-y-8">
      
      {/* Top Banner with Badge */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2d9cd] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {isVerified ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
                🟢 Verified Organization
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <Clock className="w-3.5 h-3.5 mr-1" />
                🟡 Pending Verification
              </span>
            )}
            <span className="text-xs text-[#94a3b8]">Reg: {orgProfile?.registrationNumber || 'In Review'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] font-serif">
            {orgProfile?.organizationName || user?.name}
          </h1>
          <p className="text-xs text-[#64748b]">
            {orgProfile?.address || user?.location || 'Community Kitchen & Shelter'}
          </p>
        </div>

        <Link
          to="/find-food"
          className="px-6 py-3.5 bg-gradient-to-r from-[#e23744] to-[#f97316] text-white text-xs font-bold rounded-2xl shadow-md hover:opacity-95 transition-all text-center shrink-0"
        >
          Discover Large Meal Batches 🍱
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">🍱 Meals Received</p>
          <p className="text-2xl font-black text-[#1e293b] mt-1">{totalMealsReceived}</p>
          <p className="text-[10px] text-[#64748b]">Distributed to beneficiaries</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">📦 Batch Pickups</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{donations.length}</p>
          <p className="text-[10px] text-[#64748b]">Completed collections</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">👥 Daily Capacity</p>
          <p className="text-2xl font-black text-[#f97316] mt-1">{capacity} servings</p>
          <p className="text-[10px] text-[#64748b]">Serving threshold</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2d9cd] shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8]">🛡️ Status</p>
          <p className="text-xl font-black text-emerald-700 mt-1">
            {orgProfile?.verificationStatus || 'PENDING'}
          </p>
          <p className="text-[10px] text-[#64748b]">Admin clearance</p>
        </div>
      </div>

      {/* Active Food Requests */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#1e293b] border-b border-[#f1ede6] pb-3">
          Our Active Food Requests ({myRequests.length})
        </h2>

        {myRequests.length === 0 ? (
          <p className="text-xs text-[#94a3b8] py-6 text-center">
            No active food requests submitted yet. Use the discovery page to request surplus food for your shelter.
          </p>
        ) : (
          <div className="space-y-3">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e2d9cd] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#1e293b]">{req.foodName}</span>
                    <span className="px-2 py-0.5 rounded bg-white font-bold border border-[#e2d9cd]">
                      {req.servings} Servings
                    </span>
                    <span className={`px-2 py-0.5 font-bold rounded ${
                      req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-[#64748b] mt-1">
                    Donor: {req.donorName}
                    {req.status === 'ACCEPTED' && ` • Phone: ${req.donorPhone} • Pickup: ${req.pickupLocation}`}
                  </p>
                </div>
                <Link
                  to={`/food/${req.foodListingId}`}
                  className="px-4 py-2 bg-white border border-[#e2d9cd] text-[#1e293b] font-bold rounded-xl hover:border-[#e23744] shrink-0 text-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Capacity & Verification Management */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#1e293b] border-b border-[#f1ede6] pb-3">
          Redistribution Capacity Settings
        </h2>
        <form onSubmit={handleUpdateCapacity} className="max-w-md space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">
              Current Meal Handling Capacity (Servings/Day)
            </label>
            <input
              type="number"
              min="10"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#faf7f2] border border-[#e2d9cd] rounded-xl focus:border-[#e23744]"
            />
            <p className="text-[11px] text-[#94a3b8] mt-1">
              Our smart matching algorithm uses this capacity to suggest appropriate batch sizes for your kitchen.
            </p>
          </div>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-4 py-2 bg-[#1e293b] text-white rounded-xl text-xs font-bold hover:bg-[#334155] disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : 'Update Capacity'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default NGODashboard;
