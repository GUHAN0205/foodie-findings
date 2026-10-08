import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, ShieldCheck, Globe, CheckCircle2, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#e23744] to-[#f97316] text-white flex items-center justify-center mx-auto text-2xl shadow-xl shadow-red-500/20">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#1e293b] font-serif">
          Foodie Findings
        </h1>
        <p className="text-lg font-bold text-[#e23744]">
          “Good Food Should Find a Good Home.”
        </p>
        <p className="text-xs uppercase font-bold tracking-widest text-[#94a3b8]">
          Find Food. Save Food. Share Food.
        </p>
      </div>

      {/* Philosophy Statement */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-6 text-[#475569] leading-relaxed text-sm sm:text-base">
        <h2 className="text-xl font-bold text-[#1e293b] font-serif">Our Philosophy</h2>
        <p>
          Foodie Findings is a real-world, location-aware food surplus redistribution platform born out of an undeniable reality: every single weekend, thousands of banquet halls, weddings, hotel buffets, hostels, and corporate functions prepare magnificent, delicious food that ends up discarded merely hours later.
        </p>
        <p>
          Not because the food is spoiled. But simply because at 10:30 PM after a wedding banquet, the organizers have no quick, trusted way to reach a verified shelter or volunteer with vehicle capacity just 2 kilometers down the road.
        </p>
        
        <div className="p-5 rounded-2xl bg-[#faf7f2] border-l-4 border-[#e23744] space-y-2 text-[#1e293b] font-medium">
          <p className="italic">
            “Instead of throwing this food away, I can actually help it reach someone who needs it.”
          </p>
          <p className="text-xs text-[#64748b] not-italic">
            Our purpose is: Food Discovery + Food Rescue + Community — never commercial food delivery.
          </p>
        </div>

        <h3 className="text-lg font-bold text-[#1e293b]">Our Non-Negotiable Real-World Commitment</h3>
        <p>
          The most important rule of Foodie Findings is authenticity: <strong>Accuracy &gt; Visual Population</strong>. An empty map is infinitely better than a map populated with fake or auto-generated food listings.
        </p>
        <ul className="space-y-2 text-xs text-[#475569]">
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>We never fabricate food availability, quantities, or addresses.</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>We separate map provider geographic places from actual surplus food reported by authenticated users.</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Distances are calculated in real time using the Haversine formula from verified GPS coordinates.</span>
          </li>
        </ul>
      </div>

      {/* Community Call */}
      <div className="text-center p-8 bg-gradient-to-r from-amber-50 to-rose-50 rounded-3xl border border-[#e2d9cd] space-y-4">
        <h3 className="text-xl font-bold text-[#1e293b] font-serif">Be Part of the Solution</h3>
        <p className="text-xs text-[#64748b] max-w-md mx-auto">
          Whether you are a marriage hall manager, restaurant owner, student volunteer, or shelter director, your participation transforms surplus into sustenance.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-[#e23744] text-white text-xs font-bold shadow-md hover:opacity-95"
          >
            Create Your Account
          </Link>
          <Link
            to="/find-food"
            className="px-6 py-3 rounded-xl bg-white border border-[#e2d9cd] text-[#1e293b] text-xs font-bold hover:bg-[#faf7f2]"
          >
            Explore Active Surplus
          </Link>
        </div>
      </div>

    </div>
  );
};

export default About;
