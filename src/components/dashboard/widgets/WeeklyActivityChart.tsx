import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  type TooltipProps,
} from "recharts";
import { cn } from "@/lib/utils";
import { DOMAIN_COLORS, DomainId } from "@/lib/domain-colors";
import { useChecklistAnalytics } from "@/hooks/useChecklistEntries";
import {
  addWeeks,
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  getDay,
  isToday as isTodayFn,
} from "date-fns";
import { STANDARD_TASKS } from "@/lib/constants";

interface DayActivity {
  day: string;
  tasks: number;
  total: number;
  hours: number;
  points: number;
  completed: boolean;
  completionRate: number;
  isToday: boolean;
  isFuture: boolean;
  domainBreakdown: Record<string, number>;
}

export function WeeklyActivityChart() {
  const [weekOffset, setWeekOffset] = useState(0);
  const { data: analyticsData = [], isLoading } = useChecklistAnalytics(3);
  const weekRange = useMemo(() => {
    const referenceDate = addWeeks(new Date(), weekOffset);

    return {
      weekStart: startOfWeek(referenceDate),
      weekEnd: endOfWeek(referenceDate),
    };
  }, [weekOffset]);

  // Calculate week data from analytics
  const weekData = useMemo(() => {
    const daysOfWeek = eachDayOfInterval({
      start: weekRange.weekStart,
      end: weekRange.weekEnd,
    });

    return daysOfWeek.map((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      const dayOfWeek = getDay(date);
      const isFuture = weekOffset === 0 && date > new Date();

      // Get checklist entries for this day and only count completed work.
      const dayEntries = analyticsData.filter(
        (entry) => entry.entry_date === dateKey,
      );
      const completedTasks = dayEntries.filter((entry) => entry.is_completed);

      // Calculate expected tasks for this day
      const expectedTasks = STANDARD_TASKS.filter((task) => {
        if (task.frequency === "daily") return true;
        if (task.frequency === "weekly" && task.daysOfWeek) {
          return task.daysOfWeek.includes(dayOfWeek);
        }
        return false;
      }).length;

      // Calculate totals
      const completedCount = completedTasks.length;
      const totalHours = completedTasks.reduce((sum, task) => {
        return sum + (task.duration_seconds || 0) / 3600;
      }, 0);

      // Domain breakdown
      const domainBreakdown: Record<string, number> = {};
      completedTasks.forEach((task) => {
        const taskId = task.task_id;
        const domain = taskId.split("_")[0]; // Extract domain from task_id (e.g., "tech_dsa" -> "tech")
        domainBreakdown[domain] = (domainBreakdown[domain] || 0) + 1;
      });

      const completionRate =
        !isFuture && expectedTasks > 0
          ? Math.round((completedCount / expectedTasks) * 100)
          : 0;

      return {
        day: format(date, "EEE"),
        tasks: completedCount,
        total: expectedTasks,
        hours: Math.round(totalHours * 10) / 10,
        points: 0, // Points will be added later when the column exists
        completed: !isFuture && completedCount >= expectedTasks,
        completionRate,
        isToday: isTodayFn(date),
        isFuture,
        domainBreakdown,
      };
    });
  }, [analyticsData, weekRange]);

  // Get bar color based on completion rate
  const getBarColor = (rate: number, isToday: boolean, isFuture: boolean) => {
    if (isFuture) return "hsl(var(--muted))";
    if (isToday) return "hsl(var(--foreground))";
    if (rate >= 71) return "hsl(var(--finance))";
    if (rate >= 41) return "hsl(var(--trading))";
    return "hsl(var(--destructive) / 0.5)";
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload as DayActivity;

    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg z-50">
        <p className="font-medium text-sm mb-2">{data.day}</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Tasks:</span>
            <span className="font-medium">
              {data.tasks}/{data.total}
            </span>
          </div>
          {data.isFuture && (
            <p className="text-[10px] text-muted-foreground">
              Future day: no completion target yet.
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Hours:</span>
            <span className="font-medium">{data.hours}h</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Points:</span>
            <span className="font-medium">+{data.points}</span>
          </div>

          {Object.keys(data.domainBreakdown).length > 0 && (
            <>
              <div className="h-px bg-border my-1.5" />
              <p className="text-muted-foreground text-[10px] mb-1">
                By Domain:
              </p>
              {Object.entries(data.domainBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([domain, count]) => (
                  <div key={domain} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] capitalize",
                        DOMAIN_COLORS[domain as DomainId]?.text ||
                          "text-muted-foreground",
                      )}
                    >
                      {domain}:
                    </span>
                    <span className="text-[10px] font-medium">{count}</span>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    );
  };

  const isCurrentWeek = weekOffset === 0;
  const weekLabel = isCurrentWeek
    ? "This Week"
    : `${format(weekRange.weekStart, "MMM d")} - ${format(weekRange.weekEnd, "MMM d")}`;

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 h-full flex flex-col">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Weekly Activity</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <span className="text-xs text-muted-foreground min-w-[80px] text-center">
            {weekLabel}
          </span>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            disabled={isCurrentWeek}
            className={cn(
              "p-1 hover:bg-muted rounded transition-colors",
              isCurrentWeek && "opacity-30 cursor-not-allowed",
            )}
            aria-label="Next week"
          >
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[140px]">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart
            data={weekData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="completionRate" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {weekData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.completionRate, entry.isToday, entry.isFuture)}
                  className={entry.isToday ? "animate-pulse" : ""}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
