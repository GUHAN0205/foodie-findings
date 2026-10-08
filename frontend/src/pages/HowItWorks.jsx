import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Truck, 
  Building2, 
  Clock, 
  Lock, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#e23744]">
          Architecture of Good Food
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#1e293b] font-serif">
          How Foodie Findings Works
        </h1>
        <p className="text-sm sm:text-base text-[#64748b]">
          From high-volume banquet leftovers to verified community distribution — step by step with real coordinates and zero fake data.
        </p>
      </div>

      {/* The 3 User Journeys */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Donor Journey */}
        <div className="bg-white rounded-3xl p-8 border border-[#e2d9cd] shadow-xs space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#e23744] flex items-center justify-center text-2xl font-bold">
            🍱
          </div>
          <h2 className="text-xl font-bold text-[#1e293b]">For Food Donors</h2>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Weddings, hotel banquets, hostels, caterers, or private hosts with surplus fresh edible meals.
          </p>
          <ul className="space-y-3 text-xs text-[#475569]">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#e23744] shrink-0 mt-0.5" />
              <span>List surplus food in under 2 minutes with servings and photos.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#e23744] shrink-0 mt-0.5" />
              <span>Set expiration window so food is never collected past freshness.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#e23744] shrink-0 mt-0.5" />
              <span>Address is masked publicly; revealed only when you approve a collector.</span>
            </li>
          </ul>
          <Link to="/share-food" className="inline-block text-xs font-bold text-[#e23744] hover:underline pt-2">
            Share food now →
          </Link>
        </div>

        {/* Volunteer Journey */}
        <div className="bg-white rounded-3xl p-8 border border-[#e2d9cd] shadow-xs space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#f97316] flex items-center justify-center text-2xl font-bold">
            🤝
          </div>
          <h2 className="text-xl font-bold text-[#1e293b]">For Volunteers</h2>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Community heroes who help pick up meals with their vehicle and transport them to nearby shelters.
          </p>
          <ul className="space-y-3 text-xs text-[#475569]">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#f97316] shrink-0 mt-0.5" />
              <span>Discover surplus using real GPS distance calculations.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#f97316] shrink-0 mt-0.5" />
              <span>Request pickup with vehicle notes and estimated arrival time.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#f97316] shrink-0 mt-0.5" />
              <span>Get donor contact and directions to complete the rescue.</span>
            </li>
          </ul>
          <Link to="/register?role=VOLUNTEER" className="inline-block text-xs font-bold text-[#f97316] hover:underline pt-2">
            Join as volunteer →
          </Link>
        </div>

        {/* NGO Journey */}
        <div className="bg-white rounded-3xl p-8 border border-[#e2d9cd] shadow-xs space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16a34a] flex items-center justify-center text-2xl font-bold">
            🏢
          </div>
          <h2 className="text-xl font-bold text-[#1e293b]">For NGOs & Shelters</h2>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Registered charities, orphanages, community kitchens, and homeless shelters.
          </p>
          <ul className="space-y-3 text-xs text-[#475569]">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
              <span>Submit organization verification to receive the 🟢 Verified NGO badge.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
              <span>Smart matching algorithm routes high-capacity meals to your kitchen.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
              <span>Maintain permanent digital receipts for meals distributed.</span>
            </li>
          </ul>
          <Link to="/register?role=NGO" className="inline-block text-xs font-bold text-[#16a34a] hover:underline pt-2">
            Register your NGO →
          </Link>
        </div>

      </div>

      {/* Safety & Protocol Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-red-500/10 to-orange-500/10 p-8 rounded-3xl border border-amber-300/60 space-y-4">
        <div className="flex items-center space-x-2 text-[#e23744] font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Our Non-Negotiable Safety Protocols</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#475569]">
          <div className="p-3 bg-white rounded-xl border border-[#e2d9cd]">
            <h4 className="font-bold text-[#1e293b] mb-1">Time Gating</h4>
            <p>Listings automatically expire after the donor-specified window. Expired meals are never discoverable.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#e2d9cd]">
            <h4 className="font-bold text-[#1e293b] mb-1">Double Affirmation</h4>
            <p>Donors must explicitly verify freshness and sanitary handling before publishing.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#e2d9cd]">
            <h4 className="font-bold text-[#1e293b] mb-1">Privacy Masking</h4>
            <p>Exact donor residential coordinates are concealed until legitimate pickup handoff is authorized.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#e2d9cd]">
            <h4 className="font-bold text-[#1e293b] mb-1">Community Moderation</h4>
            <p>Every listing includes reporting flags investigated directly by platform administrators.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HowItWorks;
