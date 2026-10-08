import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import {
  X,
  Clock,
  MapPin,
  UtensilsCrossed,
  ShieldAlert,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Bike,
  Car,
  Truck,
  Footprints,
  Phone,
  Calendar,
} from 'lucide-react';

export default function FoodDetailModal({ listing, onClose, onClaimSuccess, onOpenAuthModal }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [vehicleType, setVehicleType] = useState('Car');
  const [estimatedArrivalMinutes, setEstimatedArrivalMinutes] = useState(30);
  const [notes, setNotes] = useState('');
  const [safetyAgreed, setSafetyAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!listing) return null;

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuthModal();
      return;
    }

    if (!safetyAgreed) {
      showToast('Please confirm adherence to food safety transport guidelines', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.pickups.create({
        foodListingId: listing.id,
        vehicleType,
        estimatedArrivalMinutes: Number(estimatedArrivalMinutes),
        notes: notes.trim(),
      });
      showToast(`Pickup request submitted for "${listing.foodName}"!`, 'success');
      onClaimSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit pickup request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const vehicles = [
    { id: 'Foot / Walking', label: 'Walking', icon: Footprints },
    { id: 'Bicycle / Cargo Bike', label: 'Bicycle', icon: Bike },
    { id: 'Car', label: 'Car', icon: Car },
    { id: 'Van / Truck', label: 'Van / Truck', icon: Truck },
  ];

  const defaultImage =
    listing.imageUrl ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Banner */}
        <div className="relative aspect-[16/8] w-full overflow-hidden bg-stone-100 shrink-0">
          <img
            src={defaultImage}
            alt={listing.foodName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-[#E04F36] text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                {listing.category}
              </span>
              <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                {listing.foodType}
              </span>
              {listing.eventType && (
                <span className="bg-white/20 backdrop-blur-md text-white text-xs px-2.5 py-0.5 rounded-full">
                  {listing.eventType}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit']">{listing.foodName}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Portions</p>
              <p className="text-xl font-bold text-stone-900 font-['Outfit']">{listing.servings} Servings</p>
              <p className="text-[11px] text-stone-500 truncate">{listing.quantity}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Expires In</p>
              <p className="text-xl font-bold text-[#E04F36] font-['Outfit']">
                {listing.availableUntil
                  ? new Date(listing.availableUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Today'}
              </p>
              <p className="text-[11px] text-stone-500">Strict safety cutoff</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Storage</p>
              <p className="text-xs font-bold text-stone-900 mt-1 line-clamp-1">{listing.storageCondition || 'Safe Ambient'}</p>
              <p className="text-[11px] text-stone-500">Handling spec</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Donor</p>
              <p className="text-xs font-bold text-emerald-800 mt-1 truncate">
                {listing.donor ? listing.donor.name : 'Verified Kitchen'}
              </p>
              <p className="text-[11px] text-stone-500">Verified Partner</p>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Description</h4>
              <p className="text-sm text-stone-700 leading-relaxed">{listing.description}</p>
            </div>
          )}

          {/* Allergens & Safety Notice */}
          {listing.allergens && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Allergen Notice:</p>
                <p className="mt-0.5 text-amber-800">{listing.allergens}</p>
              </div>
            </div>
          )}

          {/* Location & Instructions */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#E04F36] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Pickup Location</p>
                <p className="text-sm font-semibold text-stone-900">{listing.pickupLocation}</p>
                {listing.approximateArea && (
                  <p className="text-xs text-stone-500">Area: {listing.approximateArea}</p>
                )}
              </div>
            </div>

            {listing.specialInstructions && (
              <div className="pl-8 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="font-semibold text-stone-800">Special Pickup Instructions: </span>
                {listing.specialInstructions}
              </div>
            )}
          </div>

          {/* Claim / Request Pickup Form */}
          <form onSubmit={handleClaim} className="pt-4 border-t border-stone-100 space-y-4">
            <h4 className="text-base font-bold text-stone-900 font-['Outfit'] flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-[#E04F36]" />
              Schedule Food Rescue Claim
            </h4>

            {/* Vehicle Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">Transport Vehicle Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {vehicles.map((v) => {
                  const Icon = v.icon;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicleType(v.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                        vehicleType === v.id
                          ? 'border-[#E04F36] bg-amber-50/60 text-[#E04F36] shadow-sm'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span>{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Arrival ETA */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Estimated Arrival Time: <span className="text-[#E04F36] font-bold">{estimatedArrivalMinutes} minutes</span>
              </label>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={estimatedArrivalMinutes}
                onChange={(e) => setEstimatedArrivalMinutes(e.target.value)}
                className="w-full accent-[#E04F36] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>10 mins (Immediate)</span>
                <span>30 mins</span>
                <span>60 mins</span>
                <span>2 hours</span>
              </div>
            </div>

            {/* Note to Donor */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Pickup Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Bringing insulated boxes for hot meal transfer..."
                className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36]"
              />
            </div>

            {/* Safety Confirmation Checkbox */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <input
                type="checkbox"
                id="safetyConfirm"
                checked={safetyAgreed}
                onChange={(e) => setSafetyAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-[#E04F36] rounded border-stone-300 focus:ring-[#E04F36] cursor-pointer"
              />
              <label htmlFor="safetyConfirm" className="text-xs text-stone-600 cursor-pointer select-none">
                I agree to collect this surplus in clean, food-safe containers and deliver promptly according to the <strong>Food Safety Handling Protocol</strong>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#E04F36] to-[#F28C38] hover:shadow-xl hover:shadow-[#E04F36]/25 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Submitting Claim...' : user ? 'Confirm Rescue & Claim Food' : 'Sign In to Claim Food'}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}
