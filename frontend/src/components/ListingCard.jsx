import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  MapPin,
  UtensilsCrossed,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  Eye,
  Sparkles,
  Thermometer,
  Heart,
} from 'lucide-react';

// Haversine formula to compute distance in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth's radius in km
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

export default function ListingCard({
  listing,
  userCoords = null,
  onSelect,
  onClaimClick,
  index = 0,
}) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    function calculateTime() {
      if (!listing.availableUntil) {
        setTimeLeft('Flexible');
        setFormattedTime('Today');
        return;
      }
      const untilDate = new Date(listing.availableUntil);
      setFormattedTime(
        untilDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      );

      const diff = untilDate - new Date();
      if (diff <= 0) {
        setTimeLeft('Expired');
        setIsUrgent(false);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours < 2.5) {
        setIsUrgent(true);
      } else {
        setIsUrgent(false);
      }

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
    }

    calculateTime();
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, [listing.availableUntil]);

  // Compute real distance
  const distanceKm =
    userCoords && listing.latitude && listing.longitude
      ? calculateDistanceKm(
          userCoords.latitude,
          userCoords.longitude,
          listing.latitude,
          listing.longitude
        )
      : null;

  const getDietaryBadge = (type) => {
    switch (type) {
      case 'VEGAN':
        return (
          <span className="bg-[#DCFCE7] text-[#15803D] text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
            🌱 Vegan
          </span>
        );
      case 'VEGETARIAN':
        return (
          <span className="bg-[#FEF3C7] text-[#B45309] text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
            🧀 Vegetarian
          </span>
        );
      default:
        return (
          <span className="bg-[#FEE2E2] text-[#B91C1C] text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
            🥩 Non-Veg
          </span>
        );
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Bakery': return '🥐';
      case 'Cooked Meals':
      case 'Meals': return '🍛';
      case 'Fresh Produce':
      case 'Produce': return '🥬';
      case 'Fruits': return '🍎';
      case 'Dairy': return '🥛';
      case 'Packaged': return '📦';
      default: return '🍱';
    }
  };

  const defaultImage =
    listing.imageUrl ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-[#FFFDF9] rounded-[32px] border-2 border-[#EDE3D5] shadow-warm-sm hover:shadow-warm-md hover:border-[#E03E26]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
      onClick={() => onSelect(listing)}
    >
      {/* ======================================================== */}
      {/* TOP IMAGE SECTION                                        */}
      {/* ======================================================== */}
      <div className="relative aspect-[4/3] overflow-hidden m-2 rounded-[24px]">
        <motion.img
          src={defaultImage}
          alt={listing.foodName}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Ambient warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181614]/80 via-transparent to-[#181614]/20 pointer-events-none"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5 items-start">
            {getDietaryBadge(listing.foodType)}
            <motion.span 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="bg-white/95 backdrop-blur-md text-[#181614] text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1"
            >
              <span className="text-sm">{getCategoryIcon(listing.category)}</span>
              <span>{listing.category || 'Surplus'}</span>
            </motion.span>
          </div>

          {/* Status Badge */}
          {isUrgent ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#E03E26] text-white shadow-md animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{timeLeft}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-[#181614] shadow-sm">
              <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{timeLeft}</span>
            </div>
          )}
        </div>

        {/* Bottom Image Info */}
        <div className="absolute bottom-3 left-3 right-3 text-white text-xs z-10 flex flex-col gap-1">
           <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] line-clamp-1 leading-none drop-shadow-md">
            {listing.foodName}
          </h3>
          <div className="flex items-center justify-between mt-1">
             <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/90">
               <span className="text-xl drop-shadow-sm">🍱</span>
               <span>{listing.servings || 'Surplus'} portions</span>
             </div>
             <div className="text-[11px] font-bold bg-[#181614]/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
               Fresh until {formattedTime}
             </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BODY CONTENT & ACTIONS                                   */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        {/* Metadata Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-[#645F5B]">
            <span className="font-bold text-[#181614] text-sm truncate">
              {listing.donor?.name || 'Verified Kitchen'}
            </span>
            <div className="flex items-center gap-1 text-[#15803D] font-bold text-[11px] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[#8C827A] text-xs">
            <div className="flex items-center gap-1 font-semibold truncate text-[#181614]">
              <MapPin className="w-4 h-4 text-[#E03E26] shrink-0" />
              {distanceKm !== null ? (
                <span className="text-[#E03E26] font-extrabold text-sm">
                  {distanceKm < 1
                    ? `${Math.round(distanceKm * 1000)} m away`
                    : `${distanceKm.toFixed(1)} km away`}
                </span>
              ) : (
                <span className="truncate">
                  {listing.approximateArea || listing.pickupLocation || 'Local donor'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onClaimClick(listing);
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-black text-sm text-white bg-gradient-to-r from-[#181614] to-[#242220] group-hover:from-[#E03E26] group-hover:to-[#C8321C] transition-all shadow-md group-hover:shadow-[0_8px_20px_-4px_rgba(224,62,38,0.5)]"
        >
          <span>RESCUE THIS FOOD</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Heart className="w-4 h-4 fill-current text-white" />
          </motion.div>
        </motion.button>

      </div>
    </motion.div>
  );
}
