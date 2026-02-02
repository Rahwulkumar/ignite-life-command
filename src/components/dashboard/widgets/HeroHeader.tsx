import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import headerDawn from "@/assets/header-dawn.jpg";
import headerDay from "@/assets/nature-header-bg.jpg";
import headerSunset from "@/assets/header-sunset.jpg";
import headerNight from "@/assets/header-night.jpg";

interface HeroHeaderProps {
  currentTime: Date;
}

type TimeOfDay = "dawn" | "day" | "sunset" | "night";

const getTimeOfDay = (hour: number): TimeOfDay => {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "sunset";
  return "night";
};

const backgrounds: Record<TimeOfDay, string> = {
  dawn: headerDawn,
  day: headerDay,
  sunset: headerSunset,
  night: headerNight,
};

export function HeroHeader({ currentTime }: HeroHeaderProps) {
  const hour = currentTime.getHours();
  const timeOfDay = getTimeOfDay(hour);
  const currentBg = backgrounds[timeOfDay];
  
  const getGreeting = () => {
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.header 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-12 -mt-2 sm:-mt-4 px-4 sm:px-6 lg:px-8 xl:px-12 pt-4 sm:pt-6 pb-28 sm:pb-36 lg:pb-40"
    >
      {/* Animated nature background with time-based switching */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={timeOfDay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <motion.img 
              src={currentBg}
              alt=""
              className="h-full w-full object-cover object-center"
              animate={{ 
                scale: [1, 1.03, 1],
                x: [0, 5, 0],
              }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Smooth gradient fade - sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/50 z-10" />
        
        {/* Smooth gradient fade - bottom (extended and gradual) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% via-background/50 via-60% to-background z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xs sm:text-sm text-foreground/60 mb-1"
          >
            {format(currentTime, "EEEE, MMMM d")}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground drop-shadow-lg"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
          >
            {getGreeting()}
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm"
        >
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-background/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/10"
          >
            <motion.span 
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-medium text-foreground">7 day streak</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-background/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/10"
          >
            <span className="font-medium text-foreground">92% focus</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}
