import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { foodApi } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  PlusCircle, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Calendar,
  X
} from 'lucide-react';

const presetImages = [
  { name: 'Feast Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80' },
  { name: 'Catering Banquet', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80' },
  { name: 'Artisan Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80' },
  { name: 'Curry & Rice Meal', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80' },
  { name: 'Fresh Salad & Veg', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80' },
];

const ShareFood = () => {
  const { user, isAuthenticated } = useAuth();
  const { coords, locationName, requestLocation } = useLocation();
  const navigate = useNavigate();

  // Form state
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cooked Meals');
  const [quantity, setQuantity] = useState('');
  const [servings, setServings] = useState(30);
  const [foodType, setFoodType] = useState('VEGETARIAN');

  // Times (default prep 1 hr ago, available now until +3 hrs)
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const toLocalIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

  const defaultFrom = toLocalIso(now);
  const defaultUntil = toLocalIso(new Date(now.getTime() + 3 * 3600 * 1000));
  const defaultPrep = toLocalIso(new Date(now.getTime() - 1 * 3600 * 1000));

  const [preparedAt, setPreparedAt] = useState(defaultPrep);
  const [availableFrom, setAvailableFrom] = useState(defaultFrom);
  const [availableUntil, setAvailableUntil] = useState(defaultUntil);

  // Location
  const [pickupLocation, setPickupLocation] = useState('');
  const [approximateArea, setApproximateArea] = useState('');
  const [latitude, setLatitude] = useState(coords ? coords.latitude : 12.9716);
  const [longitude, setLongitude] = useState(coords ? coords.longitude : 77.5946);

  // Extra details
  const [storageCondition, setStorageCondition] = useState('Hot insulated food containers');
  const [allergens, setAllergens] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [eventType, setEventType] = useState('Wedding');
  const [imageUrl, setImageUrl] = useState(presetImages[0].url);

  // Safety confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [checkAccurate, setCheckAccurate] = useState(false);
  const [checkSafe, setCheckSafe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use current GPS coordinates
  const handleUseCurrentGps = () => {
    if (coords && coords.latitude) {
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
      if (locationName && !approximateArea) {
        setApproximateArea(locationName);
      }
    } else {
      requestLocation();
    }
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=/share-food');
      return;
    }
    setError(null);
    setConfirmModalOpen(true);
  };

  const handlePublish = async () => {
    if (!checkAccurate || !checkSafe) {
      setError("Please confirm both accuracy and food safety checkboxes.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        foodName,
        description,
        category,
        quantity,
        servings: Number(servings),
        foodType,
        preparedAt: new Date(preparedAt).toISOString().slice(0, 19),
        availableFrom: new Date(availableFrom).toISOString().slice(0, 19),
        availableUntil: new Date(availableUntil).toISOString().slice(0, 19),
        pickupLocation,
        approximateArea: approximateArea || pickupLocation.split(',')[0],
        latitude: Number(latitude),
        longitude: Number(longitude),
        imageUrl,
        storageCondition,
        allergens: allergens || undefined,
        specialInstructions: specialInstructions || undefined,
        eventType,
      };

      const res = await foodApi.createListing(payload);

      // Trigger celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setConfirmModalOpen(false);
      navigate(`/food/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish listing. Please check the values.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-50 text-[#e23744] text-xs font-bold rounded-full border border-red-200">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Surplus Food Rescue</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1e293b] font-serif">
          Have Extra Food?
        </h1>
        <p className="text-sm sm:text-base text-[#64748b]">
          Don't let good food go to waste. Connect your edible surplus with verified volunteers and shelters in minutes.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleOpenConfirm} className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e2d9cd] shadow-sm space-y-8">
        
        {/* Section 1: Food Details */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#1e293b] flex items-center space-x-2 border-b border-[#f1ede6] pb-3">
            <span className="w-6 h-6 rounded-lg bg-[#e23744]/10 text-[#e23744] flex items-center justify-center text-xs font-black">1</span>
            <span>What food are you sharing?</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Food Name / Banquet Item *
              </label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Royal Vegetable Biryani & Paneer Gravy"
                className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
              >
                <option value="Cooked Meals">Cooked Meals</option>
                <option value="Bakery & Breads">Bakery & Breads</option>
                <option value="Produce & Groceries">Produce & Groceries</option>
                <option value="Dairy & Sweets">Dairy & Sweets</option>
                <option value="Packaged & Canned">Packaged & Canned</option>
                <option value="Beverages">Beverages</option>
                <option value="Event Catering">Event Catering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Dietary Type *
              </label>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
              >
                <option value="VEGETARIAN">Vegetarian 🟢</option>
                <option value="NON_VEGETARIAN">Non-Vegetarian 🔴</option>
                <option value="VEGAN">Vegan 🌱</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Estimated Servings *
              </label>
              <input
                type="number"
                min="1"
                required
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Total Quantity / Containers *
              </label>
              <input
                type="text"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 3 large insulated thermal pots (approx 40kg)"
                className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Detailed Description (optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include meal components, side dishes, quality, and packaging..."
                className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Source Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
              >
                <option value="Wedding">Wedding Banquet</option>
                <option value="Marriage">Marriage Ceremony</option>
                <option value="Hostel">Hostel Dining</option>
                <option value="College Function">College Function</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Birthday Party">Birthday Party</option>
                <option value="Hotel">Hotel Buffet</option>
                <option value="Restaurant">Restaurant Surplus</option>
                <option value="Festival">Festival Celebration</option>
                <option value="Community Gathering">Community Gathering</option>
                <option value="Other">Other Event</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Time Sensitivity & Expiry */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#1e293b] flex items-center space-x-2 border-b border-[#f1ede6] pb-3">
            <span className="w-6 h-6 rounded-lg bg-[#f97316]/10 text-[#f97316] flex items-center justify-center text-xs font-black">2</span>
            <span>Food Timing & Freshness Window</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Preparation Time
              </label>
              <input
                type="datetime-local"
                value={preparedAt}
                onChange={(e) => setPreparedAt(e.target.value)}
                className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Available From *
              </label>
              <input
                type="datetime-local"
                required
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Available Until (Expiry) *
              </label>
              <input
                type="datetime-local"
                required
                value={availableUntil}
                onChange={(e) => setAvailableUntil(e.target.value)}
                className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-xs font-bold text-[#e23744]"
              />
            </div>
          </div>
          <p className="text-[11px] text-[#64748b]">
            ⏳ Listings automatically transition to EXPIRED when this time window passes to guarantee food safety.
          </p>
        </div>

        {/* Section 3: Real Location & Privacy */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#f1ede6] pb-3">
            <h2 className="text-base font-bold text-[#1e293b] flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center text-xs font-black">3</span>
              <span>Pickup Location & Privacy</span>
            </h2>
            <button
              type="button"
              onClick={handleUseCurrentGps}
              className="text-xs font-bold text-[#e23744] hover:underline flex items-center space-x-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Use My Real GPS</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Exact Pickup Address * (Kept private until pickup request is confirmed)
              </label>
              <input
                type="text"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g. Royal Palace Banquet Hall, Service Gate 2, Residency Road, Bangalore, 560025"
                className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Public Approximate Area *
              </label>
              <input
                type="text"
                required
                value={approximateArea}
                onChange={(e) => setApproximateArea(e.target.value)}
                placeholder="e.g. Residency Road, Bangalore"
                className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
              />
              <p className="text-[11px] text-[#94a3b8] mt-1">This approximate neighborhood is shown publicly on the discovery map.</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">Real Latitude *</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">Real Longitude *</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Food Safety & Handling */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#1e293b] flex items-center space-x-2 border-b border-[#f1ede6] pb-3">
            <span className="w-6 h-6 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center text-xs font-black">4</span>
            <span>Food Safety, Storage & Photos</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Storage Condition
              </label>
              <input
                type="text"
                value={storageCondition}
                onChange={(e) => setStorageCondition(e.target.value)}
                placeholder="e.g. Hot insulated thermal containers / Refrigerated"
                className="w-full px-3 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Allergens (if any)
              </label>
              <input
                type="text"
                value={allergens}
                onChange={(e) => setAllergens(e.target.value)}
                placeholder="e.g. Contains dairy, peanuts, cashews, gluten"
                className="w-full px-3 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#475569] mb-1">
                Special Collection Instructions
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Enter through Gate 2 service ramp. Ask for banquet chef Rajesh."
                className="w-full px-3 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-[#475569]">
                Food Photo URL or Select Preset
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-xs"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {presetImages.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border transition-all ${
                      imageUrl === img.url
                        ? 'bg-[#e23744] text-white border-[#e23744]'
                        : 'bg-[#faf7f2] text-[#475569] border-[#e2d9cd] hover:border-[#e23744]'
                    }`}
                  >
                    {img.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#e2d9cd]">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#e23744] to-[#f97316] hover:opacity-95 text-white font-bold text-base shadow-lg shadow-red-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <span>Review & Publish Listing</span>
            <span className="text-lg">🍱</span>
          </button>
        </div>

      </form>

      {/* Safety Confirmation Modal (Section 21) */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#e2d9cd] space-y-6 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#f1ede6]">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🍱</span>
                <h3 className="font-bold text-base text-[#1e293b]">Confirm Food Listing</h3>
              </div>
              <button onClick={() => setConfirmModalOpen(false)} className="text-[#94a3b8] hover:text-[#1e293b]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            {/* Summary preview */}
            <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e2d9cd] space-y-2 text-xs text-[#475569]">
              <p><strong>Food:</strong> {foodName}</p>
              <p><strong>Quantity:</strong> {servings} servings ({quantity})</p>
              <p><strong>Location:</strong> {approximateArea || pickupLocation}</p>
              <p><strong>Available until:</strong> {new Date(availableUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            {/* Verification Checkboxes */}
            <div className="space-y-3 pt-1">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkAccurate}
                  onChange={(e) => setCheckAccurate(e.target.checked)}
                  className="mt-0.5 rounded text-[#e23744] focus:ring-[#e23744] w-4 h-4"
                />
                <span className="text-xs text-[#1e293b] font-medium leading-relaxed">
                  I confirm that all listed details (location, servings, timing) are accurate and reflect real surplus food.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkSafe}
                  onChange={(e) => setCheckSafe(e.target.checked)}
                  className="mt-0.5 rounded text-[#e23744] focus:ring-[#e23744] w-4 h-4"
                />
                <span className="text-xs text-[#1e293b] font-medium leading-relaxed">
                  I confirm that this food is clean, edible, and safe for redistribution in compliance with food safety guidelines.
                </span>
              </label>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="flex-1 py-3 text-xs font-bold text-[#475569] border border-[#e2d9cd] rounded-xl hover:bg-[#faf7f2]"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={loading || !checkAccurate || !checkSafe}
                className="flex-1 py-3 text-xs font-bold text-white bg-gradient-to-r from-[#e23744] to-[#f97316] hover:opacity-95 rounded-xl shadow-md disabled:opacity-50 transition-all"
              >
                {loading ? 'Publishing...' : 'Publish Food Listing 🍱'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ShareFood;
