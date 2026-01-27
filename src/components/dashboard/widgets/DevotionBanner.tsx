import { BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface DevotionBannerProps {
  characterName?: string;
  dayNumber?: number;
  todayScripture?: string;
  timeOfDay: "morning" | "evening";
  className?: string;
}

export function DevotionBanner({ 
  characterName = "David", 
  dayNumber = 7, 
  todayScripture = "1 Samuel 17",
  timeOfDay,
  className 
}: DevotionBannerProps) {
  const label = timeOfDay === "morning" ? "Morning Devotion" : "Evening Devotion";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
    >
      <Link 
        to="/spiritual" 
        className={`group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/80 ${className || ''}`}
      >
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground/50" />
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-medium">{characterName}</h3>
            <p className="text-xs text-muted-foreground">Character Study · Day {dayNumber}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </div>
        
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm">{todayScripture}</span>
        </div>
      </Link>
    </motion.div>
  );
}
