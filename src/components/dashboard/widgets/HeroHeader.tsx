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
      className="relative overflow-hidden -mx-6 -mt-4 px-6 pt-6 pb-32"
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
              className="h-full w-full object-cover object-top"
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
        
        {/* Gradient overlays for smooth fade to background */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-background z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex items-center justify-between">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm text-foreground/60 mb-1"
          >
            {format(currentTime, "EEEE, MMMM d")}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl font-semibold tracking-tight text-foreground"
          >
            {getGreeting()}
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center gap-3 text-sm"
        >
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/10"
          >
            <motion.span 
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-medium text-foreground">7 day streak</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/70 backdrop-blur-md border border-white/10 shadow-lg shadow-black/10"
          >
            <span className="font-medium text-foreground">92% focus</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}
