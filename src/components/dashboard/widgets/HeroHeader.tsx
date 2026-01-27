import { format } from "date-fns";
import { motion } from "framer-motion";

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
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center justify-between py-4"
    >
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {format(currentTime, "EEEE, MMMM d")}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{getGreeting()}</h1>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-trading/10"
        >
          <span className="text-trading text-xs">●</span>
          <span className="font-medium">7 day streak</span>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-tech/10"
        >
          <span className="font-medium">92% focus</span>
        </motion.div>
      </div>
    </motion.header>
  );
}
