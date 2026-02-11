import { cn } from "@/lib/utils";
import { Flame, Trophy, Target } from "lucide-react";
import { Streak, DomainType } from "@/types/domain";

interface StreakTrackerProps {
  streaks: Streak[];
  dailyGoalsCompleted: number;
  totalDailyGoals: number;
}

const domainColorMap: Record<DomainType, string> = {
  tech: "text-tech",
  spiritual: "text-spiritual",
  music: "text-music",
  trading: "text-trading",
  finance: "text-finance",
  content: "text-content",
  work: "text-work",
};

export function StreakTracker({ streaks, dailyGoalsCompleted, totalDailyGoals }: StreakTrackerProps) {
  return (
    <div className="glass rounded-xl p-5 opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-trading" />
        <h3 className="font-display font-semibold text-lg">Active Streaks</h3>
      </div>

      <div className="space-y-4">
        {streaks.map((streak) => {
          const colorClass = domainColorMap[streak.domain] || "text-primary";
          const best = 30; // Placeholder until we have history data

          return (
            <div key={streak.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Flame className={cn("w-6 h-6", colorClass)} />
                  {streak.count >= best && streak.count > 10 && (
                    <Trophy className="absolute -top-1 -right-1 w-3 h-3 text-work" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{streak.title}</p>
                  <p className="text-xs text-muted-foreground">Current streak</p>
                </div>
              </div>
              <div className="text-right">
                <span className={cn("text-2xl font-display font-bold", colorClass)}>
                  {streak.count}
                </span>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="w-4 h-4" />
            <span>Daily Goals</span>
          </div>
          <span className="font-display font-semibold text-foreground">
            {dailyGoalsCompleted}/{totalDailyGoals} completed
          </span>
        </div>
      </div>
    </div>
  );
}
