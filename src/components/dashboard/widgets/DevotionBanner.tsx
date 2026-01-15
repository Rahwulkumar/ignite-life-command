import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Sparkles } from "lucide-react";
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link
        to="/spiritual"
        className="group relative block overflow-hidden rounded-2xl border border-border/50 hover:border-border transition-all"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-spiritual/10 via-card to-card" />
        
        {/* Floating orb */}
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-spiritual/5 blur-2xl animate-breathe" />
        
        <div className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-spiritual/15 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-spiritual" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {timeOfDay === "morning" ? "Morning" : "Evening"} Devotion
                </p>
                <p className="text-xs text-muted-foreground">Day {dayNumber} · {characterName} Study</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-spiritual/70" />
            <span className="text-lg font-semibold">{todayScripture}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
