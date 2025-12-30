import { BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface DevotionWidgetProps {
  characterName?: string;
  dayNumber?: number;
  todayScripture?: string;
  timeOfDay: "morning" | "evening";
}

export const DevotionWidget = ({
  characterName = "David",
  dayNumber = 7,
  todayScripture = "1 Samuel 17",
  timeOfDay,
}: DevotionWidgetProps) => {
  return (
    <Link
      to="/spiritual"
      className="block bg-card border border-border rounded-xl p-5 hover:border-foreground/20 transition-colors group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {timeOfDay === "morning" ? "Morning" : "Evening"} Devotion
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Day {dayNumber} · {characterName} Study
        </p>
        <p className="text-sm">{todayScripture}</p>
      </div>
    </Link>
  );
};
