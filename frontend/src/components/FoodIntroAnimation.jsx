import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FoodIntroAnimation({ onComplete }) {
  const [stage, setStage] = useState('entering');

  useEffect(() => {
    // Sequence:
    // 0-2s: showing the intro
    // 2s: transition to exiting
    // 2.8s: unmount / complete
    const t1 = setTimeout(() => setStage('exiting'), 2500);
    const t2 = setTimeout(() => onComplete(), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage === 'entering' && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[#E03E26] via-[#D9381E] to-[#B91C1C] overflow-hidden"
        >
          {/* Subtle background particles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100, x: Math.random() * 400 - 200 }}
              animate={{ opacity: 0.2, y: -200, x: Math.random() * 400 - 200 }}
              transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: "linear" }}
              className="absolute w-2 h-2 rounded-full bg-white blur-sm"
            />
          ))}

          <div className="relative flex flex-col items-center justify-center w-full max-w-lg z-10">
            {/* Plate Assembly */}
            <div className="relative flex items-center justify-center">
              
              {/* Fork */}
              <motion.div
                initial={{ x: -100, opacity: 0, rotate: -20 }}
                animate={{ x: -60, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: 'spring', bounce: 0.4 }}
                className="absolute left-0 z-0 text-white/80"
              >
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 2v9.36c0 1.25-.8 2.37-2 2.6V22h-2v-8.04c-1.2-.23-2-1.35-2-2.6V2h1.5v5.5c0 .28.22.5.5.5s.5-.22.5-.5V2h1.5v5.5c0 .28.22.5.5.5s.5-.22.5-.5V2H11z"/>
                </svg>
              </motion.div>

              {/* Spoon */}
              <motion.div
                initial={{ x: 100, opacity: 0, rotate: 20 }}
                animate={{ x: 60, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3, type: 'spring', bounce: 0.4 }}
                className="absolute right-0 z-0 text-white/80"
              >
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 6c0-2.21-3-4-3-4S9 3.79 9 6c0 2.21 1.34 4 3 4s3-1.79 3-4zM11 11v11h2V11h-2z"/>
                </svg>
              </motion.div>

              {/* Main Plate */}
              <motion.div
                initial={{ scale: 0, rotate: -90, y: 50 }}
                animate={{ scale: 1, rotate: 0, y: 0 }}
                transition={{ duration: 0.7, type: 'spring', bounce: 0.5 }}
                className="relative z-10 w-40 h-40 bg-[#FFFDF9] rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-4 border-[#F5EFEB] flex items-center justify-center"
              >
                {/* Plate Inner Ring */}
                <div className="w-28 h-28 rounded-full border-2 border-dashed border-[#EADFCF] absolute" />

                {/* Flying Ingredients */}
                <motion.div
                  initial={{ opacity: 0, y: -100, x: -50, rotate: -45 }}
                  animate={{ opacity: 1, y: -10, x: -15, rotate: 12 }}
                  transition={{ duration: 0.6, delay: 0.5, type: 'spring' }}
                  className="absolute text-4xl"
                >
                  🥬
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: -80, x: 80, rotate: 45 }}
                  animate={{ opacity: 1, y: 5, x: 15, rotate: -15 }}
                  transition={{ duration: 0.6, delay: 0.6, type: 'spring' }}
                  className="absolute text-4xl"
                >
                  🍅
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 100, x: -40, rotate: 90 }}
                  animate={{ opacity: 1, y: 20, x: 0, rotate: -5 }}
                  transition={{ duration: 0.6, delay: 0.7, type: 'spring' }}
                  className="absolute text-4xl"
                >
                  🥖
                </motion.div>

                {/* Steam Lines */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 0.6, 0], y: -30 }}
                  transition={{ duration: 1.5, delay: 1, repeat: Infinity }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-12 border-l-2 border-r-2 border-white/40 rounded-full blur-[1px]"
                />
              </motion.div>
            </div>

            {/* Logo Text Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-8 text-center"
            >
              <h1 className="text-4xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight flex items-center gap-2 drop-shadow-md">
                FOODIE<span className="text-[#FCD34D]">FINDINGS</span>
              </h1>
            </motion.div>

            {/* Dynamic Slogan Sequence */}
            <div className="mt-4 h-8 relative w-full flex justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0, 0, 0] }}
                transition={{ duration: 2.5, times: [0, 0.1, 0.4, 0.5, 1, 1], repeat: 0 }}
                className="absolute text-[#FEF08A] font-extrabold tracking-widest uppercase text-sm"
              >
                EXTRA FOOD
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 0, 1, 1, 0] }}
                transition={{ duration: 2.5, times: [0, 0.4, 0.5, 0.6, 0.9, 1], repeat: 0 }}
                className="absolute text-[#86EFAC] font-extrabold tracking-widest uppercase text-sm"
              >
                FIND A PLACE
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 0, 0, 0, 1] }}
                transition={{ duration: 2.5, times: [0, 0.8, 0.85, 0.9, 0.95, 1], repeat: 0 }}
                className="absolute text-white font-extrabold tracking-widest uppercase text-sm"
              >
                RESCUE A MEAL
              </motion.div>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
