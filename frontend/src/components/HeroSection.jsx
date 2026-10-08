import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Heart,
  Recycle,
  Utensils,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HeroSection({
  onOpenPostModal,
  onFindFoodClick,
  activeCount = 0,
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-amber-200/25 via-rose-100/30 to-emerald-100/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#E03E26]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ======================================================== */}
          {/* LEFT: HERO HEADLINE & ACTIONS                            */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-[#EDE3D5] shadow-warm-sm text-xs font-bold text-[#181614] backdrop-blur-md"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A]"></span>
              </span>
              <span className="text-[#645F5B]">Food Rescue Network</span>
              <span className="text-[#EDE3D5]">•</span>
              <span className="text-[#E03E26] font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {activeCount > 0 ? `${activeCount} batches nearby` : 'Real-Time Surplus Rescue'}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black text-[#181614] font-['Outfit'] leading-[1.05] tracking-tight"
            >
              GOOD FOOD<br />
              SHOULD NEVER<br />
              <span className="bg-gradient-to-r from-[#E03E26] via-[#F26419] to-[#F59E0B] bg-clip-text text-transparent drop-shadow-sm">
                GO TO WASTE.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl text-base sm:text-lg text-[#645F5B] leading-relaxed font-normal"
            >
              Find surplus food around you. Share what you have. Help good food find a good home.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2 flex flex-wrap items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenPostModal}
                className="group relative overflow-hidden flex items-center gap-2.5 px-7 py-4 rounded-full text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-[#E03E26] via-[#F26419] to-[#F97316] shadow-[0_8px_24px_-4px_rgba(224,62,38,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(224,62,38,0.6)] transition-shadow cursor-pointer"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <motion.span 
                  animate={{ rotate: [0, -10, 10, 0] }} 
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                  className="text-lg relative z-10"
                >
                  🍲
                </motion.span>
                <span className="relative z-10">SHARE SURPLUS</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onFindFoodClick}
                className="group flex items-center gap-2.5 px-7 py-4 rounded-full text-sm sm:text-base font-extrabold text-[#181614] bg-white border-2 border-[#181614] shadow-warm-sm hover:bg-[#F5EFEB] transition-colors cursor-pointer"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <MapPin className="w-5 h-5 text-[#E03E26]" />
                </motion.div>
                <span>FIND FOOD NEAR ME</span>
              </motion.button>
            </motion.div>

            {/* Visual Story Animation */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-8 pt-8 border-t border-[#EDE3D5]"
            >
              <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold text-[#8C827A] overflow-hidden whitespace-nowrap relative w-full h-8">
                
                <span className="flex items-center gap-1"><span className="text-lg">🏪</span> EVENT</span>
                
                <motion.div 
                  initial={{ x: -10 }}
                  animate={{ x: 10 }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                  className="text-[#E03E26]"
                >
                  <ArrowRight className="w-3 h-3" />
                </motion.div>
                
                <span className="flex items-center gap-1"><span className="text-lg">🍲</span> SURPLUS</span>
                
                <motion.div 
                  initial={{ x: -10 }}
                  animate={{ x: 10 }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: 0.2 }}
                  className="text-[#E03E26]"
                >
                  <ArrowRight className="w-3 h-3" />
                </motion.div>

                <span className="flex items-center gap-1"><span className="text-lg">📍</span> FIND</span>

                <motion.div 
                  initial={{ x: -10 }}
                  animate={{ x: 10 }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: 0.4 }}
                  className="text-[#E03E26]"
                >
                  <ArrowRight className="w-3 h-3" />
                </motion.div>

                <span className="flex items-center gap-1 text-[#E03E26]"><Heart className="w-4 h-4 fill-current" /> RESCUE</span>

                <motion.div 
                  initial={{ x: -10 }}
                  animate={{ x: 10 }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: 0.6 }}
                  className="text-[#16A34A]"
                >
                  <ArrowRight className="w-3 h-3" />
                </motion.div>

                <span className="flex items-center gap-1 text-[#16A34A]"><span className="text-lg">🏠</span> GOOD HOME</span>

                {/* Animated traveling food icon across the journey */}
                <motion.div
                  animate={{ x: [0, 400] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-1 left-0 text-lg drop-shadow-md z-10"
                >
                  🍱
                </motion.div>
              </div>
            </motion.div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT: ANIMATED FOOD SCENE                               */}
          {/* ======================================================== */}
          <div
            className="lg:col-span-6 relative flex items-center justify-center p-4 h-[400px] sm:h-[500px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              animate={{ 
                rotateX: mousePos.y * -15, 
                rotateY: mousePos.x * 15 
              }}
              transition={{ type: "spring", stiffness: 75, damping: 15 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Central Plate */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                className="absolute w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full shadow-warm-xl border-4 border-[#F5EFEB] flex items-center justify-center z-10"
                style={{ transform: 'translateZ(20px)' }}
              >
                <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full border-2 border-dashed border-[#EADFCF]" />
                <div className="absolute text-5xl sm:text-7xl drop-shadow-md">🍲</div>
                <motion.div 
                  animate={{ opacity: [0, 1, 0], y: [-10, -40] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-4 w-4 h-12 border-l-2 border-r-2 border-white/60 blur-[1px] rounded-full"
                />
              </motion.div>

              {/* Orbiting Food Elements */}
              {/* Pizza */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-full flex items-center justify-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  animate={{ rotate: -360, y: [0, -10, 0] }}
                  transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 3, repeat: Infinity } }}
                  className="absolute -top-4 left-1/4 text-5xl drop-shadow-lg cursor-pointer"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  🍕
                </motion.div>
              </motion.div>

              {/* Bread */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-full flex items-center justify-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  animate={{ rotate: 360, y: [0, 15, 0] }}
                  transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, y: { duration: 4, repeat: Infinity } }}
                  className="absolute bottom-4 right-1/4 text-5xl drop-shadow-lg cursor-pointer"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  🥖
                </motion.div>
              </motion.div>

              {/* Apple */}
              <motion.div
                animate={{ y: [-20, 20, -20], x: [-10, 10, -10], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-8 text-5xl drop-shadow-lg cursor-pointer"
                style={{ transform: 'translateZ(50px)' }}
              >
                🍎
              </motion.div>

              {/* Carrot */}
              <motion.div
                animate={{ y: [15, -15, 15], x: [10, -10, 10], rotate: [45, 25, 45] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 left-4 text-5xl drop-shadow-lg cursor-pointer"
                style={{ transform: 'translateZ(60px)' }}
              >
                🥕
              </motion.div>

              {/* Salad */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-full flex items-center justify-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  animate={{ rotate: -360, scale: [1, 1.05, 1] }}
                  transition={{ rotate: { duration: 30, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
                  className="absolute top-1/2 -left-8 text-6xl drop-shadow-lg cursor-pointer"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  🥗
                </motion.div>
              </motion.div>

              {/* Rice Bowl */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-full flex items-center justify-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  animate={{ rotate: 360, y: [0, -10, 0] }}
                  transition={{ rotate: { duration: 22, repeat: Infinity, ease: "linear" }, y: { duration: 3.5, repeat: Infinity } }}
                  className="absolute top-1/2 -right-8 text-6xl drop-shadow-lg cursor-pointer"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  🍚
                </motion.div>
              </motion.div>
              
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
