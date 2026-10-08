import React from 'react';
import { Loader2, Utensils, AlertTriangle, MapPinOff, RefreshCw, PlusCircle } from 'lucide-react';

/**
 * Reusable StatusState component providing clean, high-design states for:
 * - 'loading': "Finding verified food listings near you..."
 * - 'empty': "No surplus food has been reported nearby right now."
 * - 'error': "We couldn't retrieve verified food listings. Please try again."
 * - 'location-denied': "Location access is required to discover food near you."
 */
export default function StatusState({
  type = 'empty', // 'loading' | 'empty' | 'error' | 'location-denied'
  title,
  message,
  onRetry,
  onAction,
  actionLabel = 'Share Surplus Food',
  className = '',
}) {
  if (type === 'loading') {
    return (
      <div className={`py-20 px-4 text-center space-y-4 max-w-md mx-auto ${className}`}>
        <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-[#E04F36] animate-spin"></div>
          <Utensils className="w-5 h-5 text-[#E04F36]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-stone-800 font-['Outfit']">
            {title || 'Finding verified food listings near you...'}
          </h3>
          <p className="text-xs text-stone-500">
            {message || 'Checking with verified restaurants, grocers, and community kitchens...'}
          </p>
        </div>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className={`bg-white rounded-3xl p-10 sm:p-12 text-center border border-rose-200/80 shadow-sm space-y-4 max-w-md mx-auto my-6 ${className}`}>
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-stone-900 font-['Outfit']">
            {title || "We couldn't retrieve verified food listings. Please try again."}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {message || 'Connection to the food rescue database timed out or was interrupted.'}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-[#E04F36] text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (type === 'location-denied') {
    return (
      <div className={`bg-white rounded-3xl p-10 sm:p-12 text-center border border-amber-200/80 shadow-sm space-y-4 max-w-md mx-auto my-6 ${className}`}>
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
          <MapPinOff className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-stone-900 font-['Outfit']">
            {title || 'Location access is required to discover food near you.'}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {message || 'Foodie Findings only displays real, verified surplus food within pickup distance. Please enable location permissions in your browser or search by city name.'}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#E04F36] hover:bg-[#C93F27] text-white transition-colors cursor-pointer"
          >
            Enable Location
          </button>
        )}
      </div>
    );
  }

  // Default: 'empty'
  return (
    <div className={`bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#F2E8DC] shadow-sm space-y-4 max-w-lg mx-auto my-6 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-amber-50/80 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
        <Utensils className="w-8 h-8" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-xl font-bold text-stone-900 font-['Outfit']">
          {title || 'No surplus food has been reported nearby right now.'}
        </h3>
        <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
          {message || 'No surplus food has been reported nearby yet. Listings appear here in real-time as verified kitchens, caterers, and grocers post edible surplus.'}
        </p>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Feed
          </button>
        )}
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#E04F36] hover:bg-[#C93F27] text-white transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {actionLabel}
          </button>
        )}
      </div>

      <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400">
        🛡️ Real Data Guarantee &bull; Never populated with simulated or fake food claims
      </div>
    </div>
  );
}
