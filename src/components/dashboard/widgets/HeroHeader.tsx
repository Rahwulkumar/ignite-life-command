import { format } from "date-fns";
import { motion } from "framer-motion";
import natureHeaderBg from "@/assets/nature-header-bg.jpg";

interface HeroHeaderProps {
  currentTime: Date;
}

export function HeroHeader({ currentTime }: HeroHeaderProps) {
  const hour = currentTime.getHours();
  
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
      className="relative overflow-visible -mx-6 -mt-4 px-6 pt-6 pb-16"
    >
      {/* Animated nature background with extended fade */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.img 
          src={natureHeaderBg}
          alt=""
          className="h-[120%] w-full object-cover object-center"
          animate={{ 
            scale: [1, 1.05, 1],
            y: [0, -5, 0],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
        />
        {/* Multi-layer gradient for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
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
