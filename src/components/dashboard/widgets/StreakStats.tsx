import { Flame, Trophy, Target } from "lucide-react";
import { motion } from "framer-motion";
import { CircularProgress } from "@/components/ui/circular-progress";
import { useChecklistAnalytics, calculateAnalytics } from "@/hooks/useChecklistEntries";

export function StreakStats() {
  const { data: entries = [] } = useChecklistAnalytics(3);
  const analytics = calculateAnalytics(entries);

  return (
    <div className="p-3 sm:p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Flame className="w-4 h-4 text-orange-500" />
        </motion.div>
        <h3 className="text-sm font-medium">Streak & Progress</h3>
      </div>

      {/* Streak Numbers */}
      <div className="flex items-center justify-around mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-2xl font-bold text-orange-500">
              {analytics.currentStreak}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Current</p>
        </div>
        <div className="w-px h-8 bg-border/50" />
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-2xl font-bold text-amber-500">
              {analytics.longestStreak}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Longest</p>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="grid grid-cols-2 gap-2 flex-1 items-center">
        <CircularProgress
          value={analytics.thisWeekCompletion}
          label="This Week"
          color="text-emerald-500"
          size={52}
        />
        <CircularProgress
          value={analytics.thisMonthCompletion}
          label="This Month"
          color="text-sky-500"
          size={52}
        />
      </div>

      {/* Task Focus Indicator */}
      <div className="pt-3 mt-auto border-t border-border/30">
        <div className="flex items-center gap-2">
          <Target className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            Most consistent:{" "}
            <span className="text-foreground font-medium">
              {getBestTask(analytics.taskBreakdown)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function getBestTask(breakdown: Record<string, { percentage: number }>) {
  let best = { name: "Prayer", percentage: 0 };
  Object.entries(breakdown).forEach(([name, data]) => {
    if (data.percentage > best.percentage) {
      best = { name: name.charAt(0).toUpperCase() + name.slice(1), percentage: data.percentage };
    }
  });
  return best.name;
}
