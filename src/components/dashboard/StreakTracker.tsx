import { cn } from "@/lib/utils";
import { Flame, Trophy, Target } from "lucide-react";

interface Streak {
  label: string;
  current: number;
  best: number;
  color: string;
}

const streaks: Streak[] = [
  { label: "DSA Study", current: 12, best: 21, color: "text-tech" },
  { label: "Bible Time", current: 45, best: 45, color: "text-spiritual" },
  { label: "Guitar Practice", current: 3, best: 14, color: "text-music" },
  { label: "Trading Journal", current: 8, best: 15, color: "text-trading" },
];

export function StreakTracker() {
  return (
    <div className="glass rounded-xl p-5 opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-trading" />
        <h3 className="font-display font-semibold text-lg">Active Streaks</h3>
      </div>

      <div className="space-y-4">
        {streaks.map((streak, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Flame className={cn("w-6 h-6", streak.color)} />
                {streak.current === streak.best && streak.best > 10 && (
                  <Trophy className="absolute -top-1 -right-1 w-3 h-3 text-work" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{streak.label}</p>
                <p className="text-xs text-muted-foreground">Best: {streak.best} days</p>
              </div>
            </div>
            <div className="text-right">
              <span className={cn("text-2xl font-display font-bold", streak.color)}>
                {streak.current}
              </span>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="w-4 h-4" />
            <span>Daily Goals</span>
          </div>
          <span className="font-display font-semibold text-foreground">5/7 completed</span>
        </div>
      </div>
    </div>
  );
}
