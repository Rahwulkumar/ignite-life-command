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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-xl py-6 px-6"
    >
      {/* Animated nature background */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.img 
          src={natureHeaderBg}
          alt=""
          className="h-full w-full object-cover"
          animate={{ 
            scale: [1, 1.03, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm text-muted-foreground mb-1"
          >
            {format(currentTime, "EEEE, MMMM d")}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-3xl font-semibold tracking-tight text-foreground"
          >
            {getGreeting()}
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex items-center gap-4 text-sm"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50"
          >
            <span className="text-trading text-xs">●</span>
            <span className="font-medium text-foreground">7 day streak</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50"
          >
            <span className="font-medium text-foreground">92% focus</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}
