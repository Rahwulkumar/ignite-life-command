import { BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface DevotionBannerProps {
  characterName?: string;
  dayNumber?: number;
  todayScripture?: string;
  timeOfDay: "morning" | "evening";
}

export function DevotionBanner({ 
  characterName = "David", 
  dayNumber = 7, 
  todayScripture = "1 Samuel 17",
  timeOfDay 
}: DevotionBannerProps) {
  const label = timeOfDay === "morning" ? "Morning Devotion" : "Evening Devotion";

  return (
    <Link 
      to="/spiritual" 
      className="group block rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
    >
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium">{characterName}</h3>
          <p className="text-xs text-muted-foreground">Day {dayNumber}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
      </div>
      
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-sm">{todayScripture}</span>
      </div>
    </Link>
  );
}
