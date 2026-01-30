import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek, getDay } from "date-fns";

interface ChecklistEntry {
  id: string;
  task_id: string;
  entry_date: string;
  is_completed: boolean;
}

interface CompletionChartProps {
  entries: ChecklistEntry[];
  timeFilter: "week" | "month" | "all";
}

export function CompletionChart({ entries, timeFilter }: CompletionChartProps) {
  const chartData = useMemo(() => {
    const today = new Date();
    let days: Date[];

    if (timeFilter === "week") {
      const start = startOfWeek(today);
      const end = endOfWeek(today);
      days = eachDayOfInterval({ start, end });
    } else if (timeFilter === "month") {
      days = eachDayOfInterval({
        start: subDays(today, 29),
        end: today,
      });
    } else {
      days = eachDayOfInterval({
        start: subDays(today, 89),
        end: today,
      });
    }

    // Group entries by date
    const byDate = entries.reduce((acc, entry) => {
      if (!acc[entry.entry_date]) {
        acc[entry.entry_date] = new Set<string>();
      }
      acc[entry.entry_date].add(entry.task_id);
      return acc;
    }, {} as Record<string, Set<string>>);

    return days.map((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      const completed = byDate[dateKey]?.size || 0;
      const dayOfWeek = getDay(day);
      // Mon-Fri have 4 tasks (prayer, bible, trading, gym), Sat-Sun have 3 (prayer, bible, trading)
      const expected = [1, 2, 3, 4, 5].includes(dayOfWeek) ? 4 : 3;
      const percentage = Math.round((completed / expected) * 100);

      return {
        date: day,
        label: timeFilter === "week" 
          ? format(day, "EEE") 
          : timeFilter === "month"
          ? format(day, "d")
          : format(day, "M/d"),
        completed,
        expected,
        percentage: Math.min(percentage, 100),
      };
    });
  }, [entries, timeFilter]);

  const getBarColor = (percentage: number) => {
    if (percentage === 100) return "hsl(var(--chart-2))";
    if (percentage >= 50) return "hsl(var(--chart-4))";
    if (percentage > 0) return "hsl(var(--chart-5))";
    return "hsl(var(--muted))";
  };

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground">Completion Rate</h4>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                      <p className="text-xs font-medium">
                        {format(data.date, "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {data.completed}/{data.expected} tasks ({data.percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
