import React from 'react';
import { MapPin, PlusCircle, RefreshCw, Compass, ShieldCheck } from 'lucide-react';

export default function EmptyState({
  title = "Nothing waiting nearby yet.",
  subtitle = "When someone shares surplus food in your area, it will appear here.",
  onCheckLocation,
  onOpenPostModal,
  onResetFilters,
  isFiltered = false,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-14 text-center bg-white/95 rounded-[32px_14px_32px_14px] border-2 border-[#EDE3D5] shadow-warm-sm max-w-lg mx-auto my-8">
      {/* Handcrafted Ceramic Plate Motif */}
      <div className="relative mb-6">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#FAF5EB] border-4 border-dashed border-[#EADFCF] flex items-center justify-center shadow-inner float-slow">
          <span className="text-5xl sm:text-6xl select-none" role="img" aria-label="plate">
            🍽️
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-[#E03E26] to-[#F26419] text-white p-2.5 rounded-full shadow-md">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* Headline & Subtitle */}
      <h3 className="text-2xl sm:text-3xl font-black text-[#181614] font-['Outfit'] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#645F5B] leading-relaxed max-w-md mb-6">
        {subtitle}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onCheckLocation && (
          <button
            onClick={onCheckLocation}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181614] hover:bg-[#2A2724] text-white text-xs sm:text-sm font-extrabold shadow-warm-sm active:scale-95 transition-all cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#F59E0B]" />
            <span>Check My Location</span>
          </button>
        )}

        {onOpenPostModal && (
          <button
            onClick={onOpenPostModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E03E26] to-[#F26419] hover:from-[#C8321C] hover:to-[#E04F36] text-white text-xs sm:text-sm font-extrabold shadow-warm-sm active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Surplus</span>
          </button>
        )}

        {isFiltered && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#EDE3D5] text-xs font-bold text-[#645F5B] hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Honest Data Guarantee Footer */}
      <div className="mt-8 pt-4 border-t border-[#F5EFEB] text-[11px] font-semibold text-[#8C827A] flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
        <span>Real Data Guarantee: Foodie Findings never fabricates fake listings.</span>
      </div>
    </div>
  );
}
