import React from 'react';
import { Utensils, Heart, ShieldCheck, MapPin, Globe, Sparkles } from 'lucide-react';

export default function Footer({ onOpenSafetyModal, onOpenPostModal, setActiveTab }) {
  return (
    <footer className="bg-[#181614] text-[#EDE3D5] pt-16 pb-12 border-t-2 border-[#2A2724] mt-20 relative overflow-hidden">
      {/* Subtle food background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'10\' y=\'30\' font-size=\'20\'%3E🍲%3C/text%3E%3Ctext x=\'40\' y=\'50\' font-size=\'16\'%3E🥕%3C/text%3E%3Ctext x=\'30\' y=\'15\' font-size=\'14\'%3E🥖%3C/text%3E%3C/svg%3E")', backgroundSize: '120px 120px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2A2724]">
          
          {/* Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px_6px_14px_6px] bg-gradient-to-tr from-[#E03E26] via-[#F26419] to-[#F59E0B] p-[2px] shadow-sm">
                <div className="w-full h-full bg-[#181614] rounded-[12px_4px_12px_4px] flex items-center justify-center text-white">
                  <span className="text-lg">🍴</span>
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-['Outfit'] uppercase">
                Foodie <span className="text-[#E03E26]">Findings</span>
              </span>
            </div>

            <p className="text-sm font-extrabold text-[#F26419]">
              “Good Food Should Find a Good Home.”
            </p>
            <p className="text-xs text-[#A89F96] leading-relaxed">
              Rescue surplus. Discover nearby food. Connect it with someone who needs it. Dedicated to zero waste and community food security.
            </p>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-black text-white font-['Outfit']">
              Explore Network
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#A89F96]">
              <li>
                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('feed');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Discover Surplus Food
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('map');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Interactive Food Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('pickups');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pickup Missions & Logistics
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('impact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Live Environmental Metrics
                </button>
              </li>
            </ul>
          </div>

          {/* Food Safety & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-black text-white font-['Outfit']">
              Safety & Standards
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A89F96]">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Good Samaritan Act Protection</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#E03E26] shrink-0" />
                <span>Verified Community Kitchens</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>Precise GPS Proximity Matching</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strict Real-Data Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Platform Principle */}
          <div className="space-y-3 bg-[#242220] p-5 rounded-[22px_8px_22px_8px] border border-[#3A3632]">
            <h4 className="text-xs uppercase tracking-wider font-black text-[#F59E0B] font-['Outfit'] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Honest Data Promise
            </h4>
            <p className="text-xs text-[#D6CEC4] leading-relaxed">
              Foodie Findings displays only verified, live user-generated surplus food. If no surplus food is waiting nearby, we say so honestly. An empty plate is better than fabricated data.
            </p>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C827A] gap-4">
          <p>© {new Date().getFullYear()} Foodie Findings. Built for real communities, real food, and zero waste.</p>
          <div className="flex items-center gap-6 font-semibold">
            <span>Accuracy &gt; Vanity</span>
            <span>&bull;</span>
            <span>Local Circular Economy</span>
            <span>&bull;</span>
            <span>Community Driven</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
