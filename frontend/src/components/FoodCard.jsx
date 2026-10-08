import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';

const FoodCard = ({ listing, onQuickRequest }) => {
  const isExpiringSoon = listing.isExpiringSoon || (listing.minutesRemaining && listing.minutesRemaining <= 60);

  const formatTimeLeft = (minutes) => {
    if (minutes === null || minutes === undefined) return 'Time window active';
    if (minutes <= 0) return 'Expired';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) return `${hrs}h ${mins}m left`;
    return `${mins}m left`;
  };

  const getDietaryBadge = (type) => {
    switch (type) {
      case 'VEGETARIAN':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5"></span>
            Veg
          </span>
        );
      case 'NON_VEGETARIAN':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5"></span>
            Non-Veg
          </span>
        );
      case 'VEGAN':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            🌱 Vegan
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-[#e8e2d5] hover:border-[#e23744]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Food Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#f1ede6]">
        <img
          src={listing.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80"}
          alt={listing.foodName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Category & Dietary Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/60 backdrop-blur-md text-white shadow-xs">
            {listing.category}
          </span>
          {getDietaryBadge(listing.foodType)}
        </div>

        {/* Real Haversine Distance Badge */}
        {listing.formattedDistance && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-white/95 backdrop-blur-md text-[#1e293b] shadow-md border border-white/40">
              <MapPin className="w-3.5 h-3.5 text-[#e23744] mr-1" />
              {listing.formattedDistance}
            </span>
          </div>
        )}

        {/* Urgency Badge */}
        {isExpiringSoon && (
          <div className="absolute top-3 right-3 animate-pulse">
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-md">
              <Clock className="w-3.5 h-3.5 mr-1" />
              Expiring Soon
            </span>
          </div>
        )}

        {/* Match Score Badge (if available) */}
        {listing.matchScore && (
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-600 text-white shadow-md">
              <Sparkles className="w-3 h-3 mr-1" />
              {listing.matchScore}% Match
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Donor & Verification */}
          <div className="flex items-center justify-between text-xs text-[#64748b]">
            <div className="flex items-center space-x-1.5 truncate max-w-[200px]">
              <span className="font-medium truncate">{listing.donorName}</span>
              {listing.donorVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a] shrink-0" title="Verified Donor" />
              )}
            </div>
            {listing.eventType && (
              <span className="text-[11px] font-medium bg-[#f1ede6] px-2 py-0.5 rounded text-[#475569]">
                {listing.eventType}
              </span>
            )}
          </div>

          {/* Food Title */}
          <h3 className="text-lg font-bold text-[#1e293b] group-hover:text-[#e23744] transition-colors line-clamp-1">
            {listing.foodName}
          </h3>

          {/* Servings & Quantity Highlight */}
          <div className="flex items-center space-x-4 text-xs text-[#475569] py-1 border-y border-[#f1ede6]">
            <div className="flex items-center space-x-1 font-semibold text-[#1e293b]">
              <Users className="w-3.5 h-3.5 text-[#f97316]" />
              <span>{listing.servings} Servings</span>
            </div>
            <div className="truncate text-[#64748b]">
              Qty: {listing.quantity}
            </div>
          </div>

          {/* Description preview */}
          {listing.description && (
            <p className="text-xs text-[#64748b] line-clamp-2 leading-relaxed">
              {listing.description}
            </p>
          )}

          {/* Approximate Area */}
          <div className="flex items-center text-xs text-[#64748b] pt-1">
            <MapPin className="w-3.5 h-3.5 text-[#94a3b8] mr-1 shrink-0" />
            <span className="truncate">{listing.approximateArea || 'Local Neighborhood'}</span>
          </div>
        </div>

        {/* Footer Row: Expiry Countdown & Request Button */}
        <div className="pt-2 flex items-center justify-between border-t border-[#f1ede6]">
          <div className="flex items-center text-xs text-[#475569]">
            <Clock className={`w-3.5 h-3.5 mr-1 ${isExpiringSoon ? 'text-amber-600 font-bold' : 'text-[#64748b]'}`} />
            <span className={isExpiringSoon ? 'text-amber-700 font-bold' : ''}>
              {formatTimeLeft(listing.minutesRemaining)}
            </span>
          </div>

          <Link
            to={`/food/${listing.id}`}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-[#faf7f2] hover:bg-[#e23744] text-[#1e293b] hover:text-white border border-[#e2d9cd] hover:border-[#e23744] transition-all shadow-2xs"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
