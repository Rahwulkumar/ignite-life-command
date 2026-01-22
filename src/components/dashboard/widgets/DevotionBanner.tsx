import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Sunrise, Moon, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface DevotionBannerProps {
  characterName?: string;
  dayNumber?: number;
  todayScripture?: string;
  timeOfDay: "morning" | "evening";
  delay?: number;
}

export function DevotionBanner({ 
  characterName = "David", 
  dayNumber = 7, 
  todayScripture = "1 Samuel 17",
  timeOfDay,
  delay = 0 
}: DevotionBannerProps) {
  const TimeIcon = timeOfDay === "morning" ? Sunrise : Moon;
  const timeLabel = timeOfDay === "morning" ? "Morning" : "Evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      whileHover={{ y: -3, scale: 1.01 }}
    >
      <Link 
        to="/spiritual" 
        className="group relative block overflow-hidden rounded-2xl p-6"
        style={{
          background: `linear-gradient(145deg, hsl(var(--spiritual) / 0.18), hsl(var(--spiritual) / 0.08), hsl(var(--spiritual) / 0.03))`
        }}
      >
        {/* Border */}
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{ border: `1px solid hsl(var(--spiritual) / 0.25)` }}
        />
        
        {/* Animated orbs */}
        <motion.div
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30"
          style={{ background: `hsl(var(--spiritual))` }}
        />
        
        <motion.div
          animate={{ 
            x: [0, -20, 0],
            y: [0, 30, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-20"
          style={{ background: `hsl(var(--spiritual))` }}
        />
        
        {/* Sparkle decorations */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-6 right-6"
        >
          <Sparkles className="w-5 h-5 text-spiritual/40" />
        </motion.div>
        
        <div className="relative z-10">
          {/* Time badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-spiritual/15 border border-spiritual/20 mb-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2 }}
          >
            <TimeIcon className="w-4 h-4 text-spiritual" />
            <span className="text-xs font-semibold text-spiritual">{timeLabel} Devotion</span>
          </motion.div>
          
          {/* Character and day */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.3 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, hsl(var(--spiritual) / 0.3), hsl(var(--spiritual) / 0.1))` }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Heart className="w-5 h-5 text-spiritual" />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">{characterName}</h3>
                <p className="text-xs text-muted-foreground">Character Study · Day {dayNumber}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Scripture */}
          <motion.div 
            className="flex items-center gap-3 mt-5 pt-4 border-t border-spiritual/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-spiritual/10">
              <BookOpen className="w-4 h-4 text-spiritual" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{todayScripture}</p>
              <p className="text-xs text-muted-foreground">Today's reading</p>
            </div>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <ChevronRight className="w-5 h-5 text-spiritual/60 group-hover:text-spiritual transition-colors" />
            </motion.div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
