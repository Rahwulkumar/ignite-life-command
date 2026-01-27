import { BookOpen, ChevronRight, Sunrise, Moon, Heart } from "lucide-react";
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
  timeOfDay 
}: DevotionBannerProps) {
  const TimeIcon = timeOfDay === "morning" ? Sunrise : Moon;
  const timeLabel = timeOfDay === "morning" ? "Morning" : "Evening";

  return (
    <Link 
      to="/spiritual" 
      className="group block rounded-xl p-5 border transition-colors"
      style={{
        background: `hsl(var(--spiritual) / 0.05)`,
        borderColor: `hsl(var(--spiritual) / 0.15)`
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <TimeIcon className="w-4 h-4 text-spiritual" />
        <span className="text-xs font-medium text-spiritual">{timeLabel} Devotion</span>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `hsl(var(--spiritual) / 0.1)` }}
        >
          <Heart className="w-5 h-5 text-spiritual" />
        </div>
        <div>
          <h3 className="font-medium">{characterName}</h3>
          <p className="text-xs text-muted-foreground">Character Study · Day {dayNumber}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: `hsl(var(--spiritual) / 0.1)` }}>
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `hsl(var(--spiritual) / 0.1)` }}
        >
          <BookOpen className="w-4 h-4 text-spiritual" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{todayScripture}</p>
          <p className="text-xs text-muted-foreground">Today's reading</p>
        </div>
        <ChevronRight className="w-4 h-4 text-spiritual/60 group-hover:text-spiritual transition-colors" />
      </div>
    </Link>
  );
}
