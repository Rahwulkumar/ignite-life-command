import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChecklistAnalytics, calculateAnalytics } from "@/hooks/useChecklistEntries";
import { CompletionChart } from "./CompletionChart";
import { StreakDisplay } from "./StreakDisplay";
import { TaskBreakdown } from "./TaskBreakdown";

type TimeFilter = "week" | "month" | "all";

export function AnalyticsPanel() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");
  const { data: entries = [], isLoading } = useChecklistAnalytics(
    timeFilter === "week" ? 1 : timeFilter === "month" ? 1 : 3
  );

  const analytics = calculateAnalytics(entries);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Analytics</h3>
        </div>
        <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
          <TabsList className="h-7">
            <TabsTrigger value="week" className="text-xs px-2 h-5">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="month" className="text-xs px-2 h-5">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs px-2 h-5">
              All Time
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading analytics...
        </div>
      ) : (
        <div className="space-y-4">
          {/* Streak Display */}
          <StreakDisplay
            currentStreak={analytics.currentStreak}
            longestStreak={analytics.longestStreak}
            thisWeekCompletion={analytics.thisWeekCompletion}
            thisMonthCompletion={analytics.thisMonthCompletion}
          />

          {/* Completion Chart */}
          <CompletionChart entries={entries} timeFilter={timeFilter} />

          {/* Task Breakdown */}
          <TaskBreakdown breakdown={analytics.taskBreakdown} />
        </div>
      )}
    </div>
  );
}
