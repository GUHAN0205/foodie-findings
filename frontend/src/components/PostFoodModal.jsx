import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import {
  X,
  PlusCircle,
  Clock,
  MapPin,
  Utensils,
  Image as ImageIcon,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Fresh Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Hot Meals / Trays', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fresh Produce', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pasta / Gourmet', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sandwiches & Deli', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dairy & Breakfast', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80' },
];

export default function PostFoodModal({ isOpen, onClose, onCreated, onOpenAuthModal }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cooked Meals');
  const [foodType, setFoodType] = useState('VEGETARIAN');
  const [quantity, setQuantity] = useState('');
  const [servings, setServings] = useState(25);
  const [eventType, setEventType] = useState('Restaurant Surplus');
  const [storageCondition, setStorageCondition] = useState('Refrigerated (under 4°C)');
  const [allergens, setAllergens] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [expiryHours, setExpiryHours] = useState(4);
  const [pickupLocation, setPickupLocation] = useState(
    user && user.locationName ? user.locationName : 'Downtown Community Center'
  );
  const [approximateArea, setApproximateArea] = useState('Downtown');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[1].url);
  const [safetyConfirmed, setSafetyConfirmed] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      onOpenAuthModal();
      return;
    }

    if (!foodName.trim() || !quantity.trim() || !pickupLocation.trim()) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    if (!safetyConfirmed) {
      showToast('You must confirm that the surplus food meets safety standards', 'error');
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const availableFrom = now.toISOString();
      const availableUntil = new Date(now.getTime() + expiryHours * 60 * 60 * 1000).toISOString();

      await api.listings.create({
        foodName: foodName.trim(),
        description: description.trim(),
        category,
        foodType,
        quantity: quantity.trim(),
        servings: Number(servings),
        eventType,
        storageCondition,
        allergens: allergens.trim(),
        specialInstructions: specialInstructions.trim(),
        availableFrom,
        availableUntil,
        pickupLocation: pickupLocation.trim(),
        approximateArea: approximateArea.trim(),
        latitude: user.latitude || 28.6139,
        longitude: user.longitude || 77.2090,
        imageUrl,
        safetyConfirmed: true,
      });

      showToast(`Surplus "${foodName}" published! Volunteers notified.`, 'success');
      onCreated();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to post surplus food', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#E04F36] flex items-center justify-center">
            <PlusCircle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-stone-900 font-['Outfit']">Post Surplus Food</h2>
            <p className="text-xs text-stone-500 font-medium">
              List surplus items for immediate rescue by volunteers & community kitchens
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Item Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Food / Dish Name <span className="text-[#E04F36]">*</span>
              </label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Roasted Mediterranean Vegetable Bowls"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36] bg-white"
              >
                <option value="Cooked Meals">🍲 Cooked Meals / Banquet Trays</option>
                <option value="Bakery">🥐 Bakery & Fresh Bread</option>
                <option value="Fresh Produce">🥗 Fresh Produce & Fruit</option>
                <option value="Packaged">🥪 Packaged & Deli Goods</option>
                <option value="Dairy">🥛 Dairy & Chilled Foods</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Description & Ingredients
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Prepared at lunch catering event. Warm roasted zucchini, chickpeas, quinoa bowls."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36]"
            />
          </div>

          {/* Dietary Type, Servings & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Dietary Type</label>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36] bg-white"
              >
                <option value="VEGETARIAN">🧀 Vegetarian</option>
                <option value="VEGAN">🌱 100% Vegan</option>
                <option value="NON_VEGETARIAN">🥩 Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Servings / Portions <span className="text-[#E04F36]">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Packaging / Quantity <span className="text-[#E04F36]">*</span>
              </label>
              <input
                type="text"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 8 deep trays (~15 kg)"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36]"
              />
            </div>
          </div>

          {/* Storage & Expiry Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Storage Condition Required
              </label>
              <select
                value={storageCondition}
                onChange={(e) => setStorageCondition(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36] bg-white"
              >
                <option value="Refrigerated (under 4°C)">❄️ Refrigerated (under 4°C)</option>
                <option value="Hot Insulated Container (>60°C)">🔥 Hot Insulated Container (&gt;60°C)</option>
                <option value="Room temperature, dry ambient">📦 Room Temperature / Dry Ambient</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Rescue Window: <span className="text-[#E04F36] font-bold">{expiryHours} Hours</span>
              </label>
              <input
                type="range"
                min="1"
                max="24"
                value={expiryHours}
                onChange={(e) => setExpiryHours(e.target.value)}
                className="w-full accent-[#E04F36] cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>1h (Urgent)</span>
                <span>4h</span>
                <span>12h</span>
                <span>24h</span>
              </div>
            </div>
          </div>

          {/* Allergens & Event Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Allergen Warnings (Optional)
              </label>
              <input
                type="text"
                value={allergens}
                onChange={(e) => setAllergens(e.target.value)}
                placeholder="e.g. Gluten, Dairy, Tree Nuts (or None)"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Source Event Type</label>
              <input
                type="text"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                placeholder="e.g. Corporate Lunch, Bakery Day-End, Banquet"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36]"
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Pickup Address <span className="text-[#E04F36]">*</span>
              </label>
              <input
                type="text"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Full address (provided to accepted courier)"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Public Approximate Area
              </label>
              <input
                type="text"
                value={approximateArea}
                onChange={(e) => setApproximateArea(e.target.value)}
                placeholder="e.g. Downtown / West End"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36]"
              />
            </div>
          </div>

          {/* Food Photo Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center justify-between">
              <span>Choose Representative Photo</span>
              <span className="text-[11px] text-stone-400">Click a preset or enter URL</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((img) => (
                <div
                  key={img.label}
                  onClick={() => setImageUrl(img.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    imageUrl === img.url ? 'border-[#E04F36] ring-2 ring-[#E04F36]/30 scale-95' : 'border-transparent hover:opacity-80'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  {imageUrl === img.url && (
                    <div className="absolute inset-0 bg-[#E04F36]/40 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Safety Agreement */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Donor Food Safety Certification</p>
              <p className="mt-0.5 text-emerald-800">
                I verify that this surplus has been safely prepared and maintained in accordance with health codes and is protected under the Good Samaritan Food Donation Act.
              </p>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#E04F36] to-[#F28C38] hover:shadow-xl hover:shadow-[#E04F36]/30 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Publishing Surplus...' : 'Publish Surplus for Immediate Rescue'}
          </button>

        </form>

      </div>
    </div>
  );
}
