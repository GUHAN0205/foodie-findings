import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  HeartHandshake,
  Clock,
  MapPin,
  CheckCircle2,
  Bike,
  AlertCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  Check,
  RefreshCw,
  Phone,
  Sparkles,
} from 'lucide-react';

export default function PickupMissionsView({ onOpenAuthModal }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState('claimed'); // 'claimed' or 'incoming'
  const [claimedPickups, setClaimedPickups] = useState([]);
  const [incomingPickups, setIncomingPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMissions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [claimed, incoming] = await Promise.all([
        api.pickups.getMyPickups().catch(() => []),
        api.pickups.getDonorIncoming().catch(() => []),
      ]);
      setClaimedPickups(claimed);
      setIncomingPickups(incoming);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const handleStatusChange = async (pickupId, newStatus, isCompleted = false) => {
    try {
      await api.pickups.updateStatus(pickupId, newStatus);
      showToast(`Mission updated to ${newStatus.replace('_', ' ')}!`, 'success');
      
      if (isCompleted || newStatus === 'COMPLETED') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      fetchMissions();
    } catch (err) {
      showToast(err.message || 'Failed to update mission status', 'error');
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-20 h-20 rounded-[24px_10px_24px_10px] bg-gradient-to-tr from-[#E03E26]/10 to-[#F26419]/10 text-[#E03E26] flex items-center justify-center mx-auto shadow-warm-sm border border-[#EDE3D5]">
          <HeartHandshake className="w-10 h-10 stroke-[2.2]" />
        </div>
        <h2 className="text-3xl font-black text-[#181614] font-['Outfit']">Active Rescue Missions</h2>
        <p className="text-sm text-[#645F5B] max-w-md mx-auto leading-relaxed">
          Sign in or switch to a demo role (e.g. Courier Alex or Hope Harbor NGO) to track and manage live surplus food pickups and verify deliveries.
        </p>
        <button
          onClick={onOpenAuthModal}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E03E26] to-[#F26419] text-white text-sm font-extrabold shadow-warm-md hover:shadow-warm-lg active:scale-95 transition-all cursor-pointer"
        >
          Sign In / Select Demo Profile
        </button>
      </div>
    );
  }

  const currentList = activeSubTab === 'claimed' ? claimedPickups : incomingPickups;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#181614] font-['Outfit'] flex items-center gap-3">
            <span>Rescue Missions & Pickups</span>
            <span className="text-xs bg-[#DCFCE7] text-[#15803D] font-extrabold px-3 py-1 rounded-full border border-[#BBF7D0]">
              Live Tracker
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#645F5B] mt-1">
            Manage scheduled claims, live dispatch status, and verified community handoffs.
          </p>
        </div>

        <button
          onClick={fetchMissions}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[#181614] bg-white border border-[#EDE3D5] hover:bg-[#FAF5EB] shadow-warm-sm transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Missions</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-[#FAF5EB] rounded-full border border-[#EDE3D5] max-w-md">
        <button
          onClick={() => setActiveSubTab('claimed')}
          className={`flex-1 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
            activeSubTab === 'claimed'
              ? 'bg-[#181614] text-white shadow-xs'
              : 'text-[#645F5B] hover:text-[#181614]'
          }`}
        >
          My Claimed Pickups ({claimedPickups.length})
        </button>
        <button
          onClick={() => setActiveSubTab('incoming')}
          className={`flex-1 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
            activeSubTab === 'incoming'
              ? 'bg-[#181614] text-white shadow-xs'
              : 'text-[#645F5B] hover:text-[#181614]'
          }`}
        >
          Incoming Donor Requests ({incomingPickups.length})
        </button>
      </div>

      {/* Missions Cards List */}
      {loading ? (
        <div className="py-16 text-center text-stone-400 text-sm">Loading rescue missions...</div>
      ) : currentList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#F2E8DC] space-y-3">
          <HeartHandshake className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-700 font-['Outfit']">
            No missions in this category
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {activeSubTab === 'claimed'
              ? 'Explore the surplus feed to claim active food items before they expire!'
              : 'When volunteers or food banks claim your donated surplus, their requests will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map((pickup) => (
            <div
              key={pickup.id}
              className="bg-white rounded-3xl p-6 border border-[#F2E8DC] shadow-sm hover:shadow-md transition-all space-y-5"
            >
              
              {/* Header: Food Name & Current Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {pickup.category || 'Surplus'}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 font-['Outfit']">
                      {pickup.foodName}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Portions: <strong>{pickup.servings} servings</strong> | ETA:{' '}
                    <strong>{pickup.estimatedArrivalMinutes || 30} mins</strong> ({pickup.vehicleType || 'Standard'})
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      pickup.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : pickup.status === 'IN_TRANSIT'
                        ? 'bg-sky-100 text-sky-800 border border-sky-200 animate-pulse'
                        : pickup.status === 'ACCEPTED'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    ● {pickup.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-2">
                <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
                  
                  {/* Step 1: Requested */}
                  <div className="space-y-1">
                    <div className="h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-stone-700">1. Requested</span>
                  </div>

                  {/* Step 2: Accepted */}
                  <div className="space-y-1">
                    <div
                      className={`h-2 rounded-full ${
                        ['ACCEPTED', 'IN_TRANSIT', 'COMPLETED'].includes(pickup.status)
                          ? 'bg-emerald-500'
                          : 'bg-stone-200'
                      }`}
                    ></div>
                    <span
                      className={
                        ['ACCEPTED', 'IN_TRANSIT', 'COMPLETED'].includes(pickup.status)
                          ? 'text-stone-700'
                          : 'text-stone-400'
                      }
                    >
                      2. Confirmed
                    </span>
                  </div>

                  {/* Step 3: In Transit */}
                  <div className="space-y-1">
                    <div
                      className={`h-2 rounded-full ${
                        ['IN_TRANSIT', 'COMPLETED'].includes(pickup.status)
                          ? 'bg-emerald-500'
                          : 'bg-stone-200'
                      }`}
                    ></div>
                    <span
                      className={
                        ['IN_TRANSIT', 'COMPLETED'].includes(pickup.status)
                          ? 'text-stone-700'
                          : 'text-stone-400'
                      }
                    >
                      3. In Transit
                    </span>
                  </div>

                  {/* Step 4: Completed */}
                  <div className="space-y-1">
                    <div
                      className={`h-2 rounded-full ${
                        pickup.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-stone-200'
                      }`}
                    ></div>
                    <span
                      className={
                        pickup.status === 'COMPLETED' ? 'text-emerald-700' : 'text-stone-400'
                      }
                    >
                      4. Delivered
                    </span>
                  </div>

                </div>
              </div>

              {/* Mission Details & Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-[#E04F36]" />
                    <span className="font-semibold text-stone-900">Pickup Address:</span>
                  </div>
                  <p className="pl-5 text-stone-700 font-medium">{pickup.pickupLocation}</p>

                  {pickup.notes && (
                    <p className="pl-5 text-stone-500 italic">Notes: "{pickup.notes}"</p>
                  )}
                </div>

                <div className="space-y-1.5 sm:border-l sm:border-stone-200 sm:pl-4">
                  <p className="font-semibold text-stone-900">
                    {activeSubTab === 'claimed' ? 'Donor Contact:' : 'Courier / Claimant:'}
                  </p>
                  <p className="text-stone-700">
                    {activeSubTab === 'claimed'
                      ? pickup.donorName || 'Verified Donor'
                      : pickup.requester ? pickup.requester.name : 'Courier Alex'}
                  </p>
                  {(pickup.donorPhone || (pickup.requester && pickup.requester.phone)) && (
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{pickup.donorPhone || (pickup.requester && pickup.requester.phone)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                
                {/* Donor Actions on Pending */}
                {activeSubTab === 'incoming' && pickup.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(pickup.id, 'ACCEPTED')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow transition-all cursor-pointer"
                    >
                      Accept Pickup Request
                    </button>
                    <button
                      onClick={() => handleStatusChange(pickup.id, 'REJECTED')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 border border-stone-200 transition-colors"
                    >
                      Decline
                    </button>
                  </>
                )}

                {/* Volunteer Actions */}
                {activeSubTab === 'claimed' && pickup.status === 'ACCEPTED' && (
                  <button
                    onClick={() => handleStatusChange(pickup.id, 'IN_TRANSIT')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow transition-all cursor-pointer"
                  >
                    <Truck className="w-4 h-4" />
                    Start Journey (In Transit)
                  </button>
                )}

                {/* Confirm Delivery / Completion */}
                {pickup.status === 'IN_TRANSIT' && (
                  <button
                    onClick={() => handleStatusChange(pickup.id, 'COMPLETED', true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Delivery & Complete Rescue!
                  </button>
                )}

                {pickup.status === 'COMPLETED' && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Food Rescued & Safely Delivered</span>
                  </div>
                )}

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
