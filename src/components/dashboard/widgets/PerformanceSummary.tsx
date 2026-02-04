import { useMemo } from "react";
import { Flame, Star, AlertTriangle, TrendingUp } from "lucide-react";
import { useChecklistAnalytics, calculateAnalytics } from "@/hooks/useChecklistEntries";

export function PerformanceSummary() {
  const { data: entries = [], isLoading } = useChecklistAnalytics(1);
  const analytics = useMemo(() => calculateAnalytics(entries), [entries]);

  // Find best and worst performing tasks
  const taskPerformance = useMemo(() => {
    const tasks = [
      { id: "prayer", label: "Prayer", ...analytics.taskBreakdown.prayer },
      { id: "bible", label: "Bible", ...analytics.taskBreakdown.bible },
      { id: "trading", label: "Trading", ...analytics.taskBreakdown.trading },
      { id: "gym", label: "GYM", ...analytics.taskBreakdown.gym },
    ];

    const sorted = [...tasks].sort((a, b) => b.percentage - a.percentage);
    return {
      best: sorted[0],
      worst: sorted[sorted.length - 1],
    };
  }, [analytics.taskBreakdown]);

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const hasData = entries.length > 0;

  return (
    <div className="p-3 sm:p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">This Week</h3>
      </div>

      {/* Headline Stat */}
      <div className="space-y-1 mb-3">
        <p className="text-2xl font-semibold">
          {hasData ? `${analytics.thisWeekCompletion}%` : "—"}
        </p>
        <p className="text-xs text-muted-foreground">
          of daily priorities completed
        </p>
      </div>

      <div className="h-px bg-border/50 mb-3" />

      {/* Streak */}
      <div className="flex items-center gap-2 mb-2">
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-sm">
          {analytics.currentStreak > 0 
            ? `${analytics.currentStreak} day streak` 
            : "Start your streak today"}
        </span>
      </div>

      {/* Best Task */}
      {hasData && taskPerformance.best.completed > 0 && (
        <div className="flex items-start gap-2 mb-2">
          <Star className="w-4 h-4 text-amber-500 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm">Most consistent: {taskPerformance.best.label}</p>
            <p className="text-[10px] text-muted-foreground">
              {taskPerformance.best.completed}/{taskPerformance.best.total} days ({taskPerformance.best.percentage}%)
            </p>
          </div>
        </div>
      )}

      {/* Worst Task */}
      {hasData && taskPerformance.worst.percentage < 100 && taskPerformance.worst.percentage !== taskPerformance.best.percentage && (
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm">Needs focus: {taskPerformance.worst.label}</p>
            <p className="text-[10px] text-muted-foreground">
              {taskPerformance.worst.completed}/{taskPerformance.worst.total} days ({taskPerformance.worst.percentage}%)
            </p>
          </div>
        </div>
      )}

      {/* No data state */}
      {!hasData && (
        <p className="text-sm text-muted-foreground">
          Complete your first task to see insights
        </p>
      )}
    </div>
  );
}
