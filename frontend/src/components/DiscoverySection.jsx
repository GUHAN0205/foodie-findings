import { useState } from 'react';
import ListingCard from './ListingCard';
import EmptyState from './EmptyState';
import FoodCategorySelector from './FoodCategorySelector';
import {
  Search,
  Filter,
  Clock,
  Sparkles,
  ArrowUpDown,
  Utensils,
  RefreshCw,
  Flame,
} from 'lucide-react';

export default function DiscoverySection({
  listings = [],
  loading = false,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDietary,
  setSelectedDietary,
  urgentOnly,
  setUrgentOnly,
  sortBy,
  setSortBy,
  userCoords,
  onSelectListing,
  onClaimListing,
  onOpenPostModal,
  onCheckLocation,
}) {

  const dietaryOptions = [
    { id: 'ALL', label: 'All Diets' },
    { id: 'VEGETARIAN', label: '🧀 Vegetarian' },
    { id: 'VEGAN', label: '🌱 Vegan' },
    { id: 'NON_VEGETARIAN', label: '🥩 Non-Veg' },
  ];

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedDietary('ALL');
    setUrgentOnly(false);
  };

  const isFiltered =
    Boolean(searchQuery) ||
    selectedCategory !== 'ALL' ||
    selectedDietary !== 'ALL' ||
    urgentOnly;

  return (
    <section id="discovery" className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* ======================================================== */}
      {/* SECTION HEADER                                           */}
      {/* ======================================================== */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF5EB] border border-[#EDE3D5] text-xs font-bold text-[#E03E26]">
          <Utensils className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Real Surplus Discovery</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#181614] font-['Outfit'] tracking-tight">
          What's Waiting For A New Home?
        </h2>

        <p className="text-base sm:text-lg text-[#645F5B] leading-relaxed">
          Discover verified surplus food shared by people and organizations around you.
        </p>
      </div>

      {/* ======================================================== */}
      {/* SEARCH & CATEGORY SELECTOR                               */}
      {/* ======================================================== */}
      <div className="space-y-8">
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="relative flex items-center bg-white rounded-full border-2 border-[#EDE3D5] focus-within:border-[#E03E26] shadow-warm-sm px-4 py-2 transition-all">
            <Search className="w-5 h-5 text-[#8C827A] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search surplus: e.g. sourdough, biryani, pasta trays, fruit crates..."
              className="w-full bg-transparent px-3 py-1.5 text-sm sm:text-base text-[#181614] placeholder-[#8C827A] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#8C827A] hover:text-[#181614] font-bold px-2 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Interactive Food Category Selector */}
        <FoodCategorySelector 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

      </div>

      {/* ======================================================== */}
      {/* SECONDARY FILTER CONTROLS & COUNTERS                     */}
      {/* ======================================================== */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#EDE3D5] p-3 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-warm-sm">
        
        {/* Left: Dietary Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C827A] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Dietary:
          </span>

          {dietaryOptions.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDietary(d.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedDietary === d.id
                  ? 'bg-[#E03E26] text-white shadow-xs'
                  : 'bg-[#F5EFEB] hover:bg-[#EADFCF] text-[#645F5B]'
              }`}
            >
              {d.label}
            </button>
          ))}

          {/* Urgent Expiring Filter */}
          <button
            onClick={() => setUrgentOnly(!urgentOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              urgentOnly
                ? 'bg-[#E03E26] text-white shadow-sm ring-2 ring-red-200'
                : 'bg-[#FAF5EB] text-[#E03E26] border border-[#EDE3D5] hover:bg-[#F5EFEB]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Expiring Soon (&lt;2.5h)</span>
          </button>
        </div>

        {/* Right: Results Count & Sort Dropdown */}
        <div className="flex items-center gap-3 text-xs w-full md:w-auto justify-between md:justify-end">
          <span className="text-[#645F5B] font-semibold">
            <strong className="text-[#181614]">{listings.length}</strong> available batches
          </span>

          <div className="flex items-center gap-1.5 bg-[#FAF5EB] border border-[#EDE3D5] px-3 py-1.5 rounded-full shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8C827A]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-[#181614] focus:outline-none cursor-pointer"
            >
              <option value="expiry">Sort: Nearest Expiry</option>
              <option value="servings">Sort: Largest Portions</option>
              {userCoords && <option value="distance">Sort: Closest Distance</option>}
            </select>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* FOOD LISTINGS GRID OR HONEST EMPTY STATE                 */}
      {/* ======================================================== */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#E03E26] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-[#8C827A]">
            Discovering verified nearby surplus batches...
          </p>
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          title={
            isFiltered
              ? "No matching surplus found for current filters"
              : "Nothing waiting nearby yet."
          }
          subtitle={
            isFiltered
              ? "Try resetting your category or dietary filters to view all available community surplus."
              : "When someone shares surplus food in your area, it will appear here."
          }
          onCheckLocation={onCheckLocation}
          onOpenPostModal={onOpenPostModal}
          onResetFilters={isFiltered ? handleResetFilters : null}
          isFiltered={isFiltered}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {listings.map((item, index) => (
            <ListingCard
              key={item.id}
              listing={item}
              userCoords={userCoords}
              onSelect={onSelectListing}
              onClaimClick={onClaimListing}
              index={index}
            />
          ))}
        </div>
      )}

    </section>
  );
}
