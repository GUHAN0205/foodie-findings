import {
  X,
  ShieldCheck,
  Thermometer,
  AlertTriangle,
  Scale,
  CheckCircle2,
  PackageCheck,
} from 'lucide-react';

export default function SafetyGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-stone-900 font-['Outfit']">Food Safety & Quality Guidelines</h2>
            <p className="text-xs text-stone-500 font-medium">
              Standards for safe food surplus recovery, transport, and distribution
            </p>
          </div>
        </div>

        {/* Legal Protection Alert */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <Scale className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Bill Emerson Good Samaritan Food Donation Act Protection</p>
            <p className="mt-1 text-amber-800 leading-relaxed">
              Federal law protects food donors and nonprofit recipients from civil and criminal liability when donating surplus food in good faith, encouraging restaurants, grocers, and caterers to donate surplus rather than discard it.
            </p>
          </div>
        </div>

        {/* Core Protocols */}
        <div className="space-y-4 text-xs sm:text-sm">
          
          {/* Rule 1: Temperature Control */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <Thermometer className="w-4 h-4 text-[#E04F36]" />
              <span>1. The Temperature Danger Zone (4°C to 60°C / 40°F to 140°F)</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-xs">
              Potentially hazardous foods (cooked meats, dairy, prepared rice and pasta) must stay out of the danger zone:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-600 text-xs">
              <li><strong>Hot Prepared Foods:</strong> Kept at or above 60°C (140°F) in thermal cambros or insulated containers.</li>
              <li><strong>Cold / Chilled Foods:</strong> Maintained under 4°C (40°F) with ice packs or refrigerated transit.</li>
              <li><strong>2-Hour Rule:</strong> If food remains between 4°C and 60°C for more than 2 hours, it must not be listed.</li>
            </ul>
          </div>

          {/* Rule 2: Packaging & Sanitization */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <PackageCheck className="w-4 h-4 text-emerald-700" />
              <span>2. Clean Packaging & Allergen Labeling</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-stone-600 text-xs">
              <li>All items must be in food-grade, leak-proof, sanitized food pans, foil trays, or paper packaging.</li>
              <li>Always declare major allergens (Peanuts, Tree nuts, Dairy, Eggs, Gluten/Wheat, Soy, Fish, Crustaceans).</li>
              <li>Clearly write preparation timestamp and recommended consumption deadline on labels.</li>
            </ul>
          </div>

          {/* Rule 3: Inspection Checklist */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-sky-700" />
              <span>3. Volunteer & Courier Handover Checklist</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-stone-600 text-xs">
              <li>Verify container integrity: No broken seals, bulging cans, or torn wrappers.</li>
              <li>Inspect sensory cues: Normal aroma, fresh color, no signs of mold or contamination.</li>
              <li>Transport directly to the designated recipient shelter without intermediate detours.</li>
            </ul>
          </div>

        </div>

        {/* Modal Close CTA */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            I Understand the Safety Protocols
          </button>
        </div>

      </div>
    </div>
  );
}
