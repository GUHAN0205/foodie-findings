import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'Cooked Meals', label: 'Cooked Meals', icon: '🍛', color: 'bg-[#FCA5A5]', text: 'text-[#7F1D1D]' },
  { id: 'Bakery', label: 'Bakery', icon: '🥖', color: 'bg-[#FCD34D]', text: 'text-[#78350F]' },
  { id: 'Fresh Produce', label: 'Fresh Produce', icon: '🍎', color: 'bg-[#86EFAC]', text: 'text-[#14532D]' },
  { id: 'Healthy Food', label: 'Healthy Food', icon: '🥗', color: 'bg-[#6EE7B7]', text: 'text-[#064E3B]' },
  { id: 'Rice & Meals', label: 'Rice & Meals', icon: '🍚', color: 'bg-[#FDE047]', text: 'text-[#713F12]' },
  { id: 'Dairy', label: 'Dairy', icon: '🥛', color: 'bg-[#FEF08A]', text: 'text-[#713F12]' },
  { id: 'Packaged', label: 'Packaged Food', icon: '📦', color: 'bg-[#93C5FD]', text: 'text-[#1E3A8A]' },
];

export default function FoodCategorySelector({ selectedCategory, onSelectCategory }) {
  // We duplicate the list to create a seamless infinite scroll loop
  const loopItems = [...CATEGORIES, ...CATEGORIES];

  return (
    <div className="py-8 w-full overflow-hidden relative">
      <div className="text-center mb-8">
        <h3 className="font-['Outfit'] font-black text-2xl md:text-3xl text-[#181614] inline-block relative">
          What's Available Near You? 👀
          <span className="absolute -bottom-2 left-0 w-full h-3 bg-[#FCD34D] -z-10 rounded-full transform -rotate-1"></span>
        </h3>
        <p className="text-sm font-bold text-[#8C827A] mt-2">Pick an ingredient or dish type to rescue</p>
      </div>

      {/* Marquee Container */}
      <div className="relative flex overflow-x-hidden group">
        
        {/* Left and Right Fade Gradients */}
        <div className="absolute top-0 left-0 w-12 sm:w-24 h-full bg-gradient-to-r from-[#FFFDF9] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-12 sm:w-24 h-full bg-gradient-to-l from-[#FFFDF9] to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Track */}
        <div className="flex items-center gap-4 animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused] py-4 pl-4 w-max">
          {loopItems.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={`${cat.id}-${idx}`}
                onClick={() => onSelectCategory(cat.id)}
                whileHover={{ scale: 1.05, rotate: isSelected ? 0 : (idx % 2 === 0 ? 3 : -3) }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative flex flex-col items-center justify-center shrink-0
                  w-24 h-28 sm:w-32 sm:h-36 rounded-[2rem] border-4 
                  transition-all duration-300 ease-out shadow-warm-sm
                  ${isSelected 
                    ? 'border-[#181614] bg-white scale-110 shadow-warm-lg z-20' 
                    : `border-transparent ${cat.color} opacity-90 hover:opacity-100 hover:shadow-warm-md`
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#E03E26] rounded-full border-2 border-white text-white flex items-center justify-center shadow-md">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                
                <span className={`text-4xl sm:text-5xl mb-2 filter drop-shadow-md transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {cat.icon}
                </span>
                <span className={`font-black text-[10px] sm:text-xs text-center px-1 tracking-tight ${isSelected ? 'text-[#181614]' : cat.text}`}>
                  {cat.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
