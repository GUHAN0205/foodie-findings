import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import {
  BarChart3,
  TrendingUp,
  Leaf,
  Sparkles,
  TreePine,
  Car,
  Droplets,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from 'lucide-react';

export default function ImpactDashboardView() {
  const [stats, setStats] = useState(null);
  const [recentRescues, setRecentRescues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImpact() {
      try {
        const [statsData, recentData] = await Promise.all([
          api.impact.getStats().catch(() => null),
          api.impact.getRecentRescues().catch(() => []),
        ]);
        setStats(statsData);
        setRecentRescues(recentData || []);
      } catch (err) {
        console.error('Impact load failed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadImpact();
  }, []);

  // REAL DATA ONLY: never hardcode fake numbers!
  const totalMeals = stats?.totalMealsRescued || 0;
  const totalWeight = stats?.totalWeightKg || 0;
  const totalCo2 = stats?.totalCo2PreventedKg || 0;
  const activeBatches = stats?.activeListingsCount || 0;
  const activeDonors = stats?.activeDonorsCount || 0;

  // Environmental calculations based on verified real weight:
  const treesPlantedEquivalent = totalCo2 > 0 ? Math.round(totalCo2 / 21) : 0;
  const milesDrivenAvoided = totalCo2 > 0 ? Math.round(totalCo2 / 0.4) : 0;
  const waterSavedLiters = totalWeight > 0 ? Math.round(totalWeight * 850) : 0;

  const categories = stats?.categoryBreakdown || {};
  const totalCategoryItems = Object.values(categories).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl sm:text-4xl font-black text-[#181614] font-['Outfit']">
              Every Meal Rescued Counts ❤️
            </h2>
            <span className="text-xs bg-[#DCFCE7] text-[#15803D] font-extrabold px-3 py-1 rounded-full border border-[#BBF7D0]">
              Verified Real Data
            </span>
          </div>
          <p className="text-sm text-[#645F5B] mt-1.5">
            Transparently tracking every rescued meal, diverted landfill waste, and prevented emissions in real time.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#8C827A] bg-white border border-[#EDE3D5] px-3.5 py-1.5 rounded-full shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span>Zero Fabricated Metrics</span>
        </div>
      </div>

      {/* Animated Food Rescue Journey */}
      <div className="bg-white rounded-[24px] border border-[#EDE3D5] shadow-warm-sm p-4 overflow-hidden relative flex justify-center">
        <div className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-black text-[#8C827A] uppercase tracking-wider relative w-full justify-center max-w-3xl">
          <span className="flex flex-col sm:flex-row items-center gap-2"><span className="text-2xl sm:text-3xl">🍚</span> 1 Meal</span>
          
          <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-[#E03E26]">
            <ArrowRight className="w-4 h-4" />
          </motion.div>
          
          <span className="flex flex-col sm:flex-row items-center gap-2 text-[#E03E26]"><span className="text-2xl sm:text-3xl">🍽️</span> Rescued</span>
          
          <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }} className="text-[#F26419]">
            <ArrowRight className="w-4 h-4" />
          </motion.div>

          <span className="flex flex-col sm:flex-row items-center gap-2 text-[#F26419]"><Heart className="w-6 h-6 sm:w-8 sm:h-8 fill-current" /> Shared</span>
          
          <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, delay: 1, repeat: Infinity }} className="text-[#16A34A]">
            <ArrowRight className="w-4 h-4" />
          </motion.div>

          <span className="flex flex-col sm:flex-row items-center gap-2 text-[#16A34A]"><span className="text-2xl sm:text-3xl">🌱</span> Waste Avoided</span>

          {/* Animated dot following the path */}
          <motion.div
            animate={{ left: ['10%', '90%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-1 w-2 h-2 rounded-full bg-[#E03E26] shadow-[0_0_8px_rgba(224,62,38,0.8)]"
          />
        </div>
      </div>

      {/* 4 Core Real Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Meals Rescued */}
        <div className="bg-[#FFFDF9] rounded-[24px_10px_24px_10px] p-6 border-2 border-[#EDE3D5] shadow-warm-sm hover:border-[#E03E26]/40 transition-colors">
          <div className="flex items-center justify-between text-[#8C827A] mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#645F5B]">
              Total Meals Rescued
            </span>
            <TrendingUp className="w-5 h-5 text-[#E03E26]" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-[#181614] font-['Outfit']">
            {totalMeals.toLocaleString()}
          </p>
          <p className="text-xs text-[#645F5B] mt-1">
            {totalMeals > 0 ? 'Verified portions delivered' : 'Awaiting completed handoffs'}
          </p>
        </div>

        {/* Rescued Weight */}
        <div className="bg-[#FFFDF9] rounded-[24px_10px_24px_10px] p-6 border-2 border-[#EDE3D5] shadow-warm-sm hover:border-[#16A34A]/40 transition-colors">
          <div className="flex items-center justify-between text-[#8C827A] mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#645F5B]">
              Rescued Weight
            </span>
            <Leaf className="w-5 h-5 text-[#16A34A]" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-[#15803D] font-['Outfit']">
            {totalWeight.toLocaleString()} kg
          </p>
          <p className="text-xs text-[#645F5B] mt-1">Diverted from municipal landfills</p>
        </div>

        {/* CO2 Prevented */}
        <div className="bg-[#FFFDF9] rounded-[24px_10px_24px_10px] p-6 border-2 border-[#EDE3D5] shadow-warm-sm hover:border-[#F59E0B]/40 transition-colors">
          <div className="flex items-center justify-between text-[#8C827A] mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#645F5B]">
              CO₂ Mitigated
            </span>
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-[#B45309] font-['Outfit']">
            {totalCo2.toLocaleString()} kg
          </p>
          <p className="text-xs text-[#645F5B] mt-1">Methane & greenhouse emissions saved</p>
        </div>

        {/* Active Donors */}
        <div className="bg-[#FFFDF9] rounded-[24px_10px_24px_10px] p-6 border-2 border-[#EDE3D5] shadow-warm-sm hover:border-[#E03E26]/40 transition-colors">
          <div className="flex items-center justify-between text-[#8C827A] mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#645F5B]">
              Active Donors
            </span>
            <Heart className="w-5 h-5 text-[#E03E26]" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-[#181614] font-['Outfit']">
            {activeDonors}
          </p>
          <p className="text-xs text-[#645F5B] mt-1">Registered community kitchens & donors</p>
        </div>

      </div>

      {/* Environmental Equivalents Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-[20px_8px_20px_8px] p-5 border border-[#EDE3D5] shadow-warm-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
            <TreePine className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-black text-[#181614] font-['Outfit']">
              {treesPlantedEquivalent} Trees
            </p>
            <p className="text-xs text-[#645F5B]">Carbon absorption equivalent / year</p>
          </div>
        </div>

        <div className="bg-white rounded-[20px_8px_20px_8px] p-5 border border-[#EDE3D5] shadow-warm-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-black text-[#181614] font-['Outfit']">
              {milesDrivenAvoided} Miles
            </p>
            <p className="text-xs text-[#645F5B]">Passenger car emissions avoided</p>
          </div>
        </div>

        <div className="bg-white rounded-[20px_8px_20px_8px] p-5 border border-[#EDE3D5] shadow-warm-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-black text-[#181614] font-['Outfit']">
              {waterSavedLiters.toLocaleString()} L
            </p>
            <p className="text-xs text-[#645F5B]">Virtual water embedded in rescued food</p>
          </div>
        </div>

      </div>

      {/* Categories Breakdown & Recent Rescues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Rescues by Category */}
        <div className="bg-white rounded-[28px_14px_28px_14px] p-6 border-2 border-[#EDE3D5] shadow-warm-sm space-y-4">
          <h4 className="text-base font-black text-[#181614] font-['Outfit'] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#E03E26]" />
            Rescues by Food Category
          </h4>

          {totalCategoryItems === 0 ? (
            <div className="py-8 text-center space-y-2">
              <span className="text-3xl">🥗</span>
              <p className="text-xs font-bold text-[#8C827A]">
                No categorical rescue data yet.
              </p>
              <p className="text-[11px] text-[#8C827A]">
                Distributions will populate here as completed pickups occur.
              </p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {Object.entries(categories).map(([cat, count]) => {
                const pct = Math.round((count / totalCategoryItems) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#181614]">{cat}</span>
                      <span className="text-[#645F5B]">{pct}% ({count})</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#F5EFEB] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#E03E26] to-[#F26419] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Real-World Rescues */}
        <div className="lg:col-span-2 bg-white rounded-[28px_14px_28px_14px] p-6 border-2 border-[#EDE3D5] shadow-warm-sm space-y-4">
          <h4 className="text-base font-black text-[#181614] font-['Outfit'] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#16A34A]" />
            Recent Rescue Handoffs
          </h4>

          <div className="divide-y divide-stone-100">
            {recentRescues.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <span className="text-4xl">🤝</span>
                <p className="text-sm font-bold text-[#181614]">
                  No recent completed handoffs logged yet.
                </p>
                <p className="text-xs text-[#8C827A] max-w-sm mx-auto">
                  When a courier or shelter completes a food pickup, the verified rescue is recorded here.
                </p>
              </div>
            ) : (
              recentRescues.map((rescue) => (
                <div key={rescue.id} className="py-3.5 flex items-center justify-between text-xs gap-3">
                  <div>
                    <p className="font-extrabold text-[#181614] text-sm font-['Outfit']">
                      {rescue.foodName}
                    </p>
                    <p className="text-[#645F5B] mt-0.5">
                      Donated by <strong className="text-[#181614]">{rescue.donorName}</strong> → Rescued by <strong className="text-[#181614]">{rescue.rescuerName}</strong>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-[#E03E26] text-sm font-['Outfit']">
                      +{rescue.servings} meals
                    </span>
                    <p className="text-[10px] text-[#8C827A]">
                      {rescue.completedAt ? new Date(rescue.completedAt).toLocaleDateString() : 'Today'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
